-- ============================================
-- HUBLAB API DATABASE SCHEMA
-- Supabase tables for API keys and usage tracking
-- ============================================

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rate_limit JSONB NOT NULL,

  -- Indexes for performance
  CONSTRAINT valid_key_format CHECK (key ~ '^hublab_sk_[a-f0-9]{64}$')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- Create api_usage table for rate limiting
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'projectsPerHour',
    'exportsPerDay',
    'deploysPerDay',
    'requestsPerMinute'
  )),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_api_usage_key_id ON api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_action_type ON api_usage(action_type);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_rate_limit ON api_usage(api_key_id, action_type, created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only see their own API keys
CREATE POLICY "Users can view own API keys"
  ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own API keys
CREATE POLICY "Users can create own API keys"
  ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own API keys
CREATE POLICY "Users can update own API keys"
  ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own API keys
CREATE POLICY "Users can delete own API keys"
  ON api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on api_usage
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Users can view usage for their API keys
CREATE POLICY "Users can view own API usage"
  ON api_usage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api_keys
      WHERE api_keys.id = api_usage.api_key_id
      AND api_keys.user_id = auth.uid()
    )
  );

-- Service role can insert usage records
CREATE POLICY "Service can insert usage records"
  ON api_usage
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- CLEANUP FUNCTION
-- ============================================

-- Function to clean up old usage records (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_api_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM api_usage
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- Create a scheduled job to run cleanup weekly (requires pg_cron extension)
-- SELECT cron.schedule(
--   'cleanup-api-usage',
--   '0 2 * * 0', -- Every Sunday at 2 AM
--   $$SELECT cleanup_old_api_usage()$$
-- );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get API key statistics
CREATE OR REPLACE FUNCTION get_api_key_stats(key_id UUID)
RETURNS TABLE (
  total_requests BIGINT,
  requests_last_hour BIGINT,
  requests_last_day BIGINT,
  last_request_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_requests,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour')::BIGINT as requests_last_hour,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 day')::BIGINT as requests_last_day,
    MAX(created_at) as last_request_at
  FROM api_usage
  WHERE api_key_id = key_id;
END;
$$;

-- Function to check if user has reached max API keys
CREATE OR REPLACE FUNCTION user_can_create_api_key(uid UUID, max_keys INTEGER DEFAULT 10)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO key_count
  FROM api_keys
  WHERE user_id = uid AND is_active = true;

  RETURN key_count < max_keys;
END;
$$;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default rate limits for reference
COMMENT ON TABLE api_keys IS 'API keys for HubLab API access with tiered rate limits';
COMMENT ON COLUMN api_keys.rate_limit IS 'JSON object with rate limits: {"projectsPerHour": 10, "exportsPerDay": 50, "deploysPerDay": 5, "requestsPerMinute": 30}';

-- ============================================
-- GRANTS
-- ============================================

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON api_keys TO authenticated;
GRANT SELECT, INSERT ON api_usage TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_api_usage() TO authenticated;
GRANT EXECUTE ON FUNCTION get_api_key_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION user_can_create_api_key(UUID, INTEGER) TO authenticated;

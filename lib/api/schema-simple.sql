-- ============================================
-- HUBLAB API DATABASE SCHEMA (SIMPLIFIED)
-- Simple version for quick setup without auth
-- ============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS api_usage CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;

-- Create api_keys table (simplified - no auth.users dependency)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'API Key',
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes
CREATE INDEX idx_api_keys_key ON api_keys(key) WHERE is_active = true;
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- Create api_usage table for rate limiting
CREATE TABLE api_usage (
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

-- Create indexes for rate limiting
CREATE INDEX idx_api_usage_key_id ON api_usage(api_key_id);
CREATE INDEX idx_api_usage_action_type ON api_usage(action_type);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at);
CREATE INDEX idx_api_usage_rate_limit ON api_usage(api_key_id, action_type, created_at);

-- ============================================
-- HELPER FUNCTION: Generate API Key
-- ============================================

CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'hublab_sk_' || encode(gen_random_bytes(32), 'hex');
END;
$$;

-- ============================================
-- CREATE TEST API KEY
-- ============================================

-- Create a test API key you can use immediately
INSERT INTO api_keys (user_id, key, name, tier)
VALUES (
  'test-user-' || gen_random_uuid()::text,
  generate_api_key(),
  'Test API Key',
  'free'
)
RETURNING
  key as "🔑 YOUR_API_KEY (copy this!)",
  user_id as "User ID",
  tier as "Tier",
  created_at as "Created At";

-- ============================================
-- VERIFICATION
-- ============================================

-- Check that tables were created
SELECT
  'api_keys' as table_name,
  COUNT(*) as row_count
FROM api_keys
UNION ALL
SELECT
  'api_usage' as table_name,
  COUNT(*) as row_count
FROM api_usage;

-- Show all API keys
SELECT
  key as "API Key",
  name as "Name",
  tier as "Tier",
  user_id as "User ID",
  created_at as "Created At",
  is_active as "Active"
FROM api_keys
ORDER BY created_at DESC;

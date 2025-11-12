-- ============================================
-- HUBLAB API - PRODUCTION SETUP
-- Execute this in Supabase SQL Editor
-- ============================================

-- Step 1: Create projects table
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL CHECK (template IN ('blank', 'dashboard', 'landing', 'ecommerce', 'admin', 'blog')),
  theme JSONB NOT NULL,
  capsules JSONB DEFAULT '[]'::jsonb,
  integrations JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'building', 'ready', 'deployed', 'error')),
  preview_url TEXT,
  deploy_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Create updated_at trigger for projects
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 2: Ensure your API key has rate_limit column
-- ============================================
-- Check if the column exists and add if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'api_keys'
    AND column_name = 'rate_limit'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN rate_limit JSONB;
  END IF;
END $$;

-- Step 3: Update your existing API key with rate limits
-- ============================================
UPDATE api_keys
SET rate_limit = '{
  "projectsPerHour": 10,
  "exportsPerDay": 5,
  "deploysPerDay": 2,
  "requestsPerMinute": 60
}'::jsonb
WHERE key = 'hublab_sk_fa05a955550a91f89deeb5d549fb384d5c9a5ef9f209dc21c882780c3332392f';

-- Step 4: Verification - Show all tables
-- ============================================
SELECT
  'api_keys' as table_name,
  COUNT(*) as row_count
FROM api_keys
UNION ALL
SELECT
  'api_usage' as table_name,
  COUNT(*) as row_count
FROM api_usage
UNION ALL
SELECT
  'projects' as table_name,
  COUNT(*) as row_count
FROM projects;

-- Step 5: Show your API key details
-- ============================================
SELECT
  key as "🔑 API Key",
  name as "Name",
  tier as "Tier",
  rate_limit as "Rate Limits",
  is_active as "Active",
  created_at as "Created"
FROM api_keys
WHERE key = 'hublab_sk_fa05a955550a91f89deeb5d549fb384d5c9a5ef9f209dc21c882780c3332392f';

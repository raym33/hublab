-- ============================================================================
-- HubLab Ambient Agent CRM - Database Schema
-- Version: 1.0.0
-- Date: October 2025
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE 1: crm_connections
-- Stores OAuth tokens and CRM configuration per user
-- ============================================================================

CREATE TABLE crm_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crm_type TEXT NOT NULL CHECK (crm_type IN ('hubspot', 'salesforce', 'pipedrive', 'zoho')),
  oauth_token TEXT NOT NULL,  -- Encrypted in application layer
  refresh_token TEXT,
  instance_url TEXT,  -- For Salesforce multi-tenant
  field_mappings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one active connection per CRM type per user
  UNIQUE(user_id, crm_type)
);

-- Indexes for crm_connections
CREATE INDEX idx_crm_connections_user_id ON crm_connections(user_id);
CREATE INDEX idx_crm_connections_is_active ON crm_connections(is_active);

-- Updated_at trigger for crm_connections
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_crm_connections_updated_at
  BEFORE UPDATE ON crm_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 2: events
-- Event queue with deduplication
-- ============================================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT UNIQUE NOT NULL,  -- For idempotency (external ID)
  event_type TEXT NOT NULL CHECK (event_type IN ('email', 'meeting', 'slack', 'call')),
  source TEXT NOT NULL,  -- 'gmail', 'google_calendar', 'slack', 'zoom'
  raw_data JSONB NOT NULL,
  normalized_data JSONB,
  fingerprint TEXT NOT NULL,  -- SHA256 hash for dedupe
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for events
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_event_id ON events(event_id);
CREATE INDEX idx_events_fingerprint ON events(fingerprint);
CREATE INDEX idx_events_processed ON events(processed);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_user_processed ON events(user_id, processed);

-- ============================================================================
-- TABLE 3: crm_actions
-- Proposed and executed CRM updates
-- ============================================================================

CREATE TABLE crm_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  crm_connection_id UUID REFERENCES crm_connections(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,  -- 'upsert_contact', 'update_deal', 'create_deal', 'log_activity', 'create_task'
  resource_type TEXT,  -- 'contact', 'company', 'deal', 'activity', 'task'
  resource_id TEXT,  -- ID in external CRM
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'executed', 'failed')),
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  justification TEXT,
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for crm_actions
CREATE INDEX idx_crm_actions_user_id ON crm_actions(user_id);
CREATE INDEX idx_crm_actions_event_id ON crm_actions(event_id);
CREATE INDEX idx_crm_actions_status ON crm_actions(status);
CREATE INDEX idx_crm_actions_requires_approval ON crm_actions(requires_approval);
CREATE INDEX idx_crm_actions_created_at ON crm_actions(created_at DESC);
CREATE INDEX idx_crm_actions_user_status ON crm_actions(user_id, status);

-- ============================================================================
-- TABLE 4: audit_logs
-- Immutable audit trail for all CRM changes
-- ============================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_id UUID REFERENCES crm_actions(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  crm_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  changes JSONB NOT NULL,  -- { before: {...}, after: {...} }
  justification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_id ON audit_logs(action_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_crm_type ON audit_logs(crm_type);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);

-- ============================================================================
-- TABLE 5: capsule_configs
-- Per-user configuration for capsules
-- ============================================================================

CREATE TABLE capsule_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  capsule_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, capsule_name)
);

-- Indexes for capsule_configs
CREATE INDEX idx_capsule_configs_user_id ON capsule_configs(user_id);
CREATE INDEX idx_capsule_configs_is_active ON capsule_configs(is_active);

-- Updated_at trigger for capsule_configs
CREATE TRIGGER update_capsule_configs_updated_at
  BEFORE UPDATE ON capsule_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE crm_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE capsule_configs ENABLE ROW LEVEL SECURITY;

-- Policies for crm_connections
CREATE POLICY "Users can view their own CRM connections"
  ON crm_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CRM connections"
  ON crm_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CRM connections"
  ON crm_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CRM connections"
  ON crm_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for events
CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for crm_actions
CREATE POLICY "Users can view their own CRM actions"
  ON crm_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CRM actions"
  ON crm_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CRM actions"
  ON crm_actions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for audit_logs
CREATE POLICY "Users can view their own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Audit logs are immutable (no UPDATE or DELETE)

-- Policies for capsule_configs
CREATE POLICY "Users can view their own capsule configs"
  ON capsule_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own capsule configs"
  ON capsule_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own capsule configs"
  ON capsule_configs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own capsule configs"
  ON capsule_configs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user has access to CRM
CREATE OR REPLACE FUNCTION has_crm_connection(
  p_user_id UUID,
  p_crm_type TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM crm_connections
    WHERE user_id = p_user_id
    AND crm_type = p_crm_type
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get active CRM connection
CREATE OR REPLACE FUNCTION get_active_crm_connection(
  p_user_id UUID,
  p_crm_type TEXT
) RETURNS crm_connections AS $$
  SELECT * FROM crm_connections
  WHERE user_id = p_user_id
  AND crm_type = p_crm_type
  AND is_active = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to create audit log automatically
CREATE OR REPLACE FUNCTION create_audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create audit log when action is executed
  IF NEW.status = 'executed' AND OLD.status != 'executed' THEN
    INSERT INTO audit_logs (
      user_id,
      action_id,
      event_id,
      crm_type,
      resource_type,
      resource_id,
      changes,
      justification
    )
    SELECT
      NEW.user_id,
      NEW.id,
      NEW.event_id,
      cc.crm_type,
      NEW.resource_type,
      NEW.resource_id,
      jsonb_build_object(
        'before', '{}',
        'after', NEW.payload
      ),
      NEW.justification
    FROM crm_connections cc
    WHERE cc.id = NEW.crm_connection_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create audit logs
CREATE TRIGGER auto_create_audit_log
  AFTER UPDATE ON crm_actions
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log_trigger();

-- ============================================================================
-- STATS VIEW
-- Useful for dashboard metrics
-- ============================================================================

CREATE OR REPLACE VIEW crm_stats AS
SELECT
  user_id,
  COUNT(DISTINCT CASE WHEN processed = false THEN id END) as pending_events,
  COUNT(DISTINCT CASE WHEN processed = true THEN id END) as processed_events,
  COUNT(DISTINCT id) as total_events
FROM events
GROUP BY user_id;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE crm_connections IS 'Stores OAuth tokens and configuration for external CRM connections';
COMMENT ON TABLE events IS 'Event queue from watchers (Gmail, Calendar, Slack) with deduplication';
COMMENT ON TABLE crm_actions IS 'Proposed and executed CRM updates with approval workflow';
COMMENT ON TABLE audit_logs IS 'Immutable audit trail for compliance and rollback capability';
COMMENT ON TABLE capsule_configs IS 'Per-user configuration for modular capsules';

COMMENT ON COLUMN events.fingerprint IS 'SHA256 hash for deduplication';
COMMENT ON COLUMN crm_actions.confidence IS 'AI confidence score (0-1) for proposed action';
COMMENT ON COLUMN crm_actions.requires_approval IS 'Whether action needs human approval before execution';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

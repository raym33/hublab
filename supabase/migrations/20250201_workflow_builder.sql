-- ============================================
-- WORKFLOW BUILDER CAPSULE - Database Schema
-- ============================================
-- Inspired by Vercel's workflow template structure
-- Tables: workflows, workflow_executions, workflow_execution_logs

-- ============================================
-- WORKFLOWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Workflow definition (nodes and connections)
  nodes JSONB NOT NULL DEFAULT '[]',
  connections JSONB NOT NULL DEFAULT '[]',

  -- Metadata
  platform VARCHAR(50) NOT NULL DEFAULT 'web',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',

  -- Trigger configuration (for automated workflows)
  trigger_type VARCHAR(50) DEFAULT 'manual', -- manual, schedule, webhook, event
  trigger_config JSONB DEFAULT '{}',

  -- Runtime settings
  timeout_ms INTEGER DEFAULT 30000, -- 30 seconds default
  retry_count INTEGER DEFAULT 0,
  retry_delay_ms INTEGER DEFAULT 1000,

  -- Stats
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for workflows
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_is_active ON public.workflows(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_workflows_is_public ON public.workflows(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_workflows_is_template ON public.workflows(is_template) WHERE is_template = true;
CREATE INDEX IF NOT EXISTS idx_workflows_trigger_type ON public.workflows(trigger_type);
CREATE INDEX IF NOT EXISTS idx_workflows_category ON public.workflows(category);
CREATE INDEX IF NOT EXISTS idx_workflows_tags ON public.workflows USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_workflows_created_at ON public.workflows(created_at DESC);

-- ============================================
-- WORKFLOW EXECUTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workflow_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Execution status
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, running, completed, failed, cancelled, timeout

  -- Input/Output
  input_data JSONB DEFAULT '{}',
  output_data JSONB,

  -- Execution details
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,

  -- Error handling
  error_message TEXT,
  error_node_id VARCHAR(255),
  error_stack TEXT,

  -- Progress tracking
  current_node_id VARCHAR(255),
  nodes_completed INTEGER DEFAULT 0,
  nodes_total INTEGER DEFAULT 0,

  -- Trigger info
  triggered_by VARCHAR(50) DEFAULT 'manual', -- manual, schedule, webhook, api
  trigger_metadata JSONB DEFAULT '{}',

  -- Version info (snapshot of workflow at execution time)
  workflow_snapshot JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for workflow_executions
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON public.workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON public.workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_created_at ON public.workflow_executions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started_at ON public.workflow_executions(started_at DESC);

-- ============================================
-- WORKFLOW EXECUTION LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workflow_execution_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id UUID NOT NULL REFERENCES public.workflow_executions(id) ON DELETE CASCADE,

  -- Node identification
  node_id VARCHAR(255) NOT NULL,
  node_type VARCHAR(100),
  node_label VARCHAR(255),
  capsule_id VARCHAR(255),

  -- Log level
  level VARCHAR(20) NOT NULL DEFAULT 'info', -- debug, info, warn, error

  -- Log content
  message TEXT NOT NULL,
  data JSONB,

  -- Node execution details
  status VARCHAR(50), -- started, completed, failed, skipped
  input_data JSONB,
  output_data JSONB,

  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,

  -- Error info (if applicable)
  error_message TEXT,
  error_stack TEXT,

  -- Sequence tracking
  sequence_number INTEGER NOT NULL DEFAULT 0,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for workflow_execution_logs
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_execution_id ON public.workflow_execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_node_id ON public.workflow_execution_logs(node_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_level ON public.workflow_execution_logs(level);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_status ON public.workflow_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_created_at ON public.workflow_execution_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_sequence ON public.workflow_execution_logs(execution_id, sequence_number);

-- ============================================
-- WORKFLOW WEBHOOKS TABLE (for webhook triggers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.workflow_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Webhook configuration
  webhook_key VARCHAR(64) NOT NULL UNIQUE, -- Secret key for webhook URL
  method VARCHAR(10) DEFAULT 'POST', -- GET, POST, PUT

  -- Security
  secret_token VARCHAR(255), -- For HMAC validation
  allowed_ips TEXT[], -- IP whitelist

  -- Settings
  is_active BOOLEAN DEFAULT true,

  -- Stats
  call_count INTEGER DEFAULT 0,
  last_called_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for workflow_webhooks
CREATE INDEX IF NOT EXISTS idx_workflow_webhooks_workflow_id ON public.workflow_webhooks(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_webhooks_webhook_key ON public.workflow_webhooks(webhook_key);
CREATE INDEX IF NOT EXISTS idx_workflow_webhooks_is_active ON public.workflow_webhooks(is_active) WHERE is_active = true;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at trigger for workflows
CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at trigger for workflow_webhooks
CREATE TRIGGER update_workflow_webhooks_updated_at
  BEFORE UPDATE ON public.workflow_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment workflow execution count
CREATE OR REPLACE FUNCTION increment_workflow_execution_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.workflows
  SET
    execution_count = execution_count + 1,
    last_executed_at = NEW.started_at
  WHERE id = NEW.workflow_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment execution count
CREATE TRIGGER trigger_increment_workflow_execution_count
  AFTER INSERT ON public.workflow_executions
  FOR EACH ROW
  EXECUTE FUNCTION increment_workflow_execution_count();

-- Function to update workflow success/failure counts
CREATE OR REPLACE FUNCTION update_workflow_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.workflows
    SET success_count = success_count + 1
    WHERE id = NEW.workflow_id;
  ELSIF NEW.status = 'failed' AND (OLD.status IS NULL OR OLD.status != 'failed') THEN
    UPDATE public.workflows
    SET failure_count = failure_count + 1
    WHERE id = NEW.workflow_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update workflow stats
CREATE TRIGGER trigger_update_workflow_stats
  AFTER UPDATE ON public.workflow_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_workflow_stats();

-- Function to get workflow execution stats
CREATE OR REPLACE FUNCTION get_workflow_stats(p_workflow_id UUID)
RETURNS TABLE (
  total_executions INTEGER,
  successful_executions INTEGER,
  failed_executions INTEGER,
  avg_duration_ms NUMERIC,
  last_execution_at TIMESTAMP WITH TIME ZONE,
  last_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_executions,
    COUNT(*) FILTER (WHERE we.status = 'completed')::INTEGER as successful_executions,
    COUNT(*) FILTER (WHERE we.status = 'failed')::INTEGER as failed_executions,
    AVG(we.duration_ms)::NUMERIC as avg_duration_ms,
    MAX(we.started_at) as last_execution_at,
    (SELECT we2.status FROM public.workflow_executions we2
     WHERE we2.workflow_id = p_workflow_id
     ORDER BY we2.created_at DESC LIMIT 1)::VARCHAR as last_status
  FROM public.workflow_executions we
  WHERE we.workflow_id = p_workflow_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_webhooks ENABLE ROW LEVEL SECURITY;

-- WORKFLOWS POLICIES
-- Users can view their own workflows
CREATE POLICY "Users can view own workflows"
  ON public.workflows
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view public workflows
CREATE POLICY "Anyone can view public workflows"
  ON public.workflows
  FOR SELECT
  USING (is_public = true);

-- Users can create their own workflows
CREATE POLICY "Users can create workflows"
  ON public.workflows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own workflows
CREATE POLICY "Users can update own workflows"
  ON public.workflows
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own workflows
CREATE POLICY "Users can delete own workflows"
  ON public.workflows
  FOR DELETE
  USING (auth.uid() = user_id);

-- WORKFLOW EXECUTIONS POLICIES
-- Users can view their own executions
CREATE POLICY "Users can view own executions"
  ON public.workflow_executions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create executions for their workflows
CREATE POLICY "Users can create executions"
  ON public.workflow_executions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own executions
CREATE POLICY "Users can update own executions"
  ON public.workflow_executions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- WORKFLOW EXECUTION LOGS POLICIES
-- Users can view logs for their executions
CREATE POLICY "Users can view own execution logs"
  ON public.workflow_execution_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workflow_executions we
      WHERE we.id = workflow_execution_logs.execution_id
      AND we.user_id = auth.uid()
    )
  );

-- System can insert logs (via service role)
CREATE POLICY "Service can insert logs"
  ON public.workflow_execution_logs
  FOR INSERT
  WITH CHECK (true);

-- WORKFLOW WEBHOOKS POLICIES
-- Users can view their own webhooks
CREATE POLICY "Users can view own webhooks"
  ON public.workflow_webhooks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create webhooks for their workflows
CREATE POLICY "Users can create webhooks"
  ON public.workflow_webhooks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own webhooks
CREATE POLICY "Users can update own webhooks"
  ON public.workflow_webhooks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own webhooks
CREATE POLICY "Users can delete own webhooks"
  ON public.workflow_webhooks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VIEWS
-- ============================================

-- View for workflows with execution stats
CREATE OR REPLACE VIEW public.workflows_with_stats AS
SELECT
  w.*,
  COALESCE(stats.recent_executions, 0) as recent_executions,
  COALESCE(stats.recent_success_rate, 0) as recent_success_rate,
  stats.avg_duration_ms,
  u.email as author_email,
  u.raw_user_meta_data->>'full_name' as author_name
FROM public.workflows w
LEFT JOIN LATERAL (
  SELECT
    COUNT(*)::INTEGER as recent_executions,
    (COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / NULLIF(COUNT(*), 0))::NUMERIC as recent_success_rate,
    AVG(duration_ms)::NUMERIC as avg_duration_ms
  FROM public.workflow_executions we
  WHERE we.workflow_id = w.id
  AND we.created_at > NOW() - INTERVAL '30 days'
) stats ON true
LEFT JOIN auth.users u ON w.user_id = u.id;

-- Grant permissions
GRANT SELECT ON public.workflows_with_stats TO authenticated;

-- ============================================
-- SAMPLE WORKFLOW TEMPLATES
-- ============================================

-- Note: These would be inserted via API or admin panel
-- INSERT INTO public.workflows (user_id, name, description, nodes, connections, is_template, category)
-- VALUES (...);

COMMENT ON TABLE public.workflows IS 'Stores workflow definitions with nodes and connections';
COMMENT ON TABLE public.workflow_executions IS 'Tracks each execution of a workflow';
COMMENT ON TABLE public.workflow_execution_logs IS 'Detailed logs for each node execution within a workflow run';
COMMENT ON TABLE public.workflow_webhooks IS 'Webhook triggers for automated workflow execution';

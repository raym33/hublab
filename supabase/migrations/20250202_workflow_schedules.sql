-- ============================================
-- WORKFLOW SCHEDULES - Cron Trigger Support
-- ============================================

-- ============================================
-- WORKFLOW SCHEDULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workflow_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Schedule configuration
  schedule_type VARCHAR(20) NOT NULL DEFAULT 'cron', -- cron, interval, once
  cron_expression VARCHAR(100), -- e.g., "0 9 * * 1-5" (9am weekdays)
  interval_seconds INTEGER, -- For interval type
  run_at TIMESTAMP WITH TIME ZONE, -- For once type

  -- Timezone
  timezone VARCHAR(50) DEFAULT 'UTC',

  -- State
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,

  -- Stats
  run_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  consecutive_failures INTEGER DEFAULT 0,

  -- Auto-disable after failures
  max_consecutive_failures INTEGER DEFAULT 5,
  auto_disabled_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  description TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workflow_schedules_workflow_id ON public.workflow_schedules(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_schedules_user_id ON public.workflow_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_schedules_is_active ON public.workflow_schedules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_workflow_schedules_next_run_at ON public.workflow_schedules(next_run_at) WHERE is_active = true;

-- Trigger for updated_at
CREATE TRIGGER update_workflow_schedules_updated_at
  BEFORE UPDATE ON public.workflow_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- WORKFLOW RETRY HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workflow_retry_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id UUID NOT NULL REFERENCES public.workflow_executions(id) ON DELETE CASCADE,

  -- Retry info
  attempt_number INTEGER NOT NULL,
  max_attempts INTEGER NOT NULL,

  -- Status
  status VARCHAR(20) NOT NULL, -- pending, running, success, failed

  -- Error info
  error_message TEXT,
  error_node_id VARCHAR(255),

  -- Timing
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workflow_retry_history_execution_id ON public.workflow_retry_history(execution_id);
CREATE INDEX IF NOT EXISTS idx_workflow_retry_history_status ON public.workflow_retry_history(status);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.workflow_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_retry_history ENABLE ROW LEVEL SECURITY;

-- Schedules policies
CREATE POLICY "Users can view own schedules"
  ON public.workflow_schedules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create schedules"
  ON public.workflow_schedules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON public.workflow_schedules
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON public.workflow_schedules
  FOR DELETE
  USING (auth.uid() = user_id);

-- Retry history policies
CREATE POLICY "Users can view own retry history"
  ON public.workflow_retry_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workflow_executions we
      WHERE we.id = workflow_retry_history.execution_id
      AND we.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can insert retry history"
  ON public.workflow_retry_history
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get schedules due for execution
CREATE OR REPLACE FUNCTION get_due_schedules(p_limit INTEGER DEFAULT 100)
RETURNS TABLE (
  schedule_id UUID,
  workflow_id UUID,
  user_id UUID,
  schedule_type VARCHAR,
  cron_expression VARCHAR,
  timezone VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ws.id as schedule_id,
    ws.workflow_id,
    ws.user_id,
    ws.schedule_type,
    ws.cron_expression,
    ws.timezone
  FROM public.workflow_schedules ws
  INNER JOIN public.workflows w ON ws.workflow_id = w.id
  WHERE ws.is_active = true
    AND w.is_active = true
    AND ws.next_run_at <= NOW()
    AND ws.auto_disabled_at IS NULL
  ORDER BY ws.next_run_at ASC
  LIMIT p_limit
  FOR UPDATE OF ws SKIP LOCKED;
END;
$$ LANGUAGE plpgsql;

-- Function to update schedule after execution
CREATE OR REPLACE FUNCTION update_schedule_after_run(
  p_schedule_id UUID,
  p_success BOOLEAN,
  p_next_run_at TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.workflow_schedules
  SET
    last_run_at = NOW(),
    next_run_at = p_next_run_at,
    run_count = run_count + 1,
    success_count = success_count + CASE WHEN p_success THEN 1 ELSE 0 END,
    failure_count = failure_count + CASE WHEN p_success THEN 0 ELSE 1 END,
    consecutive_failures = CASE WHEN p_success THEN 0 ELSE consecutive_failures + 1 END,
    auto_disabled_at = CASE
      WHEN NOT p_success AND consecutive_failures + 1 >= max_consecutive_failures
      THEN NOW()
      ELSE auto_disabled_at
    END,
    is_active = CASE
      WHEN NOT p_success AND consecutive_failures + 1 >= max_consecutive_failures
      THEN false
      ELSE is_active
    END,
    updated_at = NOW()
  WHERE id = p_schedule_id;
END;
$$ LANGUAGE plpgsql;

-- Add retry-related columns to workflow_executions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'workflow_executions'
    AND column_name = 'retry_attempt'
  ) THEN
    ALTER TABLE public.workflow_executions
    ADD COLUMN retry_attempt INTEGER DEFAULT 0,
    ADD COLUMN max_retries INTEGER DEFAULT 0,
    ADD COLUMN parent_execution_id UUID REFERENCES public.workflow_executions(id);
  END IF;
END $$;

COMMENT ON TABLE public.workflow_schedules IS 'Cron schedules for automated workflow execution';
COMMENT ON TABLE public.workflow_retry_history IS 'History of retry attempts for failed executions';

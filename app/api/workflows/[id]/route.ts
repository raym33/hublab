/**
 * Workflow API - Get, Update, Delete a specific workflow
 *
 * GET /api/workflows/[id] - Get workflow details
 * PUT /api/workflows/[id] - Update workflow
 * DELETE /api/workflows/[id] - Delete workflow
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Validation schemas
const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.literal('capsule'),
  capsuleId: z.string(),
  label: z.string(),
  x: z.number(),
  y: z.number(),
  inputs: z.record(z.unknown()).default({}),
  config: z.record(z.unknown()).optional()
})

const WorkflowConnectionSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  fromPort: z.string(),
  toPort: z.string()
})

const UpdateWorkflowSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  nodes: z.array(WorkflowNodeSchema).optional(),
  connections: z.array(WorkflowConnectionSchema).optional(),
  platform: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  trigger_type: z.enum(['manual', 'schedule', 'webhook', 'event']).optional(),
  trigger_config: z.record(z.unknown()).optional(),
  is_active: z.boolean().optional(),
  is_public: z.boolean().optional(),
  is_template: z.boolean().optional(),
  timeout_ms: z.number().min(1000).max(300000).optional(),
  retry_count: z.number().min(0).max(10).optional(),
  retry_delay_ms: z.number().min(100).max(60000).optional()
})

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/workflows/[id]
 * Get a specific workflow
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get workflow
    const { data: workflow, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Check access - user must own it or it must be public
    if (workflow.user_id !== user.id && !workflow.is_public) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get execution stats
    const { data: stats } = await supabase
      .from('workflow_executions')
      .select('status, duration_ms')
      .eq('workflow_id', id)
      .order('created_at', { ascending: false })
      .limit(100)

    const executionStats = {
      total: stats?.length || 0,
      successful: stats?.filter(s => s.status === 'completed').length || 0,
      failed: stats?.filter(s => s.status === 'failed').length || 0,
      avgDurationMs: stats?.length
        ? stats.reduce((acc, s) => acc + (s.duration_ms || 0), 0) / stats.length
        : 0
    }

    return NextResponse.json({
      ...workflow,
      stats: executionStats
    })
  } catch (error) {
    console.error('Workflow GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/workflows/[id]
 * Update a workflow
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get existing workflow
    const { data: existingWorkflow, error: fetchError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingWorkflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingWorkflow.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = UpdateWorkflowSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      )
    }

    const updates = validation.data

    // Increment version if nodes or connections changed
    let newVersion = existingWorkflow.version
    if (updates.nodes || updates.connections) {
      newVersion = existingWorkflow.version + 1
    }

    // Update workflow
    const { data: workflow, error } = await supabase
      .from('workflows')
      .update({
        ...updates,
        version: newVersion
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating workflow:', error)
      return NextResponse.json(
        { error: 'Failed to update workflow' },
        { status: 500 }
      )
    }

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Workflow PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/workflows/[id]
 * Delete a workflow
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get existing workflow
    const { data: existingWorkflow, error: fetchError } = await supabase
      .from('workflows')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingWorkflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingWorkflow.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete workflow (cascades to executions and logs)
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting workflow:', error)
      return NextResponse.json(
        { error: 'Failed to delete workflow' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Workflow DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

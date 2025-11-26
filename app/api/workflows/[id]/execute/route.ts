/**
 * Workflow Execute API - Execute a workflow
 *
 * POST /api/workflows/[id]/execute - Execute workflow
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { executeWorkflowById } from '../../../../../lib/workflow-engine'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Validation schema for execution input
const ExecuteWorkflowSchema = z.object({
  input_data: z.record(z.unknown()).default({})
})

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/workflows/[id]/execute
 * Execute a workflow
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const { data: workflow, error: fetchError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !workflow) {
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

    // Check if workflow is active
    if (!workflow.is_active) {
      return NextResponse.json(
        { error: 'Workflow is not active' },
        { status: 400 }
      )
    }

    // Check if workflow has nodes
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return NextResponse.json(
        { error: 'Workflow has no nodes to execute' },
        { status: 400 }
      )
    }

    // Parse and validate request body
    let inputData: Record<string, unknown> = {}
    try {
      const body = await request.json()
      const validation = ExecuteWorkflowSchema.safeParse(body)
      if (validation.success) {
        inputData = validation.data.input_data
      }
    } catch {
      // Empty body is ok - use empty input
    }

    // Execute workflow
    const result = await executeWorkflowById(
      id,
      user.id,
      inputData,
      'api'
    )

    // Return execution result
    if (result.success) {
      return NextResponse.json({
        success: true,
        execution_id: result.executionId,
        status: result.status,
        output: result.output,
        duration_ms: result.durationMs,
        nodes_completed: result.nodesCompleted,
        nodes_total: result.nodesTotal
      })
    } else {
      return NextResponse.json({
        success: false,
        execution_id: result.executionId,
        status: result.status,
        error: result.error,
        error_node_id: result.errorNodeId,
        duration_ms: result.durationMs,
        nodes_completed: result.nodesCompleted,
        nodes_total: result.nodesTotal
      }, { status: result.status === 'cancelled' ? 200 : 500 })
    }
  } catch (error) {
    console.error('Workflow execute error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

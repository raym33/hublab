/**
 * Execution Logs API - Get logs for an execution
 *
 * GET /api/executions/[id]/logs - Get execution logs
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/executions/[id]/logs
 * Get logs for an execution
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

    // Get execution to verify access
    const { data: execution, error: execError } = await supabase
      .from('workflow_executions')
      .select('user_id, workflow_id')
      .eq('id', id)
      .single()

    if (execError || !execution) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      )
    }

    // Check access - user must own the execution
    if (execution.user_id !== user.id) {
      // Check if user owns the workflow
      const { data: workflow } = await supabase
        .from('workflows')
        .select('user_id, is_public')
        .eq('id', execution.workflow_id)
        .single()

      if (!workflow || (workflow.user_id !== user.id && !workflow.is_public)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const nodeId = searchParams.get('node_id')
    const limit = Math.min(parseInt(searchParams.get('limit') || '500'), 1000)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('workflow_execution_logs')
      .select('*', { count: 'exact' })
      .eq('execution_id', id)

    if (level) {
      query = query.eq('level', level)
    }

    if (nodeId) {
      query = query.eq('node_id', nodeId)
    }

    query = query
      .order('sequence_number', { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: logs, error, count } = await query

    if (error) {
      console.error('Error fetching logs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch logs' },
        { status: 500 }
      )
    }

    // Get unique nodes in logs
    const nodeSet = new Set<string>()
    logs?.forEach(log => nodeSet.add(log.node_id))

    return NextResponse.json({
      logs: logs || [],
      total: count || 0,
      limit,
      offset,
      nodes: Array.from(nodeSet)
    })
  } catch (error) {
    console.error('Logs GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

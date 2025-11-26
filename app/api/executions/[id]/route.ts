/**
 * Execution API - Get execution details
 *
 * GET /api/executions/[id] - Get execution details
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
 * GET /api/executions/[id]
 * Get a specific execution
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

    // Get execution
    const { data: execution, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !execution) {
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

    // Get log summary (count by level)
    const { data: logs } = await supabase
      .from('workflow_execution_logs')
      .select('level')
      .eq('execution_id', id)

    const logSummary = {
      total: logs?.length || 0,
      debug: logs?.filter(l => l.level === 'debug').length || 0,
      info: logs?.filter(l => l.level === 'info').length || 0,
      warn: logs?.filter(l => l.level === 'warn').length || 0,
      error: logs?.filter(l => l.level === 'error').length || 0
    }

    return NextResponse.json({
      ...execution,
      log_summary: logSummary
    })
  } catch (error) {
    console.error('Execution GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

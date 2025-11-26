/**
 * Workflow Executions API - List executions for a workflow
 *
 * GET /api/workflows/[id]/executions - List workflow executions
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
 * GET /api/workflows/[id]/executions
 * List executions for a workflow
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

    // Get workflow to verify access
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('user_id, is_public')
      .eq('id', id)
      .single()

    if (workflowError || !workflow) {
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

    // Parse query params
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    // Build query
    let query = supabase
      .from('workflow_executions')
      .select('*', { count: 'exact' })
      .eq('workflow_id', id)

    if (status) {
      query = query.eq('status', status)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: executions, error, count } = await query

    if (error) {
      console.error('Error fetching executions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch executions' },
        { status: 500 }
      )
    }

    // Calculate stats
    const { data: allExecutions } = await supabase
      .from('workflow_executions')
      .select('status, duration_ms')
      .eq('workflow_id', id)

    const stats = {
      total: allExecutions?.length || 0,
      completed: allExecutions?.filter(e => e.status === 'completed').length || 0,
      failed: allExecutions?.filter(e => e.status === 'failed').length || 0,
      running: allExecutions?.filter(e => e.status === 'running').length || 0,
      avgDurationMs: allExecutions?.length
        ? allExecutions.reduce((acc, e) => acc + (e.duration_ms || 0), 0) / allExecutions.length
        : 0
    }

    return NextResponse.json({
      executions: executions || [],
      total: count || 0,
      limit,
      offset,
      stats
    })
  } catch (error) {
    console.error('Executions GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

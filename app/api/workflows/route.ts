/**
 * Workflows API - List and Create workflows
 *
 * GET /api/workflows - List user's workflows
 * POST /api/workflows - Create a new workflow
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

const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  nodes: z.array(WorkflowNodeSchema).default([]),
  connections: z.array(WorkflowConnectionSchema).default([]),
  platform: z.string().default('web'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  trigger_type: z.enum(['manual', 'schedule', 'webhook', 'event']).default('manual'),
  trigger_config: z.record(z.unknown()).default({}),
  is_public: z.boolean().default(false),
  is_template: z.boolean().default(false)
})

/**
 * GET /api/workflows
 * List workflows for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
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

    // Parse query params
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const includePublic = searchParams.get('include_public') === 'true'

    // Build query
    let query = supabase
      .from('workflows')
      .select('*', { count: 'exact' })

    if (includePublic) {
      // Get user's workflows OR public workflows
      query = query.or(`user_id.eq.${user.id},is_public.eq.true`)
    } else {
      // Only get user's workflows
      query = query.eq('user_id', user.id)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    query = query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: workflows, error, count } = await query

    if (error) {
      console.error('Error fetching workflows:', error)
      return NextResponse.json(
        { error: 'Failed to fetch workflows' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      workflows: workflows || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('Workflows GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/workflows
 * Create a new workflow
 */
export async function POST(request: NextRequest) {
  try {
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

    // Parse and validate request body
    const body = await request.json()
    const validation = CreateWorkflowSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      )
    }

    const workflowData = validation.data

    // Create workflow
    const { data: workflow, error } = await supabase
      .from('workflows')
      .insert([{
        user_id: user.id,
        name: workflowData.name,
        description: workflowData.description,
        nodes: workflowData.nodes,
        connections: workflowData.connections,
        platform: workflowData.platform,
        category: workflowData.category,
        tags: workflowData.tags,
        trigger_type: workflowData.trigger_type,
        trigger_config: workflowData.trigger_config,
        is_public: workflowData.is_public,
        is_template: workflowData.is_template
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating workflow:', error)
      return NextResponse.json(
        { error: 'Failed to create workflow' },
        { status: 500 }
      )
    }

    return NextResponse.json(workflow, { status: 201 })
  } catch (error) {
    console.error('Workflows POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

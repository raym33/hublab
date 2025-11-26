/**
 * Workflow Webhooks API - Manage webhooks for a workflow
 *
 * GET /api/workflows/[id]/webhooks - List webhooks
 * POST /api/workflows/[id]/webhooks - Create webhook
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Generate a secure webhook key
 */
function generateWebhookKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generate a secure secret token
 */
function generateSecretToken(): string {
  return crypto.randomBytes(24).toString('base64url')
}

/**
 * GET /api/workflows/[id]/webhooks
 * List webhooks for a workflow
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify workflow ownership
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('user_id')
      .eq('id', id)
      .single()

    if (workflowError || !workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    if (workflow.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get webhooks
    const { data: webhooks, error } = await supabase
      .from('workflow_webhooks')
      .select('*')
      .eq('workflow_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching webhooks:', error)
      return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 })
    }

    // Add webhook URL to each webhook
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hublab.dev'
    const webhooksWithUrl = webhooks?.map(wh => ({
      ...wh,
      webhook_url: `${baseUrl}/api/webhooks/${wh.webhook_key}`,
      // Hide full secret, show only hint
      secret_token_hint: wh.secret_token ? `${wh.secret_token.substring(0, 4)}...` : null
    }))

    return NextResponse.json({ webhooks: webhooksWithUrl || [] })

  } catch (error) {
    console.error('Webhooks GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/workflows/[id]/webhooks
 * Create a new webhook for a workflow
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify workflow ownership
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('user_id')
      .eq('id', id)
      .single()

    if (workflowError || !workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    if (workflow.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse request body
    let body: {
      method?: 'GET' | 'POST' | 'PUT'
      generate_secret?: boolean
      allowed_ips?: string[]
    } = {}

    try {
      body = await request.json()
    } catch {
      // Empty body is fine
    }

    // Generate webhook key and optional secret
    const webhookKey = generateWebhookKey()
    const secretToken = body.generate_secret ? generateSecretToken() : null

    // Create webhook
    const { data: webhook, error } = await supabase
      .from('workflow_webhooks')
      .insert([{
        workflow_id: id,
        user_id: user.id,
        webhook_key: webhookKey,
        method: body.method || 'POST',
        secret_token: secretToken,
        allowed_ips: body.allowed_ips || null,
        is_active: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating webhook:', error)
      return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
    }

    // Return webhook with URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hublab.dev'

    return NextResponse.json({
      ...webhook,
      webhook_url: `${baseUrl}/api/webhooks/${webhookKey}`,
      // Return full secret only on creation
      secret_token: secretToken
    }, { status: 201 })

  } catch (error) {
    console.error('Webhooks POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE webhook is handled by a separate route:
 * DELETE /api/workflows/[id]/webhooks/[webhookId]
 */

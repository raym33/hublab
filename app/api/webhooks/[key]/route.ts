/**
 * Webhook Trigger API - Execute workflows via webhook
 *
 * POST /api/webhooks/[key] - Trigger a workflow execution
 * GET /api/webhooks/[key] - Trigger a workflow (for simple integrations)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface RouteParams {
  params: Promise<{ key: string }>
}

/**
 * Verify HMAC signature if secret is configured
 */
function verifySignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // Compare with timing-safe comparison
  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(`sha256=${expectedSignature}`)

  if (sigBuffer.length !== expectedBuffer.length) {
    // Try without prefix
    const expectedBufferNoPrefix = Buffer.from(expectedSignature)
    if (sigBuffer.length === expectedBufferNoPrefix.length) {
      return crypto.timingSafeEqual(sigBuffer, expectedBufferNoPrefix)
    }
    return false
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer)
}

/**
 * Check if IP is allowed
 */
function isIPAllowed(clientIP: string | null, allowedIPs: string[] | null): boolean {
  if (!allowedIPs || allowedIPs.length === 0) return true
  if (!clientIP) return false

  return allowedIPs.some(allowed => {
    // Support CIDR notation in future
    return clientIP === allowed || allowed === '*'
  })
}

/**
 * Common handler for webhook execution
 */
async function handleWebhook(
  request: NextRequest,
  key: string,
  method: string
): Promise<NextResponse> {
  try {
    // Get webhook by key
    const { data: webhook, error: webhookError } = await supabase
      .from('workflow_webhooks')
      .select('*, workflows(*)')
      .eq('webhook_key', key)
      .eq('is_active', true)
      .single()

    if (webhookError || !webhook) {
      return NextResponse.json(
        { error: 'Webhook not found or inactive' },
        { status: 404 }
      )
    }

    // Check method
    if (webhook.method !== method && webhook.method !== 'ANY') {
      return NextResponse.json(
        { error: `Method ${method} not allowed. Expected ${webhook.method}` },
        { status: 405 }
      )
    }

    // Check IP whitelist
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip')

    if (!isIPAllowed(clientIP, webhook.allowed_ips)) {
      return NextResponse.json(
        { error: 'IP not allowed' },
        { status: 403 }
      )
    }

    // Get request body
    let inputData: Record<string, unknown> = {}
    const contentType = request.headers.get('content-type') || ''

    if (method !== 'GET') {
      try {
        if (contentType.includes('application/json')) {
          inputData = await request.json()
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const formData = await request.formData()
          formData.forEach((value, key) => {
            inputData[key] = value
          })
        } else {
          // Try to parse as JSON anyway
          const text = await request.text()
          if (text) {
            try {
              inputData = JSON.parse(text)
            } catch {
              inputData = { body: text }
            }
          }
        }
      } catch {
        // Empty body is fine
      }
    }

    // Add query params to input
    const searchParams = new URL(request.url).searchParams
    searchParams.forEach((value, key) => {
      if (!inputData[key]) {
        inputData[key] = value
      }
    })

    // Verify signature if secret is configured
    if (webhook.secret_token) {
      const signature = request.headers.get('x-hub-signature-256') ||
                        request.headers.get('x-signature') ||
                        request.headers.get('x-webhook-signature')

      const payload = JSON.stringify(inputData)

      if (!verifySignature(payload, signature, webhook.secret_token)) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // Check if workflow exists and is active
    const workflow = webhook.workflows
    if (!workflow || !workflow.is_active) {
      return NextResponse.json(
        { error: 'Associated workflow not found or inactive' },
        { status: 404 }
      )
    }

    // Create execution record
    const { data: execution, error: execError } = await supabase
      .from('workflow_executions')
      .insert([{
        workflow_id: workflow.id,
        user_id: workflow.user_id,
        status: 'pending',
        input_data: inputData,
        nodes_total: workflow.nodes?.length || 0,
        workflow_snapshot: workflow,
        triggered_by: 'webhook',
        trigger_metadata: {
          webhook_id: webhook.id,
          webhook_key: key,
          client_ip: clientIP,
          method,
          headers: {
            'content-type': contentType,
            'user-agent': request.headers.get('user-agent')
          }
        }
      }])
      .select()
      .single()

    if (execError || !execution) {
      console.error('Error creating execution:', execError)
      return NextResponse.json(
        { error: 'Failed to create execution' },
        { status: 500 }
      )
    }

    // Update webhook stats
    await supabase
      .from('workflow_webhooks')
      .update({
        call_count: webhook.call_count + 1,
        last_called_at: new Date().toISOString()
      })
      .eq('id', webhook.id)

    // Execute workflow asynchronously
    // In production, this would be a queue job
    executeWorkflowAsync(execution.id, workflow, inputData)

    return NextResponse.json({
      success: true,
      execution_id: execution.id,
      message: 'Workflow execution started',
      workflow_name: workflow.name
    }, { status: 202 })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Execute workflow asynchronously
 * In production, use a proper queue (Bull, SQS, etc.)
 */
async function executeWorkflowAsync(
  executionId: string,
  workflow: any,
  inputData: Record<string, unknown>
) {
  try {
    // Import engine dynamically to avoid circular deps
    const { WorkflowEngine } = await import('@/lib/workflow-engine')

    const engine = new WorkflowEngine(workflow, workflow.user_id, executionId)
    await engine.execute(inputData)
  } catch (error) {
    console.error('Async execution error:', error)

    // Update execution as failed
    await supabase
      .from('workflow_executions')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString()
      })
      .eq('id', executionId)
  }
}

/**
 * POST /api/webhooks/[key]
 * Trigger workflow via webhook (primary method)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { key } = await params
  return handleWebhook(request, key, 'POST')
}

/**
 * GET /api/webhooks/[key]
 * Trigger workflow via webhook (for simple integrations)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { key } = await params
  return handleWebhook(request, key, 'GET')
}

/**
 * PUT /api/webhooks/[key]
 * Trigger workflow via webhook (alternative method)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { key } = await params
  return handleWebhook(request, key, 'PUT')
}

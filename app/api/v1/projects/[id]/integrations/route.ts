// ============================================
// /api/v1/projects/[id]/integrations
// Manage integrations/data sources within a project
// ============================================

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { IntegrationConfig } from '@/types/api'
import {
  withAPIProtection,
  successResponse,
  errorResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================
// VALIDATION
// ============================================

const VALID_INTEGRATION_TYPES = [
  'supabase',
  'firebase',
  'rest-api',
  'graphql',
  'stripe',
  'nextauth',
  'resend',
  'twilio',
  'aws-s3',
  'vercel-kv',
  'cloudinary',
  'sendgrid',
  'algolia',
  'sentry',
  'pusher',
]

function validateIntegrationRequest(data: any): {
  valid: boolean
  errors?: string[]
} {
  const errors: string[] = []

  if (!data.type || typeof data.type !== 'string') {
    errors.push('type is required and must be a string')
  }

  if (data.type && !VALID_INTEGRATION_TYPES.includes(data.type)) {
    errors.push(
      `Invalid integration type. Valid types: ${VALID_INTEGRATION_TYPES.join(', ')}`
    )
  }

  if (data.config !== undefined && typeof data.config !== 'object') {
    errors.push('config must be an object')
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// ============================================
// ADD INTEGRATION HANDLER
// ============================================

async function addIntegrationHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id: projectId } = context.params

    // Get existing project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', context.userId)
      .single()

    if (fetchError || !project) {
      return errorResponse('NOT_FOUND', 'Project not found', undefined, 404)
    }

    // Parse and validate request body
    let body: IntegrationConfig
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse('VALIDATION_ERROR', 'Invalid JSON body', String(error))
    }

    const validation = validateIntegrationRequest(body)
    if (!validation.valid) {
      return errorResponse('VALIDATION_ERROR', 'Validation failed', validation.errors)
    }

    // Get existing integrations
    const existingIntegrations = (project.integrations || []) as IntegrationConfig[]

    // Check if integration already exists
    const exists = existingIntegrations.some((int) => int.type === body.type)
    if (exists) {
      return errorResponse(
        'VALIDATION_ERROR',
        `Integration ${body.type} already exists in this project`
      )
    }

    // Add new integration
    const newIntegration: IntegrationConfig = {
      type: body.type,
      config: body.config || {},
    }

    existingIntegrations.push(newIntegration)

    // Update project
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        integrations: existingIntegrations,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return errorResponse(
        'INTERNAL_ERROR',
        'Failed to add integration',
        updateError.message,
        500
      )
    }

    return addCORSHeaders(
      successResponse({
        integration: newIntegration,
        message: 'Integration added successfully',
      })
    )
  } catch (error) {
    console.error('Add integration error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// LIST INTEGRATIONS HANDLER
// ============================================

async function listIntegrationsHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id: projectId } = context.params

    // Get project
    const { data: project, error } = await supabase
      .from('projects')
      .select('integrations')
      .eq('id', projectId)
      .eq('user_id', context.userId)
      .single()

    if (error || !project) {
      return errorResponse('NOT_FOUND', 'Project not found', undefined, 404)
    }

    const integrations = (project.integrations || []) as IntegrationConfig[]

    return addCORSHeaders(
      successResponse({
        integrations,
        total: integrations.length,
      })
    )
  } catch (error) {
    console.error('List integrations error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// ROUTE HANDLERS
// ============================================

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    listIntegrationsHandler(req, { ...ctx, params })
  )(request)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    addIntegrationHandler(req, { ...ctx, params })
  )(request)
}

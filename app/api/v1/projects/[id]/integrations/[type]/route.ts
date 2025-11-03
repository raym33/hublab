// ============================================
// /api/v1/projects/[id]/integrations/[type]
// Get or delete a specific integration
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
// GET INTEGRATION HANDLER
// ============================================

async function getIntegrationHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string; type: string } }
) {
  try {
    const { id: projectId, type } = context.params

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
    const integration = integrations.find((int) => int.type === type)

    if (!integration) {
      return errorResponse('NOT_FOUND', `Integration ${type} not found`, undefined, 404)
    }

    return addCORSHeaders(
      successResponse({
        integration,
      })
    )
  } catch (error) {
    console.error('Get integration error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// DELETE INTEGRATION HANDLER
// ============================================

async function deleteIntegrationHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string; type: string } }
) {
  try {
    const { id: projectId, type } = context.params

    // Get project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', context.userId)
      .single()

    if (fetchError || !project) {
      return errorResponse('NOT_FOUND', 'Project not found', undefined, 404)
    }

    const integrations = (project.integrations || []) as IntegrationConfig[]

    // Find and remove integration
    const initialLength = integrations.length
    const updatedIntegrations = integrations.filter((int) => int.type !== type)

    if (updatedIntegrations.length === initialLength) {
      return errorResponse('NOT_FOUND', `Integration ${type} not found`, undefined, 404)
    }

    // Update project
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        integrations: updatedIntegrations,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)

    if (updateError) {
      console.error('Database error:', updateError)
      return errorResponse(
        'INTERNAL_ERROR',
        'Failed to delete integration',
        updateError.message,
        500
      )
    }

    return addCORSHeaders(
      successResponse({
        message: `Integration ${type} deleted successfully`,
      })
    )
  } catch (error) {
    console.error('Delete integration error:', error)
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
  { params }: { params: { id: string; type: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    getIntegrationHandler(req, { ...ctx, params })
  )(request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; type: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    deleteIntegrationHandler(req, { ...ctx, params })
  )(request)
}

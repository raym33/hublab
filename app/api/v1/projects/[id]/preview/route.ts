// ============================================
// /api/v1/projects/[id]/preview
// Generate preview URL for project
// ============================================

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import {
  withAPIProtection,
  successResponse,
  errorResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'


// ============================================
// GENERATE PREVIEW HANDLER
// ============================================

async function generatePreviewHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id: projectId } = context.params

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

    // Generate preview URL
    // In a real implementation, this would:
    // 1. Generate the code
    // 2. Upload to a temporary hosting service
    // 3. Return a preview URL that expires in 24 hours

    const previewUrl = `https://preview.hublab.dev/${projectId}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update project with preview URL
    await supabase
      .from('projects')
      .update({
        preview_url: previewUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)

    return addCORSHeaders(
      successResponse({
        success: true,
        previewUrl,
        expiresAt: expiresAt.toISOString(),
        message: 'Preview URL generated successfully',
      })
    )
  } catch (error) {
    console.error('Generate preview error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// ROUTE HANDLERS
// ============================================

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    generatePreviewHandler(req, { ...ctx, params })
  )(request)
}

// ============================================
// /api/v1/projects/[id]
// Get, update, or delete a specific project
// ============================================

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { ThemeConfig } from '@/types/api'
import { PRESET_THEMES } from '@/types/api'
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
// GET PROJECT HANDLER
// ============================================

async function getProjectHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id } = context.params

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', context.userId)
      .single()

    if (error || !data) {
      return errorResponse('NOT_FOUND', 'Project not found', undefined, 404)
    }

    const project = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      template: data.template,
      theme: data.theme,
      capsules: data.capsules,
      integrations: data.integrations,
      status: data.status,
      previewUrl: data.preview_url,
      deployUrl: data.deploy_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return addCORSHeaders(successResponse({ project }))
  } catch (error) {
    console.error('Get project error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// UPDATE PROJECT HANDLER
// ============================================

async function updateProjectHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id } = context.params

    // Check if project exists and belongs to user
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', context.userId)
      .single()

    if (fetchError || !existingProject) {
      return errorResponse('NOT_FOUND', 'Project not found', undefined, 404)
    }

    // Parse request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse('VALIDATION_ERROR', 'Invalid JSON body', String(error))
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.length === 0) {
        return errorResponse('VALIDATION_ERROR', 'name must be a non-empty string')
      }
      updates.name = body.name
    }

    if (body.description !== undefined) {
      updates.description = body.description
    }

    if (body.theme !== undefined) {
      if (typeof body.theme === 'string') {
        if (!PRESET_THEMES[body.theme]) {
          return errorResponse(
            'VALIDATION_ERROR',
            `theme preset "${body.theme}" not found`
          )
        }
        updates.theme = PRESET_THEMES[body.theme]
      } else {
        updates.theme = body.theme
      }
    }

    if (body.capsules !== undefined) {
      updates.capsules = body.capsules
    }

    if (body.integrations !== undefined) {
      updates.integrations = body.integrations
    }

    if (body.status !== undefined) {
      const validStatuses = ['draft', 'building', 'ready', 'deployed', 'error']
      if (!validStatuses.includes(body.status)) {
        return errorResponse(
          'VALIDATION_ERROR',
          `status must be one of: ${validStatuses.join(', ')}`
        )
      }
      updates.status = body.status
    }

    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', context.userId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return errorResponse('INTERNAL_ERROR', 'Failed to update project', error.message, 500)
    }

    const project = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      template: data.template,
      theme: data.theme,
      capsules: data.capsules,
      integrations: data.integrations,
      status: data.status,
      previewUrl: data.preview_url,
      deployUrl: data.deploy_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return addCORSHeaders(
      successResponse({
        project,
        message: 'Project updated successfully',
      })
    )
  } catch (error) {
    console.error('Update project error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// DELETE PROJECT HANDLER
// ============================================

async function deleteProjectHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id } = context.params

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', context.userId)

    if (error) {
      console.error('Database error:', error)
      return errorResponse('INTERNAL_ERROR', 'Failed to delete project', error.message, 500)
    }

    return addCORSHeaders(
      successResponse({
        message: 'Project deleted successfully',
      })
    )
  } catch (error) {
    console.error('Delete project error:', error)
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
    getProjectHandler(req, { ...ctx, params })
  )(request)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    updateProjectHandler(req, { ...ctx, params })
  )(request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    deleteProjectHandler(req, { ...ctx, params })
  )(request)
}

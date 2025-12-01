// ============================================
// /api/v1/projects/[id]/capsules/[capsuleId]
// Get, update, or delete a specific capsule
// ============================================

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import type { Capsule } from '@/types/api'
import {
  withAPIProtection,
  successResponse,
  errorResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'

// ============================================
// FIND CAPSULE IN TREE
// ============================================

function findCapsule(
  capsules: Capsule[],
  capsuleId: string,
  parent?: Capsule
): { capsule: Capsule; parent?: Capsule; index: number } | null {
  for (let i = 0; i < capsules.length; i++) {
    const capsule = capsules[i]

    if (capsule.id === capsuleId) {
      return { capsule, parent, index: i }
    }

    if (capsule.children) {
      const found = findCapsule(capsule.children, capsuleId, capsule)
      if (found) return found
    }
  }

  return null
}

// ============================================
// UPDATE CAPSULE IN TREE
// ============================================

function updateCapsuleInTree(
  capsules: Capsule[],
  capsuleId: string,
  updates: Partial<Capsule>
): boolean {
  for (let i = 0; i < capsules.length; i++) {
    if (capsules[i].id === capsuleId) {
      capsules[i] = { ...capsules[i], ...updates }
      return true
    }

    if (capsules[i].children) {
      const updated = updateCapsuleInTree(capsules[i].children!, capsuleId, updates)
      if (updated) return true
    }
  }

  return false
}

// ============================================
// DELETE CAPSULE FROM TREE
// ============================================

function deleteCapsuleFromTree(capsules: Capsule[], capsuleId: string): boolean {
  for (let i = 0; i < capsules.length; i++) {
    if (capsules[i].id === capsuleId) {
      capsules.splice(i, 1)
      return true
    }

    if (capsules[i].children) {
      const deleted = deleteCapsuleFromTree(capsules[i].children!, capsuleId)
      if (deleted) return true
    }
  }

  return false
}

// ============================================
// GET CAPSULE HANDLER
// ============================================

async function getCapsuleHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string; capsuleId: string } }
) {
  try {
    const { id: projectId, capsuleId } = context.params

    const { data: project, error } = await supabase
      .from('projects')
      .select('capsules')
      .eq('id', projectId)
      .eq('user_id', context.userId)
      .single()

    if (error || !project) {
      return errorResponse('NOT_FOUND', 'Project not found', undefined, 404)
    }

    const capsules = (project.capsules || []) as Capsule[]
    const found = findCapsule(capsules, capsuleId)

    if (!found) {
      return errorResponse('NOT_FOUND', 'Capsule not found', undefined, 404)
    }

    return addCORSHeaders(
      successResponse({
        capsule: found.capsule,
        parentId: found.parent?.id,
      })
    )
  } catch (error) {
    console.error('Get capsule error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// UPDATE CAPSULE HANDLER
// ============================================

async function updateCapsuleHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string; capsuleId: string } }
) {
  try {
    const { id: projectId, capsuleId } = context.params

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

    // Parse request body
    let body: Partial<Capsule>
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse('VALIDATION_ERROR', 'Invalid JSON body', String(error))
    }

    const capsules = (project.capsules || []) as Capsule[]

    // Check capsule exists
    const found = findCapsule(capsules, capsuleId)
    if (!found) {
      return errorResponse('NOT_FOUND', 'Capsule not found', undefined, 404)
    }

    // Build updates (only allow certain fields)
    const allowedUpdates: Partial<Capsule> = {}

    if (body.props !== undefined) {
      allowedUpdates.props = body.props
    }

    if (body.dataSource !== undefined) {
      allowedUpdates.dataSource = body.dataSource
    }

    if (body.position !== undefined) {
      allowedUpdates.position = body.position
    }

    // Apply updates
    const updated = updateCapsuleInTree(capsules, capsuleId, allowedUpdates)

    if (!updated) {
      return errorResponse('INTERNAL_ERROR', 'Failed to update capsule', undefined, 500)
    }

    // Save to database
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        capsules,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return errorResponse('INTERNAL_ERROR', 'Failed to update capsule', updateError.message, 500)
    }

    // Find and return updated capsule
    const updatedCapsule = findCapsule(capsules, capsuleId)

    return addCORSHeaders(
      successResponse({
        capsule: updatedCapsule!.capsule,
        message: 'Capsule updated successfully',
      })
    )
  } catch (error) {
    console.error('Update capsule error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// DELETE CAPSULE HANDLER
// ============================================

async function deleteCapsuleHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string; capsuleId: string } }
) {
  try {
    const { id: projectId, capsuleId } = context.params

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

    const capsules = (project.capsules || []) as Capsule[]

    // Delete capsule
    const deleted = deleteCapsuleFromTree(capsules, capsuleId)

    if (!deleted) {
      return errorResponse('NOT_FOUND', 'Capsule not found', undefined, 404)
    }

    // Save to database
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        capsules,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)

    if (updateError) {
      console.error('Database error:', updateError)
      return errorResponse('INTERNAL_ERROR', 'Failed to delete capsule', updateError.message, 500)
    }

    return addCORSHeaders(
      successResponse({
        message: 'Capsule deleted successfully',
      })
    )
  } catch (error) {
    console.error('Delete capsule error:', error)
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
  { params }: { params: { id: string; capsuleId: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    getCapsuleHandler(req, { ...ctx, params })
  )(request)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; capsuleId: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    updateCapsuleHandler(req, { ...ctx, params })
  )(request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; capsuleId: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    deleteCapsuleHandler(req, { ...ctx, params })
  )(request)
}

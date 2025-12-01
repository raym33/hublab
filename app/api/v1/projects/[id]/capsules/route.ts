// ============================================
// /api/v1/projects/[id]/capsules
// Manage capsules within a project
// ============================================

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import type { Capsule, AddCapsuleRequest } from '@/types/api'
import {
  withAPIProtection,
  successResponse,
  errorResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'


// ============================================
// VALIDATION
// ============================================

function validateAddCapsuleRequest(data: any): {
  valid: boolean
  errors?: string[]
} {
  const errors: string[] = []

  if (!data.type || typeof data.type !== 'string') {
    errors.push('type is required and must be a string')
  }

  const validCategories = [
    'layout',
    'navigation',
    'forms',
    'data-display',
    'charts',
    'media',
    'ecommerce',
    'auth',
  ]

  // props is optional but must be object if provided
  if (data.props !== undefined && typeof data.props !== 'object') {
    errors.push('props must be an object')
  }

  // dataSource is optional but must be object if provided
  if (data.dataSource !== undefined && typeof data.dataSource !== 'object') {
    errors.push('dataSource must be an object')
  }

  if (data.dataSource && !data.dataSource.type) {
    errors.push('dataSource.type is required when dataSource is provided')
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// ============================================
// GENERATE CAPSULE ID
// ============================================

function generateCapsuleId(type: string, existingCapsules: Capsule[]): string {
  const typeCapsules = existingCapsules.filter((c) => c.type === type)
  const nextNumber = typeCapsules.length + 1
  return `${type}-${nextNumber}`
}

// ============================================
// INFER CATEGORY FROM TYPE
// ============================================

function inferCategory(type: string): Capsule['category'] {
  const categoryMap: Record<string, Capsule['category']> = {
    header: 'navigation',
    footer: 'navigation',
    sidebar: 'navigation',
    navbar: 'navigation',
    hero: 'layout',
    container: 'layout',
    grid: 'layout',
    'feature-grid': 'layout',
    'blog-grid': 'layout',
    'cta-section': 'layout',
    form: 'forms',
    input: 'forms',
    button: 'forms',
    'contact-form': 'forms',
    table: 'data-display',
    'data-table': 'data-display',
    card: 'data-display',
    'stats-grid': 'data-display',
    chart: 'charts',
    'bar-chart': 'charts',
    'line-chart': 'charts',
    'pie-chart': 'charts',
    image: 'media',
    video: 'media',
    gallery: 'media',
    'product-grid': 'ecommerce',
    cart: 'ecommerce',
    checkout: 'ecommerce',
    'login-form': 'auth',
    'signup-form': 'auth',
  }

  return categoryMap[type] || 'layout'
}

// ============================================
// ADD CAPSULE HANDLER
// ============================================

async function addCapsuleHandler(
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
    let body: AddCapsuleRequest
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse('VALIDATION_ERROR', 'Invalid JSON body', String(error))
    }

    const validation = validateAddCapsuleRequest(body)
    if (!validation.valid) {
      return errorResponse('VALIDATION_ERROR', 'Validation failed', validation.errors)
    }

    // Get existing capsules
    const existingCapsules = (project.capsules || []) as Capsule[]

    // Create new capsule
    const newCapsule: Capsule = {
      id: generateCapsuleId(body.type, existingCapsules),
      type: body.type,
      category: inferCategory(body.type),
      props: body.props || {},
      dataSource: body.dataSource,
    }

    // If parentId is provided, add as child
    if (body.parentId) {
      const parentIndex = existingCapsules.findIndex((c) => c.id === body.parentId)
      if (parentIndex === -1) {
        return errorResponse('NOT_FOUND', `Parent capsule ${body.parentId} not found`)
      }

      existingCapsules[parentIndex].children = existingCapsules[parentIndex].children || []
      existingCapsules[parentIndex].children!.push(newCapsule)
    } else {
      // Add as top-level capsule
      existingCapsules.push(newCapsule)
    }

    // Update project with new capsules array
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        capsules: existingCapsules,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return errorResponse('INTERNAL_ERROR', 'Failed to add capsule', updateError.message, 500)
    }

    return addCORSHeaders(
      successResponse({
        capsule: newCapsule,
        message: 'Capsule added successfully',
      })
    )
  } catch (error) {
    console.error('Add capsule error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// LIST CAPSULES HANDLER
// ============================================

async function listCapsulesHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id: projectId } = context.params

    // Get project
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

    // Flatten capsules (include children)
    const flattenCapsules = (caps: Capsule[], parent?: string): any[] => {
      return caps.flatMap((capsule) => {
        const flat = {
          ...capsule,
          parentId: parent,
        }

        if (capsule.children && capsule.children.length > 0) {
          return [flat, ...flattenCapsules(capsule.children, capsule.id)]
        }

        return [flat]
      })
    }

    return addCORSHeaders(
      successResponse({
        capsules: flattenCapsules(capsules),
        total: flattenCapsules(capsules).length,
      })
    )
  } catch (error) {
    console.error('List capsules error:', error)
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
    listCapsulesHandler(req, { ...ctx, params })
  )(request)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    addCapsuleHandler(req, { ...ctx, params })
  )(request)
}

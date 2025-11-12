// ============================================
// /api/v1/catalog/capsules/[type]
// Get details for a specific capsule type
// ============================================

import { NextRequest } from 'next/server'
import { CAPSULE_CATALOG } from '@/lib/api/capsule-catalog'
import {
  withAPIProtection,
  successResponse,
  errorResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'

// ============================================
// GET CAPSULE TYPE HANDLER
// ============================================

async function getCapsuleTypeHandler(
  request: NextRequest,
  context: APIContext & { params: { type: string } }
) {
  try {
    const { type } = context.params

    const capsule = CAPSULE_CATALOG[type]

    if (!capsule) {
      return errorResponse(
        'NOT_FOUND',
        `Capsule type "${type}" not found. Available types: ${Object.keys(CAPSULE_CATALOG).join(', ')}`,
        undefined,
        404
      )
    }

    return addCORSHeaders(
      successResponse({
        capsule,
      })
    )
  } catch (error) {
    console.error('Get capsule type error:', error)
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
  { params }: { params: { type: string } }
) {
  return withAPIProtection('requestsPerMinute', async (req, ctx) =>
    getCapsuleTypeHandler(req, { ...ctx, params })
  )(request)
}

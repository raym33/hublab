// ============================================
// /api/v1/catalog/capsules
// Browse available capsule types
// ============================================

import { NextRequest } from 'next/server'
import { CAPSULE_CATALOG_ARRAY, CAPSULES_BY_CATEGORY } from '@/lib/api/capsule-catalog'
import {
  withAPIProtection,
  successResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'

// ============================================
// LIST CAPSULES HANDLER
// ============================================

async function listCapsulesHandler(request: NextRequest, context: APIContext) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let capsules = CAPSULE_CATALOG_ARRAY

    // Filter by category
    if (category) {
      capsules = capsules.filter((c) => c.category === category)
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      capsules = capsules.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.type.toLowerCase().includes(searchLower)
      )
    }

    return addCORSHeaders(
      successResponse({
        capsules,
        total: capsules.length,
        categories: Object.keys(CAPSULES_BY_CATEGORY),
      })
    )
  } catch (error) {
    console.error('List capsules catalog error:', error)
    return addCORSHeaders(
      successResponse({
        capsules: [],
        total: 0,
        categories: [],
      })
    )
  }
}

// ============================================
// ROUTE HANDLERS
// ============================================

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET(request: NextRequest) {
  return withAPIProtection('requestsPerMinute', listCapsulesHandler)(request)
}

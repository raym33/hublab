// ============================================
// /api/v1/themes/[id]
// Get a specific preset theme
// ============================================

import { NextRequest } from 'next/server'
import { PRESET_THEMES } from '@/types/api'
import {
  withAPIProtection,
  successResponse,
  errorResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'

// ============================================
// GET THEME HANDLER
// ============================================

async function getThemeHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id } = context.params

    const theme = PRESET_THEMES[id as keyof typeof PRESET_THEMES]

    if (!theme) {
      return errorResponse(
        'NOT_FOUND',
        `Theme "${id}" not found. Available themes: ${Object.keys(PRESET_THEMES).join(', ')}`,
        undefined,
        404
      )
    }

    return addCORSHeaders(
      successResponse({
        id,
        theme,
      })
    )
  } catch (error) {
    console.error('Get theme error:', error)
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
    getThemeHandler(req, { ...ctx, params })
  )(request)
}

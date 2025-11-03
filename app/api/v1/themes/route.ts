// ============================================
// /api/v1/themes
// List available preset themes
// ============================================

import { NextRequest } from 'next/server'
import { PRESET_THEMES } from '@/types/api'
import {
  withAPIProtection,
  successResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'

// ============================================
// LIST THEMES HANDLER
// ============================================

async function listThemesHandler(request: NextRequest, context: APIContext) {
  try {
    const themes = Object.entries(PRESET_THEMES).map(([id, theme]) => ({
      id,
      ...theme,
    }))

    return addCORSHeaders(
      successResponse({
        themes,
        total: themes.length,
      })
    )
  } catch (error) {
    console.error('List themes error:', error)
    return addCORSHeaders(
      successResponse({
        themes: [],
        total: 0,
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
  return withAPIProtection('requestsPerMinute', listThemesHandler)(request)
}

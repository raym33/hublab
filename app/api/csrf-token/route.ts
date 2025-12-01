/**
 * CSRF Token Endpoint
 * Provides CSRF tokens to clients for subsequent requests
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateCsrfToken } from '@/lib/csrf'

// Force dynamic rendering - CSRF tokens require runtime secrets
export const dynamic = 'force-dynamic'

/**
 * GET /api/csrf-token
 * Returns a CSRF token for the client to use in subsequent requests
 */
export async function GET(request: NextRequest) {
  const token = generateCsrfToken()

  return NextResponse.json(
    {
      csrfToken: token,
      expiresIn: '1h',
      usage: 'Include this token in the X-CSRF-Token header for POST/PUT/DELETE/PATCH requests'
    },
    {
      status: 200,
      headers: {
        'X-CSRF-Token': token,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    }
  )
}

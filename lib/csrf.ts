/**
 * CSRF Protection Utilities
 * Implements token-based CSRF protection for API endpoints
 */

import csrf from 'csrf'
import { NextRequest, NextResponse } from 'next/server'

// Initialize CSRF tokens generator
const tokens = new csrf()

// Secret for CSRF tokens (should be in env vars in production)
const CSRF_SECRET = process.env.CSRF_SECRET || 'hublab-csrf-secret-change-in-production'

if (!process.env.CSRF_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  CSRF_SECRET not set in production! Using default (insecure).')
}

/**
 * Generate a CSRF token
 * @returns CSRF token string
 */
export function generateCsrfToken(): string {
  return tokens.create(CSRF_SECRET)
}

/**
 * Verify a CSRF token
 * @param token - The token to verify
 * @returns true if valid, false otherwise
 */
export function verifyCsrfToken(token: string | null): boolean {
  if (!token) return false
  return tokens.verify(CSRF_SECRET, token)
}

/**
 * Middleware to protect routes with CSRF validation
 * Only validates state-changing methods (POST, PUT, DELETE, PATCH)
 */
export function withCsrfProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const method = request.method

    // Only validate CSRF for state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      // Get CSRF token from header
      const csrfToken = request.headers.get('x-csrf-token')

      // Verify token
      if (!verifyCsrfToken(csrfToken)) {
        return NextResponse.json(
          {
            error: 'Invalid or missing CSRF token',
            message: 'Include a valid CSRF token in the X-CSRF-Token header'
          },
          { status: 403 }
        )
      }
    }

    // Token is valid or not required, proceed with handler
    return handler(request)
  }
}

/**
 * Helper to add CSRF token to response headers
 * Useful for GET endpoints that return a CSRF token to the client
 */
export function addCsrfTokenToResponse(response: NextResponse): NextResponse {
  const token = generateCsrfToken()
  response.headers.set('X-CSRF-Token', token)
  return response
}

/**
 * Extract CSRF token from cookies
 * Alternative method for SPAs that store token in cookies
 */
export function getCsrfTokenFromCookies(request: NextRequest): string | null {
  return request.cookies.get('csrf-token')?.value || null
}

/**
 * Validate CSRF token from either header or cookie
 */
export function validateCsrfFromRequest(request: NextRequest): boolean {
  const method = request.method

  // Skip validation for safe methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return true
  }

  // Try header first, then cookie
  const tokenFromHeader = request.headers.get('x-csrf-token')
  const tokenFromCookie = getCsrfTokenFromCookies(request)

  const token = tokenFromHeader || tokenFromCookie

  return verifyCsrfToken(token)
}

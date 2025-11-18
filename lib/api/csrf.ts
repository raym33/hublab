/**
 * CSRF Protection Middleware
 * Implements Double Submit Cookie pattern for CSRF protection
 */

import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, createHash } from 'crypto'

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production'
const CSRF_TOKEN_HEADER = 'x-csrf-token'
const CSRF_COOKIE_NAME = 'csrf-token'

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const token = randomBytes(32).toString('hex')
  const timestamp = Date.now().toString()
  const hash = createHash('sha256')
    .update(`${token}:${timestamp}:${CSRF_SECRET}`)
    .digest('hex')

  return `${token}.${timestamp}.${hash}`
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const [tokenValue, timestamp, hash] = token.split('.')

    if (!tokenValue || !timestamp || !hash) {
      return false
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp)
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return false
    }

    // Verify hash
    const expectedHash = createHash('sha256')
      .update(`${tokenValue}:${timestamp}:${CSRF_SECRET}`)
      .digest('hex')

    return hash === expectedHash
  } catch (error) {
    return false
  }
}

/**
 * CSRF protection middleware for API routes
 * Use this to wrap state-changing route handlers (POST, PUT, DELETE, PATCH)
 */
export function withCSRFProtection<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const method = request.method

    // Only check CSRF for state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method || '')) {
      // Get CSRF token from header
      const csrfTokenHeader = request.headers.get(CSRF_TOKEN_HEADER)

      // Get CSRF token from cookie
      const csrfTokenCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value

      // Both tokens must be present and match
      if (!csrfTokenHeader || !csrfTokenCookie) {
        return NextResponse.json(
          { error: 'CSRF token missing' },
          { status: 403 }
        )
      }

      if (csrfTokenHeader !== csrfTokenCookie) {
        return NextResponse.json(
          { error: 'CSRF token mismatch' },
          { status: 403 }
        )
      }

      // Validate the token
      if (!validateCSRFToken(csrfTokenHeader)) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        )
      }
    }

    return handler(request, ...args)
  }
}

/**
 * Generate and set CSRF token in response
 */
export function setCSRFToken(response: NextResponse): NextResponse {
  const token = generateCSRFToken()

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by client JS to send in headers
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  })

  return response
}

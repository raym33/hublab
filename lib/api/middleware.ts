// ============================================
// HUBLAB API MIDDLEWARE
// Authentication and rate limiting middleware for API routes
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import type { APIKey, APIErrorCode } from '@/types/api'
import {
  extractAPIKey,
  validateAPIKey,
  checkRateLimit,
  recordAPIUsage,
} from './auth'
import type { RateLimit } from '@/types/api'

// ============================================
// CORS CONFIGURATION
// ============================================

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

const ALLOWED_ORIGINS = [
  'https://hublab.dev',
  'https://www.hublab.dev',
  'https://hublab.app',
  'https://api.hublab.dev',
  // Add more trusted domains as needed
]

// ============================================
// TYPES
// ============================================

export interface APIContext {
  apiKey: APIKey
  userId: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: APIErrorCode
    message: string
    details?: any
  }
  rateLimit?: {
    limit: number
    remaining: number
    resetAt: string
  }
}

type APIHandler = (
  request: NextRequest,
  context: APIContext
) => Promise<NextResponse<APIResponse>>

// ============================================
// ERROR RESPONSES
// ============================================

export function errorResponse(
  code: APIErrorCode,
  message: string,
  details?: any,
  status: number = 400
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  )
}

export function successResponse<T>(
  data: T,
  rateLimit?: {
    limit: number
    remaining: number
    resetAt: Date
  }
): NextResponse<APIResponse<T>> {
  const response: APIResponse<T> = {
    success: true,
    data,
  }

  if (rateLimit) {
    response.rateLimit = {
      limit: rateLimit.limit,
      remaining: rateLimit.remaining,
      resetAt: rateLimit.resetAt.toISOString(),
    }
  }

  return NextResponse.json(response)
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

/**
 * Middleware to authenticate API requests
 * Validates API key and attaches user context
 */
export function withAuth(handler: APIHandler) {
  return async (request: NextRequest): Promise<NextResponse<APIResponse>> => {
    try {
      // Extract API key from Authorization header
      const authHeader = request.headers.get('Authorization')
      const apiKeyString = extractAPIKey(authHeader)

      if (!apiKeyString) {
        return errorResponse(
          'UNAUTHORIZED',
          'Missing API key. Include it in the Authorization header as "Bearer <api_key>"',
          undefined,
          401
        )
      }

      // Validate API key
      const { valid, apiKey, error } = await validateAPIKey(apiKeyString)

      if (!valid || !apiKey) {
        return errorResponse('UNAUTHORIZED', error || 'Invalid API key', undefined, 401)
      }

      // Create context with authenticated API key
      const context: APIContext = {
        apiKey,
        userId: apiKey.userId,
      }

      // Call the handler with authenticated context
      return await handler(request, context)
    } catch (error) {
      console.error('Authentication error:', error)
      return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
    }
  }
}

// ============================================
// RATE LIMITING MIDDLEWARE
// ============================================

/**
 * Middleware to enforce rate limits
 */
export function withRateLimit(limitType: keyof RateLimit) {
  return (handler: APIHandler): APIHandler => {
    return async (request: NextRequest, context: APIContext) => {
      try {
        // Check rate limit
        const rateLimitCheck = await checkRateLimit(context.apiKey.id, limitType)

        if (!rateLimitCheck.allowed) {
          return errorResponse(
            'RATE_LIMIT_EXCEEDED',
            rateLimitCheck.error || 'Rate limit exceeded',
            {
              limit: rateLimitCheck.limit,
              resetAt: rateLimitCheck.resetAt?.toISOString(),
            },
            429
          )
        }

        // Record API usage for rate limiting
        await recordAPIUsage(context.apiKey.id, limitType)

        // Call the handler
        const response = await handler(request, context)

        // Add rate limit headers to response
        if (rateLimitCheck.limit !== undefined && rateLimitCheck.remaining !== undefined) {
          const headers = new Headers(response.headers)
          headers.set('X-RateLimit-Limit', rateLimitCheck.limit.toString())
          headers.set('X-RateLimit-Remaining', rateLimitCheck.remaining.toString())
          if (rateLimitCheck.resetAt) {
            headers.set('X-RateLimit-Reset', rateLimitCheck.resetAt.toISOString())
          }

          return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          })
        }

        return response
      } catch (error) {
        console.error('Rate limit error:', error)
        return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
      }
    }
  }
}

// ============================================
// COMBINED MIDDLEWARE
// ============================================

/**
 * Combined middleware: authentication + rate limiting
 */
export function withAPIProtection(limitType: keyof RateLimit, handler: APIHandler) {
  return withAuth(withRateLimit(limitType)(handler))
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate request body against a schema
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  validator: (data: any) => { valid: boolean; errors?: string[] }
): Promise<{ valid: boolean; data?: T; errors?: string[] }> {
  try {
    const body = await request.json()
    const validation = validator(body)

    if (!validation.valid) {
      return { valid: false, errors: validation.errors }
    }

    return { valid: true, data: body as T }
  } catch (error) {
    return { valid: false, errors: ['Invalid JSON body'] }
  }
}

/**
 * Extract query parameters from request
 */
export function getQueryParams(request: NextRequest): Record<string, string> {
  const params: Record<string, string> = {}
  const { searchParams } = new URL(request.url)

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}

/**
 * Parse pagination parameters
 */
export function parsePagination(
  request: NextRequest
): { page: number; limit: number; offset: number } {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

// ============================================
// CORS HEADERS
// ============================================

/**
 * Add CORS headers to response (with origin validation)
 */
export function addCORSHeaders(response: NextResponse, request?: NextRequest): NextResponse {
  const headers = new Headers(response.headers)

  // Determine allowed origin
  const origin = request?.headers.get('origin')
  const allowedOrigin = IS_DEVELOPMENT
    ? '*' // Allow all origins in development
    : (origin && ALLOWED_ORIGINS.includes(origin))
      ? origin // Allow if in whitelist
      : ALLOWED_ORIGINS[0] // Default to first allowed origin

  headers.set('Access-Control-Allow-Origin', allowedOrigin)
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  headers.set('Access-Control-Max-Age', '86400')

  // Only allow credentials with specific origins (never with *)
  if (allowedOrigin !== '*') {
    headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Handle OPTIONS requests for CORS preflight (with origin validation)
 */
export function handleCORSPreflight(request?: NextRequest): NextResponse {
  // Determine allowed origin
  const origin = request?.headers.get('origin')
  const allowedOrigin = IS_DEVELOPMENT
    ? '*' // Allow all origins in development
    : (origin && ALLOWED_ORIGINS.includes(origin))
      ? origin // Allow if in whitelist
      : ALLOWED_ORIGINS[0] // Default to first allowed origin

  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }

  // Only allow credentials with specific origins (never with *)
  if (allowedOrigin !== '*') {
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  return new NextResponse(null, {
    status: 204,
    headers,
  })
}

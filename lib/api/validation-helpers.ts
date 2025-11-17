/**
 * API Validation Helper Functions
 * Reusable validation utilities for API routes
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * Safely parse JSON body from request
 * Returns parsed body or NextResponse error
 */
export async function parseJsonBody<T = any>(
  request: NextRequest
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const data = await request.json()
    return { data }
  } catch (error) {
    return {
      error: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      ),
    }
  }
}

/**
 * Validate required fields in object
 * Returns error response if any field is missing
 */
export function validateRequiredFields(
  data: Record<string, any>,
  fields: string[]
): NextResponse | null {
  const missing = fields.filter(field => !data[field])

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: 'Missing required fields',
        missing,
      },
      { status: 400 }
    )
  }

  return null
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate and sanitize integer from string or number
 * Returns validated number or undefined
 */
export function validateInteger(
  value: any,
  min?: number,
  max?: number
): number | undefined {
  const num = parseInt(value, 10)

  if (isNaN(num)) return undefined
  if (min !== undefined && num < min) return undefined
  if (max !== undefined && num > max) return undefined

  return num
}

/**
 * Validate and sanitize float from string or number
 * Returns validated number or undefined
 */
export function validateFloat(
  value: any,
  min?: number,
  max?: number
): number | undefined {
  const num = parseFloat(value)

  if (isNaN(num)) return undefined
  if (min !== undefined && num < min) return undefined
  if (max !== undefined && num > max) return undefined

  return num
}

/**
 * Sanitize string - trim and limit length
 */
export function sanitizeString(
  value: any,
  maxLength: number = 1000
): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(searchParams: URLSearchParams): {
  limit: number
  offset: number
} {
  const limit = validateInteger(
    searchParams.get('limit'),
    1,
    100
  ) || 50

  const offset = validateInteger(
    searchParams.get('offset'),
    0
  ) || 0

  return { limit, offset }
}

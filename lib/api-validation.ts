/**
 * API Request Validation with Zod
 * Type-safe validation for all API endpoints
 */

import { z, ZodSchema } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json()
    const validated = schema.parse(body)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return {
        success: false,
        error: `${firstError.path.join('.')}: ${firstError.message}`,
      }
    }
    return { success: false, error: 'Invalid request body' }
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const validated = schema.parse(params)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return {
        success: false,
        error: `${firstError.path.join('.')}: ${firstError.message}`,
      }
    }
    return { success: false, error: 'Invalid query parameters' }
  }
}

/**
 * Common validation schemas
 */
export const schemas = {
  // Pagination
  pagination: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('10').transform(Number),
  }),

  // Search
  search: z.object({
    q: z.string().min(1, 'Search query is required'),
    category: z.string().optional(),
  }),

  // ID parameter
  id: z.object({
    id: z.string().uuid('Invalid ID format'),
  }),

  // Capsule creation
  createCapsule: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().optional(),
    category: z.enum(['UI', 'Form', 'DataViz', 'Media', 'AI', 'Utility']),
    tags: z.array(z.string()).optional().default([]),
    isPublic: z.boolean().optional().default(false),
  }),

  // Project creation
  createProject: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().optional(),
    framework: z.enum(['react', 'nextjs', 'html']).optional().default('react'),
  }),

  // AI compilation
  aiCompile: z.object({
    prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000),
    context: z.string().optional(),
    streaming: z.boolean().optional().default(false),
  }),

  // GitHub import
  githubImport: z.object({
    url: z.string().url('Invalid GitHub URL').regex(/github\.com/, 'Must be a GitHub URL'),
    embedType: z.enum(['iframe', 'component', 'npm-package']).optional().default('iframe'),
  }),
}

/**
 * Wrapper for API handlers with validation
 */
export async function withValidation<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
  handler: (data: T) => Promise<NextResponse>
): Promise<NextResponse> {
  const result = await validateRequest(request, schema)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Validation Error',
        message: result.error,
      },
      { status: 400 }
    )
  }

  return handler(result.data)
}

/**
 * Create error response
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      error: 'Bad Request',
      message,
    },
    { status }
  )
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

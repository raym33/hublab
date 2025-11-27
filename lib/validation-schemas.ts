/**
 * Zod Validation Schemas for API Endpoints
 * Provides runtime type validation and sanitization
 */

import { z } from 'zod'

/**
 * Email validation schema (strict RFC 5322)
 */
export const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .min(3, 'Email must be at least 3 characters')
  .max(254, 'Email must not exceed 254 characters')
  .email('Invalid email format')

/**
 * Waitlist submission schema
 */
export const waitlistSchema = z.object({
  email: emailSchema,
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  referral: z.string().optional()
})

/**
 * Checkout request schema
 */
export const checkoutSchema = z.object({
  prototypeId: z.string()
    .uuid('Invalid prototype ID format'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
})

/**
 * Compilation request schema
 */
export const compilationSchema = z.object({
  prompt: z.string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(5000, 'Prompt must not exceed 5000 characters')
    .trim()
    .optional(),
  platform: z.enum(['web', 'desktop', 'ios', 'android', 'ai-os'])
    .default('web'),
  template: z.string().optional(),
  selectedCapsules: z.array(z.string()).optional(),
  composition: z.any().optional() // Custom composition object
})

/**
 * Contact form schema
 */
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: emailSchema,
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters')
    .trim()
    .optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters')
    .trim()
})

/**
 * API key creation schema
 */
export const apiKeySchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  tier: z.enum(['free', 'pro', 'enterprise']).default('free'),
  expiresIn: z.number()
    .int()
    .positive()
    .max(365, 'API key cannot expire more than 365 days in the future')
    .optional()
})

/**
 * Project creation schema
 */
export const projectSchema = z.object({
  name: z.string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must not exceed 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  template: z.enum(['blank', 'dashboard', 'landing', 'ecommerce', 'admin', 'blog']),
  theme: z.object({
    name: z.string(),
    colors: z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
    }).optional()
  }).optional()
})

/**
 * Capsule submission schema
 */
export const capsuleSchema = z.object({
  name: z.string()
    .min(3, 'Capsule name must be at least 3 characters')
    .max(100, 'Capsule name must not exceed 100 characters')
    .trim(),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
  category: z.string(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  price: z.number()
    .nonnegative('Price must be non-negative')
    .max(10000, 'Price must not exceed $10,000'),
  code: z.string()
    .min(10, 'Code must be at least 10 characters')
})

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number()
    .int()
    .positive()
    .default(1),
  limit: z.coerce.number()
    .int()
    .positive()
    .max(100, 'Limit must not exceed 100')
    .default(20)
})

/**
 * Search/filter schema
 */
export const searchSchema = z.object({
  query: z.string()
    .max(200, 'Search query must not exceed 200 characters')
    .trim()
    .optional(),
  category: z.string().optional(),
  sortBy: z.enum(['created', 'updated', 'name', 'price', 'rating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

/**
 * Saved composition schema
 */
export const createCompositionSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name must not exceed 200 characters')
    .trim(),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  prompt: z.string()
    .max(5000, 'Prompt must not exceed 5000 characters')
    .trim()
    .optional()
    .nullable(),
  platform: z.enum(['web', 'desktop', 'ios', 'android', 'ai-os']).default('web'),
  composition: z.record(z.unknown()),
  compilation_result: z.record(z.unknown()).optional().nullable(),
  is_public: z.boolean().default(false),
  tags: z.array(z.string().max(50)).max(20, 'Maximum 20 tags allowed').default([])
})

/**
 * Helper function to validate and sanitize request body
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ['Invalid request data'] }
  }
}

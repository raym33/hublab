/**
 * Validation Schemas
 *
 * Zod schemas for validating API request payloads
 */

import { z } from 'zod'

/**
 * Checkout API validation
 */
export const checkoutSchema = z.object({
  prototypeId: z.string().uuid('Invalid prototype ID format'),
})

/**
 * Waitlist API validation
 */
export const waitlistSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
})

/**
 * Contact form validation
 */
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  subject: z.string().max(200).optional(),
})

/**
 * CRM sync validation
 */
export const crmSyncSchema = z.object({
  crmType: z.enum(['hubspot', 'salesforce', 'pipedrive']),
  objectType: z.enum(['contact', 'deal', 'company']),
  data: z.record(z.any()),
})

/**
 * Capsule creation validation
 */
export const capsuleCreateSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  description: z.string().min(10).max(500),
  code: z.string().optional(),
  tags: z.array(z.string()).max(10),
  platform: z.enum(['react', 'vue', 'svelte', 'html', 'node']).optional(),
})

/**
 * User settings update validation
 */
export const userSettingsSchema = z.object({
  displayName: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  publicProfile: z.boolean().optional(),
})

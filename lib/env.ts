import { z } from 'zod'

/**
 * Environment Variable Validation
 *
 * Validates all required environment variables at startup.
 * Prevents runtime failures due to missing configuration.
 *
 * Usage:
 * - Import `env` object instead of using process.env directly
 * - Type-safe access to all env vars
 * - Fails fast at startup if required vars are missing
 */

// Define the schema for server-side environment variables
const serverEnvSchema = z.object({
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key required'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'Supabase service key required').optional(),

  // AI APIs
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key required').optional(),
  GROQ_API_KEY: z.string().min(1, 'Groq API key required').optional(),
  ANTHROPIC_API_KEY: z.string().min(1, 'Anthropic API key required').optional(),

  // Payment
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'Invalid Stripe secret key').optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'Invalid Stripe publishable key').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'Invalid Stripe webhook secret').optional(),

  // CRM Integrations
  HUBSPOT_CLIENT_ID: z.string().optional(),
  HUBSPOT_CLIENT_SECRET: z.string().optional(),
  SALESFORCE_CLIENT_ID: z.string().optional(),
  SALESFORCE_CLIENT_SECRET: z.string().optional(),
  ZOHO_CLIENT_ID: z.string().optional(),
  ZOHO_CLIENT_SECRET: z.string().optional(),

  // Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url('Invalid Upstash Redis URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Security
  ENCRYPTION_KEY: z.string().length(64, 'Encryption key must be 64 hex characters').optional(),
  CSRF_SECRET: z.string().min(32, 'CSRF secret must be at least 32 characters').optional(),

  // Rust Engine (optional)
  RUST_ENGINE_URL: z.string().url('Invalid Rust engine URL').optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Define client-side env vars (accessible via NEXT_PUBLIC_)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
})

/**
 * Check if we're in a build/SSG context where env vars may not be available
 */
function isBuildTime(): boolean {
  // During Next.js build, certain env vars won't be present
  // Check if we're in a server context without required env vars
  return (
    typeof window === 'undefined' &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NODE_ENV !== 'test'
  )
}

/**
 * Validate environment variables
 * Returns validated env object or throws error with details
 */
function validateEnv() {
  // Skip validation during build time (SSG/SSR page collection)
  if (isBuildTime()) {
    console.warn('⚠️  Skipping env validation during build time')
    // Return minimal defaults for build
    return {
      NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-key',
      NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    } as z.infer<typeof serverEnvSchema>
  }

  // Skip validation in browser (client-side)
  if (typeof window !== 'undefined') {
    const parsed = clientEnvSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    })

    if (!parsed.success) {
      console.error('❌ Invalid client environment variables:', parsed.error.flatten().fieldErrors)
      throw new Error('Invalid client environment variables')
    }

    return parsed.data as z.infer<typeof serverEnvSchema>
  }

  // Server-side validation
  const parsed = serverEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))

    // In development, show helpful error
    if (process.env.NODE_ENV === 'development') {
      console.error('\n📝 To fix: Copy .env.example to .env.local and fill in the required values')
    }

    throw new Error('Invalid environment variables. Check logs above.')
  }

  return parsed.data
}

// Validate and export
export const env = validateEnv()

// Type-safe helper functions
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test'
}

/**
 * Check if a specific feature is enabled based on env vars
 */
export function isFeatureEnabled(feature: 'stripe' | 'sentry' | 'redis' | 'rust' | 'ai'): boolean {
  switch (feature) {
    case 'stripe':
      return !!(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    case 'sentry':
      return !!(env.NEXT_PUBLIC_SENTRY_DSN)
    case 'redis':
      return !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN)
    case 'rust':
      return !!(env.RUST_ENGINE_URL)
    case 'ai':
      return !!(env.OPENAI_API_KEY || env.GROQ_API_KEY || env.ANTHROPIC_API_KEY)
    default:
      return false
  }
}

/**
 * Get service status for health checks
 */
export function getServiceStatus() {
  return {
    database: !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    payments: isFeatureEnabled('stripe'),
    monitoring: isFeatureEnabled('sentry'),
    rateLimiting: isFeatureEnabled('redis'),
    rustEngine: isFeatureEnabled('rust'),
    ai: isFeatureEnabled('ai'),
  }
}

// Export types for TypeScript autocomplete
export type Env = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>

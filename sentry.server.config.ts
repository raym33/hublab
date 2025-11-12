/**
 * Sentry Server Configuration
 * Monitors errors in Next.js API routes and server components
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development'

Sentry.init({
  dsn: SENTRY_DSN,

  environment: SENTRY_ENVIRONMENT,

  // Lower sample rate for server to reduce costs
  tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.05 : 1.0,

  sampleRate: 1.0,

  // Server-specific settings
  integrations: [
    Sentry.extraErrorDataIntegration(),
  ],

  beforeSend(event, hint) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization']
      delete event.request.headers['cookie']
    }

    // Remove sensitive environment variables
    if (event.contexts?.runtime?.env) {
      const env = event.contexts.runtime.env as Record<string, unknown>
      Object.keys(env).forEach(key => {
        if (
          key.includes('SECRET') ||
          key.includes('KEY') ||
          key.includes('TOKEN') ||
          key.includes('PASSWORD')
        ) {
          env[key] = '[REDACTED]'
        }
      })
    }

    return event
  },

  ignoreErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
  ],
})

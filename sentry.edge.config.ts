/**
 * Sentry Edge Configuration
 * Monitors errors in Edge Runtime (middleware)
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development'

Sentry.init({
  dsn: SENTRY_DSN,

  environment: SENTRY_ENVIRONMENT,

  // Minimal sampling for edge due to cold starts
  tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.01 : 1.0,

  sampleRate: 1.0,
})

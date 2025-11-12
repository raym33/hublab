/**
 * Sentry Client Configuration
 * Monitors errors in the browser
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development'

Sentry.init({
  dsn: SENTRY_DSN,

  // Set environment (development, staging, production)
  environment: SENTRY_ENVIRONMENT,

  // Adjust sample rate for performance monitoring
  tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,

  // Capture 100% of errors
  sampleRate: 1.0,

  // Session Replay for debugging
  replaysSessionSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Remove sensitive query params
    if (event.request?.url) {
      const url = new URL(event.request.url)
      if (url.searchParams.has('token')) {
        url.searchParams.set('token', '[REDACTED]')
        event.request.url = url.toString()
      }
    }

    // Filter out noise
    if (event.exception) {
      const message = event.exception.values?.[0]?.value
      if (message?.includes('ResizeObserver loop')) {
        return null // Don't send to Sentry
      }
    }

    return event
  },

  // Ignore specific errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Loading chunk',
    'ChunkLoadError',
  ],
})

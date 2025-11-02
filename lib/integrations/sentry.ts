// ============================================
// SENTRY ERROR TRACKING INTEGRATION
// Monitor and fix errors in production
// ============================================

import * as Sentry from '@sentry/nextjs'

export type SentryConfig = {
  dsn: string
  environment?: string
  tracesSampleRate?: number
  replaysSessionSampleRate?: number
  replaysOnErrorSampleRate?: number
}

// ============================================
// SENTRY INITIALIZATION
// ============================================

export function initSentry(config?: SentryConfig) {
  const dsn = config?.dsn || process.env.NEXT_PUBLIC_SENTRY_DSN

  if (!dsn) {
    console.warn('Sentry DSN not configured')
    return
  }

  Sentry.init({
    dsn,
    environment: config?.environment || process.env.NODE_ENV || 'development',
    tracesSampleRate: config?.tracesSampleRate || 0.1,
    replaysSessionSampleRate: config?.replaysSessionSampleRate || 0.1,
    replaysOnErrorSampleRate: config?.replaysOnErrorSampleRate || 1.0,
    integrations: [
      Sentry.replayIntegration(),
      Sentry.browserTracingIntegration(),
    ],
  })
}

// ============================================
// ERROR TRACKING
// ============================================

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}

// ============================================
// USER CONTEXT
// ============================================

export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user)
}

export function clearUser() {
  Sentry.setUser(null)
}

// ============================================
// TAGS & CONTEXT
// ============================================

export function setTag(key: string, value: string) {
  Sentry.setTag(key, value)
}

export function setContext(name: string, context: Record<string, any>) {
  Sentry.setContext(name, context)
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

export function startTransaction(name: string, op?: string) {
  return Sentry.startTransaction({
    name,
    op: op || 'http.server',
  })
}

export async function traceFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return Sentry.startSpan({ name }, async () => {
    return await fn()
  })
}

// ============================================
// BREADCRUMBS
// ============================================

export function addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error') {
  Sentry.addBreadcrumb({
    message,
    category: category || 'custom',
    level: level || 'info',
  })
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Initialize Sentry (in your app)
import { initSentry } from '@/lib/integrations/sentry'

// In your root layout or _app.tsx
initSentry({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
  environment: 'production',
})

// Example 2: Capture Errors
import { captureError } from '@/lib/integrations/sentry'

try {
  // Your code
  throw new Error('Something went wrong')
} catch (error) {
  captureError(error as Error, {
    userId: '123',
    action: 'checkout',
  })
}

// Example 3: Set User Context
import { setUser } from '@/lib/integrations/sentry'

setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'john_doe',
})

// Example 4: Track Performance
import { traceFunction } from '@/lib/integrations/sentry'

const result = await traceFunction('fetch-products', async () => {
  const response = await fetch('/api/products')
  return response.json()
})

// Example 5: Add Breadcrumbs
import { addBreadcrumb } from '@/lib/integrations/sentry'

addBreadcrumb('User clicked checkout button', 'user-action', 'info')
addBreadcrumb('Payment failed', 'payment', 'error')

// Example 6: API Error Handler
import { captureError } from '@/lib/integrations/sentry'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // API logic
    return NextResponse.json({ data: [] })
  } catch (error) {
    captureError(error as Error, {
      endpoint: '/api/products',
      method: 'GET',
    })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
*/

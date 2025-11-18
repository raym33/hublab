import { NextResponse } from 'next/server'
import { getServiceStatus, env } from '@/lib/env'

/**
 * Health Check Endpoint
 *
 * Returns service status and configuration health.
 * Useful for monitoring and deployment verification.
 *
 * GET /api/health
 */
export async function GET() {
  const services = getServiceStatus()

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    services: {
      database: services.database ? 'connected' : 'not configured',
      payments: services.payments ? 'enabled' : 'disabled',
      monitoring: services.monitoring ? 'enabled' : 'disabled',
      rateLimiting: services.rateLimiting ? 'enabled' : 'disabled',
      rustEngine: services.rustEngine ? 'configured' : 'not configured',
      ai: services.ai ? 'enabled' : 'disabled',
    },
    version: '2.0.0',
    build: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
  }

  // Check if critical services are available
  const isCriticalHealthy = services.database

  return NextResponse.json(health, {
    status: isCriticalHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}

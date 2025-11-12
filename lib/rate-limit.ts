/**
 * Rate Limiting System with Upstash Redis
 * Protects API routes from abuse
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Different rate limit tiers
export const rateLimiters = {
  // Strict: 10 requests per 10 seconds (auth endpoints)
  strict: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
        prefix: 'ratelimit:strict',
      })
    : null,

  // Standard: 30 requests per minute (most API endpoints)
  standard: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '1 m'),
        analytics: true,
        prefix: 'ratelimit:standard',
      })
    : null,

  // Generous: 100 requests per minute (public endpoints)
  generous: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:generous',
      })
    : null,

  // AI: 20 requests per hour (expensive AI operations)
  ai: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 h'),
        analytics: true,
        prefix: 'ratelimit:ai',
      })
    : null,
}

export type RateLimitTier = keyof typeof rateLimiters

/**
 * Get identifier for rate limiting
 * Uses IP address or API key
 */
export function getIdentifier(request: NextRequest): string {
  // Check for API key first
  const apiKey = request.headers.get('x-api-key')
  if (apiKey) {
    return `api:${apiKey}`
  }

  // Fall back to IP address
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
  return `ip:${ip}`
}

/**
 * Apply rate limiting to a request
 */
export async function rateLimit(
  request: NextRequest,
  tier: RateLimitTier = 'standard'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = rateLimiters[tier]

  // Skip rate limiting if Redis is not configured (development)
  if (!limiter) {
    console.warn('⚠️  Rate limiting disabled - Redis not configured')
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: Date.now() + 60000,
    }
  }

  const identifier = getIdentifier(request)
  const result = await limiter.limit(identifier)

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

/**
 * Middleware helper for rate limiting
 */
export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  tier: RateLimitTier = 'standard'
): Promise<NextResponse> {
  const result = await rateLimit(request, tier)

  // Add rate limit headers to response
  const addHeaders = (response: NextResponse) => {
    response.headers.set('X-RateLimit-Limit', result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.reset.toString())
    return response
  }

  // Return 429 if rate limited
  if (!result.success) {
    const response = NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset).toISOString(),
      },
      { status: 429 }
    )
    return addHeaders(response)
  }

  // Execute handler and add headers
  const response = await handler()
  return addHeaders(response)
}

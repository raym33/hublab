/**
 * Rate Limiting System with Upstash Redis
 * Protects API routes from abuse
 * SECURITY FIX: Added in-memory fallback when Redis is unavailable
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

/**
 * In-memory rate limiter fallback (when Redis is not available)
 * Uses Map to track request counts per identifier
 */
class InMemoryRateLimiter {
  private requests = new Map<string, { count: number; resetAt: number }>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, value] of this.requests.entries()) {
      if (value.resetAt < now) {
        this.requests.delete(key)
      }
    }
  }

  limit(identifier: string, maxRequests: number, windowMs: number) {
    const now = Date.now()
    const record = this.requests.get(identifier)

    // No record or expired - create new
    if (!record || record.resetAt < now) {
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + windowMs
      })
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: now + windowMs
      }
    }

    // Increment count
    record.count++

    // Check if limit exceeded
    if (record.count > maxRequests) {
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: record.resetAt
      }
    }

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - record.count,
      reset: record.resetAt
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.requests.clear()
  }
}

// In-memory fallback limiter
const inMemoryLimiter = new InMemoryRateLimiter()

// Tier configurations for in-memory limiter
const tierConfigs = {
  strict: { maxRequests: 10, windowMs: 10 * 1000 },      // 10 req/10s
  standard: { maxRequests: 30, windowMs: 60 * 1000 },    // 30 req/1m
  generous: { maxRequests: 100, windowMs: 60 * 1000 },   // 100 req/1m
  ai: { maxRequests: 20, windowMs: 60 * 60 * 1000 }      // 20 req/1h
}

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
  const identifier = getIdentifier(request)

  // SECURITY FIX: Use in-memory fallback if Redis is not configured
  if (!limiter) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Using in-memory rate limiting - Redis not configured')
    }

    const config = tierConfigs[tier]
    const result = inMemoryLimiter.limit(
      identifier,
      config.maxRequests,
      config.windowMs
    )

    return result
  }

  // Use Redis-based rate limiting
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

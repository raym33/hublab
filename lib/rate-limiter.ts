/**
 * Rate Limiter with Upstash Redis
 *
 * Distributed rate limiting using Upstash Redis for serverless environments.
 * Falls back to in-memory rate limiting if Redis is not configured.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Check if Upstash Redis is configured
const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const USE_REDIS = !!(UPSTASH_REDIS_URL && UPSTASH_REDIS_TOKEN)

// Initialize Redis client if configured
const redis = USE_REDIS
  ? new Redis({
      url: UPSTASH_REDIS_URL!,
      token: UPSTASH_REDIS_TOKEN!,
    })
  : null

/**
 * In-memory fallback for development/testing
 */
interface TokenBucket {
  tokens: number
  lastRefill: number
}

class InMemoryRateLimiter {
  private buckets = new Map<string, TokenBucket>()
  private maxTokens: number
  private refillRate: number
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  constructor(maxTokens = 10, refillRate = 1) {
    this.maxTokens = maxTokens
    this.refillRate = refillRate

    // Clean up old buckets every 5 minutes
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup()
      }, 5 * 60 * 1000)
    }
  }

  allowRequest(identifier: string): boolean {
    const bucket = this.getBucket(identifier)
    this.refillBucket(bucket)

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1
      return true
    }

    return false
  }

  getStatus(identifier: string): {
    allowed: boolean
    remaining: number
    resetIn: number
  } {
    const bucket = this.getBucket(identifier)
    this.refillBucket(bucket)

    return {
      allowed: bucket.tokens >= 1,
      remaining: Math.floor(bucket.tokens),
      resetIn: Math.ceil((1 - bucket.tokens) / this.refillRate),
    }
  }

  private getBucket(identifier: string): TokenBucket {
    if (!this.buckets.has(identifier)) {
      this.buckets.set(identifier, {
        tokens: this.maxTokens,
        lastRefill: Date.now(),
      })
    }
    return this.buckets.get(identifier)!
  }

  private refillBucket(bucket: TokenBucket): void {
    const now = Date.now()
    const timePassed = (now - bucket.lastRefill) / 1000
    const tokensToAdd = timePassed * this.refillRate

    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now
  }

  private cleanup(): void {
    const now = Date.now()
    const maxAge = 10 * 60 * 1000

    for (const [identifier, bucket] of this.buckets.entries()) {
      if (now - bucket.lastRefill > maxAge) {
        this.buckets.delete(identifier)
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }

  getStats() {
    return {
      totalBuckets: this.buckets.size,
      maxTokens: this.maxTokens,
      refillRate: this.refillRate,
    }
  }
}

/**
 * Unified rate limiter interface
 * Uses Upstash Redis in production, falls back to in-memory for development
 */
class DistributedRateLimiter {
  private upstashLimiter: Ratelimit | null = null
  private fallbackLimiter: InMemoryRateLimiter
  private prefix: string

  constructor(
    maxRequests: number,
    windowSeconds: number,
    prefix: string = 'ratelimit'
  ) {
    this.prefix = prefix
    this.fallbackLimiter = new InMemoryRateLimiter(
      maxRequests,
      maxRequests / windowSeconds
    )

    // Initialize Upstash rate limiter if Redis is available
    if (redis) {
      this.upstashLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
        prefix: `hublab:${prefix}`,
        analytics: true,
      })
    }
  }

  /**
   * Check if request is allowed
   */
  async allowRequest(identifier: string): Promise<boolean> {
    if (this.upstashLimiter) {
      try {
        const { success } = await this.upstashLimiter.limit(identifier)
        return success
      } catch (error) {
        console.warn(`[RateLimiter] Upstash error, using fallback:`, error)
        return this.fallbackLimiter.allowRequest(identifier)
      }
    }

    return this.fallbackLimiter.allowRequest(identifier)
  }

  /**
   * Get rate limit status
   */
  async getStatus(identifier: string): Promise<{
    allowed: boolean
    remaining: number
    resetIn: number
  }> {
    if (this.upstashLimiter) {
      try {
        const result = await this.upstashLimiter.limit(identifier)
        return {
          allowed: result.success,
          remaining: result.remaining,
          resetIn: Math.ceil((result.reset - Date.now()) / 1000),
        }
      } catch (error) {
        console.warn(`[RateLimiter] Upstash error, using fallback:`, error)
        return this.fallbackLimiter.getStatus(identifier)
      }
    }

    return this.fallbackLimiter.getStatus(identifier)
  }

  /**
   * Synchronous check (uses fallback only - for backwards compatibility)
   */
  allowRequestSync(identifier: string): boolean {
    return this.fallbackLimiter.allowRequest(identifier)
  }

  getStats() {
    return {
      backend: this.upstashLimiter ? 'upstash' : 'memory',
      prefix: this.prefix,
      ...this.fallbackLimiter.getStats(),
    }
  }

  destroy(): void {
    this.fallbackLimiter.destroy()
  }
}

// Rate limiter instances for different API tiers
// strict: 30 requests per minute (0.5/sec)
// standard: 60 requests per minute (1/sec)
// generous: 180 requests per minute (3/sec)

export const strictLimiter = new DistributedRateLimiter(30, 60, 'strict')
export const standardLimiter = new DistributedRateLimiter(60, 60, 'standard')
export const generousLimiter = new DistributedRateLimiter(180, 60, 'generous')

/**
 * Get client identifier from request
 */
export function getClientIdentifier(
  request: Request,
  useIP = true
): string {
  if (useIP) {
    // Get IP from various headers (in order of reliability)
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = cfConnectingIp || forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
    return `ip:${ip}`
  }

  // Fallback to user-agent
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `ua:${userAgent.slice(0, 50)}`
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse(resetIn: number) {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
      resetIn,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(resetIn),
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Date.now() + resetIn * 1000),
      },
    }
  )
}

/**
 * Check if distributed rate limiting is available
 */
export function isDistributedRateLimitingEnabled(): boolean {
  return USE_REDIS
}

// Export types
export { DistributedRateLimiter, InMemoryRateLimiter }

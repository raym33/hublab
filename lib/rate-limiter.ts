/**
 * Rate Limiter
 *
 * Token bucket algorithm implementation for API rate limiting.
 * Prevents abuse and ensures fair usage across clients.
 */

interface TokenBucket {
  tokens: number
  lastRefill: number
}

class RateLimiter {
  private buckets = new Map<string, TokenBucket>()
  private maxTokens: number
  private refillRate: number // tokens per second
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(maxTokens = 10, refillRate = 1) {
    this.maxTokens = maxTokens
    this.refillRate = refillRate

    // Clean up old buckets every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check if request is allowed and consume a token
   */
  allowRequest(identifier: string): boolean {
    const bucket = this.getBucket(identifier)
    this.refillBucket(bucket)

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1
      return true
    }

    return false
  }

  /**
   * Get current rate limit status
   */
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
    const timePassed = (now - bucket.lastRefill) / 1000 // in seconds
    const tokensToAdd = timePassed * this.refillRate

    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now
  }

  private cleanup(): void {
    const now = Date.now()
    const maxAge = 10 * 60 * 1000 // 10 minutes

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

// Rate limiter instances for different API tiers
export const strictLimiter = new RateLimiter(5, 0.5) // 5 requests, refills 0.5/sec (30/min)
export const standardLimiter = new RateLimiter(10, 1) // 10 requests, refills 1/sec (60/min)
export const generousLimiter = new RateLimiter(30, 3) // 30 requests, refills 3/sec (180/min)

/**
 * Get client identifier from request
 */
export function getClientIdentifier(
  request: Request,
  useIP = true
): string {
  if (useIP) {
    // Get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
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

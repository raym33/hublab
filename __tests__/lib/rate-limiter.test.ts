/**
 * Unit tests for Rate Limiter
 * Tests token bucket algorithm and rate limiting functionality
 */

import { getClientIdentifier, rateLimitResponse } from '@/lib/rate-limiter'

// Create a test RateLimiter class to avoid using the singleton instances
class TestRateLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>()
  private maxTokens: number
  private refillRate: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(maxTokens = 10, refillRate = 1) {
    this.maxTokens = maxTokens
    this.refillRate = refillRate
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

  private getBucket(identifier: string) {
    if (!this.buckets.has(identifier)) {
      this.buckets.set(identifier, {
        tokens: this.maxTokens,
        lastRefill: Date.now(),
      })
    }
    return this.buckets.get(identifier)!
  }

  private refillBucket(bucket: { tokens: number; lastRefill: number }): void {
    const now = Date.now()
    const timePassed = (now - bucket.lastRefill) / 1000
    const tokensToAdd = timePassed * this.refillRate

    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now
  }

  getStats() {
    return {
      totalBuckets: this.buckets.size,
      maxTokens: this.maxTokens,
      refillRate: this.refillRate,
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

describe('RateLimiter', () => {
  let limiter: TestRateLimiter

  beforeEach(() => {
    limiter = new TestRateLimiter(10, 1)
  })

  afterEach(() => {
    limiter.destroy()
  })

  describe('allowRequest', () => {
    it('should allow requests within limit', () => {
      const client = 'test-client'

      for (let i = 0; i < 10; i++) {
        expect(limiter.allowRequest(client)).toBe(true)
      }
    })

    it('should deny requests exceeding limit', () => {
      const client = 'test-client'

      // Consume all tokens
      for (let i = 0; i < 10; i++) {
        limiter.allowRequest(client)
      }

      // Next request should be denied
      expect(limiter.allowRequest(client)).toBe(false)
    })

    it('should track different clients separately', () => {
      const client1 = 'client-1'
      const client2 = 'client-2'

      // Client 1 uses all tokens
      for (let i = 0; i < 10; i++) {
        limiter.allowRequest(client1)
      }

      // Client 2 should still have tokens
      expect(limiter.allowRequest(client2)).toBe(true)
    })

    it('should refill tokens over time', async () => {
      const client = 'test-client'

      // Consume all tokens
      for (let i = 0; i < 10; i++) {
        limiter.allowRequest(client)
      }

      expect(limiter.allowRequest(client)).toBe(false)

      // Wait for 1 second to refill 1 token
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(limiter.allowRequest(client)).toBe(true)
    })

    it('should not exceed max tokens', async () => {
      const client = 'test-client'

      // Wait for refill
      await new Promise(resolve => setTimeout(resolve, 2000))

      const status = limiter.getStatus(client)
      expect(status.remaining).toBeLessThanOrEqual(10)
    })
  })

  describe('getStatus', () => {
    it('should return correct status for new client', () => {
      const client = 'new-client'
      const status = limiter.getStatus(client)

      expect(status.allowed).toBe(true)
      expect(status.remaining).toBe(10)
    })

    it('should return correct remaining tokens', () => {
      const client = 'test-client'

      limiter.allowRequest(client)
      limiter.allowRequest(client)
      limiter.allowRequest(client)

      const status = limiter.getStatus(client)
      expect(status.remaining).toBe(7)
    })

    it('should indicate when limit is exceeded', () => {
      const client = 'test-client'

      // Consume all tokens
      for (let i = 0; i < 10; i++) {
        limiter.allowRequest(client)
      }

      const status = limiter.getStatus(client)
      expect(status.allowed).toBe(false)
      expect(status.remaining).toBe(0)
    })

    it('should calculate reset time', () => {
      const client = 'test-client'

      // Consume all tokens
      for (let i = 0; i < 10; i++) {
        limiter.allowRequest(client)
      }

      const status = limiter.getStatus(client)
      expect(status.resetIn).toBeGreaterThan(0)
    })
  })

  describe('getStats', () => {
    it('should return correct configuration', () => {
      const stats = limiter.getStats()

      expect(stats.maxTokens).toBe(10)
      expect(stats.refillRate).toBe(1)
    })

    it('should track total buckets', () => {
      limiter.allowRequest('client-1')
      limiter.allowRequest('client-2')
      limiter.allowRequest('client-3')

      const stats = limiter.getStats()
      expect(stats.totalBuckets).toBe(3)
    })
  })

  describe('different rate limits', () => {
    it('should work with strict limiter settings', () => {
      const strictLimiter = new TestRateLimiter(5, 0.5)
      const client = 'test-client'

      // Should allow 5 requests
      for (let i = 0; i < 5; i++) {
        expect(strictLimiter.allowRequest(client)).toBe(true)
      }

      // Should deny 6th request
      expect(strictLimiter.allowRequest(client)).toBe(false)

      strictLimiter.destroy()
    })

    it('should work with generous limiter settings', () => {
      const generousLimiter = new TestRateLimiter(30, 3)
      const client = 'test-client'

      // Should allow 30 requests
      for (let i = 0; i < 30; i++) {
        expect(generousLimiter.allowRequest(client)).toBe(true)
      }

      // Should deny 31st request
      expect(generousLimiter.allowRequest(client)).toBe(false)

      generousLimiter.destroy()
    })
  })
})

describe('getClientIdentifier', () => {
  it('should extract IP from x-forwarded-for header', () => {
    const request = new Request('https://example.com', {
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1'
      }
    })

    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:192.168.1.1')
  })

  it('should extract IP from x-real-ip header', () => {
    const request = new Request('https://example.com', {
      headers: {
        'x-real-ip': '192.168.1.2'
      }
    })

    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:192.168.1.2')
  })

  it('should prefer x-forwarded-for over x-real-ip', () => {
    const request = new Request('https://example.com', {
      headers: {
        'x-forwarded-for': '192.168.1.1',
        'x-real-ip': '192.168.1.2'
      }
    })

    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:192.168.1.1')
  })

  it('should use unknown when no IP headers present', () => {
    const request = new Request('https://example.com')

    const identifier = getClientIdentifier(request)
    expect(identifier).toBe('ip:unknown')
  })

  it('should use user-agent when useIP is false', () => {
    const request = new Request('https://example.com', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Test Browser)'
      }
    })

    const identifier = getClientIdentifier(request, false)
    expect(identifier).toBe('ua:Mozilla/5.0 (Test Browser)')
  })

  it('should truncate long user-agent strings', () => {
    const longUA = 'A'.repeat(100)
    const request = new Request('https://example.com', {
      headers: {
        'user-agent': longUA
      }
    })

    const identifier = getClientIdentifier(request, false)
    expect(identifier).toBe(`ua:${'A'.repeat(50)}`)
    expect(identifier.length).toBe(53) // 'ua:' + 50 chars
  })

  it('should handle missing user-agent', () => {
    const request = new Request('https://example.com')

    const identifier = getClientIdentifier(request, false)
    expect(identifier).toBe('ua:unknown')
  })
})

describe('rateLimitResponse', () => {
  it('should create proper rate limit response', async () => {
    const response = rateLimitResponse(60)

    expect(response.status).toBe(429)

    const body = await response.json()
    expect(body.error).toBe('Too many requests')
    expect(body.resetIn).toBe(60)
  })

  it('should include correct headers', () => {
    const response = rateLimitResponse(30)

    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(response.headers.get('Retry-After')).toBe('30')
    expect(response.headers.get('X-RateLimit-Limit')).toBe('60')
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
    expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy()
  })

  it('should include helpful error message', async () => {
    const response = rateLimitResponse(45)
    const body = await response.json()

    expect(body.message).toContain('45 seconds')
  })

  it('should calculate reset timestamp correctly', () => {
    const resetIn = 120
    const beforeTime = Date.now()
    const response = rateLimitResponse(resetIn)
    const afterTime = Date.now()

    const resetHeader = response.headers.get('X-RateLimit-Reset')
    const resetTimestamp = Number(resetHeader)

    // Reset timestamp should be roughly current time + resetIn seconds
    expect(resetTimestamp).toBeGreaterThanOrEqual(beforeTime + resetIn * 1000)
    expect(resetTimestamp).toBeLessThanOrEqual(afterTime + resetIn * 1000 + 100) // 100ms tolerance
  })
})

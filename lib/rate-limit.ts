/**
 * Simple in-memory rate limiting
 * For production, consider using Redis-based rate limiting with @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @param limit - Maximum number of requests allowed in the window
   * @param windowMs - Time window in milliseconds
   * @returns true if request is allowed, false if rate limited
   */
  check(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // No entry or expired - allow and create new entry
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (entry.count >= limit) {
      // Rate limit exceeded
      return false
    }

    // Increment count
    entry.count++
    return true
  }

  /**
   * Get the reset time for a given identifier
   */
  getResetTime(identifier: string): number | null {
    const entry = this.requests.get(identifier)
    return entry ? entry.resetTime : null
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }

  /**
   * Clear all entries (for testing)
   */
  clear(): void {
    this.requests.clear()
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.requests.clear()
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // Fallback to a default if we can't determine the IP
  // In production, this should be handled differently
  return 'unknown'
}

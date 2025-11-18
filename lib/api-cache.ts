/**
 * API Response Cache
 *
 * In-memory LRU cache for API responses to reduce computation
 * and improve response times for frequently accessed data.
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  hits: number
}

class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private maxSize: number
  private ttl: number // Time to live in milliseconds

  constructor(maxSize = 100, ttlMinutes = 5) {
    this.maxSize = maxSize
    this.ttl = ttlMinutes * 60 * 1000
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    const isExpired = Date.now() - entry.timestamp > this.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    // Update hits for LRU tracking
    entry.hits++
    return entry.data
  }

  set(key: string, data: T): void {
    // If cache is full, remove least recently used
    if (this.cache.size >= this.maxSize) {
      this.evictLRU()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
    })
  }

  private evictLRU(): void {
    let lruKey: string | null = null
    let lruHits = Infinity

    // Find entry with lowest hits
    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < lruHits) {
        lruHits = entry.hits
        lruKey = key
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey)
    }
  }

  clear(): void {
    this.cache.clear()
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        hits: entry.hits,
      })),
    }
  }
}

// Cache instances for different API endpoints
export const searchCache = new LRUCache<unknown>(100, 5) // 100 entries, 5 min TTL
export const capsuleCache = new LRUCache<unknown>(200, 10) // 200 entries, 10 min TTL

/**
 * Generate cache key from request parameters
 */
export function getCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('&')

  return `${prefix}:${sortedParams}`
}

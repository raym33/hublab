// ============================================
// VERCEL KV INTEGRATION HELPERS
// Redis-compatible key-value storage powered by Upstash
// ============================================

import { kv } from '@vercel/kv'

export type KVConfig = {
  url?: string
  token?: string
}

// ============================================
// BASIC OPERATIONS
// ============================================

export async function kvSet(key: string, value: any, expiresInSeconds?: number) {
  if (expiresInSeconds) {
    await kv.set(key, value, { ex: expiresInSeconds })
  } else {
    await kv.set(key, value)
  }
  return { success: true, key }
}

export async function kvGet<T = any>(key: string): Promise<T | null> {
  const value = await kv.get<T>(key)
  return value
}

export async function kvDelete(key: string) {
  await kv.del(key)
  return { success: true, key }
}

export async function kvExists(key: string): Promise<boolean> {
  const result = await kv.exists(key)
  return result === 1
}

// ============================================
// ADVANCED OPERATIONS
// ============================================

export async function kvIncrement(key: string, by: number = 1): Promise<number> {
  const result = await kv.incrby(key, by)
  return result
}

export async function kvDecrement(key: string, by: number = 1): Promise<number> {
  const result = await kv.decrby(key, by)
  return result
}

export async function kvExpire(key: string, seconds: number) {
  await kv.expire(key, seconds)
  return { success: true, key, expiresIn: seconds }
}

export async function kvGetTTL(key: string): Promise<number> {
  const ttl = await kv.ttl(key)
  return ttl
}

// ============================================
// HASH OPERATIONS
// ============================================

export async function kvHashSet(key: string, field: string, value: any) {
  await kv.hset(key, { [field]: value })
  return { success: true, key, field }
}

export async function kvHashGet<T = any>(key: string, field: string): Promise<T | null> {
  const value = await kv.hget<T>(key, field)
  return value
}

export async function kvHashGetAll<T = Record<string, any>>(key: string): Promise<T | null> {
  const value = await kv.hgetall<T>(key)
  return value
}

export async function kvHashDelete(key: string, ...fields: string[]) {
  await kv.hdel(key, ...fields)
  return { success: true, key, fields }
}

// ============================================
// LIST OPERATIONS
// ============================================

export async function kvListPush(key: string, ...values: any[]) {
  const result = await kv.rpush(key, ...values)
  return { success: true, key, length: result }
}

export async function kvListPop<T = any>(key: string): Promise<T | null> {
  const value = await kv.rpop<T>(key)
  return value
}

export async function kvListRange<T = any>(key: string, start: number = 0, stop: number = -1): Promise<T[]> {
  const values = await kv.lrange<T>(key, start, stop)
  return values
}

export async function kvListLength(key: string): Promise<number> {
  const length = await kv.llen(key)
  return length
}

// ============================================
// SET OPERATIONS
// ============================================

export async function kvSetAdd(key: string, ...members: string[]) {
  const result = await kv.sadd(key, ...members)
  return { success: true, key, added: result }
}

export async function kvSetRemove(key: string, ...members: string[]) {
  const result = await kv.srem(key, ...members)
  return { success: true, key, removed: result }
}

export async function kvSetMembers(key: string): Promise<string[]> {
  const members = await kv.smembers(key)
  return members
}

export async function kvSetIsMember(key: string, member: string): Promise<boolean> {
  const result = await kv.sismember(key, member)
  return result === 1
}

// ============================================
// SORTED SET OPERATIONS
// ============================================

export async function kvSortedSetAdd(key: string, score: number, member: string) {
  await kv.zadd(key, { score, member })
  return { success: true, key, member, score }
}

export async function kvSortedSetRange(key: string, start: number = 0, stop: number = -1) {
  const members = await kv.zrange(key, start, stop)
  return members
}

export async function kvSortedSetRangeByScore(key: string, min: number, max: number) {
  const members = await kv.zrange(key, min, max, { byScore: true })
  return members
}

export async function kvSortedSetScore(key: string, member: string): Promise<number | null> {
  const score = await kv.zscore(key, member)
  return score
}

// ============================================
// COMMON USE CASES
// ============================================

// Session Management
export async function saveSession(sessionId: string, data: any, expiresInSeconds: number = 86400) {
  return kvSet(`session:${sessionId}`, data, expiresInSeconds)
}

export async function getSession<T = any>(sessionId: string): Promise<T | null> {
  return kvGet<T>(`session:${sessionId}`)
}

export async function deleteSession(sessionId: string) {
  return kvDelete(`session:${sessionId}`)
}

// Rate Limiting
export async function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${identifier}`
  const current = await kvIncrement(key)

  if (current === 1) {
    await kvExpire(key, windowSeconds)
  }

  const allowed = current <= maxRequests
  const remaining = Math.max(0, maxRequests - current)

  return { allowed, remaining }
}

// Caching
export async function cacheSet(key: string, data: any, ttlSeconds: number = 3600) {
  return kvSet(`cache:${key}`, data, ttlSeconds)
}

export async function cacheGet<T = any>(key: string): Promise<T | null> {
  return kvGet<T>(`cache:${key}`)
}

export async function cacheInvalidate(key: string) {
  return kvDelete(`cache:${key}`)
}

// Counters
export async function incrementCounter(name: string, by: number = 1): Promise<number> {
  return kvIncrement(`counter:${name}`, by)
}

export async function getCounter(name: string): Promise<number> {
  const value = await kvGet<number>(`counter:${name}`)
  return value || 0
}

// Feature Flags
export async function setFeatureFlag(name: string, enabled: boolean) {
  return kvSet(`feature:${name}`, enabled)
}

export async function isFeatureEnabled(name: string): Promise<boolean> {
  const value = await kvGet<boolean>(`feature:${name}`)
  return value === true
}

// Leaderboard
export async function addToLeaderboard(leaderboardName: string, userId: string, score: number) {
  return kvSortedSetAdd(`leaderboard:${leaderboardName}`, score, userId)
}

export async function getLeaderboard(leaderboardName: string, limit: number = 10) {
  const members = await kvSortedSetRange(`leaderboard:${leaderboardName}`, 0, limit - 1)
  return members
}

export async function getUserScore(leaderboardName: string, userId: string): Promise<number | null> {
  return kvSortedSetScore(`leaderboard:${leaderboardName}`, userId)
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Basic Key-Value Operations
import { kvSet, kvGet, kvDelete } from '@/lib/integrations/vercel-kv'

// Set a value
await kvSet('user:123', { name: 'John', email: 'john@example.com' })

// Get a value
const user = await kvGet('user:123')
console.log(user)

// Delete a value
await kvDelete('user:123')

// Example 2: Set with Expiration
await kvSet('otp:user123', '123456', 300) // Expires in 5 minutes

// Example 3: Session Management
import { saveSession, getSession, deleteSession } from '@/lib/integrations/vercel-kv'

// Save session
await saveSession('session_abc123', {
  userId: '123',
  email: 'user@example.com',
  role: 'admin',
}, 86400) // 24 hours

// Get session
const session = await getSession('session_abc123')
if (session) {
  console.log('User:', session.userId)
}

// Delete session (logout)
await deleteSession('session_abc123')

// Example 4: Rate Limiting
import { checkRateLimit } from '@/lib/integrations/vercel-kv'

const { allowed, remaining } = await checkRateLimit(
  'user:123',
  10, // max 10 requests
  60  // per 60 seconds
)

if (!allowed) {
  throw new Error('Rate limit exceeded. Try again later.')
}

console.log(`Remaining requests: ${remaining}`)

// Example 5: Caching API Responses
import { cacheSet, cacheGet, cacheInvalidate } from '@/lib/integrations/vercel-kv'

async function getUsers() {
  // Try to get from cache
  const cached = await cacheGet('users:all')
  if (cached) {
    return cached
  }

  // Fetch from database
  const users = await db.users.findMany()

  // Cache for 1 hour
  await cacheSet('users:all', users, 3600)

  return users
}

// Invalidate cache when data changes
await cacheInvalidate('users:all')

// Example 6: Counters
import { incrementCounter, getCounter } from '@/lib/integrations/vercel-kv'

// Increment page views
await incrementCounter('pageviews:/about')

// Get total views
const views = await getCounter('pageviews:/about')
console.log(`Page views: ${views}`)

// Example 7: Feature Flags
import { setFeatureFlag, isFeatureEnabled } from '@/lib/integrations/vercel-kv'

// Enable a feature
await setFeatureFlag('new-dashboard', true)

// Check if feature is enabled
const enabled = await isFeatureEnabled('new-dashboard')
if (enabled) {
  // Show new dashboard
}

// Example 8: Leaderboard
import { addToLeaderboard, getLeaderboard, getUserScore } from '@/lib/integrations/vercel-kv'

// Add score
await addToLeaderboard('global', 'user123', 1500)

// Get top 10
const top10 = await getLeaderboard('global', 10)
console.log('Top 10:', top10)

// Get user's score
const score = await getUserScore('global', 'user123')
console.log(`Your score: ${score}`)

// Example 9: API Route with Rate Limiting
import { checkRateLimit } from '@/lib/integrations/vercel-kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  // Check rate limit: max 5 requests per minute
  const { allowed, remaining } = await checkRateLimit(ip, 5, 60)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

  // Process request
  return NextResponse.json({ success: true, remaining })
}

// Example 10: API Route with Caching
import { cacheGet, cacheSet } from '@/lib/integrations/vercel-kv'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cacheKey = 'api:products'

  // Try cache first
  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  // Fetch from database
  const products = await db.products.findMany()

  // Cache for 5 minutes
  await cacheSet(cacheKey, products, 300)

  return NextResponse.json(products)
}

// Example 11: Hash Operations (User Profiles)
import { kvHashSet, kvHashGetAll } from '@/lib/integrations/vercel-kv'

// Save user profile fields
await kvHashSet('profile:123', 'name', 'John Doe')
await kvHashSet('profile:123', 'email', 'john@example.com')
await kvHashSet('profile:123', 'avatar', 'https://...')

// Get all profile fields
const profile = await kvHashGetAll('profile:123')
console.log(profile)

// Example 12: List Operations (Task Queue)
import { kvListPush, kvListPop, kvListLength } from '@/lib/integrations/vercel-kv'

// Add tasks to queue
await kvListPush('tasks:pending', { id: 1, action: 'send-email' })
await kvListPush('tasks:pending', { id: 2, action: 'process-image' })

// Get queue length
const queueLength = await kvListLength('tasks:pending')
console.log(`Tasks in queue: ${queueLength}`)

// Process next task
const task = await kvListPop('tasks:pending')
if (task) {
  console.log('Processing:', task)
}
*/

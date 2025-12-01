// ============================================
// HUBLAB API AUTHENTICATION
// API key generation, validation, and rate limiting
// ============================================

import { createClient } from '@supabase/supabase-js'
import type { APIKey, APIKeyTier, RateLimit } from '@/types/api'
import { RATE_LIMITS } from '@/types/api'

// Lazy-loaded Supabase client for API key management
let _supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (_supabaseClient !== null) {
    return _supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  // During build/SSG, use placeholder to avoid errors
  if (!supabaseUrl && typeof window === 'undefined') {
    _supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key')
    return _supabaseClient
  }

  _supabaseClient = createClient(supabaseUrl, supabaseServiceKey)
  return _supabaseClient
}

// Proxy to lazy-load the client
const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof ReturnType<typeof createClient>]
  }
})

// ============================================
// API KEY GENERATION
// ============================================

/**
 * Generate a new API key with format: hublab_sk_<random_string>
 */
export function generateAPIKey(): string {
  const prefix = 'hublab_sk_'
  const randomBytes = crypto.getRandomValues(new Uint8Array(32))
  const randomString = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return prefix + randomString
}

/**
 * Create a new API key for a user
 */
export async function createAPIKey(
  userId: string,
  name: string,
  tier: APIKeyTier = 'free'
): Promise<{ success: boolean; apiKey?: APIKey; error?: string }> {
  try {
    const key = generateAPIKey()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        key,
        name,
        tier,
        user_id: userId,
        created_at: now,
        last_used_at: null,
        is_active: true,
        rate_limit: RATE_LIMITS[tier],
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      apiKey: {
        id: data.id,
        key: data.key,
        name: data.name,
        tier: data.tier,
        userId: data.user_id,
        createdAt: data.created_at,
        lastUsedAt: data.last_used_at,
        rateLimit: data.rate_limit,
        isActive: data.is_active,
      },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// ============================================
// API KEY VALIDATION
// ============================================

/**
 * Validate API key format
 */
export function isValidAPIKeyFormat(key: string): boolean {
  return /^hublab_sk_[a-f0-9]{64}$/.test(key)
}

/**
 * Validate and retrieve API key from database
 */
export async function validateAPIKey(
  key: string
): Promise<{ valid: boolean; apiKey?: APIKey; error?: string }> {
  // Check format first
  if (!isValidAPIKeyFormat(key)) {
    return { valid: false, error: 'Invalid API key format' }
  }

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return { valid: false, error: 'Invalid or inactive API key' }
    }

    // Update last_used_at timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)

    return {
      valid: true,
      apiKey: {
        id: data.id,
        key: data.key,
        name: data.name,
        tier: data.tier,
        userId: data.user_id,
        createdAt: data.created_at,
        lastUsedAt: data.last_used_at,
        rateLimit: data.rate_limit,
        isActive: data.is_active,
      },
    }
  } catch (error) {
    return { valid: false, error: String(error) }
  }
}

/**
 * Extract API key from Authorization header
 */
export function extractAPIKey(authHeader: string | null): string | null {
  if (!authHeader) return null

  // Support both "Bearer <key>" and just "<key>"
  const parts = authHeader.split(' ')
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1]
  }
  if (parts.length === 1) {
    return parts[0]
  }

  return null
}

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitCheck {
  allowed: boolean
  limit?: number
  remaining?: number
  resetAt?: Date
  error?: string
}

/**
 * Check if API key has exceeded rate limits
 */
export async function checkRateLimit(
  apiKeyId: string,
  limitType: keyof RateLimit
): Promise<RateLimitCheck> {
  try {
    // Get the API key to check tier and limits
    const { data: apiKeyData, error: keyError } = await supabase
      .from('api_keys')
      .select('tier, rate_limit')
      .eq('id', apiKeyId)
      .single()

    if (keyError || !apiKeyData) {
      return { allowed: false, error: 'API key not found' }
    }

    const rateLimit = apiKeyData.rate_limit as RateLimit

    // Determine time window based on limit type
    let windowMinutes: number
    let maxRequests: number

    switch (limitType) {
      case 'projectsPerHour':
        windowMinutes = 60
        maxRequests = rateLimit.projectsPerHour
        break
      case 'exportsPerDay':
        windowMinutes = 60 * 24
        maxRequests = rateLimit.exportsPerDay
        break
      case 'deploysPerDay':
        windowMinutes = 60 * 24
        maxRequests = rateLimit.deploysPerDay
        break
      case 'requestsPerMinute':
        windowMinutes = 1
        maxRequests = rateLimit.requestsPerMinute
        break
      default:
        return { allowed: false, error: 'Invalid limit type' }
    }

    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

    // Count requests in the current window
    const { count, error: countError } = await supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .eq('api_key_id', apiKeyId)
      .eq('action_type', limitType)
      .gte('created_at', windowStart.toISOString())

    if (countError) {
      return { allowed: false, error: countError.message }
    }

    const remaining = Math.max(0, maxRequests - (count || 0))
    const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000)

    if ((count || 0) >= maxRequests) {
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetAt,
        error: `Rate limit exceeded. Limit: ${maxRequests} per ${windowMinutes} minutes`,
      }
    }

    return {
      allowed: true,
      limit: maxRequests,
      remaining,
      resetAt,
    }
  } catch (error) {
    return { allowed: false, error: String(error) }
  }
}

/**
 * Record API usage for rate limiting
 */
export async function recordAPIUsage(
  apiKeyId: string,
  actionType: keyof RateLimit,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('api_usage').insert({
      api_key_id: apiKeyId,
      action_type: actionType,
      metadata,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to record API usage:', error)
  }
}

// ============================================
// API KEY MANAGEMENT
// ============================================

/**
 * List all API keys for a user
 */
export async function listAPIKeys(
  userId: string
): Promise<{ success: boolean; apiKeys?: APIKey[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    const apiKeys = data.map((key) => ({
      id: key.id,
      key: key.key,
      name: key.name,
      tier: key.tier,
      userId: key.user_id,
      createdAt: key.created_at,
      lastUsedAt: key.last_used_at,
      rateLimit: key.rate_limit,
      isActive: key.is_active,
    }))

    return { success: true, apiKeys }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

/**
 * Revoke (deactivate) an API key
 */
export async function revokeAPIKey(
  keyId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId)
      .eq('user_id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

/**
 * Update API key tier (upgrade/downgrade)
 */
export async function updateAPIKeyTier(
  keyId: string,
  userId: string,
  newTier: APIKeyTier
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({
        tier: newTier,
        rate_limit: RATE_LIMITS[newTier],
      })
      .eq('id', keyId)
      .eq('user_id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

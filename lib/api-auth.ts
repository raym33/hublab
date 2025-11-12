/**
 * API Key Authentication System
 * Secure API access with key-based authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  : null

export interface APIKey {
  id: string
  key: string
  user_id: string
  name: string
  permissions: string[]
  rate_limit_tier: 'strict' | 'standard' | 'generous'
  expires_at?: string
  created_at: string
  last_used_at?: string
}

/**
 * Validate API key from request headers
 */
export async function validateAPIKey(
  request: NextRequest
): Promise<{ valid: boolean; key?: APIKey; error?: string }> {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')

  if (!apiKey) {
    return { valid: false, error: 'API key is required' }
  }

  // Skip validation if Supabase is not configured (development)
  if (!supabase) {
    console.warn('⚠️  API key validation disabled - Supabase not configured')
    return {
      valid: true,
      key: {
        id: 'dev-key',
        key: apiKey,
        user_id: 'dev-user',
        name: 'Development Key',
        permissions: ['*'],
        rate_limit_tier: 'generous',
        created_at: new Date().toISOString(),
      },
    }
  }

  try {
    // Query API keys table
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    if (error || !data) {
      return { valid: false, error: 'Invalid API key' }
    }

    // Check if key is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'API key has expired' }
    }

    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)

    return { valid: true, key: data }
  } catch (error) {
    console.error('API key validation error:', error)
    return { valid: false, error: 'Failed to validate API key' }
  }
}

/**
 * Check if API key has specific permission
 */
export function hasPermission(key: APIKey, permission: string): boolean {
  // Wildcard permission grants all access
  if (key.permissions.includes('*')) {
    return true
  }

  // Check exact match
  if (key.permissions.includes(permission)) {
    return true
  }

  // Check wildcard patterns (e.g., "capsules:*" matches "capsules:read")
  return key.permissions.some(p => {
    if (p.endsWith(':*')) {
      const prefix = p.slice(0, -2)
      return permission.startsWith(prefix)
    }
    return false
  })
}

/**
 * Middleware for API key authentication
 */
export async function withAPIAuth(
  request: NextRequest,
  handler: (key: APIKey) => Promise<NextResponse>,
  options?: {
    requiredPermission?: string
  }
): Promise<NextResponse> {
  const result = await validateAPIKey(request)

  if (!result.valid) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: result.error || 'Invalid API key',
      },
      { status: 401 }
    )
  }

  // Check permissions if required
  if (options?.requiredPermission && result.key) {
    if (!hasPermission(result.key, options.requiredPermission)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: `Missing permission: ${options.requiredPermission}`,
        },
        { status: 403 }
      )
    }
  }

  return handler(result.key!)
}

/**
 * Generate a new API key
 * (To be called from authenticated API endpoint)
 */
export async function generateAPIKey(
  userId: string,
  name: string,
  permissions: string[] = ['*'],
  rateLimitTier: 'strict' | 'standard' | 'generous' = 'standard',
  expiresInDays?: number
): Promise<{ key: string; id: string } | null> {
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  // Generate random API key
  const key = `sk_${generateRandomString(48)}`

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        key,
        user_id: userId,
        name,
        permissions,
        rate_limit_tier: rateLimitTier,
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (error || !data) {
      console.error('Failed to create API key:', error)
      return null
    }

    return { key: data.key, id: data.id }
  } catch (error) {
    console.error('API key generation error:', error)
    return null
  }
}

/**
 * Generate random string for API keys
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }

  return result
}

/**
 * Permission constants
 */
export const Permissions = {
  // Capsules
  CAPSULES_READ: 'capsules:read',
  CAPSULES_CREATE: 'capsules:create',
  CAPSULES_UPDATE: 'capsules:update',
  CAPSULES_DELETE: 'capsules:delete',
  CAPSULES_ALL: 'capsules:*',

  // Projects
  PROJECTS_READ: 'projects:read',
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_UPDATE: 'projects:update',
  PROJECTS_DELETE: 'projects:delete',
  PROJECTS_ALL: 'projects:*',

  // AI
  AI_COMPILE: 'ai:compile',
  AI_IMPROVE: 'ai:improve',
  AI_ALL: 'ai:*',

  // Admin
  ADMIN: 'admin:*',

  // All permissions
  ALL: '*',
} as const

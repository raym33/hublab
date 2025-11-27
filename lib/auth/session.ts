/**
 * Secure Session Management with JWT
 *
 * Uses jose library for JWT signing and verification.
 * Provides secure session tokens instead of plain JSON cookies.
 */

import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { cookies } from 'next/headers'

// Session configuration
const SESSION_COOKIE_NAME = 'hublab_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

// Get secret key from environment or generate a warning
function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET

  if (!secret) {
    // In development, use a default key but warn
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Session] WARNING: No SESSION_SECRET set. Using insecure default for development only.'
      )
      return new TextEncoder().encode('dev-only-insecure-secret-key-32chars!')
    }

    throw new Error(
      'SESSION_SECRET environment variable is required in production'
    )
  }

  // Ensure the secret is at least 32 characters for security
  if (secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long')
  }

  return new TextEncoder().encode(secret)
}

/**
 * User session data interface
 */
export interface SessionUser {
  id: string
  email: string
  name: string
  picture?: string
}

/**
 * Session payload stored in JWT
 */
interface SessionPayload extends JWTPayload {
  user: SessionUser
  iat: number
  exp: number
}

/**
 * Create a signed session token
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  const secretKey = getSecretKey()

  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setIssuer('hublab')
    .setAudience('hublab-web')
    .sign(secretKey)

  return token
}

/**
 * Verify and decode a session token
 */
export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const secretKey = getSecretKey()

    const { payload } = await jwtVerify(token, secretKey, {
      issuer: 'hublab',
      audience: 'hublab-web',
    })

    const sessionPayload = payload as SessionPayload

    if (!sessionPayload.user || !sessionPayload.user.id) {
      return null
    }

    return sessionPayload.user
  } catch (error) {
    // Token is invalid or expired
    console.error('[Session] Token verification failed:', error)
    return null
  }
}

/**
 * Set session cookie with signed JWT
 */
export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user)
  const cookieStore = cookies()

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * Get current user from session cookie
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifySessionToken(token)
}

/**
 * Clear session cookie (logout)
 */
export function clearSessionCookie(): void {
  const cookieStore = cookies()

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}

/**
 * Refresh session if it's close to expiring
 */
export async function refreshSessionIfNeeded(): Promise<void> {
  const user = await getSessionUser()

  if (user) {
    // Re-issue token to extend session
    await setSessionCookie(user)
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getSessionUser()
  return user !== null
}

/**
 * Cryptographic utilities for encrypting/decrypting sensitive data
 * Uses AES-256-GCM for encryption
 */

import { webcrypto } from 'crypto'

// Use Web Crypto API (available in Node.js 15+)
const crypto = webcrypto as unknown as Crypto

/**
 * Get or generate encryption key from environment
 * In production, this should be a secure random key stored in env vars
 */
function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'ENCRYPTION_KEY must be set in production environment. ' +
        'Generate one with: openssl rand -base64 32'
      )
    }

    // Development fallback (NOT secure for production)
    console.warn(
      '⚠️  Using default encryption key in development. ' +
      'Set ENCRYPTION_KEY in production!'
    )
    return 'dev-key-not-secure-change-in-production-123456789012'
  }

  return key
}

/**
 * Derive a cryptographic key from the encryption key string
 */
async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('hublab-salt-v1'), // In production, use random salt per encryption
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt sensitive data (like OAuth tokens)
 * @param plaintext - The data to encrypt
 * @returns Base64-encoded encrypted data with IV prepended
 */
export async function encrypt(plaintext: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const key = await deriveKey(getEncryptionKey())

    // Generate random initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encoder.encode(plaintext)
    )

    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encrypted), iv.length)

    // Return as base64
    return Buffer.from(combined).toString('base64')
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt sensitive data
 * @param ciphertext - Base64-encoded encrypted data with IV prepended
 * @returns Decrypted plaintext
 */
export async function decrypt(ciphertext: string): Promise<string> {
  try {
    const decoder = new TextDecoder()
    const key = await deriveKey(getEncryptionKey())

    // Decode from base64
    const combined = new Uint8Array(Buffer.from(ciphertext, 'base64'))

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)

    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    )

    return decoder.decode(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Hash a value (one-way, for passwords or sensitive comparisons)
 * @param value - The value to hash
 * @returns Hex-encoded hash
 */
export async function hash(value: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a cryptographically secure random token
 * @param bytes - Number of random bytes (default 32)
 * @returns Hex-encoded random token
 */
export function generateSecureToken(bytes: number = 32): string {
  const buffer = crypto.getRandomValues(new Uint8Array(bytes))
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

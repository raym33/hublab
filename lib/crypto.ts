/**
 * Encryption utilities for sensitive data
 * Uses AES-256-GCM for strong encryption
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const ENCODING = 'hex' as const

/**
 * Get encryption key from environment
 * The key should be a 32-byte (64 hex characters) random string
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }

  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)')
  }

  return Buffer.from(key, 'hex')
}

/**
 * Encrypt a string using AES-256-GCM
 * Returns format: iv:authTag:encryptedData (all hex encoded)
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey()
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', ENCODING)
    encrypted += cipher.final(ENCODING)

    const authTag = cipher.getAuthTag()

    // Return: iv:authTag:encrypted
    return `${iv.toString(ENCODING)}:${authTag.toString(ENCODING)}:${encrypted}`
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decrypt a string encrypted with the encrypt() function
 * Expects format: iv:authTag:encryptedData (all hex encoded)
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey()
    const parts = encryptedText.split(':')

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format')
    }

    const [ivHex, authTagHex, encrypted] = parts
    const iv = Buffer.from(ivHex, ENCODING)
    const authTag = Buffer.from(authTagHex, ENCODING)

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, ENCODING, 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate a random encryption key (for initial setup)
 * Run this once to generate your ENCRYPTION_KEY
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString('hex')
}

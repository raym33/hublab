/**
 * Encryption Utilities
 *
 * Provides AES-256-GCM encryption for sensitive data like OAuth tokens
 * Uses Web Crypto API for secure encryption in Edge Runtime
 */

/**
 * Encrypts sensitive data using AES-256-GCM
 *
 * @param plaintext - The data to encrypt
 * @param encryptionKey - Base64-encoded encryption key (32 bytes for AES-256)
 * @returns Base64-encoded encrypted data with IV prepended
 */
export async function encrypt(plaintext: string, encryptionKey?: string): Promise<string> {
  const key = encryptionKey || process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required')
  }

  // Decode the base64 key
  const keyData = Buffer.from(key, 'base64')

  // Generate a random IV (12 bytes for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )

  // Encrypt the data
  const encoder = new TextEncoder()
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoder.encode(plaintext)
  )

  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.length)

  // Return as base64
  return Buffer.from(combined).toString('base64')
}

/**
 * Decrypts data encrypted with encrypt()
 *
 * @param ciphertext - Base64-encoded encrypted data with IV prepended
 * @param encryptionKey - Base64-encoded encryption key (same as used for encryption)
 * @returns Decrypted plaintext
 */
export async function decrypt(ciphertext: string, encryptionKey?: string): Promise<string> {
  const key = encryptionKey || process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required')
  }

  // Decode the base64 key
  const keyData = Buffer.from(key, 'base64')

  // Decode the combined data
  const combined = Buffer.from(ciphertext, 'base64')

  // Extract IV (first 12 bytes) and encrypted data
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)

  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )

  // Decrypt the data
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encrypted
  )

  // Return as string
  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

/**
 * Generates a new AES-256 encryption key
 * Use this to generate a new ENCRYPTION_KEY for .env
 *
 * @returns Base64-encoded 32-byte key
 */
export async function generateEncryptionKey(): Promise<string> {
  const key = crypto.getRandomValues(new Uint8Array(32))
  return Buffer.from(key).toString('base64')
}

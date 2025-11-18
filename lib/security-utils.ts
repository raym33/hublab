/**
 * Security utilities for sanitizing user input and preventing XSS attacks
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(
  dirty: string,
  options?: {
    allowedTags?: string[]
    allowedAttributes?: string[]
    allowExternalLinks?: boolean
  }
): string {
  const config: DOMPurify.Config = {}

  if (options?.allowedTags) {
    config.ALLOWED_TAGS = options.allowedTags
  }

  if (options?.allowedAttributes) {
    config.ALLOWED_ATTR = options.allowedAttributes
  }

  // Default safe configuration for rich text editors
  if (!config.ALLOWED_TAGS) {
    config.ALLOWED_TAGS = [
      'p', 'br', 'strong', 'em', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ]
  }

  if (!config.ALLOWED_ATTR) {
    config.ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'id']
  }

  // Prevent external links from opening in same window (security)
  if (!options?.allowExternalLinks) {
    config.ADD_ATTR = ['target']
    config.FORBID_ATTR = ['onerror', 'onload', 'onclick']
  }

  return DOMPurify.sanitize(dirty, config)
}

/**
 * Sanitize content from contentEditable elements
 * More restrictive than general HTML sanitization
 */
export function sanitizeContentEditable(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  })
}

/**
 * Sanitize user input for plain text (removes all HTML)
 */
export function sanitizePlainText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase()

  // RFC 5322 compliant regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailRegex.test(trimmed)) {
    return null
  }

  return trimmed
}

/**
 * Sanitize URL to prevent javascript: and data: schemes
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url)

    // Only allow http, https, and mailto protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:']

    if (!allowedProtocols.includes(parsed.protocol)) {
      return null
    }

    return parsed.toString()
  } catch (error) {
    // Invalid URL
    return null
  }
}

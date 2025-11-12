/**
 * HTML sanitization utilities to prevent XSS attacks
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  }

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char])
}

/**
 * Sanitize user input for safe display in HTML emails
 * This is a more permissive function that allows some formatting
 */
export function sanitizeForEmail(text: string): string {
  // First escape all HTML
  let sanitized = escapeHtml(text)

  // Preserve line breaks by converting \n to <br>
  sanitized = sanitized.replace(/\n/g, '<br>')

  return sanitized
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string {
  // Remove any whitespace
  const cleaned = email.trim().toLowerCase()

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format')
  }

  // Additional XSS protection - emails should not contain these characters
  if (/<|>|"|'|`|\\/g.test(cleaned)) {
    throw new Error('Email contains invalid characters')
  }

  return cleaned
}

/**
 * Sanitize name input (allows letters, spaces, hyphens, apostrophes)
 */
export function sanitizeName(name: string): string {
  const trimmed = name.trim()

  // Allow only letters, spaces, hyphens, and apostrophes
  // This prevents script injection while allowing international names
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/

  if (!nameRegex.test(trimmed)) {
    throw new Error('Name contains invalid characters')
  }

  if (trimmed.length < 2 || trimmed.length > 100) {
    throw new Error('Name must be between 2 and 100 characters')
  }

  return escapeHtml(trimmed)
}

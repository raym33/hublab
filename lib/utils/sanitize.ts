/**
 * HTML Sanitization Utilities
 *
 * Provides XSS protection by sanitizing HTML content before rendering
 * Uses DOMPurify for robust client-side sanitization
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes HTML content to prevent XSS attacks
 *
 * @param dirty - Untrusted HTML string
 * @param config - Optional DOMPurify configuration
 * @returns Sanitized HTML safe for rendering
 *
 * @example
 * const safeHTML = sanitizeHTML(userInput)
 * <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
 */
export function sanitizeHTML(
  dirty: string,
  config?: DOMPurify.Config
): string {
  return DOMPurify.sanitize(dirty, {
    // Default secure configuration
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote', 'img', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    ...config
  })
}

/**
 * Sanitizes HTML with a stricter configuration for user-generated content
 * Removes all HTML tags and only allows plain text with basic formatting
 */
export function sanitizeUserContent(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
  })
}

/**
 * Sanitizes markdown-rendered HTML with code syntax highlighting support
 * More permissive for documentation and code examples
 */
export function sanitizeMarkdown(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote', 'img', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  })
}

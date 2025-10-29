/**
 * Validation utilities for forms and data
 */

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate URL
export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validate phone number (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Validate confidence score (0-1)
export function isValidConfidence(confidence: number): boolean {
  return confidence >= 0 && confidence <= 1
}

// Validate required field
export function isRequired(value: any): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number') return !isNaN(value)
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined
}

// Validate positive number
export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0 && !isNaN(value)
}

// Validate date is in future
export function isFutureDate(date: Date | string): boolean {
  return new Date(date).getTime() > Date.now()
}

// Validate date is in past
export function isPastDate(date: Date | string): boolean {
  return new Date(date).getTime() < Date.now()
}

// Sanitize input (remove HTML tags)
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

// Validate string length
export function isValidLength(
  str: string,
  min: number,
  max: number
): boolean {
  const length = str.trim().length
  return length >= min && length <= max
}

// Check if value is valid JSON
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

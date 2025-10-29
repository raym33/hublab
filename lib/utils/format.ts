/**
 * Formatting utilities for CRM data
 */

// Format currency
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format large numbers (1.2K, 1.5M)
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

// Format relative time (e.g., "2 minutes ago")
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`
  if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`
  if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`
  if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  if (diffDay < 365) {
    const months = Math.floor(diffDay / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
  const years = Math.floor(diffDay / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

// Format absolute date (e.g., "Jan 15, 2025")
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(
    new Date(date)
  )
}

// Format date and time (e.g., "Jan 15, 2025 at 3:45 PM")
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

// Format confidence score (0.95 -> "95%")
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Format file size (bytes to KB, MB, GB)
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Format action type (snake_case to Title Case)
export function formatActionType(type: string): string {
  return type
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

// Format CRM type (hubspot -> HubSpot)
export function formatCRMType(type: string): string {
  const names: Record<string, string> = {
    hubspot: 'HubSpot',
    salesforce: 'Salesforce',
    pipedrive: 'Pipedrive',
    zoho: 'Zoho CRM',
  }
  return names[type] || capitalize(type)
}

// Get initials from name (John Doe -> JD)
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Generate random color for avatars
export function getColorFromString(str: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

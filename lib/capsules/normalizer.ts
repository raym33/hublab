/**
 * HubLab Ambient Agent CRM - Normalizer Capsule
 * Version: 1.0.0
 *
 * Normalizes events from different sources into a consistent format
 * Performs deduplication and entity extraction
 */

import crypto from 'crypto'
import {
  NormalizedEvent,
  Contact,
  Company,
  Deal,
  Task,
  EventType,
} from '../types/crm'

export interface NormalizerConfig {
  extractEmails: boolean
  extractCompanies: boolean
  extractDeals: boolean
  extractTasks: boolean
}

export class Normalizer {
  private config: NormalizerConfig

  constructor(config?: Partial<NormalizerConfig>) {
    this.config = {
      extractEmails: true,
      extractCompanies: true,
      extractDeals: true,
      extractTasks: true,
      ...config,
    }
  }

  /**
   * Normalize a raw event into structured format
   */
  normalize(rawEvent: any): NormalizedEvent {
    const content = this.extractContent(rawEvent)

    return {
      event_id: rawEvent.event_id || rawEvent.id,
      type: this.inferEventType(rawEvent),
      timestamp: rawEvent.timestamp || new Date().toISOString(),
      contacts: this.config.extractEmails ? this.extractContacts(content, rawEvent) : [],
      companies: this.config.extractCompanies ? this.extractCompanies(content) : [],
      deals: this.config.extractDeals ? this.extractDeals(content) : [],
      tasks: this.config.extractTasks ? this.extractTasks(content) : [],
      metadata: this.extractMetadata(rawEvent),
    }
  }

  /**
   * Generate a fingerprint for deduplication
   */
  generateFingerprint(event: any): string {
    const hash = crypto.createHash('sha256')

    const fingerprintData = {
      type: event.type || event.event_type,
      source: event.source,
      // Use a normalized timestamp (rounded to nearest minute)
      timestamp: this.normalizeTimestamp(event.timestamp || new Date().toISOString()),
      // Use a content hash for email/meeting content
      contentHash: this.hashContent(event.content || event.body || event.notes || ''),
    }

    hash.update(JSON.stringify(fingerprintData))
    return hash.digest('hex')
  }

  // ============================================================================
  // Private Methods - Content Extraction
  // ============================================================================

  private extractContent(event: any): string {
    // Try to extract text content from various event types
    return (
      event.content ||
      event.body ||
      event.notes ||
      event.description ||
      event.message ||
      event.text ||
      ''
    )
  }

  private inferEventType(event: any): EventType {
    const type = event.event_type || event.type
    if (['email', 'meeting', 'slack', 'call'].includes(type)) {
      return type as EventType
    }

    // Infer from source
    const source = (event.source || '').toLowerCase()
    if (source.includes('gmail') || source.includes('outlook')) return 'email'
    if (source.includes('calendar') || source.includes('meet')) return 'meeting'
    if (source.includes('slack') || source.includes('teams')) return 'slack'
    if (source.includes('zoom') || source.includes('call')) return 'call'

    return 'email' // Default
  }

  private extractMetadata(event: any): Record<string, any> {
    return {
      source: event.source,
      ...(event.subject && { subject: event.subject }),
      ...(event.title && { title: event.title }),
      ...(event.thread_id && { thread_id: event.thread_id }),
      ...(event.meeting_id && { meeting_id: event.meeting_id }),
    }
  }

  // ============================================================================
  // Private Methods - Entity Extraction
  // ============================================================================

  /**
   * Extract contacts (emails and names)
   */
  private extractContacts(content: string, rawEvent: any): Contact[] {
    const contacts: Contact[] = []
    const seenEmails = new Set<string>()

    // Extract from structured fields first (if available)
    if (rawEvent.from?.email) {
      contacts.push({
        email: rawEvent.from.email.toLowerCase(),
        name: rawEvent.from.name,
      })
      seenEmails.add(rawEvent.from.email.toLowerCase())
    }

    if (rawEvent.to && Array.isArray(rawEvent.to)) {
      rawEvent.to.forEach((recipient: any) => {
        if (recipient.email && !seenEmails.has(recipient.email.toLowerCase())) {
          contacts.push({
            email: recipient.email.toLowerCase(),
            name: recipient.name,
          })
          seenEmails.add(recipient.email.toLowerCase())
        }
      })
    }

    if (rawEvent.attendees && Array.isArray(rawEvent.attendees)) {
      rawEvent.attendees.forEach((attendee: any) => {
        if (attendee.email && !seenEmails.has(attendee.email.toLowerCase())) {
          contacts.push({
            email: attendee.email.toLowerCase(),
            name: attendee.name,
          })
          seenEmails.add(attendee.email.toLowerCase())
        }
      })
    }

    // Extract from content using regex
    const emailRegex = /[\w.+-]+@[\w.-]+\.\w+/gi
    const emailMatches = content.match(emailRegex) || []

    emailMatches.forEach((email) => {
      const normalizedEmail = email.toLowerCase()
      if (!seenEmails.has(normalizedEmail)) {
        contacts.push({ email: normalizedEmail })
        seenEmails.add(normalizedEmail)
      }
    })

    return contacts
  }

  /**
   * Extract companies from email domains
   */
  private extractCompanies(content: string): Company[] {
    const emailRegex = /[\w.+-]+@([\w.-]+\.\w+)/gi
    const domains = new Set<string>()
    const companies: Company[] = []

    let match
    while ((match = emailRegex.exec(content)) !== null) {
      const domain = match[1].toLowerCase()

      // Skip common email providers
      if (this.isCommonEmailProvider(domain)) continue

      if (!domains.has(domain)) {
        domains.add(domain)
        companies.push({
          domain,
          name: this.domainToCompanyName(domain),
        })
      }
    }

    return companies
  }

  /**
   * Extract deal information (amounts, stages)
   */
  private extractDeals(content: string): Deal[] {
    const deals: Deal[] = []

    // Extract monetary amounts
    // Matches: $1,000 | €1.000 | $1000.00 | 1000 USD
    const amountRegex = /(?:[$€£¥]|USD|EUR|GBP)\s?(\d{1,3}(?:[,\.]\d{3})*(?:\.\d{2})?)|(\d{1,3}(?:[,\.]\d{3})*(?:\.\d{2})?)\s?(?:USD|EUR|GBP|dollars?|euros?)/gi

    let match
    while ((match = amountRegex.exec(content)) !== null) {
      const amountStr = match[1] || match[2]
      const amount = parseFloat(amountStr.replace(/[,]/g, ''))

      if (amount > 0) {
        deals.push({ amount })
      }
    }

    // Extract deal stages from common keywords
    const stageKeywords = {
      'qualified': /qualified|qualification/i,
      'demo': /demo|demonstration|presentation/i,
      'proposal': /proposal|quote|pricing/i,
      'negotiation': /negotiat(?:ion|ing)|discuss(?:ion|ing) terms/i,
      'closed won': /closed won|signed|purchase order|po\s+\d+/i,
      'closed lost': /closed lost|declined|rejected|no longer interested/i,
    }

    for (const [stage, regex] of Object.entries(stageKeywords)) {
      if (regex.test(content)) {
        // If we already have deals with amounts, add stage to first one
        if (deals.length > 0 && !deals[0].stage) {
          deals[0].stage = stage
        } else {
          // Create a new deal with just the stage
          deals.push({ stage })
        }
        break // Only match one stage
      }
    }

    return deals
  }

  /**
   * Extract tasks and next actions
   */
  private extractTasks(content: string): Task[] {
    const tasks: Task[] = []

    // Task keywords to look for
    const taskPatterns = [
      { regex: /next step[s]?:\s*([^\n.]+)/i, priority: 'high' as const },
      { regex: /follow up\s+(?:with|on)\s+([^\n.]+)/i, priority: 'medium' as const },
      { regex: /schedule\s+([^\n.]+)/i, priority: 'medium' as const },
      { regex: /send\s+(proposal|quote|contract|po|invoice|email)\s+([^\n.]*)/i, priority: 'high' as const },
      { regex: /(?:need to|must|should)\s+([^\n.]+)/i, priority: 'medium' as const },
      { regex: /action items?:\s*([^\n]+)/i, priority: 'high' as const },
      { regex: /to-?do:\s*([^\n]+)/i, priority: 'medium' as const },
    ]

    for (const pattern of taskPatterns) {
      const match = content.match(pattern.regex)
      if (match) {
        const title = match[1]?.trim() || match[0]?.trim()
        if (title && title.length > 5 && title.length < 200) {
          tasks.push({
            title,
            priority: pattern.priority,
          })
        }
      }
    }

    // Extract dates for due dates
    // Matches: "by Friday", "by next week", "by Dec 15", "by 2024-12-15"
    const dueDateRegex = /by\s+((?:next\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}|\d{4}-\d{2}-\d{2})/i
    const dueDateMatch = content.match(dueDateRegex)

    if (dueDateMatch && tasks.length > 0) {
      // Add due date to first task
      tasks[0].due_date = this.parseDueDate(dueDateMatch[1])
    }

    return tasks
  }

  // ============================================================================
  // Private Methods - Utilities
  // ============================================================================

  private isCommonEmailProvider(domain: string): boolean {
    const commonProviders = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'icloud.com',
      'mail.com',
      'aol.com',
      'protonmail.com',
      'zoho.com',
    ]
    return commonProviders.includes(domain)
  }

  private domainToCompanyName(domain: string): string {
    // Remove TLD and convert to title case
    const name = domain.split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  private hashContent(content: string): string {
    // Normalize content (remove extra whitespace, lowercase)
    const normalized = content.toLowerCase().replace(/\s+/g, ' ').trim()

    // Hash first 1000 chars (to avoid too long content)
    const truncated = normalized.substring(0, 1000)

    return crypto.createHash('sha256').update(truncated).digest('hex')
  }

  private normalizeTimestamp(timestamp: string): string {
    // Round timestamp to nearest minute for fingerprinting
    const date = new Date(timestamp)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.toISOString()
  }

  private parseDueDate(dateStr: string): string {
    const now = new Date()

    // Handle relative dates
    if (dateStr.toLowerCase().includes('next week')) {
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return nextWeek.toISOString().split('T')[0]
    }

    if (dateStr.toLowerCase().includes('next month')) {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
      return nextMonth.toISOString().split('T')[0]
    }

    // Handle day names (assume current or next week)
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayIndex = dayNames.findIndex(day => dateStr.toLowerCase().includes(day))

    if (dayIndex !== -1) {
      const currentDay = now.getDay()
      let daysUntil = dayIndex - currentDay
      if (daysUntil <= 0) daysUntil += 7 // Next week

      const targetDate = new Date(now.getTime() + daysUntil * 24 * 60 * 60 * 1000)
      return targetDate.toISOString().split('T')[0]
    }

    // If it looks like an ISO date, return as-is
    if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      return dateStr
    }

    // Default to 7 days from now
    const defaultDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return defaultDate.toISOString().split('T')[0]
  }
}

// ============================================================================
// Factory function
// ============================================================================

export function createNormalizer(config?: Partial<NormalizerConfig>): Normalizer {
  return new Normalizer(config)
}

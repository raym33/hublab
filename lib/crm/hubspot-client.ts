/**
 * HubLab Ambient Agent CRM - HubSpot Client
 * Version: 1.0.0
 *
 * Client for interacting with HubSpot CRM API
 */

import {
  HubSpotContact,
  HubSpotDeal,
  HubSpotCompany,
  Contact,
  Deal,
  Company,
} from '../types/crm'

export interface HubSpotConfig {
  accessToken: string
  refreshToken?: string
  portalId?: string
}

export class HubSpotClient {
  private accessToken: string
  private refreshToken?: string
  private baseUrl = 'https://api.hubapi.com'
  private portalId?: string

  constructor(config: HubSpotConfig) {
    this.accessToken = config.accessToken
    this.refreshToken = config.refreshToken
    this.portalId = config.portalId
  }

  // ============================================================================
  // Authentication
  // ============================================================================

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string): Promise<{
    access_token: string
    refresh_token: string
    expires_in: number
  }> {
    const clientId = process.env.HUBSPOT_CLIENT_ID
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET
    const redirectUri = process.env.HUBSPOT_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/crm/hubspot/callback`

    if (!clientId || !clientSecret) {
      throw new Error('HubSpot OAuth credentials not configured')
    }

    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to exchange code for token: ${error}`)
    }

    return response.json()
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string
    refresh_token: string
    expires_in: number
  }> {
    const clientId = process.env.HUBSPOT_CLIENT_ID
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('HubSpot OAuth credentials not configured')
    }

    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to refresh token: ${error}`)
    }

    return response.json()
  }

  // ============================================================================
  // Contacts
  // ============================================================================

  /**
   * Create or update a contact (upsert by email)
   */
  async upsertContact(contact: Contact): Promise<HubSpotContact> {
    // First, search for existing contact by email
    const existing = await this.searchContactByEmail(contact.email)

    if (existing) {
      // Update existing contact
      return this.updateContact(existing.id!, contact)
    } else {
      // Create new contact
      return this.createContact(contact)
    }
  }

  /**
   * Create a new contact
   */
  async createContact(contact: Contact): Promise<HubSpotContact> {
    const properties: any = {
      email: contact.email,
    }

    if (contact.name) {
      const [firstname, ...lastname] = contact.name.split(' ')
      properties.firstname = firstname
      if (lastname.length > 0) {
        properties.lastname = lastname.join(' ')
      }
    }

    if (contact.phone) {
      properties.phone = contact.phone
    }

    if (contact.title) {
      properties.jobtitle = contact.title
    }

    const response = await this.request('/crm/v3/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    })

    return response
  }

  /**
   * Update an existing contact
   */
  async updateContact(contactId: string, contact: Partial<Contact>): Promise<HubSpotContact> {
    const properties: any = {}

    if (contact.email) properties.email = contact.email

    if (contact.name) {
      const [firstname, ...lastname] = contact.name.split(' ')
      properties.firstname = firstname
      if (lastname.length > 0) {
        properties.lastname = lastname.join(' ')
      }
    }

    if (contact.phone) properties.phone = contact.phone
    if (contact.title) properties.jobtitle = contact.title

    const response = await this.request(`/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    })

    return response
  }

  /**
   * Search for a contact by email
   */
  async searchContactByEmail(email: string): Promise<HubSpotContact | null> {
    const response = await this.request('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
      }),
    })

    if (response.results && response.results.length > 0) {
      return response.results[0]
    }

    return null
  }

  // ============================================================================
  // Companies
  // ============================================================================

  /**
   * Create or update a company (upsert by domain)
   */
  async upsertCompany(company: Company): Promise<HubSpotCompany> {
    if (!company.domain) {
      throw new Error('Company domain is required for upsert')
    }

    const existing = await this.searchCompanyByDomain(company.domain)

    if (existing) {
      return this.updateCompany(existing.id!, company)
    } else {
      return this.createCompany(company)
    }
  }

  /**
   * Create a new company
   */
  async createCompany(company: Company): Promise<HubSpotCompany> {
    const properties: any = {
      name: company.name || company.domain,
    }

    if (company.domain) properties.domain = company.domain
    if (company.industry) properties.industry = company.industry

    const response = await this.request('/crm/v3/objects/companies', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    })

    return response
  }

  /**
   * Update an existing company
   */
  async updateCompany(companyId: string, company: Partial<Company>): Promise<HubSpotCompany> {
    const properties: any = {}

    if (company.name) properties.name = company.name
    if (company.domain) properties.domain = company.domain
    if (company.industry) properties.industry = company.industry

    const response = await this.request(`/crm/v3/objects/companies/${companyId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    })

    return response
  }

  /**
   * Search for a company by domain
   */
  async searchCompanyByDomain(domain: string): Promise<HubSpotCompany | null> {
    const response = await this.request('/crm/v3/objects/companies/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'domain',
                operator: 'EQ',
                value: domain,
              },
            ],
          },
        ],
      }),
    })

    if (response.results && response.results.length > 0) {
      return response.results[0]
    }

    return null
  }

  // ============================================================================
  // Deals
  // ============================================================================

  /**
   * Create a new deal
   */
  async createDeal(deal: Deal & { name: string }): Promise<HubSpotDeal> {
    const properties: any = {
      dealname: deal.name,
    }

    if (deal.amount) properties.amount = deal.amount.toString()
    if (deal.stage) properties.dealstage = deal.stage
    if (deal.close_date) properties.closedate = deal.close_date
    if (deal.probability) properties.hs_deal_stage_probability = deal.probability.toString()

    const response = await this.request('/crm/v3/objects/deals', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    })

    return response
  }

  /**
   * Update an existing deal
   */
  async updateDeal(dealId: string, deal: Partial<Deal>): Promise<HubSpotDeal> {
    const properties: any = {}

    if (deal.amount !== undefined) properties.amount = deal.amount.toString()
    if (deal.stage) properties.dealstage = deal.stage
    if (deal.close_date) properties.closedate = deal.close_date
    if (deal.probability !== undefined) properties.hs_deal_stage_probability = deal.probability.toString()

    const response = await this.request(`/crm/v3/objects/deals/${dealId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    })

    return response
  }

  /**
   * Update deal stage
   */
  async updateDealStage(dealId: string, stage: string): Promise<HubSpotDeal> {
    return this.updateDeal(dealId, { stage })
  }

  // ============================================================================
  // Activities / Engagements
  // ============================================================================

  /**
   * Log a note (activity)
   */
  async logNote(note: {
    body: string
    contactId?: string
    dealId?: string
    timestamp?: string
  }): Promise<any> {
    const properties: any = {
      hs_note_body: note.body,
      hs_timestamp: note.timestamp || new Date().toISOString(),
    }

    const associations = []

    if (note.contactId) {
      associations.push({
        to: { id: note.contactId },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
      })
    }

    if (note.dealId) {
      associations.push({
        to: { id: note.dealId },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 214 }],
      })
    }

    const response = await this.request('/crm/v3/objects/notes', {
      method: 'POST',
      body: JSON.stringify({
        properties,
        associations,
      }),
    })

    return response
  }

  /**
   * Log a meeting
   */
  async logMeeting(meeting: {
    title: string
    body?: string
    startTime: string
    endTime: string
    contactId?: string
    dealId?: string
  }): Promise<any> {
    const properties: any = {
      hs_meeting_title: meeting.title,
      hs_meeting_body: meeting.body || '',
      hs_meeting_start_time: new Date(meeting.startTime).getTime().toString(),
      hs_meeting_end_time: new Date(meeting.endTime).getTime().toString(),
      hs_timestamp: meeting.startTime,
    }

    const associations = []

    if (meeting.contactId) {
      associations.push({
        to: { id: meeting.contactId },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 200 }],
      })
    }

    if (meeting.dealId) {
      associations.push({
        to: { id: meeting.dealId },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 212 }],
      })
    }

    const response = await this.request('/crm/v3/objects/meetings', {
      method: 'POST',
      body: JSON.stringify({
        properties,
        associations,
      }),
    })

    return response
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Make an authenticated request to HubSpot API
   */
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HubSpot API error (${response.status}): ${error}`)
    }

    return response.json()
  }

  /**
   * Test connection to HubSpot
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request('/crm/v3/objects/contacts?limit=1')
      return true
    } catch (error) {
      console.error('HubSpot connection test failed:', error)
      return false
    }
  }
}

/**
 * Create a HubSpot client instance
 */
export function createHubSpotClient(config: HubSpotConfig): HubSpotClient {
  return new HubSpotClient(config)
}

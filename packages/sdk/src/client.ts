// ============================================
// HubLab Client
// Main SDK client class
// ============================================

import { Projects } from './resources/projects'
import { Themes } from './resources/themes'
import { Catalog } from './resources/catalog'
import { RateLimit } from './types'

export interface HubLabOptions {
  apiKey: string
  baseUrl?: string
}

export class HubLab {
  private apiKey: string
  private baseUrl: string

  public projects: Projects
  public themes: Themes
  public catalog: Catalog

  constructor(options: HubLabOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl || 'https://hublab.dev/api/v1'

    // Initialize resource classes
    this.projects = new Projects(this)
    this.themes = new Themes(this)
    this.catalog = new Catalog(this)
  }

  async request<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>
  ): Promise<{ data: T; rateLimit?: RateLimit }> {
    const url = `${this.baseUrl}${path}`

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    interface ApiResponse {
      data?: T
      rateLimit?: RateLimit
      error?: {
        message?: string
        code?: string
        details?: unknown
      }
    }

    const result = await response.json() as ApiResponse

    if (!response.ok) {
      throw new HubLabError(
        result.error?.message || 'Request failed',
        result.error?.code || 'UNKNOWN_ERROR',
        response.status,
        result.error?.details
      )
    }

    return {
      data: result.data || (result as unknown as T),
      rateLimit: result.rateLimit,
    }
  }

  async get<T>(path: string): Promise<{ data: T; rateLimit?: RateLimit }> {
    return this.request<T>('GET', path)
  }

  async post<T>(path: string, data?: Record<string, unknown>): Promise<{ data: T; rateLimit?: RateLimit }> {
    return this.request<T>('POST', path, data)
  }

  async put<T>(path: string, data?: Record<string, unknown>): Promise<{ data: T; rateLimit?: RateLimit }> {
    return this.request<T>('PUT', path, data)
  }

  async delete<T>(path: string): Promise<{ data: T; rateLimit?: RateLimit }> {
    return this.request<T>('DELETE', path)
  }
}

export class HubLabError extends Error {
  public code: string
  public status: number
  public details?: unknown

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message)
    this.name = 'HubLabError'
    this.code = code
    this.status = status
    this.details = details
  }
}

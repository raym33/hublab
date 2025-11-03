// ============================================
// HubLab Client
// Main SDK client class
// ============================================

import { Projects } from './resources/projects'
import { Themes } from './resources/themes'
import { Catalog } from './resources/catalog'

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
    data?: any
  ): Promise<{ data: T; rateLimit?: any }> {
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
    const result = await response.json()

    if (!response.ok) {
      throw new HubLabError(
        result.error?.message || 'Request failed',
        result.error?.code || 'UNKNOWN_ERROR',
        response.status,
        result.error?.details
      )
    }

    return {
      data: result.data || result,
      rateLimit: result.rateLimit,
    }
  }

  async get<T>(path: string): Promise<{ data: T; rateLimit?: any }> {
    return this.request<T>('GET', path)
  }

  async post<T>(path: string, data?: any): Promise<{ data: T; rateLimit?: any }> {
    return this.request<T>('POST', path, data)
  }

  async put<T>(path: string, data?: any): Promise<{ data: T; rateLimit?: any }> {
    return this.request<T>('PUT', path, data)
  }

  async delete<T>(path: string): Promise<{ data: T; rateLimit?: any }> {
    return this.request<T>('DELETE', path)
  }
}

export class HubLabError extends Error {
  public code: string
  public status: number
  public details?: any

  constructor(message: string, code: string, status: number, details?: any) {
    super(message)
    this.name = 'HubLabError'
    this.code = code
    this.status = status
    this.details = details
  }
}

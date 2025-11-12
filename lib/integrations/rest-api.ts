// ============================================
// REST API INTEGRATION HELPERS
// ============================================

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type APIRequestConfig = {
  url: string
  method?: HTTPMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string>
  timeout?: number
}

export type APIResponse<T = any> = {
  data: T | null
  error: string | null
  status: number
  headers: Headers
}

// ============================================
// CORE API CLIENT
// ============================================

export class APIClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(baseURL: string = '', headers: Record<string, string> = {}, timeout: number = 30000) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    }
    this.timeout = timeout
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseURL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    return url.toString()
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async request<T = any>(config: APIRequestConfig): Promise<APIResponse<T>> {
    const { url, method = 'GET', headers = {}, body, params, timeout = this.timeout } = config

    try {
      const fullURL = this.buildURL(url, params)
      const requestHeaders = { ...this.defaultHeaders, ...headers }

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      }

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body)
      }

      const response = await this.fetchWithTimeout(fullURL, options, timeout)

      let data: T | null = null
      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = (await response.text()) as any
      }

      return {
        data,
        error: response.ok ? null : `Request failed with status ${response.status}`,
        status: response.status,
        headers: response.headers,
      }
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Request failed',
        status: 0,
        headers: new Headers(),
      }
    }
  }

  get<T = any>(url: string, config?: Omit<APIRequestConfig, 'url' | 'method'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' })
  }

  post<T = any>(url: string, body?: any, config?: Omit<APIRequestConfig, 'url' | 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', body })
  }

  put<T = any>(url: string, body?: any, config?: Omit<APIRequestConfig, 'url' | 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', body })
  }

  patch<T = any>(url: string, body?: any, config?: Omit<APIRequestConfig, 'url' | 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PATCH', body })
  }

  delete<T = any>(url: string, config?: Omit<APIRequestConfig, 'url' | 'method'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' })
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export async function apiGet<T = any>(url: string, config?: Omit<APIRequestConfig, 'url' | 'method'>): Promise<APIResponse<T>> {
  const client = new APIClient()
  return client.get<T>(url, config)
}

export async function apiPost<T = any>(url: string, body?: any, config?: Omit<APIRequestConfig, 'url' | 'method' | 'body'>): Promise<APIResponse<T>> {
  const client = new APIClient()
  return client.post<T>(url, body, config)
}

export async function apiPut<T = any>(url: string, body?: any, config?: Omit<APIRequestConfig, 'url' | 'method' | 'body'>): Promise<APIResponse<T>> {
  const client = new APIClient()
  return client.put<T>(url, body, config)
}

export async function apiPatch<T = any>(url: string, body?: any, config?: Omit<APIRequestConfig, 'url' | 'method' | 'body'>): Promise<APIResponse<T>> {
  const client = new APIClient()
  return client.patch<T>(url, body, config)
}

export async function apiDelete<T = any>(url: string, config?: Omit<APIRequestConfig, 'url' | 'method'>): Promise<APIResponse<T>> {
  const client = new APIClient()
  return client.delete<T>(url, config)
}

// ============================================
// SWR INTEGRATION
// ============================================

export function createSWRFetcher<T = any>(baseURL?: string, headers?: Record<string, string>) {
  const client = new APIClient(baseURL, headers)

  return async (url: string): Promise<T> => {
    const response = await client.get<T>(url)
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data as T
  }
}

// ============================================
// REACT QUERY INTEGRATION
// ============================================

export function createQueryFetcher<T = any>(baseURL?: string, headers?: Record<string, string>) {
  const client = new APIClient(baseURL, headers)

  return async ({ queryKey }: { queryKey: [string, Record<string, any>?] }): Promise<T> => {
    const [url, params] = queryKey
    const response = await client.get<T>(url, { params })
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data as T
  }
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Simple GET request
const { data, error } = await apiGet('https://api.example.com/users')
if (error) {
  console.error('Error:', error)
} else {
  console.log('Users:', data)
}

// Example 2: POST with authentication
const { data, error } = await apiPost(
  'https://api.example.com/posts',
  { title: 'New Post', content: 'Hello World' },
  {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  }
)

// Example 3: Using API Client for multiple requests
const client = new APIClient('https://api.example.com', {
  'Authorization': 'Bearer YOUR_TOKEN'
})

const users = await client.get('/users')
const posts = await client.get('/posts', { params: { page: '1', limit: '10' } })
const newPost = await client.post('/posts', { title: 'Test', content: 'Content' })

// Example 4: With SWR
import useSWR from 'swr'

const fetcher = createSWRFetcher('https://api.example.com', {
  'Authorization': 'Bearer YOUR_TOKEN'
})

function Component() {
  const { data, error } = useSWR('/users', fetcher)

  if (error) return <div>Error loading users</div>
  if (!data) return <div>Loading...</div>

  return <div>{data.map(user => user.name)}</div>
}

// Example 5: With React Query
import { useQuery } from '@tanstack/react-query'

const queryFetcher = createQueryFetcher('https://api.example.com')

function Component() {
  const { data, error } = useQuery({
    queryKey: ['users', { page: 1 }],
    queryFn: queryFetcher
  })

  if (error) return <div>Error loading users</div>
  if (!data) return <div>Loading...</div>

  return <div>{data.map(user => user.name)}</div>
}
*/

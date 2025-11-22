/**
 * Unit tests for HubLab SDK Client
 * Tests API client methods, error handling, and rate limiting
 */

import { HubLab, HubLabError } from '@/packages/sdk/src/client'

// Mock fetch globally
global.fetch = jest.fn()

describe('HubLab SDK Client', () => {
  let client: HubLab
  const mockApiKey = 'test-api-key-12345'
  const mockBaseUrl = 'https://api.test.com/v1'

  beforeEach(() => {
    client = new HubLab({
      apiKey: mockApiKey,
      baseUrl: mockBaseUrl,
    })
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with provided options', () => {
      expect(client).toBeInstanceOf(HubLab)
      expect(client.projects).toBeDefined()
      expect(client.themes).toBeDefined()
      expect(client.catalog).toBeDefined()
    })

    it('should use default base URL if not provided', () => {
      const defaultClient = new HubLab({
        apiKey: mockApiKey,
      })
      expect(defaultClient).toBeInstanceOf(HubLab)
    })
  })

  describe('request method', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: '123', name: 'Test Project' }
      const mockResponse = {
        ok: true,
        json: async () => ({ data: mockData }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await client.get('/projects/123')

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/projects/123`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
          }),
        })
      )

      expect(result.data).toEqual(mockData)
    })

    it('should make successful POST request with body', async () => {
      const mockRequestData = { name: 'New Project' }
      const mockResponseData = { id: '456', name: 'New Project' }
      const mockResponse = {
        ok: true,
        json: async () => ({ data: mockResponseData }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await client.post('/projects', mockRequestData)

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/projects`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(mockRequestData),
        })
      )

      expect(result.data).toEqual(mockResponseData)
    })

    it('should make successful PUT request', async () => {
      const mockRequestData = { name: 'Updated Project' }
      const mockResponseData = { id: '123', name: 'Updated Project' }
      const mockResponse = {
        ok: true,
        json: async () => ({ data: mockResponseData }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await client.put('/projects/123', mockRequestData)

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/projects/123`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockRequestData),
        })
      )

      expect(result.data).toEqual(mockResponseData)
    })

    it('should make successful DELETE request', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: { success: true } }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await client.delete('/projects/123')

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/projects/123`,
        expect.objectContaining({
          method: 'DELETE',
        })
      )

      expect(result.data).toEqual({ success: true })
    })

    it('should include rate limit information in response', async () => {
      const mockRateLimit = {
        limit: 100,
        remaining: 95,
        reset: Date.now() + 60000,
        resetIn: 60,
      }
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: { id: '123' },
          rateLimit: mockRateLimit,
        }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await client.get('/projects/123')

      expect(result.rateLimit).toEqual(mockRateLimit)
    })

    it('should handle response without explicit data field', async () => {
      const mockDirectResponse = { id: '123', name: 'Test' }
      const mockResponse = {
        ok: true,
        json: async () => mockDirectResponse,
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await client.get('/projects/123')

      expect(result.data).toEqual(mockDirectResponse)
    })
  })

  describe('error handling', () => {
    it('should throw HubLabError on failed request', async () => {
      const mockError = {
        message: 'Project not found',
        code: 'NOT_FOUND',
        details: { projectId: '123' },
      }
      const mockResponse = {
        ok: false,
        status: 404,
        json: async () => ({ error: mockError }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(client.get('/projects/123')).rejects.toThrow(HubLabError)

      try {
        await client.get('/projects/123')
      } catch (error) {
        expect(error).toBeInstanceOf(HubLabError)
        if (error instanceof HubLabError) {
          expect(error.message).toBe('Project not found')
          expect(error.code).toBe('NOT_FOUND')
          expect(error.status).toBe(404)
          expect(error.details).toEqual({ projectId: '123' })
        }
      }
    })

    it('should throw HubLabError with default message on unknown error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({}),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(client.get('/projects/123')).rejects.toThrow('Request failed')
    })

    it('should handle 401 unauthorized error', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({
          error: {
            message: 'Invalid API key',
            code: 'UNAUTHORIZED',
          },
        }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      try {
        await client.get('/projects/123')
      } catch (error) {
        if (error instanceof HubLabError) {
          expect(error.status).toBe(401)
          expect(error.code).toBe('UNAUTHORIZED')
        }
      }
    })

    it('should handle 429 rate limit error', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        json: async () => ({
          error: {
            message: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
          },
        }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      try {
        await client.get('/projects/123')
      } catch (error) {
        if (error instanceof HubLabError) {
          expect(error.status).toBe(429)
          expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
        }
      }
    })

    it('should handle validation errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: {
              fields: ['name', 'email'],
            },
          },
        }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      try {
        await client.post('/projects', {})
      } catch (error) {
        if (error instanceof HubLabError) {
          expect(error.status).toBe(400)
          expect(error.code).toBe('VALIDATION_ERROR')
          expect(error.details).toBeDefined()
        }
      }
    })
  })

  describe('HTTP methods', () => {
    it('should not include body in GET requests', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: {} }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await client.get('/projects')

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
      expect(fetchCall.body).toBeUndefined()
    })

    it('should include body in POST requests', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: {} }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await client.post('/projects', { name: 'Test' })

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
      expect(fetchCall.body).toBe(JSON.stringify({ name: 'Test' }))
    })

    it('should include body in PUT requests', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: {} }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await client.put('/projects/123', { name: 'Updated' })

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
      expect(fetchCall.body).toBeDefined()
    })

    it('should not include body in DELETE requests', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: {} }),
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await client.delete('/projects/123')

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
      expect(fetchCall.body).toBeUndefined()
    })
  })
})

describe('HubLabError', () => {
  it('should create error with all properties', () => {
    const error = new HubLabError('Test error', 'TEST_CODE', 400, { field: 'value' })

    expect(error.name).toBe('HubLabError')
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_CODE')
    expect(error.status).toBe(400)
    expect(error.details).toEqual({ field: 'value' })
  })

  it('should be instance of Error', () => {
    const error = new HubLabError('Test', 'CODE', 500)

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(HubLabError)
  })

  it('should work without details', () => {
    const error = new HubLabError('Test error', 'TEST_CODE', 404)

    expect(error.details).toBeUndefined()
  })

  it('should preserve error stack', () => {
    const error = new HubLabError('Test error', 'TEST_CODE', 500)

    expect(error.stack).toBeDefined()
  })
})

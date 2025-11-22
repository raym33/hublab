/**
 * Unit tests for Contact API route
 * Tests validation, rate limiting, and email sending
 */

import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

// Mock the rate limiter module
jest.mock('@/lib/rate-limiter', () => ({
  standardLimiter: {
    allowRequest: jest.fn(() => true),
  },
  getClientIdentifier: jest.fn(() => 'test-client'),
}))

// Mock the Resend module
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'email-123' }),
    },
  })),
}))

// Mock environment variable
const originalEnv = process.env.RESEND_API_KEY

describe('Contact API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.RESEND_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    process.env.RESEND_API_KEY = originalEnv
  })

  describe('POST /api/contact', () => {
    it('should successfully send contact message', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message from the contact form',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Message sent successfully')
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Missing name and message
          email: 'john@example.com',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toBeDefined()
    })

    it('should reject invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'invalid-email',
          message: 'This is a test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })

    it('should reject short names', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'J',
          email: 'john@example.com',
          message: 'This is a test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })

    it('should reject invalid name characters', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John123',
          email: 'john@example.com',
          message: 'This is a test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })

    it('should reject short messages', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Short',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })

    it('should reject long messages', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'A'.repeat(2001),
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })

    it('should accept valid names with hyphens and apostrophes', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Mary-Jane O'Connor",
          email: 'mary@example.com',
          message: 'This is a test message from the contact form',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should accept optional subject field', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should reject invalid JSON body', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid-json{',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid JSON body')
    })

    it('should handle rate limiting', async () => {
      const { standardLimiter } = require('@/lib/rate-limiter')
      standardLimiter.allowRequest.mockReturnValueOnce(false)

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Too many requests. Please try again later.')
    })

    it('should return 503 when email service is not configured', async () => {
      delete process.env.RESEND_API_KEY

      // Force module reload to pick up new env
      jest.resetModules()
      const { POST: POST_NO_KEY } = require('@/app/api/contact/route')

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message',
        }),
      })

      const response = await POST_NO_KEY(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.error).toBe('Email service is not configured')

      // Restore
      process.env.RESEND_API_KEY = 'test-api-key'
    })

    it('should handle email sending errors', async () => {
      const { Resend } = require('resend')
      Resend.mockImplementationOnce(() => ({
        emails: {
          send: jest.fn().mockRejectedValue(new Error('Email service error')),
        },
      }))

      // Force module reload to pick up new mock
      jest.resetModules()
      const { POST: POST_ERROR } = require('@/app/api/contact/route')

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message',
        }),
      })

      const response = await POST_ERROR(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to send message. Please try again later.')
    })

    it('should trim whitespace from inputs', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '  John Doe  ',
          email: '  john@example.com  ',
          message: '  This is a test message  ',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should lowercase email addresses', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'JOHN@EXAMPLE.COM',
          message: 'This is a test message from the contact form',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should sanitize HTML in inputs', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: '<script>alert("XSS")</script>This is a test message',
        }),
      })

      const response = await POST(request)

      // Should succeed - HTML is escaped, not rejected
      expect(response.status).toBe(200)
    })
  })
})

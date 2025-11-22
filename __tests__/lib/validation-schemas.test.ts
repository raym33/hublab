/**
 * Unit tests for Zod validation schemas
 * Tests all validation schemas and edge cases
 */

import {
  emailSchema,
  waitlistSchema,
  checkoutSchema,
  compilationSchema,
  contactSchema,
  apiKeySchema,
  projectSchema,
  capsuleSchema,
  paginationSchema,
  searchSchema,
  validateRequest,
} from '@/lib/validation-schemas'

describe('emailSchema', () => {
  it('should validate correct email addresses', () => {
    expect(emailSchema.parse('test@example.com')).toBe('test@example.com')
    expect(emailSchema.parse('user.name@domain.co.uk')).toBe('user.name@domain.co.uk')
    expect(emailSchema.parse('UPPERCASE@EXAMPLE.COM')).toBe('uppercase@example.com')
  })

  it('should trim and lowercase emails', () => {
    expect(emailSchema.parse('  Test@Example.com  ')).toBe('test@example.com')
  })

  it('should reject invalid email formats', () => {
    expect(() => emailSchema.parse('invalid')).toThrow()
    expect(() => emailSchema.parse('invalid@')).toThrow()
    expect(() => emailSchema.parse('@invalid.com')).toThrow()
    expect(() => emailSchema.parse('invalid@.com')).toThrow()
  })

  it('should enforce min length', () => {
    expect(() => emailSchema.parse('a@')).toThrow('Email must be at least 3 characters')
  })

  it('should enforce max length', () => {
    const longEmail = 'a'.repeat(250) + '@example.com'
    expect(() => emailSchema.parse(longEmail)).toThrow('Email must not exceed 254 characters')
  })
})

describe('waitlistSchema', () => {
  it('should validate valid waitlist submission', () => {
    const result = waitlistSchema.parse({
      email: 'test@example.com',
      name: 'John Doe',
      referral: 'friend'
    })
    expect(result.email).toBe('test@example.com')
    expect(result.name).toBe('John Doe')
    expect(result.referral).toBe('friend')
  })

  it('should validate without optional referral', () => {
    const result = waitlistSchema.parse({
      email: 'test@example.com',
      name: 'John Doe'
    })
    expect(result.referral).toBeUndefined()
  })

  it('should reject invalid names', () => {
    expect(() => waitlistSchema.parse({
      email: 'test@example.com',
      name: 'J0hn D0e123' // Invalid characters
    })).toThrow('Name contains invalid characters')
  })

  it('should accept names with hyphens and apostrophes', () => {
    const result = waitlistSchema.parse({
      email: 'test@example.com',
      name: "Mary-Jane O'Connor"
    })
    expect(result.name).toBe("Mary-Jane O'Connor")
  })

  it('should enforce name length constraints', () => {
    expect(() => waitlistSchema.parse({
      email: 'test@example.com',
      name: 'A' // Too short
    })).toThrow('Name must be at least 2 characters')

    expect(() => waitlistSchema.parse({
      email: 'test@example.com',
      name: 'A'.repeat(101) // Too long
    })).toThrow('Name must not exceed 100 characters')
  })
})

describe('checkoutSchema', () => {
  it('should validate valid checkout request', () => {
    const result = checkoutSchema.parse({
      prototypeId: '123e4567-e89b-12d3-a456-426614174000',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    })
    expect(result.prototypeId).toBe('123e4567-e89b-12d3-a456-426614174000')
  })

  it('should reject invalid UUID format', () => {
    expect(() => checkoutSchema.parse({
      prototypeId: 'not-a-uuid'
    })).toThrow('Invalid prototype ID format')
  })

  it('should allow optional URLs', () => {
    const result = checkoutSchema.parse({
      prototypeId: '123e4567-e89b-12d3-a456-426614174000'
    })
    expect(result.successUrl).toBeUndefined()
    expect(result.cancelUrl).toBeUndefined()
  })
})

describe('compilationSchema', () => {
  it('should validate valid compilation request', () => {
    const result = compilationSchema.parse({
      prompt: 'Create a dashboard with charts',
      platform: 'web',
      template: 'dashboard',
      selectedCapsules: ['capsule-1', 'capsule-2']
    })
    expect(result.prompt).toBe('Create a dashboard with charts')
    expect(result.platform).toBe('web')
  })

  it('should use default platform', () => {
    const result = compilationSchema.parse({})
    expect(result.platform).toBe('web')
  })

  it('should validate all platform options', () => {
    const platforms = ['web', 'desktop', 'ios', 'android', 'ai-os']
    platforms.forEach(platform => {
      const result = compilationSchema.parse({ platform })
      expect(result.platform).toBe(platform)
    })
  })

  it('should reject invalid platform', () => {
    expect(() => compilationSchema.parse({
      platform: 'invalid'
    })).toThrow()
  })

  it('should enforce prompt length constraints', () => {
    expect(() => compilationSchema.parse({
      prompt: 'Too short'
    })).toThrow('Prompt must be at least 10 characters')

    expect(() => compilationSchema.parse({
      prompt: 'A'.repeat(5001)
    })).toThrow('Prompt must not exceed 5000 characters')
  })
})

describe('contactSchema', () => {
  it('should validate valid contact form', () => {
    const result = contactSchema.parse({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message that is long enough'
    })
    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john@example.com')
  })

  it('should validate without optional subject', () => {
    const result = contactSchema.parse({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    })
    expect(result.subject).toBeUndefined()
  })

  it('should reject short messages', () => {
    expect(() => contactSchema.parse({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Too short'
    })).toThrow('Message must be at least 10 characters')
  })

  it('should reject long messages', () => {
    expect(() => contactSchema.parse({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'A'.repeat(2001)
    })).toThrow('Message must not exceed 2000 characters')
  })
})

describe('apiKeySchema', () => {
  it('should validate valid API key request', () => {
    const result = apiKeySchema.parse({
      name: 'My API Key',
      tier: 'pro',
      expiresIn: 90
    })
    expect(result.name).toBe('My API Key')
    expect(result.tier).toBe('pro')
  })

  it('should use default tier', () => {
    const result = apiKeySchema.parse({
      name: 'Test Key'
    })
    expect(result.tier).toBe('free')
  })

  it('should validate all tier options', () => {
    const tiers = ['free', 'pro', 'enterprise']
    tiers.forEach(tier => {
      const result = apiKeySchema.parse({ name: 'Test', tier })
      expect(result.tier).toBe(tier)
    })
  })

  it('should reject expiration beyond 365 days', () => {
    expect(() => apiKeySchema.parse({
      name: 'Test Key',
      expiresIn: 400
    })).toThrow('API key cannot expire more than 365 days in the future')
  })

  it('should reject negative expiration', () => {
    expect(() => apiKeySchema.parse({
      name: 'Test Key',
      expiresIn: -10
    })).toThrow()
  })
})

describe('projectSchema', () => {
  it('should validate valid project', () => {
    const result = projectSchema.parse({
      name: 'My Project',
      description: 'A test project',
      template: 'dashboard',
      theme: {
        name: 'Dark',
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981'
        }
      }
    })
    expect(result.name).toBe('My Project')
  })

  it('should validate without optional fields', () => {
    const result = projectSchema.parse({
      name: 'Minimal Project',
      template: 'blank'
    })
    expect(result.description).toBeUndefined()
    expect(result.theme).toBeUndefined()
  })

  it('should validate all template options', () => {
    const templates = ['blank', 'dashboard', 'landing', 'ecommerce', 'admin', 'blog']
    templates.forEach(template => {
      const result = projectSchema.parse({ name: 'Test', template })
      expect(result.template).toBe(template)
    })
  })

  it('should reject invalid color format', () => {
    expect(() => projectSchema.parse({
      name: 'Test',
      template: 'blank',
      theme: {
        name: 'Test',
        colors: {
          primary: 'blue', // Invalid format
          secondary: '#10B981'
        }
      }
    })).toThrow('Invalid color format')
  })
})

describe('capsuleSchema', () => {
  it('should validate valid capsule', () => {
    const result = capsuleSchema.parse({
      name: 'My Capsule',
      description: 'A detailed description of the capsule functionality',
      category: 'ui-components',
      tags: ['react', 'typescript'],
      price: 9.99,
      code: 'export default function Component() { return <div>Test</div> }'
    })
    expect(result.name).toBe('My Capsule')
    expect(result.price).toBe(9.99)
  })

  it('should reject short description', () => {
    expect(() => capsuleSchema.parse({
      name: 'Test',
      description: 'Too short',
      category: 'test',
      tags: [],
      price: 0,
      code: 'const test = 1'
    })).toThrow('Description must be at least 20 characters')
  })

  it('should reject too many tags', () => {
    expect(() => capsuleSchema.parse({
      name: 'Test',
      description: 'A valid description that is long enough',
      category: 'test',
      tags: Array(11).fill('tag'),
      price: 0,
      code: 'const test = 1'
    })).toThrow('Maximum 10 tags allowed')
  })

  it('should reject negative price', () => {
    expect(() => capsuleSchema.parse({
      name: 'Test',
      description: 'A valid description that is long enough',
      category: 'test',
      tags: [],
      price: -5,
      code: 'const test = 1'
    })).toThrow('Price must be non-negative')
  })

  it('should reject excessive price', () => {
    expect(() => capsuleSchema.parse({
      name: 'Test',
      description: 'A valid description that is long enough',
      category: 'test',
      tags: [],
      price: 15000,
      code: 'const test = 1'
    })).toThrow('Price must not exceed $10,000')
  })
})

describe('paginationSchema', () => {
  it('should validate valid pagination', () => {
    const result = paginationSchema.parse({
      page: 2,
      limit: 50
    })
    expect(result.page).toBe(2)
    expect(result.limit).toBe(50)
  })

  it('should use default values', () => {
    const result = paginationSchema.parse({})
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
  })

  it('should coerce strings to numbers', () => {
    const result = paginationSchema.parse({
      page: '3',
      limit: '30'
    })
    expect(result.page).toBe(3)
    expect(result.limit).toBe(30)
  })

  it('should reject limit exceeding 100', () => {
    expect(() => paginationSchema.parse({
      limit: 150
    })).toThrow('Limit must not exceed 100')
  })

  it('should reject non-positive page', () => {
    expect(() => paginationSchema.parse({
      page: 0
    })).toThrow()
  })
})

describe('searchSchema', () => {
  it('should validate valid search', () => {
    const result = searchSchema.parse({
      query: 'test search',
      category: 'ui-components',
      sortBy: 'rating',
      sortOrder: 'asc'
    })
    expect(result.query).toBe('test search')
    expect(result.sortOrder).toBe('asc')
  })

  it('should use default sort order', () => {
    const result = searchSchema.parse({})
    expect(result.sortOrder).toBe('desc')
  })

  it('should trim search query', () => {
    const result = searchSchema.parse({
      query: '  search term  '
    })
    expect(result.query).toBe('search term')
  })

  it('should reject long search query', () => {
    expect(() => searchSchema.parse({
      query: 'A'.repeat(201)
    })).toThrow('Search query must not exceed 200 characters')
  })
})

describe('validateRequest', () => {
  it('should return success for valid data', () => {
    const result = validateRequest(emailSchema, 'test@example.com')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe('test@example.com')
    }
  })

  it('should return errors for invalid data', () => {
    const result = validateRequest(emailSchema, 'invalid')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('Invalid email format')
    }
  })

  it('should handle multiple validation errors', () => {
    const result = validateRequest(contactSchema, {
      name: 'A', // Too short
      email: 'invalid', // Invalid format
      message: 'Short' // Too short
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(1)
    }
  })

  it('should format error paths correctly', () => {
    const result = validateRequest(projectSchema, {
      name: 'Test',
      template: 'invalid'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors[0]).toContain('template:')
    }
  })
})

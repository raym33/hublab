/**
 * Tests for Extended Capsules Batch 14
 * Business, CRM, Sales, Marketing, Revenue Operations
 */

import extendedCapsulesBatch14 from '@/lib/extended-capsules-batch14'

describe('Extended Capsules Batch 14 - Business & CRM', () => {
  it('should have approximately 300 capsules (296)', () => {
    expect(extendedCapsulesBatch14.length).toBeGreaterThanOrEqual(290)
    expect(extendedCapsulesBatch14.length).toBeLessThanOrEqual(310)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch14[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch14.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch14.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have valid React code', () => {
    extendedCapsulesBatch14.forEach(capsule => {
      expect(capsule.code).toContain("'use client'")
      expect(capsule.code).toContain('export default function')
    })
  })

  it('should include CRM capsules', () => {
    const crmCapsules = extendedCapsulesBatch14.filter(c =>
      c.tags.includes('crm') || c.tags.includes('sales') || c.tags.includes('customer')
    )
    expect(crmCapsules.length).toBeGreaterThan(50)
  })

  it('should include marketing automation capsules', () => {
    const marketingCapsules = extendedCapsulesBatch14.filter(c =>
      c.tags.includes('marketing') || c.tags.includes('automation') || c.tags.includes('campaigns')
    )
    expect(marketingCapsules.length).toBeGreaterThan(50)
  })

  it('should include sales & revenue operations capsules', () => {
    const salesCapsules = extendedCapsulesBatch14.filter(c =>
      c.tags.includes('sales') || c.tags.includes('revenue') || c.tags.includes('metrics')
    )
    expect(salesCapsules.length).toBeGreaterThan(50)
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch14.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have proper category assignments', () => {
    const validCategories = ['Dashboard', 'E-commerce']
    extendedCapsulesBatch14.forEach(capsule => {
      expect(validCategories).toContain(capsule.category)
    })
  })

  it('should have CRM contact manager capsule', () => {
    const contactManager = extendedCapsulesBatch14.find(c => c.id === 'crm-contact-manager')
    expect(contactManager).toBeDefined()
    expect(contactManager?.tags).toContain('crm')
  })

  it('should have marketing campaign builder capsule', () => {
    const campaignBuilder = extendedCapsulesBatch14.find(c => c.id === 'marketing-campaign-builder')
    expect(campaignBuilder).toBeDefined()
    expect(campaignBuilder?.tags).toContain('marketing')
  })

  it('should have sales quota tracker capsule', () => {
    const quotaTracker = extendedCapsulesBatch14.find(c => c.id === 'sales-quota-tracker')
    expect(quotaTracker).toBeDefined()
    expect(quotaTracker?.tags).toContain('sales')
  })
})

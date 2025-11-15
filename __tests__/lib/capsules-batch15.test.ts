/**
 * Tests for Extended Capsules Batch 15
 * IoT Advanced, Smart Home, Wearables, Industrial IoT
 */

import extendedCapsulesBatch15 from '@/lib/extended-capsules-batch15'

describe('Extended Capsules Batch 15 - IoT & Smart Home', () => {
  it('should have approximately 300 capsules (294)', () => {
    expect(extendedCapsulesBatch15.length).toBeGreaterThanOrEqual(290)
    expect(extendedCapsulesBatch15.length).toBeLessThanOrEqual(310)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch15[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch15.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch15.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should include smart home capsules', () => {
    const smartHomeCapsules = extendedCapsulesBatch15.filter(c =>
      c.tags.includes('iot') || c.tags.includes('smart-home') || c.tags.includes('automation')
    )
    expect(smartHomeCapsules.length).toBeGreaterThan(50)
  })

  it('should include industrial IoT capsules', () => {
    const iiotCapsules = extendedCapsulesBatch15.filter(c =>
      c.tags.includes('iiot') || c.tags.includes('manufacturing') || c.tags.includes('industry-4.0')
    )
    expect(iiotCapsules.length).toBeGreaterThan(50)
  })

  it('should include wearables & health tech capsules', () => {
    const wearablesCapsules = extendedCapsulesBatch15.filter(c =>
      c.tags.includes('wearables') || c.tags.includes('health') || c.tags.includes('fitness')
    )
    expect(wearablesCapsules.length).toBeGreaterThan(50)
  })

  it('should have smart home dashboard capsule', () => {
    const dashboard = extendedCapsulesBatch15.find(c => c.id === 'smart-home-dashboard')
    expect(dashboard).toBeDefined()
  })

  it('should have factory floor overview capsule', () => {
    const factoryFloor = extendedCapsulesBatch15.find(c => c.id === 'industrial-dashboard-iiot')
    expect(factoryFloor).toBeDefined()
  })

  it('should have fitness tracker capsule', () => {
    const fitnessTracker = extendedCapsulesBatch15.find(c => c.id === 'wearable-dashboard')
    expect(fitnessTracker).toBeDefined()
  })
})

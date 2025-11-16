/**
 * Tests for Extended Capsules Batch 22
 * Travel, Fitness, Events, Supply Chain
 */

import extendedCapsulesBatch22 from '@/lib/extended-capsules-batch22'

describe('Extended Capsules Batch 22 - Travel, Fitness, Events, Supply Chain', () => {
  it('should have exactly 500 capsules', () => {
    expect(extendedCapsulesBatch22.length).toBe(500)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch22[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch22.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch22.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have React platform for all capsules', () => {
    extendedCapsulesBatch22.forEach(capsule => {
      expect(capsule.platform).toBe('react')
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch22.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch22.length)
  })

  it('should have valid React code (export default)', () => {
    extendedCapsulesBatch22.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have Batch 22-related categories', () => {
    const categories = new Set(extendedCapsulesBatch22.map(c => c.category))
    const batch22Categories = ['Travel', 'Fitness', 'Events', 'Supply Chain']

    categories.forEach(cat => {
      expect(batch22Categories).toContain(cat)
    })
  })

  it('should have batch 22 tags in most capsules', () => {
    const capsulesWithBatch22Tags = extendedCapsulesBatch22.filter(capsule => {
      return capsule.tags.some(tag =>
        ['travel', 'booking', 'fitness', 'workout', 'events', 'event', 'supply-chain',
         'logistics', 'tracker', 'reservation', 'calendar', 'scheduling', 'shipment',
         'dashboard', 'manager'].some(keyword =>
          tag.toLowerCase().includes(keyword)
        )
      )
    })
    expect(capsulesWithBatch22Tags.length / extendedCapsulesBatch22.length).toBeGreaterThanOrEqual(0.95)
  })

  it('should have travel capsules', () => {
    const travelCapsules = extendedCapsulesBatch22.filter(c => c.category === 'Travel')
    expect(travelCapsules.length).toBeGreaterThan(0)
  })

  it('should have fitness capsules', () => {
    const fitnessCapsules = extendedCapsulesBatch22.filter(c => c.category === 'Fitness')
    expect(fitnessCapsules.length).toBeGreaterThan(0)
  })

  it('should have events capsules', () => {
    const eventsCapsules = extendedCapsulesBatch22.filter(c => c.category === 'Events')
    expect(eventsCapsules.length).toBeGreaterThan(0)
  })

  it('should have supply chain capsules', () => {
    const supplyChainCapsules = extendedCapsulesBatch22.filter(c => c.category === 'Supply Chain')
    expect(supplyChainCapsules.length).toBeGreaterThan(0)
  })
})

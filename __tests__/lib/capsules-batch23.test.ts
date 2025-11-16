/**
 * Tests for Extended Capsules Batch 23
 * HR, Insurance, Agriculture, Energy
 */

import extendedCapsulesBatch23 from '@/lib/extended-capsules-batch23'

describe('Extended Capsules Batch 23 - HR, Insurance, Agriculture, Energy', () => {
  it('should have exactly 500 capsules', () => {
    expect(extendedCapsulesBatch23.length).toBe(500)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch23[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch23.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch23.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have React platform for all capsules', () => {
    extendedCapsulesBatch23.forEach(capsule => {
      expect(capsule.platform).toBe('react')
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch23.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch23.length)
  })

  it('should have valid React code (export default)', () => {
    extendedCapsulesBatch23.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have Batch 23-related categories', () => {
    const categories = new Set(extendedCapsulesBatch23.map(c => c.category))
    const batch23Categories = ['HR', 'Insurance', 'Agriculture', 'Energy']

    categories.forEach(cat => {
      expect(batch23Categories).toContain(cat)
    })
  })

  it('should have batch 23 tags in most capsules', () => {
    const capsulesWithBatch23Tags = extendedCapsulesBatch23.filter(capsule => {
      return capsule.tags.some(tag =>
        ['hr', 'human-resources', 'insurance', 'agriculture', 'farming', 'energy',
         'recruitment', 'policy', 'crop', 'power', 'monitor', 'calculator', 'analytics',
         'dashboard', 'manager'].some(keyword =>
          tag.toLowerCase().includes(keyword)
        )
      )
    })
    expect(capsulesWithBatch23Tags.length / extendedCapsulesBatch23.length).toBeGreaterThanOrEqual(0.95)
  })

  it('should have HR capsules', () => {
    const hrCapsules = extendedCapsulesBatch23.filter(c => c.category === 'HR')
    expect(hrCapsules.length).toBeGreaterThan(0)
  })

  it('should have insurance capsules', () => {
    const insuranceCapsules = extendedCapsulesBatch23.filter(c => c.category === 'Insurance')
    expect(insuranceCapsules.length).toBeGreaterThan(0)
  })

  it('should have agriculture capsules', () => {
    const agricultureCapsules = extendedCapsulesBatch23.filter(c => c.category === 'Agriculture')
    expect(agricultureCapsules.length).toBeGreaterThan(0)
  })

  it('should have energy capsules', () => {
    const energyCapsules = extendedCapsulesBatch23.filter(c => c.category === 'Energy')
    expect(energyCapsules.length).toBeGreaterThan(0)
  })
})

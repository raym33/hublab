/**
 * Tests for Extended Capsules Batch 21
 * Gaming, Audio Production, Legal Tech, Real Estate
 */

import extendedCapsulesBatch21 from '@/lib/extended-capsules-batch21'

describe('Extended Capsules Batch 21 - Gaming, Audio, Legal, Real Estate', () => {
  it('should have exactly 500 capsules', () => {
    expect(extendedCapsulesBatch21.length).toBe(500)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch21[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch21.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch21.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have React platform for all capsules', () => {
    extendedCapsulesBatch21.forEach(capsule => {
      expect(capsule.platform).toBe('react')
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch21.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch21.length)
  })

  it('should have valid React code (export default)', () => {
    extendedCapsulesBatch21.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have Batch 21-related categories', () => {
    const categories = new Set(extendedCapsulesBatch21.map(c => c.category))
    const batch21Categories = ['Gaming', 'Audio Production', 'Legal Tech', 'Real Estate']

    categories.forEach(cat => {
      expect(batch21Categories).toContain(cat)
    })
  })

  it('should have batch 21 tags in most capsules', () => {
    const capsulesWithBatch21Tags = extendedCapsulesBatch21.filter(capsule => {
      return capsule.tags.some((tag: string) =>
        ['gaming', 'game', 'audio', 'sound', 'legal', 'law', 'real-estate', 'property',
         'hud', 'leaderboard', 'waveform', 'mixer', 'contract', 'compliance', 'listing',
         'dashboard', 'manager', 'viewer', 'player', 'production'].some(keyword =>
          tag.toLowerCase().includes(keyword)
        )
      )
    })
    expect(capsulesWithBatch21Tags.length / extendedCapsulesBatch21.length).toBeGreaterThanOrEqual(0.95)
  })

  it('should have gaming capsules', () => {
    const gamingCapsules = extendedCapsulesBatch21.filter(c => c.category === 'Gaming')
    expect(gamingCapsules.length).toBeGreaterThan(0)
  })

  it('should have audio production capsules', () => {
    const audioCapsules = extendedCapsulesBatch21.filter(c => c.category === 'Audio Production')
    expect(audioCapsules.length).toBeGreaterThan(0)
  })

  it('should have legal tech capsules', () => {
    const legalCapsules = extendedCapsulesBatch21.filter(c => c.category === 'Legal Tech')
    expect(legalCapsules.length).toBeGreaterThan(0)
  })

  it('should have real estate capsules', () => {
    const realEstateCapsules = extendedCapsulesBatch21.filter(c => c.category === 'Real Estate')
    expect(realEstateCapsules.length).toBeGreaterThan(0)
  })
})

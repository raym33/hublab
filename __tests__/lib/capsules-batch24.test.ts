/**
 * Tests for Extended Capsules Batch 24
 * Media, Support, Workflow, Testing
 */

import extendedCapsulesBatch24 from '@/lib/extended-capsules-batch24'

describe('Extended Capsules Batch 24 - Media, Support, Workflow, Testing', () => {
  it('should have exactly 500 capsules', () => {
    expect(extendedCapsulesBatch24.length).toBe(500)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch24[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch24.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch24.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have React platform for all capsules', () => {
    extendedCapsulesBatch24.forEach(capsule => {
      expect(capsule.platform).toBe('react')
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch24.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch24.length)
  })

  it('should have valid React code (export default)', () => {
    extendedCapsulesBatch24.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have Batch 24-related categories', () => {
    const categories = new Set(extendedCapsulesBatch24.map(c => c.category))
    const batch24Categories = ['Media', 'Support', 'Workflow', 'Testing']

    categories.forEach(cat => {
      expect(batch24Categories).toContain(cat)
    })
  })

  it('should have batch 24 tags in most capsules', () => {
    const capsulesWithBatch24Tags = extendedCapsulesBatch24.filter(capsule => {
      return capsule.tags.some(tag =>
        ['media', 'video', 'support', 'helpdesk', 'workflow', 'automation', 'testing',
         'qa', 'editor', 'viewer', 'dashboard', 'manager', 'rich-text', 'ticket',
         'process', 'test-runner'].some(keyword =>
          tag.toLowerCase().includes(keyword)
        )
      )
    })
    expect(capsulesWithBatch24Tags.length / extendedCapsulesBatch24.length).toBeGreaterThanOrEqual(0.95)
  })

  it('should have media capsules', () => {
    const mediaCapsules = extendedCapsulesBatch24.filter(c => c.category === 'Media')
    expect(mediaCapsules.length).toBeGreaterThan(0)
  })

  it('should have support capsules', () => {
    const supportCapsules = extendedCapsulesBatch24.filter(c => c.category === 'Support')
    expect(supportCapsules.length).toBeGreaterThan(0)
  })

  it('should have workflow capsules', () => {
    const workflowCapsules = extendedCapsulesBatch24.filter(c => c.category === 'Workflow')
    expect(workflowCapsules.length).toBeGreaterThan(0)
  })

  it('should have testing capsules', () => {
    const testingCapsules = extendedCapsulesBatch24.filter(c => c.category === 'Testing')
    expect(testingCapsules.length).toBeGreaterThan(0)
  })
})

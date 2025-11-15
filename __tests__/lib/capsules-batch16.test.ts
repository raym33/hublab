/**
 * Tests for Extended Capsules Batch 16
 * Content Management, Publishing, Digital Asset Management
 */

import extendedCapsulesBatch16 from '@/lib/extended-capsules-batch16'

describe('Extended Capsules Batch 16 - CMS & Publishing', () => {
  it('should have approximately 300 capsules (293)', () => {
    expect(extendedCapsulesBatch16.length).toBeGreaterThanOrEqual(290)
    expect(extendedCapsulesBatch16.length).toBeLessThanOrEqual(310)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch16[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch16.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch16.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should include CMS capsules', () => {
    const cmsCapsules = extendedCapsulesBatch16.filter(c =>
      c.tags.includes('cms') || c.tags.includes('content') || c.tags.includes('publishing')
    )
    expect(cmsCapsules.length).toBeGreaterThan(50)
  })

  it('should include DAM capsules', () => {
    const damCapsules = extendedCapsulesBatch16.filter(c =>
      c.tags.includes('dam') || c.tags.includes('assets') || c.tags.includes('media-library')
    )
    expect(damCapsules.length).toBeGreaterThan(50)
  })

  it('should include publishing & editorial capsules', () => {
    const publishingCapsules = extendedCapsulesBatch16.filter(c =>
      c.tags.includes('publishing') || c.tags.includes('editorial') || c.tags.includes('journalism')
    )
    expect(publishingCapsules.length).toBeGreaterThan(50)
  })

  it('should have CMS content editor capsule', () => {
    const contentEditor = extendedCapsulesBatch16.find(c => c.id === 'cms-content-editor')
    expect(contentEditor).toBeDefined()
  })

  it('should have DAM asset library capsule', () => {
    const assetLibrary = extendedCapsulesBatch16.find(c => c.id === 'dam-asset-library')
    expect(assetLibrary).toBeDefined()
  })

  it('should have publishing newsroom dashboard capsule', () => {
    const newsroom = extendedCapsulesBatch16.find(c => c.id === 'publish-newsroom-dashboard')
    expect(newsroom).toBeDefined()
  })
})

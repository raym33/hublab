/**
 * Tests for Extended Capsules Batch 13
 * Design Tools, Creative Suite, Typography, Graphics
 */

import extendedCapsulesBatch13 from '@/lib/extended-capsules-batch13'

describe('Extended Capsules Batch 13 - Design & Creative Tools', () => {
  it('should have approximately 300 capsules (296)', () => {
    expect(extendedCapsulesBatch13.length).toBeGreaterThanOrEqual(290)
    expect(extendedCapsulesBatch13.length).toBeLessThanOrEqual(310)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch13[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch13.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch13.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have valid React code', () => {
    extendedCapsulesBatch13.forEach(capsule => {
      expect(capsule.code).toContain("'use client'")
      expect(capsule.code).toContain('export default function')
    })
  })

  it('should include design tool capsules', () => {
    const designCapsules = extendedCapsulesBatch13.filter(c =>
      c.tags.includes('design') || c.tags.includes('creative') || c.tags.includes('tools')
    )
    expect(designCapsules.length).toBeGreaterThan(50)
  })

  it('should include typography capsules', () => {
    const typoCapsules = extendedCapsulesBatch13.filter(c =>
      c.tags.includes('typography') || c.tags.includes('text') || c.tags.includes('fonts')
    )
    expect(typoCapsules.length).toBeGreaterThan(50)
  })

  it('should include graphics editing capsules', () => {
    const graphicsCapsules = extendedCapsulesBatch13.filter(c =>
      c.tags.includes('graphics') || c.tags.includes('image') || c.tags.includes('editing')
    )
    expect(graphicsCapsules.length).toBeGreaterThan(50)
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch13.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have proper category assignments', () => {
    const validCategories = ['UI', 'Media']
    extendedCapsulesBatch13.forEach(capsule => {
      expect(validCategories).toContain(capsule.category)
    })
  })

  it('should have layer panel capsule', () => {
    const layerPanel = extendedCapsulesBatch13.find(c => c.id === 'design-layer-panel')
    expect(layerPanel).toBeDefined()
    expect(layerPanel?.tags).toContain('design')
  })

  it('should have font selector capsule', () => {
    const fontSelector = extendedCapsulesBatch13.find(c => c.id === 'typo-font-selector')
    expect(fontSelector).toBeDefined()
    expect(fontSelector?.tags).toContain('typography')
  })

  it('should have photo editor capsule', () => {
    const photoEditor = extendedCapsulesBatch13.find(c => c.id === 'graphics-photo-editor')
    expect(photoEditor).toBeDefined()
    expect(photoEditor?.tags).toContain('graphics')
  })
})

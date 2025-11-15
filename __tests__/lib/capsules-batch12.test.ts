/**
 * Tests for Extended Capsules Batch 12
 * Data Science, Analytics, Business Intelligence, Visualization
 */

import extendedCapsulesBatch12 from '@/lib/extended-capsules-batch12'

describe('Extended Capsules Batch 12 - Data Science & Analytics', () => {
  it('should have approximately 300 capsules (297)', () => {
    expect(extendedCapsulesBatch12.length).toBeGreaterThanOrEqual(290)
    expect(extendedCapsulesBatch12.length).toBeLessThanOrEqual(310)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch12[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch12.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch12.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have valid React code with "use client" directive', () => {
    extendedCapsulesBatch12.forEach(capsule => {
      expect(capsule.code).toContain("'use client'")
      expect(capsule.code).toContain('export default function')
    })
  })

  it('should be for React platform', () => {
    extendedCapsulesBatch12.forEach(capsule => {
      expect(capsule.platform).toBe('react')
    })
  })

  it('should include data visualization capsules', () => {
    const datavizCapsules = extendedCapsulesBatch12.filter(c =>
      c.tags.includes('dataviz') || c.tags.includes('chart') || c.tags.includes('visualization')
    )
    expect(datavizCapsules.length).toBeGreaterThan(50)
  })

  it('should include business intelligence capsules', () => {
    const biCapsules = extendedCapsulesBatch12.filter(c =>
      c.tags.includes('bi') || c.tags.includes('analytics') || c.tags.includes('reporting')
    )
    expect(biCapsules.length).toBeGreaterThan(50)
  })

  it('should include statistical analysis capsules', () => {
    const statsCapsules = extendedCapsulesBatch12.filter(c =>
      c.tags.includes('statistics') || c.tags.includes('data-science') || c.tags.includes('ml')
    )
    expect(statsCapsules.length).toBeGreaterThan(50)
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch12.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have proper category assignments', () => {
    const validCategories = ['DataViz', 'Dashboard', 'AI']
    extendedCapsulesBatch12.forEach(capsule => {
      expect(validCategories).toContain(capsule.category)
    })
  })

  it('should have scatter plot capsule', () => {
    const scatterPlot = extendedCapsulesBatch12.find(c => c.id === 'dataviz-scatter-plot')
    expect(scatterPlot).toBeDefined()
    expect(scatterPlot?.name).toContain('Scatter Plot')
  })

  it('should have BI dashboard builder capsule', () => {
    const dashboardBuilder = extendedCapsulesBatch12.find(c => c.id === 'bi-dashboard-builder')
    expect(dashboardBuilder).toBeDefined()
    expect(dashboardBuilder?.tags).toContain('bi')
  })

  it('should have statistical regression model capsule', () => {
    const regressionModel = extendedCapsulesBatch12.find(c => c.id.includes('regression'))
    expect(regressionModel).toBeDefined()
  })
})

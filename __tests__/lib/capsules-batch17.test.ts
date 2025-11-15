/**
 * Tests for Extended Capsules Batch 17
 * APM, Infrastructure Monitoring, Logs, Observability
 */

import extendedCapsulesBatch17 from '@/lib/extended-capsules-batch17'

describe('Extended Capsules Batch 17 - Monitoring & Observability', () => {
  it('should have approximately 300 capsules (295)', () => {
    expect(extendedCapsulesBatch17.length).toBeGreaterThanOrEqual(290)
    expect(extendedCapsulesBatch17.length).toBeLessThanOrEqual(310)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch17[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch17.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch17.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should include APM capsules', () => {
    const apmCapsules = extendedCapsulesBatch17.filter(c =>
      c.tags.includes('apm') || c.tags.includes('monitoring') || c.tags.includes('performance')
    )
    expect(apmCapsules.length).toBeGreaterThan(50)
  })

  it('should include infrastructure monitoring capsules', () => {
    const infraCapsules = extendedCapsulesBatch17.filter(c =>
      c.tags.includes('infrastructure') || c.tags.includes('monitoring') || c.tags.includes('devops')
    )
    expect(infraCapsules.length).toBeGreaterThan(50)
  })

  it('should include logs & observability capsules', () => {
    const logsCapsules = extendedCapsulesBatch17.filter(c =>
      c.tags.includes('logs') || c.tags.includes('observability') || c.tags.includes('monitoring')
    )
    expect(logsCapsules.length).toBeGreaterThan(50)
  })

  it('should have APM overview dashboard capsule', () => {
    const apmDashboard = extendedCapsulesBatch17.find(c => c.id === 'apm-overview-dashboard')
    expect(apmDashboard).toBeDefined()
  })

  it('should have infrastructure map capsule', () => {
    const infraMap = extendedCapsulesBatch17.find(c => c.id === 'infra-infrastructure-map')
    expect(infraMap).toBeDefined()
  })

  it('should have log explorer capsule', () => {
    const logExplorer = extendedCapsulesBatch17.find(c => c.id === 'logs-log-explorer')
    expect(logExplorer).toBeDefined()
  })
})

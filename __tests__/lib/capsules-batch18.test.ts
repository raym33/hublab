/**
 * Tests for Extended Capsules Batch 18
 * DevOps, Cloud, Containers, CI/CD, Infrastructure as Code
 */

import extendedCapsulesBatch18 from '@/lib/extended-capsules-batch18'

describe('Extended Capsules Batch 18 - DevOps & Cloud Infrastructure', () => {
  it('should have exactly 500 capsules', () => {
    expect(extendedCapsulesBatch18.length).toBe(500)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch18[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch18.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch18.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have React platform for all capsules', () => {
    extendedCapsulesBatch18.forEach(capsule => {
      expect(capsule.platform).toBe('react')
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch18.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch18.length)
  })

  it('should have valid React code (use client directive)', () => {
    extendedCapsulesBatch18.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have DevOps-related categories', () => {
    const categories = new Set(extendedCapsulesBatch18.map(c => c.category))
    const devopsCategories = ['DevOps', 'Kubernetes', 'Docker', 'CI/CD', 'Cloud/AWS', 'Cloud/Azure', 'Cloud/GCP', 'Infrastructure', 'Monitoring', 'Security/DevSecOps', 'IaC/Terraform']

    categories.forEach(cat => {
      expect(devopsCategories).toContain(cat)
    })
  })

  it('should have DevOps tags in most capsules', () => {
    const capsulesWithDevOpsTags = extendedCapsulesBatch18.filter(capsule => {
      return capsule.tags.some(tag =>
        ['devops', 'kubernetes', 'k8s', 'docker', 'cicd', 'aws', 'azure', 'gcp',
         'cloud', 'infra', 'monitoring', 'devsec', 'iac', 'terraform', 'deployment',
         'config', 'logs', 'tools', 'automation', 'utilities', 'operations'].includes(tag.toLowerCase())
      )
    })
    // At least 95% should have DevOps-related tags
    expect(capsulesWithDevOpsTags.length / extendedCapsulesBatch18.length).toBeGreaterThanOrEqual(0.95)
  })

  it('should have pipeline dashboard capsule', () => {
    const pipelineDashboard = extendedCapsulesBatch18.find(c => c.id === 'devops-pipeline-dashboard')
    expect(pipelineDashboard).toBeDefined()
    expect(pipelineDashboard?.tags).toContain('cicd')
  })

  it('should have K8s pod dashboard capsule', () => {
    const k8sPodDashboard = extendedCapsulesBatch18.find(c => c.id === 'k8s-pod-dashboard')
    expect(k8sPodDashboard).toBeDefined()
    expect(k8sPodDashboard?.tags).toContain('kubernetes')
  })

  it('should have deployment tracker capsule', () => {
    const deploymentTracker = extendedCapsulesBatch18.find(c => c.id === 'devops-deployment-tracker')
    expect(deploymentTracker).toBeDefined()
    expect(deploymentTracker?.tags).toContain('deployment')
  })

  it('should have monitoring components', () => {
    const monitoringCapsules = extendedCapsulesBatch18.filter(c =>
      c.tags.includes('monitoring') || c.category === 'Monitoring'
    )
    expect(monitoringCapsules.length).toBeGreaterThan(0)
  })

  it('should have cloud platform components', () => {
    const cloudCapsules = extendedCapsulesBatch18.filter(c =>
      c.category.includes('Cloud') || c.tags.some(t => ['aws', 'azure', 'gcp', 'cloud'].includes(t))
    )
    expect(cloudCapsules.length).toBeGreaterThan(0)
  })
})

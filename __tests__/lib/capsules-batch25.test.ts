/**
 * Tests for Extended Capsules Batch 25
 * Quantum Computing, Edge Computing, WebAssembly, Micro-Frontends, GraphQL
 */

import extendedCapsulesBatch25 from '@/lib/extended-capsules-batch25'

describe('Extended Capsules Batch 25 - Quantum, Edge, WASM, MFE, GraphQL', () => {
  it('should have exactly 8 capsules', () => {
    expect(extendedCapsulesBatch25.length).toBe(8)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch25[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
  })

  it('should have AI-friendly descriptions (>=30 chars)', () => {
    extendedCapsulesBatch25.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(30)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch25.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch25.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch25.length)
  })

  it('should have valid React code (export default)', () => {
    extendedCapsulesBatch25.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have client-side code ("use client")', () => {
    extendedCapsulesBatch25.forEach(capsule => {
      expect(capsule.code).toContain("'use client'")
    })
  })

  it('should have Batch 25-related categories', () => {
    const categories = new Set(extendedCapsulesBatch25.map(c => c.category))
    const batch25Categories = [
      'Quantum Computing',
      'Edge Computing',
      'WebAssembly',
      'Micro-Frontends',
      'GraphQL'
    ]

    categories.forEach(cat => {
      expect(batch25Categories).toContain(cat)
    })
  })

  it('should have batch 25 tags in all capsules', () => {
    const capsulesWithBatch25Tags = extendedCapsulesBatch25.filter(capsule => {
      return capsule.tags.some((tag: string) =>
        ['quantum', 'qubit', 'edge', 'node', 'wasm', 'webassembly', 'performance',
         'micro-frontend', 'module-federation', 'graphql', 'query', 'api', 'circuit',
         'simulator', 'deployment', 'benchmark', 'shell', 'builder'].some(keyword =>
          tag.toLowerCase().includes(keyword)
        )
      )
    })
    expect(capsulesWithBatch25Tags.length).toBe(extendedCapsulesBatch25.length)
  })

  it('should have quantum computing capsules', () => {
    const quantumCapsules = extendedCapsulesBatch25.filter(c => c.category === 'Quantum Computing')
    expect(quantumCapsules.length).toBeGreaterThan(0)
  })

  it('should have edge computing capsules', () => {
    const edgeCapsules = extendedCapsulesBatch25.filter(c => c.category === 'Edge Computing')
    expect(edgeCapsules.length).toBeGreaterThan(0)
  })

  it('should have WebAssembly capsules', () => {
    const wasmCapsules = extendedCapsulesBatch25.filter(c => c.category === 'WebAssembly')
    expect(wasmCapsules.length).toBeGreaterThan(0)
  })

  it('should have Micro-Frontends capsules', () => {
    const mfeCapsules = extendedCapsulesBatch25.filter(c => c.category === 'Micro-Frontends')
    expect(mfeCapsules.length).toBeGreaterThan(0)
  })

  it('should have GraphQL capsules', () => {
    const graphqlCapsules = extendedCapsulesBatch25.filter(c => c.category === 'GraphQL')
    expect(graphqlCapsules.length).toBeGreaterThan(0)
  })

  it('should have proper versioning', () => {
    extendedCapsulesBatch25.forEach(capsule => {
      expect(capsule.version).toBeDefined()
      expect(capsule.version).toMatch(/^\d+\.\d+\.\d+$/)
    })
  })

  it('should have author attribution', () => {
    extendedCapsulesBatch25.forEach(capsule => {
      expect(capsule.author).toBeDefined()
      expect(capsule.author).toBe('HubLab')
    })
  })

  it('should have non-empty code implementations', () => {
    extendedCapsulesBatch25.forEach(capsule => {
      expect(capsule.code.length).toBeGreaterThan(100)
    })
  })

  it('should include useState in interactive capsules', () => {
    const interactiveCapsules = extendedCapsulesBatch25.filter(c =>
      ['quantum-circuit-builder', 'quantum-state-visualizer', 'quantum-simulator',
       'edge-node-monitor', 'edge-deployment-manager', 'graphql-query-builder'].includes(c.id)
    )
    interactiveCapsules.forEach(capsule => {
      expect(capsule.code).toContain('useState')
    })
  })

  it('should have complete functional implementations', () => {
    // All capsules should have meaningful implementations
    extendedCapsulesBatch25.forEach(capsule => {
      expect(capsule.code).toContain('return')
      expect(capsule.code.length).toBeGreaterThan(500)
    })
  })
})

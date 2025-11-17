/**
 * Tests for Extended Capsules Batch 26
 * Real-time Collaboration, Voice Interfaces, 3D Visualization,
 * Geospatial, Advanced Animation, Data Streaming, WebRTC
 */

import extendedCapsulesBatch26 from '@/lib/extended-capsules-batch26'

describe('Extended Capsules Batch 26 - Collaboration, Voice, 3D, Geospatial, Animation, Streaming, WebRTC', () => {
  it('should have exactly 12 capsules', () => {
    expect(extendedCapsulesBatch26.length).toBe(12)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch26[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('version')
    expect(capsule).toHaveProperty('author')
  })

  it('should have AI-friendly descriptions (>=40 chars)', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(40)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch26.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch26.length)
  })

  it('should have valid React code (export default)', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have client-side code ("use client")', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      expect(capsule.code).toContain("'use client'")
    })
  })

  it('should have Batch 26-related categories', () => {
    const categories = new Set(extendedCapsulesBatch26.map(c => c.category))
    const batch26Categories = [
      'Real-time Collaboration',
      'Voice Interfaces',
      '3D Visualization',
      'Geospatial',
      'Advanced Animation',
      'Data Streaming',
      'WebRTC'
    ]

    categories.forEach(cat => {
      expect(batch26Categories).toContain(cat)
    })
  })

  it('should have batch 26 tags in all capsules', () => {
    const capsulesWithBatch26Tags = extendedCapsulesBatch26.filter(capsule => {
      return capsule.tags.some((tag: string) =>
        ['collaboration', 'whiteboard', 'voice', 'speech', 'audio', '3d', 'model',
         'geolocation', 'map', 'gps', 'animation', 'particles', 'canvas', 'streaming',
         'data-stream', 'real-time', 'webrtc', 'video', 'conference', 'editor', 'document'].some(keyword =>
          tag.toLowerCase().includes(keyword)
        )
      )
    })
    expect(capsulesWithBatch26Tags.length).toBe(extendedCapsulesBatch26.length)
  })

  it('should have real-time collaboration capsules', () => {
    const collabCapsules = extendedCapsulesBatch26.filter(c => c.category === 'Real-time Collaboration')
    expect(collabCapsules.length).toBe(3)
  })

  it('should have voice interface capsules', () => {
    const voiceCapsules = extendedCapsulesBatch26.filter(c => c.category === 'Voice Interfaces')
    expect(voiceCapsules.length).toBe(2)
  })

  it('should have 3D visualization capsules', () => {
    const threeDCapsules = extendedCapsulesBatch26.filter(c => c.category === '3D Visualization')
    expect(threeDCapsules.length).toBeGreaterThan(0)
  })

  it('should have geospatial capsules', () => {
    const geoCapsules = extendedCapsulesBatch26.filter(c => c.category === 'Geospatial')
    expect(geoCapsules.length).toBeGreaterThan(0)
  })

  it('should have animation capsules', () => {
    const animCapsules = extendedCapsulesBatch26.filter(c => c.category === 'Advanced Animation')
    expect(animCapsules.length).toBeGreaterThan(0)
  })

  it('should have data streaming capsules', () => {
    const streamCapsules = extendedCapsulesBatch26.filter(c => c.category === 'Data Streaming')
    expect(streamCapsules.length).toBeGreaterThan(0)
  })

  it('should have WebRTC capsules', () => {
    const webrtcCapsules = extendedCapsulesBatch26.filter(c => c.category === 'WebRTC')
    expect(webrtcCapsules.length).toBeGreaterThan(0)
  })

  it('should have proper versioning', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      expect(capsule.version).toBeDefined()
      expect(capsule.version).toMatch(/^\d+\.\d+\.\d+$/)
    })
  })

  it('should have author attribution', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      expect(capsule.author).toBeDefined()
      expect(capsule.author).toBe('HubLab')
    })
  })

  it('should have substantial code implementations', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      expect(capsule.code.length).toBeGreaterThan(1000)
    })
  })

  it('should include useState in interactive capsules', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      expect(capsule.code).toContain('useState')
    })
  })

  it('should include useEffect in capsules requiring side effects', () => {
    const effectCapsules = extendedCapsulesBatch26.filter(c =>
      ['particle-animation-canvas', 'real-time-data-stream', 'voice-command-interface'].includes(c.id)
    )
    effectCapsules.forEach(capsule => {
      expect(capsule.code).toContain('useEffect')
    })
  })

  it('should have canvas-based visualizations', () => {
    const canvasCapsules = extendedCapsulesBatch26.filter(c =>
      ['collaborative-whiteboard', 'particle-animation-canvas', 'real-time-data-stream'].includes(c.id)
    )
    canvasCapsules.forEach(capsule => {
      expect(capsule.code.toLowerCase()).toContain('canvas')
    })
  })

  it('should have interactive controls', () => {
    extendedCapsulesBatch26.forEach(capsule => {
      const hasButtons = capsule.code.includes('<button')
      const hasInputs = capsule.code.includes('<input') || capsule.code.includes('<textarea')
      expect(hasButtons || hasInputs).toBe(true)
    })
  })
})

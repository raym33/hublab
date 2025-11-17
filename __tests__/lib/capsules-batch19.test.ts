/**
 * Tests for Extended Capsules Batch 19
 * Mobile, PWA, React Native, Touch, Gestures
 */

import extendedCapsulesBatch19 from '@/lib/extended-capsules-batch19'

describe('Extended Capsules Batch 19 - Mobile & Cross-Platform', () => {
  it('should have exactly 500 capsules', () => {
    expect(extendedCapsulesBatch19.length).toBe(500)
  })

  it('should have valid capsule structure', () => {
    const capsule = extendedCapsulesBatch19[0]

    expect(capsule).toHaveProperty('id')
    expect(capsule).toHaveProperty('name')
    expect(capsule).toHaveProperty('category')
    expect(capsule).toHaveProperty('description')
    expect(capsule).toHaveProperty('tags')
    expect(capsule).toHaveProperty('code')
    expect(capsule).toHaveProperty('platform')
  })

  it('should have AI-friendly descriptions (>=20 chars)', () => {
    extendedCapsulesBatch19.forEach(capsule => {
      expect(capsule.description.length).toBeGreaterThanOrEqual(20)
    })
  })

  it('should have at least 3 tags per capsule', () => {
    extendedCapsulesBatch19.forEach(capsule => {
      expect(capsule.tags.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should have React platform for all capsules', () => {
    extendedCapsulesBatch19.forEach(capsule => {
      expect(capsule.platform).toBe('react')
    })
  })

  it('should have unique IDs', () => {
    const ids = extendedCapsulesBatch19.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(extendedCapsulesBatch19.length)
  })

  it('should have valid React code (export default)', () => {
    extendedCapsulesBatch19.forEach(capsule => {
      expect(capsule.code).toContain('export default')
    })
  })

  it('should have Mobile-related categories', () => {
    const categories = new Set(extendedCapsulesBatch19.map(c => c.category))
    const mobileCategories = ['Mobile', 'PWA', 'React Native', 'Touch/Gestures', 'Responsive',
                               'Native Features', 'Mobile Forms', 'Mobile Navigation', 'Mobile Media', 'App Shell']

    categories.forEach(cat => {
      expect(mobileCategories).toContain(cat)
    })
  })

  it('should have mobile tags in most capsules', () => {
    const capsulesWithMobileTags = extendedCapsulesBatch19.filter(capsule => {
      return capsule.tags.some((tag: string) =>
        ['mobile', 'pwa', 'react-native', 'rn', 'touch', 'gesture', 'responsive',
         'native', 'app-shell', 'component', 'screen', 'widget', 'modal', 'input',
         'keyboard', 'ui', 'layout'].includes(tag.toLowerCase())
      )
    })
    expect(capsulesWithMobileTags.length / extendedCapsulesBatch19.length).toBeGreaterThanOrEqual(0.95)
  })

  it('should have bottom sheet capsule', () => {
    const bottomSheet = extendedCapsulesBatch19.find(c => c.id === 'mobile-bottom-sheet')
    expect(bottomSheet).toBeDefined()
    expect(bottomSheet?.tags).toContain('mobile')
  })

  it('should have tab bar capsule', () => {
    const tabBar = extendedCapsulesBatch19.find(c => c.id === 'mobile-tab-bar')
    expect(tabBar).toBeDefined()
    expect(tabBar?.tags).toContain('navigation')
  })

  it('should have swipe actions capsule', () => {
    const swipeActions = extendedCapsulesBatch19.find(c => c.id === 'mobile-swipe-actions')
    expect(swipeActions).toBeDefined()
    expect(swipeActions?.tags).toContain('swipe')
  })

  it('should have pull to refresh capsule', () => {
    const pullRefresh = extendedCapsulesBatch19.find(c => c.id === 'mobile-pull-refresh')
    expect(pullRefresh).toBeDefined()
    expect(pullRefresh?.tags).toContain('refresh')
  })

  it('should have FAB capsule', () => {
    const fab = extendedCapsulesBatch19.find(c => c.id === 'mobile-floating-action')
    expect(fab).toBeDefined()
    expect(fab?.tags).toContain('fab')
  })

  it('should have mobile UI components', () => {
    const mobileCapsules = extendedCapsulesBatch19.filter(c =>
      c.category === 'Mobile' || c.tags.includes('mobile')
    )
    expect(mobileCapsules.length).toBeGreaterThan(0)
  })
})

/**
 * Capsule Loader - Lazy Loading System
 *
 * Separates metadata from code for optimal bundle size.
 * - Metadata (2.5MB): Always loaded for search/filtering
 * - Code (17MB): Loaded on-demand when capsule is used
 *
 * Bundle size reduction: 89.1%
 */

import capsulesMetadata from './capsules-metadata.json'
import capsulesByCategory from './capsules-by-category.json'
import batchMap from './capsule-batch-map.json'

export interface CapsuleMetadata {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  platform: string
}

export interface Capsule extends CapsuleMetadata {
  code: string
}

// Cache for loaded capsule code
const codeCache = new Map<string, string>()

// Cache for loaded batches
const batchCache = new Map<string, Capsule[]>()

/**
 * Get all capsule metadata (lightweight)
 * Use this for search, filtering, and display lists
 */
export function getAllCapsuleMetadata(): CapsuleMetadata[] {
  return capsulesMetadata as CapsuleMetadata[]
}

/**
 * Get capsules by category (metadata only)
 */
export function getCapsulesByCategory(category: string): CapsuleMetadata[] {
  return (capsulesByCategory as Record<string, CapsuleMetadata[]>)[category] || []
}

/**
 * Get all categories with counts
 */
export function getCategories(): { name: string; count: number }[] {
  return Object.entries(capsulesByCategory as Record<string, CapsuleMetadata[]>).map(
    ([name, capsules]) => ({
      name,
      count: capsules.length,
    })
  )
}

/**
 * Load full capsule code on-demand
 * Returns capsule with code property populated
 */
export async function loadCapsuleCode(id: string): Promise<Capsule | null> {
  // Check cache first
  if (codeCache.has(id)) {
    const metadata = capsulesMetadata.find((c: any) => c.id === id)
    if (metadata) {
      return {
        ...metadata,
        code: codeCache.get(id)!,
      } as Capsule
    }
  }

  // Determine which batch contains this capsule
  const batchName = (batchMap as Record<string, string>)[id]
  if (!batchName) {
    console.error(`Capsule ${id} not found in batch map`)
    return null
  }

  // Load the batch dynamically
  const batch = await loadBatch(batchName)
  if (!batch) {
    console.error(`Failed to load batch ${batchName}`)
    return null
  }

  // Find capsule in loaded batch
  const capsule = batch.find((c) => c.id === id)
  if (!capsule) {
    console.error(`Capsule ${id} not found in batch ${batchName}`)
    return null
  }

  // Cache the code
  codeCache.set(id, capsule.code)

  return capsule
}

/**
 * Load multiple capsule codes at once
 * More efficient than loading one by one
 */
export async function loadCapsuleCodes(ids: string[]): Promise<Map<string, Capsule>> {
  const results = new Map<string, Capsule>()

  // Group IDs by batch
  const batchGroups = new Map<string, string[]>()
  ids.forEach((id) => {
    const batchName = (batchMap as Record<string, string>)[id]
    if (batchName) {
      if (!batchGroups.has(batchName)) {
        batchGroups.set(batchName, [])
      }
      batchGroups.get(batchName)!.push(id)
    }
  })

  // Load all required batches in parallel
  const batchPromises = Array.from(batchGroups.keys()).map((batchName) =>
    loadBatch(batchName)
  )
  const batches = await Promise.all(batchPromises)

  // Extract requested capsules from batches
  batches.forEach((batch, index) => {
    if (!batch) return

    const batchName = Array.from(batchGroups.keys())[index]
    const requestedIds = batchGroups.get(batchName) || []

    requestedIds.forEach((id) => {
      const capsule = batch.find((c) => c.id === id)
      if (capsule) {
        codeCache.set(id, capsule.code)
        results.set(id, capsule)
      }
    })
  })

  return results
}

/**
 * Load a batch of capsules dynamically
 */
async function loadBatch(batchName: string): Promise<Capsule[] | null> {
  // Check cache
  if (batchCache.has(batchName)) {
    return batchCache.get(batchName)!
  }

  try {
    // Extract batch number from name (e.g., "batch1" -> 1)
    const batchNumber = parseInt(batchName.replace('batch', ''))

    // Dynamic import based on batch number
    let batchModule
    switch (batchNumber) {
      case 1:
        batchModule = await import('./extended-capsules-batch1')
        break
      case 2:
        batchModule = await import('./extended-capsules-batch2')
        break
      case 3:
        batchModule = await import('./extended-capsules-batch3')
        break
      case 4:
        batchModule = await import('./extended-capsules-batch4')
        break
      case 5:
        batchModule = await import('./extended-capsules-batch5')
        break
      case 6:
        batchModule = await import('./extended-capsules-batch6')
        break
      case 7:
        batchModule = await import('./extended-capsules-batch7')
        break
      case 8:
        batchModule = await import('./extended-capsules-batch8')
        break
      case 9:
        batchModule = await import('./extended-capsules-batch9')
        break
      case 10:
        batchModule = await import('./extended-capsules-batch10')
        break
      case 11:
        batchModule = await import('./extended-capsules-batch11')
        break
      case 12:
        batchModule = await import('./extended-capsules-batch12')
        break
      case 13:
        batchModule = await import('./extended-capsules-batch13')
        break
      case 14:
        batchModule = await import('./extended-capsules-batch14')
        break
      case 15:
        batchModule = await import('./extended-capsules-batch15')
        break
      case 16:
        batchModule = await import('./extended-capsules-batch16')
        break
      case 17:
        batchModule = await import('./extended-capsules-batch17')
        break
      case 18:
        batchModule = await import('./extended-capsules-batch18')
        break
      case 19:
        batchModule = await import('./extended-capsules-batch19')
        break
      case 20:
        batchModule = await import('./extended-capsules-batch20')
        break
      case 21:
        batchModule = await import('./extended-capsules-batch21')
        break
      case 22:
        batchModule = await import('./extended-capsules-batch22')
        break
      case 23:
        batchModule = await import('./extended-capsules-batch23')
        break
      case 24:
        batchModule = await import('./extended-capsules-batch24')
        break
      case 25:
        batchModule = await import('./extended-capsules-batch25')
        break
      case 26:
        batchModule = await import('./extended-capsules-batch26')
        break
      default:
        console.error(`Unknown batch number: ${batchNumber}`)
        return null
    }

    // Extract capsules from batchModule
    const batch = Object.values(batchModule)[0] as Capsule[]

    // Cache the batch
    batchCache.set(batchName, batch)

    return batch
  } catch (error) {
    console.error(`Failed to load batch ${batchName}:`, error)
    return null
  }
}

/**
 * Preload batches for categories that will be used
 * Call this before rendering to avoid loading spinners
 */
export async function preloadCategories(categories: string[]): Promise<void> {
  const metadata = getAllCapsuleMetadata()
  const idsToPreload = metadata
    .filter((c) => categories.includes(c.category))
    .map((c) => c.id)

  await loadCapsuleCodes(idsToPreload)
}

/**
 * Search capsules (metadata only - fast)
 */
export function searchCapsules(
  query: string,
  options?: {
    category?: string
    tags?: string[]
    limit?: number
  }
): CapsuleMetadata[] {
  const lowerQuery = query.toLowerCase()
  let results = getAllCapsuleMetadata()

  // Filter by query
  if (query) {
    results = results.filter((capsule) => {
      const searchText =
        `${capsule.name} ${capsule.description} ${capsule.tags.join(' ')} ${capsule.category}`.toLowerCase()
      return searchText.includes(lowerQuery)
    })
  }

  // Filter by category
  if (options?.category) {
    results = results.filter((c) => c.category === options.category)
  }

  // Filter by tags
  if (options?.tags && options.tags.length > 0) {
    results = results.filter((c) =>
      options.tags!.some((tag) => c.tags.includes(tag))
    )
  }

  // Apply limit
  if (options?.limit) {
    results = results.slice(0, options.limit)
  }

  return results
}

/**
 * Get statistics
 */
export function getStats() {
  const metadata = getAllCapsuleMetadata()
  const categories = getCategories()
  const allTags = new Set<string>()

  metadata.forEach((c) => c.tags.forEach((tag) => allTags.add(tag)))

  return {
    totalCapsules: metadata.length,
    totalCategories: categories.length,
    totalTags: allTags.size,
    averageCapsulesPerCategory: Math.round(metadata.length / categories.length),
  }
}

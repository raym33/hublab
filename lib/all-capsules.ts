/**
 * All Capsules Registry
 *
 * Centralized import of all 516+ capsules from various libraries
 * Used by Studio V2, IntelligentCapsuleSearch, and VisualTemplateGallery
 */

import { Capsule } from '@/types/capsule'

// New capsule libraries (we know these export correctly)
import notificationCapsules from './notification-capsules'
import advancedFormCapsules from './advanced-form-capsules'
import dataVisualizationCapsules from './data-visualization-capsules'
import layoutCapsules from './layout-capsules'
import navigationCapsules from './navigation-capsules'
import utilityCapsules from './utility-capsules'

// Legacy capsules - Import safely
import { ALL_CAPSULES as legacyCapsules } from './capsules-v2/definitions-extended'

/**
 * Complete capsule catalog with all 516+ capsules
 * Combines legacy capsules with new organized libraries
 */
export const allCapsules: Capsule[] = [
  // Legacy capsules from existing system (400+ capsules)
  ...legacyCapsules,

  // New organized categories (30+ capsules)
  ...notificationCapsules,
  ...advancedFormCapsules,
  ...dataVisualizationCapsules,
  ...layoutCapsules,
  ...navigationCapsules,
  ...utilityCapsules,
]

/**
 * Get all unique categories from capsules
 */
export const getAllCategories = (): string[] => {
  const categories = new Set(allCapsules.map(c => c.category))
  return ['All', ...Array.from(categories).sort()]
}

/**
 * Get capsules by category
 */
export const getCapsulesByCategory = (category: string): Capsule[] => {
  if (category === 'All') return allCapsules
  return allCapsules.filter(c => c.category === category)
}

/**
 * Search capsules by query (name, description, tags)
 */
export const searchCapsules = (query: string): Capsule[] => {
  if (!query.trim()) return allCapsules

  const lowerQuery = query.toLowerCase()
  return allCapsules.filter(capsule =>
    capsule.name.toLowerCase().includes(lowerQuery) ||
    capsule.description.toLowerCase().includes(lowerQuery) ||
    capsule.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get popular capsules (with popularity metadata)
 */
export const getPopularCapsules = (limit: number = 10): Capsule[] => {
  return allCapsules
    .filter(c => c.popularity !== undefined)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit)
}

/**
 * Get recent capsules (latest additions)
 */
export const getRecentCapsules = (limit: number = 10): Capsule[] => {
  // New capsules from the latest libraries
  return [
    ...notificationCapsules,
    ...advancedFormCapsules,
    ...dataVisualizationCapsules,
    ...layoutCapsules,
    ...navigationCapsules,
    ...utilityCapsules,
  ].slice(0, limit)
}

/**
 * Category metadata with icons and colors
 */
export const categoryMetadata: Record<string, {
  icon: string
  color: string
  description: string
}> = {
  'UI': {
    icon: '🎨',
    color: 'blue',
    description: 'User interface components'
  },
  'Form': {
    icon: '📝',
    color: 'green',
    description: 'Form inputs and validation'
  },
  'DataViz': {
    icon: '📊',
    color: 'purple',
    description: 'Data visualization and charts'
  },
  'Media': {
    icon: '🎬',
    color: 'pink',
    description: 'Video, audio, and media players'
  },
  'AI': {
    icon: '🤖',
    color: 'orange',
    description: 'AI and machine learning components'
  },
  'Animation': {
    icon: '✨',
    color: 'yellow',
    description: 'Animations and transitions'
  },
  'Interaction': {
    icon: '👆',
    color: 'indigo',
    description: 'User interactions and gestures'
  },
  'Utility': {
    icon: '🔧',
    color: 'gray',
    description: 'Utility functions and helpers'
  },
  'Layout': {
    icon: '📐',
    color: 'teal',
    description: 'Layout components and grids'
  },
  'Navigation': {
    icon: '🧭',
    color: 'cyan',
    description: 'Navigation and routing'
  },
  'E-commerce': {
    icon: '🛒',
    color: 'emerald',
    description: 'Shopping and commerce features'
  },
  'Image': {
    icon: '🖼️',
    color: 'violet',
    description: 'Image processing and generation'
  },
  'Speech': {
    icon: '🎤',
    color: 'rose',
    description: 'Speech-to-text and text-to-speech'
  },
  'LLM': {
    icon: '🧠',
    color: 'amber',
    description: 'Large language model integrations'
  }
}

/**
 * Get capsules with enriched metadata
 */
export const getEnrichedCapsules = (): (Capsule & {
  categoryColor?: string
  categoryIcon?: string
})[] => {
  return allCapsules.map(capsule => ({
    ...capsule,
    categoryColor: categoryMetadata[capsule.category]?.color,
    categoryIcon: categoryMetadata[capsule.category]?.icon,
  }))
}

/**
 * Statistics about the capsule library
 */
export const getCapsuleStats = () => {
  const categories = getAllCategories()
  const totalCapsules = allCapsules.length

  const categoryDistribution = categories.reduce((acc, category) => {
    if (category === 'All') return acc
    acc[category] = getCapsulesByCategory(category).length
    return acc
  }, {} as Record<string, number>)

  return {
    total: totalCapsules,
    categories: categories.length - 1, // Exclude 'All'
    categoryDistribution,
    averagePerCategory: Math.round(totalCapsules / (categories.length - 1))
  }
}

export default allCapsules

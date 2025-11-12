/**
 * All Capsules Registry
 *
 * Centralized import of all 260 capsules from various libraries
 * Used by Studio V2, IntelligentCapsuleSearch, and VisualTemplateGallery
 *
 * All capsules are now AI-friendly with:
 * - Descriptive descriptions (>30 chars)
 * - Rich tags (3+ per capsule)
 * - Proper React structure ('use client', 'export default')
 * - Normalized categories
 *
 * AI-Friendliness Score: 100%
 */

import { Capsule } from '@/types/capsule'

// New capsule libraries (production-ready, high-quality)
import notificationCapsules from './notification-capsules'        // 5 capsules
import advancedFormCapsules from './advanced-form-capsules'       // 3 capsules
import dataVisualizationCapsules from './data-visualization-capsules' // 4 capsules
import layoutCapsules from './layout-capsules'                    // 4 capsules
import navigationCapsules from './navigation-capsules'            // 4 capsules
import utilityCapsules from './utility-capsules'                  // 4 capsules

// Latest additions (November 2025 - Batch 1)
import socialMediaCapsules from './social-media-capsules'         // 5 capsules
import animationCapsules from './animation-capsules'              // 5 capsules
import aiIntegrationCapsules from './ai-integration-capsules'     // 5 capsules
import dashboardCapsules from './dashboard-capsules'              // 5 capsules

// Latest additions (November 2025 - Batch 2)
import ecommerceCapsules from './ecommerce-capsules'              // 5 capsules
import authCapsules from './auth-capsules'                        // 5 capsules

// Latest additions (November 2025 - Batch 3)
import mediaCapsules from './media-capsules'                      // 5 capsules

// Latest additions (November 2025 - Batch 4)
import interactionCapsules from './interaction-capsules'          // 5 capsules
import feedbackCapsules from './feedback-capsules'                // 5 capsules

// Legacy capsules - Now enhanced for AI-friendliness (100% improved)
import { ALL_CAPSULES as legacyCapsules } from './capsules-v2/definitions-extended'

/**
 * Complete capsule catalog - 285 AI-friendly capsules
 *
 * Breakdown:
 * - 216 Enhanced legacy capsules (100% AI-friendly)
 * - 24 Core capsules (notifications, forms, data viz, layout, navigation, utilities)
 * - 45 New capsules (social, animations, AI, dashboards, e-commerce, auth, media, interaction, feedback)
 *
 * Total: 285 capsules across all categories
 */
export const allCapsules: Capsule[] = [
  // Enhanced legacy capsules (216 capsules - 100% AI-friendly)
  ...legacyCapsules,

  // Core organized categories (24 capsules - production-ready)
  ...notificationCapsules,         // Toast, Progress, Skeleton, Badge, Alert
  ...advancedFormCapsules,         // Multi-step, File Upload, Auto-save
  ...dataVisualizationCapsules,    // Line Chart, Donut, Heatmap, Sparkline
  ...layoutCapsules,               // Grid Gallery, Masonry, Split Pane, Sticky Sidebar
  ...navigationCapsules,           // Breadcrumbs, Pagination, Stepper, Tabs
  ...utilityCapsules,              // Copy to Clipboard, QR Code, Color Picker, Countdown

  // Latest additions Batch 1 (20 capsules - November 2025)
  ...socialMediaCapsules,          // Social Share, Twitter Embed, Instagram Feed, Social Proof, YouTube Player
  ...animationCapsules,            // Scroll Reveal, FAB, Particle Background, Text Morph, Confetti
  ...aiIntegrationCapsules,        // AI Chat, Text Generator, Image Generator, Sentiment Analyzer, Code Formatter
  ...dashboardCapsules,            // KPI Card, Analytics Chart, Activity Feed, Data Table, Performance Dashboard

  // Latest additions Batch 2 (10 capsules - November 2025)
  ...ecommerceCapsules,            // Product Card, Shopping Cart, Price Filter, Checkout, Quick View
  ...authCapsules,                 // Login, Signup, Password Reset, Profile Settings, 2FA

  // Latest additions Batch 3 (5 capsules - November 2025)
  ...mediaCapsules,                // Video Player, Audio Player, Image Gallery, File Uploader, Webcam Capture

  // Latest additions Batch 4 (10 capsules - November 2025)
  ...interactionCapsules,          // Drag & Drop List, Tooltip, Context Menu, Gesture Handler, Rating Input
  ...feedbackCapsules,             // Toast System, Progress Steps, Skeleton Loader, Empty State, Confirmation Dialog
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
  // New capsules from the latest libraries (prioritize newest)
  return [
    ...interactionCapsules,
    ...feedbackCapsules,
    ...mediaCapsules,
    ...ecommerceCapsules,
    ...authCapsules,
    ...socialMediaCapsules,
    ...animationCapsules,
    ...aiIntegrationCapsules,
    ...dashboardCapsules,
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
  },
  'Social': {
    icon: '📱',
    color: 'sky',
    description: 'Social media integrations and sharing'
  },
  'Dashboard': {
    icon: '📈',
    color: 'slate',
    description: 'Dashboard components and analytics'
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

/**
 * All Capsules Registry - EXPANDED TO 2100+ CAPSULES
 *
 * Centralized import of ALL 2100 capsules from various libraries
 * Used by Studio V2, IntelligentCapsuleSearch, VisualTemplateGallery, and Workflow Builder
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

// Core capsule libraries (production-ready, high-quality)
import notificationCapsules from './notification-capsules'        // 5 capsules
import advancedFormCapsules from './advanced-form-capsules'       // 3 capsules
import dataVisualizationCapsules from './data-visualization-capsules' // 4 capsules
import layoutCapsules from './layout-capsules'                    // 4 capsules
import navigationCapsules from './navigation-capsules'            // 4 capsules
import utilityCapsules from './utility-capsules'                  // 4 capsules

// Existing additions (November 2025 - Batches 1-4)
import socialMediaCapsules from './social-media-capsules'         // 5 capsules
import animationCapsules from './animation-capsules'              // 5 capsules
import aiIntegrationCapsules from './ai-integration-capsules'     // 5 capsules
import dashboardCapsules from './dashboard-capsules'              // 5 capsules
import ecommerceCapsules from './ecommerce-capsules'              // 5 capsules
import authCapsules from './auth-capsules'                        // 5 capsules
import mediaCapsules from './media-capsules'                      // 5 capsules
import interactionCapsules from './interaction-capsules'          // 5 capsules
import feedbackCapsules from './feedback-capsules'                // 5 capsules

// NEW: Massive expansion to 2100 capsules (November 2025)
import machineLearningCapsules from './machine-learning-capsules' // 50 capsules
import databaseCapsules from './database-capsules'                // 50 capsules
import extendedCapsulesBatch1 from './extended-capsules-batch1'   // 200 capsules (Analytics, Maps, Real-time, Security)
import extendedCapsulesBatch2 from './extended-capsules-batch2'   // 200 capsules (IoT, Finance, Healthcare, Gaming)
import extendedCapsulesBatch3 from './extended-capsules-batch3'   // 265 capsules (Extended UI, Form, Media, Layout, Nav)
import extendedCapsulesBatch4 from './extended-capsules-batch4'   // 250 capsules (E-commerce Advanced, DevTools, Testing, API, Cloud)
import extendedCapsulesBatch5 from './extended-capsules-batch5'   // 200 capsules (Accessibility, i18n, Mobile, Performance, SEO)
import extendedCapsulesBatch6 from './extended-capsules-batch6'   // 200 capsules (Blockchain, Web3, Crypto, NFT, DeFi)
import extendedCapsulesBatch7 from './extended-capsules-batch7'   // 200 capsules (AR/VR, 3D Graphics, WebGL, Audio)
import extendedCapsulesBatch8 from './extended-capsules-batch8'   // 200 capsules (Productivity, Collaboration, Communication, PM)

// Legacy capsules - Enhanced for AI-friendliness (100% improved)
import { ALL_CAPSULES as legacyCapsules } from './capsules-v2/definitions-extended'

/**
 * Complete capsule catalog - 2100+ AI-friendly capsules
 *
 * Breakdown:
 * - 216 Enhanced legacy capsules (100% AI-friendly)
 * - 24 Core capsules (notifications, forms, data viz, layout, navigation, utilities)
 * - 45 Existing new capsules (social, animations, AI, dashboards, e-commerce, auth, media, interaction, feedback)
 * - 50 Machine Learning capsules (ML models, computer vision, NLP, MLOps)
 * - 50 Database capsules (SQL, NoSQL, query builders, migrations, optimization)
 * - 200 Extended Batch 1 (Analytics, Maps/GIS, Real-time/Streaming, Security)
 * - 200 Extended Batch 2 (IoT, Finance, Healthcare, Gaming)
 * - 265 Extended Batch 3 (Extended UI, Forms, Media, Layouts, Navigation)
 * - 250 Extended Batch 4 (E-commerce Advanced, DevTools, Testing, API Integration, Cloud Services)
 * - 200 Extended Batch 5 (Accessibility, Internationalization, Mobile, Performance, SEO/Marketing)
 * - 200 Extended Batch 6 (Blockchain, Web3, Cryptocurrency, NFT, DeFi, Smart Contracts)
 * - 200 Extended Batch 7 (AR/VR/XR, 3D Graphics, WebGL, Canvas, Audio Processing)
 * - 200 Extended Batch 8 (Productivity, Collaboration, Communication, Project Management)
 *
 * Total: 2100 capsules across 25+ categories
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

  // Existing additions (45 capsules - November 2025)
  ...socialMediaCapsules,          // Social Share, Twitter Embed, Instagram Feed, Social Proof, YouTube Player
  ...animationCapsules,            // Scroll Reveal, FAB, Particle Background, Text Morph, Confetti
  ...aiIntegrationCapsules,        // AI Chat, Text Generator, Image Generator, Sentiment Analyzer, Code Formatter
  ...dashboardCapsules,            // KPI Card, Analytics Chart, Activity Feed, Data Table, Performance Dashboard
  ...ecommerceCapsules,            // Product Card, Shopping Cart, Price Filter, Checkout, Quick View
  ...authCapsules,                 // Login, Signup, Password Reset, Profile Settings, 2FA
  ...mediaCapsules,                // Video Player, Audio Player, Image Gallery, File Uploader, Webcam Capture
  ...interactionCapsules,          // Drag & Drop List, Tooltip, Context Menu, Gesture Handler, Rating Input
  ...feedbackCapsules,             // Toast System, Progress Steps, Skeleton Loader, Empty State, Confirmation Dialog

  // NEW: Massive expansion (1815 capsules - November 2025)
  ...machineLearningCapsules,      // ML models, CV, NLP, MLOps, neural networks, clustering, etc.
  ...databaseCapsules,             // PostgreSQL, MongoDB, Redis, Query Builders, Migrations, etc.
  ...extendedCapsulesBatch1,       // Analytics, Maps/GIS, Real-time/Streaming, Security
  ...extendedCapsulesBatch2,       // IoT, Finance, Healthcare, Gaming
  ...extendedCapsulesBatch3,       // Extended UI, Forms, Media, Layouts, Navigation
  ...extendedCapsulesBatch4,       // E-commerce Advanced, DevTools, Testing, API Integration, Cloud Services
  ...extendedCapsulesBatch5,       // Accessibility, i18n, Mobile, Performance, SEO/Marketing
  ...extendedCapsulesBatch6,       // Blockchain, Web3, Crypto, NFT, DeFi, Smart Contracts
  ...extendedCapsulesBatch7,       // AR/VR/XR, 3D Graphics, WebGL, Canvas, Audio Processing
  ...extendedCapsulesBatch8,       // Productivity, Collaboration, Communication, Project Management
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

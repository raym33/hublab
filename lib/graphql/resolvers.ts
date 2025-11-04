/**
 * GraphQL Resolvers for HubLab AI Integration
 * Implements efficient queries for AI assistants
 */

import { allCapsules, searchCapsules, getCapsulesByCategory, getAllCategories } from '@/lib/all-capsules'

interface SearchComponentsArgs {
  query: string
  category?: string
  tags?: string[]
  complexity?: 'SIMPLE' | 'MEDIUM' | 'COMPLEX'
  limit?: number
  offset?: number
}

interface ComponentArgs {
  id: string
}

interface ComponentsArgs {
  ids: string[]
}

interface ComponentsByCategoryArgs {
  category: string
  limit?: number
  offset?: number
}

// Helper function to determine component complexity
function determineComplexity(capsule: any): 'SIMPLE' | 'MEDIUM' | 'COMPLEX' {
  const codeLength = capsule.code?.length || 0
  const propsCount = capsule.props?.length || 0
  const depsCount = capsule.dependencies?.length || 0

  // Simple: Short code, few props, minimal dependencies
  if (codeLength < 500 && propsCount <= 3 && depsCount <= 2) {
    return 'SIMPLE'
  }

  // Complex: Long code, many props, many dependencies
  if (codeLength > 1500 || propsCount > 8 || depsCount > 5) {
    return 'COMPLEX'
  }

  // Medium: Everything in between
  return 'MEDIUM'
}

// Helper function to get related components
function getRelatedComponents(capsule: any, limit: number = 3) {
  // Find components in same category with similar tags
  const related = allCapsules
    .filter(c => c.id !== capsule.id)
    .filter(c => c.category === capsule.category)
    .filter(c => {
      const commonTags = c.tags?.filter((tag: string) =>
        capsule.tags?.includes(tag)
      ) || []
      return commonTags.length > 0
    })
    .slice(0, limit)
    .map(c => ({
      id: c.id,
      name: c.name,
      category: c.category?.toUpperCase() || 'UI',
      description: c.description || '',
      tags: c.tags || [],
      complexity: determineComplexity(c),
      previewUrl: c.previewUrl || null
    }))

  return related
}

// Helper function to format component summary
function formatComponentSummary(capsule: any) {
  return {
    id: capsule.id,
    name: capsule.name,
    category: capsule.category?.toUpperCase() || 'UI',
    description: capsule.description || '',
    tags: capsule.tags || [],
    complexity: determineComplexity(capsule),
    previewUrl: capsule.previewUrl || null
  }
}

// Helper function to format full component
function formatComponent(capsule: any) {
  return {
    id: capsule.id,
    name: capsule.name,
    category: capsule.category?.toUpperCase() || 'UI',
    description: capsule.description || '',
    longDescription: capsule.longDescription || null,
    code: capsule.code || '',
    props: capsule.props?.map((prop: any) => ({
      name: prop.name,
      type: prop.type,
      description: prop.description || null,
      required: prop.required || false,
      default: prop.default || null,
      options: prop.options || null
    })) || [],
    usage: capsule.usage || '',
    example: capsule.example || '',
    dependencies: capsule.dependencies?.map((dep: any) => ({
      name: typeof dep === 'string' ? dep : dep.name,
      version: typeof dep === 'object' ? dep.version : null,
      required: typeof dep === 'object' ? (dep.required ?? true) : true
    })) || [],
    tags: capsule.tags || [],
    complexity: determineComplexity(capsule),
    accessibility: capsule.accessibility || [],
    previewUrl: capsule.previewUrl || null,
    relatedComponents: getRelatedComponents(capsule),
    createdAt: capsule.createdAt || new Date().toISOString(),
    updatedAt: capsule.updatedAt || new Date().toISOString()
  }
}

export const resolvers = {
  Query: {
    /**
     * Search components with advanced filtering
     */
    searchComponents: (_: any, args: SearchComponentsArgs) => {
      const { query, category, tags, complexity, limit = 10, offset = 0 } = args

      // Start with search results or all capsules
      let results = query ? searchCapsules(query) : allCapsules

      // Filter by category
      if (category && category !== 'ALL') {
        results = results.filter(c =>
          c.category?.toUpperCase() === category.toUpperCase()
        )
      }

      // Filter by tags (AND logic)
      if (tags && tags.length > 0) {
        results = results.filter(c =>
          tags.every(tag => c.tags?.includes(tag))
        )
      }

      // Filter by complexity
      if (complexity) {
        results = results.filter(c =>
          determineComplexity(c) === complexity
        )
      }

      // Get total before pagination
      const total = results.length

      // Apply pagination
      const paginatedResults = results.slice(offset, offset + limit)

      return {
        results: paginatedResults.map(formatComponentSummary),
        total,
        query: query || '',
        limit,
        offset,
        hasMore: offset + limit < total
      }
    },

    /**
     * Get a specific component by ID
     */
    component: (_: any, args: ComponentArgs) => {
      const capsule = allCapsules.find(c => c.id === args.id)
      return capsule ? formatComponent(capsule) : null
    },

    /**
     * Get multiple components by IDs (batch query)
     */
    components: (_: any, args: ComponentsArgs) => {
      const { ids } = args
      return ids
        .map(id => allCapsules.find(c => c.id === id))
        .filter(Boolean)
        .map(formatComponent)
    },

    /**
     * Browse components by category
     */
    componentsByCategory: (_: any, args: ComponentsByCategoryArgs) => {
      const { category, limit = 20, offset = 0 } = args

      const results = getCapsulesByCategory(category.toLowerCase())
      const total = results.length
      const paginatedResults = results.slice(offset, offset + limit)

      return {
        components: paginatedResults.map(formatComponentSummary),
        total,
        category: category.toUpperCase(),
        limit,
        offset,
        hasMore: offset + limit < total
      }
    },

    /**
     * Get library metadata and statistics
     */
    metadata: () => {
      const categories = getAllCategories()
      const categoryCounts = categories.map(cat => {
        const capsules = getCapsulesByCategory(cat.toLowerCase())
        return {
          category: cat.toUpperCase(),
          name: cat,
          count: capsules.length,
          description: getCategoryDescription(cat)
        }
      })

      return {
        name: 'HubLab Component Library',
        version: '2.0.0',
        description: '290+ production-ready React components optimized for AI-assisted development',
        totalComponents: allCapsules.length,
        categories: categoryCounts,
        supportedFrameworks: ['React', 'Next.js', 'Vite', 'Create React App'],
        supportedAI: ['ChatGPT', 'Claude', 'GitHub Copilot', 'Cursor', 'Codeium'],
        lastUpdated: new Date().toISOString(),
        apiVersion: 'v2',
        capabilities: {
          functionCalling: true,
          semanticSearch: true,
          realtimeSearch: false,
          graphql: true,
          contextWindow: 'Optimized for <10KB context',
          openAPISpec: 'https://hublab.dev/api/ai/openapi.json',
          pluginManifest: 'https://hublab.dev/ai/custom-gpt-config.json'
        }
      }
    }
  }
}

// Helper function to get category descriptions
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    ui: 'Standard UI components like buttons, forms, cards, modals, and navigation',
    ecommerce: 'E-commerce components for product listings, carts, checkout, and payments',
    dashboard: 'Dashboard components including charts, tables, stats, and analytics',
    marketing: 'Marketing page components like hero sections, pricing, testimonials, and CTAs'
  }
  return descriptions[category.toLowerCase()] || 'Component category'
}

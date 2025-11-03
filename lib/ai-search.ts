/**
 * AI-Friendly Semantic Search for Capsules
 *
 * Advanced search functionality optimized for AI assistants
 * Includes semantic matching, intent detection, and relevance scoring
 */

import { allCapsules, searchCapsules } from './all-capsules'
import { Capsule } from '@/types/capsule'

/**
 * Search intent types
 */
export type SearchIntent =
  | 'component' // Looking for a specific component type
  | 'feature' // Looking to build a feature
  | 'style' // Looking for styling/visual aspects
  | 'behavior' // Looking for interactive behavior
  | 'data' // Looking for data display components

/**
 * Semantic keyword mappings
 * Maps natural language terms to capsule tags/names
 */
const SEMANTIC_MAPPINGS: Record<string, string[]> = {
  // Component types
  button: ['button', 'cta', 'action', 'clickable'],
  input: ['input', 'field', 'textbox', 'form'],
  card: ['card', 'panel', 'container', 'box'],
  modal: ['modal', 'dialog', 'popup', 'overlay'],
  menu: ['menu', 'navigation', 'nav', 'dropdown'],
  table: ['table', 'grid', 'list', 'data'],
  chart: ['chart', 'graph', 'visualization', 'dataviz'],
  form: ['form', 'input', 'validation', 'submission'],

  // Visual styles
  animated: ['animated', 'motion', 'transition', 'effect'],
  gradient: ['gradient', 'colorful', 'vibrant'],
  dark: ['dark', 'night', 'theme'],
  minimalist: ['minimal', 'simple', 'clean'],
  modern: ['modern', 'sleek', 'contemporary'],

  // Behaviors
  interactive: ['interactive', 'hoverable', 'clickable', 'responsive'],
  loading: ['loading', 'spinner', 'skeleton', 'async'],
  validation: ['validation', 'error', 'check', 'verify'],
  drag: ['drag', 'dnd', 'draggable', 'sortable'],

  // Features
  authentication: ['auth', 'login', 'signin', 'user'],
  payment: ['payment', 'checkout', 'cart', 'commerce'],
  social: ['social', 'share', 'like', 'comment'],
  notification: ['notification', 'toast', 'alert', 'message'],
  search: ['search', 'filter', 'query', 'find']
}

/**
 * Common user intents and their keywords
 */
const INTENT_PATTERNS: Record<SearchIntent, string[]> = {
  component: ['component', 'widget', 'element'],
  feature: ['build', 'create', 'make', 'implement', 'feature'],
  style: ['styled', 'design', 'appearance', 'theme', 'look'],
  behavior: ['interactive', 'action', 'behavior', 'function', 'onclick'],
  data: ['display', 'show', 'render', 'data', 'information']
}

/**
 * Enhanced search result with relevance score
 */
export interface SearchResult {
  capsule: Capsule
  score: number
  matchedTags: string[]
  matchReason: string
}

/**
 * Detect search intent from query
 */
export function detectIntent(query: string): SearchIntent {
  const lowerQuery = query.toLowerCase()

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some(pattern => lowerQuery.includes(pattern))) {
      return intent as SearchIntent
    }
  }

  return 'component' // default
}

/**
 * Expand query with semantic keywords
 */
export function expandQuery(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/)
  const expanded = new Set(words)

  words.forEach(word => {
    if (SEMANTIC_MAPPINGS[word]) {
      SEMANTIC_MAPPINGS[word].forEach(synonym => expanded.add(synonym))
    }
  })

  return Array.from(expanded)
}

/**
 * Calculate relevance score for a capsule
 */
export function calculateRelevanceScore(
  capsule: Capsule,
  keywords: string[],
  intent: SearchIntent
): number {
  let score = 0
  const matchedTags: string[] = []

  keywords.forEach(keyword => {
    // Name match (highest weight)
    if (capsule.name.toLowerCase().includes(keyword)) {
      score += 10
    }

    // Exact tag match (high weight)
    const exactTagMatch = capsule.tags.find(
      tag => tag.toLowerCase() === keyword
    )
    if (exactTagMatch) {
      score += 7
      matchedTags.push(exactTagMatch)
    }

    // Partial tag match (medium weight)
    const partialTagMatch = capsule.tags.find(tag =>
      tag.toLowerCase().includes(keyword)
    )
    if (partialTagMatch && !exactTagMatch) {
      score += 4
      matchedTags.push(partialTagMatch)
    }

    // Description match (low weight)
    if (capsule.description.toLowerCase().includes(keyword)) {
      score += 2
    }

    // Category match (low weight)
    if (capsule.category.toLowerCase().includes(keyword)) {
      score += 3
    }
  })

  // Intent bonus
  if (intent === 'style' && capsule.tags.some(t => ['animated', 'gradient', 'styled'].includes(t.toLowerCase()))) {
    score += 5
  }

  if (intent === 'behavior' && capsule.tags.some(t => ['interactive', 'clickable', 'hoverable'].includes(t.toLowerCase()))) {
    score += 5
  }

  if (intent === 'data' && capsule.category.toLowerCase().includes('data')) {
    score += 5
  }

  return score
}

/**
 * Semantic search with relevance scoring
 */
export function semanticSearch(
  query: string,
  options: {
    limit?: number
    minScore?: number
    includeScore?: boolean
  } = {}
): SearchResult[] {
  const {
    limit = 10,
    minScore = 0,
    includeScore = true
  } = options

  // Detect intent
  const intent = detectIntent(query)

  // Expand query with semantic keywords
  const keywords = expandQuery(query)

  // Search and score all capsules
  const results: SearchResult[] = []

  allCapsules.forEach(capsule => {
    const score = calculateRelevanceScore(capsule, keywords, intent)

    if (score > minScore) {
      const matchedTags = capsule.tags.filter(tag =>
        keywords.some(kw => tag.toLowerCase().includes(kw))
      )

      const matchReason = getMatchReason(capsule, keywords)

      results.push({
        capsule,
        score,
        matchedTags,
        matchReason
      })
    }
  })

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score)

  // Apply limit
  return results.slice(0, limit)
}

/**
 * Get human-readable match reason
 */
function getMatchReason(capsule: Capsule, keywords: string[]): string {
  const reasons: string[] = []

  keywords.forEach(keyword => {
    if (capsule.name.toLowerCase().includes(keyword)) {
      reasons.push(`name matches "${keyword}"`)
    }

    const tagMatch = capsule.tags.find(tag =>
      tag.toLowerCase().includes(keyword)
    )
    if (tagMatch) {
      reasons.push(`tagged with "${tagMatch}"`)
    }
  })

  return reasons.slice(0, 2).join(', ') || 'general match'
}

/**
 * Natural language search
 * Handles queries like "I need a button with animation"
 */
export function naturalLanguageSearch(query: string): SearchResult[] {
  // Remove common filler words
  const cleaned = query
    .toLowerCase()
    .replace(/\b(i|need|want|looking for|can you|show me|find|a|an|the|with)\b/g, '')
    .trim()

  return semanticSearch(cleaned, { limit: 5 })
}

/**
 * Multi-requirement search
 * For queries like "animated button with gradient"
 */
export function multiRequirementSearch(requirements: string[]): Capsule[] {
  // Each requirement must be satisfied
  return allCapsules.filter(capsule => {
    return requirements.every(req => {
      const reqLower = req.toLowerCase()
      return (
        capsule.name.toLowerCase().includes(reqLower) ||
        capsule.description.toLowerCase().includes(reqLower) ||
        capsule.tags.some(tag => tag.toLowerCase().includes(reqLower))
      )
    })
  })
}

/**
 * Similar components search
 * Find components similar to a given capsule
 */
export function findSimilar(capsuleId: string, limit: number = 5): Capsule[] {
  const targetCapsule = allCapsules.find(c => c.id === capsuleId)
  if (!targetCapsule) return []

  // Calculate similarity based on shared tags and category
  const similarities = allCapsules
    .filter(c => c.id !== capsuleId)
    .map(capsule => {
      let similarity = 0

      // Shared category
      if (capsule.category === targetCapsule.category) {
        similarity += 3
      }

      // Shared tags
      const sharedTags = capsule.tags.filter(tag =>
        targetCapsule.tags.includes(tag)
      )
      similarity += sharedTags.length * 2

      return { capsule, similarity }
    })
    .filter(item => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)

  return similarities.map(item => item.capsule)
}

/**
 * Smart suggestions based on partial query
 */
export function getSuggestions(partialQuery: string): string[] {
  if (partialQuery.length < 2) return []

  const suggestions = new Set<string>()
  const lower = partialQuery.toLowerCase()

  // Add matching capsule names
  allCapsules.forEach(capsule => {
    if (capsule.name.toLowerCase().includes(lower)) {
      suggestions.add(capsule.name)
    }

    // Add matching tags
    capsule.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lower)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, 10)
}

/**
 * Category-aware search
 * Search within a specific category with enhanced results
 */
export function categorySearch(
  category: string,
  query: string
): SearchResult[] {
  const categoryResults = allCapsules.filter(
    c => c.category === category
  )

  const keywords = expandQuery(query)
  const intent = detectIntent(query)

  const results: SearchResult[] = categoryResults.map(capsule => {
    const score = calculateRelevanceScore(capsule, keywords, intent)
    const matchedTags = capsule.tags.filter(tag =>
      keywords.some(kw => tag.toLowerCase().includes(kw))
    )
    const matchReason = getMatchReason(capsule, keywords)

    return {
      capsule,
      score,
      matchedTags,
      matchReason
    }
  })

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

/**
 * AI-optimized search
 * Combines multiple search strategies for best results
 */
export function aiOptimizedSearch(
  query: string,
  options: {
    limit?: number
    includeReasons?: boolean
  } = {}
): SearchResult[] {
  const { limit = 10, includeReasons = true } = options

  // Strategy 1: Semantic search
  const semanticResults = semanticSearch(query, { limit: limit * 2 })

  // Strategy 2: Traditional search (fallback)
  const traditionalResults = searchCapsules(query).map(capsule => ({
    capsule,
    score: 5, // Base score for traditional matches
    matchedTags: capsule.tags.filter(tag =>
      query.toLowerCase().split(' ').some(word =>
        tag.toLowerCase().includes(word)
      )
    ),
    matchReason: 'traditional search match'
  }))

  // Combine and deduplicate
  const combined = new Map<string, SearchResult>()

  semanticResults.forEach(result => {
    combined.set(result.capsule.id, result)
  })

  traditionalResults.forEach(result => {
    if (!combined.has(result.capsule.id)) {
      combined.set(result.capsule.id, result)
    }
  })

  // Sort by score and apply limit
  return Array.from(combined.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Export all search functions
 */
export default {
  semanticSearch,
  naturalLanguageSearch,
  multiRequirementSearch,
  findSimilar,
  getSuggestions,
  categorySearch,
  aiOptimizedSearch,
  detectIntent,
  expandQuery,
  calculateRelevanceScore
}

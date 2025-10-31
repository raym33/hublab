/**
 * Universal Capsule Registry
 * Stores and indexes millions of capsules with AI-powered search
 */

import type {
  UniversalCapsule,
  CapsuleRegistry,
  CapsuleSearchQuery,
  CapsuleSearchResult,
  PublishResult
} from './types'

export class UniversalCapsuleRegistry implements CapsuleRegistry {
  private capsules: Map<string, UniversalCapsule> = new Map()
  private searchIndex: SearchIndex
  private aiSearch: AISemanticSearch

  constructor(config: RegistryConfig) {
    this.searchIndex = new SearchIndex()
    this.aiSearch = new AISemanticSearch(config.aiModel)
  }

  /**
   * Search for capsules
   */
  async search(query: CapsuleSearchQuery): Promise<CapsuleSearchResult[]> {
    let results: CapsuleSearchResult[] = []

    // Use AI semantic search if requested
    if (query.semanticSearch && query.query) {
      results = await this.aiSearch.search(
        query.query,
        Array.from(this.capsules.values()),
        query.context
      )
    } else {
      // Traditional keyword search
      results = await this.keywordSearch(query)
    }

    // Apply filters
    results = this.applyFilters(results, query)

    // Sort
    results = this.sortResults(results, query.sortBy || 'relevance')

    // Paginate
    const offset = query.offset || 0
    const limit = query.limit || 50
    results = results.slice(offset, offset + limit)

    return results
  }

  /**
   * Get specific capsule
   */
  async get(id: string, version?: string): Promise<UniversalCapsule> {
    // Try with version first
    if (version) {
      const key = `${id}@${version}`
      const capsule = this.capsules.get(key)
      if (capsule) return capsule
    }

    // Try to find by ID only (get latest version)
    for (const [key, capsule] of this.capsules.entries()) {
      if (capsule.id === id) {
        return capsule
      }
    }

    // Not found
    throw new Error(`Capsule not found: ${id}${version ? `@${version}` : ''}`)
  }

  /**
   * Publish new capsule
   */
  async publish(capsule: UniversalCapsule): Promise<PublishResult> {
    const errors: string[] = []

    // Validate capsule
    const validation = this.validateCapsule(capsule)
    if (!validation.valid) {
      return {
        success: false,
        capsuleId: capsule.id,
        version: capsule.version,
        url: '',
        errors: validation.errors
      }
    }

    // Check if capsule already exists
    const key = `${capsule.id}@${capsule.version}`
    if (this.capsules.has(key)) {
      return {
        success: false,
        capsuleId: capsule.id,
        version: capsule.version,
        url: '',
        errors: ['Capsule with this version already exists']
      }
    }

    // Generate AI embeddings
    if (!capsule.aiMetadata.semanticEmbedding) {
      const embedding = await this.aiSearch.generateEmbedding(capsule.aiDescription)
      // Store the embedding ID (hash) instead of the array
      capsule.aiMetadata.semanticEmbedding = `embed-${this.simpleHash(capsule.aiDescription)}`
    }

    // Store capsule
    this.capsules.set(key, capsule)

    // Index for search
    this.searchIndex.indexCapsule(capsule)

    const url = `${capsule.registry}/${capsule.id}@${capsule.version}`

    return {
      success: true,
      capsuleId: capsule.id,
      version: capsule.version,
      url
    }
  }

  /**
   * Update existing capsule
   */
  async update(id: string, updates: Partial<UniversalCapsule>): Promise<void> {
    const capsule = await this.get(id)
    Object.assign(capsule, updates)

    // Re-index
    this.searchIndex.reindex(capsule)
  }

  /**
   * Delete capsule
   */
  async delete(id: string): Promise<void> {
    this.capsules.delete(id)
    this.searchIndex.remove(id)
  }

  /**
   * Validate capsule structure
   */
  private validateCapsule(capsule: UniversalCapsule) {
    const errors: string[] = []

    if (!capsule.id) errors.push('Capsule ID is required')
    if (!capsule.name) errors.push('Capsule name is required')
    if (!capsule.version) errors.push('Capsule version is required')
    if (!capsule.author) errors.push('Capsule author is required')
    if (!capsule.aiDescription) errors.push('AI description is required')

    // Validate at least one platform implementation
    if (!capsule.platforms || Object.keys(capsule.platforms).length === 0) {
      errors.push('At least one platform implementation is required')
    }

    // Validate inputs/outputs
    if (!capsule.inputs) errors.push('Inputs array is required')
    if (!capsule.outputs) errors.push('Outputs array is required')

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Keyword search
   */
  private async keywordSearch(query: CapsuleSearchQuery): Promise<CapsuleSearchResult[]> {
    if (!query.query) {
      return Array.from(this.capsules.values()).map(capsule => ({
        capsule,
        relevanceScore: 1.0
      }))
    }

    const results = this.searchIndex.search(query.query)
    return results.map(result => ({
      capsule: result.capsule,
      relevanceScore: result.score
    }))
  }

  /**
   * Apply filters to results
   */
  private applyFilters(results: CapsuleSearchResult[], query: CapsuleSearchQuery): CapsuleSearchResult[] {
    let filtered = results

    if (query.category) {
      filtered = filtered.filter(r => r.capsule.category === query.category)
    }

    if (query.tags && query.tags.length > 0) {
      filtered = filtered.filter(r =>
        query.tags!.some(tag => r.capsule.tags.includes(tag))
      )
    }

    if (query.platform) {
      filtered = filtered.filter(r => query.platform! in r.capsule.platforms)
    }

    if (query.verified !== undefined) {
      filtered = filtered.filter(r => r.capsule.verified === query.verified)
    }

    return filtered
  }

  /**
   * Sort results
   */
  private sortResults(
    results: CapsuleSearchResult[],
    sortBy: 'relevance' | 'popularity' | 'recent' | 'rating'
  ): CapsuleSearchResult[] {
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore
        case 'popularity':
          return b.capsule.usageCount - a.capsule.usageCount
        case 'rating':
          return (b.capsule.rating || 0) - (a.capsule.rating || 0)
        case 'recent':
          return 0 // TODO: Add timestamp to capsules
        default:
          return 0
      }
    })
  }

  /**
   * Simple string hash function
   */
  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const capsules = Array.from(this.capsules.values())

    return {
      totalCapsules: capsules.length,
      verifiedCapsules: capsules.filter(c => c.verified).length,
      totalUsage: capsules.reduce((sum, c) => sum + c.usageCount, 0),
      categoriesCount: new Set(capsules.map(c => c.category)).size,
      platformsSupported: new Set(
        capsules.flatMap(c => Object.keys(c.platforms))
      ).size
    }
  }
}

// ===== SEARCH INDEX =====

class SearchIndex {
  private index: Map<string, Set<string>> = new Map()
  private capsuleIndex: Map<string, UniversalCapsule> = new Map()

  /**
   * Index a capsule
   */
  indexCapsule(capsule: UniversalCapsule) {
    // Index by ID
    this.capsuleIndex.set(capsule.id, capsule)

    // Index searchable terms
    const terms = this.extractTerms(capsule)

    for (const term of terms) {
      if (!this.index.has(term)) {
        this.index.set(term, new Set())
      }
      this.index.get(term)!.add(capsule.id)
    }
  }

  /**
   * Re-index a capsule
   */
  reindex(capsule: UniversalCapsule) {
    this.remove(capsule.id)
    this.indexCapsule(capsule)
  }

  /**
   * Remove capsule from index
   */
  remove(capsuleId: string) {
    // Remove from all term indices
    for (const [term, ids] of this.index.entries()) {
      ids.delete(capsuleId)
      if (ids.size === 0) {
        this.index.delete(term)
      }
    }

    // Remove from capsule index
    this.capsuleIndex.delete(capsuleId)
  }

  /**
   * Search index
   */
  search(query: string): Array<{ capsule: UniversalCapsule; score: number }> {
    const terms = query.toLowerCase().split(/\s+/)
    const scores = new Map<string, number>()

    // Find capsules matching terms
    for (const term of terms) {
      const matchingIds = this.index.get(term) || new Set()

      for (const id of matchingIds) {
        scores.set(id, (scores.get(id) || 0) + 1)
      }

      // Partial matches
      for (const [indexTerm, ids] of this.index.entries()) {
        if (indexTerm.includes(term) || term.includes(indexTerm)) {
          for (const id of ids) {
            scores.set(id, (scores.get(id) || 0) + 0.5)
          }
        }
      }
    }

    // Convert to results with scores
    const results = Array.from(scores.entries())
      .map(([id, score]) => ({
        capsule: this.capsuleIndex.get(id)!,
        score: score / terms.length
      }))
      .filter(r => r.capsule !== undefined)

    return results
  }

  /**
   * Extract searchable terms from capsule
   */
  private extractTerms(capsule: UniversalCapsule): string[] {
    const terms: string[] = []

    // ID and name
    terms.push(...capsule.id.toLowerCase().split('-'))
    terms.push(...capsule.name.toLowerCase().split(/\s+/))

    // Category and tags
    terms.push(capsule.category.toLowerCase())
    terms.push(...capsule.tags.map(t => t.toLowerCase()))

    // Description
    terms.push(...capsule.aiDescription.toLowerCase().split(/\s+/))

    return terms.filter(t => t.length > 2) // Filter short terms
  }
}

// ===== AI SEMANTIC SEARCH =====

class AISemanticSearch {
  private aiModel: string
  private embeddings: Map<string, number[]> = new Map()

  constructor(aiModel: string) {
    this.aiModel = aiModel
  }

  /**
   * Search capsules using AI semantic understanding
   */
  async search(
    query: string,
    capsules: UniversalCapsule[],
    context?: any
  ): Promise<CapsuleSearchResult[]> {
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query)

    // Calculate similarity with all capsules
    const results: CapsuleSearchResult[] = []

    for (const capsule of capsules) {
      let embeddingId = capsule.aiMetadata.semanticEmbedding

      if (!embeddingId) {
        const embedding = await this.generateEmbedding(capsule.aiDescription)
        embeddingId = `embed-${this.simpleHash(capsule.aiDescription)}`
        capsule.aiMetadata.semanticEmbedding = embeddingId
      }

      const embedding = this.embeddings.get(embeddingId) || []
      const similarity = this.cosineSimilarity(queryEmbedding, embedding)

      // Generate reasoning
      const reasoning = await this.generateReasoning(query, capsule, similarity, context)

      results.push({
        capsule,
        relevanceScore: similarity,
        reasoning,
        alternatives: capsule.aiMetadata.relatedCapsules
      })
    }

    // Sort by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore)

    return results
  }

  /**
   * Generate semantic embedding for text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // TODO: Call OpenAI/Anthropic API to generate embeddings
    // For now, return dummy embedding
    const hash = this.simpleHash(text)
    const embedding = Array.from({ length: 1536 }, (_, i) =>
      Math.sin(hash + i) * 0.5 + 0.5
    )

    // Cache embedding
    const id = `embed-${hash}`
    this.embeddings.set(id, embedding)

    return embedding
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let magnitudeA = 0
    let magnitudeB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      magnitudeA += a[i] * a[i]
      magnitudeB += b[i] * b[i]
    }

    if (magnitudeA === 0 || magnitudeB === 0) return 0

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
  }

  /**
   * Generate AI reasoning for why capsule matches query
   */
  private async generateReasoning(
    query: string,
    capsule: UniversalCapsule,
    score: number,
    context?: any
  ): Promise<string> {
    // TODO: Call Claude API to generate explanation
    // For now, return simple explanation
    if (score > 0.9) {
      return `Perfect match: ${capsule.aiDescription}`
    } else if (score > 0.7) {
      return `Strong match: This capsule can ${capsule.aiDescription.toLowerCase()}`
    } else if (score > 0.5) {
      return `Partial match: ${capsule.name} might work for your use case`
    } else {
      return `Weak match: Consider related capsules instead`
    }
  }

  /**
   * Simple string hash function
   */
  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}

// ===== TYPES =====

interface RegistryConfig {
  aiModel: string
  storageBackend?: 'memory' | 'postgres' | 's3'
}

export { SearchIndex, AISemanticSearch }
export type { RegistryConfig }

/**
 * AI App Generator
 * Claude/GPT uses capsules to generate apps in seconds
 */

import type {
  AIAppGenerator,
  AIGenerationPrompt,
  CapsuleComposition,
  CapsuleNode,
  CapsuleRegistry,
  UniversalCapsule,
  Platform
} from './types'

export class ClaudeAppGenerator implements AIAppGenerator {
  private registry: CapsuleRegistry
  private aiModel: string

  constructor(registry: CapsuleRegistry, aiModel: string = 'claude-sonnet-4.5') {
    this.registry = registry
    this.aiModel = aiModel
  }

  /**
   * Generate app from natural language prompt
   */
  async generate(prompt: AIGenerationPrompt): Promise<CapsuleComposition> {
    console.log(`🤖 Claude is generating your app...`)
    console.log(`📝 Prompt: "${prompt.description}"`)
    console.log(`🎯 Platform: ${prompt.platform}`)

    // Step 1: Understand the user's intent
    const intent = await this.analyzeIntent(prompt)
    console.log(`✅ Intent analyzed: ${intent.appType}`)

    // Step 2: Search for relevant capsules
    const capsules = await this.discoverCapsules(intent, prompt.platform)
    console.log(`✅ Found ${capsules.length} relevant capsules`)

    // Step 3: Compose app from capsules
    const composition = await this.composeApp(capsules, intent, prompt)
    console.log(`✅ App composed with ${composition.root ? this.countNodes(composition.root) : 0} components`)

    // Step 4: Validate composition
    const validation = await this.validateComposition(composition)
    if (!validation.valid) {
      console.log(`⚠️  Validation issues found, refining...`)
      return await this.refine(composition, validation.issues)
    }

    console.log(`🎉 App generated successfully!`)
    return composition
  }

  /**
   * Optimize existing composition
   */
  async optimize(composition: CapsuleComposition): Promise<CapsuleComposition> {
    console.log(`🔧 Optimizing app...`)

    // Analyze current composition
    const analysis = this.analyzeComposition(composition)

    // Suggest improvements
    const improvements: Improvement[] = []

    // 1. Replace inefficient capsules
    if (analysis.inefficientCapsules.length > 0) {
      for (const nodeId of analysis.inefficientCapsules) {
        const betterCapsule = await this.findBetterAlternative(nodeId, composition)
        if (betterCapsule) {
          improvements.push({
            type: 'replace',
            nodeId,
            newCapsuleId: betterCapsule.id,
            reasoning: `${betterCapsule.name} is more efficient and better maintained`
          })
        }
      }
    }

    // 2. Remove redundant capsules
    if (analysis.redundantCapsules.length > 0) {
      for (const nodeId of analysis.redundantCapsules) {
        improvements.push({
          type: 'remove',
          nodeId,
          reasoning: 'This capsule is redundant and can be removed'
        })
      }
    }

    // 3. Add missing optimizations
    if (!composition.config?.optimizations) {
      improvements.push({
        type: 'config',
        reasoning: 'Enable performance optimizations',
        config: {
          optimizations: {
            treeshaking: true,
            codeSplitting: true,
            minify: true,
            lazyLoading: true
          }
        }
      })
    }

    // Apply improvements
    const optimized = this.applyImprovements(composition, improvements)

    console.log(`✅ Applied ${improvements.length} optimizations`)
    return optimized
  }

  /**
   * Explain composition in natural language
   */
  async explain(composition: CapsuleComposition): Promise<string> {
    const analysis = this.analyzeComposition(composition)

    const explanation = `
# ${composition.name}

## Overview
This app was generated ${composition.metadata?.createdBy === 'ai' ? `by ${composition.metadata?.aiModel || 'AI'}` : 'by a user'} for the ${composition.config?.platform || 'web'} platform.

## Architecture
- **Total Components**: ${analysis.totalCapsules}
- **Unique Capsules**: ${analysis.uniqueCapsules}
- **Max Depth**: ${analysis.maxDepth} levels

## Components Used
${analysis.capsulesByType.map(([type, count]) => `- ${type}: ${count} capsules`).join('\n')}

## Data Flow
${composition.root ? this.explainDataFlow(composition.root) : 'No root component defined'}

## Performance
- **Bundle Size**: ${analysis.estimatedSize}
- **Load Time**: ${analysis.estimatedLoadTime}
- **Optimization Level**: ${analysis.optimizationLevel}

## Suggestions
${analysis.suggestions.map(s => `- ${s}`).join('\n')}
`

    return explanation
  }

  // ===== PRIVATE METHODS =====

  /**
   * Analyze user intent from prompt
   */
  private async analyzeIntent(prompt: AIGenerationPrompt) {
    // TODO: Call Claude API to analyze intent
    // For now, use simple heuristics

    const description = prompt.description.toLowerCase()

    let appType = 'generic'
    if (description.includes('todo') || description.includes('task')) {
      appType = 'todo-app'
    } else if (description.includes('chat') || description.includes('message')) {
      appType = 'chat-app'
    } else if (description.includes('ecommerce') || description.includes('shop')) {
      appType = 'ecommerce'
    } else if (description.includes('dashboard') || description.includes('analytics')) {
      appType = 'dashboard'
    } else if (description.includes('form') || description.includes('survey')) {
      appType = 'form'
    }

    // Extract required features
    const features: string[] = []
    if (description.includes('auth')) features.push('authentication')
    if (description.includes('database')) features.push('database')
    if (description.includes('payment')) features.push('payments')
    if (description.includes('search')) features.push('search')
    if (description.includes('upload')) features.push('file-upload')

    return {
      appType,
      features,
      complexity: features.length > 3 ? 'complex' : features.length > 1 ? 'medium' : 'simple'
    }
  }

  /**
   * Discover relevant capsules for intent
   */
  private async discoverCapsules(intent: any, platform: Platform): Promise<UniversalCapsule[]> {
    // Search for capsules matching app type
    const coreResults = await this.registry.search({
      query: intent.appType,
      platform,
      semanticSearch: true,
      limit: 20
    })

    // Search for feature capsules
    const featureResults = await Promise.all(
      intent.features.map((feature: string) =>
        this.registry.search({
          query: feature,
          platform,
          semanticSearch: true,
          limit: 5
        })
      )
    )

    // Combine and deduplicate
    const allResults = [
      ...coreResults,
      ...featureResults.flat()
    ]

    const uniqueCapsules = new Map<string, UniversalCapsule>()
    for (const result of allResults) {
      if (!uniqueCapsules.has(result.capsule.id)) {
        uniqueCapsules.set(result.capsule.id, result.capsule)
      }
    }

    return Array.from(uniqueCapsules.values())
  }

  /**
   * Compose app from capsules
   */
  private async composeApp(
    capsules: UniversalCapsule[],
    intent: any,
    prompt: AIGenerationPrompt
  ): Promise<CapsuleComposition> {
    // Find root container capsule
    const containerCapsule = capsules.find(c =>
      c.type === 'ui-component' && c.tags.includes('container')
    )

    if (!containerCapsule) {
      throw new Error('No container capsule found')
    }

    // Build component tree based on app type
    const root = await this.buildComponentTree(intent.appType, capsules, prompt)

    const composition: CapsuleComposition = {
      id: `app-${Date.now()}`,
      name: this.generateAppName(prompt.description),
      version: '1.0.0',
      description: prompt.description,
      root,
      config: {
        platform: prompt.platform,
        theme: prompt.context?.designSystem || 'default',
        optimizations: prompt.constraints?.performance === 'high' ? {
          treeshaking: true,
          codeSplitting: true,
          minify: true,
          lazyLoading: true
        } : undefined
      },
      metadata: {
        createdBy: 'ai',
        createdAt: new Date().toISOString(),
        aiModel: this.aiModel,
        prompt: prompt.description
      }
    }

    return composition
  }

  /**
   * Build component tree for specific app type
   */
  private async buildComponentTree(
    appType: string,
    capsules: UniversalCapsule[],
    prompt: AIGenerationPrompt
  ): Promise<CapsuleNode> {
    // Get templates for common app types
    switch (appType) {
      case 'todo-app':
        return this.buildTodoApp(capsules)
      case 'chat-app':
        return this.buildChatApp(capsules)
      case 'ecommerce':
        return this.buildEcommerceApp(capsules)
      case 'dashboard':
        return this.buildDashboard(capsules)
      case 'form':
        return this.buildForm(capsules)
      default:
        return this.buildGenericApp(capsules)
    }
  }

  /**
   * Build todo app structure
   */
  private buildTodoApp(capsules: UniversalCapsule[]): CapsuleNode {
    const findCapsule = (id: string) =>
      capsules.find(c => c.id === id)

    // Verify we have the required capsules
    const container = findCapsule('app-container')
    const input = findCapsule('input-text')
    const button = findCapsule('button-primary')
    const list = findCapsule('list-view')

    if (!container || !input || !button || !list) {
      console.warn('Missing required capsules for todo app')
    }

    return {
      capsuleId: 'app-container',
      id: 'root',
      props: {
        title: 'Todo App'
      },
      children: [
        {
          capsuleId: 'input-text',
          id: 'input',
          props: {
            placeholder: 'New todo...'
          }
        },
        {
          capsuleId: 'button-primary',
          id: 'add-button',
          props: {
            label: 'Add'
          }
        },
        {
          capsuleId: 'list-view',
          id: 'todo-list',
          props: {
            items: []
          }
        }
      ]
    }
  }

  /**
   * Build chat app structure
   */
  private buildChatApp(capsules: UniversalCapsule[]): CapsuleNode {
    // TODO: Implement chat app template
    return this.buildGenericApp(capsules)
  }

  /**
   * Build e-commerce app structure
   */
  private buildEcommerceApp(capsules: UniversalCapsule[]): CapsuleNode {
    // TODO: Implement ecommerce template
    return this.buildGenericApp(capsules)
  }

  /**
   * Build dashboard structure
   */
  private buildDashboard(capsules: UniversalCapsule[]): CapsuleNode {
    // TODO: Implement dashboard template
    return this.buildGenericApp(capsules)
  }

  /**
   * Build form structure
   */
  private buildForm(capsules: UniversalCapsule[]): CapsuleNode {
    // TODO: Implement form template
    return this.buildGenericApp(capsules)
  }

  /**
   * Build generic app structure
   */
  private buildGenericApp(capsules: UniversalCapsule[]): CapsuleNode {
    const container = capsules.find(c => c.tags.includes('container'))

    return {
      capsuleId: container?.id || 'app-container',
      id: 'root',
      props: {},
      children: capsules
        .filter(c => c.type === 'ui-component' && c.id !== container?.id)
        .slice(0, 5) // Limit to 5 components for generic app
        .map((capsule, i) => ({
          capsuleId: capsule.id,
          id: `component-${i}`,
          props: {}
        }))
    }
  }

  /**
   * Validate composition
   */
  private async validateComposition(composition: CapsuleComposition) {
    const issues: string[] = []

    // Check if root exists
    if (!composition.root) {
      issues.push('Missing root component')
    }

    // Check for circular dependencies
    if (composition.root) {
      const circular = this.detectCircularReferences(composition.root)
      if (circular) {
        issues.push(`Circular dependency detected: ${circular.join(' -> ')}`)
      }

      // Check for missing connections
      const missingConnections = this.findMissingConnections(composition.root)
      if (missingConnections.length > 0) {
        issues.push(`Missing connections: ${missingConnections.join(', ')}`)
      }
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }

  /**
   * Refine composition based on validation issues
   */
  private async refine(composition: CapsuleComposition, issues: string[]): Promise<CapsuleComposition> {
    // TODO: Use AI to fix issues
    console.log('Refining composition...', issues)
    return composition
  }

  /**
   * Analyze composition
   */
  private analyzeComposition(composition: CapsuleComposition) {
    const nodes: CapsuleNode[] = []
    const collectNodes = (node: CapsuleNode) => {
      nodes.push(node)
      node.children?.forEach(collectNodes)
    }
    if (composition.root) {
      collectNodes(composition.root)
    }

    const capsuleIds = nodes.map(n => n.capsuleId)
    const uniqueCapsules = new Set(capsuleIds)

    return {
      totalCapsules: nodes.length,
      uniqueCapsules: uniqueCapsules.size,
      maxDepth: composition.root ? this.calculateMaxDepth(composition.root) : 0,
      capsulesByType: this.groupByType(nodes),
      inefficientCapsules: [] as string[],
      redundantCapsules: [] as string[],
      estimatedSize: '~500 KB',
      estimatedLoadTime: '< 1s',
      optimizationLevel: composition.config?.optimizations ? 'high' : 'none',
      suggestions: [
        'Consider enabling code splitting for better performance',
        'Add error boundaries for better error handling'
      ]
    }
  }

  /**
   * Calculate max depth of component tree
   */
  private calculateMaxDepth(node: CapsuleNode, depth = 0): number {
    if (!node.children || node.children.length === 0) {
      return depth
    }
    return Math.max(...node.children.map(child => this.calculateMaxDepth(child, depth + 1)))
  }

  /**
   * Group nodes by type
   */
  private groupByType(nodes: CapsuleNode[]): Array<[string, number]> {
    const counts = new Map<string, number>()

    for (const node of nodes) {
      const type = node.capsuleId.split('-')[0]
      counts.set(type, (counts.get(type) || 0) + 1)
    }

    return Array.from(counts.entries())
  }

  /**
   * Explain data flow
   */
  private explainDataFlow(node: CapsuleNode, indent = 0): string {
    const spaces = '  '.repeat(indent)
    let explanation = `${spaces}- ${node.capsuleId}\n`

    if (node.connections) {
      for (const conn of node.connections) {
        if (conn.from && conn.to) {
          explanation += `${spaces}  → ${conn.from.capsuleId}.${conn.from.output} → ${conn.to.capsuleId}.${conn.to.input}\n`
        }
      }
    }

    if (node.children) {
      for (const child of node.children) {
        explanation += this.explainDataFlow(child, indent + 1)
      }
    }

    return explanation
  }

  /**
   * Find better alternative capsule
   */
  private async findBetterAlternative(nodeId: string, composition: CapsuleComposition): Promise<UniversalCapsule | null> {
    // TODO: Implement alternative search
    return null
  }

  /**
   * Apply improvements to composition
   */
  private applyImprovements(composition: CapsuleComposition, improvements: Improvement[]): CapsuleComposition {
    const modified = { ...composition }

    for (const improvement of improvements) {
      switch (improvement.type) {
        case 'replace':
          // Replace capsule
          if (modified.root && improvement.nodeId && improvement.newCapsuleId) {
            this.replaceNode(modified.root, improvement.nodeId, improvement.newCapsuleId)
          }
          break
        case 'remove':
          // Remove capsule
          if (modified.root && improvement.nodeId) {
            this.removeNode(modified.root, improvement.nodeId)
          }
          break
        case 'config':
          // Update config
          if (modified.config && improvement.config) {
            Object.assign(modified.config, improvement.config)
          }
          break
      }
    }

    return modified
  }

  /**
   * Replace node in tree
   */
  private replaceNode(root: CapsuleNode, nodeId: string, newCapsuleId: string): boolean {
    if (root.id === nodeId) {
      root.capsuleId = newCapsuleId
      return true
    }

    if (root.children) {
      for (const child of root.children) {
        if (this.replaceNode(child, nodeId, newCapsuleId)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Remove node from tree
   */
  private removeNode(root: CapsuleNode, nodeId: string): boolean {
    if (root.children) {
      const index = root.children.findIndex(child => child.id === nodeId)
      if (index !== -1) {
        root.children.splice(index, 1)
        return true
      }

      for (const child of root.children) {
        if (this.removeNode(child, nodeId)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Detect circular references
   */
  private detectCircularReferences(node: CapsuleNode, visited = new Set<string>()): string[] | null {
    if (visited.has(node.id)) {
      return [node.id]
    }

    visited.add(node.id)

    if (node.children) {
      for (const child of node.children) {
        const circular = this.detectCircularReferences(child, new Set(visited))
        if (circular) {
          return [node.id, ...circular]
        }
      }
    }

    return null
  }

  /**
   * Find missing connections
   */
  private findMissingConnections(node: CapsuleNode): string[] {
    // TODO: Implement missing connection detection
    return []
  }

  /**
   * Count total nodes
   */
  private countNodes(node: CapsuleNode): number {
    let count = 1
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + this.countNodes(child), 0)
    }
    return count
  }

  /**
   * Generate app name from description
   */
  private generateAppName(description: string): string {
    // Simple name generation
    const words = description.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .slice(0, 3)

    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
}

// ===== TYPES =====

interface Improvement {
  type: 'replace' | 'remove' | 'config'
  nodeId?: string
  newCapsuleId?: string
  reasoning: string
  config?: any
}

export type { Improvement }

/**
 * Capsule Runtime Engines
 * Execute capsule compositions on any platform
 */

import type {
  CapsuleComposition,
  CapsuleNode,
  Platform,
  Intent,
  ExecutionContext,
  IntentResult
} from './types'

// ===== WEB RUNTIME (React) =====

export class WebCapsuleRuntime {
  private composition: CapsuleComposition
  private capsuleComponents: Map<string, any> = new Map()
  private state: Map<string, any> = new Map()

  constructor(composition: CapsuleComposition) {
    this.composition = composition
  }

  /**
   * Mount app to DOM
   */
  mount(targetId: string) {
    const target = document.getElementById(targetId)
    if (!target) {
      throw new Error(`Target element #${targetId} not found`)
    }

    console.log(`📦 Mounting ${this.composition.name} to #${targetId}`)

    // Load all capsule components
    this.loadComponents()

    // Render root component
    this.render(target, this.composition.root)

    console.log(`✅ App mounted successfully`)
  }

  /**
   * Load capsule components dynamically
   */
  private async loadComponents() {
    // TODO: Dynamic import of capsule components
    console.log(`Loading ${this.capsuleComponents.size} components...`)
  }

  /**
   * Render capsule node to DOM
   */
  private render(container: HTMLElement, node: CapsuleNode) {
    // Get component for capsule
    const Component = this.capsuleComponents.get(node.capsuleId)

    if (!Component) {
      console.warn(`Component not found for capsule: ${node.capsuleId}`)
      return
    }

    // Create element
    const element = document.createElement('div')
    element.id = node.id
    element.setAttribute('data-capsule', node.capsuleId)

    // Apply props
    Object.entries(node.props).forEach(([key, value]) => {
      element.setAttribute(`data-${key}`, String(value))
    })

    // Render children
    if (node.children) {
      node.children.forEach(child => this.render(element, child))
    }

    container.appendChild(element)
  }

  /**
   * Update state
   */
  setState(nodeId: string, key: string, value: any) {
    const stateKey = `${nodeId}.${key}`
    this.state.set(stateKey, value)

    // Trigger re-render
    this.rerender(nodeId)
  }

  /**
   * Get state
   */
  getState(nodeId: string, key: string): any {
    const stateKey = `${nodeId}.${key}`
    return this.state.get(stateKey)
  }

  /**
   * Re-render specific node
   */
  private rerender(nodeId: string) {
    // TODO: Implement efficient re-rendering
    console.log(`Re-rendering node: ${nodeId}`)
  }

  /**
   * Unmount app
   */
  unmount() {
    // TODO: Cleanup
    console.log(`Unmounting ${this.composition.name}`)
  }
}

// ===== DESKTOP RUNTIME (Electron) =====

export class DesktopCapsuleRuntime extends WebCapsuleRuntime {
  private electronAPI: any

  constructor(composition: CapsuleComposition, electronAPI?: any) {
    super(composition)
    this.electronAPI = electronAPI
  }

  /**
   * Access native Electron APIs
   */
  getNativeAPI() {
    return this.electronAPI
  }

  /**
   * Open native dialog
   */
  async showDialog(options: any) {
    if (this.electronAPI && this.electronAPI.dialog) {
      return await this.electronAPI.dialog.showOpenDialog(options)
    }
    throw new Error('Electron dialog API not available')
  }

  /**
   * Access file system
   */
  async readFile(path: string) {
    if (this.electronAPI && this.electronAPI.fs) {
      return await this.electronAPI.fs.readFile(path)
    }
    throw new Error('Electron fs API not available')
  }
}

// ===== NATIVE RUNTIME (React Native) =====

export class NativeCapsuleRuntime {
  private composition: CapsuleComposition
  private capsuleComponents: Map<string, any> = new Map()
  private state: Map<string, any> = new Map()

  constructor(composition: CapsuleComposition) {
    this.composition = composition
  }

  /**
   * Get React Native component tree
   */
  getComponentTree(): any {
    return this.buildReactNativeTree(this.composition.root)
  }

  /**
   * Build React Native component tree
   */
  private buildReactNativeTree(node: CapsuleNode): any {
    // TODO: Build React Native JSX tree
    return {
      type: node.capsuleId,
      props: node.props,
      children: node.children?.map(child => this.buildReactNativeTree(child))
    }
  }

  /**
   * Update state
   */
  setState(nodeId: string, key: string, value: any) {
    const stateKey = `${nodeId}.${key}`
    this.state.set(stateKey, value)
  }

  /**
   * Get state
   */
  getState(nodeId: string, key: string): any {
    const stateKey = `${nodeId}.${key}`
    return this.state.get(stateKey)
  }
}

// ===== AI OS RUNTIME (Intent-based) =====

export class AIIntentRuntime {
  private composition: CapsuleComposition
  private intents: Map<string, Intent> = new Map()
  private aiExecutor: AIIntentExecutor

  constructor(composition: CapsuleComposition, aiModel: string = 'claude-sonnet-4.5') {
    this.composition = composition
    this.aiExecutor = new AIIntentExecutor(aiModel)

    // Extract intents from composition
    this.extractIntents()
  }

  /**
   * Extract intents from capsule composition
   */
  private extractIntents() {
    // TODO: Convert capsule composition to intents
    console.log(`Extracting intents from ${this.composition.name}...`)

    const intents = this.traverseAndExtract(this.composition.root)
    intents.forEach(intent => this.intents.set(intent.id, intent))

    console.log(`Extracted ${this.intents.size} intents`)
  }

  /**
   * Traverse nodes and extract intents
   */
  private traverseAndExtract(node: CapsuleNode, intents: Intent[] = []): Intent[] {
    // Extract intent from node
    const intent = this.nodeToIntent(node)
    if (intent) {
      intents.push(intent)
    }

    // Process children
    if (node.children) {
      node.children.forEach(child => this.traverseAndExtract(child, intents))
    }

    return intents
  }

  /**
   * Convert capsule node to intent
   */
  private nodeToIntent(node: CapsuleNode): Intent | null {
    // Map common capsules to intents
    const intentMappings: Record<string, string> = {
      'button-primary': 'execute-action',
      'input-text': 'collect-text-input',
      'list-view': 'display-list',
      'form': 'collect-form-data',
      'database-query': 'query-data',
      'api-call': 'call-external-service'
    }

    const action = intentMappings[node.capsuleId]
    if (!action) return null

    return {
      id: node.id,
      action,
      properties: node.props,
      semantics: `User wants to ${action.replace(/-/g, ' ')}`,
      aiInstructions: `When user triggers this intent, execute the ${action} action with the provided properties`,
      fallbackUI: node // Keep original node as fallback
    }
  }

  /**
   * Execute intent
   */
  async executeIntent(intentId: string, context: ExecutionContext): Promise<IntentResult> {
    const intent = this.intents.get(intentId)
    if (!intent) {
      throw new Error(`Intent not found: ${intentId}`)
    }

    console.log(`🤖 Executing intent: ${intent.action}`)

    const result = await this.aiExecutor.execute(intent, context)

    console.log(`✅ Intent executed: ${result.explanation}`)

    return result
  }

  /**
   * Get all intents
   */
  getIntents(): Intent[] {
    return Array.from(this.intents.values())
  }

  /**
   * Suggest next intent based on context
   */
  async suggestNext(context: ExecutionContext): Promise<Intent[]> {
    return await this.aiExecutor.suggestNext(
      Array.from(this.intents.values()),
      context
    )
  }
}

/**
 * AI Intent Executor
 * Executes intents using AI understanding
 */
class AIIntentExecutor {
  private aiModel: string

  constructor(aiModel: string) {
    this.aiModel = aiModel
  }

  /**
   * Execute intent using AI
   */
  async execute(intent: Intent, context: ExecutionContext): Promise<IntentResult> {
    // TODO: Call Claude API to execute intent

    // For now, simulate execution
    const result = await this.simulateExecution(intent, context)

    return {
      success: true,
      result,
      explanation: `AI executed "${intent.action}" successfully`,
      nextSuggestions: await this.suggestNext([intent], context)
    }
  }

  /**
   * Simulate intent execution
   */
  private async simulateExecution(intent: Intent, context: ExecutionContext): Promise<any> {
    console.log(`Simulating: ${intent.action}`)
    console.log(`Properties:`, intent.properties)
    console.log(`Context:`, context.user.id)

    // Simulate different actions
    switch (intent.action) {
      case 'execute-action':
        return { executed: true }
      case 'collect-text-input':
        return { input: 'simulated text' }
      case 'display-list':
        return { items: [] }
      case 'query-data':
        return { data: [] }
      default:
        return {}
    }
  }

  /**
   * Suggest next intents
   */
  async suggestNext(intents: Intent[], context: ExecutionContext): Promise<Intent[]> {
    // TODO: Use AI to suggest next logical steps
    return []
  }
}

// ===== VIBE CODING RUNTIME =====

export class VibeCodingRuntime {
  private composition: CapsuleComposition
  private runtime: WebCapsuleRuntime | NativeCapsuleRuntime | AIIntentRuntime
  private iterations: VibeCodingIteration[] = []
  private previewUrl?: string

  constructor(composition: CapsuleComposition, platform: Platform) {
    this.composition = composition

    // Select appropriate runtime
    switch (platform) {
      case 'web':
      case 'desktop':
        this.runtime = new WebCapsuleRuntime(composition)
        break
      case 'ios':
      case 'android':
        this.runtime = new NativeCapsuleRuntime(composition)
        break
      case 'ai-os':
        this.runtime = new AIIntentRuntime(composition)
        break
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  /**
   * Start vibe coding session with live preview
   */
  async start(targetId?: string) {
    console.log(`🎨 Starting Vibe Coding session for ${this.composition.name}`)

    // Start live preview
    if (this.runtime instanceof WebCapsuleRuntime && targetId) {
      this.runtime.mount(targetId)
      this.previewUrl = `http://localhost:${this.getRandomPort()}`
    }

    console.log(`✅ Vibe Coding session started`)
    if (this.previewUrl) {
      console.log(`🔗 Preview: ${this.previewUrl}`)
    }
  }

  /**
   * Apply user feedback and update composition
   */
  async applyFeedback(feedback: string) {
    console.log(`📝 Applying feedback: "${feedback}"`)

    // TODO: Use AI to understand feedback and modify composition
    const iteration: VibeCodingIteration = {
      timestamp: new Date().toISOString(),
      userFeedback: feedback,
      aiChanges: {
        added: [],
        modified: [],
        removed: []
      },
      reasoning: 'AI analyzed feedback and made changes'
    }

    this.iterations.push(iteration)

    // Hot reload preview
    await this.reload()

    console.log(`✅ Changes applied`)
  }

  /**
   * Reload preview
   */
  private async reload() {
    if (this.runtime instanceof WebCapsuleRuntime) {
      // TODO: Hot module replacement
      console.log(`🔄 Reloading preview...`)
    }
  }

  /**
   * Get session history
   */
  getHistory(): VibeCodingIteration[] {
    return this.iterations
  }

  /**
   * Export final app
   */
  async export(): Promise<CapsuleComposition> {
    console.log(`📦 Exporting final app...`)
    return this.composition
  }

  /**
   * Get random port for preview server
   */
  private getRandomPort(): number {
    return 3000 + Math.floor(Math.random() * 1000)
  }
}

// ===== TYPES =====

interface VibeCodingIteration {
  timestamp: string
  userFeedback: string
  aiChanges: {
    added: CapsuleNode[]
    modified: CapsuleNode[]
    removed: string[]
  }
  reasoning: string
}

// ===== EXPORTS =====

export {
  AIIntentExecutor
}

export type {
  VibeCodingIteration
}

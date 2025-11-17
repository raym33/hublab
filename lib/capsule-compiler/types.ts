/**
 * Universal Capsule Compiler - Type Definitions
 * Compiles capsule compositions to any platform
 */

// ===== CORE TYPES =====

export type Platform = 'web' | 'desktop' | 'ios' | 'android' | 'ai-os' | 'custom'

export type CapsuleType =
  | 'ui-component'
  | 'data'
  | 'logic'
  | 'workflow'
  | 'ai'
  | 'integration'

// ===== CAPSULE DEFINITION =====

export interface UniversalCapsule {
  // Identity
  id: string
  name: string
  version: string
  author: string
  registry: string

  // Classification
  category: string
  type: CapsuleType
  tags: string[]
  aiDescription: string
  description?: string  // Alias for aiDescription for compatibility

  // Platform Implementations
  platforms: {
    [key in Platform]?: PlatformImplementation
  }

  // Type System
  inputs: CapsuleInput[]
  outputs: CapsuleOutput[]

  // Dependencies
  dependencies: {
    capsules?: string[]
    npm?: Record<string, string>
    system?: string[]
  }

  // AI Metadata
  aiMetadata: {
    usageExamples: string[]
    semanticEmbedding?: string
    relatedCapsules: string[]
    complexity: 'simple' | 'medium' | 'complex'
  }

  // Verification
  tests?: string
  verified: boolean
  verifiedBy?: string
  usageCount: number
  rating?: number
}

export interface PlatformImplementation {
  engine: string
  code: string
  optimizations?: Record<string, any>
  nativeDependencies?: string[]
}

export interface CapsuleInput {
  name: string
  type: DataType
  required: boolean
  default?: any
  aiDescription: string
  description?: string  // Alias for aiDescription for compatibility
  validation?: ValidationRule[]
}

export interface CapsuleOutput {
  name: string
  type: DataType
  aiDescription: string
  description?: string  // Alias for aiDescription for compatibility
}

export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'function'
  | 'component'
  | 'promise'
  | 'stream'
  | 'intent' // For AI OS

export interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'enum' | 'custom'
  value: any
  message: string
}

// ===== CAPSULE COMPOSITION =====

export interface CapsuleComposition {
  id?: string
  name: string
  version: string
  description?: string
  platform?: Platform  // Flat structure compatibility

  // Tree structure (newer format)
  root?: CapsuleNode

  // Flat structure (legacy format)
  rootCapsule?: string
  capsules?: Array<{
    id: string
    capsuleId: string
    inputs?: Record<string, any>
    props?: Record<string, any>
    [key: string]: any
  }>
  connections?: Array<{
    from: string
    to: string
    fromOutput?: string
    toInput?: string
    outputKey?: string
    inputKey?: string
    [key: string]: any
  }>
  nodes?: Array<any>  // For studio compatibility

  // Global configuration
  config?: {
    theme?: string
    platform: Platform
    optimizations?: OptimizationConfig
  }

  // Metadata
  metadata?: {
    createdBy: 'user' | 'ai'
    createdAt: string
    aiModel?: string
    prompt?: string
  }
}

export interface CapsuleNode {
  // Reference to capsule
  capsuleId: string
  capsuleVersion?: string

  // Instance configuration
  id: string
  props: Record<string, any>
  config?: Record<string, any>  // Additional configuration

  // Connections to other capsules
  connections?: CapsuleConnection[]

  // Children (for container capsules)
  children?: CapsuleNode[]

  // Conditional rendering
  condition?: {
    type: 'if' | 'switch'
    expression: string
  }

  // Loops
  loop?: {
    source: string // data source
    itemVariable: string
    keyVariable?: string
  }
}

export interface CapsuleConnection {
  // Source output (nested format)
  from?: {
    capsuleId: string
    output: string
  }

  // Target input (nested format)
  to?: {
    capsuleId: string
    input: string
  }

  // Flat format compatibility
  fromCapsule?: string
  toCapsule?: string
  outputKey?: string
  inputKey?: string

  // Transformation
  transform?: {
    type: 'map' | 'filter' | 'reduce' | 'custom'
    code: string
  }
}

export interface OptimizationConfig {
  treeshaking: boolean
  codeSplitting: boolean
  minify: boolean
  lazyLoading: boolean
  serverSideRendering?: boolean
  staticGeneration?: boolean
}

// ===== COMPILER OUTPUT =====

export interface CompilationResult {
  success: boolean
  platform: Platform
  output?: CompilationOutput
  errors?: CompilationError[]
  warnings?: CompilationWarning[]
  stats: CompilationStats
}

export interface CompilationOutput {
  // Generated code
  code: {
    [file: string]: string
  }

  // Assets
  assets?: {
    [file: string]: Buffer
  }

  // Package.json
  packageJson: {
    name: string
    version: string
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
  }

  // Configuration files
  config?: {
    [file: string]: any
  }

  // Build instructions
  buildInstructions: {
    install: string[]
    build: string[]
    dev: string[]
    deploy?: string[]
  }

  // Manifest (application metadata)
  manifest?: {
    name: string
    description?: string
    version?: string
    [key: string]: any
  }
}

export interface CompilationError {
  type: 'syntax' | 'type' | 'dependency' | 'platform' | 'validation' | 'network'
  message: string
  location?: {
    capsuleId: string
    line?: number
    column?: number
  }
  suggestion?: string
}

export interface CompilationWarning {
  type: 'performance' | 'compatibility' | 'deprecation'
  message: string
  location?: {
    capsuleId: string
  }
}

export interface CompilationStats {
  duration: number // milliseconds
  capsulesProcessed: number
  linesOfCode: number
  bundleSize?: number // bytes
  dependencies: {
    capsules: number
    npm: number
  }
}

// ===== REGISTRY TYPES =====

export interface CapsuleRegistry {
  search(query: CapsuleSearchQuery): Promise<CapsuleSearchResult[]>
  get(id: string, version?: string): Promise<UniversalCapsule>
  publish(capsule: UniversalCapsule): Promise<PublishResult>
  update(id: string, updates: Partial<UniversalCapsule>): Promise<void>
  delete(id: string): Promise<void>
}

export interface CapsuleSearchQuery {
  // Text search
  query?: string

  // Filters
  category?: string
  tags?: string[]
  platform?: Platform
  verified?: boolean

  // AI-powered search
  semanticSearch?: boolean
  context?: {
    existingCapsules?: string[]
    appType?: string
    userLevel?: 'beginner' | 'intermediate' | 'expert'
  }

  // Pagination
  limit?: number
  offset?: number

  // Sorting
  sortBy?: 'relevance' | 'popularity' | 'recent' | 'rating'
}

export interface CapsuleSearchResult {
  capsule: UniversalCapsule
  relevanceScore: number
  reasoning?: string // AI explanation
  alternatives?: string[] // Similar capsules
}

export interface PublishResult {
  success: boolean
  capsuleId: string
  version: string
  url: string
  errors?: string[]
}

// ===== AI TYPES =====

export interface AIAppGenerator {
  generate(prompt: AIGenerationPrompt): Promise<CapsuleComposition>
  optimize(composition: CapsuleComposition): Promise<CapsuleComposition>
  explain(composition: CapsuleComposition): Promise<string>
}

export interface AIGenerationPrompt {
  // User's natural language description
  description: string

  // Target platform
  platform: Platform

  // Constraints
  constraints?: {
    maxCapsules?: number
    preferredLibraries?: string[]
    performance?: 'low' | 'medium' | 'high'
    bundle?: 'minimal' | 'normal' | 'full'
  }

  // Context
  context?: {
    existingApp?: CapsuleComposition
    userPreferences?: Record<string, any>
    designSystem?: string
  }
}

// ===== INTENT TYPES (For AI OS) =====

export interface Intent {
  id: string
  action: string
  entity?: string
  properties?: Record<string, any>
  semantics: string

  // For AI to understand and execute
  aiInstructions: string

  // Fallback UI (if AI OS wants to show traditional interface)
  fallbackUI?: CapsuleNode
}

export interface AIOperatingSystem {
  executeIntent(intent: Intent, context: ExecutionContext): Promise<IntentResult>
  understandApp(composition: CapsuleComposition): Promise<Intent[]>
  suggestOptimization(intents: Intent[]): Promise<Intent[]>
}

export interface ExecutionContext {
  user: {
    id: string
    preferences: Record<string, any>
    history: Intent[]
  }
  environment: {
    device: string
    location?: string
    time: string
  }
}

export interface IntentResult {
  success: boolean
  result?: any
  explanation: string
  nextSuggestions?: Intent[]
}

// ===== VIBE CODING TYPES =====

export interface VibeCodingSession {
  id: string
  user: string
  prompt: string

  // AI-generated composition (evolving in real-time)
  composition: CapsuleComposition

  // User feedback loop
  iterations: VibeCodingIteration[]

  // Real-time preview
  preview?: {
    platform: Platform
    url: string
  }
}

export interface VibeCodingIteration {
  timestamp: string
  userFeedback: string
  aiChanges: {
    added: CapsuleNode[]
    modified: CapsuleNode[]
    removed: string[]
  }
  reasoning: string
}

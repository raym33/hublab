/**
 * Universal Capsule Compiler
 * Export all public APIs
 */

// Core Compiler
export { UniversalCapsuleCompiler } from './compiler'
export type { PlatformCompiler, CompilationOptions } from './compiler'

// Registry
export { UniversalCapsuleRegistry } from './registry'
export type { RegistryConfig } from './registry'

// AI Generator
export { ClaudeAppGenerator } from './ai-generator'
export type { Improvement } from './ai-generator'

// Runtimes
export {
  WebCapsuleRuntime,
  DesktopCapsuleRuntime,
  NativeCapsuleRuntime,
  AIIntentRuntime,
  VibeCodingRuntime
} from './runtimes'

// Example Capsules
export { EXAMPLE_CAPSULES, getCapsule, searchCapsules } from './example-capsules'

// Types
export type {
  Platform,
  CapsuleType,
  UniversalCapsule,
  PlatformImplementation,
  CapsuleInput,
  CapsuleOutput,
  DataType,
  ValidationRule,
  CapsuleComposition,
  CapsuleNode,
  CapsuleConnection,
  OptimizationConfig,
  CompilationResult,
  CompilationOutput,
  CompilationError,
  CompilationWarning,
  CompilationStats,
  CapsuleRegistry,
  CapsuleSearchQuery,
  CapsuleSearchResult,
  PublishResult,
  AIAppGenerator,
  AIGenerationPrompt,
  Intent,
  AIOperatingSystem,
  ExecutionContext,
  IntentResult,
  VibeCodingSession,
  VibeCodingIteration
} from './types'

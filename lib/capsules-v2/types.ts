/**
 * Sistema de Cápsulas V2 - Simplificado
 * Cada cápsula contiene su código completo embebido
 */

export interface CapsuleDefinition {
  id: string
  name: string
  description: string
  category: 'ui' | 'logic' | 'layout' | 'feature'
  props: CapsuleProp[]
  code: string // Código React completo
  dependencies: string[] // npm packages necesarios
  preview?: string // URL de preview image
}

export interface CapsuleProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  default?: any
  description: string
}

export interface AppComposition {
  name: string
  description: string
  capsules: CapsuleInstance[]
  layout: 'single' | 'grid' | 'flex' | 'custom'
  customLayout?: string
}

export interface CapsuleInstance {
  capsuleId: string
  instanceId: string
  props: Record<string, any>
}

export interface CompilationResult {
  success: boolean
  code: string
  html: string
  error?: string
  dependencies: string[]
}

/**
 * Capsule Type Definition
 *
 * Defines the structure of a capsule in HubLab
 */

export interface Capsule {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  version?: string
  author?: string
  platform?: string
  code: string
  dependencies?: string[]
  metadata?: Record<string, any>
  props?: Record<string, any>
  popularity?: number
}

export type CapsuleCategory = string

export interface CapsuleSearchOptions {
  query?: string
  category?: string
  platform?: string
  tags?: string[]
  limit?: number
  offset?: number
}

export interface CapsuleSearchResult {
  capsules: Capsule[]
  total: number
  took_ms?: number
}

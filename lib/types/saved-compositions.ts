import type { CapsuleComposition, CompilationResult } from '@/lib/capsule-compiler/types'

export interface SavedComposition {
  id: string
  user_id: string
  name: string
  description: string | null
  prompt: string | null
  platform: 'web' | 'desktop' | 'ios' | 'android' | 'ai-os'
  composition: CapsuleComposition
  compilation_result: CompilationResult | null
  thumbnail_url: string | null
  is_public: boolean
  is_template: boolean
  tags: string[]
  fork_count: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface SavedCompositionWithStats extends SavedComposition {
  like_count: number
  fork_count_actual: number
  author_email: string
  author_name: string | null
  author_avatar: string | null
}

export interface CompositionFork {
  id: string
  original_id: string
  forked_id: string
  user_id: string
  created_at: string
}

export interface CompositionLike {
  id: string
  composition_id: string
  user_id: string
  created_at: string
}

export interface CreateCompositionInput {
  name: string
  description?: string
  prompt?: string
  platform: 'web' | 'desktop' | 'ios' | 'android' | 'ai-os'
  composition: CapsuleComposition
  compilation_result?: CompilationResult
  is_public?: boolean
  tags?: string[]
}

export interface UpdateCompositionInput {
  name?: string
  description?: string
  is_public?: boolean
  tags?: string[]
  composition?: CapsuleComposition
  compilation_result?: CompilationResult
}

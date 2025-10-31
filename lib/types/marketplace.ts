import type { UniversalCapsule } from '@/lib/capsule-compiler/types'

export interface UserCapsule {
  id: string
  user_id: string
  capsule_id: string
  name: string
  version: string
  author: string
  category: string
  type: string
  tags: string[]
  ai_description: string
  usage_examples: string[]
  related_capsules: string[]
  complexity: 'simple' | 'intermediate' | 'advanced'
  platforms: UniversalCapsule['platforms']
  inputs: UniversalCapsule['inputs']
  outputs: UniversalCapsule['outputs']
  dependencies: UniversalCapsule['dependencies']
  status: 'draft' | 'pending_review' | 'approved' | 'rejected'
  is_public: boolean
  is_featured: boolean
  review_status: 'pending' | 'approved' | 'rejected'
  review_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  download_count: number
  usage_count: number
  star_count: number
  fork_count: number
  price_cents: number
  license: string
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface MarketplaceCapsule extends UserCapsule {
  stars_actual: number
  review_count: number
  avg_rating: number
  author_email: string
  author_name: string | null
  author_avatar: string | null
}

export interface CapsuleStar {
  id: string
  capsule_id: string
  user_id: string
  created_at: string
}

export interface CapsuleReview {
  id: string
  capsule_id: string
  user_id: string
  rating: number
  review_text: string | null
  created_at: string
  updated_at: string
}

export interface CapsuleUsageLog {
  id: string
  capsule_id: string
  user_id: string | null
  composition_id: string | null
  created_at: string
}

export interface CapsuleVersion {
  id: string
  capsule_id: string
  version: string
  platforms: UniversalCapsule['platforms']
  inputs: UniversalCapsule['inputs']
  outputs: UniversalCapsule['outputs']
  dependencies: UniversalCapsule['dependencies']
  changelog: string | null
  created_at: string
}

export interface CreateCapsuleInput {
  capsule_id: string
  name: string
  version?: string
  author: string
  category: string
  type: string
  tags?: string[]
  ai_description: string
  usage_examples?: string[]
  related_capsules?: string[]
  complexity?: 'simple' | 'intermediate' | 'advanced'
  platforms: UniversalCapsule['platforms']
  inputs?: UniversalCapsule['inputs']
  outputs?: UniversalCapsule['outputs']
  dependencies?: UniversalCapsule['dependencies']
  is_public?: boolean
  license?: string
}

export interface UpdateCapsuleInput {
  name?: string
  version?: string
  category?: string
  type?: string
  tags?: string[]
  ai_description?: string
  usage_examples?: string[]
  related_capsules?: string[]
  complexity?: 'simple' | 'intermediate' | 'advanced'
  platforms?: UniversalCapsule['platforms']
  inputs?: UniversalCapsule['inputs']
  outputs?: UniversalCapsule['outputs']
  dependencies?: UniversalCapsule['dependencies']
  is_public?: boolean
  license?: string
  status?: 'draft' | 'pending_review'
}

export interface CapsuleFilters {
  category?: string
  type?: string
  complexity?: 'simple' | 'intermediate' | 'advanced'
  tags?: string[]
  search?: string
  author?: string
  featured?: boolean
  sortBy?: 'recent' | 'popular' | 'downloads' | 'rating'
}

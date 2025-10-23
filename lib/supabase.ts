import { createClient } from '@supabase/supabase-js'

export type Prototype = {
  id: string
  creator_id: string
  title: string
  description: string | null
  price: number
  category: string
  tech_stack: string[]
  preview_image_url: string | null
  file_url: string | null
  downloads_count: number
  rating: number
  created_at: string
  updated_at: string
  published: boolean
}

export type Purchase = {
  id: string
  buyer_id: string
  prototype_id: string
  stripe_checkout_id: string | null
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  prototype_id: string
  reviewer_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function getPrototypes(limit = 20, offset = 0): Promise<Prototype[]> {
  const { data, error } = await supabase
    .from('prototypes')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return []
  return data || []
}

export async function getPrototypeById(id: string): Promise<Prototype | null> {
  const { data, error } = await supabase
    .from('prototypes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getUserPrototypes(userId: string): Promise<Prototype[]> {
  const { data, error } = await supabase
    .from('prototypes')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function createPrototype(prototype: Omit<Prototype, 'id' | 'created_at' | 'updated_at' | 'downloads_count' | 'rating'>) {
  const { data, error } = await supabase
    .from('prototypes')
    .insert([prototype])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePrototype(id: string, updates: Partial<Prototype>) {
  const { data, error } = await supabase
    .from('prototypes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPurchasesByUser(userId: string): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('buyer_id', userId)

  if (error) return []
  return data || []
}

export async function createPurchase(purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchase])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePurchase(id: string, updates: Partial<Purchase>) {
  const { data, error } = await supabase
    .from('purchases')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uploadFile(
  bucket: 'prototypes' | 'previews',
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error
  return data
}

export async function getPublicFileUrl(bucket: 'prototypes' | 'previews', path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

export async function checkUserPurchase(userId: string, prototypeId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('buyer_id', userId)
    .eq('prototype_id', prototypeId)
    .eq('status', 'completed')
    .single()

  return !error && !!data
}

// ============================================
// BLOCKS SYSTEM - Helper Functions
// ============================================

export type Block = {
  id: string
  creator_id: string
  title: string
  description: string | null
  category: 'ui' | 'functional' | 'integration' | 'ai' | 'theme'
  tags: string[]
  price: number
  is_free: boolean
  block_key: string
  version: string
  component_url: string | null
  schema_url: string
  server_url: string | null
  docs_url: string | null
  preview_image_url: string | null
  demo_url: string | null
  dependencies: any
  tech_stack: string[]
  downloads_count: number
  installs_count: number
  rating: number
  published: boolean
  approved: boolean
  created_at: string
  updated_at: string
}

export type BlockPurchase = {
  id: string
  buyer_id: string
  block_id: string
  stripe_checkout_id: string | null
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
  updated_at: string
}

export type Page = {
  id: string
  creator_id: string
  title: string
  slug: string
  description: string | null
  blocks: any // JSON array of BlockInstance
  layout: string
  theme: string
  published: boolean
  created_at: string
  updated_at: string
}

// Get blocks from marketplace
export async function getBlocks(filters?: {
  category?: string
  isFree?: boolean
  search?: string
  limit?: number
  offset?: number
}): Promise<Block[]> {
  let query = supabase
    .from('blocks')
    .select('*')
    .eq('published', true)
    .eq('approved', true)

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.isFree !== undefined) {
    query = query.eq('is_free', filters.isFree)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  query = query
    .order('rating', { ascending: false })
    .order('created_at', { ascending: false })
    .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 20) - 1)

  const { data, error } = await query

  if (error) return []
  return data || []
}

// Get block by ID
export async function getBlockById(id: string): Promise<Block | null> {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// Get block by key
export async function getBlockByKey(key: string): Promise<Block | null> {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('block_key', key)
    .eq('published', true)
    .eq('approved', true)
    .single()

  if (error) return null
  return data
}

// Check if user has access to block (purchased or free)
export async function checkBlockAccess(userId: string, blockId: string): Promise<boolean> {
  // First check if block is free
  const block = await getBlockById(blockId)
  if (block?.is_free) return true

  // Check if user purchased it
  const { data, error } = await supabase
    .from('block_purchases')
    .select('id')
    .eq('buyer_id', userId)
    .eq('block_id', blockId)
    .eq('status', 'completed')
    .single()

  return !error && !!data
}

// Create a new block
export async function createBlock(block: Omit<Block, 'id' | 'created_at' | 'updated_at' | 'downloads_count' | 'installs_count' | 'rating' | 'is_free' | 'approved'>) {
  const { data, error } = await supabase
    .from('blocks')
    .insert([{ ...block, published: false, approved: false }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update a block
export async function updateBlock(id: string, updates: Partial<Block>) {
  const { data, error } = await supabase
    .from('blocks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get user's blocks
export async function getUserBlocks(userId: string): Promise<Block[]> {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

// Upload block files (component, schema, etc.)
export async function uploadBlockFile(
  blockKey: string,
  fileName: string,
  file: File
) {
  const path = `${blockKey}/${fileName}`
  return uploadFile('blocks' as any, path, file)
}

// Get public URL for block file
export async function getBlockFileUrl(blockKey: string, fileName: string) {
  const path = `${blockKey}/${fileName}`
  return getPublicFileUrl('blocks' as any, path)
}

// Create block purchase
export async function createBlockPurchase(purchase: Omit<BlockPurchase, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('block_purchases')
    .insert([purchase])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update block purchase
export async function updateBlockPurchase(id: string, updates: Partial<BlockPurchase>) {
  const { data, error } = await supabase
    .from('block_purchases')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get user's block purchases
export async function getUserBlockPurchases(userId: string): Promise<BlockPurchase[]> {
  const { data, error } = await supabase
    .from('block_purchases')
    .select('*')
    .eq('buyer_id', userId)

  if (error) return []
  return data || []
}

// Increment block downloads
export async function incrementBlockDownloads(blockId: string) {
  const { error } = await supabase.rpc('increment_block_downloads', {
    p_block_id: blockId
  })

  if (error) console.error('Error incrementing downloads:', error)
}

// Increment block installs
export async function incrementBlockInstalls(blockId: string) {
  const { error } = await supabase.rpc('increment_block_installs', {
    p_block_id: blockId
  })

  if (error) console.error('Error incrementing installs:', error)
}

// ============================================
// PAGES SYSTEM - Helper Functions
// ============================================

// Get user's pages
export async function getUserPages(userId: string): Promise<Page[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

// Get page by ID
export async function getPageById(id: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// Get page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) return null
  return data
}

// Create a new page
export async function createPage(page: Omit<Page, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('pages')
    .insert([page])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update a page
export async function updatePage(id: string, updates: Partial<Page>) {
  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

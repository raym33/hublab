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

// ============================================
// WORKFLOW BUILDER CAPSULE - Types & Functions
// ============================================

export type WorkflowNode = {
  id: string
  type: 'capsule'
  capsuleId: string
  label: string
  x: number
  y: number
  inputs: Record<string, unknown>
  config?: Record<string, unknown>
}

export type WorkflowConnection = {
  id: string
  from: string
  to: string
  fromPort: string
  toPort: string
}

export type WorkflowTriggerType = 'manual' | 'schedule' | 'webhook' | 'event'

export type Workflow = {
  id: string
  user_id: string
  name: string
  description: string | null
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  platform: string
  version: number
  is_active: boolean
  is_public: boolean
  is_template: boolean
  category: string | null
  tags: string[]
  trigger_type: WorkflowTriggerType
  trigger_config: Record<string, unknown>
  timeout_ms: number
  retry_count: number
  retry_delay_ms: number
  execution_count: number
  last_executed_at: string | null
  success_count: number
  failure_count: number
  created_at: string
  updated_at: string
}

export type WorkflowExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout'

export type WorkflowExecution = {
  id: string
  workflow_id: string
  user_id: string
  status: WorkflowExecutionStatus
  input_data: Record<string, unknown>
  output_data: Record<string, unknown> | null
  started_at: string | null
  completed_at: string | null
  duration_ms: number | null
  error_message: string | null
  error_node_id: string | null
  error_stack: string | null
  current_node_id: string | null
  nodes_completed: number
  nodes_total: number
  triggered_by: string
  trigger_metadata: Record<string, unknown>
  workflow_snapshot: Workflow | null
  created_at: string
}

export type WorkflowLogLevel = 'debug' | 'info' | 'warn' | 'error'
export type WorkflowLogStatus = 'started' | 'completed' | 'failed' | 'skipped'

export type WorkflowExecutionLog = {
  id: string
  execution_id: string
  node_id: string
  node_type: string | null
  node_label: string | null
  capsule_id: string | null
  level: WorkflowLogLevel
  message: string
  data: Record<string, unknown> | null
  status: WorkflowLogStatus | null
  input_data: Record<string, unknown> | null
  output_data: Record<string, unknown> | null
  started_at: string | null
  completed_at: string | null
  duration_ms: number | null
  error_message: string | null
  error_stack: string | null
  sequence_number: number
  created_at: string
}

export type WorkflowWebhook = {
  id: string
  workflow_id: string
  user_id: string
  webhook_key: string
  method: 'GET' | 'POST' | 'PUT'
  secret_token: string | null
  allowed_ips: string[] | null
  is_active: boolean
  call_count: number
  last_called_at: string | null
  created_at: string
  updated_at: string
}

// ============================================
// WORKFLOW CRUD FUNCTIONS
// ============================================

// Get user's workflows
export async function getUserWorkflows(userId: string): Promise<Workflow[]> {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) return []
  return data || []
}

// Get workflow by ID
export async function getWorkflowById(id: string): Promise<Workflow | null> {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// Get public workflows (templates)
export async function getPublicWorkflows(filters?: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<Workflow[]> {
  let query = supabase
    .from('workflows')
    .select('*')
    .eq('is_public', true)
    .eq('is_active', true)

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  query = query
    .order('execution_count', { ascending: false })
    .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 20) - 1)

  const { data, error } = await query

  if (error) return []
  return data || []
}

// Create a new workflow
export async function createWorkflow(workflow: {
  user_id: string
  name: string
  description?: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  platform?: string
  category?: string
  tags?: string[]
  trigger_type?: WorkflowTriggerType
  trigger_config?: Record<string, unknown>
}): Promise<Workflow> {
  const { data, error } = await supabase
    .from('workflows')
    .insert([workflow])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update a workflow
export async function updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
  const { data, error } = await supabase
    .from('workflows')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete a workflow
export async function deleteWorkflow(id: string): Promise<void> {
  const { error } = await supabase
    .from('workflows')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// WORKFLOW EXECUTION FUNCTIONS
// ============================================

// Get executions for a workflow
export async function getWorkflowExecutions(workflowId: string, limit = 50): Promise<WorkflowExecution[]> {
  const { data, error } = await supabase
    .from('workflow_executions')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data || []
}

// Get execution by ID
export async function getExecutionById(id: string): Promise<WorkflowExecution | null> {
  const { data, error } = await supabase
    .from('workflow_executions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// Create a new execution
export async function createExecution(execution: {
  workflow_id: string
  user_id: string
  input_data?: Record<string, unknown>
  nodes_total: number
  workflow_snapshot?: Workflow
  triggered_by?: string
  trigger_metadata?: Record<string, unknown>
}): Promise<WorkflowExecution> {
  const { data, error } = await supabase
    .from('workflow_executions')
    .insert([{
      ...execution,
      status: 'pending',
      nodes_completed: 0
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update execution status
export async function updateExecution(id: string, updates: Partial<WorkflowExecution>): Promise<WorkflowExecution> {
  const { data, error } = await supabase
    .from('workflow_executions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// WORKFLOW EXECUTION LOGS FUNCTIONS
// ============================================

// Get logs for an execution
export async function getExecutionLogs(executionId: string): Promise<WorkflowExecutionLog[]> {
  const { data, error } = await supabase
    .from('workflow_execution_logs')
    .select('*')
    .eq('execution_id', executionId)
    .order('sequence_number', { ascending: true })

  if (error) return []
  return data || []
}

// Create a log entry
export async function createExecutionLog(log: {
  execution_id: string
  node_id: string
  node_type?: string
  node_label?: string
  capsule_id?: string
  level: WorkflowLogLevel
  message: string
  data?: Record<string, unknown>
  status?: WorkflowLogStatus
  input_data?: Record<string, unknown>
  output_data?: Record<string, unknown>
  started_at?: string
  completed_at?: string
  duration_ms?: number
  error_message?: string
  error_stack?: string
  sequence_number: number
}): Promise<WorkflowExecutionLog> {
  const { data, error } = await supabase
    .from('workflow_execution_logs')
    .insert([log])
    .select()
    .single()

  if (error) throw error
  return data
}

// Batch create log entries
export async function createExecutionLogsBatch(logs: Array<{
  execution_id: string
  node_id: string
  node_type?: string
  node_label?: string
  capsule_id?: string
  level: WorkflowLogLevel
  message: string
  data?: Record<string, unknown>
  status?: WorkflowLogStatus
  sequence_number: number
}>): Promise<WorkflowExecutionLog[]> {
  const { data, error } = await supabase
    .from('workflow_execution_logs')
    .insert(logs)
    .select()

  if (error) throw error
  return data || []
}

// ============================================
// WORKFLOW WEBHOOKS FUNCTIONS
// ============================================

// Get webhooks for a workflow
export async function getWorkflowWebhooks(workflowId: string): Promise<WorkflowWebhook[]> {
  const { data, error } = await supabase
    .from('workflow_webhooks')
    .select('*')
    .eq('workflow_id', workflowId)

  if (error) return []
  return data || []
}

// Get webhook by key (for triggering)
export async function getWebhookByKey(key: string): Promise<WorkflowWebhook | null> {
  const { data, error } = await supabase
    .from('workflow_webhooks')
    .select('*')
    .eq('webhook_key', key)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data
}

// Create a webhook
export async function createWorkflowWebhook(webhook: {
  workflow_id: string
  user_id: string
  webhook_key: string
  method?: 'GET' | 'POST' | 'PUT'
  secret_token?: string
  allowed_ips?: string[]
}): Promise<WorkflowWebhook> {
  const { data, error } = await supabase
    .from('workflow_webhooks')
    .insert([webhook])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update webhook
export async function updateWorkflowWebhook(id: string, updates: Partial<WorkflowWebhook>): Promise<WorkflowWebhook> {
  const { data, error } = await supabase
    .from('workflow_webhooks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete webhook
export async function deleteWorkflowWebhook(id: string): Promise<void> {
  const { error } = await supabase
    .from('workflow_webhooks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Increment webhook call count
export async function incrementWebhookCallCount(id: string): Promise<void> {
  const { error } = await supabase
    .from('workflow_webhooks')
    .update({
      call_count: supabase.rpc('increment', { x: 1 }) as unknown as number,
      last_called_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) console.error('Error incrementing webhook count:', error)
}

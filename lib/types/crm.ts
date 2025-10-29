/**
 * HubLab Ambient Agent CRM - TypeScript Types
 * Version: 1.0.0
 *
 * Type definitions for CRM entities, events, and actions
 */

// ============================================================================
// CRM Connection Types
// ============================================================================

export type CRMType = 'hubspot' | 'salesforce' | 'pipedrive' | 'zoho'

export interface CRMConnection {
  id: string
  user_id: string
  crm_type: CRMType
  oauth_token: string  // Encrypted in storage
  refresh_token?: string
  instance_url?: string  // For Salesforce
  field_mappings: Record<string, string>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateCRMConnectionInput {
  user_id: string
  crm_type: CRMType
  oauth_token: string
  refresh_token?: string
  instance_url?: string
  field_mappings?: Record<string, string>
}

// ============================================================================
// Event Types
// ============================================================================

export type EventType = 'email' | 'meeting' | 'slack' | 'call'
export type EventSource = 'gmail' | 'google_calendar' | 'outlook' | 'slack' | 'zoom' | 'teams'

export interface Event {
  id: string
  user_id: string
  event_id: string  // External ID for idempotency
  event_type: EventType
  source: EventSource
  raw_data: any
  normalized_data?: NormalizedEvent
  fingerprint: string
  processed: boolean
  created_at: string
}

export interface CreateEventInput {
  user_id: string
  event_id: string
  event_type: EventType
  source: EventSource
  raw_data: any
  normalized_data?: NormalizedEvent
  fingerprint: string
  processed?: boolean
}

// Normalized Event Structure
export interface NormalizedEvent {
  event_id: string
  type: EventType
  timestamp: string
  contacts: Contact[]
  companies: Company[]
  deals?: Deal[]
  tasks?: Task[]
  metadata?: Record<string, any>
}

export interface Contact {
  email: string
  name?: string
  phone?: string
  title?: string
}

export interface Company {
  domain: string
  name?: string
  size?: string
  industry?: string
}

export interface Deal {
  amount?: number
  stage?: string
  close_date?: string
  name?: string
  probability?: number
}

export interface Task {
  title: string
  due_date?: string
  priority?: 'low' | 'medium' | 'high'
  description?: string
}

// ============================================================================
// CRM Action Types
// ============================================================================

export type ActionType =
  | 'upsert_contact'
  | 'upsert_company'
  | 'create_deal'
  | 'update_deal_stage'
  | 'log_activity'
  | 'create_task'

export type ResourceType = 'contact' | 'company' | 'deal' | 'activity' | 'task'

export type ActionStatus = 'pending' | 'approved' | 'executed' | 'failed'

export interface CRMAction {
  id: string
  user_id: string
  event_id?: string
  crm_connection_id: string
  action_type: ActionType
  resource_type: ResourceType
  resource_id?: string  // ID in external CRM
  payload: any
  status: ActionStatus
  confidence: number  // 0-1
  justification: string
  requires_approval: boolean
  approved_by?: string
  approved_at?: string
  executed_at?: string
  error_message?: string
  created_at: string
}

export interface CreateCRMActionInput {
  user_id: string
  event_id?: string
  crm_connection_id: string
  action_type: ActionType
  resource_type: ResourceType
  resource_id?: string
  payload: any
  confidence: number
  justification: string
  requires_approval?: boolean
}

export interface UpdateActionStatusInput {
  status: 'approved' | 'executed' | 'failed'
  approved_by?: string
  error_message?: string
}

// ============================================================================
// Audit Log Types
// ============================================================================

export interface AuditLog {
  id: string
  user_id: string
  action_id?: string
  event_id?: string
  crm_type: CRMType
  resource_type: ResourceType
  resource_id: string
  changes: {
    before: any
    after: any
  }
  justification?: string
  created_at: string
}

export interface CreateAuditLogInput {
  user_id: string
  action_id?: string
  event_id?: string
  crm_type: CRMType
  resource_type: ResourceType
  resource_id: string
  changes: {
    before: any
    after: any
  }
  justification?: string
}

// ============================================================================
// Capsule Config Types
// ============================================================================

export type CapsuleName =
  | 'watcher-gmail'
  | 'watcher-calendar'
  | 'watcher-slack'
  | 'normalizer'
  | 'intent-classifier'
  | 'reason-llm'
  | 'policy-guardrails'
  | 'mcp-orchestrator'
  | 'crm-hubspot'
  | 'crm-salesforce'
  | 'crm-pipedrive'
  | 'crm-zoho'
  | 'audit-trail'

export interface CapsuleConfig {
  id: string
  user_id: string
  capsule_name: CapsuleName
  is_active: boolean
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateCapsuleConfigInput {
  user_id: string
  capsule_name: CapsuleName
  is_active?: boolean
  config: Record<string, any>
}

// ============================================================================
// Watcher-specific Types
// ============================================================================

// Gmail Watcher
export interface GmailWatcherConfig {
  gmail_oauth_token: string
  labels_to_watch: string[]  // e.g., ["sales", "leads"]
  poll_interval: number  // seconds
}

export interface EmailEvent {
  event_id: string
  thread_id: string
  from: { email: string; name?: string }
  to: Array<{ email: string; name?: string }>
  subject: string
  body: string
  attachments: Array<{ filename: string; url: string }>
  labels: string[]
  timestamp: string
}

// Calendar Watcher
export interface CalendarWatcherConfig {
  calendar_oauth_token: string
  calendars_to_watch: string[]
}

export interface MeetingEvent {
  event_id: string
  meeting_id: string
  title: string
  attendees: Array<{ email: string; name?: string }>
  start_time: string
  end_time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  transcript_url?: string
}

// ============================================================================
// Intent Classification Types
// ============================================================================

export type Intent =
  | 'create_lead'
  | 'update_deal'
  | 'log_activity'
  | 'schedule_task'
  | 'no_action'

export interface IntentClassification {
  intent: Intent
  confidence: number
  extracted_data: {
    contact?: Contact
    company?: Company
    deal?: Deal
    next_action?: Task
  }
}

// ============================================================================
// Risk Assessment Types
// ============================================================================

export type RiskLevel = 'low' | 'medium' | 'high'

export interface RiskAssessment {
  level: RiskLevel
  reasons: string[]
  requires_approval: boolean
}

// ============================================================================
// Dashboard Stats Types
// ============================================================================

export interface DashboardStats {
  events_processed_today: number
  crm_updates_today: number
  pending_approvals: number
  pipeline_value: number
  auto_approval_rate: number
  error_rate: number
}

export interface RecentActivity {
  events: Event[]
  actions: CRMAction[]
}

// ============================================================================
// API Response Types
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// ============================================================================
// HubSpot-specific Types
// ============================================================================

export interface HubSpotContact {
  id?: string
  properties: {
    email: string
    firstname?: string
    lastname?: string
    phone?: string
    company?: string
    [key: string]: any
  }
}

export interface HubSpotDeal {
  id?: string
  properties: {
    dealname: string
    amount?: number
    dealstage?: string
    closedate?: string
    pipeline?: string
    [key: string]: any
  }
}

export interface HubSpotCompany {
  id?: string
  properties: {
    name: string
    domain?: string
    industry?: string
    [key: string]: any
  }
}

// ============================================================================
// Salesforce-specific Types
// ============================================================================

export interface SalesforceContact {
  Id?: string
  Email: string
  FirstName?: string
  LastName?: string
  Phone?: string
  Title?: string
  AccountId?: string
  [key: string]: any
}

export interface SalesforceOpportunity {
  Id?: string
  Name: string
  Amount?: number
  StageName?: string
  CloseDate?: string
  Probability?: number
  AccountId?: string
  [key: string]: any
}

export interface SalesforceAccount {
  Id?: string
  Name: string
  Website?: string
  Industry?: string
  [key: string]: any
}

// ============================================================================
// Utility Types
// ============================================================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

// Database row type (adds Database metadata)
export type DatabaseRow<T> = T & {
  created_at: string
  updated_at?: string
}

// Omit system fields for inserts
export type InsertInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>

// Partial update type
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'user_id' | 'created_at'>>

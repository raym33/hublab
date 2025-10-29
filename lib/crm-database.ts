/**
 * HubLab Ambient Agent CRM - Database Helpers
 * Version: 1.0.0
 *
 * Supabase CRUD operations for CRM entities
 */

import { supabase } from './supabase'
import {
  CRMConnection,
  CreateCRMConnectionInput,
  Event,
  CreateEventInput,
  CRMAction,
  CreateCRMActionInput,
  UpdateActionStatusInput,
  AuditLog,
  CreateAuditLogInput,
  CapsuleConfig,
  CreateCapsuleConfigInput,
  CRMType,
  CapsuleName,
} from './types/crm'

// ============================================================================
// CRM Connections
// ============================================================================

/**
 * Create a new CRM connection
 */
export async function createCRMConnection(
  input: CreateCRMConnectionInput
): Promise<CRMConnection> {
  const { data, error } = await supabase
    .from('crm_connections')
    .insert([input])
    .select()
    .single()

  if (error) throw new Error(`Failed to create CRM connection: ${error.message}`)
  return data
}

/**
 * Get all active CRM connections for a user
 */
export async function getCRMConnections(userId: string): Promise<CRMConnection[]> {
  const { data, error } = await supabase
    .from('crm_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch CRM connections: ${error.message}`)
  return data || []
}

/**
 * Get a specific CRM connection by type
 */
export async function getCRMConnectionByType(
  userId: string,
  crmType: CRMType
): Promise<CRMConnection | null> {
  const { data, error } = await supabase
    .from('crm_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('crm_type', crmType)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows found
    throw new Error(`Failed to fetch CRM connection: ${error.message}`)
  }
  return data
}

/**
 * Update CRM connection tokens (for OAuth refresh)
 */
export async function updateCRMConnectionTokens(
  connectionId: string,
  oauthToken: string,
  refreshToken?: string
): Promise<CRMConnection> {
  const { data, error } = await supabase
    .from('crm_connections')
    .update({
      oauth_token: oauthToken,
      ...(refreshToken && { refresh_token: refreshToken }),
    })
    .eq('id', connectionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update CRM tokens: ${error.message}`)
  return data
}

/**
 * Deactivate a CRM connection
 */
export async function deactivateCRMConnection(connectionId: string): Promise<void> {
  const { error } = await supabase
    .from('crm_connections')
    .update({ is_active: false })
    .eq('id', connectionId)

  if (error) throw new Error(`Failed to deactivate CRM connection: ${error.message}`)
}

/**
 * Delete a CRM connection permanently
 */
export async function deleteCRMConnection(connectionId: string): Promise<void> {
  const { error } = await supabase
    .from('crm_connections')
    .delete()
    .eq('id', connectionId)

  if (error) throw new Error(`Failed to delete CRM connection: ${error.message}`)
}

// ============================================================================
// Events
// ============================================================================

/**
 * Create a new event (with deduplication via fingerprint)
 */
export async function createEvent(input: CreateEventInput): Promise<Event | null> {
  // Check if event already exists by event_id
  const { data: existing } = await supabase
    .from('events')
    .select('id')
    .eq('event_id', input.event_id)
    .single()

  if (existing) {
    console.log(`Event ${input.event_id} already exists, skipping`)
    return null
  }

  // Check for duplicate fingerprint (secondary dedupe)
  const { data: fingerprintMatch } = await supabase
    .from('events')
    .select('id')
    .eq('fingerprint', input.fingerprint)
    .single()

  if (fingerprintMatch) {
    console.log(`Event with fingerprint ${input.fingerprint} already exists, skipping`)
    return null
  }

  // Insert new event
  const { data, error } = await supabase
    .from('events')
    .insert([input])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // Unique constraint violation
      console.log('Duplicate event detected, skipping')
      return null
    }
    throw new Error(`Failed to create event: ${error.message}`)
  }

  return data
}

/**
 * Get pending (unprocessed) events for a user
 */
export async function getPendingEvents(
  userId: string,
  limit: number = 50
): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .eq('processed', false)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch pending events: ${error.message}`)
  return data || []
}

/**
 * Get recent events (processed or not)
 */
export async function getRecentEvents(
  userId: string,
  limit: number = 20
): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch recent events: ${error.message}`)
  return data || []
}

/**
 * Mark an event as processed
 */
export async function markEventAsProcessed(eventId: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .update({ processed: true })
    .eq('id', eventId)

  if (error) throw new Error(`Failed to mark event as processed: ${error.message}`)
}

/**
 * Update event with normalized data
 */
export async function updateEventNormalizedData(
  eventId: string,
  normalizedData: any
): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update({ normalized_data: normalizedData })
    .eq('id', eventId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update event normalized data: ${error.message}`)
  return data
}

// ============================================================================
// CRM Actions
// ============================================================================

/**
 * Create a new CRM action
 */
export async function createCRMAction(input: CreateCRMActionInput): Promise<CRMAction> {
  const { data, error } = await supabase
    .from('crm_actions')
    .insert([{
      ...input,
      status: 'pending',
    }])
    .select()
    .single()

  if (error) throw new Error(`Failed to create CRM action: ${error.message}`)
  return data
}

/**
 * Get pending actions (pending or approved but not executed)
 */
export async function getPendingActions(userId: string): Promise<CRMAction[]> {
  const { data, error } = await supabase
    .from('crm_actions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['pending', 'approved'])
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch pending actions: ${error.message}`)
  return data || []
}

/**
 * Get actions requiring approval
 */
export async function getActionsRequiringApproval(userId: string): Promise<CRMAction[]> {
  const { data, error } = await supabase
    .from('crm_actions')
    .select('*')
    .eq('user_id', userId)
    .eq('requires_approval', true)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch actions requiring approval: ${error.message}`)
  return data || []
}

/**
 * Get recent actions (all statuses)
 */
export async function getRecentActions(
  userId: string,
  limit: number = 20
): Promise<CRMAction[]> {
  const { data, error } = await supabase
    .from('crm_actions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch recent actions: ${error.message}`)
  return data || []
}

/**
 * Update action status
 */
export async function updateActionStatus(
  actionId: string,
  statusUpdate: UpdateActionStatusInput
): Promise<CRMAction> {
  const updates: any = { status: statusUpdate.status }

  if (statusUpdate.status === 'approved') {
    updates.approved_by = statusUpdate.approved_by
    updates.approved_at = new Date().toISOString()
  }

  if (statusUpdate.status === 'executed') {
    updates.executed_at = new Date().toISOString()
  }

  if (statusUpdate.error_message) {
    updates.error_message = statusUpdate.error_message
  }

  const { data, error } = await supabase
    .from('crm_actions')
    .update(updates)
    .eq('id', actionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update action status: ${error.message}`)
  return data
}

/**
 * Get action by ID
 */
export async function getActionById(actionId: string): Promise<CRMAction | null> {
  const { data, error } = await supabase
    .from('crm_actions')
    .select('*')
    .eq('id', actionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to fetch action: ${error.message}`)
  }
  return data
}

// ============================================================================
// Audit Logs
// ============================================================================

/**
 * Create an audit log entry
 */
export async function createAuditLog(input: CreateAuditLogInput): Promise<AuditLog> {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([input])
    .select()
    .single()

  if (error) throw new Error(`Failed to create audit log: ${error.message}`)
  return data
}

/**
 * Get audit logs for a user
 */
export async function getAuditLogs(
  userId: string,
  limit: number = 100
): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch audit logs: ${error.message}`)
  return data || []
}

/**
 * Get audit logs for a specific action
 */
export async function getAuditLogsByAction(actionId: string): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('action_id', actionId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch audit logs by action: ${error.message}`)
  return data || []
}

/**
 * Get audit logs for a specific resource
 */
export async function getAuditLogsByResource(
  userId: string,
  resourceType: string,
  resourceId: string
): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch audit logs by resource: ${error.message}`)
  return data || []
}

// ============================================================================
// Capsule Configs
// ============================================================================

/**
 * Create or update capsule config (upsert)
 */
export async function upsertCapsuleConfig(
  input: CreateCapsuleConfigInput
): Promise<CapsuleConfig> {
  const { data, error } = await supabase
    .from('capsule_configs')
    .upsert([input], { onConflict: 'user_id,capsule_name' })
    .select()
    .single()

  if (error) throw new Error(`Failed to upsert capsule config: ${error.message}`)
  return data
}

/**
 * Get capsule config by name
 */
export async function getCapsuleConfig(
  userId: string,
  capsuleName: CapsuleName
): Promise<CapsuleConfig | null> {
  const { data, error } = await supabase
    .from('capsule_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('capsule_name', capsuleName)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to fetch capsule config: ${error.message}`)
  }
  return data
}

/**
 * Get all active capsule configs for a user
 */
export async function getActiveCapsuleConfigs(userId: string): Promise<CapsuleConfig[]> {
  const { data, error } = await supabase
    .from('capsule_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('capsule_name')

  if (error) throw new Error(`Failed to fetch active capsule configs: ${error.message}`)
  return data || []
}

/**
 * Toggle capsule active status
 */
export async function toggleCapsuleActive(
  userId: string,
  capsuleName: CapsuleName,
  isActive: boolean
): Promise<CapsuleConfig> {
  const { data, error } = await supabase
    .from('capsule_configs')
    .update({ is_active: isActive })
    .eq('user_id', userId)
    .eq('capsule_name', capsuleName)
    .select()
    .single()

  if (error) throw new Error(`Failed to toggle capsule status: ${error.message}`)
  return data
}

// ============================================================================
// Dashboard Stats
// ============================================================================

/**
 * Get dashboard statistics for a user
 */
export async function getDashboardStats(userId: string) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  // Events processed today
  const { count: eventsToday } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', todayStart)

  // CRM updates today
  const { count: updatesToday } = await supabase
    .from('crm_actions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'executed')
    .gte('created_at', todayStart)

  // Pending approvals
  const { count: pendingApprovals } = await supabase
    .from('crm_actions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('requires_approval', true)
    .eq('status', 'pending')

  // Auto-approval rate (actions that didn't require approval / total)
  const { count: totalActions } = await supabase
    .from('crm_actions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', todayStart)

  const { count: autoApproved } = await supabase
    .from('crm_actions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('requires_approval', false)
    .gte('created_at', todayStart)

  const autoApprovalRate = totalActions && totalActions > 0
    ? Math.round((autoApproved || 0) / totalActions * 100)
    : 0

  return {
    events_processed_today: eventsToday || 0,
    crm_updates_today: updatesToday || 0,
    pending_approvals: pendingApprovals || 0,
    auto_approval_rate: autoApprovalRate,
  }
}

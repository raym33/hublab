import { useState, useEffect, useCallback } from 'react'

export interface ProposedChange {
  field: string
  current: string | null
  proposed: string
}

export interface PendingApproval {
  id: string
  type: 'upsert_contact' | 'update_deal' | 'create_deal' | 'log_activity' | 'create_task'
  resource: string
  event: {
    type: 'email' | 'meeting' | 'slack'
    title: string
    timestamp: string
  }
  proposed_changes: ProposedChange[]
  confidence: number
  justification: string
  risk_level: 'low' | 'medium' | 'high'
  timestamp: string
}

export function usePendingApprovals() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/crm/approvals?requires_approval=true')

      if (!response.ok) {
        throw new Error(`Failed to fetch approvals: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch approvals')
      }

      // Transform backend actions to frontend PendingApproval format
      const transformedApprovals: PendingApproval[] = data.data.actions.map((action: any) => ({
        id: action.id,
        type: action.action_type,
        resource: action.resource_name || action.resource_id,
        event: {
          type: action.event_type || 'email',
          title: action.event_summary || 'Event detected',
          timestamp: action.created_at,
        },
        proposed_changes: action.proposed_data ?
          Object.entries(action.proposed_data).map(([field, value]) => ({
            field: field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' '),
            current: null,
            proposed: String(value),
          })) : [],
        confidence: action.confidence,
        justification: action.justification || 'AI-detected action from event',
        risk_level: action.confidence >= 0.9 ? 'low' : action.confidence >= 0.7 ? 'medium' : 'high',
        timestamp: action.created_at,
      }))

      setApprovals(transformedApprovals)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch approvals'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApprovals()

    // Refresh every 15 seconds
    const interval = setInterval(fetchApprovals, 15000)
    return () => clearInterval(interval)
  }, [fetchApprovals])

  const approve = useCallback(async (id: string) => {
    try {
      const response = await fetch('/api/crm/approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_id: id,
          decision: 'approve',
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to approve action: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to approve action')
      }

      // Remove from list on success
      setApprovals(prev => prev.filter(a => a.id !== id))

      console.log('✅ Approved:', id)
    } catch (err) {
      console.error('Failed to approve:', err)
      throw err
    }
  }, [])

  const reject = useCallback(async (id: string, reason?: string) => {
    try {
      const response = await fetch('/api/crm/approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_id: id,
          decision: 'reject',
          reason,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to reject action: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to reject action')
      }

      // Remove from list on success
      setApprovals(prev => prev.filter(a => a.id !== id))

      console.log('❌ Rejected:', id, reason)
    } catch (err) {
      console.error('Failed to reject:', err)
      throw err
    }
  }, [])

  return {
    approvals,
    loading,
    error,
    approve,
    reject,
    refresh: fetchApprovals
  }
}

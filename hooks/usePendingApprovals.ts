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

      // TODO: BACKEND - Replace with real API call
      // const response = await fetch('/api/crm/approvals')
      // const data = await response.json()
      // setApprovals(data)

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 400))
      setApprovals([
        {
          id: '1',
          type: 'create_deal',
          resource: 'Beta Inc - Enterprise License',
          event: {
            type: 'email',
            title: 'Purchase order received from Beta Inc',
            timestamp: '15 minutes ago',
          },
          proposed_changes: [
            { field: 'Deal Name', current: null, proposed: 'Beta Inc - Enterprise License' },
            { field: 'Amount', current: null, proposed: '$85,000' },
            { field: 'Stage', current: null, proposed: 'Negotiation' },
            { field: 'Close Date', current: null, proposed: '2025-12-15' },
            { field: 'Company', current: null, proposed: 'Beta Inc' },
          ],
          confidence: 0.87,
          justification:
            'Email contains purchase order attachment with deal details. Amount extracted from PO document. Company exists in CRM.',
          risk_level: 'medium',
          timestamp: '15 minutes ago',
        },
        {
          id: '2',
          type: 'upsert_contact',
          resource: 'john.doe@newcompany.com',
          event: {
            type: 'email',
            title: 'New lead inquiry from contact form',
            timestamp: '2 hours ago',
          },
          proposed_changes: [
            { field: 'Email', current: null, proposed: 'john.doe@newcompany.com' },
            { field: 'First Name', current: null, proposed: 'John' },
            { field: 'Last Name', current: null, proposed: 'Doe' },
            { field: 'Company', current: null, proposed: 'New Company Inc' },
            { field: 'Phone', current: null, proposed: '+1 555-0123' },
          ],
          confidence: 0.92,
          justification:
            'Contact form submission with complete information. Email validated. Company domain matches provided name.',
          risk_level: 'low',
          timestamp: '2 hours ago',
        },
        {
          id: '3',
          type: 'update_deal',
          resource: 'Gamma Corp - Software Suite',
          event: {
            type: 'meeting',
            title: 'Pricing negotiation with Gamma Corp',
            timestamp: '4 hours ago',
          },
          proposed_changes: [
            { field: 'Stage', current: 'Proposal Sent', proposed: 'Negotiation' },
            { field: 'Amount', current: '$120,000', proposed: '$95,000' },
            { field: 'Notes', current: '', proposed: 'Customer requested 20% discount for multi-year contract' },
          ],
          confidence: 0.78,
          justification:
            'Meeting notes indicate price reduction discussion. Amount extracted from transcript. Stage change reflects negotiation phase.',
          risk_level: 'high',
          timestamp: '4 hours ago',
        },
      ])

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
      // TODO: BACKEND - Replace with real API call
      // await fetch(`/api/crm/approvals/${id}/approve`, { method: 'POST' })

      // Mock: remove from list
      setApprovals(prev => prev.filter(a => a.id !== id))

      // Show success notification (you can use a toast library)
      console.log('✅ Approved:', id)
    } catch (err) {
      console.error('Failed to approve:', err)
      throw err
    }
  }, [])

  const reject = useCallback(async (id: string, reason?: string) => {
    try {
      // TODO: BACKEND - Replace with real API call
      // await fetch(`/api/crm/approvals/${id}/reject`, {
      //   method: 'POST',
      //   body: JSON.stringify({ reason })
      // })

      // Mock: remove from list
      setApprovals(prev => prev.filter(a => a.id !== id))

      // Show success notification
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

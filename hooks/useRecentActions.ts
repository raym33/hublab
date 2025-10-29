import { useState, useEffect } from 'react'

export interface RecentAction {
  id: string
  type: string
  status: 'pending' | 'approved' | 'executed' | 'failed'
  resource: string
  timestamp: string
  confidence: number
}

export function useRecentActions(limit = 5) {
  const [actions, setActions] = useState<RecentAction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchActions() {
      try {
        setLoading(true)

        // TODO: BACKEND - Replace with real API call
        // const response = await fetch(`/api/crm/actions/recent?limit=${limit}`)
        // const data = await response.json()
        // setActions(data)

        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 300))
        setActions([
          {
            id: '1',
            type: 'update_deal_stage',
            status: 'executed',
            resource: 'ACME Corp - Deal',
            timestamp: '2 minutes ago',
            confidence: 0.98,
          },
          {
            id: '2',
            type: 'create_deal',
            status: 'executed',
            resource: 'Beta Inc - New Deal',
            timestamp: '15 minutes ago',
            confidence: 0.95,
          },
          {
            id: '3',
            type: 'create_task',
            status: 'executed',
            resource: 'Follow-up with Delta LLC',
            timestamp: '1 hour ago',
            confidence: 0.92,
          },
          {
            id: '4',
            type: 'upsert_contact',
            status: 'pending',
            resource: 'john.doe@example.com',
            timestamp: '2 hours ago',
            confidence: 0.87,
          },
        ])

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch actions'))
      } finally {
        setLoading(false)
      }
    }

    fetchActions()

    // Refresh every 10 seconds
    const interval = setInterval(fetchActions, 10000)
    return () => clearInterval(interval)
  }, [limit])

  return { actions, loading, error }
}

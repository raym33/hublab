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

        const response = await fetch(`/api/crm/actions/recent?limit=${limit}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch actions: ${response.statusText}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch actions')
        }

        setActions(result.data)
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

import { useState, useEffect } from 'react'

export interface CRMStats {
  events_today: number
  crm_updates: number
  pending_approvals: number
  pipeline_value: number
}

export function useCRMStats() {
  const [stats, setStats] = useState<CRMStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)

        // TODO: BACKEND - Replace with real API call
        // const response = await fetch('/api/crm/stats')
        // const data = await response.json()
        // setStats(data)

        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        setStats({
          events_today: 1247,
          crm_updates: 89,
          pending_approvals: 3,
          pipeline_value: 124000
        })

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'))
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error, refresh: () => {} }
}

import { useState, useEffect } from 'react'

export interface RecentEvent {
  id: string
  type: 'email' | 'meeting' | 'slack'
  source: string
  title: string
  timestamp: string
  processed: boolean
  confidence?: number
}

export function useRecentEvents(limit = 5) {
  const [events, setEvents] = useState<RecentEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)

        const response = await fetch(`/api/crm/events/recent?limit=${limit}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch events')
        }

        setEvents(result.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch events'))
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()

    // Refresh every 10 seconds
    const interval = setInterval(fetchEvents, 10000)
    return () => clearInterval(interval)
  }, [limit])

  return { events, loading, error }
}

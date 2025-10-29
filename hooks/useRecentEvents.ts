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

        // TODO: BACKEND - Replace with real API call
        // const response = await fetch(`/api/crm/events/recent?limit=${limit}`)
        // const data = await response.json()
        // setEvents(data)

        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 300))
        setEvents([
          {
            id: '1',
            type: 'meeting',
            source: 'Google Calendar',
            title: 'Demo with ACME Corp completed',
            timestamp: '2 minutes ago',
            processed: true,
            confidence: 0.98,
          },
          {
            id: '2',
            type: 'email',
            source: 'Gmail',
            title: 'Purchase order received from Beta Inc',
            timestamp: '15 minutes ago',
            processed: true,
            confidence: 0.95,
          },
          {
            id: '3',
            type: 'meeting',
            source: 'Zoom',
            title: 'Follow-up call scheduled with Delta LLC',
            timestamp: '1 hour ago',
            processed: true,
            confidence: 0.92,
          },
          {
            id: '4',
            type: 'email',
            source: 'Gmail',
            title: 'New lead inquiry from contact form',
            timestamp: '2 hours ago',
            processed: false,
            confidence: 0.87,
          },
          {
            id: '5',
            type: 'slack',
            source: 'Slack',
            title: 'Sales team mentioned new opportunity',
            timestamp: '3 hours ago',
            processed: true,
            confidence: 0.89,
          },
        ])

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

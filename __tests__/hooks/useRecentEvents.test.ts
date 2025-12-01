/**
 * Unit tests for useRecentEvents hook
 * Tests fetching recent CRM events, limit parameter, and auto-refresh
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { useRecentEvents } from '@/hooks/useRecentEvents'

describe('useRecentEvents', () => {
  const mockEventsData = [
    {
      id: 'event-1',
      type: 'email' as const,
      source: 'Gmail',
      title: 'RE: Project Proposal',
      timestamp: '2024-01-15T10:00:00Z',
      processed: true,
      confidence: 0.92
    },
    {
      id: 'event-2',
      type: 'meeting' as const,
      source: 'Google Calendar',
      title: 'Client Call - Q1 Review',
      timestamp: '2024-01-15T09:30:00Z',
      processed: false,
      confidence: undefined
    },
    {
      id: 'event-3',
      type: 'slack' as const,
      source: 'Slack',
      title: 'Message from #sales',
      timestamp: '2024-01-15T09:00:00Z',
      processed: true,
      confidence: 0.85
    }
  ]

  beforeEach(() => {
    global.fetch = jest.fn()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return loading state initially', () => {
      (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))

      const { result } = renderHook(() => useRecentEvents())

      expect(result.current.loading).toBe(true)
      expect(result.current.events).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  describe('fetching events', () => {
    it('should fetch events with default limit of 5', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(fetch).toHaveBeenCalledWith('/api/crm/events/recent?limit=5')
      expect(result.current.events).toEqual(mockEventsData)
    })

    it('should respect custom limit parameter', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      renderHook(() => useRecentEvents(10))

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/crm/events/recent?limit=10')
      })
    })

    it('should work with limit of 1', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [mockEventsData[0]] })
      })

      const { result } = renderHook(() => useRecentEvents(1))

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(fetch).toHaveBeenCalledWith('/api/crm/events/recent?limit=1')
      expect(result.current.events).toHaveLength(1)
    })

    it('should return all event fields correctly', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      const event = result.current.events[0]
      expect(event.id).toBe('event-1')
      expect(event.type).toBe('email')
      expect(event.source).toBe('Gmail')
      expect(event.title).toBe('RE: Project Proposal')
      expect(event.processed).toBe(true)
      expect(event.confidence).toBe(0.92)
    })

    it('should handle events without confidence', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      const meetingEvent = result.current.events.find(e => e.type === 'meeting')
      expect(meetingEvent?.confidence).toBeUndefined()
    })
  })

  describe('event types', () => {
    it('should handle email events', async () => {
      const emailEvents = [{ ...mockEventsData[0], type: 'email' as const }]
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: emailEvents })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].type).toBe('email')
    })

    it('should handle meeting events', async () => {
      const meetingEvents = [{ ...mockEventsData[0], type: 'meeting' as const }]
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: meetingEvents })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].type).toBe('meeting')
    })

    it('should handle slack events', async () => {
      const slackEvents = [{ ...mockEventsData[0], type: 'slack' as const }]
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: slackEvents })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].type).toBe('slack')
    })
  })

  describe('limit parameter changes', () => {
    it('should refetch when limit changes', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      const { rerender } = renderHook(
        ({ limit }) => useRecentEvents(limit),
        { initialProps: { limit: 5 } }
      )

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
      expect(fetch).toHaveBeenCalledWith('/api/crm/events/recent?limit=5')

      rerender({ limit: 20 })

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
      expect(fetch).toHaveBeenLastCalledWith('/api/crm/events/recent?limit=20')
    })

    it('should not refetch when limit stays the same', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      const { rerender } = renderHook(
        ({ limit }) => useRecentEvents(limit),
        { initialProps: { limit: 5 } }
      )

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      rerender({ limit: 5 })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('should handle HTTP error response', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error'
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
      expect(result.current.error?.message).toContain('Failed to fetch events')
      expect(result.current.events).toEqual([])
    })

    it('should handle API error in response body', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'Service unavailable' })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Service unavailable')
    })

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Connection refused'))

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Connection refused')
    })

    it('should handle non-Error exceptions', async () => {
      (fetch as jest.Mock).mockRejectedValue('String error')

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Failed to fetch events')
    })

    it('should use default error message when API returns no error', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Failed to fetch events')
    })
  })

  describe('auto-refresh', () => {
    it('should refresh every 10 seconds', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      renderHook(() => useRecentEvents())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      act(() => {
        jest.advanceTimersByTime(10000)
      })

      expect(fetch).toHaveBeenCalledTimes(2)

      act(() => {
        jest.advanceTimersByTime(10000)
      })

      expect(fetch).toHaveBeenCalledTimes(3)
    })

    it('should not refresh before 10 seconds', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      renderHook(() => useRecentEvents())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      act(() => {
        jest.advanceTimersByTime(9999)
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should clear interval on unmount', async () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      const { unmount } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('should reset interval when limit changes', async () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      const { rerender } = renderHook(
        ({ limit }) => useRecentEvents(limit),
        { initialProps: { limit: 5 } }
      )

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      rerender({ limit: 10 })

      expect(clearIntervalSpy).toHaveBeenCalled()
    })
  })

  describe('loading state transitions', () => {
    it('should set loading true during fetch', async () => {
      let resolvePromise: (value: any) => void
      const fetchPromise = new Promise(resolve => {
        resolvePromise = resolve
      })

      ;(fetch as jest.Mock).mockReturnValue(fetchPromise)

      const { result } = renderHook(() => useRecentEvents())

      expect(result.current.loading).toBe(true)

      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockEventsData })
        })
      })

      await waitFor(() => expect(result.current.loading).toBe(false))
    })

    it('should clear error on successful fetch after error', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, statusText: 'Error' })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockEventsData })
        })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.error).toBeTruthy())

      // Trigger refresh
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      await waitFor(() => expect(result.current.error).toBeNull())
      expect(result.current.events).toEqual(mockEventsData)
    })
  })

  describe('processed status', () => {
    it('should correctly report processed events', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEventsData })
      })

      const { result } = renderHook(() => useRecentEvents())

      await waitFor(() => expect(result.current.loading).toBe(false))

      const processedEvents = result.current.events.filter(e => e.processed)
      const unprocessedEvents = result.current.events.filter(e => !e.processed)

      expect(processedEvents).toHaveLength(2)
      expect(unprocessedEvents).toHaveLength(1)
    })
  })
})

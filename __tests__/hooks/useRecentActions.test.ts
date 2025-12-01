/**
 * Unit tests for useRecentActions hook
 * Tests fetching recent CRM actions, limit parameter, and auto-refresh
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { useRecentActions } from '@/hooks/useRecentActions'

describe('useRecentActions', () => {
  const mockActionsData = [
    {
      id: 'action-1',
      type: 'update_deal',
      status: 'executed',
      resource: 'Enterprise Deal',
      timestamp: '2024-01-15T10:00:00Z',
      confidence: 0.95
    },
    {
      id: 'action-2',
      type: 'upsert_contact',
      status: 'pending',
      resource: 'John Doe',
      timestamp: '2024-01-15T09:30:00Z',
      confidence: 0.88
    },
    {
      id: 'action-3',
      type: 'log_activity',
      status: 'approved',
      resource: 'Meeting Notes',
      timestamp: '2024-01-15T09:00:00Z',
      confidence: 0.92
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

      const { result } = renderHook(() => useRecentActions())

      expect(result.current.loading).toBe(true)
      expect(result.current.actions).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  describe('fetching actions', () => {
    it('should fetch actions with default limit of 5', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(fetch).toHaveBeenCalledWith('/api/crm/actions/recent?limit=5')
      expect(result.current.actions).toEqual(mockActionsData)
    })

    it('should respect custom limit parameter', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      renderHook(() => useRecentActions(10))

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/crm/actions/recent?limit=10')
      })
    })

    it('should work with limit of 1', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [mockActionsData[0]] })
      })

      const { result } = renderHook(() => useRecentActions(1))

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(fetch).toHaveBeenCalledWith('/api/crm/actions/recent?limit=1')
    })

    it('should return all action fields correctly', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.loading).toBe(false))

      const action = result.current.actions[0]
      expect(action.id).toBe('action-1')
      expect(action.type).toBe('update_deal')
      expect(action.status).toBe('executed')
      expect(action.resource).toBe('Enterprise Deal')
      expect(action.confidence).toBe(0.95)
    })
  })

  describe('limit parameter changes', () => {
    it('should refetch when limit changes', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      const { rerender } = renderHook(
        ({ limit }) => useRecentActions(limit),
        { initialProps: { limit: 5 } }
      )

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
      expect(fetch).toHaveBeenCalledWith('/api/crm/actions/recent?limit=5')

      rerender({ limit: 10 })

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
      expect(fetch).toHaveBeenLastCalledWith('/api/crm/actions/recent?limit=10')
    })

    it('should not refetch when limit stays the same', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      const { rerender } = renderHook(
        ({ limit }) => useRecentActions(limit),
        { initialProps: { limit: 5 } }
      )

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      rerender({ limit: 5 })

      // Should still be 1 call (plus interval calls)
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('should handle HTTP error response', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error'
      })

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
      expect(result.current.error?.message).toContain('Failed to fetch actions')
      expect(result.current.actions).toEqual([])
    })

    it('should handle API error in response body', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'Database unavailable' })
      })

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Database unavailable')
    })

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Network error')
    })

    it('should handle non-Error exceptions', async () => {
      (fetch as jest.Mock).mockRejectedValue('String error')

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Failed to fetch actions')
    })

    it('should use default error message when API returns no error', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false })
      })

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Failed to fetch actions')
    })
  })

  describe('auto-refresh', () => {
    it('should refresh every 10 seconds', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      renderHook(() => useRecentActions())

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
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      renderHook(() => useRecentActions())

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
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      const { unmount } = renderHook(() => useRecentActions())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('should reset interval when limit changes', async () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockActionsData })
      })

      const { rerender } = renderHook(
        ({ limit }) => useRecentActions(limit),
        { initialProps: { limit: 5 } }
      )

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      rerender({ limit: 10 })

      // Should clear old interval and set new one
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

      const { result } = renderHook(() => useRecentActions())

      expect(result.current.loading).toBe(true)

      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockActionsData })
        })
      })

      await waitFor(() => expect(result.current.loading).toBe(false))
    })

    it('should clear error on successful fetch after error', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, statusText: 'Error' })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockActionsData })
        })

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.error).toBeTruthy())

      // Trigger refresh
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      await waitFor(() => expect(result.current.error).toBeNull())
      expect(result.current.actions).toEqual(mockActionsData)
    })
  })

  describe('action statuses', () => {
    it('should handle all action statuses', async () => {
      const actionsWithAllStatuses = [
        { ...mockActionsData[0], status: 'pending' as const },
        { ...mockActionsData[0], id: '2', status: 'approved' as const },
        { ...mockActionsData[0], id: '3', status: 'executed' as const },
        { ...mockActionsData[0], id: '4', status: 'failed' as const }
      ]

      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: actionsWithAllStatuses })
      })

      const { result } = renderHook(() => useRecentActions())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.actions.map(a => a.status)).toEqual([
        'pending',
        'approved',
        'executed',
        'failed'
      ])
    })
  })
})

/**
 * Unit tests for useCRMStats hook
 * Tests data fetching, loading states, error handling, and auto-refresh
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { useCRMStats } from '@/hooks/useCRMStats'

describe('useCRMStats', () => {
  const mockStatsData = {
    events_today: 12,
    crm_updates: 5,
    pending_approvals: 3,
    pipeline_value: 150000
  }

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
      (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves

      const { result } = renderHook(() => useCRMStats())

      expect(result.current.loading).toBe(true)
      expect(result.current.stats).toBeNull()
      expect(result.current.error).toBeNull()
    })
  })

  describe('successful data fetching', () => {
    it('should fetch stats on mount', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStatsData })
      })

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(fetch).toHaveBeenCalledWith('/api/crm/stats')
      expect(result.current.stats).toEqual(mockStatsData)
      expect(result.current.error).toBeNull()
    })

    it('should return all stats fields correctly', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStatsData })
      })

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.stats?.events_today).toBe(12)
      expect(result.current.stats?.crm_updates).toBe(5)
      expect(result.current.stats?.pending_approvals).toBe(3)
      expect(result.current.stats?.pipeline_value).toBe(150000)
    })
  })

  describe('error handling', () => {
    it('should handle HTTP error response', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error'
      })

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
      expect(result.current.error?.message).toContain('Failed to fetch stats')
      expect(result.current.stats).toBeNull()
    })

    it('should handle API error in response body', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'Database connection failed' })
      })

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Database connection failed')
    })

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Network error')
    })

    it('should handle non-Error exceptions', async () => {
      (fetch as jest.Mock).mockRejectedValue('String error')

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Failed to fetch stats')
    })
  })

  describe('auto-refresh', () => {
    it('should refresh stats every 30 seconds', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStatsData })
      })

      renderHook(() => useCRMStats())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      // Advance 30 seconds
      act(() => {
        jest.advanceTimersByTime(30000)
      })

      expect(fetch).toHaveBeenCalledTimes(2)

      // Advance another 30 seconds
      act(() => {
        jest.advanceTimersByTime(30000)
      })

      expect(fetch).toHaveBeenCalledTimes(3)
    })

    it('should not refresh before 30 seconds', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStatsData })
      })

      renderHook(() => useCRMStats())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      // Advance 29 seconds
      act(() => {
        jest.advanceTimersByTime(29000)
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should clear interval on unmount', async () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStatsData })
      })

      const { unmount } = renderHook(() => useCRMStats())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
    })
  })

  describe('manual refresh', () => {
    it('should provide a refresh function', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStatsData })
      })

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(typeof result.current.refresh).toBe('function')
    })

    it('should refetch data when refresh is called', async () => {
      const updatedStats = { ...mockStatsData, events_today: 20 }
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockStatsData })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, data: updatedStats })
        })

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.stats?.events_today).toBe(12))

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.stats?.events_today).toBe(20)
    })

    it('should clear previous error on successful refresh', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, statusText: 'Error' })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockStatsData })
        })

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.error).toBeTruthy())

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.error).toBeNull()
      expect(result.current.stats).toEqual(mockStatsData)
    })
  })

  describe('loading state transitions', () => {
    it('should set loading true during fetch', async () => {
      let resolvePromise: (value: any) => void
      const fetchPromise = new Promise(resolve => {
        resolvePromise = resolve
      })

      ;(fetch as jest.Mock).mockReturnValue(fetchPromise)

      const { result } = renderHook(() => useCRMStats())

      expect(result.current.loading).toBe(true)

      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockStatsData })
        })
      })

      await waitFor(() => expect(result.current.loading).toBe(false))
    })

    it('should set loading true during refresh', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStatsData })
      })

      const { result } = renderHook(() => useCRMStats())

      await waitFor(() => expect(result.current.loading).toBe(false))

      // Start refresh but don't await
      act(() => {
        result.current.refresh()
      })

      // Should be loading again
      expect(result.current.loading).toBe(true)
    })
  })
})

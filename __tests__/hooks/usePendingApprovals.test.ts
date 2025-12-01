/**
 * Unit tests for usePendingApprovals hook
 * Tests fetching approvals, approve/reject actions, data transformation, and auto-refresh
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { usePendingApprovals } from '@/hooks/usePendingApprovals'

describe('usePendingApprovals', () => {
  const mockApprovalResponse = {
    success: true,
    data: {
      actions: [
        {
          id: 'action-1',
          action_type: 'upsert_contact',
          resource_name: 'John Doe',
          resource_id: 'contact-123',
          event_type: 'email',
          event_summary: 'Email from client',
          created_at: '2024-01-15T10:00:00Z',
          proposed_data: { email: 'john@example.com', phone: '555-1234' },
          confidence: 0.95,
          justification: 'High confidence match'
        },
        {
          id: 'action-2',
          action_type: 'update_deal',
          resource_name: 'Enterprise Deal',
          event_type: 'meeting',
          event_summary: 'Client meeting notes',
          created_at: '2024-01-15T11:00:00Z',
          proposed_data: { stage: 'negotiation', value: 50000 },
          confidence: 0.75,
          justification: 'Meeting suggested deal progress'
        }
      ]
    }
  }

  beforeEach(() => {
    global.fetch = jest.fn()
    jest.useFakeTimers()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))

      const { result } = renderHook(() => usePendingApprovals())

      expect(result.current.loading).toBe(true)
      expect(result.current.approvals).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  describe('fetching approvals', () => {
    it('should fetch approvals on mount', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApprovalResponse)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(fetch).toHaveBeenCalledWith('/api/crm/approvals?requires_approval=true')
      expect(result.current.approvals).toHaveLength(2)
    })

    it('should transform backend data correctly', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApprovalResponse)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      const approval = result.current.approvals[0]
      expect(approval.id).toBe('action-1')
      expect(approval.type).toBe('upsert_contact')
      expect(approval.resource).toBe('John Doe')
      expect(approval.event.type).toBe('email')
      expect(approval.event.title).toBe('Email from client')
      expect(approval.confidence).toBe(0.95)
      expect(approval.justification).toBe('High confidence match')
    })

    it('should transform proposed_data to proposed_changes array', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApprovalResponse)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      const changes = result.current.approvals[0].proposed_changes
      expect(changes).toHaveLength(2)
      expect(changes[0].field).toBe('Email')
      expect(changes[0].proposed).toBe('john@example.com')
      expect(changes[1].field).toBe('Phone')
      expect(changes[1].proposed).toBe('555-1234')
    })

    it('should use resource_id as fallback when resource_name is missing', async () => {
      const responseWithoutName = {
        success: true,
        data: {
          actions: [{
            id: 'action-1',
            action_type: 'update_deal',
            resource_id: 'deal-456',
            created_at: '2024-01-15T10:00:00Z',
            proposed_data: {},
            confidence: 0.9
          }]
        }
      }
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseWithoutName)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.approvals[0].resource).toBe('deal-456')
    })
  })

  describe('risk level calculation', () => {
    it('should set risk_level to low when confidence >= 0.9', async () => {
      const highConfidenceResponse = {
        success: true,
        data: {
          actions: [{
            id: 'action-1',
            action_type: 'upsert_contact',
            resource_name: 'Test',
            created_at: '2024-01-15T10:00:00Z',
            proposed_data: {},
            confidence: 0.95
          }]
        }
      }
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(highConfidenceResponse)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.approvals[0].risk_level).toBe('low')
    })

    it('should set risk_level to medium when confidence >= 0.7 and < 0.9', async () => {
      const mediumConfidenceResponse = {
        success: true,
        data: {
          actions: [{
            id: 'action-1',
            action_type: 'upsert_contact',
            resource_name: 'Test',
            created_at: '2024-01-15T10:00:00Z',
            proposed_data: {},
            confidence: 0.75
          }]
        }
      }
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mediumConfidenceResponse)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.approvals[0].risk_level).toBe('medium')
    })

    it('should set risk_level to high when confidence < 0.7', async () => {
      const lowConfidenceResponse = {
        success: true,
        data: {
          actions: [{
            id: 'action-1',
            action_type: 'upsert_contact',
            resource_name: 'Test',
            created_at: '2024-01-15T10:00:00Z',
            proposed_data: {},
            confidence: 0.5
          }]
        }
      }
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(lowConfidenceResponse)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.approvals[0].risk_level).toBe('high')
    })
  })

  describe('error handling', () => {
    it('should handle HTTP error response', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error'
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
      expect(result.current.error?.message).toContain('Failed to fetch approvals')
    })

    it('should handle API error in response body', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'Database error' })
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Database error')
    })

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network failure'))

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error?.message).toBe('Network failure')
    })
  })

  describe('auto-refresh', () => {
    it('should refresh every 15 seconds', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApprovalResponse)
      })

      renderHook(() => usePendingApprovals())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      act(() => {
        jest.advanceTimersByTime(15000)
      })

      expect(fetch).toHaveBeenCalledTimes(2)

      act(() => {
        jest.advanceTimersByTime(15000)
      })

      expect(fetch).toHaveBeenCalledTimes(3)
    })

    it('should clear interval on unmount', async () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApprovalResponse)
      })

      const { unmount } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
    })
  })

  describe('approve action', () => {
    it('should send approve request to API', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockApprovalResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.approvals).toHaveLength(2))

      await act(async () => {
        await result.current.approve('action-1')
      })

      expect(fetch).toHaveBeenLastCalledWith('/api/crm/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: 'action-1', decision: 'approve' })
      })
    })

    it('should remove approved item from list', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockApprovalResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.approvals).toHaveLength(2))

      await act(async () => {
        await result.current.approve('action-1')
      })

      expect(result.current.approvals).toHaveLength(1)
      expect(result.current.approvals[0].id).toBe('action-2')
    })

    it('should throw error on approve failure', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockApprovalResponse)
        })
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Server Error'
        })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.approvals).toHaveLength(2))

      await expect(result.current.approve('action-1')).rejects.toThrow()

      // Should not remove from list on failure
      expect(result.current.approvals).toHaveLength(2)
    })

    it('should handle API error response in approve', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockApprovalResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: false, error: 'Already processed' })
        })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.approvals).toHaveLength(2))

      await expect(result.current.approve('action-1')).rejects.toThrow('Already processed')
    })
  })

  describe('reject action', () => {
    it('should send reject request with reason', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockApprovalResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.approvals).toHaveLength(2))

      await act(async () => {
        await result.current.reject('action-1', 'Incorrect data')
      })

      expect(fetch).toHaveBeenLastCalledWith('/api/crm/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_id: 'action-1',
          decision: 'reject',
          reason: 'Incorrect data'
        })
      })
    })

    it('should send reject request without reason', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockApprovalResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.approvals).toHaveLength(2))

      await act(async () => {
        await result.current.reject('action-1')
      })

      expect(fetch).toHaveBeenLastCalledWith('/api/crm/approvals', expect.objectContaining({
        body: JSON.stringify({
          action_id: 'action-1',
          decision: 'reject',
          reason: undefined
        })
      }))
    })

    it('should remove rejected item from list', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockApprovalResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.approvals).toHaveLength(2))

      await act(async () => {
        await result.current.reject('action-2', 'Not relevant')
      })

      expect(result.current.approvals).toHaveLength(1)
      expect(result.current.approvals[0].id).toBe('action-1')
    })

    it('should throw error on reject failure', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockApprovalResponse)
        })
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Server Error'
        })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.approvals).toHaveLength(2))

      await expect(result.current.reject('action-1')).rejects.toThrow()

      // Should not remove from list on failure
      expect(result.current.approvals).toHaveLength(2)
    })
  })

  describe('manual refresh', () => {
    it('should provide refresh function', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApprovalResponse)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(typeof result.current.refresh).toBe('function')
    })

    it('should refetch data when refresh is called', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApprovalResponse)
      })

      const { result } = renderHook(() => usePendingApprovals())

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

      await act(async () => {
        await result.current.refresh()
      })

      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })
})

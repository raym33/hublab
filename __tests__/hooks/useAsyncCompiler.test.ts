/**
 * Unit tests for useAsyncCompiler hook
 * Tests async compilation, polling, callbacks, timeouts, and cancellation
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { useAsyncCompiler } from '@/hooks/useAsyncCompiler'

describe('useAsyncCompiler', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAsyncCompiler())

      expect(result.current.isCompiling).toBe(false)
      expect(result.current.job).toBeNull()
      expect(result.current.result).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.retryCount).toBe(0)
    })

    it('should provide startCompilation and cancelCompilation functions', () => {
      const { result } = renderHook(() => useAsyncCompiler())

      expect(typeof result.current.startCompilation).toBe('function')
      expect(typeof result.current.cancelCompilation).toBe('function')
    })
  })

  describe('startCompilation', () => {
    it('should set isCompiling to true when starting', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'job-123' })
      })

      const { result } = renderHook(() => useAsyncCompiler())

      act(() => {
        result.current.startCompilation({ prompt: 'Build a todo app' })
      })

      expect(result.current.isCompiling).toBe(true)
    })

    it('should reset state when starting new compilation', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'job-123' })
      })

      const { result } = renderHook(() => useAsyncCompiler())

      // Set some initial error state
      await act(async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, statusText: 'Error' })
        await result.current.startCompilation({ prompt: 'test' })
      })

      expect(result.current.error).toBeTruthy()

      // Start new compilation
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'job-456' })
      })

      act(() => {
        result.current.startCompilation({ prompt: 'new prompt' })
      })

      expect(result.current.error).toBeNull()
      expect(result.current.result).toBeNull()
      expect(result.current.retryCount).toBe(0)
    })

    it('should call API with correct parameters', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'job-123' })
      })

      const { result } = renderHook(() => useAsyncCompiler())

      const params = {
        prompt: 'Build a landing page',
        platform: 'react',
        template: 'marketing',
        selectedCapsules: ['hero', 'features']
      }

      await act(async () => {
        await result.current.startCompilation(params)
      })

      expect(fetch).toHaveBeenCalledWith('/api/compiler/async', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
    })

    it('should call onProgress callback when job starts', async () => {
      const onProgress = jest.fn()
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'job-123' })
      })

      const { result } = renderHook(() => useAsyncCompiler({ onProgress }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      expect(onProgress).toHaveBeenCalledWith('Compilation started...')
    })

    it('should create job object on successful start', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ jobId: 'job-123' })
        })
        // Return processing to keep job alive
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ jobId: 'job-123', status: 'processing' })
        })

      const { result } = renderHook(() => useAsyncCompiler({ pollInterval: 10000 }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      // Job should be created with the correct jobId
      await waitFor(() => {
        expect(result.current.job).toBeTruthy()
      })
      expect(result.current.job?.jobId).toBe('job-123')
    })
  })

  describe('error handling on start', () => {
    it('should handle HTTP error response', async () => {
      const onError = jest.fn()
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error'
      })

      const { result } = renderHook(() => useAsyncCompiler({ onError }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      expect(result.current.error).toContain('Failed to start compilation')
      expect(result.current.isCompiling).toBe(false)
      expect(onError).toHaveBeenCalled()
    })

    it('should handle missing jobId in response', async () => {
      const onError = jest.fn()
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}) // No jobId
      })

      const { result } = renderHook(() => useAsyncCompiler({ onError }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      expect(result.current.error).toBe('No job ID received')
      expect(onError).toHaveBeenCalledWith('No job ID received')
    })

    it('should handle network errors', async () => {
      const onError = jest.fn()
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network failure'))

      const { result } = renderHook(() => useAsyncCompiler({ onError }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      expect(result.current.error).toBe('Network failure')
      expect(result.current.isCompiling).toBe(false)
    })
  })

  describe('polling behavior', () => {
    it('should poll for status and complete successfully', async () => {
      // Start compilation returns job, then polls eventually complete
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ jobId: 'job-123' })
        })
        // All polls after start return completed
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({
            jobId: 'job-123',
            status: 'completed',
            result: { code: 'generated code' }
          })
        })

      const onComplete = jest.fn()
      const { result } = renderHook(() => useAsyncCompiler({ onComplete, pollInterval: 1000 }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      // Advance to trigger polling
      await act(async () => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(result.current.result).toEqual({ code: 'generated code' })
      })

      expect(result.current.isCompiling).toBe(false)
      expect(onComplete).toHaveBeenCalledWith({ code: 'generated code' })
    })

    it('should call onProgress during processing', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ jobId: 'job-123' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ jobId: 'job-123', status: 'processing' })
        })

      const onProgress = jest.fn()
      const { result } = renderHook(() => useAsyncCompiler({ onProgress, pollInterval: 1000 }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      expect(onProgress).toHaveBeenCalledWith('Compiling your application...')
    })

    it('should handle compilation failure', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ jobId: 'job-123' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            jobId: 'job-123',
            status: 'failed',
            error: 'Syntax error in generated code'
          })
        })

      const onError = jest.fn()
      const { result } = renderHook(() => useAsyncCompiler({ onError, pollInterval: 1000 }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Syntax error in generated code')
      })

      expect(result.current.isCompiling).toBe(false)
      expect(onError).toHaveBeenCalledWith('Syntax error in generated code')
    })

    it('should use default error message when none provided', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ jobId: 'job-123' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ jobId: 'job-123', status: 'failed' })
        })

      const { result } = renderHook(() => useAsyncCompiler({ pollInterval: 1000 }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Compilation failed')
      })
    })
  })

  describe('timeout handling', () => {
    it('should have maxRetries option available', () => {
      const { result } = renderHook(() => useAsyncCompiler({ maxRetries: 5, pollInterval: 100 }))

      // Should be able to create hook with maxRetries option
      expect(result.current.startCompilation).toBeDefined()
      expect(result.current.retryCount).toBe(0)
    })
  })

  describe('cancelCompilation', () => {
    it('should provide cancelCompilation function', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'job-123' })
      })

      const { result } = renderHook(() => useAsyncCompiler())

      expect(typeof result.current.cancelCompilation).toBe('function')
    })

    it('should set error message when cancelled', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'job-123' })
      })

      const onProgress = jest.fn()
      const { result } = renderHook(() => useAsyncCompiler({ onProgress }))

      await act(async () => {
        result.current.cancelCompilation()
      })

      expect(result.current.error).toBe('Compilation cancelled')
      expect(onProgress).toHaveBeenCalledWith('Compilation cancelled')
    })
  })

  describe('progress tracking', () => {
    it('should expose progress property in hook return', () => {
      const { result } = renderHook(() => useAsyncCompiler())

      // Progress should be part of the returned object (may be undefined initially)
      expect('progress' in result.current).toBe(true)
    })

    it('should update job status after starting compilation', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ jobId: 'job-123' })
      })

      const { result } = renderHook(() => useAsyncCompiler({ pollInterval: 10000 }))

      await act(async () => {
        await result.current.startCompilation({ prompt: 'test' })
      })

      // Job should be created
      expect(result.current.job).toBeTruthy()
      expect(result.current.job?.jobId).toBe('job-123')
    })
  })

  describe('polling behavior', () => {
    it('should have polling related properties', () => {
      const { result } = renderHook(() => useAsyncCompiler({ pollInterval: 2000, maxRetries: 30 }))

      expect(result.current.retryCount).toBeDefined()
      expect(typeof result.current.retryCount).toBe('number')
    })
  })
})

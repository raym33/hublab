import { useState, useEffect, useCallback } from 'react'

interface CompilationJob {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: any
  error?: string
  createdAt: Date
  updatedAt: Date
}

interface UseAsyncCompilerOptions {
  pollInterval?: number // milliseconds
  maxRetries?: number
  onProgress?: (status: string) => void
  onComplete?: (result: any) => void
  onError?: (error: string) => void
}

export function useAsyncCompiler(options: UseAsyncCompilerOptions = {}) {
  const {
    pollInterval = 2000, // Poll every 2 seconds
    maxRetries = 30, // Max 60 seconds (30 * 2s)
    onProgress,
    onComplete,
    onError
  } = options

  const [isCompiling, setIsCompiling] = useState(false)
  const [job, setJob] = useState<CompilationJob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Start compilation
  const startCompilation = useCallback(async (params: {
    prompt?: string
    platform?: string
    template?: string
    composition?: any
    selectedCapsules?: string[]
  }) => {
    setIsCompiling(true)
    setError(null)
    setResult(null)
    setRetryCount(0)

    try {
      // Start async compilation
      const response = await fetch('/api/compiler/async', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        throw new Error(`Failed to start compilation: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.jobId) {
        setJob({
          jobId: data.jobId,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        onProgress?.('Compilation started...')
      } else {
        throw new Error('No job ID received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start compilation'
      setError(errorMessage)
      setIsCompiling(false)
      onError?.(errorMessage)
    }
  }, [onProgress, onError])

  // Poll for job status
  useEffect(() => {
    if (!job || !isCompiling) return

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/compiler/async?jobId=${job.jobId}`)

        if (!response.ok) {
          throw new Error(`Failed to check status: ${response.statusText}`)
        }

        const data: CompilationJob = await response.json()
        setJob(data)

        // Update progress
        if (data.status === 'processing') {
          onProgress?.('Compiling your application...')
        }

        // Handle completion
        if (data.status === 'completed') {
          setResult(data.result)
          setIsCompiling(false)
          onComplete?.(data.result)
          onProgress?.('Compilation completed!')
          return true // Stop polling
        }

        // Handle failure
        if (data.status === 'failed') {
          const errorMsg = data.error || 'Compilation failed'
          setError(errorMsg)
          setIsCompiling(false)
          onError?.(errorMsg)
          return true // Stop polling
        }

        // Check retry limit
        if (retryCount >= maxRetries) {
          const errorMsg = 'Compilation timed out'
          setError(errorMsg)
          setIsCompiling(false)
          onError?.(errorMsg)
          return true // Stop polling
        }

        setRetryCount(prev => prev + 1)
        return false // Continue polling

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to check status'
        console.error('Polling error:', errorMessage)

        // Don't immediately fail on polling errors, retry
        if (retryCount >= maxRetries) {
          setError(errorMessage)
          setIsCompiling(false)
          onError?.(errorMessage)
          return true
        }

        setRetryCount(prev => prev + 1)
        return false
      }
    }

    // Set up polling interval
    const interval = setInterval(async () => {
      const shouldStop = await pollStatus()
      if (shouldStop) {
        clearInterval(interval)
      }
    }, pollInterval)

    // Initial poll
    pollStatus()

    // Cleanup
    return () => clearInterval(interval)
  }, [job?.jobId, isCompiling, retryCount, maxRetries, pollInterval, onProgress, onComplete, onError])

  // Cancel compilation (if needed)
  const cancelCompilation = useCallback(() => {
    setIsCompiling(false)
    setJob(null)
    setError('Compilation cancelled')
    onProgress?.('Compilation cancelled')
  }, [onProgress])

  return {
    startCompilation,
    cancelCompilation,
    isCompiling,
    job,
    result,
    error,
    progress: job?.status,
    retryCount
  }
}
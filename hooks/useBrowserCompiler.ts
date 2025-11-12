import { useState, useCallback, useEffect } from 'react'
import { browserCompiler } from '@/lib/client-compiler/browser-compiler'
import type { CapsuleComposition } from '@/lib/capsule-compiler/types'

interface UseBrowserCompilerOptions {
  onComplete?: (result: any) => void
  onError?: (error: string) => void
  onProgress?: (message: string) => void
}

export function useBrowserCompiler(options: UseBrowserCompilerOptions = {}) {
  const { onComplete, onError, onProgress } = options

  const [isCompiling, setIsCompiling] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>('')

  // Initialize compiler on mount
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      // browserCompiler.dispose() // Don't dispose singleton
    }
  }, [])

  const compile = useCallback(async (composition: CapsuleComposition) => {
    setIsCompiling(true)
    setError(null)
    setResult(null)
    setProgress('Initializing browser compiler...')
    onProgress?.('Initializing browser compiler...')

    try {
      // Add artificial progress updates for better UX
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          const messages = [
            'Parsing capsule definitions...',
            'Generating React components...',
            'Creating styles...',
            'Bundling application...',
            'Finalizing compilation...'
          ]
          const currentIndex = messages.findIndex(m => m === prev)
          const nextMessage = messages[Math.min(currentIndex + 1, messages.length - 1)]
          onProgress?.(nextMessage)
          return nextMessage
        })
      }, 500)

      // Compile in browser
      const compilationResult = await browserCompiler.compile(composition)

      clearInterval(progressTimer)

      setResult(compilationResult)
      setProgress('Compilation complete!')
      onProgress?.('Compilation complete!')
      onComplete?.(compilationResult)

      return compilationResult
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Compilation failed'
      setError(errorMessage)
      setProgress('')
      onError?.(errorMessage)
      return null
    } finally {
      setIsCompiling(false)
    }
  }, [onComplete, onError, onProgress])

  const compileFromTemplate = useCallback(async (templateName: string) => {
    // Create a basic composition from template
    const templates: Record<string, CapsuleComposition> = {
      'todo-app': {
        name: 'Todo App',
        description: 'A simple todo list application',
        capsules: [
          {
            name: 'TodoList',
            type: 'component',
            description: 'Main todo list component',
            config: { features: ['add', 'delete', 'complete'] }
          },
          {
            name: 'TodoInput',
            type: 'component',
            description: 'Input for new todos',
            config: { placeholder: 'Add a new task...' }
          }
        ],
        layout: 'vertical',
        platform: 'web'
      },
      'landing-page': {
        name: 'Landing Page',
        description: 'Marketing landing page',
        capsules: [
          {
            name: 'Hero',
            type: 'component',
            description: 'Hero section',
            config: { title: 'Welcome to Our Product' }
          },
          {
            name: 'Features',
            type: 'component',
            description: 'Features grid',
            config: { columns: 3 }
          },
          {
            name: 'CTA',
            type: 'component',
            description: 'Call to action',
            config: { buttonText: 'Get Started' }
          }
        ],
        layout: 'vertical',
        platform: 'web'
      },
      'dashboard': {
        name: 'Dashboard',
        description: 'Analytics dashboard',
        capsules: [
          {
            name: 'StatsCard',
            type: 'component',
            description: 'Statistics card',
            config: { metrics: ['users', 'revenue', 'growth'] }
          },
          {
            name: 'Chart',
            type: 'component',
            description: 'Data visualization',
            config: { type: 'line' }
          },
          {
            name: 'Table',
            type: 'component',
            description: 'Data table',
            config: { sortable: true, paginated: true }
          }
        ],
        layout: 'grid',
        platform: 'web'
      }
    }

    const composition = templates[templateName] || templates['todo-app']
    return compile(composition)
  }, [compile])

  const reset = useCallback(() => {
    setIsCompiling(false)
    setResult(null)
    setError(null)
    setProgress('')
  }, [])

  return {
    compile,
    compileFromTemplate,
    reset,
    isCompiling,
    result,
    error,
    progress
  }
}
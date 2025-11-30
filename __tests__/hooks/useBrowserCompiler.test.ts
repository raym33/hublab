/**
 * Unit tests for useBrowserCompiler hook
 * Tests browser-side compilation, templates, progress updates, and error handling
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { useBrowserCompiler } from '@/hooks/useBrowserCompiler'

// Mock the browser compiler module
jest.mock('@/lib/client-compiler/browser-compiler', () => ({
  browserCompiler: {
    compile: jest.fn()
  }
}))

import { browserCompiler } from '@/lib/client-compiler/browser-compiler'

describe('useBrowserCompiler', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useBrowserCompiler())

      expect(result.current.isCompiling).toBe(false)
      expect(result.current.result).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.progress).toBe('')
    })

    it('should provide compile, compileFromTemplate, and reset functions', () => {
      const { result } = renderHook(() => useBrowserCompiler())

      expect(typeof result.current.compile).toBe('function')
      expect(typeof result.current.compileFromTemplate).toBe('function')
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('compile', () => {
    it('should set isCompiling to true during compilation', async () => {
      ;(browserCompiler.compile as jest.Mock).mockResolvedValue({ code: {} })

      const { result } = renderHook(() => useBrowserCompiler())

      let compilePromise: Promise<any>
      act(() => {
        compilePromise = result.current.compile({
          name: 'Test App',
          description: 'Test description',
          capsules: [],
          layout: 'vertical',
          platform: 'web'
        } as any)
      })

      expect(result.current.isCompiling).toBe(true)

      await act(async () => {
        await compilePromise
      })

      expect(result.current.isCompiling).toBe(false)
    })

    it('should compile a composition successfully', async () => {
      const mockResult = {
        code: { 'App.tsx': 'export default function App() { return <div>Hello</div> }' },
        files: ['App.tsx']
      }
      ;(browserCompiler.compile as jest.Mock).mockResolvedValue(mockResult)

      const onComplete = jest.fn()
      const { result } = renderHook(() => useBrowserCompiler({ onComplete }))

      const composition = {
        name: 'Test App',
        description: 'A test application',
        capsules: [{ name: 'Button', type: 'component', description: 'Button component' }],
        layout: 'vertical',
        platform: 'web'
      }

      await act(async () => {
        await result.current.compile(composition as any)
      })

      expect(browserCompiler.compile).toHaveBeenCalledWith(composition)
      expect(result.current.result).toEqual(mockResult)
      expect(result.current.isCompiling).toBe(false)
      expect(onComplete).toHaveBeenCalledWith(mockResult)
    })

    it('should return compilation result', async () => {
      const mockResult = { code: { 'index.tsx': 'code here' } }
      ;(browserCompiler.compile as jest.Mock).mockResolvedValue(mockResult)

      const { result } = renderHook(() => useBrowserCompiler())

      let returnedResult: any
      await act(async () => {
        returnedResult = await result.current.compile({
          name: 'Test',
          capsules: [],
          layout: 'vertical',
          platform: 'web'
        } as any)
      })

      expect(returnedResult).toEqual(mockResult)
    })

    it('should reset state before new compilation', async () => {
      ;(browserCompiler.compile as jest.Mock)
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({ code: {} })

      const { result } = renderHook(() => useBrowserCompiler())

      // First compilation fails
      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(result.current.error).toBe('First error')

      // Second compilation should reset error
      await act(async () => {
        await result.current.compile({ name: 'Test 2', capsules: [] } as any)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.result).toBeTruthy()
    })
  })

  describe('error handling', () => {
    it('should handle compilation errors', async () => {
      ;(browserCompiler.compile as jest.Mock).mockRejectedValue(
        new Error('Syntax error in component')
      )

      const onError = jest.fn()
      const { result } = renderHook(() => useBrowserCompiler({ onError }))

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(result.current.error).toBe('Syntax error in component')
      expect(result.current.isCompiling).toBe(false)
      expect(onError).toHaveBeenCalledWith('Syntax error in component')
    })

    it('should return null on compilation failure', async () => {
      ;(browserCompiler.compile as jest.Mock).mockRejectedValue(new Error('Failed'))

      const { result } = renderHook(() => useBrowserCompiler())

      let returnedResult: any
      await act(async () => {
        returnedResult = await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(returnedResult).toBeNull()
    })

    it('should handle non-Error exceptions', async () => {
      ;(browserCompiler.compile as jest.Mock).mockRejectedValue('String error')

      const { result } = renderHook(() => useBrowserCompiler())

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(result.current.error).toBe('Compilation failed')
    })
  })

  describe('progress updates', () => {
    it('should update progress during compilation', async () => {
      let resolveCompile: (value: any) => void
      ;(browserCompiler.compile as jest.Mock).mockImplementation(
        () => new Promise(resolve => { resolveCompile = resolve })
      )

      const onProgress = jest.fn()
      const { result } = renderHook(() => useBrowserCompiler({ onProgress }))

      let compilePromise: Promise<any>
      act(() => {
        compilePromise = result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(result.current.progress).toBe('Initializing browser compiler...')
      expect(onProgress).toHaveBeenCalledWith('Initializing browser compiler...')

      // Advance through a few progress stages
      await act(async () => {
        jest.advanceTimersByTime(500)
      })

      // Should have called onProgress multiple times
      expect(onProgress.mock.calls.length).toBeGreaterThanOrEqual(2)

      // Resolve the compilation
      await act(async () => {
        resolveCompile!({ code: {} })
        await compilePromise
      })

      expect(result.current.progress).toBe('Compilation complete!')
      expect(onProgress).toHaveBeenCalledWith('Compilation complete!')
    })

    it('should clear progress on error', async () => {
      ;(browserCompiler.compile as jest.Mock).mockRejectedValue(new Error('Failed'))

      const { result } = renderHook(() => useBrowserCompiler())

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(result.current.progress).toBe('')
    })
  })

  describe('compileFromTemplate', () => {
    beforeEach(() => {
      ;(browserCompiler.compile as jest.Mock).mockResolvedValue({ code: {} })
    })

    it('should compile todo-app template', async () => {
      const { result } = renderHook(() => useBrowserCompiler())

      await act(async () => {
        await result.current.compileFromTemplate('todo-app')
      })

      expect(browserCompiler.compile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Todo App',
          description: 'A simple todo list application',
          layout: 'vertical',
          platform: 'web'
        })
      )

      const call = (browserCompiler.compile as jest.Mock).mock.calls[0][0]
      expect(call.capsules).toHaveLength(2)
      expect(call.capsules[0].name).toBe('TodoList')
      expect(call.capsules[1].name).toBe('TodoInput')
    })

    it('should compile landing-page template', async () => {
      const { result } = renderHook(() => useBrowserCompiler())

      await act(async () => {
        await result.current.compileFromTemplate('landing-page')
      })

      expect(browserCompiler.compile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Landing Page',
          description: 'Marketing landing page'
        })
      )

      const call = (browserCompiler.compile as jest.Mock).mock.calls[0][0]
      expect(call.capsules).toHaveLength(3)
      expect(call.capsules.map((c: any) => c.name)).toEqual(['Hero', 'Features', 'CTA'])
    })

    it('should compile dashboard template', async () => {
      const { result } = renderHook(() => useBrowserCompiler())

      await act(async () => {
        await result.current.compileFromTemplate('dashboard')
      })

      expect(browserCompiler.compile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Dashboard',
          layout: 'grid'
        })
      )

      const call = (browserCompiler.compile as jest.Mock).mock.calls[0][0]
      expect(call.capsules).toHaveLength(3)
      expect(call.capsules.map((c: any) => c.name)).toEqual(['StatsCard', 'Chart', 'Table'])
    })

    it('should fall back to todo-app for unknown template', async () => {
      const { result } = renderHook(() => useBrowserCompiler())

      await act(async () => {
        await result.current.compileFromTemplate('unknown-template')
      })

      expect(browserCompiler.compile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Todo App'
        })
      )
    })

    it('should return compilation result from template', async () => {
      const mockResult = { code: { 'App.tsx': 'template code' } }
      ;(browserCompiler.compile as jest.Mock).mockResolvedValue(mockResult)

      const { result } = renderHook(() => useBrowserCompiler())

      let returnedResult: any
      await act(async () => {
        returnedResult = await result.current.compileFromTemplate('todo-app')
      })

      expect(returnedResult).toEqual(mockResult)
    })
  })

  describe('reset', () => {
    it('should clear all state', async () => {
      ;(browserCompiler.compile as jest.Mock).mockResolvedValue({ code: { file: 'content' } })

      const { result } = renderHook(() => useBrowserCompiler())

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(result.current.result).toBeTruthy()
      expect(result.current.progress).toBe('Compilation complete!')

      act(() => {
        result.current.reset()
      })

      expect(result.current.isCompiling).toBe(false)
      expect(result.current.result).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.progress).toBe('')
    })

    it('should clear error state', async () => {
      ;(browserCompiler.compile as jest.Mock).mockRejectedValue(new Error('Compile error'))

      const { result } = renderHook(() => useBrowserCompiler())

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(result.current.error).toBe('Compile error')

      act(() => {
        result.current.reset()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('callbacks', () => {
    it('should call onComplete with result on success', async () => {
      const mockResult = { code: {} }
      ;(browserCompiler.compile as jest.Mock).mockResolvedValue(mockResult)

      const onComplete = jest.fn()
      const { result } = renderHook(() => useBrowserCompiler({ onComplete }))

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledWith(mockResult)
    })

    it('should call onError on failure', async () => {
      ;(browserCompiler.compile as jest.Mock).mockRejectedValue(new Error('Oops'))

      const onError = jest.fn()
      const { result } = renderHook(() => useBrowserCompiler({ onError }))

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith('Oops')
    })

    it('should not call onComplete on failure', async () => {
      ;(browserCompiler.compile as jest.Mock).mockRejectedValue(new Error('Failed'))

      const onComplete = jest.fn()
      const { result } = renderHook(() => useBrowserCompiler({ onComplete }))

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(onComplete).not.toHaveBeenCalled()
    })

    it('should not call onError on success', async () => {
      ;(browserCompiler.compile as jest.Mock).mockResolvedValue({ code: {} })

      const onError = jest.fn()
      const { result } = renderHook(() => useBrowserCompiler({ onError }))

      await act(async () => {
        await result.current.compile({ name: 'Test', capsules: [] } as any)
      })

      expect(onError).not.toHaveBeenCalled()
    })
  })
})

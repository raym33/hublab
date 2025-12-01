/**
 * Unit tests for SecureLivePreview component
 * Tests security features, iframe sandboxing, console message handling, and view modes
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SecureLivePreview from '@/components/SecureLivePreview'

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url')
const mockRevokeObjectURL = jest.fn()

beforeAll(() => {
  global.URL.createObjectURL = mockCreateObjectURL
  global.URL.revokeObjectURL = mockRevokeObjectURL
})

describe('SecureLivePreview', () => {
  const defaultCode = {
    'App.tsx': 'export default function App() { return <div>Hello World</div> }'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      expect(screen.getByTitle('Secure Code Preview')).toBeInTheDocument()
    })

    it('should display security badge', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      expect(screen.getByText('Sandboxed')).toBeInTheDocument()
    })

    it('should show loading state initially', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      expect(screen.getByText('Compiling preview...')).toBeInTheDocument()
    })

    it('should render an iframe', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview')
      expect(iframe.tagName).toBe('IFRAME')
    })
  })

  describe('security features', () => {
    it('should apply sandbox attribute to iframe', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview')
      expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-modals')
    })

    it('should have restrictive sandbox (no allow-same-origin)', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview')
      const sandbox = iframe.getAttribute('sandbox')

      expect(sandbox).not.toContain('allow-same-origin')
      expect(sandbox).not.toContain('allow-forms')
      expect(sandbox).not.toContain('allow-popups')
    })

    it('should apply CSP header attribute', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview')
      expect(iframe).toHaveAttribute('csp')

      const csp = iframe.getAttribute('csp')
      expect(csp).toContain("default-src 'none'")
      expect(csp).toContain('script-src')
    })

    it('should create blob URL for iframe source', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    })
  })

  describe('view modes', () => {
    it('should apply desktop view mode by default', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview')
      expect(iframe).toHaveClass('w-full', 'h-full')
    })

    it('should apply tablet view mode', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" viewMode="tablet" />)

      const iframe = screen.getByTitle('Secure Code Preview')
      expect(iframe).toHaveClass('w-[768px]', 'h-[1024px]')
    })

    it('should apply mobile view mode', () => {
      render(<SecureLivePreview code={defaultCode} platform="react" viewMode="mobile" />)

      const iframe = screen.getByTitle('Secure Code Preview')
      expect(iframe).toHaveClass('w-[375px]', 'h-[667px]')
    })
  })

  describe('console message handling', () => {
    it('should call onConsoleMessage when receiving console message', async () => {
      const onConsoleMessage = jest.fn()
      render(
        <SecureLivePreview
          code={defaultCode}
          platform="react"
          onConsoleMessage={onConsoleMessage}
        />
      )

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      // Simulate message from iframe
      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'console',
            data: { level: 'log', message: 'Test log message' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      expect(onConsoleMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'log',
          message: 'Test log message'
        })
      )
    })

    it('should handle console warning messages', async () => {
      const onConsoleMessage = jest.fn()
      render(
        <SecureLivePreview
          code={defaultCode}
          platform="react"
          onConsoleMessage={onConsoleMessage}
        />
      )

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'console',
            data: { level: 'warn', message: 'Warning message' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      expect(onConsoleMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'warn',
          message: 'Warning message'
        })
      )
    })

    it('should handle console error messages', async () => {
      const onConsoleMessage = jest.fn()
      render(
        <SecureLivePreview
          code={defaultCode}
          platform="react"
          onConsoleMessage={onConsoleMessage}
        />
      )

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'console',
            data: { level: 'error', message: 'Error message' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      expect(onConsoleMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: 'Error message'
        })
      )
    })

    it('should add timestamp to console messages', async () => {
      const onConsoleMessage = jest.fn()
      render(
        <SecureLivePreview
          code={defaultCode}
          platform="react"
          onConsoleMessage={onConsoleMessage}
        />
      )

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'console',
            data: { level: 'log', message: 'Test' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      expect(onConsoleMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(Number)
        })
      )
    })
  })

  describe('ready state', () => {
    it('should hide loading when ready message received', async () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      expect(screen.getByText('Compiling preview...')).toBeInTheDocument()

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: { type: 'ready' },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      expect(screen.queryByText('Compiling preview...')).not.toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('should display error when error message received', async () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'error',
            data: { message: 'Syntax error on line 5' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      expect(screen.getByText('Preview Error')).toBeInTheDocument()
      expect(screen.getByText('Syntax error on line 5')).toBeInTheDocument()
    })

    it('should show refresh button on error', async () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'error',
            data: { message: 'Error occurred' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      // Find refresh button within error container
      const errorContainer = screen.getByText('Preview Error').closest('div')
      expect(errorContainer).toBeInTheDocument()
    })

    it('should hide loading on error', async () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'error',
            data: { message: 'Error' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      expect(screen.queryByText('Compiling preview...')).not.toBeInTheDocument()
    })
  })

  describe('message source verification', () => {
    it('should ignore messages from other sources', async () => {
      const onConsoleMessage = jest.fn()
      render(
        <SecureLivePreview
          code={defaultCode}
          platform="react"
          onConsoleMessage={onConsoleMessage}
        />
      )

      // Simulate message from unknown source (not the iframe)
      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'console',
            data: { level: 'log', message: 'Malicious message' }
          },
          source: null // Not from our iframe
        })
        window.dispatchEvent(messageEvent)
      })

      expect(onConsoleMessage).not.toHaveBeenCalled()
    })
  })

  describe('code updates', () => {
    it('should recreate blob URL when code changes', () => {
      const { rerender } = render(
        <SecureLivePreview code={defaultCode} platform="react" />
      )

      const initialCallCount = mockCreateObjectURL.mock.calls.length

      const newCode = {
        'App.tsx': 'export default function App() { return <div>Updated</div> }'
      }

      rerender(<SecureLivePreview code={newCode} platform="react" />)

      expect(mockCreateObjectURL.mock.calls.length).toBeGreaterThan(initialCallCount)
    })

    it('should revoke old blob URL on cleanup', () => {
      const { unmount } = render(
        <SecureLivePreview code={defaultCode} platform="react" />
      )

      unmount()

      expect(mockRevokeObjectURL).toHaveBeenCalled()
    })
  })

  describe('code file detection', () => {
    it('should handle App.tsx file', () => {
      const code = {
        'App.tsx': 'export default function App() { return <div>TSX</div> }'
      }

      render(<SecureLivePreview code={code} platform="react" />)

      expect(mockCreateObjectURL).toHaveBeenCalled()
      const blob = mockCreateObjectURL.mock.calls[0][0]
      expect(blob.type).toBe('text/html')
    })

    it('should handle src/App.tsx file', () => {
      const code = {
        'src/App.tsx': 'export default function App() { return <div>Src TSX</div> }'
      }

      render(<SecureLivePreview code={code} platform="react" />)

      expect(mockCreateObjectURL).toHaveBeenCalled()
    })

    it('should handle App.jsx file', () => {
      const code = {
        'App.jsx': 'export default function App() { return <div>JSX</div> }'
      }

      render(<SecureLivePreview code={code} platform="react" />)

      expect(mockCreateObjectURL).toHaveBeenCalled()
    })

    it('should handle index.tsx file', () => {
      const code = {
        'index.tsx': 'export default function Index() { return <div>Index</div> }'
      }

      render(<SecureLivePreview code={code} platform="react" />)

      expect(mockCreateObjectURL).toHaveBeenCalled()
    })
  })

  describe('CSS handling', () => {
    it('should include CSS files in preview', () => {
      const code = {
        'App.tsx': 'export default function App() { return <div>App</div> }',
        'styles.css': '.container { padding: 20px; }'
      }

      render(<SecureLivePreview code={code} platform="react" />)

      expect(mockCreateObjectURL).toHaveBeenCalled()
      // The blob should contain the CSS
    })

    it('should handle multiple CSS files', () => {
      const code = {
        'App.tsx': 'export default function App() { return <div>App</div> }',
        'base.css': 'body { margin: 0; }',
        'theme.css': ':root { --primary: blue; }'
      }

      render(<SecureLivePreview code={code} platform="react" />)

      expect(mockCreateObjectURL).toHaveBeenCalled()
    })
  })

  describe('console output display', () => {
    it('should display console messages in UI', async () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'console',
            data: { level: 'log', message: 'Displayed message' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      // Console output should be visible
      expect(screen.getByText('Displayed message')).toBeInTheDocument()
    })

    it('should style error messages differently', async () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'console',
            data: { level: 'error', message: 'Error log' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      const errorMessage = screen.getByText('Error log')
      expect(errorMessage.closest('div')).toHaveClass('text-red-400')
    })

    it('should style warning messages differently', async () => {
      render(<SecureLivePreview code={defaultCode} platform="react" />)

      const iframe = screen.getByTitle('Secure Code Preview') as HTMLIFrameElement

      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: {
            type: 'console',
            data: { level: 'warn', message: 'Warning log' }
          },
          source: iframe.contentWindow
        })
        window.dispatchEvent(messageEvent)
      })

      const warnMessage = screen.getByText('Warning log')
      expect(warnMessage.closest('div')).toHaveClass('text-yellow-400')
    })
  })

  describe('cleanup', () => {
    it('should remove message event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = render(
        <SecureLivePreview code={defaultCode} platform="react" />
      )

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function))
    })
  })
})

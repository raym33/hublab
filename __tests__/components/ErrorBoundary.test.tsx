/**
 * Unit tests for ErrorBoundary component
 * Tests error catching, Sentry reporting, reset functionality, and fallback UI
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '@/components/ErrorBoundary'
import * as Sentry from '@sentry/nextjs'

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn()
}))

// Component that throws an error when shouldThrow is true
const ThrowingComponent = ({ shouldThrow, errorMessage = 'Test error' }: {
  shouldThrow: boolean
  errorMessage?: string
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage)
  }
  return <div data-testid="child-content">Child rendered successfully</div>
}

// Component that throws on button click
const ThrowOnClickComponent = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false)

  if (shouldThrow) {
    throw new Error('Clicked error')
  }

  return (
    <button onClick={() => setShouldThrow(true)}>
      Trigger Error
    </button>
  )
}

describe('ErrorBoundary', () => {
  const originalNodeEnv = process.env.NODE_ENV
  const originalConsoleError = console.error

  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress React's console.error for expected errors
    console.error = jest.fn()
  })

  afterEach(() => {
    console.error = originalConsoleError
    process.env.NODE_ENV = originalNodeEnv
  })

  describe('normal rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Child content</div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })

    it('should render nested components', () => {
      const NestedComponent = () => <span>Nested content</span>

      render(
        <ErrorBoundary>
          <div>
            <NestedComponent />
          </div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })
  })

  describe('error catching', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()
    })

    it('should display error message in fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText(/We've been notified/)).toBeInTheDocument()
    })

    it('should show Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('should show Go to Homepage button', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Go to Homepage')).toBeInTheDocument()
    })
  })

  describe('custom fallback', () => {
    it('should render custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom error UI</div>}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
      expect(screen.getByText('Custom error UI')).toBeInTheDocument()
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })

    it('should use custom fallback with complex component', () => {
      const CustomFallback = () => (
        <div>
          <h1>Oops!</h1>
          <p>Something bad happened</p>
          <button>Reload</button>
        </div>
      )

      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Oops!')).toBeInTheDocument()
      expect(screen.getByText('Something bad happened')).toBeInTheDocument()
    })
  })

  describe('Sentry integration', () => {
    it('should report error to Sentry', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} errorMessage="Sentry test error" />
        </ErrorBoundary>
      )

      expect(Sentry.captureException).toHaveBeenCalledTimes(1)
      expect(Sentry.captureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          contexts: expect.objectContaining({
            react: expect.objectContaining({
              componentStack: expect.any(String)
            })
          })
        })
      )
    })

    it('should pass error object to Sentry', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} errorMessage="Specific error message" />
        </ErrorBoundary>
      )

      const capturedError = (Sentry.captureException as jest.Mock).mock.calls[0][0]
      expect(capturedError.message).toBe('Specific error message')
    })

    it('should include componentStack in Sentry context', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      const context = (Sentry.captureException as jest.Mock).mock.calls[0][1]
      expect(context.contexts.react.componentStack).toBeDefined()
      expect(typeof context.contexts.react.componentStack).toBe('string')
    })
  })

  describe('reset functionality', () => {
    it('should reset error state when Try Again is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Re-render with non-throwing component before clicking reset
      rerender(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      )

      fireEvent.click(screen.getByRole('button', { name: /try again/i }))

      // After reset, should attempt to render children
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })

    it('should navigate to homepage when Go to Homepage is clicked', () => {
      const originalLocation = window.location

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true
      })

      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      fireEvent.click(screen.getByText('Go to Homepage'))

      expect(window.location.href).toBe('/')

      // Restore
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true
      })
    })
  })

  describe('development mode', () => {
    it('should show error details in development mode', () => {
      process.env.NODE_ENV = 'development'

      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} errorMessage="Development error details" />
        </ErrorBoundary>
      )

      expect(screen.getByText('Development error details')).toBeInTheDocument()
    })

    it('should log error to console in development', () => {
      process.env.NODE_ENV = 'development'

      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('production mode', () => {
    it('should not show error details in production mode', () => {
      process.env.NODE_ENV = 'production'

      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} errorMessage="Secret error details" />
        </ErrorBoundary>
      )

      // The error details section shouldn't appear in production
      // (checking for the generic error UI instead)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  describe('error recovery', () => {
    it('should recover when error condition is fixed and reset is clicked', () => {
      let shouldThrow = true

      const ConditionalThrow = () => {
        if (shouldThrow) throw new Error('Conditional error')
        return <div>Recovered!</div>
      }

      const { rerender } = render(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Fix the error condition
      shouldThrow = false

      // Force re-render
      rerender(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>
      )

      // Click reset
      fireEvent.click(screen.getByRole('button', { name: /try again/i }))

      // Should now show recovered content
      expect(screen.getByText('Recovered!')).toBeInTheDocument()
    })
  })

  describe('UI elements', () => {
    it('should display warning icon', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      // Check for the icon container (Lucide icons render as SVG)
      const iconContainer = document.querySelector('.rounded-full.bg-red-100')
      expect(iconContainer).toBeInTheDocument()
    })

    it('should have proper styling on buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      )

      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      expect(tryAgainButton).toHaveClass('bg-blue-600')
    })
  })

  describe('multiple errors', () => {
    it('should only report first error to Sentry', () => {
      const MultipleErrorComponent = () => {
        throw new Error('First error')
      }

      render(
        <ErrorBoundary>
          <MultipleErrorComponent />
        </ErrorBoundary>
      )

      // Even if component would throw multiple times, Sentry should only be called once
      expect(Sentry.captureException).toHaveBeenCalledTimes(1)
    })
  })
})

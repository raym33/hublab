'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

/**
 * Global Error Boundary for Next.js App Router
 *
 * Catches all unhandled errors in the application.
 * Automatically reports to Sentry if configured.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error caught:', error)
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
                <p className="font-mono text-red-600 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="font-mono text-gray-500 text-xs mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Production Error ID */}
            {process.env.NODE_ENV === 'production' && error.digest && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 text-center">
                  Error ID: <span className="font-mono font-semibold">{error.digest}</span>
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Please include this ID if you contact support
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => reset()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>

            {/* Support Link */}
            <div className="mt-6 text-center">
              <a
                href="https://github.com/raym33/hublab/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Report this issue →
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

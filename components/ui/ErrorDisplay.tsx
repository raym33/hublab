import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
  showHomeButton?: boolean
}

export default function ErrorDisplay({
  title = 'Oops! Something went wrong',
  message,
  onRetry,
  showHomeButton = true,
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md">{message}</p>

      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {showHomeButton && (
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        )}
      </div>
    </div>
  )
}

// Variante de página completa
export function ErrorPage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again later.',
  onRetry,
}: Omit<ErrorDisplayProps, 'showHomeButton'>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <ErrorDisplay
        title={title}
        message={message}
        onRetry={onRetry}
        showHomeButton={true}
      />
    </div>
  )
}

// Variante inline
export function ErrorInline({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

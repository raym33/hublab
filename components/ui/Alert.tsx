/**
 * Alert Component
 * Contextual feedback messages with icons and actions
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  message: string
  onClose?: () => void
  showIcon?: boolean
  className?: string
}

const Alert = ({
  variant = 'info',
  title,
  message,
  onClose,
  showIcon = true,
  className
}: AlertProps) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      icon: 'text-blue-600',
      title: 'text-blue-900 dark:text-blue-300',
      message: 'text-blue-800 dark:text-blue-400'
    },
    success: {
      container: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      icon: 'text-green-600',
      title: 'text-green-900 dark:text-green-300',
      message: 'text-green-800 dark:text-green-400'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
      icon: 'text-yellow-600',
      title: 'text-yellow-900 dark:text-yellow-300',
      message: 'text-yellow-800 dark:text-yellow-400'
    },
    danger: {
      container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
      icon: 'text-red-600',
      title: 'text-red-900 dark:text-red-300',
      message: 'text-red-800 dark:text-red-400'
    }
  }

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    danger: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 border rounded-lg',
        variants[variant].container,
        className
      )}
      role="alert"
    >
      {showIcon && (
        <div className={cn('flex-shrink-0', variants[variant].icon)}>
          {icons[variant]}
        </div>
      )}

      <div className="flex-1">
        {title && (
          <h4 className={cn('font-semibold mb-1', variants[variant].title)}>
            {title}
          </h4>
        )}
        <p className={cn('text-sm', variants[variant].message)}>
          {message}
        </p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'flex-shrink-0 hover:opacity-70 transition-opacity',
            variants[variant].icon
          )}
          aria-label="Close alert"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Alert

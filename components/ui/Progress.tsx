/**
 * Progress Component
 * Linear and circular progress indicators
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressProps {
  value: number // 0-100
  max?: number
  variant?: 'linear' | 'circular'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
  indeterminate?: boolean
  className?: string
}

const Progress = ({
  value,
  max = 100,
  variant = 'linear',
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  indeterminate = false,
  className
}: ProgressProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const colors = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  }

  const sizes = {
    linear: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    },
    circular: {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-24 h-24'
    }
  }

  if (variant === 'circular') {
    const circleSize = size === 'sm' ? 48 : size === 'md' ? 64 : 96
    const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8
    const radius = (circleSize - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg
          className={cn(sizes.circular[size], 'transform -rotate-90')}
          viewBox={`0 0 ${circleSize} ${circleSize}`}
        >
          {/* Background circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Progress circle */}
          {indeterminate ? (
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference * 0.25} ${circumference}`}
              className={cn('animate-spin', colors[color].replace('bg-', 'text-'))}
            />
          ) : (
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn(
                'transition-all duration-300',
                colors[color].replace('bg-', 'text-')
              )}
            />
          )}
        </svg>

        {/* Center label */}
        {showLabel && !indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {label || `${Math.round(percentage)}%`}
            </span>
          </div>
        )}
      </div>
    )
  }

  // Linear progress
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {!indeterminate && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizes.linear[size]
        )}
      >
        {indeterminate ? (
          <div
            className={cn(
              'h-full rounded-full animate-pulse',
              colors[color]
            )}
            style={{ width: '40%' }}
          />
        ) : (
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              colors[color]
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        )}
      </div>
    </div>
  )
}

export default Progress

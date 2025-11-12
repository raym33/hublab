/**
 * StatCard Component
 * Dashboard statistics card with trend indicator
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

const StatCard = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  className
}: StatCardProps) => {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  const variants = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    primary: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border p-6 shadow-sm',
        'transition-all duration-200 hover:shadow-md',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </h3>

          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive && (
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              )}
              {isNegative && (
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-green-600',
                  isNegative && 'text-red-600',
                  !isPositive && !isNegative && 'text-gray-600'
                )}
              >
                {change > 0 && '+'}{change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-500">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className="flex-shrink-0 text-gray-400 dark:text-gray-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard

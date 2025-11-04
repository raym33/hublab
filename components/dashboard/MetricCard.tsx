/**
 * MetricCard Component
 * Display key metrics with sparkline
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: number[] // Array of values for sparkline
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  trend,
  icon,
  variant = 'default',
  className
}: MetricCardProps) => {
  const variants = {
    default: 'border-gray-200 dark:border-gray-700',
    primary: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10',
    success: 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10',
    warning: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10',
    danger: 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
  }

  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  const renderSparkline = () => {
    if (!trend || trend.length < 2) return null

    const max = Math.max(...trend)
    const min = Math.min(...trend)
    const range = max - min || 1

    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg className="w-full h-12 mt-4" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className={cn(
            isPositive && 'text-green-500',
            isNegative && 'text-red-500',
            !isPositive && !isNegative && 'text-blue-500'
          )}
        />
      </svg>
    )
  }

  return (
    <div
      className={cn(
        'relative bg-white dark:bg-gray-800 rounded-lg border-2 p-6',
        'transition-all duration-200 hover:shadow-md',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </h3>
        </div>

        {icon && (
          <div className="flex-shrink-0 text-gray-400 dark:text-gray-600">
            {icon}
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-sm font-medium',
              isPositive && 'text-green-600 dark:text-green-400',
              isNegative && 'text-red-600 dark:text-red-400',
              !isPositive && !isNegative && 'text-gray-600 dark:text-gray-400'
            )}
          >
            {isPositive && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {isNegative && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {change > 0 && '+'}{change}%
          </span>
          {changeLabel && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {changeLabel}
            </span>
          )}
        </div>
      )}

      {renderSparkline()}
    </div>
  )
}

export default MetricCard

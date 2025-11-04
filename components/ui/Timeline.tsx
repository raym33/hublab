/**
 * Timeline Component
 * Vertical timeline for events or steps
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface TimelineItem {
  title: string
  description?: string
  timestamp?: string
  icon?: React.ReactNode
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

export interface TimelineProps {
  items: TimelineItem[]
  variant?: 'default' | 'alternating'
  className?: string
}

const Timeline = ({
  items,
  variant = 'default',
  className
}: TimelineProps) => {
  const colors = {
    default: 'bg-gray-400 dark:bg-gray-600',
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  }

  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const isAlternating = variant === 'alternating'
        const isRight = isAlternating && index % 2 === 1

        return (
          <div
            key={index}
            className={cn(
              'relative pb-8',
              isLast && 'pb-0',
              isAlternating && 'flex',
              isRight && 'flex-row-reverse'
            )}
          >
            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute top-0 w-0.5 h-full bg-gray-300 dark:bg-gray-700',
                  isAlternating ? 'left-1/2 -translate-x-1/2' : 'left-4'
                )}
              />
            )}

            {/* Timeline Point */}
            <div
              className={cn(
                'absolute z-10 flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white dark:ring-gray-900',
                colors[item.color || 'default'],
                isAlternating ? 'left-1/2 -translate-x-1/2' : 'left-0'
              )}
            >
              {item.icon || (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>

            {/* Content */}
            <div
              className={cn(
                isAlternating ? 'w-1/2 px-8' : 'ml-12',
                isRight && 'text-right'
              )}
            >
              {item.timestamp && (
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {item.timestamp}
                </time>
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Timeline

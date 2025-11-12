/**
 * Divider Component
 * Visual separator with optional label
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  labelPosition?: 'left' | 'center' | 'right'
  variant?: 'solid' | 'dashed' | 'dotted'
  className?: string
}

const Divider = ({
  orientation = 'horizontal',
  label,
  labelPosition = 'center',
  variant = 'solid',
  className
}: DividerProps) => {
  const variants = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'inline-block h-full border-l border-gray-300 dark:border-gray-600',
          variants[variant],
          className
        )}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (!label) {
    return (
      <hr
        className={cn(
          'border-t border-gray-300 dark:border-gray-600',
          variants[variant],
          className
        )}
        role="separator"
        aria-orientation="horizontal"
      />
    )
  }

  const positions = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  return (
    <div
      className={cn('flex items-center w-full', positions[labelPosition], className)}
      role="separator"
      aria-orientation="horizontal"
    >
      {labelPosition !== 'left' && (
        <div className={cn('flex-1 border-t border-gray-300 dark:border-gray-600', variants[variant])} />
      )}
      <span className="px-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {label}
      </span>
      {labelPosition !== 'right' && (
        <div className={cn('flex-1 border-t border-gray-300 dark:border-gray-600', variants[variant])} />
      )}
    </div>
  )
}

export default Divider

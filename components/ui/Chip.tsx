/**
 * Chip Component
 * Compact element for tags, labels, or filters
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ChipProps {
  label: string
  variant?: 'filled' | 'outlined' | 'soft'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  onDelete?: () => void
  onClick?: () => void
  disabled?: boolean
  className?: string
}

const Chip = ({
  label,
  variant = 'filled',
  color = 'default',
  size = 'md',
  icon,
  onDelete,
  onClick,
  disabled = false,
  className
}: ChipProps) => {
  const baseStyles = 'inline-flex items-center font-medium transition-all duration-200'

  const variants = {
    filled: {
      default: 'bg-gray-600 text-white hover:bg-gray-700',
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      info: 'bg-cyan-600 text-white hover:bg-cyan-700'
    },
    outlined: {
      default: 'border-2 border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
      primary: 'border-2 border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      success: 'border-2 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20',
      warning: 'border-2 border-yellow-600 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
      danger: 'border-2 border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
      info: 'border-2 border-cyan-600 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20'
    },
    soft: {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200',
      primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200',
      info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 hover:bg-cyan-200'
    }
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1 rounded-full',
    md: 'text-sm px-3 py-1 gap-1.5 rounded-full',
    lg: 'text-base px-4 py-1.5 gap-2 rounded-full'
  }

  const Component = onClick && !disabled ? 'button' : 'div'

  return (
    <Component
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant][color],
        sizes[size],
        onClick && !disabled && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {onDelete && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex-shrink-0 ml-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </Component>
  )
}

export default Chip

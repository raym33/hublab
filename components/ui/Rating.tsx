/**
 * Rating Component
 * Star rating input and display
 */

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface RatingProps {
  value?: number
  defaultValue?: number
  max?: number
  precision?: number
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  disabled?: boolean
  onChange?: (value: number) => void
  emptyIcon?: React.ReactNode
  filledIcon?: React.ReactNode
  halfIcon?: React.ReactNode
  className?: string
}

const Rating = ({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  precision = 1,
  size = 'md',
  readOnly = false,
  disabled = false,
  onChange,
  emptyIcon,
  filledIcon,
  halfIcon,
  className
}: RatingProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const handleClick = (newValue: number) => {
    if (readOnly || disabled) return

    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleMouseMove = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (readOnly || disabled) return

    if (precision === 0.5) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const isHalf = x < rect.width / 2
      setHoverValue(index + (isHalf ? 0.5 : 1))
    } else {
      setHoverValue(index + 1)
    }
  }

  const handleMouseLeave = () => {
    setHoverValue(null)
  }

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const displayValue = hoverValue !== null ? hoverValue : currentValue

  const getStarIcon = (index: number) => {
    const value = index + 1
    const isFilled = displayValue >= value
    const isHalf = precision === 0.5 && displayValue >= value - 0.5 && displayValue < value

    if (isFilled && filledIcon) return filledIcon
    if (isHalf && halfIcon) return halfIcon
    if (!isFilled && emptyIcon) return emptyIcon

    // Default star icons
    if (isFilled) {
      return (
        <svg className={sizes[size]} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      )
    }

    if (isHalf) {
      return (
        <svg className={sizes[size]} viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-${index}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#d1d5db" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-${index})`}
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      )
    }

    return (
      <svg className={sizes[size]} fill="#d1d5db" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1',
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(precision === 0.5 ?
            (hoverValue !== null ? hoverValue : index + 1) :
            index + 1
          )}
          onMouseMove={(e) => handleMouseMove(index, e)}
          disabled={disabled || readOnly}
          className={cn(
            'transition-colors text-yellow-400',
            !readOnly && !disabled && 'hover:scale-110 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed',
            readOnly && 'cursor-default'
          )}
          aria-label={`Rate ${index + 1} out of ${max}`}
        >
          {getStarIcon(index)}
        </button>
      ))}
    </div>
  )
}

export default Rating

/**
 * Slider Component
 * Range input slider with labels and custom styling
 */

'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  hint?: string
  showValue?: boolean
  marks?: { value: number; label: string }[]
  fullWidth?: boolean
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      hint,
      showValue = true,
      marks,
      fullWidth = false,
      className,
      id,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`
    const currentValue = value !== undefined ? value : defaultValue || min

    const percentage = ((Number(currentValue) - Number(min)) / (Number(max) - Number(min))) * 100

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {/* Label and Value */}
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={sliderId}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {currentValue}
              </span>
            )}
          </div>
        )}

        {/* Slider */}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            id={sliderId}
            min={min}
            max={max}
            step={step}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              'w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-blue-600',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-all',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-moz-range-thumb]:w-5',
              '[&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-blue-600',
              '[&::-moz-range-thumb]:border-0',
              '[&::-moz-range-thumb]:cursor-pointer',
              '[&::-moz-range-thumb]:transition-all',
              '[&::-moz-range-thumb]:hover:scale-110',
              className
            )}
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            }}
            {...props}
          />
        </div>

        {/* Marks */}
        {marks && marks.length > 0 && (
          <div className="relative flex justify-between px-1">
            {marks.map((mark, index) => {
              const markPercentage = ((mark.value - Number(min)) / (Number(max) - Number(min))) * 100
              return (
                <div
                  key={`${mark.value}-${index}`}
                  className="absolute text-xs text-gray-500 dark:text-gray-400"
                  style={{ left: `${markPercentage}%`, transform: 'translateX(-50%)' }}
                >
                  {mark.label}
                </div>
              )
            })}
          </div>
        )}

        {/* Hint */}
        {hint && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export default Slider

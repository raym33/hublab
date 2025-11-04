/**
 * Radio Component
 * Radio button group for single selection
 */

'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  options: RadioOption[]
  error?: string
  hint?: string
  orientation?: 'vertical' | 'horizontal'
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      options,
      error,
      hint,
      orientation = 'vertical',
      name,
      className,
      ...props
    },
    ref
  ) => {
    const radioName = name || `radio-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div
          className={cn(
            'flex gap-4',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
          )}
        >
          {options.map((option, index) => {
            const optionId = `${radioName}-${option.value}`
            const isDisabled = option.disabled || props.disabled

            return (
              <label
                key={optionId}
                htmlFor={optionId}
                className={cn(
                  'flex items-start gap-2 cursor-pointer',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <input
                  ref={index === 0 ? ref : undefined}
                  type="radio"
                  id={optionId}
                  name={radioName}
                  value={option.value}
                  disabled={isDisabled}
                  className={cn(
                    'mt-0.5 h-4 w-4 border-gray-300 text-blue-600',
                    'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                  {...props}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </span>
                  )}
                </div>
              </label>
            )
          })}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio

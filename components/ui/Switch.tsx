/**
 * Switch Component
 * Toggle switch with label and description
 */

'use client'

import React, { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      size = 'md',
      className,
      id,
      defaultChecked,
      checked: controlledChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false)
    const isControlled = controlledChecked !== undefined
    const checked = isControlled ? controlledChecked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked)
      }
      onChange?.(e)
    }

    const sizes = {
      sm: {
        switch: 'w-9 h-5',
        thumb: 'w-4 h-4',
        translate: checked ? 'translate-x-4' : 'translate-x-0'
      },
      md: {
        switch: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: checked ? 'translate-x-5' : 'translate-x-0'
      },
      lg: {
        switch: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: checked ? 'translate-x-7' : 'translate-x-0'
      }
    }

    return (
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => {
            const input = document.getElementById(switchId) as HTMLInputElement
            input?.click()
          }}
          className={cn(
            'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
            sizes[size].switch,
            className
          )}
          disabled={props.disabled}
        >
          <span
            className={cn(
              'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              sizes[size].thumb,
              sizes[size].translate
            )}
          />
        </button>

        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={handleChange}
          className="sr-only"
          aria-describedby={description ? `${switchId}-description` : undefined}
          {...props}
        />

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={switchId}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${switchId}-description`}
                className="text-sm text-gray-500 dark:text-gray-400 mt-0.5"
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch

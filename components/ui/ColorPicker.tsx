/**
 * ColorPicker Component
 * Color selection input with swatches
 */

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (color: string) => void
  presetColors?: string[]
  showInput?: boolean
  disabled?: boolean
  className?: string
}

const ColorPicker = ({
  value: controlledValue,
  defaultValue = '#000000',
  onChange,
  presetColors = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
  ],
  showInput = true,
  disabled = false,
  className
}: ColorPickerProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const handleColorChange = (color: string) => {
    if (disabled) return

    if (!isControlled) {
      setInternalValue(color)
    }
    onChange?.(color)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleColorChange(e.target.value)
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <div className="flex items-center gap-2">
        {/* Color Preview Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600',
            'transition-all duration-200 shadow-sm',
            !disabled && 'hover:scale-110 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ backgroundColor: currentValue }}
          aria-label="Select color"
        />

        {/* Hex Input */}
        {showInput && (
          <input
            type="text"
            value={currentValue}
            onChange={handleInputChange}
            disabled={disabled}
            placeholder="#000000"
            className={cn(
              'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
              'text-sm font-mono uppercase',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            maxLength={7}
          />
        )}
      </div>

      {/* Color Picker Popover */}
      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Native Color Input */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Color
              </label>
              <input
                type="color"
                value={currentValue}
                onChange={handleInputChange}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>

            {/* Preset Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Presets
              </label>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      handleColorChange(color)
                      setIsOpen(false)
                    }}
                    className={cn(
                      'w-8 h-8 rounded-md border-2 transition-all',
                      'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500',
                      currentValue === color
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ColorPicker

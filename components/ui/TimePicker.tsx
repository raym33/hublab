/**
 * TimePicker Component
 * Time selection with hours and minutes
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface TimePickerProps {
  value?: string // Format: "HH:MM" (24-hour)
  onChange?: (time: string) => void
  format?: '12' | '24'
  minuteStep?: number
  disabled?: boolean
  placeholder?: string
  className?: string
}

const TimePicker = ({
  value = '',
  onChange,
  format = '12',
  minuteStep = 1,
  disabled = false,
  placeholder = 'Select time',
  className
}: TimePickerProps) => {
  const [showPicker, setShowPicker] = useState(false)
  const [hours, setHours] = useState('12')
  const [minutes, setMinutes] = useState('00')
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      const hour = parseInt(h)

      if (format === '12') {
        if (hour === 0) {
          setHours('12')
          setPeriod('AM')
        } else if (hour === 12) {
          setHours('12')
          setPeriod('PM')
        } else if (hour > 12) {
          setHours((hour - 12).toString().padStart(2, '0'))
          setPeriod('PM')
        } else {
          setHours(hour.toString().padStart(2, '0'))
          setPeriod('AM')
        }
      } else {
        setHours(h)
      }

      setMinutes(m)
    }
  }, [value, format])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = () => {
    if (!hours || !minutes) return ''

    if (format === '12') {
      return `${hours}:${minutes} ${period}`
    }
    return `${hours}:${minutes}`
  }

  const handleApply = () => {
    let hour24 = parseInt(hours)

    if (format === '12') {
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0
      }
    }

    const timeString = `${hour24.toString().padStart(2, '0')}:${minutes}`
    onChange?.(timeString)
    setShowPicker(false)
  }

  const handleHourChange = (newHour: string) => {
    const hour = parseInt(newHour)
    const maxHour = format === '12' ? 12 : 23

    if (hour >= 0 && hour <= maxHour) {
      setHours(newHour.padStart(2, '0'))
    }
  }

  const handleMinuteChange = (newMinute: string) => {
    const minute = parseInt(newMinute)

    if (minute >= 0 && minute <= 59) {
      setMinutes(newMinute.padStart(2, '0'))
    }
  }

  const incrementHours = () => {
    const maxHour = format === '12' ? 12 : 23
    const minHour = format === '12' ? 1 : 0
    let newHour = parseInt(hours) + 1

    if (newHour > maxHour) {
      newHour = minHour
    }

    setHours(newHour.toString().padStart(2, '0'))
  }

  const decrementHours = () => {
    const maxHour = format === '12' ? 12 : 23
    const minHour = format === '12' ? 1 : 0
    let newHour = parseInt(hours) - 1

    if (newHour < minHour) {
      newHour = maxHour
    }

    setHours(newHour.toString().padStart(2, '0'))
  }

  const incrementMinutes = () => {
    let newMinute = parseInt(minutes) + minuteStep

    if (newMinute >= 60) {
      newMinute = 0
    }

    setMinutes(newMinute.toString().padStart(2, '0'))
  }

  const decrementMinutes = () => {
    let newMinute = parseInt(minutes) - minuteStep

    if (newMinute < 0) {
      newMinute = 59
    }

    setMinutes(newMinute.toString().padStart(2, '0'))
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setShowPicker(!showPicker)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-2 border rounded-lg text-left',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'dark:bg-gray-900 dark:border-gray-700',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-between'
        )}
      >
        <span className={cn(!value && 'text-gray-400')}>
          {formatTime() || placeholder}
        </span>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {showPicker && (
        <div
          className={cn(
            'absolute z-50 mt-1 p-4',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg'
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={incrementHours}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <input
                type="text"
                value={hours}
                onChange={(e) => handleHourChange(e.target.value)}
                className={cn(
                  'w-14 text-center text-2xl font-semibold',
                  'bg-transparent border-none outline-none',
                  'text-gray-900 dark:text-gray-100'
                )}
                maxLength={2}
              />
              <button
                type="button"
                onClick={decrementHours}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={incrementMinutes}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <input
                type="text"
                value={minutes}
                onChange={(e) => handleMinuteChange(e.target.value)}
                className={cn(
                  'w-14 text-center text-2xl font-semibold',
                  'bg-transparent border-none outline-none',
                  'text-gray-900 dark:text-gray-100'
                )}
                maxLength={2}
              />
              <button
                type="button"
                onClick={decrementMinutes}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* AM/PM Toggle */}
            {format === '12' && (
              <div className="flex flex-col gap-1 ml-2">
                <button
                  type="button"
                  onClick={() => setPeriod('AM')}
                  className={cn(
                    'px-3 py-1 text-sm rounded',
                    period === 'AM'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('PM')}
                  className={cn(
                    'px-3 py-1 text-sm rounded',
                    period === 'PM'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  )}
                >
                  PM
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

export default TimePicker

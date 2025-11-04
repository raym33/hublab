/**
 * DatePicker Component
 * Calendar-based date selection
 */

'use client'

import React, { useState, useRef, useEffect, useId, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  placeholder?: string
  error?: string
  required?: boolean
  label?: string
  name?: string
  id?: string
  className?: string
}

const DatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select date',
  error,
  required = false,
  label,
  name,
  id,
  className
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)
  const [currentMonth, setCurrentMonth] = useState(value || new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [focusedDate, setFocusedDate] = useState<number | null>(null)
  const [announceMessage, setAnnounceMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Generate unique IDs using React's useId for SSR safety
  const generatedId = useId()
  const componentId = id || `datepicker-${generatedId}`
  const dialogId = `${componentId}-dialog`
  const gridId = `${componentId}-grid`
  const errorId = `${componentId}-error`
  const labelId = `${componentId}-label`
  const liveRegionId = `${componentId}-live`

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
        setFocusedDate(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-focus first selected or today's date when calendar opens
  useEffect(() => {
    if (showCalendar) {
      const dateToFocus = selectedDate ? selectedDate.getDate() : new Date().getDate()
      setFocusedDate(dateToFocus)
      setAnnounceMessage(`Calendar opened. ${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`)
    } else {
      // Return focus to trigger button when calendar closes
      setTimeout(() => {
        triggerRef.current?.focus()
      }, 0)
    }
  }, [showCalendar])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const handleDateSelect = useCallback((day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )

    if (isDateDisabled(newDate)) return

    setSelectedDate(newDate)
    setShowCalendar(false)
    setFocusedDate(null)

    // Announce selection
    const formattedDate = newDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    setAnnounceMessage(`${formattedDate} selected`)

    onChange?.(newDate)
  }, [currentMonth, onChange])

  const handleKeyDown = (e: React.KeyboardEvent, day: number) => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        if (day < daysInMonth) {
          setFocusedDate(day + 1)
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (day > 1) {
          setFocusedDate(day - 1)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (day + 7 <= daysInMonth) {
          setFocusedDate(day + 7)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (day - 7 > 0) {
          setFocusedDate(day - 7)
        }
        break
      case 'Home':
        e.preventDefault()
        setFocusedDate(1)
        break
      case 'End':
        e.preventDefault()
        setFocusedDate(daysInMonth)
        break
      case 'PageDown':
        e.preventDefault()
        if (e.shiftKey) {
          // Next year
          setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth()))
        } else {
          // Next month
          nextMonth()
        }
        break
      case 'PageUp':
        e.preventDefault()
        if (e.shiftKey) {
          // Previous year
          setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth()))
        } else {
          // Previous month
          previousMonth()
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        handleDateSelect(day)
        break
      case 'Escape':
        e.preventDefault()
        setShowCalendar(false)
        setFocusedDate(null)
        break
    }
  }

  const previousMonth = useCallback(() => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    setCurrentMonth(newMonth)
    setAnnounceMessage(`${newMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`)
    setFocusedDate(1) // Focus first day of new month
  }, [currentMonth])

  const nextMonth = useCallback(() => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    setCurrentMonth(newMonth)
    setAnnounceMessage(`${newMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`)
    setFocusedDate(1) // Focus first day of new month
  }, [currentMonth])

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days: (number | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return (
      <div
        ref={gridRef}
        id={gridId}
        role="grid"
        aria-labelledby={labelId}
        className="grid grid-cols-7 gap-1"
      >
        <div role="row" className="contents">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
            <div
              key={day}
              role="columnheader"
              aria-label={day}
              className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
            >
              {day.substring(0, 2)}
            </div>
          ))}
        </div>
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} role="gridcell" />
          }

          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          )
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const isToday = isSameDay(date, new Date())
          const isDisabled = isDateDisabled(date)
          const isFocused = focusedDate === day

          return (
            <div key={day} role="gridcell">
              <button
                type="button"
                onClick={() => handleDateSelect(day)}
                onKeyDown={(e) => handleKeyDown(e, day)}
                disabled={isDisabled}
                tabIndex={isSelected || (isFocused && !isDisabled) ? 0 : -1}
                aria-selected={isSelected}
                aria-label={`${currentMonth.toLocaleDateString('en-US', { month: 'long' })} ${day}, ${currentMonth.getFullYear()}${isToday ? ', today' : ''}${isDisabled ? ', not available' : ''}`}
                className={cn(
                  'w-8 h-8 rounded-full text-sm transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  'disabled:opacity-30 disabled:cursor-not-allowed',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isSelected &&
                    'bg-blue-600 text-white hover:bg-blue-700',
                  isToday &&
                    !isSelected &&
                    'border border-blue-600 dark:border-blue-400',
                  !isSelected &&
                    !isDisabled &&
                    'text-gray-900 dark:text-gray-100'
                )}
              >
                {day}
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label
          id={labelId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-600 ml-1" aria-label="required">*</span>}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        id={componentId}
        onClick={() => !disabled && setShowCalendar(!showCalendar)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={showCalendar}
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'w-full px-4 py-2 border rounded-lg text-left',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'dark:bg-gray-900 dark:border-gray-700',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-between',
          error && 'border-red-500 focus:ring-red-500'
        )}
      >
        <span className={cn(!selectedDate && 'text-gray-400')}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {showCalendar && (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? 'Choose date' : undefined}
          className={cn(
            'absolute z-50 mt-1 p-4',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={previousMonth}
              aria-label="Previous month"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {currentMonth.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </div>

            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {renderCalendar()}
        </div>
      )}

      {/* Live region for screen reader announcements */}
      <div
        id={liveRegionId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announceMessage}
      </div>
    </div>
  )
}

export default DatePicker

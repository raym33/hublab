/**
 * AutoComplete Component
 * Search input with suggestions dropdown
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface AutoCompleteOption {
  value: string
  label: string
  description?: string
}

export interface AutoCompleteProps {
  options: AutoCompleteOption[]
  value?: string
  onChange?: (value: string) => void
  onSelect?: (option: AutoCompleteOption) => void
  placeholder?: string
  disabled?: boolean
  maxSuggestions?: number
  caseSensitive?: boolean
  error?: string
  required?: boolean
  label?: string
  name?: string
  id?: string
  className?: string
}

const AutoComplete = ({
  options,
  value = '',
  onChange,
  onSelect,
  placeholder = 'Search...',
  disabled = false,
  maxSuggestions = 5,
  caseSensitive = false,
  error,
  required = false,
  label,
  name,
  id,
  className
}: AutoCompleteProps) => {
  const [inputValue, setInputValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Generate unique IDs
  const componentId = id || `autocomplete-${Math.random().toString(36).substr(2, 9)}`
  const listboxId = `${componentId}-listbox`
  const errorId = `${componentId}-error`
  const labelId = `${componentId}-label`

  const filteredOptions = options
    .filter(option => {
      const searchValue = caseSensitive ? inputValue : inputValue.toLowerCase()
      const optionLabel = caseSensitive ? option.label : option.label.toLowerCase()
      const optionValue = caseSensitive ? option.value : option.value.toLowerCase()

      return optionLabel.includes(searchValue) || optionValue.includes(searchValue)
    })
    .slice(0, maxSuggestions)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        listRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !listRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setShowSuggestions(true)
    setHighlightedIndex(-1)
    onChange?.(newValue)
  }

  const handleOptionClick = (option: AutoCompleteOption) => {
    setInputValue(option.label)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    onChange?.(option.value)
    onSelect?.(option)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredOptions.length === 0) {
      if (e.key === 'ArrowDown') {
        setShowSuggestions(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => {
          const newIndex = prev < filteredOptions.length - 1 ? prev + 1 : prev
          // Scroll option into view
          if (optionRefs.current[newIndex]) {
            optionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' })
          }
          return newIndex
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : -1
          // Scroll option into view
          if (newIndex >= 0 && optionRefs.current[newIndex]) {
            optionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' })
          }
          return newIndex
        })
        break
      case 'Home':
        e.preventDefault()
        setHighlightedIndex(0)
        optionRefs.current[0]?.scrollIntoView({ block: 'nearest' })
        break
      case 'End':
        e.preventDefault()
        setHighlightedIndex(filteredOptions.length - 1)
        optionRefs.current[filteredOptions.length - 1]?.scrollIntoView({ block: 'nearest' })
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        setHighlightedIndex(-1)
        break
    }
  }

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label
          id={labelId}
          htmlFor={componentId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-600 ml-1" aria-label="required">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        id={componentId}
        name={name}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-4 py-2 border rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'dark:bg-gray-900 dark:border-gray-700',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500'
        )}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={showSuggestions && filteredOptions.length > 0}
        aria-activedescendant={
          highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
        }
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        aria-labelledby={label ? labelId : undefined}
      />

      {showSuggestions && filteredOptions.length > 0 && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label ? `${label} suggestions` : 'Suggestions'}
          className={cn(
            'absolute z-50 w-full mt-1 max-h-60 overflow-auto',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg'
          )}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={option.value}
              ref={el => { optionRefs.current[index] = el }}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              aria-label={option.description ? `${option.label}, ${option.description}` : option.label}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                'px-4 py-2 cursor-pointer',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                index === highlightedIndex && 'bg-gray-100 dark:bg-gray-700'
              )}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {showSuggestions && inputValue && filteredOptions.length === 0 && (
        <div
          className={cn(
            'absolute z-50 w-full mt-1 px-4 py-3',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg',
            'text-gray-500 dark:text-gray-400 text-sm'
          )}
        >
          No results found
        </div>
      )}
    </div>
  )
}

export default AutoComplete

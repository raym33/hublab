/**
 * SearchBar Component
 * Search input with filters and suggestions
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface SearchFilter {
  id: string
  label: string
  icon?: React.ReactNode
}

export interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string, filters: string[]) => void
  placeholder?: string
  filters?: SearchFilter[]
  activeFilters?: string[]
  onFilterChange?: (filters: string[]) => void
  suggestions?: string[]
  showFilters?: boolean
  className?: string
}

const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  filters = [],
  activeFilters = [],
  onFilterChange,
  suggestions = [],
  showFilters = true,
  className
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(activeFilters)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    setSelectedFilters(activeFilters)
  }, [activeFilters])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setShowFilterMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setShowSuggestions(true)
    onChange?.(newValue)
  }

  const handleSearch = (searchValue?: string) => {
    const valueToSearch = searchValue ?? inputValue
    setShowSuggestions(false)
    onSearch?.(valueToSearch, selectedFilters)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setShowFilterMenu(false)
    }
  }

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId]

    setSelectedFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    setSelectedFilters([])
    onFilterChange?.([])
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-2 border rounded-lg',
          'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700',
          'focus-within:ring-2 focus-within:ring-blue-500'
        )}
      >
        {/* Search Icon */}
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          placeholder={placeholder}
          className={cn(
            'flex-1 bg-transparent border-none outline-none',
            'text-gray-900 dark:text-gray-100',
            'placeholder-gray-400'
          )}
        />

        {/* Active Filters Count */}
        {selectedFilters.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
              {selectedFilters.length}
            </span>
          </div>
        )}

        {/* Filter Button */}
        {showFilters && filters.length > 0 && (
          <button
            type="button"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={cn(
              'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors flex-shrink-0',
              showFilterMenu && 'bg-gray-100 dark:bg-gray-800'
            )}
            aria-label="Toggle filters"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          type="button"
          onClick={() => handleSearch()}
          className={cn(
            'px-3 py-1 bg-blue-600 text-white rounded-lg',
            'hover:bg-blue-700 transition-colors',
            'font-semibold text-sm flex-shrink-0'
          )}
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && inputValue && (
        <div
          className={cn(
            'absolute z-50 w-full mt-1 max-h-60 overflow-auto',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg'
          )}
        >
          {suggestions
            .filter(suggestion =>
              suggestion.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((suggestion, index) => (
              <div
                key={index}
                onClick={() => {
                  setInputValue(suggestion)
                  handleSearch(suggestion)
                }}
                className={cn(
                  'px-4 py-2 cursor-pointer',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  'text-gray-900 dark:text-gray-100'
                )}
              >
                {suggestion}
              </div>
            ))}
        </div>
      )}

      {/* Filters Menu */}
      {showFilterMenu && (
        <div
          className={cn(
            'absolute z-50 right-0 mt-1 w-64 p-3',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            {selectedFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filters.map(filter => (
              <label
                key={filter.id}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  'transition-colors'
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.id)}
                  onChange={() => toggleFilter(filter.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                {filter.icon && (
                  <span className="w-5 h-5 text-gray-600 dark:text-gray-400">
                    {filter.icon}
                  </span>
                )}
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {filter.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar

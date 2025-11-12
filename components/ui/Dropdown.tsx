/**
 * Dropdown Component
 * Menu dropdown with items and actions
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface DropdownItem {
  label: string
  value: string
  icon?: React.ReactNode
  disabled?: boolean
  destructive?: boolean
  onClick?: () => void
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  position?: 'left' | 'right'
  className?: string
}

const Dropdown = ({
  trigger,
  items,
  position = 'left',
  className
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick?.()
      setIsOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800 shadow-lg',
            'animate-in fade-in-0 zoom-in-95 duration-100',
            position === 'left' ? 'left-0' : 'right-0'
          )}
          role="menu"
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={`${item.value}-${index}`}
                type="button"
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  'flex w-full items-center gap-2 px-4 py-2 text-sm text-left',
                  'transition-colors duration-150',
                  item.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : item.destructive
                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                  'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700'
                )}
                role="menuitem"
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown

/**
 * Menu Component
 * Navigation menu with nested items
 */

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface MenuItem {
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  items?: MenuItem[]
  badge?: string | number
  disabled?: boolean
}

export interface MenuProps {
  items: MenuItem[]
  variant?: 'vertical' | 'horizontal'
  className?: string
}

const Menu = ({ items, variant = 'vertical', className }: MenuProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.items && item.items.length > 0
    const isExpanded = expandedItems.has(item.label)

    const handleClick = () => {
      if (hasChildren) {
        toggleExpanded(item.label)
      }
      if (item.onClick && !item.disabled) {
        item.onClick()
      }
    }

    const content = (
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
          'text-gray-700 dark:text-gray-300',
          !item.disabled && 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
          item.disabled && 'opacity-50 cursor-not-allowed',
          level > 0 && 'pl-8'
        )}
        style={{ paddingLeft: level > 0 ? `${(level + 1) * 1}rem` : undefined }}
      >
        {item.icon && (
          <span className="flex-shrink-0 w-5 h-5">
            {item.icon}
          </span>
        )}

        <span className="flex-1 font-medium">
          {item.label}
        </span>

        {item.badge && (
          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
            {item.badge}
          </span>
        )}

        {hasChildren && (
          <svg
            className={cn(
              'w-4 h-4 transition-transform flex-shrink-0',
              isExpanded && 'rotate-90'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    )

    return (
      <div key={item.label}>
        {item.href ? (
          <a
            href={item.href}
            onClick={handleClick}
            className={cn(item.disabled && 'pointer-events-none')}
          >
            {content}
          </a>
        ) : (
          <div onClick={handleClick}>
            {content}
          </div>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.items!.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'horizontal') {
    return (
      <nav className={cn('flex items-center gap-2', className)}>
        {items.map(item => {
          const content = (
            <div
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                'text-gray-700 dark:text-gray-300',
                !item.disabled && 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !item.disabled && item.onClick?.()}
            >
              {item.icon && (
                <span className="w-5 h-5">
                  {item.icon}
                </span>
              )}
              <span className="font-medium whitespace-nowrap">
                {item.label}
              </span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          )

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              className={cn(item.disabled && 'pointer-events-none')}
            >
              {content}
            </a>
          ) : (
            <div key={item.label}>
              {content}
            </div>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className={cn('space-y-1', className)}>
      {items.map(item => renderMenuItem(item))}
    </nav>
  )
}

export default Menu

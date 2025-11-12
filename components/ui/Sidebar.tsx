/**
 * Sidebar Component
 * Side navigation panel with collapse
 */

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface SidebarItem {
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  badge?: string | number
  active?: boolean
}

export interface SidebarProps {
  items: SidebarItem[]
  header?: React.ReactNode
  footer?: React.ReactNode
  collapsible?: boolean
  defaultCollapsed?: boolean
  position?: 'left' | 'right'
  width?: string
  className?: string
}

const Sidebar = ({
  items,
  header,
  footer,
  collapsible = true,
  defaultCollapsed = false,
  position = 'left',
  width = '16rem',
  className
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const renderItem = (item: SidebarItem) => {
    const content = (
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
          'text-gray-700 dark:text-gray-300',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'cursor-pointer group',
          item.active && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        )}
        onClick={item.onClick}
      >
        {item.icon && (
          <span className={cn(
            'flex-shrink-0 w-5 h-5',
            item.active && 'text-blue-600 dark:text-blue-400'
          )}>
            {item.icon}
          </span>
        )}

        {!collapsed && (
          <>
            <span className="flex-1 font-medium">
              {item.label}
            </span>

            {item.badge && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}

        {collapsed && item.badge && (
          <span className="absolute left-8 top-2 w-2 h-2 bg-blue-600 rounded-full" />
        )}
      </div>
    )

    return item.href ? (
      <a key={item.label} href={item.href}>
        {content}
      </a>
    ) : (
      <div key={item.label}>
        {content}
      </div>
    )
  }

  return (
    <aside
      className={cn(
        'h-screen bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        'flex flex-col transition-all duration-300',
        position === 'left' ? 'border-r' : 'border-l',
        className
      )}
      style={{ width: collapsed ? '4rem' : width }}
    >
      {/* Header */}
      {header && (
        <div className={cn(
          'flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800',
          collapsed && 'justify-center'
        )}>
          {!collapsed ? header : null}
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map(item => renderItem(item))}
      </nav>

      {/* Footer */}
      {footer && !collapsed && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          {footer}
        </div>
      )}

      {/* Collapse Toggle */}
      {collapsible && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={cn(
                'w-5 h-5 transition-transform',
                position === 'left' && !collapsed && 'rotate-180',
                position === 'right' && collapsed && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={position === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
              />
            </svg>
            {!collapsed && (
              <span className="text-sm font-medium">Collapse</span>
            )}
          </button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar

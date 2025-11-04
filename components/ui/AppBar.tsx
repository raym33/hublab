/**
 * AppBar Component
 * Top application bar with navigation
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface AppBarAction {
  label?: string
  icon: React.ReactNode
  onClick: () => void
  badge?: string | number
}

export interface AppBarProps {
  title?: string | React.ReactNode
  logo?: React.ReactNode
  actions?: AppBarAction[]
  children?: React.ReactNode
  position?: 'fixed' | 'sticky' | 'static'
  variant?: 'default' | 'transparent' | 'elevated'
  className?: string
}

const AppBar = ({
  title,
  logo,
  actions = [],
  children,
  position = 'sticky',
  variant = 'default',
  className
}: AppBarProps) => {
  const positions = {
    fixed: 'fixed top-0 left-0 right-0',
    sticky: 'sticky top-0',
    static: 'relative'
  }

  const variants = {
    default: 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
    transparent: 'bg-transparent',
    elevated: 'bg-white dark:bg-gray-900 shadow-md'
  }

  return (
    <header
      className={cn(
        'z-40 w-full',
        positions[position],
        variants[variant],
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center gap-4">
            {logo && (
              <div className="flex-shrink-0">
                {logo}
              </div>
            )}

            {title && (
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {title}
              </div>
            )}
          </div>

          {/* Center Section - Custom Content */}
          {children && (
            <div className="flex-1 flex items-center justify-center px-4">
              {children}
            </div>
          )}

          {/* Right Section - Actions */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 rounded-lg',
                    'text-gray-700 dark:text-gray-300',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'transition-colors'
                  )}
                  aria-label={action.label}
                >
                  <span className="w-5 h-5">
                    {action.icon}
                  </span>

                  {action.label && (
                    <span className="hidden sm:inline font-medium">
                      {action.label}
                    </span>
                  )}

                  {action.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full min-w-[1.25rem] text-center">
                      {action.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppBar

/**
 * Breadcrumb Component
 * Navigation breadcrumbs for hierarchical page structure
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  current?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

const Breadcrumb = ({
  items,
  separator = (
    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  className
}: BreadcrumbProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2', className)}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isCurrent = item.current || isLast

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <span className="mr-2 flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}

              {item.href && !isCurrent ? (
                <a
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium transition-colors',
                    'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  )}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium',
                    isCurrent
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb

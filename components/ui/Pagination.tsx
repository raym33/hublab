/**
 * Pagination Component
 * Page navigation with customizable page range
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  className?: string
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 7,
  showFirstLast = true,
  showPrevNext = true,
  className
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - 1, 1)
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, '...', totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      )
      return [1, '...', ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = [leftSiblingIndex, currentPage, rightSiblingIndex]
      return [1, '...', ...middleRange, '...', totalPages]
    }

    return pages
  }

  const pages = getPageNumbers()

  const PageButton = ({
    page,
    children,
    disabled = false,
    active = false
  }: {
    page?: number
    children: React.ReactNode
    disabled?: boolean
    active?: boolean
  }) => (
    <button
      type="button"
      onClick={() => page && onPageChange(page)}
      disabled={disabled}
      className={cn(
        'min-w-[40px] h-10 px-4 flex items-center justify-center',
        'text-sm font-medium transition-colors rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        active
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
        'border border-gray-300 dark:border-gray-600',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-gray-800'
      )}
    >
      {children}
    </button>
  )

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {/* First Page */}
      {showFirstLast && (
        <PageButton page={1} disabled={currentPage === 1}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </PageButton>
      )}

      {/* Previous Page */}
      {showPrevNext && (
        <PageButton page={currentPage - 1} disabled={currentPage === 1}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </PageButton>
      )}

      {/* Page Numbers */}
      {pages.map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="min-w-[40px] h-10 flex items-center justify-center text-gray-500"
          >
            ...
          </span>
        ) : (
          <PageButton
            key={`page-${page}`}
            page={page as number}
            active={currentPage === page}
          >
            {page}
          </PageButton>
        )
      )}

      {/* Next Page */}
      {showPrevNext && (
        <PageButton page={currentPage + 1} disabled={currentPage === totalPages}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PageButton>
      )}

      {/* Last Page */}
      {showFirstLast && (
        <PageButton page={totalPages} disabled={currentPage === totalPages}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </PageButton>
      )}
    </nav>
  )
}

export default Pagination

/**
 * Table Component
 * Data table with sorting and selection
 */

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => React.ReactNode
}

export interface TableProps {
  columns: Column[]
  data: any[]
  selectable?: boolean
  onSelectionChange?: (selectedRows: any[]) => void
  onRowClick?: (row: any) => void
  variant?: 'default' | 'striped' | 'bordered'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Table = ({
  columns,
  data,
  selectable = false,
  onSelectionChange,
  onRowClick,
  variant = 'default',
  size = 'md',
  className
}: TableProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key, direction })
  }

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((_, index) => index)))
      onSelectionChange?.(data)
    } else {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    }
  }

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelection = new Set(selectedRows)

    if (checked) {
      newSelection.add(index)
    } else {
      newSelection.delete(index)
    }

    setSelectedRows(newSelection)
    onSelectionChange?.(Array.from(newSelection).map(i => data[i]))
  }

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const paddings = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4'
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {selectable && (
              <th scope="col" className={cn('relative', paddings[size])}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{ width: column.width }}
                className={cn(
                  'font-semibold text-gray-900 dark:text-gray-100',
                  paddings[size],
                  sizes[size],
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {column.sortable && sortConfig?.key === column.key && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      {sortConfig.direction === 'asc' ? (
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      )}
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={cn(
            'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800',
            variant === 'striped' && '[&>tr:nth-child(even)]:bg-gray-50 dark:[&>tr:nth-child(even)]:bg-gray-800/50'
          )}
        >
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={cn(
                onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
                variant === 'bordered' && 'border-b border-gray-200 dark:border-gray-700'
              )}
            >
              {selectable && (
                <td className={paddings[size]}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowIndex)}
                    onChange={(e) => handleSelectRow(rowIndex, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'text-gray-900 dark:text-gray-100',
                    paddings[size],
                    sizes[size],
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {sortedData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      )}
    </div>
  )
}

export default Table

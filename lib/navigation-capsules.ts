/**
 * Navigation Capsules
 *
 * Cápsulas para navegación: breadcrumbs, pagination, tabs, steppers
 */

import { Capsule } from '@/types/capsule'

export const navigationCapsules: Capsule[] = [
  // 1. Breadcrumbs Navigation
  {
    id: 'breadcrumbs',
    name: 'Breadcrumbs Navigation',
    category: 'Navigation',
    description: 'Navegación breadcrumb con separadores y enlaces clickeables',
    tags: ['breadcrumb', 'navigation', 'path', 'links'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  separator?: React.ReactNode
  maxItems?: number
  className?: string
}

export default function Breadcrumbs({
  items,
  showHome = true,
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
  maxItems = 4,
  className = ''
}: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }, ...items]
    : items

  const displayItems = allItems.length > maxItems
    ? [
        ...allItems.slice(0, 1),
        { label: '...', href: undefined },
        ...allItems.slice(-2)
      ]
    : allItems

  return (
    <nav className={\`flex items-center space-x-2 text-sm \${className}\`} aria-label="Breadcrumb">
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1
        const isEllipsis = item.label === '...'

        return (
          <div key={index} className="flex items-center space-x-2">
            {item.href && !isLast && !isEllipsis ? (
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault()
                    item.onClick()
                  }
                }}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ) : (
              <span
                className={\`flex items-center gap-1 \${
                  isLast
                    ? 'text-gray-900 font-medium'
                    : isEllipsis
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }\`}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}

            {!isLast && <div className="flex-shrink-0">{separator}</div>}
          </div>
        )
      })}
    </nav>
  )
}`
  },

  // 2. Advanced Pagination
  {
    id: 'advanced-pagination',
    name: 'Advanced Pagination',
    category: 'Navigation',
    description: 'Paginación completa con números, flechas y saltos rápidos',
    tags: ['pagination', 'pages', 'navigation', 'table'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface AdvancedPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
  showJumpToPage?: boolean
  showItemsPerPage?: boolean
  onItemsPerPageChange?: (items: number) => void
  siblingCount?: number
}

export default function AdvancedPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems,
  showJumpToPage = true,
  showItemsPerPage = true,
  onItemsPerPageChange,
  siblingCount = 1
}: AdvancedPaginationProps) {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1)

    const showLeftEllipsis = leftSiblingIndex > 2
    const showRightEllipsis = rightSiblingIndex < totalPages - 1

    if (showLeftEllipsis) {
      pages.push('...')
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i)
    }

    if (showRightEllipsis) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
  }

  const pageNumbers = generatePageNumbers()

  const PageButton = ({ page, active = false, disabled = false, onClick }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`
        min-w-[40px] h-10 px-3 rounded-lg font-medium transition
        \${active
          ? 'bg-blue-600 text-white'
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100'
        }
      \`}
    >
      {page}
    </button>
  )

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Info */}
      {totalItems && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          title="First page"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          title="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 text-gray-400">...</span>
            ) : (
              <PageButton
                page={page}
                active={page === currentPage}
                onClick={() => onPageChange(page as number)}
              />
            )}
          </div>
        ))}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          title="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          title="Last page"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>

      {/* Items per page */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 25, 50, 100].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}`
  },

  // 3. Vertical Stepper
  {
    id: 'vertical-stepper',
    name: 'Vertical Stepper',
    category: 'Navigation',
    description: 'Stepper vertical para procesos multi-paso con estado y validación',
    tags: ['stepper', 'wizard', 'steps', 'process', 'vertical'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { Check, Circle, AlertCircle } from 'lucide-react'

interface Step {
  id: string
  label: string
  description?: string
  content?: React.ReactNode
  optional?: boolean
}

interface VerticalStepperProps {
  steps: Step[]
  currentStep: number
  onStepChange?: (step: number) => void
  completedSteps?: number[]
  errorSteps?: number[]
  allowStepClick?: boolean
}

export default function VerticalStepper({
  steps,
  currentStep,
  onStepChange,
  completedSteps = [],
  errorSteps = [],
  allowStepClick = true
}: VerticalStepperProps) {
  const getStepStatus = (stepIndex: number) => {
    if (errorSteps.includes(stepIndex)) return 'error'
    if (completedSteps.includes(stepIndex)) return 'completed'
    if (stepIndex === currentStep) return 'active'
    if (stepIndex < currentStep) return 'completed'
    return 'pending'
  }

  const StepIcon = ({ status, index }: { status: string; index: number }) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
        )
      case 'active':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">{index + 1}</span>
          </div>
        )
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-400">{index + 1}</span>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {steps.map((step, index) => {
        const status = getStepStatus(index)
        const isLast = index === steps.length - 1
        const isClickable = allowStepClick && (status === 'completed' || index < currentStep)

        return (
          <div key={step.id} className="flex gap-4">
            {/* Left side - Icon and connector */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => isClickable && onStepChange?.(index)}
                disabled={!isClickable}
                className={\`transition \${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}\`}
              >
                <StepIcon status={status} index={index} />
              </button>

              {!isLast && (
                <div
                  className={\`w-0.5 h-full min-h-[60px] mt-2 \${
                    status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                  }\`}
                />
              )}
            </div>

            {/* Right side - Content */}
            <div className={\`flex-1 pb-8 \${isLast ? 'pb-0' : ''}\`}>
              <button
                onClick={() => isClickable && onStepChange?.(index)}
                disabled={!isClickable}
                className={\`text-left w-full \${isClickable ? 'cursor-pointer' : ''}\`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={\`font-semibold \${
                      status === 'active'
                        ? 'text-blue-600'
                        : status === 'completed'
                        ? 'text-green-600'
                        : status === 'error'
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }\`}
                  >
                    {step.label}
                  </h3>
                  {step.optional && (
                    <span className="text-xs text-gray-500 italic">(Optional)</span>
                  )}
                </div>

                {step.description && (
                  <p className={\`text-sm \${status === 'active' ? 'text-gray-700' : 'text-gray-500'}\`}>
                    {step.description}
                  </p>
                )}
              </button>

              {/* Step content (only show for active step) */}
              {status === 'active' && step.content && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {step.content}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}`
  },

  // 4. Advanced Tabs with Icons
  {
    id: 'advanced-tabs',
    name: 'Advanced Tabs',
    category: 'Navigation',
    description: 'Sistema de tabs con iconos, badges, y tabs closeable',
    tags: ['tabs', 'navigation', 'icons', 'badges', 'closeable'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
  badge?: number | string
  closeable?: boolean
  disabled?: boolean
}

interface AdvancedTabsProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  onTabClose?: (tabId: string) => void
  variant?: 'underline' | 'pills' | 'enclosed'
  orientation?: 'horizontal' | 'vertical'
}

export default function AdvancedTabs({
  tabs: initialTabs,
  defaultTab,
  onTabChange,
  onTabClose,
  variant = 'underline',
  orientation = 'horizontal'
}: AdvancedTabsProps) {
  const [tabs, setTabs] = useState(initialTabs)
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const handleTabClose = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTabs = tabs.filter(t => t.id !== tabId)
    setTabs(newTabs)
    onTabClose?.(tabId)

    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id)
    }
  }

  const activeTabContent = tabs.find(t => t.id === activeTab)?.content

  const getTabClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses = 'flex items-center gap-2 px-4 py-2.5 font-medium transition text-sm'

    if (tab.disabled) {
      return \`\${baseClasses} text-gray-400 cursor-not-allowed\`
    }

    switch (variant) {
      case 'pills':
        return \`\${baseClasses} rounded-lg \${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }\`
      case 'enclosed':
        return \`\${baseClasses} rounded-t-lg border-x border-t \${
          isActive
            ? 'bg-white text-blue-600 border-gray-300 border-b-white -mb-px'
            : 'bg-gray-50 text-gray-700 border-transparent hover:border-gray-300'
        }\`
      default: // underline
        return \`\${baseClasses} border-b-2 \${
          isActive
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-700 border-transparent hover:text-gray-900 hover:border-gray-300'
        }\`
    }
  }

  return (
    <div className={\`w-full \${orientation === 'vertical' ? 'flex gap-4' : ''}\`}>
      {/* Tab List */}
      <div
        className={\`
          \${orientation === 'horizontal' ? 'flex' : 'flex flex-col min-w-[200px]'}
          \${variant === 'underline' ? 'border-b border-gray-200' : ''}
          \${variant === 'enclosed' ? 'border-b border-gray-300' : ''}
          gap-1
        \`}
      >
        {tabs.map(tab => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={getTabClasses(tab, isActive)}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={\`
                    px-2 py-0.5 text-xs rounded-full font-semibold
                    \${isActive && variant === 'pills'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-700'
                    }
                  \`}
                >
                  {tab.badge}
                </span>
              )}
              {tab.closeable && (
                <button
                  onClick={(e) => handleTabClose(tab.id, e)}
                  className={\`
                    p-0.5 rounded hover:bg-black/10 transition
                    \${isActive && variant === 'pills' ? 'text-white' : 'text-gray-500'}
                  \`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className={\`\${orientation === 'horizontal' ? 'mt-6' : 'flex-1'}\`}>
        {activeTabContent}
      </div>
    </div>
  )
}`
  }
]

export default navigationCapsules

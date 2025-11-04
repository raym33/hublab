/**
 * Tabs Component
 * Organized content in tabbed interface
 */

'use client'

import React, { useState, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const Tabs = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className
}: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const activeTab = isControlled ? controlledValue : internalValue

  const setActiveTab = (value: string) => {
    if (!isControlled) {
      setInternalValue(value)
    }
    onValueChange?.(value)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ children, className }: TabsListProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

const TabsTrigger = ({ value, children, disabled = false, className }: TabsTriggerProps) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5',
        'text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
        className
      )}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  const { activeTab } = context

  if (activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn('mt-2 focus-visible:outline-none', className)}
    >
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

export default Tabs

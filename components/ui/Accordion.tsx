/**
 * Accordion Component
 * Vertically stacked collapsible sections
 */

'use client'

import React, { useState, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
  multiple?: boolean
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

export interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: React.ReactNode
  className?: string
}

export interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

const Accordion = ({
  type = 'single',
  defaultValue = [],
  children,
  className
}: AccordionProps) => {
  const initialValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue].filter(Boolean)
  const [openItems, setOpenItems] = useState<string[]>(initialValue)

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(value) ? [] : [value])
    } else {
      setOpenItems(
        openItems.includes(value)
          ? openItems.filter(item => item !== value)
          : [...openItems, value]
      )
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, multiple: type === 'multiple' }}>
      <div className={cn('w-full', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

const AccordionItemContext = createContext<string | undefined>(undefined)

const AccordionItem = ({ value, children, className }: AccordionItemProps) => {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn('border-b border-gray-200 dark:border-gray-700', className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

const AccordionTrigger = ({ children, className }: AccordionTriggerProps) => {
  const context = useContext(AccordionContext)
  const value = useContext(AccordionItemContext)

  if (!context) throw new Error('AccordionTrigger must be used within Accordion')
  if (!value) throw new Error('AccordionTrigger must be used within AccordionItem')

  const { openItems, toggleItem } = context
  const isOpen = openItems.includes(value)

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between py-4 font-medium transition-all',
        'hover:underline text-left',
        className
      )}
      aria-expanded={isOpen}
    >
      {children}
      <svg
        className={cn(
          'h-4 w-4 shrink-0 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

const AccordionContent = ({ children, className }: AccordionContentProps) => {
  const context = useContext(AccordionContext)
  const value = useContext(AccordionItemContext)

  if (!context) throw new Error('AccordionContent must be used within Accordion')
  if (!value) throw new Error('AccordionContent must be used within AccordionItem')

  const { openItems } = context
  const isOpen = openItems.includes(value)

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'overflow-hidden text-sm transition-all',
        'animate-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
}

Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

export default Accordion

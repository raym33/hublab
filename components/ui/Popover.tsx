/**
 * Popover Component
 * Floating content overlay triggered by click
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  closeOnClickOutside?: boolean
  className?: string
}

const Popover = ({
  trigger,
  content,
  position = 'bottom',
  align = 'center',
  closeOnClickOutside = true,
  className
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      let x = 0
      let y = 0

      // Calculate position
      switch (position) {
        case 'top':
          y = triggerRect.top - contentRect.height - 8
          break
        case 'bottom':
          y = triggerRect.bottom + 8
          break
        case 'left':
          x = triggerRect.left - contentRect.width - 8
          break
        case 'right':
          x = triggerRect.right + 8
          break
      }

      // Calculate alignment
      if (position === 'top' || position === 'bottom') {
        switch (align) {
          case 'start':
            x = triggerRect.left
            break
          case 'center':
            x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
            break
          case 'end':
            x = triggerRect.right - contentRect.width
            break
        }
      } else {
        switch (align) {
          case 'start':
            y = triggerRect.top
            break
          case 'center':
            y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
            break
          case 'end':
            y = triggerRect.bottom - contentRect.height
            break
        }
      }

      setCoords({ x, y })
    }
  }, [isOpen, position, align])

  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeOnClickOutside])

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={contentRef}
          className={cn(
            'fixed z-50 rounded-lg border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800 shadow-lg',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            className
          )}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`
          }}
          role="dialog"
          aria-modal="true"
        >
          {content}
        </div>
      )}
    </>
  )
}

export default Popover

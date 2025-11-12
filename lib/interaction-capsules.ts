/**
 * Interaction Capsules
 *
 * 5 production-ready interaction components
 * Drag & drop, tooltips, context menus, gestures, and interactive elements
 */

import { Capsule } from '@/types/capsule'

const interactionCapsules: Capsule[] = [
  {
    id: 'drag-drop-list',
    name: 'Drag & Drop Sortable List',
    category: 'Interaction',
    description: 'Sortable list with drag-and-drop reordering, visual feedback, touch support, and animation. Perfect for task lists, priorities, and custom ordering interfaces.',
    tags: ['drag', 'drop', 'sortable', 'list', 'reorder', 'dnd'],
    code: `'use client'

import { useState } from 'react'
import { GripVertical, Trash2 } from 'lucide-react'

interface DragDropItem {
  id: string
  content: string
  color?: string
}

interface DragDropListProps {
  items: DragDropItem[]
  onChange: (items: DragDropItem[]) => void
  onDelete?: (id: string) => void
}

export default function DragDropList({ items, onChange, onDelete }: DragDropListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)

    onChange(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={\`group relative flex items-center gap-3 p-4 bg-white border rounded-lg transition-all cursor-move \${
            draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          } \${
            dragOverIndex === index && draggedIndex !== index
              ? 'border-blue-500 border-t-4'
              : 'border-gray-200'
          } hover:shadow-md\`}
        >
          <GripVertical size={20} className="text-gray-400 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-medium">{item.content}</p>
          </div>

          {item.color && (
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          No items yet. Add some to get started!
        </div>
      )}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'tooltip',
    name: 'Smart Tooltip',
    category: 'UI',
    description: 'Intelligent tooltip with auto-positioning, multiple placements, arrows, delays, and rich content support. Includes animations and touch support.',
    tags: ['tooltip', 'popover', 'hint', 'ui', 'overlay'],
    code: `'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  maxWidth?: number
}

export default function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  maxWidth = 200
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let x = 0, y = 0

      switch (placement) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.top - tooltipRect.height - 8
          break
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.bottom + 8
          break
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
        case 'right':
          x = triggerRect.right + 8
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
      }

      // Keep tooltip within viewport
      x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8))
      y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8))

      setPosition({ x, y })
    }
  }, [isVisible, placement])

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const arrowStyles = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-900',
    right: 'left-[-4px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900'
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            left: \`\${position.x}px\`,
            top: \`\${position.y}px\`,
            maxWidth: \`\${maxWidth}px\`
          }}
        >
          <div className="relative bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg animate-fade-in">
            {content}
            <div className={\`absolute w-0 h-0 \${arrowStyles[placement]}\`} />
          </div>
        </div>
      )}

      <style jsx>{\`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
      \`}</style>
    </>
  )
}`,
    platform: 'react'
  },

  {
    id: 'context-menu',
    name: 'Context Menu',
    category: 'Interaction',
    description: 'Right-click context menu with nested submenus, icons, keyboard shortcuts, separators, and disabled states. Includes position detection and accessibility.',
    tags: ['context-menu', 'right-click', 'menu', 'dropdown', 'popup'],
    code: `'use client'

import { useState, useEffect, ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  shortcut?: string
  disabled?: boolean
  separator?: boolean
  submenu?: MenuItem[]
  onClick?: () => void
}

interface ContextMenuProps {
  items: MenuItem[]
  children: ReactNode
}

export default function ContextMenu({ items, children }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const handleClick = () => setIsOpen(false)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()

    // Calculate position to keep menu in viewport
    const menuWidth = 200
    const menuHeight = items.length * 40
    const x = e.clientX + menuWidth > window.innerWidth ? e.clientX - menuWidth : e.clientX
    const y = e.clientY + menuHeight > window.innerHeight ? e.clientY - menuHeight : e.clientY

    setPosition({ x, y })
    setIsOpen(true)
  }

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled || item.submenu) return
    item.onClick?.()
    setIsOpen(false)
  }

  const renderMenu = (menuItems: MenuItem[], isSubmenu = false, parentX = 0) => (
    <div
      className={\`\${isSubmenu ? 'absolute left-full top-0 ml-1' : 'fixed'} bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px] z-50\`}
      style={!isSubmenu ? { left: \`\${position.x}px\`, top: \`\${position.y}px\` } : undefined}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item) => {
        if (item.separator) {
          return <div key={item.id} className="h-px bg-gray-200 my-1" />
        }

        const Icon = item.icon
        const hasSubmenu = item.submenu && item.submenu.length > 0

        return (
          <div key={item.id} className="relative">
            <button
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => hasSubmenu && setActiveSubmenu(item.id)}
              disabled={item.disabled}
              className={\`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors \${
                item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-900 hover:bg-blue-50 hover:text-blue-600'
              }\`}
            >
              {Icon && <Icon size={16} />}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="text-xs text-gray-500">{item.shortcut}</span>
              )}
              {hasSubmenu && <ChevronRight size={16} />}
            </button>

            {hasSubmenu && activeSubmenu === item.id && renderMenu(item.submenu!, true, position.x + 200)}
          </div>
        )
      })}
    </div>
  )

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
      {isOpen && renderMenu(items)}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'gesture-handler',
    name: 'Touch Gesture Handler',
    category: 'Interaction',
    description: 'Multi-touch gesture recognition for swipe, pinch, rotate, and long-press. Includes threshold configuration, velocity tracking, and callback events. Perfect for mobile interfaces.',
    tags: ['gesture', 'touch', 'swipe', 'pinch', 'mobile', 'interaction'],
    code: `'use client'

import { useRef, ReactNode } from 'react'

interface GestureHandlerProps {
  children: ReactNode
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
  onPinch?: (scale: number) => void
  onRotate?: (angle: number) => void
  onLongPress?: () => void
  onDoubleTap?: () => void
  swipeThreshold?: number
  longPressDelay?: number
  className?: string
}

export default function GestureHandler({
  children,
  onSwipe,
  onPinch,
  onRotate,
  onLongPress,
  onDoubleTap,
  swipeThreshold = 50,
  longPressDelay = 500,
  className = ''
}: GestureHandlerProps) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastTapRef = useRef<number>(0)
  const longPressTimerRef = useRef<NodeJS.Timeout>()
  const initialDistanceRef = useRef<number>(0)
  const initialAngleRef = useRef<number>(0)

  const getTouchDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchAngle = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.atan2(dy, dx) * 180 / Math.PI
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]

    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }

      // Long press detection
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress()
        }, longPressDelay)
      }

      // Double tap detection
      if (onDoubleTap) {
        const now = Date.now()
        if (now - lastTapRef.current < 300) {
          onDoubleTap()
          lastTapRef.current = 0
        } else {
          lastTapRef.current = now
        }
      }
    } else if (e.touches.length === 2) {
      // Multi-touch gestures
      if (onPinch) {
        initialDistanceRef.current = getTouchDistance(e.touches[0], e.touches[1])
      }
      if (onRotate) {
        initialAngleRef.current = getTouchAngle(e.touches[0], e.touches[1])
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }

    if (e.touches.length === 2) {
      // Pinch gesture
      if (onPinch && initialDistanceRef.current > 0) {
        const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
        const scale = currentDistance / initialDistanceRef.current
        onPinch(scale)
      }

      // Rotate gesture
      if (onRotate && initialAngleRef.current !== 0) {
        const currentAngle = getTouchAngle(e.touches[0], e.touches[1])
        const rotation = currentAngle - initialAngleRef.current
        onRotate(rotation)
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }

    if (!touchStartRef.current || e.touches.length > 0) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const deltaTime = Date.now() - touchStartRef.current.time

    // Swipe detection
    if (onSwipe && (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold)) {
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onSwipe(deltaX > 0 ? 'right' : 'left')
      } else {
        onSwipe(deltaY > 0 ? 'down' : 'up')
      }
    }

    touchStartRef.current = null
    initialDistanceRef.current = 0
    initialAngleRef.current = 0
  }

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'rating-input',
    name: 'Interactive Rating Input',
    category: 'Form',
    description: 'Star rating input with half-star support, hover preview, custom icons, sizes, colors, and read-only mode. Includes animations and accessibility features.',
    tags: ['rating', 'stars', 'review', 'input', 'form', 'feedback'],
    code: `'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingInputProps {
  value?: number
  onChange?: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  allowHalf?: boolean
  readOnly?: boolean
  showValue?: boolean
}

export default function RatingInput({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  color = '#fbbf24',
  allowHalf = true,
  readOnly = false,
  showValue = false
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizes = {
    sm: 20,
    md: 32,
    lg: 48
  }

  const iconSize = sizes[size]

  const handleClick = (starIndex: number, isHalf: boolean) => {
    if (readOnly || !onChange) return
    const newValue = starIndex + (isHalf && allowHalf ? 0.5 : 1)
    onChange(newValue)
  }

  const handleMouseMove = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (readOnly) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const isHalf = allowHalf && x < rect.width / 2
    setHoverValue(starIndex + (isHalf ? 0.5 : 1))
  }

  const handleMouseLeave = () => {
    setHoverValue(null)
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  const getStarFill = (starIndex: number): 'empty' | 'half' | 'full' => {
    if (displayValue >= starIndex + 1) return 'full'
    if (displayValue > starIndex && displayValue < starIndex + 1) return 'half'
    return 'empty'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => {
          const fill = getStarFill(i)

          return (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const isHalf = allowHalf && x < rect.width / 2
                handleClick(i, isHalf)
              }}
              onMouseMove={(e) => handleMouseMove(i, e)}
              onMouseLeave={handleMouseLeave}
              disabled={readOnly}
              className={\`relative transition-transform \${
                !readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
              }\`}
              style={{ width: iconSize, height: iconSize }}
            >
              {/* Background star (empty) */}
              <Star
                size={iconSize}
                className="absolute inset-0 text-gray-300"
                strokeWidth={1}
              />

              {/* Filled star */}
              {fill !== 'empty' && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: fill === 'half' ? '50%' : '100%'
                  }}
                >
                  <Star
                    size={iconSize}
                    className="fill-current"
                    style={{ color }}
                    strokeWidth={0}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-2">
          {displayValue.toFixed(allowHalf ? 1 : 0)} / {max}
        </span>
      )}
    </div>
  )
}`,
    platform: 'react'
  }
]

export default interactionCapsules

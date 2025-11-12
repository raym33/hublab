/**
 * Layout Capsules
 *
 * Cápsulas para layouts y estructuras: grids, masonry, split panes
 */

import { Capsule } from '@/types/capsule'

export const layoutCapsules: Capsule[] = [
  // 1. Responsive Grid Gallery
  {
    id: 'responsive-grid',
    name: 'Responsive Grid Gallery',
    category: 'Layout',
    description: 'Grid responsivo con auto-fit y aspect ratio controlado',
    tags: ['grid', 'gallery', 'responsive', 'images', 'layout'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState } from 'react'
import { LayoutGrid, ZoomIn } from 'lucide-react'

interface GridItem {
  id: string
  imageUrl: string
  title: string
  description?: string
}

interface ResponsiveGridProps {
  items: GridItem[]
  columns?: { sm: number; md: number; lg: number; xl: number }
  gap?: number
  aspectRatio?: string
  onItemClick?: (item: GridItem) => void
  showOverlay?: boolean
}

export default function ResponsiveGrid({
  items,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  aspectRatio = '1/1',
  onItemClick,
  showOverlay = true
}: ResponsiveGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const gridClass = \`grid gap-\${gap}
    grid-cols-\${columns.sm}
    md:grid-cols-\${columns.md}
    lg:grid-cols-\${columns.lg}
    xl:grid-cols-\${columns.xl}\`

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <LayoutGrid className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
      </div>

      <div className={gridClass}>
        {items.map(item => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg cursor-pointer group"
            style={{ aspectRatio }}
            onClick={() => onItemClick?.(item)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Overlay */}
            {showOverlay && (
              <div className={\`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                flex flex-col justify-end p-4\`}>
                <h3 className="text-white font-semibold text-lg mb-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-white/80 text-sm line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="absolute top-4 right-4">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // 2. Masonry Layout
  {
    id: 'masonry-layout',
    name: 'Masonry Layout',
    category: 'Layout',
    description: 'Layout tipo Pinterest con elementos de altura variable',
    tags: ['masonry', 'pinterest', 'layout', 'cards', 'waterfall'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useEffect, useRef, useState } from 'react'
import { Grid3x3 } from 'lucide-react'

interface MasonryItem {
  id: string
  content: React.ReactNode
  height?: number
}

interface MasonryLayoutProps {
  items: MasonryItem[]
  columns?: number
  gap?: number
  className?: string
}

export default function MasonryLayout({
  items,
  columns = 3,
  gap = 16,
  className = ''
}: MasonryLayoutProps) {
  const [columnItems, setColumnItems] = useState<MasonryItem[][]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Distribute items across columns
    const cols: MasonryItem[][] = Array.from({ length: columns }, () => [])
    const colHeights = Array(columns).fill(0)

    items.forEach(item => {
      // Find shortest column
      const shortestColIndex = colHeights.indexOf(Math.min(...colHeights))
      cols[shortestColIndex].push(item)
      colHeights[shortestColIndex] += item.height || 200
    })

    setColumnItems(cols)
  }, [items, columns])

  return (
    <div className={\`w-full \${className}\`} ref={containerRef}>
      <div className="flex items-center gap-2 mb-6">
        <Grid3x3 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Masonry Grid</h2>
      </div>

      <div
        className="flex"
        style={{ gap: \`\${gap}px\` }}
      >
        {columnItems.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex-1 flex flex-col"
            style={{ gap: \`\${gap}px\` }}
          >
            {column.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {item.content}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // 3. Split Pane Resizable
  {
    id: 'split-pane',
    name: 'Split Pane Resizable',
    category: 'Layout',
    description: 'Panel dividido con handle arrastrable para redimensionar',
    tags: ['split', 'pane', 'resizable', 'divider', 'layout'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState, useRef, useEffect } from 'react'
import { GripVertical } from 'lucide-react'

interface SplitPaneProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultLeftWidth?: number
  minLeftWidth?: number
  minRightWidth?: number
  orientation?: 'horizontal' | 'vertical'
}

export default function SplitPane({
  left,
  right,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  minRightWidth = 20,
  orientation = 'horizontal'
}: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()

      let newLeftWidth: number

      if (orientation === 'horizontal') {
        const mouseX = e.clientX - rect.left
        newLeftWidth = (mouseX / rect.width) * 100
      } else {
        const mouseY = e.clientY - rect.top
        newLeftWidth = (mouseY / rect.height) * 100
      }

      // Apply constraints
      newLeftWidth = Math.max(minLeftWidth, Math.min(100 - minRightWidth, newLeftWidth))
      setLeftWidth(newLeftWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, minLeftWidth, minRightWidth, orientation])

  return (
    <div
      ref={containerRef}
      className={\`flex \${orientation === 'vertical' ? 'flex-col' : 'flex-row'} w-full h-full relative\`}
    >
      {/* Left/Top Pane */}
      <div
        style={{
          [orientation === 'horizontal' ? 'width' : 'height']: \`\${leftWidth}%\`
        }}
        className="overflow-auto"
      >
        {left}
      </div>

      {/* Divider */}
      <div
        className={\`
          \${orientation === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}
          bg-gray-200 hover:bg-blue-400 transition-colors relative group
          \${isDragging ? 'bg-blue-500' : ''}
        \`}
        onMouseDown={handleMouseDown}
      >
        <div
          className={\`
            absolute \${orientation === 'horizontal' ? 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2' : 'top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'}
            p-1 bg-gray-300 group-hover:bg-blue-500 rounded
            \${isDragging ? 'bg-blue-600' : ''}
          \`}
        >
          <GripVertical
            className={\`w-4 h-4 text-gray-600 group-hover:text-white \${isDragging ? 'text-white' : ''}\`}
          />
        </div>
      </div>

      {/* Right/Bottom Pane */}
      <div
        style={{
          [orientation === 'horizontal' ? 'width' : 'height']: \`\${100 - leftWidth}%\`
        }}
        className="overflow-auto"
      >
        {right}
      </div>
    </div>
  )
}`
  },

  // 4. Sticky Sidebar Layout
  {
    id: 'sticky-sidebar',
    name: 'Sticky Sidebar Layout',
    category: 'Layout',
    description: 'Layout con sidebar sticky que permanece visible al hacer scroll',
    tags: ['sidebar', 'sticky', 'layout', 'navigation', 'scroll'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
}

interface StickySidebarProps {
  items: SidebarItem[]
  children: React.ReactNode
  sidebarWidth?: number
  sidebarPosition?: 'left' | 'right'
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export default function StickySidebar({
  items,
  children,
  sidebarWidth = 256,
  sidebarPosition = 'left',
  collapsible = true,
  defaultCollapsed = false
}: StickySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id || null)

  const handleItemClick = (item: SidebarItem) => {
    setActiveId(item.id)
    item.onClick?.()
  }

  const sidebar = (
    <aside
      className={\`
        bg-white border-gray-200 transition-all duration-300
        \${sidebarPosition === 'left' ? 'border-r' : 'border-l'}
        \${isCollapsed ? 'w-16' : ''}
      \`}
      style={{
        width: isCollapsed ? '64px' : \`\${sidebarWidth}px\`
      }}
    >
      <div className="sticky top-0 h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="font-semibold text-gray-900">Navigation</h2>
          )}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <X className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={\`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition
                \${activeId === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
                }
                \${isCollapsed ? 'justify-center' : ''}
              \`}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon && (
                <span className="flex-shrink-0">{item.icon}</span>
              )}
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )

  return (
    <div className="flex w-full h-screen">
      {sidebarPosition === 'left' && sidebar}

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>

      {sidebarPosition === 'right' && sidebar}
    </div>
  )
}`
  }
]

export default layoutCapsules

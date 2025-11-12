'use client'

import { useState, useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { allCapsules, getAllCategories } from '@/lib/all-capsules'
import { Capsule } from '@/types/capsule'
import { Search, Grid3x3 } from 'lucide-react'

function DraggableCapsuleCard({ capsule }: { capsule: Capsule }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${capsule.id}`,
    data: { type: 'palette', capsule }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <Grid3x3 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {capsule.name}
          </div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {capsule.description}
          </div>
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
              {capsule.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CapsulePalette() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = useMemo(() => getAllCategories(), [])

  const filteredCapsules = useMemo(() => {
    let filtered = allCapsules

    // Filtrar por categoría
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Cápsulas ({allCapsules.length})
        </h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cápsulas..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Capsule list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredCapsules.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No se encontraron cápsulas
          </div>
        ) : (
          filteredCapsules.map(capsule => (
            <DraggableCapsuleCard key={capsule.id} capsule={capsule} />
          ))
        )}
      </div>
    </div>
  )
}

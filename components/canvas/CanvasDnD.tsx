'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'
import { Capsule } from '@/types/capsule'
import { GripVertical, Trash2, Eye } from 'lucide-react'

interface CanvasItem {
  id: string
  capsule: Capsule
  props?: Record<string, any>
}

interface CanvasDnDProps {
  items: CanvasItem[]
  onSelectItem: (item: CanvasItem) => void
  onDeleteItem: (id: string) => void
  selectedItemId?: string
}

function SortableCanvasItem({
  item,
  isSelected,
  onSelect,
  onDelete
}: {
  item: CanvasItem
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: item.id,
    data: { type: 'canvas', item }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`bg-white rounded-lg border-2 p-4 transition-all ${
        isSelected
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {item.capsule.name}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-2">
            {item.capsule.description}
          </p>

          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {item.capsule.category}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {item.capsule.platform}
            </span>
          </div>

          {/* Preview hint */}
          <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500 flex items-center gap-2">
            <Eye className="w-3 h-3" />
            <span>Vista previa: Componente {item.capsule.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CanvasDnD({
  items,
  onSelectItem,
  onDeleteItem,
  selectedItemId
}: CanvasDnDProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone'
  })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-full rounded-xl border-2 border-dashed p-6 transition-colors ${
        isOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white'
      }`}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <GripVertical className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Canvas vacío
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            Arrastra cápsulas desde la paleta izquierda para empezar a construir tu app.
            Puedes reordenarlas arrastrándolas dentro del canvas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <SortableCanvasItem
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onSelect={() => onSelectItem(item)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

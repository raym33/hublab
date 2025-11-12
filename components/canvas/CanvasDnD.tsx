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
      className={`group bg-white rounded-xl border-2 p-5 transition-all cursor-pointer hover:shadow-md ${
        isSelected
          ? 'border-blue-500 shadow-lg ring-4 ring-blue-100'
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing mt-1 p-2 rounded-lg transition-colors ${
            isSelected
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
          }`}
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                {item.capsule.name}
                {isSelected && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    Seleccionado
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.capsule.description.slice(0, 120)}
                {item.capsule.description.length > 120 && '...'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 ml-2"
              title="Eliminar componente"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
              {item.capsule.category}
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
              {item.capsule.platform}
            </span>
            {item.capsule.tags && item.capsule.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Preview hint */}
          <div className={`p-3 rounded-lg border transition-all ${
            isSelected
              ? 'bg-blue-50 border-blue-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Eye className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={isSelected ? 'text-blue-700' : 'text-gray-600'}>
                Vista previa del componente
              </span>
            </div>
            {Object.keys(item.props || {}).length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {Object.keys(item.props || {}).length} propiedad{Object.keys(item.props || {}).length !== 1 ? 'es' : ''} personalizada{Object.keys(item.props || {}).length !== 1 ? 's' : ''}
              </div>
            )}
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
      className={`min-h-full rounded-xl border-2 border-dashed p-8 transition-all duration-200 ${
        isOver
          ? 'border-blue-500 bg-blue-50/50 shadow-lg scale-[1.01]'
          : 'border-gray-300 bg-white shadow-sm'
      }`}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[600px] text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <GripVertical className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Tu canvas está vacío
          </h3>
          <p className="text-base text-gray-600 max-w-md mb-6 leading-relaxed">
            Arrastra componentes desde la <span className="font-semibold text-blue-600">paleta de la izquierda</span> para comenzar a construir tu aplicación. Puedes reordenarlos arrastrándolos dentro del canvas.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">👆</span>
              </div>
              <span>Arrastra y suelta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎨</span>
              </div>
              <span>Personaliza propiedades</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">💾</span>
              </div>
              <span>Exporta tu proyecto</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="font-bold text-blue-600">{items.length}</span>
              </div>
              <span className="font-medium">
                {items.length} componente{items.length !== 1 ? 's' : ''} en el canvas
              </span>
            </div>
            <p className="text-xs text-gray-500">
              💡 Arrastra para reordenar • Click para editar
            </p>
          </div>
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

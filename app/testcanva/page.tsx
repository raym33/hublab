'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import CapsulePalette from '@/components/canvas/CapsulePalette'
import CanvasDnD from '@/components/canvas/CanvasDnD'
import PropertyPanel from '@/components/canvas/PropertyPanel'
import CodePreview from '@/components/canvas/CodePreview'
import ExportButton from '@/components/canvas/ExportButton'
import { Capsule } from '@/types/capsule'

interface CanvasItem {
  id: string
  capsule: Capsule
  props?: Record<string, any>
}

export default function TestCanvaPage() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])
  const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(false)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    // Si viene desde la paleta (drag de cápsula nueva)
    if (active.data.current?.type === 'palette') {
      const capsule = active.data.current.capsule as Capsule
      const newItem: CanvasItem = {
        id: `${capsule.id}-${Date.now()}`,
        capsule,
        props: {}
      }
      setCanvasItems([...canvasItems, newItem])
    }

    // Si es reordenamiento interno del canvas
    if (active.id !== over.id && active.data.current?.type === 'canvas') {
      const oldIndex = canvasItems.findIndex(item => item.id === active.id)
      const newIndex = canvasItems.findIndex(item => item.id === over.id)

      const newItems = [...canvasItems]
      const [movedItem] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, movedItem)
      setCanvasItems(newItems)
    }
  }

  const handleDeleteItem = (id: string) => {
    setCanvasItems(canvasItems.filter(item => item.id !== id))
    if (selectedItem?.id === id) setSelectedItem(null)
  }

  const handleUpdateProps = (id: string, props: Record<string, any>) => {
    setCanvasItems(canvasItems.map(item =>
      item.id === id ? { ...item, props } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              HubLab Visual Canvas
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Arrastra cápsulas para crear tu app visualmente
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              {showCode ? 'Ocultar código' : 'Ver código'}
            </button>
            <ExportButton canvasItems={canvasItems} />
          </div>
        </div>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex h-[calc(100vh-89px)]">
          {/* Paleta de cápsulas (izquierda) */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <CapsulePalette />
          </div>

          {/* Canvas principal (centro) */}
          <div className="flex-1 p-6 overflow-y-auto">
            <SortableContext
              items={canvasItems.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <CanvasDnD
                items={canvasItems}
                onSelectItem={setSelectedItem}
                onDeleteItem={handleDeleteItem}
                selectedItemId={selectedItem?.id}
              />
            </SortableContext>
          </div>

          {/* Panel de propiedades o código (derecha) */}
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            {showCode ? (
              <CodePreview canvasItems={canvasItems} />
            ) : (
              <PropertyPanel
                selectedItem={selectedItem}
                onUpdateProps={handleUpdateProps}
              />
            )}
          </div>
        </div>

        {/* Overlay para el drag */}
        <DragOverlay>
          {activeId ? (
            <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-500 opacity-80">
              <div className="text-sm font-medium text-gray-900">
                {canvasItems.find(item => item.id === activeId)?.capsule.name || 'Cápsula'}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

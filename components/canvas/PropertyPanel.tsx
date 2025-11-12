'use client'

import { useState, useEffect } from 'react'
import { Capsule } from '@/types/capsule'
import { Settings, Info } from 'lucide-react'

interface CanvasItem {
  id: string
  capsule: Capsule
  props?: Record<string, any>
}

interface PropertyPanelProps {
  selectedItem: CanvasItem | null
  onUpdateProps: (id: string, props: Record<string, any>) => void
}

export default function PropertyPanel({
  selectedItem,
  onUpdateProps
}: PropertyPanelProps) {
  const [localProps, setLocalProps] = useState<Record<string, any>>({})

  useEffect(() => {
    if (selectedItem) {
      setLocalProps(selectedItem.props || {})
    }
  }, [selectedItem])

  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sin selección
        </h3>
        <p className="text-sm text-gray-500">
          Selecciona una cápsula del canvas para ver y editar sus propiedades
        </p>
      </div>
    )
  }

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value }
    setLocalProps(newProps)
    onUpdateProps(selectedItem.id, newProps)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Propiedades</h2>
        </div>
        <p className="text-sm text-gray-600">{selectedItem.capsule.name}</p>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-blue-900 mb-1">
                Información
              </div>
              <div className="text-xs text-blue-700">
                {selectedItem.capsule.description}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedItem.capsule.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Common props */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título / Label
          </label>
          <input
            type="text"
            value={localProps.title || localProps.label || ''}
            onChange={(e) => handlePropChange('title', e.target.value)}
            placeholder="Ej: Mi componente"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={localProps.description || ''}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="Descripción opcional..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Variante / Estilo
          </label>
          <select
            value={localProps.variant || 'default'}
            onChange={(e) => handlePropChange('variant', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamaño
          </label>
          <select
            value={localProps.size || 'md'}
            onChange={(e) => handlePropChange('size', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="xs">Extra pequeño</option>
            <option value="sm">Pequeño</option>
            <option value="md">Mediano</option>
            <option value="lg">Grande</option>
            <option value="xl">Extra grande</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Deshabilitado
          </label>
          <input
            type="checkbox"
            checked={localProps.disabled || false}
            onChange={(e) => handlePropChange('disabled', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Ancho completo
          </label>
          <input
            type="checkbox"
            checked={localProps.fullWidth || false}
            onChange={(e) => handlePropChange('fullWidth', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Custom props JSON editor */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Props avanzados (JSON)
          </label>
          <textarea
            value={JSON.stringify(localProps, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                setLocalProps(parsed)
                onUpdateProps(selectedItem.id, parsed)
              } catch (err) {
                // Invalid JSON, no actualizar
              }
            }}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
          />
        </div>
      </div>
    </div>
  )
}

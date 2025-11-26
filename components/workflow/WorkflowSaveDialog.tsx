'use client'

import { useState } from 'react'
import { X, Save, Globe, Lock } from 'lucide-react'

interface WorkflowSaveDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    name: string
    description: string
    category: string
    tags: string[]
    isPublic: boolean
  }) => Promise<void>
  initialName?: string
  initialDescription?: string
  initialCategory?: string
  initialTags?: string[]
  initialIsPublic?: boolean
  isUpdate?: boolean
}

const WORKFLOW_CATEGORIES = [
  { value: '', label: 'Sin categoría' },
  { value: 'automation', label: 'Automatización' },
  { value: 'data-processing', label: 'Procesamiento de datos' },
  { value: 'ui-composition', label: 'Composición de UI' },
  { value: 'integration', label: 'Integración' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'notification', label: 'Notificaciones' },
  { value: 'ai-workflow', label: 'IA / ML' },
  { value: 'other', label: 'Otro' }
]

export default function WorkflowSaveDialog({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialDescription = '',
  initialCategory = '',
  initialTags = [],
  initialIsPublic = false,
  isUpdate = false
}: WorkflowSaveDialogProps) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [category, setCategory] = useState(initialCategory)
  const [tagsInput, setTagsInput] = useState(initialTags.join(', '))
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('El nombre es requerido')
      return
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    setIsSaving(true)
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        category,
        tags,
        isPublic
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Save className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isUpdate ? 'Actualizar Workflow' : 'Guardar Workflow'}
              </h2>
              <p className="text-xs text-gray-500">
                {isUpdate ? 'Actualiza los detalles de tu workflow' : 'Guarda tu workflow para usarlo después'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mi Workflow"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe qué hace este workflow..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              {WORKFLOW_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="automación, datos, ui (separados por coma)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separa los tags con comas
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilidad
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  !isPublic
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Privado</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  isPublic
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Público</span>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {isPublic
                ? 'Otros usuarios podrán ver y usar este workflow'
                : 'Solo tú puedes ver este workflow'
              }
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isUpdate ? 'Actualizar' : 'Guardar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

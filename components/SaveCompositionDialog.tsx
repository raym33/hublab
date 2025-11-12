'use client'

import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CompilationResult } from '@/lib/capsule-compiler/types'
import type { CreateCompositionInput } from '@/lib/types/saved-compositions'

interface SaveCompositionDialogProps {
  isOpen: boolean
  onClose: () => void
  prompt: string
  platform: 'web' | 'desktop' | 'ios' | 'android' | 'ai-os'
  compilationResult: CompilationResult
  onSaved?: (compositionId: string) => void
}

export default function SaveCompositionDialog({
  isOpen,
  onClose,
  prompt,
  platform,
  compilationResult,
  onSaved
}: SaveCompositionDialogProps) {
  const [name, setName] = useState(prompt.substring(0, 100) || 'My App')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [tags, setTags] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to save compositions')
        setIsSaving(false)
        return
      }

      // Extract composition from compilation result
      const compositionData: CreateCompositionInput = {
        name: name.trim(),
        description: description.trim() || undefined,
        prompt,
        platform,
        composition: {
          name: name.trim(),
          version: '1.0.0',
          platform,
          description: description.trim() || prompt,
          rootCapsule: 'root',
          capsules: [], // This should be extracted from the compilation result
          connections: []
        },
        compilation_result: compilationResult,
        is_public: isPublic,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      }

      const response = await fetch('/api/compositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(compositionData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save composition')
      }

      const { composition } = await response.json()

      if (onSaved) {
        onSaved(composition.id)
      }

      onClose()
    } catch (err) {
      console.error('Error saving composition:', err)
      setError(err instanceof Error ? err.message : 'Failed to save composition')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Save Composition</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome App"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your app does..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="todo, productivity, react (comma-separated)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="flex-1">
              <div className="font-semibold text-gray-900">Make this composition public</div>
              <div className="text-sm text-gray-600">
                Public compositions can be viewed and forked by other users
              </div>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What you're saving:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Platform: <span className="font-mono">{platform}</span></li>
              <li>• Files: {compilationResult.output?.code ? Object.keys(compilationResult.output.code).length : 0}</li>
              <li>• Lines of code: {compilationResult.stats.linesOfCode}</li>
              <li>• Capsules used: {compilationResult.stats.capsulesProcessed}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Composition
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

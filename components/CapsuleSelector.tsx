'use client'

import { useState, useMemo } from 'react'
import { X, Search, Package, Check } from 'lucide-react'
import { ALL_CAPSULES, CAPSULES_BY_CATEGORY } from '@/lib/complete-capsules'
import type { CompleteCapsule } from '@/lib/complete-capsules'

interface CapsuleSelectorProps {
  onClose: () => void
  onSelectCapsules: (capsules: CompleteCapsule[]) => void
  initialSelected?: CompleteCapsule[]
}

export default function CapsuleSelector({
  onClose,
  onSelectCapsules,
  initialSelected = []
}: CapsuleSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCapsules, setSelectedCapsules] = useState<Set<string>>(
    new Set(initialSelected.map(c => c.id))
  )

  const categories = [
    { id: 'all', name: 'All Capsules', icon: '🎯' },
    { id: 'auth', name: 'Authentication', icon: '🔐' },
    { id: 'data', name: 'Data & Storage', icon: '🗄️' },
    { id: 'ai', name: 'AI & ML', icon: '🤖' },
    { id: 'content', name: 'Content', icon: '📄' },
    { id: 'communication', name: 'Communication', icon: '📧' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'workflow', name: 'Workflow', icon: '⚙️' },
    { id: 'ui', name: 'UI Components', icon: '🎨' },
    { id: 'visualization', name: 'Data Viz', icon: '📊' },
    { id: 'forms', name: 'Forms', icon: '📋' },
    { id: 'layout', name: 'Layout', icon: '📐' },
    { id: 'animation', name: 'Animation', icon: '✨' }
  ]

  const filteredCapsules = useMemo(() => {
    let capsules = selectedCategory === 'all'
      ? ALL_CAPSULES
      : CAPSULES_BY_CATEGORY[selectedCategory as keyof typeof CAPSULES_BY_CATEGORY] || []

    if (searchQuery) {
      capsules = capsules.filter(capsule =>
        capsule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return capsules
  }, [selectedCategory, searchQuery])

  const toggleCapsule = (capsuleId: string) => {
    const newSelected = new Set(selectedCapsules)
    if (newSelected.has(capsuleId)) {
      newSelected.delete(capsuleId)
    } else {
      newSelected.add(capsuleId)
    }
    setSelectedCapsules(newSelected)
  }

  const handleApply = () => {
    const selected = ALL_CAPSULES.filter(c => selectedCapsules.has(c.id))
    onSelectCapsules(selected)
    onClose()
  }

  const handleSelectAll = () => {
    setSelectedCapsules(new Set(filteredCapsules.map(c => c.id)))
  }

  const handleClearAll = () => {
    setSelectedCapsules(new Set())
  }

  const selectedCount = selectedCapsules.size

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Package className="w-7 h-7 text-purple-400" />
              Browse Capsules
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Select capsules to prioritize in your app generation • {ALL_CAPSULES.length} available
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-6 border-b border-white/10 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search capsules by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors border border-white/10"
            >
              Select All ({filteredCapsules.length})
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors border border-white/10"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Capsules Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCapsules.map(capsule => {
              const isSelected = selectedCapsules.has(capsule.id)
              return (
                <button
                  key={capsule.id}
                  onClick={() => toggleCapsule(capsule.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: capsule.color + '20' }}
                    >
                      {capsule.icon}
                    </div>
                    <div className="flex-1 pr-6">
                      <h3 className="font-semibold text-white text-sm">{capsule.name}</h3>
                      {capsule.npmPackage && (
                        <p className="text-xs text-gray-500 font-mono truncate">{capsule.npmPackage}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {capsule.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">
                      {capsule.category}
                    </span>
                    {capsule.inputPorts.length > 0 && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {capsule.inputPorts.length} in
                      </span>
                    )}
                    {capsule.outputPorts.length > 0 && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                        {capsule.outputPorts.length} out
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {filteredCapsules.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No capsules found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black/20">
          <div className="text-sm text-gray-400">
            {selectedCount > 0 ? (
              <span className="text-purple-400 font-semibold">
                {selectedCount} capsule{selectedCount !== 1 ? 's' : ''} selected
              </span>
            ) : (
              <span>No capsules selected - AI will choose automatically</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20"
            >
              {selectedCount > 0 ? 'Apply Selection' : 'Use Auto Mode'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

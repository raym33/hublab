'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, Filter, X, Package, Code, Eye, Sparkles } from 'lucide-react'
import { EXAMPLE_CAPSULES } from '@/lib/capsule-compiler/example-capsules'

interface CapsuleBrowserProps {
  onSelectCapsule?: (capsuleId: string) => void
  selectedCapsuleId?: string
}

export default function CapsuleBrowser({ onSelectCapsule, selectedCapsuleId }: CapsuleBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(EXAMPLE_CAPSULES.map(c => c.category))
    return ['all', ...Array.from(cats)]
  }, [])

  // Filter capsules
  const filteredCapsules = useMemo(() => {
    return EXAMPLE_CAPSULES.filter(capsule => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        capsule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.aiDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === 'all' || capsule.category === selectedCategory

      // Complexity filter
      const matchesComplexity = selectedComplexity === 'all' ||
        capsule.aiMetadata?.complexity === selectedComplexity

      return matchesSearch && matchesCategory && matchesComplexity
    })
  }, [searchQuery, selectedCategory, selectedComplexity])

  // Group by category
  const groupedCapsules = useMemo(() => {
    const groups: Record<string, typeof EXAMPLE_CAPSULES> = {}
    filteredCapsules.forEach(capsule => {
      if (!groups[capsule.category]) {
        groups[capsule.category] = []
      }
      groups[capsule.category].push(capsule)
    })
    return groups
  }, [filteredCapsules])

  // Memoized helper functions
  const getComplexityColor = useCallback((complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const getCategoryIcon = useCallback((category: string) => {
    const icons: Record<string, string> = {
      'ui-components': '🎨',
      'layout': '📐',
      'navigation': '🧭',
      'data-display': '📊',
      'feedback': '💬',
      'data-logic': '⚙️'
    }
    return icons[category] || '📦'
  }, [])

  // Event handlers
  const handleClearSearch = useCallback(() => setSearchQuery(''), [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedComplexity('all')
  }, [])

  const handleSelectCapsule = useCallback((capsuleId: string) => {
    onSelectCapsule?.(capsuleId)
  }, [onSelectCapsule])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Capsule Library</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredCapsules.length} of {EXAMPLE_CAPSULES.length} capsules
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Package className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Code className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search capsules by name, description, or tags..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Complexity</label>
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedComplexity !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 self-end"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Capsule Grid/List */}
      <div className="flex-1 overflow-auto p-6">
        {Object.keys(groupedCapsules).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No capsules found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          Object.entries(groupedCapsules).map(([category, capsules]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {category.replace('-', ' ')}
                </h3>
                <span className="text-sm text-gray-500">({capsules.length})</span>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {capsules.map(capsule => (
                    <div
                      key={capsule.id}
                      onClick={() => handleSelectCapsule(capsule.id)}
                      className={`
                        bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg
                        ${selectedCapsuleId === capsule.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900 text-sm">{capsule.name}</h4>
                        </div>
                        {capsule.verified && (
                          <span className="text-blue-500" title="Verified">
                            <Sparkles className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {capsule.aiDescription}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getComplexityColor(capsule.aiMetadata?.complexity || 'simple')}`}>
                          {capsule.aiMetadata?.complexity || 'simple'}
                        </span>
                        <span className="text-xs text-gray-500">
                          v{capsule.version}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {capsule.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {capsule.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{capsule.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {capsules.map(capsule => (
                    <div
                      key={capsule.id}
                      onClick={() => handleSelectCapsule(capsule.id)}
                      className={`
                        bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                        ${selectedCapsuleId === capsule.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <Package className="w-6 h-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{capsule.name}</h4>
                            <span className="text-xs text-gray-500">v{capsule.version}</span>
                            {capsule.verified && (
                              <Sparkles className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {capsule.aiDescription}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getComplexityColor(capsule.aiMetadata?.complexity || 'simple')}`}>
                              {capsule.aiMetadata?.complexity || 'simple'}
                            </span>
                            <div className="flex gap-1">
                              {capsule.tags.slice(0, 5).map(tag => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Usage</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {(capsule.usageCount / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

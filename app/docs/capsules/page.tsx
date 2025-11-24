'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { allCapsules } from '@/lib/all-capsules'
import { Capsule } from '@/types/capsule'
import { Search, Filter, X, Tag, Code, Package, ArrowLeft } from 'lucide-react'

export default function CapsulesBrowserPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get unique categories and tags
  const categories = useMemo(() => {
    const cats = new Set(allCapsules.map(c => c.category))
    return ['all', ...Array.from(cats).sort()]
  }, [])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allCapsules.forEach(c => c.tags?.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  // Filter capsules
  const filteredCapsules = useMemo(() => {
    return allCapsules.filter(capsule => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          capsule.name.toLowerCase().includes(query) ||
          capsule.description.toLowerCase().includes(query) ||
          capsule.category.toLowerCase().includes(query) ||
          capsule.tags?.some(t => t.toLowerCase().includes(query))

        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory !== 'all' && capsule.category !== selectedCategory) {
        return false
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tag =>
          capsule.tags?.includes(tag)
        )
        if (!hasAllTags) return false
      }

      return true
    })
  }, [searchQuery, selectedCategory, selectedTags])

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedTags([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Browse Capsules
              </h1>
              <p className="text-gray-600 mt-1">
                Explore {allCapsules.length.toLocaleString()} production-ready components
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">{filteredCapsules.length.toLocaleString()}</span> results
              </div>
              {(searchQuery || selectedCategory !== 'all' || selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search capsules by name, description, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div className="w-full sm:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-shadow"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              capsule={capsule}
              onTagClick={handleTagClick}
              selectedTags={selectedTags}
            />
          ))}
        </div>

        {filteredCapsules.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No capsules found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface CapsuleCardProps {
  capsule: Capsule
  onTagClick: (tag: string) => void
  selectedTags: string[]
}

function CapsuleCard({ capsule, onTagClick, selectedTags }: CapsuleCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-blue-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 text-lg">
            {capsule.name}
          </h3>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200">
            {capsule.category}
          </span>
        </div>
        <Code className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
        {capsule.description}
      </p>

      {/* Tags */}
      {capsule.tags && capsule.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {capsule.tags.slice(0, 5).map(tag => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </button>
          ))}
          {capsule.tags.length > 5 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">
              +{capsule.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span className="font-mono">v{capsule.version || '1.0.0'}</span>
        {capsule.author && (
          <span className="text-gray-400">by {capsule.author}</span>
        )}
      </div>
    </div>
  )
}

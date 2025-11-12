'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Star, Download, Package, Filter, TrendingUp, Clock, Award, Plus } from 'lucide-react'
import type { MarketplaceCapsule } from '@/lib/types/marketplace'

export default function CapsulesMarketplacePage() {
  const [capsules, setCapsules] = useState<MarketplaceCapsule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')

  const categories = [
    'all',
    'ui-components',
    'data-management',
    'layout',
    'navigation',
    'forms',
    'charts',
    'authentication',
    'api',
    'utilities'
  ]

  const complexityLevels = ['all', 'simple', 'intermediate', 'advanced']

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: Clock },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'downloads', label: 'Most Downloads', icon: Download },
    { value: 'rating', label: 'Highest Rated', icon: Award }
  ]

  useEffect(() => {
    fetchCapsules()
  }, [selectedCategory, selectedComplexity, sortBy, searchQuery])

  const fetchCapsules = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedComplexity !== 'all') params.append('complexity', selectedComplexity)
      if (searchQuery) params.append('search', searchQuery)
      params.append('sortBy', sortBy)
      params.append('limit', '50')

      const response = await fetch(`/api/marketplace/capsules?${params}`)
      const data = await response.json()

      if (data.capsules) {
        setCapsules(data.capsules)
      }
    } catch (error) {
      console.error('Error fetching capsules:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              Community Capsule Marketplace
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Discover Universal Capsules
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Browse, search, and use community-created capsules to build amazing applications faster
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search capsules by name, description, or ID..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder:text-gray-400 shadow-xl focus:ring-4 focus:ring-white/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complexity Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complexity
                </label>
                <select
                  value={selectedComplexity}
                  onChange={(e) => setSelectedComplexity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {complexityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="space-y-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          sortBy === option.value
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 inline mr-2" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Publish Your Capsule</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share your capsules with the community
              </p>
              <Link
                href="/capsules/publish"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Publish Capsule
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLoading ? 'Loading...' : `${capsules.length} Capsules Found`}
              </h2>
            </div>

            {/* Capsules Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : capsules.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No capsules found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                <Link
                  href="/capsules/publish"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Publish First Capsule
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {capsules.map((capsule) => (
                  <Link
                    key={capsule.id}
                    href={`/capsules/${capsule.id}`}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                          {capsule.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {capsule.capsule_id}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(capsule.complexity)}`}>
                        {capsule.complexity}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {capsule.ai_description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {capsule.stars_actual || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {capsule.download_count || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {capsule.avg_rating ? capsule.avg_rating.toFixed(1) : 'N/A'}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {capsule.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {capsule.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{capsule.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {capsule.author_avatar ? (
                          <img
                            src={capsule.author_avatar}
                            alt={capsule.author_name || capsule.author}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          {capsule.author_name || capsule.author}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        v{capsule.version}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockPrototypes, type Prototype } from '@/lib/mockData'
import { Search, ArrowLeft, Star, Filter } from 'lucide-react'

const CATEGORIES = ['All', 'Web App', 'Dashboard', 'Landing Page', 'Tool']
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $30', min: 0, max: 30 },
  { label: '$30 - $50', min: 30, max: 50 },
  { label: '$50 - $75', min: 50, max: 75 },
  { label: '$75+', min: 75, max: Infinity },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular')

  let filtered = mockPrototypes.filter(proto => {
    const matchSearch = proto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proto.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proto.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchCategory = selectedCategory === 'All' || proto.category === selectedCategory
    const priceRange = PRICE_RANGES[selectedPriceRange]
    const matchPrice = proto.price >= priceRange.min && proto.price <= priceRange.max
    return matchSearch && matchCategory && matchPrice
  })

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'popular':
      default:
        return b.downloads - a.downloads
    }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 text-sm font-light focus:border-gray-900 outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prototypes, technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-lg font-light"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-[240px_1fr] gap-12">
          {/* Sidebar Filters */}
          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Category
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 text-sm font-light transition-colors ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Price Range</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPriceRange(idx)}
                    className={`w-full text-left px-4 py-2 text-sm font-light transition-colors ${
                      selectedPriceRange === idx
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-600 font-light space-y-2">
                <div>{mockPrototypes.length} total prototypes</div>
                <div>{filtered.length} matching filters</div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-24 border border-gray-200">
                <p className="text-gray-900 text-lg mb-2">No prototypes found</p>
                <p className="text-gray-600 font-light">Try different filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 border border-gray-200">
                {filtered.map(proto => (
                  <Link
                    key={proto.id}
                    href={`/prototype/${proto.id}`}
                    className="group bg-white hover:bg-gray-50 transition-all duration-300 border-r border-b border-gray-200"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <Image
                        src={proto.preview_image_url!}
                        alt={proto.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 text-xs font-light">
                        {proto.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                          <span className="text-sm font-light">{proto.rating}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500 font-light">{proto.downloads} downloads</span>
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-1 group-hover:underline">
                        {proto.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light">
                        {proto.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {proto.tech_stack.slice(0, 3).map(tech => (
                          <span key={tech} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 font-light">
                            {tech}
                          </span>
                        ))}
                        {proto.tech_stack.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 font-light">
                            +{proto.tech_stack.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-2xl font-light text-gray-900">
                          ${proto.price}
                        </div>
                      </div>
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
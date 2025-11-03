'use client'

import { useState } from 'react'
import { Zap, Search, Library, Star, Sparkles, LayoutTemplate } from 'lucide-react'
import IntelligentCapsuleSearch from './IntelligentCapsuleSearch'
import VisualTemplateGallery from './VisualTemplateGallery'

interface Capsule {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  code?: string
  popularity?: number
}

interface ImprovedStudioSidebarProps {
  capsules: Capsule[]
  onSelectCapsule: (capsule: Capsule) => void
  onSelectTemplate: (template: any) => void
  onDragStart: (event: React.DragEvent, capsule: Capsule) => void
  canvasContext?: {
    existingCapsules: string[]
    currentCategory?: string
  }
}

type TabType = 'templates' | 'search' | 'library' | 'favorites'

export default function ImprovedStudioSidebar({
  capsules,
  onSelectCapsule,
  onSelectTemplate,
  onDragStart,
  canvasContext
}: ImprovedStudioSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])

  const tabs = [
    {
      id: 'templates' as TabType,
      name: 'Templates',
      icon: LayoutTemplate,
      description: 'Starter Kits',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'search' as TabType,
      name: 'Búsqueda',
      icon: Sparkles,
      description: 'AI + Filtros',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'library' as TabType,
      name: 'Biblioteca',
      icon: Library,
      description: 'Todas',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'favorites' as TabType,
      name: 'Favoritos',
      icon: Star,
      description: 'Guardados',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ]

  const categories = ['all', ...Array.from(new Set(capsules.map(c => c.category)))]

  const filteredCapsules = capsules.filter(capsule => {
    const matchesSearch = !searchQuery ||
      capsule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || capsule.category === selectedCategory
    const matchesFavorites = activeTab !== 'favorites' || favorites.includes(capsule.id)
    return matchesSearch && matchesCategory && matchesFavorites
  })

  const toggleFavorite = (capsuleId: string) => {
    setFavorites(prev =>
      prev.includes(capsuleId)
        ? prev.filter(id => id !== capsuleId)
        : [...prev, capsuleId]
    )
  }

  const handleCapsuleSelect = (capsule: Capsule) => {
    onSelectCapsule(capsule)
  }

  return (
    <div className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Studio V2</h1>
        </div>
        <p className="text-xs text-gray-600">
          {canvasContext?.existingCapsules.length || 0} cápsulas en el canvas
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 transition ${
                isActive
                  ? `${tab.bgColor} ${tab.color} border-b-2 border-current`
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Badge - Description */}
      <div className={`px-4 py-2 text-xs font-medium border-b ${
        tabs.find(t => t.id === activeTab)?.bgColor
      } ${tabs.find(t => t.id === activeTab)?.color}`}>
        {tabs.find(t => t.id === activeTab)?.description}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'templates' && (
          <VisualTemplateGallery onSelectTemplate={onSelectTemplate} />
        )}

        {activeTab === 'search' && (
          <IntelligentCapsuleSearch
            capsules={capsules}
            onSelectCapsule={handleCapsuleSelect}
            canvasContext={canvasContext}
          />
        )}

        {activeTab === 'library' && (
          <div className="h-full flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en biblioteca..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Todas las categorías' : cat}
                  </option>
                ))}
              </select>

              <div className="text-xs text-gray-500">
                {filteredCapsules.length} cápsula{filteredCapsules.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Capsules List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredCapsules.map(capsule => (
                  <div
                    key={capsule.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, capsule)}
                    onClick={() => handleCapsuleSelect(capsule)}
                    className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition cursor-move group"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600">
                        {capsule.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(capsule.id)
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.includes(capsule.id)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {capsule.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-medium">
                        {capsule.category}
                      </span>
                      <span className="text-[10px] text-gray-500">Arrastra al canvas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                {favorites.length === 0
                  ? 'No tienes favoritos guardados'
                  : `${favorites.length} cápsula${favorites.length !== 1 ? 's' : ''} favorita${favorites.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin favoritos</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Marca cápsulas como favoritas para acceso rápido
                  </p>
                  <button
                    onClick={() => setActiveTab('library')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Explorar Biblioteca
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredCapsules.map(capsule => (
                    <div
                      key={capsule.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, capsule)}
                      onClick={() => handleCapsuleSelect(capsule)}
                      className="p-3 bg-white border-2 border-yellow-200 rounded-lg hover:border-yellow-400 hover:shadow-md transition cursor-move group"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600">
                          {capsule.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(capsule.id)
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {capsule.description}
                      </p>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-medium">
                        {capsule.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{capsules.length}</div>
            <div className="text-[10px] text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">{favorites.length}</div>
            <div className="text-[10px] text-gray-600">Favoritos</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{canvasContext?.existingCapsules.length || 0}</div>
            <div className="text-[10px] text-gray-600">En Uso</div>
          </div>
        </div>
      </div>
    </div>
  )
}

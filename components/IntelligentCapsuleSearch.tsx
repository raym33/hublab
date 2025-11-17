'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Sparkles, TrendingUp, Clock, Star, Zap, Filter, X, ChevronDown, Box } from 'lucide-react'
import CapsuleTagBadge from './CapsuleTagBadge'

interface Capsule {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  popularity?: number
  preview?: string
}

interface IntelligentCapsuleSearchProps {
  capsules: Capsule[]
  onSelectCapsule: (capsule: Capsule) => void
  canvasContext?: {
    existingCapsules: string[]
    currentCategory?: string
  }
}

export default function IntelligentCapsuleSearch({
  capsules,
  onSelectCapsule,
  canvasContext
}: IntelligentCapsuleSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'relevance' | 'popular' | 'recent' | 'name'>('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Capsule[]>([])
  const [isAskingAI, setIsAskingAI] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Categorías con íconos y colores
  const categories = [
    { name: 'UI', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '🎨' },
    { name: 'Form', color: 'bg-green-100 text-green-700 border-green-300', icon: '📝' },
    { name: 'DataViz', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: '📊' },
    { name: 'Media', color: 'bg-pink-100 text-pink-700 border-pink-300', icon: '🎬' },
    { name: 'AI', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: '🤖' },
    { name: 'Animation', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: '✨' },
    { name: 'Interaction', color: 'bg-indigo-100 text-indigo-700 border-indigo-300', icon: '👆' },
    { name: 'Utility', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '🔧' }
  ]

  // Filtrar y ordenar cápsulas
  const filteredCapsules = capsules
    .filter(capsule => {
      // Filtro de búsqueda
      const matchesSearch = !searchQuery ||
        capsule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Filtro de categorías
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.includes(capsule.category)

      // Filtro de tags
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => capsule.tags.some(t => t.toLowerCase() === tag.toLowerCase()))

      return matchesSearch && matchesCategory && matchesTags
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'recent':
          return b.id.localeCompare(a.id) // Assuming newer IDs are higher
        default: // relevance
          // Priorizar matches exactos en nombre
          const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0
          const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0
          if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch
          return (b.popularity || 0) - (a.popularity || 0)
      }
    })

  // Generar recomendaciones basadas en contexto
  const contextualRecommendations = capsules
    .filter(capsule => {
      if (!canvasContext?.existingCapsules?.length) return false

      // Recomendar cápsulas complementarias
      const hasForm = canvasContext.existingCapsules.some(c => c.includes('form'))
      const hasChart = canvasContext.existingCapsules.some(c => c.includes('chart'))
      const hasButton = canvasContext.existingCapsules.some(c => c.includes('button'))

      if (hasForm && capsule.category === 'Form') return true
      if (hasChart && capsule.category === 'DataViz') return true
      if (hasButton && capsule.tags.includes('interaction')) return true

      return false
    })
    .slice(0, 5)

  // Búsqueda con AI
  const handleAISearch = async () => {
    if (!aiQuery.trim()) return

    setIsAskingAI(true)
    try {
      const response = await fetch('/api/canvas-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `I want to build: ${aiQuery}. Which capsules should I use? Just list 3-5 capsule names.` }
          ],
          context: {
            nodeCount: canvasContext?.existingCapsules?.length || 0,
            capsules: canvasContext?.existingCapsules || []
          }
        })
      })

      const data = await response.json()

      // Parsear respuesta de AI y encontrar cápsulas coincidentes
      const suggestedNames = data.message.match(/[A-Z][a-z]+(?:[A-Z][a-z]+)*/g) || []
      const suggested = capsules.filter(c =>
        suggestedNames.some((name: string) => c.name.toLowerCase().includes(name.toLowerCase()))
      )

      setAiSuggestions(suggested.slice(0, 6))
    } catch (error) {
      console.error('AI search error:', error)
    } finally {
      setIsAskingAI(false)
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedTags([])
    setAiSuggestions([])
    setAiQuery('')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header con búsqueda inteligente */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cápsulas... (ej: 'button', 'form', 'chart')"
              className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition ${
              showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* AI Search Box */}
        <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Pregunta al AI Assistant</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
              placeholder="¿Qué quieres crear? Ej: 'un formulario de contacto con validación'"
              className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAISearch}
              disabled={isAskingAI || !aiQuery.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm font-medium flex items-center gap-2"
            >
              {isAskingAI ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Pensando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            {/* Categorías */}
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Categorías</div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => toggleCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition ${
                      selectedCategories.includes(cat.name)
                        ? cat.color
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordenar por */}
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Ordenar por</div>
              <div className="flex gap-2">
                {[
                  { value: 'relevance', label: 'Relevancia', icon: Zap },
                  { value: 'popular', label: 'Popularidad', icon: TrendingUp },
                  { value: 'recent', label: 'Recientes', icon: Clock },
                  { value: 'name', label: 'Nombre', icon: Box }
                ].map(option => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 ${
                        sortBy === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {(searchQuery || selectedCategories.length > 0 || aiSuggestions.length > 0) && (
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Resultados count */}
        <div className="mt-3 text-xs text-gray-500">
          {filteredCapsules.length} cápsula{filteredCapsules.length !== 1 ? 's' : ''} encontrada{filteredCapsules.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Sugerencias de AI */}
      {aiSuggestions.length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Sugerencias del AI</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {aiSuggestions.map(capsule => (
              <button
                key={capsule.id}
                onClick={() => onSelectCapsule(capsule)}
                className="p-3 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition text-left"
              >
                <div className="font-semibold text-sm text-gray-900 mb-1">{capsule.name}</div>
                <div className="text-xs text-gray-600 line-clamp-2">{capsule.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones contextuales */}
      {contextualRecommendations.length > 0 && !searchQuery && (
        <div className="p-4 bg-green-50 border-b border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-900">Recomendado para tu proyecto</span>
          </div>
          <div className="space-y-2">
            {contextualRecommendations.map(capsule => (
              <button
                key={capsule.id}
                onClick={() => onSelectCapsule(capsule)}
                className="w-full p-2 bg-white rounded-lg border border-green-200 hover:border-green-400 hover:shadow-sm transition text-left flex items-start gap-2"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{capsule.name}</div>
                  <div className="text-xs text-gray-600">{capsule.description}</div>
                </div>
                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lista de cápsulas */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCapsules.length === 0 ? (
          <div className="text-center py-12">
            <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron cápsulas</h3>
            <p className="text-sm text-gray-600 mb-4">
              Intenta cambiar los filtros o usar términos de búsqueda diferentes
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredCapsules.map(capsule => {
              const categoryInfo = categories.find(c => c.name === capsule.category)
              return (
                <button
                  key={capsule.id}
                  onClick={() => onSelectCapsule(capsule)}
                  className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                        {capsule.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryInfo?.color || 'bg-gray-100 text-gray-700'}`}>
                          {categoryInfo?.icon} {capsule.category}
                        </span>
                        {capsule.popularity && capsule.popularity > 50 && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <TrendingUp className="w-3 h-3" />
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{capsule.description}</p>
                  {capsule.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {capsule.tags.slice(0, 4).map(tag => (
                        <CapsuleTagBadge
                          key={tag}
                          tag={tag}
                          variant={selectedTags.includes(tag) ? 'active' : 'clickable'}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTag(tag)
                          }}
                        />
                      ))}
                      {capsule.tags.length > 4 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          +{capsule.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

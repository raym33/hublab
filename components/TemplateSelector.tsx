'use client'

import { useState } from 'react'
import { X, Search, Sparkles, Zap } from 'lucide-react'
import { APP_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, type AppTemplate } from '@/lib/capsule-compiler/templates'

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: AppTemplate) => void
}

export default function TemplateSelector({
  isOpen,
  onClose,
  onSelectTemplate
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  // Filter templates
  const categoryTemplates = getTemplatesByCategory(selectedCategory)
  const filteredTemplates = searchQuery
    ? categoryTemplates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categoryTemplates

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Template Gallery</h2>
              <p className="text-sm text-gray-400">Start with a professional template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="bg-black/10 border-b border-white/10 px-6 py-4">
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No templates found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template)
                    onClose()
                  }}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl p-5 text-left transition-all hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
                >
                  {/* Icon & Difficulty */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                      {template.icon}
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {template.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <Zap className="w-3 h-3 text-purple-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {template.features.length > 3 && (
                      <p className="text-xs text-gray-500 pl-5">
                        +{template.features.length - 3} more features
                      </p>
                    )}
                  </div>

                  {/* Use Template Button */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-purple-400 group-hover:text-purple-300">
                      <Sparkles className="w-4 h-4" />
                      Use Template
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/20 border-t border-white/10 px-6 py-4">
          <p className="text-sm text-gray-400 text-center">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </div>
    </div>
  )
}

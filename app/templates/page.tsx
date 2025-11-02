'use client'

import Link from 'next/link'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates'
import { Clock, Code2, Zap, Download, ExternalLink, ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty
    return matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Starter Templates</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Production-ready templates for common use cases. Start building in seconds with pre-configured components, integrations, and best practices.
          </p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">{TEMPLATES.length}+</div>
              <div className="text-sm text-blue-100">Templates</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">15min</div>
              <div className="text-sm text-blue-100">Avg Setup Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm text-blue-100">Customizable</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">Free</div>
              <div className="text-sm text-blue-100">Open Source</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
              >
                {/* Thumbnail */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-48 flex items-center justify-center border-b border-gray-200">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-gray-600">Preview Image</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {template.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      template.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-700'
                        : template.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {template.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Code2 className="w-4 h-4" />
                      <span>{template.features.length} features</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {template.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {template.techStack.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          {tech}
                        </span>
                      ))}
                      {template.techStack.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{template.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/studio-v2?template=${template.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                    >
                      <Zap className="w-4 h-4" />
                      Use Template
                    </Link>
                    {template.codeUrl && (
                      <a
                        href={template.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
                      >
                        <Code2 className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Choose a template and start building your application in minutes.
            All templates are production-ready and fully customizable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/studio-v2"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              Launch Studio
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/examples"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white rounded-lg border-2 border-white/30 hover:bg-blue-500/30 transition font-semibold"
            >
              View Code Examples
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

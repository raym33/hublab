'use client'

import { useState } from 'react'
import { Package, Sparkles, ArrowRight, Clock, Code } from 'lucide-react'
import CapsuleBrowser from '@/components/CapsuleBrowser'
import CompositionVisualizer from '@/components/CompositionVisualizer'
import { TEMPLATE_METADATA, getTemplate } from '@/lib/capsule-compiler/example-templates'
import { EXAMPLE_CAPSULES, getCapsule } from '@/lib/capsule-compiler/example-capsules'

export default function ExplorePage() {
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'templates' | 'capsules' | 'visualizer'>('templates')

  const selectedCapsule = selectedCapsuleId ? getCapsule(selectedCapsuleId) : null
  const selectedTemplateData = selectedTemplate ? getTemplate(selectedTemplate) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Capsules</h1>
              <p className="text-gray-600 mt-1">
                Browse 68 production-ready components and 6 app templates
              </p>
            </div>
            <a
              href="/compiler"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Building
            </a>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('templates')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                viewMode === 'templates'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Templates
            </button>
            <button
              onClick={() => setViewMode('capsules')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                viewMode === 'capsules'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Code className="w-5 h-5 inline mr-2" />
              All Capsules
            </button>
            {selectedTemplateData && (
              <button
                onClick={() => setViewMode('visualizer')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  viewMode === 'visualizer'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Visualize
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'templates' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">App Templates</h2>
              <p className="text-gray-600">
                Start with a pre-built template and customize it to your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATE_METADATA.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setViewMode('visualizer')
                  }}
                  className={`
                    bg-white rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-105
                    ${selectedTemplate === template.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{template.icon}</div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      template.complexity === 'simple' ? 'bg-green-100 text-green-800' :
                      template.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {template.complexity}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {template.capsules} capsules
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {template.category}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                      View Composition
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-8 text-center">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Or Start from Scratch
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Describe your app in natural language and let Claude AI compose the perfect combination of capsules for you
              </p>
              <a
                href="/compiler"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Generate Custom App
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}

        {viewMode === 'capsules' && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
            <CapsuleBrowser
              onSelectCapsule={setSelectedCapsuleId}
              selectedCapsuleId={selectedCapsuleId || undefined}
            />

            {selectedCapsule && (
              <div className="border-t border-gray-200 bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Package className="w-8 h-8 text-blue-600" />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedCapsule.name}</h2>
                          <p className="text-sm text-gray-600">v{selectedCapsule.version} • {selectedCapsule.category}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{selectedCapsule.aiDescription}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Inputs</p>
                          <p className="font-semibold text-gray-900">{selectedCapsule.inputs.length} parameters</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Outputs</p>
                          <p className="font-semibold text-gray-900">{selectedCapsule.outputs.length} values</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Complexity</p>
                          <p className="font-semibold text-gray-900 capitalize">{selectedCapsule.aiMetadata?.complexity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Usage</p>
                          <p className="font-semibold text-gray-900">{(selectedCapsule.usageCount / 1000).toFixed(0)}K times</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCapsule.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-64">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Usage Examples</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {selectedCapsule.aiMetadata?.usageExamples.map((example, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-blue-600">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedCapsule.aiMetadata?.relatedCapsules && selectedCapsule.aiMetadata.relatedCapsules.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Related Capsules</h4>
                          <div className="space-y-2">
                            {selectedCapsule.aiMetadata.relatedCapsules.map(relatedId => (
                              <button
                                key={relatedId}
                                onClick={() => setSelectedCapsuleId(relatedId)}
                                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                {relatedId}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'visualizer' && selectedTemplateData && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedTemplateData.name} Composition
                </h2>
                <p className="text-gray-600">
                  Visual representation of how capsules connect
                </p>
              </div>
              <button
                onClick={() => setViewMode('templates')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Templates
              </button>
            </div>

            <CompositionVisualizer
              composition={selectedTemplateData}
              onNodeClick={(nodeId) => {
                const node = selectedTemplateData.capsules.find(c => c.id === nodeId)
                if (node) {
                  setSelectedCapsuleId(node.capsuleId)
                }
              }}
              className="h-[700px]"
            />

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Capsules</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{selectedTemplateData.capsules.length}</p>
                <p className="text-sm text-gray-600">Total components</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Connections</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{selectedTemplateData.connections.length}</p>
                <p className="text-sm text-gray-600">Data flows</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Build Time</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">~2s</p>
                <p className="text-sm text-gray-600">Estimated</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/compiler"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Use This Template
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

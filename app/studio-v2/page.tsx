'use client'

import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Eye, Code2, Download } from 'lucide-react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { allCapsules } from '@/lib/all-capsules'
import ImprovedStudioSidebar from '@/components/ImprovedStudioSidebar'
import type { Capsule } from '@/types/capsule'

interface CapsuleDef {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  code?: string
  props?: any[]
  dependencies?: string[]
  platform?: string
}

function StudioV2Inner() {
  const { screenToFlowPosition } = useReactFlow()
  const searchParams = useSearchParams()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleDef | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [aiMessages, setAiMessages] = useState<Array<{role: string, content: string}>>([])
  const [aiInput, setAiInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Load template from URL parameter
  useEffect(() => {
    const template = searchParams?.get('template')
    if (!template) return

    // Define template capsule combinations
    const templates: Record<string, string[]> = {
      // Existing templates
      'landing-page-saas': ['hero', 'features-grid', 'pricing-table', 'cta-section', 'footer'],
      'dashboard-analytics': ['stat-card', 'line-chart', 'bar-chart', 'data-table'],
      'ecommerce-store': ['product-grid', 'shopping-cart', 'checkout-form', 'product-card'],

      // New templates
      'admin-panel': ['sidebar', 'data-table', 'stat-card', 'user-list', 'settings-panel'],
      'blog': ['blog-header', 'blog-post-card', 'blog-sidebar', 'comment-section', 'author-bio'],
      'portfolio': ['portfolio-hero', 'project-grid', 'about-section', 'skills-section', 'contact-form'],
      'crm-dashboard': ['contact-list', 'deal-pipeline', 'activity-feed', 'revenue-chart', 'task-board'],
      'social-media': ['post-feed', 'user-profile', 'story-carousel', 'notifications', 'chat-widget'],
      'booking-system': ['calendar', 'time-slots', 'booking-form', 'confirmation', 'availability-grid'],
      'learning-platform': ['course-grid', 'video-player', 'progress-tracker', 'quiz-component', 'certificate'],
      'restaurant-menu': ['menu-header', 'category-tabs', 'dish-card', 'cart-widget', 'order-summary']
    }

    const capsuleIds = templates[template]
    if (!capsuleIds) return

    // Find and add capsules to canvas
    const templateNodes: Node[] = capsuleIds.map((id, index) => {
      const capsule = allCapsules.find(c => c.id === id || c.name.toLowerCase().includes(id.toLowerCase()))
      if (!capsule) return null

      return {
        id: `${capsule.id}-${Date.now()}-${index}`,
        type: 'default',
        position: { x: 100, y: 100 + (index * 120) },
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold text-sm">{capsule.name}</div>
              <div className="text-xs text-gray-500 mt-1">{capsule.category}</div>
            </div>
          ),
          capsule
        },
      }
    }).filter(Boolean) as Node[]

    setNodes(templateNodes)
  }, [searchParams, setNodes])

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(allCapsules.map(c => c.category)))]

  // Filter capsules
  const filteredCapsules = allCapsules.filter(capsule => {
    const matchesSearch = capsule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         capsule.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || capsule.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Handle drag start from capsule library
  const onDragStart = (event: React.DragEvent, capsule: CapsuleDef) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(capsule))
    event.dataTransfer.effectAllowed = 'move'
  }

  // Handle drop on canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const capsuleData = event.dataTransfer.getData('application/reactflow')
      if (!capsuleData || !reactFlowWrapper.current) return

      const capsule = JSON.parse(capsuleData)

      // Use ReactFlow's coordinate transformation
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: `${capsule.id}-${Date.now()}`,
        type: 'default',
        position,
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold text-sm">{capsule.name}</div>
              <div className="text-xs text-gray-500 mt-1">{capsule.category}</div>
            </div>
          ),
          capsule
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Export functionality
  const exportProject = () => {
    const project = {
      nodes,
      edges,
      capsules: nodes.map(node => node.data.capsule),
      timestamp: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `studio-project-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Generate code from all capsules
  const generateCode = () => {
    const componentCode: string[] = []

    nodes.forEach(node => {
      const capsule = node.data.capsule
      if (capsule && capsule.code) {
        componentCode.push(`// ${capsule.name}`)
        componentCode.push(capsule.code)
        componentCode.push('')
      }
    })

    const fullCode = `'use client'\n\nimport React from 'react'\n\n${componentCode.join('\n')}\n\nexport default function GeneratedApp() {\n  return (\n    <div className="min-h-screen p-4">\n      {/* Add your generated components here */}\n    </div>\n  )\n}`

    return fullCode
  }

  const copyCode = () => {
    const code = generateCode()
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  // Export to GitHub
  const exportToGitHub = async () => {
    const repoName = prompt('Enter GitHub repository name (e.g., my-hublab-project):')
    if (!repoName) return

    const confirmCreate = confirm(`This will create a new GitHub repository called "${repoName}" and push your code. Continue?`)
    if (!confirmCreate) return

    try {
      const response = await fetch('/api/github-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName,
          code: generateCode(),
          project: {
            nodes,
            edges,
            capsules: nodes.map(n => n.data.capsule?.name).filter(Boolean)
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Success! Repository created at: ${data.repoUrl}`)
        window.open(data.repoUrl, '_blank')
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || 'Failed to export to GitHub'}`)
      }
    } catch (error) {
      console.error('GitHub Export Error:', error)
      alert('Failed to export to GitHub. Please try again.')
    }
  }

  // AI Assistant
  const sendAIMessage = async () => {
    if (!aiInput.trim() || isAiLoading) return

    const userMessage = { role: 'user', content: aiInput }
    setAiMessages(prev => [...prev, userMessage])
    setAiInput('')
    setIsAiLoading(true)

    try {
      // Build context about current canvas state
      const canvasContext = {
        nodeCount: nodes.length,
        capsules: nodes.map(n => n.data.capsule?.name).filter(Boolean),
        categories: [...new Set(nodes.map(n => n.data.capsule?.category).filter(Boolean))],
        availableTemplates: ['landing-page-saas', 'dashboard-analytics', 'ecommerce-store', 'admin-panel', 'blog', 'portfolio', 'crm-dashboard', 'social-media', 'booking-system', 'learning-platform', 'restaurant-menu']
      }

      const response = await fetch('/api/canvas-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...aiMessages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          context: canvasContext
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      } else {
        setAiMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }])
      }
    } catch (error) {
      console.error('AI Error:', error)
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleSelectCapsule = (capsule: Capsule) => {
    setSelectedCapsule(capsule as CapsuleDef)
  }

  const handleSelectTemplate = (template: any) => {
    // Load template capsules onto canvas
    const capsuleIds = template.capsules
    const templateNodes: Node[] = capsuleIds.map((id: string, index: number) => {
      const capsule = allCapsules.find(c => c.id === id || c.name.toLowerCase().includes(id.toLowerCase()))
      if (!capsule) return null

      return {
        id: `${capsule.id}-${Date.now()}-${index}`,
        type: 'default',
        position: { x: 100 + (index % 3) * 250, y: 100 + Math.floor(index / 3) * 150 },
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold text-sm">{capsule.name}</div>
              <div className="text-xs text-gray-500 mt-1">{capsule.category}</div>
            </div>
          ),
          capsule
        },
      }
    }).filter(Boolean) as Node[]

    setNodes(templateNodes)
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* New Improved Sidebar */}
      <ImprovedStudioSidebar
        capsules={allCapsules as any}
        onSelectCapsule={handleSelectCapsule}
        onSelectTemplate={handleSelectTemplate}
        onDragStart={onDragStart}
        canvasContext={{
          existingCapsules: nodes.map(n => n.data.capsule?.id).filter(Boolean),
          currentCategory: selectedCategory
        }}
      />

      {/* Main Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          className="bg-gray-50"
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls className="bg-white border border-gray-300 rounded-lg shadow-lg" />
          <MiniMap
            className="bg-white border border-gray-300 rounded-lg shadow-lg"
            nodeColor="#3b82f6"
          />

          {/* Info Panel */}
          <Panel position="top-right" className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 m-2">
            <div className="text-xs space-y-1">
              <div className="font-semibold text-gray-900">Canvas Info</div>
              <div className="text-gray-600">Nodes: {nodes.length}</div>
              <div className="text-gray-600">Edges: {edges.length}</div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* AI Assistant Sidebar */}
      {showAIAssistant && (
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiMessages.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Ask me anything about capsules!</p>
                <p className="text-xs mt-1">I can help you build your app</p>
              </div>
            )}

            {aiMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-100 text-blue-900 ml-8'
                    : 'bg-gray-100 text-gray-900 mr-8'
                }`}
              >
                <div className="text-xs font-semibold mb-1 text-gray-600">
                  {msg.role === 'user' ? 'You' : 'AI'}
                </div>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}

            {isAiLoading && (
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg mr-8">
                <div className="text-xs font-semibold mb-1 text-gray-600">AI</div>
                <div className="text-sm">Thinking...</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                placeholder="Type your message here..."
                disabled={isAiLoading}
                className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <button
                onClick={sendAIMessage}
                disabled={isAiLoading || !aiInput.trim()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Export Project</h2>
              <p className="text-sm text-gray-600 mt-1">Download or copy your code</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Project Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">Project Summary</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Capsules:</span>
                    <span className="font-semibold text-gray-900 ml-2">{nodes.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Connections:</span>
                    <span className="font-semibold text-gray-900 ml-2">{edges.length}</span>
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Generated Code Preview</div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto max-h-64">
                  {generateCode()}
                </pre>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={copyCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Copy Code
                </button>
                <button
                  onClick={exportProject}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Download JSON
                </button>
                <button
                  onClick={exportToGitHub}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Push to GitHub
                </button>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Live Preview</h2>
                <p className="text-sm text-gray-600 mt-1">Real-time rendering of your components</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-8 min-h-[400px]">
                <div className="space-y-6">
                  {nodes.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">No components to preview</p>
                      <p className="text-sm mt-2">Add capsules to the canvas to see them here</p>
                    </div>
                  ) : (
                    nodes.map((node, index) => (
                      <div key={node.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{node.data.capsule?.name}</h3>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{node.data.capsule?.category}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">{node.data.capsule?.description}</div>
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded p-6 text-center border border-gray-200">
                          <div className="text-gray-500 text-sm">Component Preview</div>
                          <div className="mt-2 text-gray-700 font-mono text-xs">&lt;{node.data.capsule?.name} /&gt;</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 bg-gray-50">
              <button
                onClick={copyCode}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                Copy Code
              </button>
              <button
                onClick={() => {
                  setShowPreview(false)
                  setShowExportModal(true)
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Full Project
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capsule Details Panel - Desktop */}
      {selectedCapsule && !showAIAssistant && (
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Capsule Details</h2>
            <button
              onClick={() => setSelectedCapsule(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCapsule.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedCapsule.description}</p>

            <div className="mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                {selectedCapsule.category}
              </span>
            </div>

            {selectedCapsule.props && selectedCapsule.props.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Props ({selectedCapsule.props.length}):</div>
                <div className="space-y-2">
                  {selectedCapsule.props.map((prop: any, idx: number) => (
                    <div key={idx} className="text-xs bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{prop.name}</span>
                        <span className="text-gray-500">({prop.type})</span>
                        {prop.required && <span className="text-red-600">*required</span>}
                      </div>
                      {prop.description && (
                        <div className="text-gray-600 mt-1">{prop.description}</div>
                      )}
                      {prop.default !== undefined && (
                        <div className="text-blue-600 mt-1">Default: {JSON.stringify(prop.default)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCapsule.code && (
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Code Preview:</div>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto max-h-64">
                  {selectedCapsule.code}
                </pre>
              </div>
            )}

            <button
              onClick={() => setSelectedCapsule(null)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Capsule Details Modal - Mobile */}
      {selectedCapsule && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-40"
          onClick={() => setSelectedCapsule(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCapsule.name}</h3>
              <p className="text-sm text-gray-600">{selectedCapsule.description}</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {selectedCapsule.props && selectedCapsule.props.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Props:</div>
                  <div className="space-y-2">
                    {selectedCapsule.props.map((prop: any, idx: number) => (
                      <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                        <span className="font-semibold text-gray-900">{prop.name}</span>
                        <span className="text-gray-600 ml-2">({prop.type})</span>
                        {prop.required && <span className="text-red-600 ml-1">*</span>}
                        {prop.description && (
                          <div className="text-gray-600 mt-1">{prop.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedCapsule(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StudioV2Page() {
  return (
    <ReactFlowProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Studio V2...</p>
          </div>
        </div>
      }>
        <StudioV2Inner />
      </Suspense>
    </ReactFlowProvider>
  )
}

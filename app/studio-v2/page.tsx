'use client'

import React, { useState, useCallback, useRef } from 'react'
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
import { ALL_CAPSULES } from '@/lib/capsules-v2/definitions-extended'

interface CapsuleDef {
  id: string
  name: string
  description: string
  category: string
  props?: any[]
  code?: string
}

function StudioV2Inner() {
  const { screenToFlowPosition } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleDef | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMessages, setAiMessages] = useState<Array<{role: string, content: string}>>([])
  const [aiInput, setAiInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(ALL_CAPSULES.map(c => c.category)))]

  // Filter capsules
  const filteredCapsules = ALL_CAPSULES.filter(capsule => {
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

  // AI Assistant
  const sendAIMessage = async () => {
    if (!aiInput.trim() || isAiLoading) return

    const userMessage = { role: 'user', content: aiInput }
    setAiMessages(prev => [...prev, userMessage])
    setAiInput('')
    setIsAiLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...aiMessages, userMessage],
          context: {
            currentCapsules: nodes.map(n => n.data.capsule?.name || 'Unknown'),
            availableCapsules: ALL_CAPSULES.map(c => c.name)
          }
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

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Sidebar - Capsule Library */}
      <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Studio V2</h1>
          <p className="text-sm text-gray-600">Drag capsules to canvas</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search capsules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="px-4 py-2 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Capsule List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCapsules.map(capsule => (
            <div
              key={capsule.id}
              draggable
              onDragStart={(e) => onDragStart(e, capsule)}
              onClick={() => setSelectedCapsule(capsule)}
              className={`p-3 bg-white border-2 rounded-lg cursor-move hover:shadow-md transition-all ${
                selectedCapsule?.id === capsule.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold text-sm text-gray-900">{capsule.name}</div>
              <div className="text-xs text-gray-500 mt-1">{capsule.description}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {capsule.category}
                </span>
                {capsule.props && (
                  <span className="text-xs text-gray-400">
                    {capsule.props.length} props
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredCapsules.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No capsules found</p>
              <p className="text-xs mt-1">Try a different search or category</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            {showAIAssistant ? 'Hide' : 'Show'} AI Assistant
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Export / Generate Code
          </button>
          <button
            onClick={() => { setNodes([]); setEdges([]) }}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Clear Canvas
          </button>
        </div>
      </div>

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

            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyCode}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Copy Code
              </button>
              <button
                onClick={exportProject}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Download JSON
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capsule Details Modal */}
      {selectedCapsule && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-40 lg:hidden"
          onClick={() => setSelectedCapsule(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCapsule.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedCapsule.description}</p>

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

            <button
              onClick={() => setSelectedCapsule(null)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StudioV2Page() {
  return (
    <ReactFlowProvider>
      <StudioV2Inner />
    </ReactFlowProvider>
  )
}

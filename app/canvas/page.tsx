'use client'

import React, { useCallback, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { getAllCapsulesExtended } from '@/lib/capsules-v2/definitions-extended'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function CanvasPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCode, setShowCode] = useState(false)

  // AI Assistant state
  const [showAssistant, setShowAssistant] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant. Tell me what app you want to build and I\'ll help you choose the right capsules and connect them together. What would you like to create?'
    }
  ])
  const [userInput, setUserInput] = useState('')
  const [isAssistantThinking, setIsAssistantThinking] = useState(false)

  const allCapsules = getAllCapsulesExtended()

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(allCapsules.map(c => c.category)))]

  // Filter capsules
  const filteredCapsules = allCapsules.filter(capsule => {
    const matchesCategory = selectedCategory === 'all' || capsule.category === selectedCategory
    const matchesSearch = capsule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capsule.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

  const onDragStart = (event: React.DragEvent, capsule: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(capsule))
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const capsuleData = event.dataTransfer.getData('application/reactflow')
      if (!capsuleData) return

      const capsule = JSON.parse(capsuleData)
      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      }

      const nodeId = `${capsule.id}-${Date.now()}`

      // Color based on category
      const categoryColors: Record<string, string> = {
        ui: '#3B82F6',
        layout: '#8B5CF6',
        interaction: '#EC4899',
        animation: '#F59E0B',
        media: '#10B981',
        dataviz: '#06B6D4',
        form: '#6366F1',
        utility: '#84CC16',
        ai: '#F43F5E',
      }

      const newNode: Node = {
        id: nodeId,
        type: 'default',
        position,
        data: {
          label: (
            <div className="flex flex-col items-center gap-1 px-4 py-2">
              <div className="text-sm font-bold text-white">{capsule.name}</div>
              <div className="text-xs text-white/70">{capsule.category}</div>
            </div>
          ),
          capsule,
        },
        style: {
          background: categoryColors[capsule.category] || '#6B7280',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          minWidth: '180px',
          cursor: 'pointer',
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const generateReactCode = () => {
    let code = `// Generated React Component from Canvas\n`
    code += `import React from 'react'\n\n`
    code += `export default function MyApp() {\n`
    code += `  return (\n`
    code += `    <div className="min-h-screen bg-gray-50 p-8">\n`

    nodes.forEach(node => {
      const capsule = node.data.capsule
      code += `      {/* ${capsule.name} - ${capsule.description} */}\n`
      code += `      <div className="mb-4">\n`

      // Add component code with default props
      const propsString = (capsule.props || [])
        .map((p: any) => `${p.name}={${JSON.stringify(p.default || '')}}`)
        .join(' ')

      code += `        <${capsule.name} ${propsString} />\n`
      code += `      </div>\n\n`
    })

    code += `    </div>\n`
    code += `  )\n`
    code += `}\n`

    return code
  }

  const sendMessage = async () => {
    if (!userInput.trim() || isAssistantThinking) return

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userInput.trim()
    }

    setChatMessages(prev => [...prev, newUserMessage])
    setUserInput('')
    setIsAssistantThinking(true)

    try {
      const response = await fetch('/api/canvas-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, newUserMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      const data = await response.json()

      if (data.message) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message
        }])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error: any) {
      console.error('Assistant error:', error)
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setIsAssistantThinking(false)
    }
  }

  return (
    <div className="h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 text-white p-4 overflow-y-auto border-r-2 border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">🎨 Capsule Canvas</h2>
          <p className="text-sm text-gray-400">{allCapsules.length} capsules available</p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search capsules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full mb-4 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()} {cat !== 'all' && `(${allCapsules.filter(c => c.category === cat).length})`}
            </option>
          ))}
        </select>

        {/* Capsules List */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 mb-2">
            Showing {filteredCapsules.length} capsules
          </div>
          {filteredCapsules.map((capsule) => (
            <div
              key={capsule.id}
              draggable
              onDragStart={(e) => onDragStart(e, capsule)}
              className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 cursor-move hover:bg-gray-600/50 hover:border-blue-500 transition-all"
            >
              <div className="font-semibold text-sm mb-1">{capsule.name}</div>
              <div className="text-xs text-gray-400 mb-2">{capsule.description}</div>
              <div className="flex gap-1 flex-wrap">
                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">
                  {capsule.category}
                </span>
                {(capsule.props || []).length > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                    {(capsule.props || []).length} props
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="absolute top-0 left-0 right-0 bg-gray-800 border-b-2 border-gray-700 z-10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Visual Canvas Builder</h1>
              <p className="text-sm text-gray-400">
                {nodes.length} components · {edges.length} connections
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCode(!showCode)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                {showCode ? 'Hide' : 'View'} Code
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateReactCode())
                  alert('Code copied to clipboard!')
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Copy Code
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear entire canvas?')) {
                    setNodes([])
                    setEdges([])
                    setSelectedNode(null)
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="h-full pt-20" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                return node.style?.background as string || '#6B7280'
              }}
              className="bg-gray-700"
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color="#4B5563"
            />

            {/* Code Panel */}
            {showCode && (
              <Panel position="top-right" className="bg-gray-900 text-white p-4 rounded-lg border-2 border-gray-700 max-w-2xl max-h-96 overflow-auto">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Generated React Code</h3>
                  <button
                    onClick={() => setShowCode(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap text-green-400">
                  {generateReactCode()}
                </pre>
              </Panel>
            )}

            {/* Empty State */}
            {nodes.length === 0 && (
              <Panel position="top-center" className="bg-white/90 backdrop-blur p-6 rounded-lg border-2 border-gray-300 max-w-md text-center">
                <h3 className="text-xl font-bold mb-2">👋 Welcome to Canvas Builder</h3>
                <p className="text-gray-600 mb-4">
                  Drag capsules from the left sidebar and drop them here to build your UI.
                  Connect components by dragging from one node to another.
                </p>
                <div className="text-sm text-gray-500">
                  💡 Tip: You have {allCapsules.length} capsules to choose from!
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      {/* Right Panel - Component Details */}
      {selectedNode && (
        <div className="w-96 bg-gray-800 border-l-2 border-gray-700 p-6 overflow-y-auto text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Component Details</h2>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-700 rounded-lg">
            <div className="font-bold text-lg mb-2">{selectedNode.data.capsule.name}</div>
            <div className="text-sm text-gray-300 mb-3">{selectedNode.data.capsule.description}</div>
            <div className="text-xs text-gray-400">
              Category: <span className="text-blue-400">{selectedNode.data.capsule.category}</span>
            </div>
          </div>

          {/* Props */}
          {(selectedNode.data.capsule.props || []).length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">Props ({(selectedNode.data.capsule.props || []).length})</h3>
              <div className="space-y-3">
                {(selectedNode.data.capsule.props || []).map((prop: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-700 rounded border border-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono text-blue-300">{prop.name}</code>
                      <span className="text-xs text-gray-400">{prop.type}</span>
                      {prop.required && (
                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                          required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{prop.description}</p>
                    {prop.default !== undefined && (
                      <div className="text-xs text-gray-500">
                        Default: <code className="text-blue-300">{JSON.stringify(prop.default)}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Preview */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Code Preview</h3>
            <pre className="text-xs font-mono bg-gray-900 p-3 rounded border border-gray-700 overflow-x-auto">
              <code className="text-green-400">
                {selectedNode.data.capsule.code.slice(0, 300)}...
              </code>
            </pre>
          </div>

          {/* Actions */}
          <button
            onClick={() => {
              setNodes(nodes.filter(n => n.id !== selectedNode.id))
              setEdges(edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id))
              setSelectedNode(null)
            }}
            className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            Delete Component
          </button>
        </div>
      )}

      {/* AI Assistant Panel */}
      {showAssistant && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Assistant Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold text-white">AI Assistant</h3>
            </div>
            <button
              onClick={() => setShowAssistant(false)}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isAssistantThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-900 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                disabled={isAssistantThinking}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!userInput.trim() || isAssistantThinking}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Assistant Button (when hidden) */}
      {!showAssistant && (
        <button
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl z-50"
        >
          🤖
        </button>
      )}
    </div>
  )
}

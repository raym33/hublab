'use client'

import React, { useCallback, useState, useRef } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
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

interface CapsuleCategory {
  name: string
  capsules: any[]
  expanded: boolean
}

export default function StudioV2Page() {
  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // UI state
  const [leftPanelWidth, setLeftPanelWidth] = useState(280)
  const [rightPanelWidth, setRightPanelWidth] = useState(320)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(0) // Collapsed by default
  const [searchTerm, setSearchTerm] = useState('')

  // AI Assistant state
  const [showAssistant, setShowAssistant] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant. Tell me what you want to build and I\'ll guide you step by step.'
    }
  ])
  const [userInput, setUserInput] = useState('')
  const [isAssistantThinking, setIsAssistantThinking] = useState(false)

  const allCapsules = getAllCapsulesExtended()

  // Group capsules by category
  const [categories, setCategories] = useState<CapsuleCategory[]>(() => {
    const categoryMap = new Map<string, any[]>()
    allCapsules.forEach(capsule => {
      if (!categoryMap.has(capsule.category)) {
        categoryMap.set(capsule.category, [])
      }
      categoryMap.get(capsule.category)!.push(capsule)
    })

    return Array.from(categoryMap.entries()).map(([name, capsules]) => ({
      name,
      capsules,
      expanded: true
    }))
  })

  const filteredCategories = categories.map(cat => ({
    ...cat,
    capsules: cat.capsules.filter(capsule =>
      capsule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.capsules.length > 0)

  const toggleCategory = (categoryName: string) => {
    setCategories(prev => prev.map(cat =>
      cat.name === categoryName ? { ...cat, expanded: !cat.expanded } : cat
    ))
  }

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
            <div className="flex flex-col items-center gap-1 px-3 py-2">
              <div className="text-sm font-semibold text-white">{capsule.name}</div>
              <div className="text-xs text-white/70">{capsule.category}</div>
            </div>
          ),
          capsule,
        },
        style: {
          background: categoryColors[capsule.category] || '#6B7280',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          minWidth: '160px',
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

  const generateCode = () => {
    let code = `import React from 'react'\n\n`
    code += `export default function GeneratedApp() {\n`
    code += `  return (\n`
    code += `    <div className="p-8">\n`

    nodes.forEach(node => {
      const capsule = node.data.capsule
      code += `      {/* ${capsule.name} */}\n`
      const propsString = (capsule.props || [])
        .map((p: any) => `${p.name}={${JSON.stringify(p.default || '')}}`)
        .join(' ')
      code += `      <${capsule.name} ${propsString} />\n\n`
    })

    code += `    </div>\n`
    code += `  )\n`
    code += `}\n`

    return code
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Toolbar */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">HubLab Studio</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{nodes.length} nodes</span>
            <span>·</span>
            <span>{edges.length} connections</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBottomPanelHeight(bottomPanelHeight === 0 ? 300 : 0)}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
          >
            {bottomPanelHeight === 0 ? '📊 Show Demos' : '📊 Hide Demos'}
          </button>
          <button
            onClick={() => {
              const code = generateCode()
              navigator.clipboard.writeText(code)
              alert('Code copied to clipboard!')
            }}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold"
          >
            📋 Copy Code
          </button>
          <button
            onClick={() => {
              if (confirm('Clear canvas?')) {
                setNodes([])
                setEdges([])
                setSelectedNode(null)
              }
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Capsules */}
        <div
          className="bg-gray-800 border-r border-gray-700 overflow-y-auto"
          style={{ width: `${leftPanelWidth}px` }}
        >
          <div className="p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="🔍 Search capsules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="text-xs text-gray-400 mb-2">
              {allCapsules.length} capsules available
            </div>

            {/* Categories */}
            <div className="space-y-1">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700 rounded text-left"
                  >
                    <span className="text-sm font-semibold text-white capitalize">
                      {category.name} ({category.capsules.length})
                    </span>
                    <span className="text-gray-400">
                      {category.expanded ? '▼' : '▶'}
                    </span>
                  </button>

                  {category.expanded && (
                    <div className="ml-2 space-y-1 mt-1">
                      {category.capsules.map((capsule) => (
                        <div
                          key={capsule.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, capsule)}
                          className="p-2 rounded bg-gray-700/50 border border-gray-600 cursor-move hover:bg-gray-600 hover:border-blue-500 transition-all"
                        >
                          <div className="text-sm font-medium text-white">{capsule.name}</div>
                          <div className="text-xs text-gray-400 mt-1">{capsule.description}</div>
                          {(capsule.props || []).length > 0 && (
                            <div className="text-xs text-purple-400 mt-1">
                              {(capsule.props || []).length} props
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div
          className="flex-1 relative"
          style={{
            width: `calc(100% - ${leftPanelWidth}px - ${rightPanelWidth}px)`,
            height: `calc(100% - ${bottomPanelHeight}px)`
          }}
        >
          <div className="h-full" onDrop={onDrop} onDragOver={onDragOver}>
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
                nodeColor={(node) => node.style?.background as string || '#6B7280'}
                className="bg-gray-700"
              />
              <Background
                variant={BackgroundVariant.Dots}
                gap={16}
                size={1}
                color="#4B5563"
              />

              {/* Empty State */}
              {nodes.length === 0 && (
                <Panel position="top-center" className="bg-white/95 backdrop-blur p-6 rounded-lg border-2 border-gray-300 max-w-md text-center">
                  <h3 className="text-xl font-bold mb-2">👋 Welcome to HubLab Studio</h3>
                  <p className="text-gray-600 mb-4">
                    Drag capsules from the left panel and drop them here to build your app.
                    Connect nodes by dragging from one to another.
                  </p>
                  <div className="text-sm text-gray-500">
                    💡 Ask the AI assistant for help!
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </div>

        {/* Right Panel - Node Details */}
        {selectedNode && (
          <div
            className="bg-gray-800 border-l border-gray-700 overflow-y-auto"
            style={{ width: `${rightPanelWidth}px` }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Node Details</h2>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="font-bold text-white mb-2">{selectedNode.data.capsule.name}</div>
                <div className="text-sm text-gray-300 mb-3">{selectedNode.data.capsule.description}</div>
                <div className="text-xs text-gray-400">
                  Category: <span className="text-blue-400">{selectedNode.data.capsule.category}</span>
                </div>
              </div>

              {/* Props */}
              {(selectedNode.data.capsule.props || []).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-white mb-2">
                    Props ({(selectedNode.data.capsule.props || []).length})
                  </h3>
                  <div className="space-y-2">
                    {(selectedNode.data.capsule.props || []).map((prop: any, idx: number) => (
                      <div key={idx} className="p-2 bg-gray-700 rounded border border-gray-600">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-xs font-mono text-blue-300">{prop.name}</code>
                          <span className="text-xs text-gray-400">{prop.type}</span>
                        </div>
                        <p className="text-xs text-gray-400">{prop.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Preview */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white mb-2">Code Preview</h3>
                <pre className="text-xs font-mono bg-gray-900 p-3 rounded border border-gray-700 overflow-x-auto">
                  <code className="text-green-400">
                    {selectedNode.data.capsule.code.slice(0, 200)}...
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
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
              >
                Delete Node
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Panel - Demos */}
      {bottomPanelHeight > 0 && (
        <div
          className="bg-gray-800 border-t border-gray-700 overflow-y-auto"
          style={{ height: `${bottomPanelHeight}px` }}
        >
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-4">Live Demos & Previews</h3>
            <div className="text-sm text-gray-400">
              Click on any capsule to see a live preview here, or visit{' '}
              <a href="/demos" className="text-blue-400 hover:underline">/demos</a>
              {' '}for full interactive demos.
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      {showAssistant && (
        <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold text-white text-sm">AI Assistant</h3>
            </div>
            <button
              onClick={() => setShowAssistant(false)}
              className="text-white hover:text-gray-300 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2 rounded text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isAssistantThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white p-2 rounded">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-900 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me..."
                disabled={isAssistantThinking}
                className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!userInput.trim() || isAssistantThinking}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Assistant Button */}
      {!showAssistant && (
        <button
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-xl z-50"
        >
          🤖
        </button>
      )}
    </div>
  )
}

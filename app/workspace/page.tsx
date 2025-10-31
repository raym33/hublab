'use client'

import { useCallback, useState } from 'react'
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
} from 'reactflow'
import 'reactflow/dist/style.css'

// Define all 32 capsules from the framework
const CAPSULES = [
  // Authentication
  { id: 'auth-jwt', name: 'JWT Auth', category: 'auth', icon: '🔐', color: '#3B82F6' },
  { id: 'auth-oauth-google', name: 'Google OAuth', category: 'auth', icon: '🔑', color: '#3B82F6' },
  { id: 'oauth', name: 'Generic OAuth', category: 'auth', icon: '🔓', color: '#3B82F6' },

  // Data & Storage
  { id: 'database', name: 'Database', category: 'data', icon: '🗄️', color: '#10B981' },
  { id: 'cache', name: 'Cache', category: 'data', icon: '⚡', color: '#10B981' },
  { id: 'storage', name: 'File Storage', category: 'data', icon: '📦', color: '#10B981' },

  // AI
  { id: 'ai-chat', name: 'AI Chat', category: 'ai', icon: '🤖', color: '#8B5CF6' },
  { id: 'ai-embeddings', name: 'AI Embeddings', category: 'ai', icon: '🧠', color: '#8B5CF6' },

  // Communication
  { id: 'email', name: 'Email', category: 'communication', icon: '📧', color: '#F59E0B' },
  { id: 'sms', name: 'SMS', category: 'communication', icon: '💬', color: '#F59E0B' },
  { id: 'notifications', name: 'Notifications', category: 'communication', icon: '🔔', color: '#F59E0B' },
  { id: 'websocket', name: 'WebSocket', category: 'communication', icon: '🔌', color: '#F59E0B' },

  // Payments
  { id: 'payments', name: 'Payments', category: 'payments', icon: '💳', color: '#EC4899' },

  // Workflow
  { id: 'webhook', name: 'Webhook', category: 'workflow', icon: '🪝', color: '#6366F1' },
  { id: 'http', name: 'HTTP Request', category: 'workflow', icon: '🌐', color: '#6366F1' },
  { id: 'validator', name: 'Validator', category: 'workflow', icon: '✅', color: '#6366F1' },
  { id: 'transformer', name: 'Transformer', category: 'workflow', icon: '🔄', color: '#6366F1' },
  { id: 'router', name: 'Router', category: 'workflow', icon: '🚦', color: '#6366F1' },
  { id: 'delay', name: 'Delay', category: 'workflow', icon: '⏱️', color: '#6366F1' },
  { id: 'scheduler', name: 'Scheduler', category: 'workflow', icon: '⏰', color: '#6366F1' },

  // Content
  { id: 'markdown', name: 'Markdown', category: 'content', icon: '📝', color: '#14B8A6' },
  { id: 'pdf', name: 'PDF Generator', category: 'content', icon: '📄', color: '#14B8A6' },
  { id: 'image', name: 'Image Processing', category: 'content', icon: '🖼️', color: '#14B8A6' },

  // Search
  { id: 'search', name: 'Search', category: 'search', icon: '🔍', color: '#EF4444' },

  // Forms
  { id: 'form', name: 'Form Builder', category: 'forms', icon: '📋', color: '#06B6D4' },

  // Monitoring
  { id: 'logger', name: 'Logger', category: 'monitoring', icon: '📊', color: '#64748B' },
  { id: 'analytics', name: 'Analytics', category: 'monitoring', icon: '📈', color: '#64748B' },
  { id: 'error-handler', name: 'Error Handler', category: 'monitoring', icon: '⚠️', color: '#64748B' },

  // Security
  { id: 'rate-limiter', name: 'Rate Limiter', category: 'security', icon: '🛡️', color: '#DC2626' },
  { id: 'crypto', name: 'Encryption', category: 'security', icon: '🔒', color: '#DC2626' },

  // Integration
  { id: 'slack', name: 'Slack', category: 'integration', icon: '💼', color: '#A855F7' },
  { id: 'github', name: 'GitHub', category: 'integration', icon: '🐙', color: '#A855F7' },
]

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function WorkspacePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const onDragStart = (event: React.DragEvent, capsule: typeof CAPSULES[0]) => {
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
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 40,
      }

      const newNode: Node = {
        id: `${capsule.id}-${Date.now()}`,
        type: 'default',
        position,
        data: {
          label: (
            <div className="flex flex-col items-center gap-1 p-3">
              <div className="text-2xl">{capsule.icon}</div>
              <div className="text-xs font-bold">{capsule.name}</div>
            </div>
          ),
        },
        style: {
          background: capsule.color,
          color: 'white',
          border: '2px solid #000',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
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

  const categories = ['all', ...new Set(CAPSULES.map((c) => c.category))]
  const filteredCapsules = selectedCategory === 'all'
    ? CAPSULES
    : CAPSULES.filter((c) => c.category === selectedCategory)

  return (
    <div className="h-screen flex">
      {/* Sidebar with capsules */}
      <div className="w-80 bg-gray-900 text-white p-4 overflow-y-auto border-r-2 border-black">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">🧩 Capsules</h2>
          <p className="text-xs text-gray-400">Drag & drop to build workflows</p>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Capsules List */}
        <div className="space-y-2">
          {filteredCapsules.map((capsule) => (
            <div
              key={capsule.id}
              draggable
              onDragStart={(e) => onDragStart(e, capsule)}
              className="p-3 rounded-lg border-2 border-gray-700 cursor-move hover:border-gray-500 transition-colors"
              style={{ backgroundColor: capsule.color + '20' }}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{capsule.icon}</div>
                <div>
                  <div className="font-bold text-sm">{capsule.name}</div>
                  <div className="text-xs text-gray-400">{capsule.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 space-y-1">
            <div>💡 <strong>Tip:</strong> Drag capsules to canvas</div>
            <div>🔗 <strong>Connect:</strong> Drag from output to input</div>
            <div>🗑️ <strong>Delete:</strong> Select node + Backspace</div>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b-2 border-black z-10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Workflow Builder</h1>
              <p className="text-sm text-gray-600">Build production-ready workflows visually</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setNodes([])
                  setEdges([])
                }}
                className="px-4 py-2 border-2 border-black rounded font-bold text-sm hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  console.log('Workflow:', { nodes, edges })
                  alert('Workflow exported to console!')
                }}
                className="px-4 py-2 bg-black text-white rounded font-bold text-sm hover:bg-gray-800"
              >
                Export
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
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

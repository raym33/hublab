'use client'

import { useState, useRef, useCallback } from 'react'
import { Plus, Play, Save, Download, Trash2, Circle } from 'lucide-react'

interface Node {
  id: string
  type: 'capsule'
  capsuleId: string
  label: string
  x: number
  y: number
  inputs: Record<string, any>
}

interface Connection {
  id: string
  from: string
  to: string
  fromPort: string
  toPort: string
}

const AVAILABLE_CAPSULES = [
  { id: 'http-fetch', label: 'HTTP Fetch', color: '#3B82F6' },
  { id: 'database-local', label: 'Database', color: '#10B981' },
  { id: 'transformer', label: 'Transform', color: '#F59E0B' },
  { id: 'validator', label: 'Validate', color: '#EF4444' },
  { id: 'email', label: 'Send Email', color: '#8B5CF6' },
  { id: 'ai-chat', label: 'AI Chat', color: '#EC4899' },
]

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const addNode = (capsuleId: string, label: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'capsule',
      capsuleId,
      label,
      x: 100,
      y: 100 + nodes.length * 80,
      inputs: {}
    }
    setNodes([...nodes, newNode])
  }

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNode(nodeId)
    setDragging(nodeId)

    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y
      })
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setNodes(prev => prev.map(node =>
        node.id === dragging
          ? { ...node, x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y }
          : node
      ))
    }
  }, [dragging, dragOffset])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  // Add event listeners
  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId))
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId))
    setSelectedNode(null)
  }

  const getCapsuleColor = (capsuleId: string) => {
    return AVAILABLE_CAPSULES.find(c => c.id === capsuleId)?.color || '#6B7280'
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-medium text-gray-900">Workflow Builder</h1>
          <div className="h-4 w-px bg-gray-300" />
          <span className="text-xs text-gray-500">{nodes.length} nodes</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="h-8 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
            <Save size={14} />
            Save
          </button>
          <button className="h-8 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
            <Download size={14} />
            Export
          </button>
          <div className="w-px h-5 bg-gray-300" />
          <button className="h-8 px-3 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5">
            <Play size={14} />
            Run
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Capsule Palette */}
        <aside className="w-56 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-4 space-y-1">
            <div className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-3 px-2">
              Capsules
            </div>
            {AVAILABLE_CAPSULES.map((capsule) => (
              <button
                key={capsule.id}
                onClick={() => addNode(capsule.id, capsule.label)}
                className="w-full h-9 px-3 text-xs font-medium text-left text-gray-700 hover:bg-white rounded-md transition-all flex items-center gap-2 group"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: capsule.color }}
                />
                {capsule.label}
                <Plus size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
            onClick={() => setSelectedNode(null)}
          >
            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute w-48 bg-white rounded-lg shadow-sm border-2 transition-all cursor-move ${
                  selectedNode === node.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                }}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
              >
                {/* Node Header */}
                <div
                  className="h-10 px-3 flex items-center gap-2 border-b border-gray-100"
                  style={{
                    borderLeftWidth: '3px',
                    borderLeftColor: getCapsuleColor(node.capsuleId)
                  }}
                >
                  <Circle
                    size={8}
                    fill={getCapsuleColor(node.capsuleId)}
                    stroke="none"
                  />
                  <span className="text-xs font-medium text-gray-900 flex-1">
                    {node.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNode(node.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
                  >
                    <Trash2 size={12} className="text-gray-400" />
                  </button>
                </div>

                {/* Node Content */}
                <div className="p-3 space-y-2">
                  <div className="text-[10px] text-gray-500">
                    {node.capsuleId}
                  </div>
                </div>

                {/* Connection Ports */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors" />
              </div>
            ))}

            {/* Empty State */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-gray-400">
                    <Plus size={32} className="mx-auto mb-2" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Start building your workflow</p>
                  <p className="text-xs text-gray-500">Add capsules from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <aside className="w-64 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-3">
                Properties
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Node ID
                  </label>
                  <input
                    type="text"
                    value={selectedNode}
                    disabled
                    className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-md text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Capsule Type
                  </label>
                  <input
                    type="text"
                    value={nodes.find(n => n.id === selectedNode)?.capsuleId || ''}
                    disabled
                    className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-md text-gray-500"
                  />
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

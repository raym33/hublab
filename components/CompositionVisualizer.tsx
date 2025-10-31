'use client'

import { useState, useEffect, useRef } from 'react'
import { Package, ArrowRight, Zap, GitBranch, Eye, Code } from 'lucide-react'

interface CapsuleNode {
  id: string
  capsuleId: string
  name: string
  x?: number
  y?: number
  inputs?: Record<string, any>
}

interface Connection {
  from: string
  to: string
}

interface CompositionVisualizerProps {
  composition: {
    name: string
    capsules: CapsuleNode[]
    connections: Connection[]
  }
  onNodeClick?: (nodeId: string) => void
  className?: string
}

export default function CompositionVisualizer({
  composition,
  onNodeClick,
  className = ''
}: CompositionVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'graph' | 'tree'>('graph')
  const [nodes, setNodes] = useState<CapsuleNode[]>([])

  // Calculate node positions
  useEffect(() => {
    if (!composition.capsules.length) return

    const width = 800
    const height = 600
    const centerX = width / 2
    const centerY = height / 2

    if (viewMode === 'tree') {
      // Tree layout
      const positioned = composition.capsules.map((capsule, index) => {
        const level = Math.floor(index / 3)
        const posInLevel = index % 3
        const levelWidth = Math.min(composition.capsules.length, 3)

        return {
          ...capsule,
          x: (posInLevel - (levelWidth - 1) / 2) * 200 + centerX,
          y: level * 150 + 100
        }
      })
      setNodes(positioned)
    } else {
      // Circular layout
      const radius = Math.min(width, height) / 3
      const angleStep = (2 * Math.PI) / composition.capsules.length

      const positioned = composition.capsules.map((capsule, index) => {
        const angle = index * angleStep - Math.PI / 2
        return {
          ...capsule,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        }
      })
      setNodes(positioned)
    }
  }, [composition, viewMode])

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !nodes.length) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 2
    composition.connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from.split('.')[0])
      const toNode = nodes.find(n => n.id === conn.to.split('.')[0])

      if (fromNode && toNode && fromNode.x && fromNode.y && toNode.x && toNode.y) {
        // Draw curved line
        const midX = (fromNode.x + toNode.x) / 2
        const midY = (fromNode.y + toNode.y) / 2
        const controlX = midX
        const controlY = midY - 50

        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.quadraticCurveTo(controlX, controlY, toNode.x, toNode.y)
        ctx.stroke()

        // Draw arrow
        const angle = Math.atan2(toNode.y - controlY, toNode.x - controlX)
        const arrowSize = 10
        ctx.beginPath()
        ctx.moveTo(toNode.x, toNode.y)
        ctx.lineTo(
          toNode.x - arrowSize * Math.cos(angle - Math.PI / 6),
          toNode.y - arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          toNode.x - arrowSize * Math.cos(angle + Math.PI / 6),
          toNode.y - arrowSize * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fillStyle = '#cbd5e1'
        ctx.fill()
      }
    })

    // Draw nodes
    nodes.forEach(node => {
      if (!node.x || !node.y) return

      const isHovered = hoveredNode === node.id
      const isSelected = selectedNode === node.id

      // Node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, isHovered || isSelected ? 35 : 30, 0, Math.PI * 2)
      ctx.fillStyle = isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : '#ffffff'
      ctx.fill()
      ctx.strokeStyle = isSelected ? '#2563eb' : '#e5e7eb'
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.stroke()

      // Icon (simplified - just a small circle)
      ctx.beginPath()
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = isSelected ? '#ffffff' : '#3b82f6'
      ctx.fill()
    })
  }, [nodes, hoveredNode, selectedNode, composition.connections])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find clicked node
    const clickedNode = nodes.find(node => {
      if (!node.x || !node.y) return false
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      return distance < 30
    })

    if (clickedNode) {
      setSelectedNode(clickedNode.id)
      onNodeClick?.(clickedNode.id)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find hovered node
    const hoveredNode = nodes.find(node => {
      if (!node.x || !node.y) return false
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      return distance < 30
    })

    setHoveredNode(hoveredNode ? hoveredNode.id : null)
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default'
  }

  const selectedNodeData = nodes.find(n => n.id === selectedNode)

  return (
    <div className={`flex flex-col bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{composition.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {composition.capsules.length} capsules, {composition.connections.length} connections
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1.5 text-sm rounded flex items-center gap-2 ${
              viewMode === 'graph' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Graph
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1.5 text-sm rounded flex items-center gap-2 ${
              viewMode === 'tree' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Code className="w-4 h-4" />
            Tree
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 min-h-[600px] bg-gray-50">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
          className="absolute inset-0 w-full h-full"
        />

        {/* Node labels overlay */}
        {nodes.map(node => (
          node.x && node.y && (
            <div
              key={node.id}
              className="absolute pointer-events-none"
              style={{
                left: node.x,
                top: node.y + 40,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                <p className="text-xs font-medium text-gray-900 whitespace-nowrap">
                  {node.name}
                </p>
              </div>
            </div>
          )
        ))}

        {/* Hover tooltip */}
        {hoveredNode && (
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-600" />
              <p className="font-semibold text-sm text-gray-900">
                {nodes.find(n => n.id === hoveredNode)?.name}
              </p>
            </div>
            <p className="text-xs text-gray-600">
              ID: {hoveredNode}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Capsule: {nodes.find(n => n.id === hoveredNode)?.capsuleId}
            </p>
          </div>
        )}
      </div>

      {/* Selected node details */}
      {selectedNodeData && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">{selectedNodeData.name}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">ID</p>
              <p className="font-medium text-gray-900">{selectedNodeData.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Capsule Type</p>
              <p className="font-medium text-gray-900">{selectedNodeData.capsuleId}</p>
            </div>
          </div>
          {selectedNodeData.inputs && Object.keys(selectedNodeData.inputs).length > 0 && (
            <div className="mt-3">
              <p className="text-gray-600 text-sm mb-1">Inputs:</p>
              <div className="bg-white rounded p-2 border border-gray-200">
                <pre className="text-xs text-gray-800 overflow-x-auto">
                  {JSON.stringify(selectedNodeData.inputs, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats footer */}
      <div className="border-t border-gray-200 p-3 bg-white flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {composition.capsules.length} nodes
          </span>
          <span className="flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            {composition.connections.length} edges
          </span>
        </div>
        <div className="text-gray-500">
          Click nodes to inspect • Drag to pan
        </div>
      </div>
    </div>
  )
}

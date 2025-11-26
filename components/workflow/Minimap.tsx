'use client'

import { useMemo } from 'react'

interface Node {
  id: string
  x: number
  y: number
  capsuleId: string
}

interface Connection {
  id: string
  from: string
  to: string
}

interface MinimapProps {
  nodes: Node[]
  connections: Connection[]
  viewportX: number
  viewportY: number
  zoom: number
  containerWidth: number
  containerHeight: number
  selectedNodeId: string | null
  getCapsuleColor: (capsuleId: string) => string
  onViewportChange?: (x: number, y: number) => void
}

export default function Minimap({
  nodes,
  connections,
  viewportX,
  viewportY,
  zoom,
  containerWidth,
  containerHeight,
  selectedNodeId,
  getCapsuleColor,
  onViewportChange
}: MinimapProps) {
  const MINIMAP_WIDTH = 160
  const MINIMAP_HEIGHT = 100
  const NODE_WIDTH = 224 // Actual node width in canvas
  const NODE_HEIGHT = 100

  // Calculate bounds of all nodes
  const bounds = useMemo(() => {
    if (nodes.length === 0) {
      return { minX: 0, minY: 0, maxX: 1000, maxY: 1000, width: 1000, height: 1000 }
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    for (const node of nodes) {
      minX = Math.min(minX, node.x)
      minY = Math.min(minY, node.y)
      maxX = Math.max(maxX, node.x + NODE_WIDTH)
      maxY = Math.max(maxY, node.y + NODE_HEIGHT)
    }

    // Add padding
    const padding = 100
    minX -= padding
    minY -= padding
    maxX += padding
    maxY += padding

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    }
  }, [nodes])

  // Calculate scale to fit all nodes in minimap
  const scale = useMemo(() => {
    const scaleX = MINIMAP_WIDTH / bounds.width
    const scaleY = MINIMAP_HEIGHT / bounds.height
    return Math.min(scaleX, scaleY, 0.1) // Max scale of 0.1
  }, [bounds])

  // Transform coordinates from canvas to minimap
  const toMinimap = (x: number, y: number) => ({
    x: (x - bounds.minX) * scale,
    y: (y - bounds.minY) * scale
  })

  // Get node center for connections
  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    return toMinimap(node.x + NODE_WIDTH / 2, node.y + NODE_HEIGHT / 2)
  }

  // Calculate viewport rectangle
  const viewportRect = useMemo(() => {
    const vpWidth = containerWidth / zoom
    const vpHeight = containerHeight / zoom
    const vpX = -viewportX / zoom
    const vpY = -viewportY / zoom

    const topLeft = toMinimap(vpX, vpY)
    return {
      x: topLeft.x,
      y: topLeft.y,
      width: vpWidth * scale,
      height: vpHeight * scale
    }
  }, [viewportX, viewportY, zoom, containerWidth, containerHeight, scale, bounds])

  // Handle click on minimap to pan
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onViewportChange) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Convert click position to canvas coordinates
    const canvasX = clickX / scale + bounds.minX
    const canvasY = clickY / scale + bounds.minY

    // Center viewport on click
    const newX = -(canvasX - containerWidth / 2 / zoom) * zoom
    const newY = -(canvasY - containerHeight / 2 / zoom) * zoom

    onViewportChange(newX, newY)
  }

  if (nodes.length === 0) {
    return null
  }

  return (
    <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-2 py-1 border-b border-gray-200 bg-gray-50">
        <span className="text-[10px] font-medium text-gray-600">Minimap</span>
      </div>
      <svg
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={MINIMAP_WIDTH}
          height={MINIMAP_HEIGHT}
          fill="#f9fafb"
        />

        {/* Grid pattern */}
        <defs>
          <pattern
            id="minimapGrid"
            width={10}
            height={10}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={5} cy={5} r={0.5} fill="#e5e7eb" />
          </pattern>
        </defs>
        <rect
          x={0}
          y={0}
          width={MINIMAP_WIDTH}
          height={MINIMAP_HEIGHT}
          fill="url(#minimapGrid)"
        />

        {/* Connections */}
        {connections.map(conn => {
          const from = getNodeCenter(conn.from)
          const to = getNodeCenter(conn.to)
          return (
            <line
              key={conn.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#a78bfa"
              strokeWidth={1}
              opacity={0.6}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const pos = toMinimap(node.x, node.y)
          const isSelected = node.id === selectedNodeId
          return (
            <rect
              key={node.id}
              x={pos.x}
              y={pos.y}
              width={Math.max(NODE_WIDTH * scale, 4)}
              height={Math.max(NODE_HEIGHT * scale, 3)}
              fill={getCapsuleColor(node.capsuleId)}
              stroke={isSelected ? '#8b5cf6' : 'transparent'}
              strokeWidth={isSelected ? 2 : 0}
              rx={1}
            />
          )
        })}

        {/* Viewport rectangle */}
        <rect
          x={Math.max(0, viewportRect.x)}
          y={Math.max(0, viewportRect.y)}
          width={Math.min(viewportRect.width, MINIMAP_WIDTH - viewportRect.x)}
          height={Math.min(viewportRect.height, MINIMAP_HEIGHT - viewportRect.y)}
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth={1.5}
          strokeDasharray="3,2"
          rx={2}
        />
      </svg>
    </div>
  )
}

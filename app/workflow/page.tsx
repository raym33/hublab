'use client'

import { useState, useRef, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Play, Save, Download, Trash2, Circle, ZoomIn, ZoomOut, Maximize2, Grid3x3, Search, LayoutGrid } from 'lucide-react'

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

const CAPSULE_CATEGORIES = {
  'Layout': [
    { id: 'app-container', label: 'Container' },
    { id: 'card', label: 'Card' },
    { id: 'drawer', label: 'Drawer' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'split-pane', label: 'Split Pane' },
    { id: 'accordion', label: 'Accordion' },
    { id: 'collapsible', label: 'Collapsible' },
    { id: 'divider', label: 'Divider' },
  ],
  'Input': [
    { id: 'input-text', label: 'Text Input' },
    { id: 'search-input', label: 'Search' },
    { id: 'checkbox', label: 'Checkbox' },
    { id: 'radio-group', label: 'Radio Group' },
    { id: 'toggle-switch', label: 'Toggle' },
    { id: 'dropdown-select', label: 'Dropdown' },
    { id: 'select-multi', label: 'Multi Select' },
    { id: 'date-picker', label: 'Date Picker' },
    { id: 'color-picker', label: 'Color Picker' },
    { id: 'slider', label: 'Slider' },
    { id: 'file-upload', label: 'File Upload' },
    { id: 'rating', label: 'Rating' },
  ],
  'Buttons': [
    { id: 'button-primary', label: 'Primary Button' },
    { id: 'icon-button', label: 'Icon Button' },
  ],
  'Display': [
    { id: 'text-display', label: 'Text' },
    { id: 'code-block', label: 'Code Block' },
    { id: 'markdown-viewer', label: 'Markdown' },
    { id: 'image', label: 'Image' },
    { id: 'badge', label: 'Badge' },
    { id: 'chip', label: 'Chip' },
    { id: 'avatar', label: 'Avatar' },
  ],
  'Lists & Tables': [
    { id: 'list-view', label: 'List' },
    { id: 'data-table', label: 'Data Table' },
    { id: 'data-grid-editable', label: 'Editable Grid' },
    { id: 'virtual-list', label: 'Virtual List' },
    { id: 'infinite-scroll', label: 'Infinite Scroll' },
    { id: 'tree-view', label: 'Tree View' },
    { id: 'kanban-board', label: 'Kanban' },
  ],
  'Charts': [
    { id: 'chart-bar', label: 'Bar Chart' },
    { id: 'chart-line', label: 'Line Chart' },
    { id: 'chart-pie', label: 'Pie Chart' },
    { id: 'heatmap', label: 'Heatmap' },
  ],
  'Media': [
    { id: 'video-player', label: 'Video' },
    { id: 'audio-player', label: 'Audio' },
    { id: 'qr-code', label: 'QR Code' },
    { id: 'carousel', label: 'Carousel' },
  ],
  'Forms': [
    { id: 'form-validated', label: 'Form' },
    { id: 'wysiwyg-editor', label: 'WYSIWYG Editor' },
    { id: 'code-editor', label: 'Code Editor' },
  ],
  'Feedback': [
    { id: 'alert', label: 'Alert' },
    { id: 'toast', label: 'Toast' },
    { id: 'notification-center', label: 'Notifications' },
    { id: 'modal', label: 'Modal' },
    { id: 'popover', label: 'Popover' },
    { id: 'tooltip', label: 'Tooltip' },
    { id: 'loading-spinner', label: 'Loading' },
    { id: 'progress-bar', label: 'Progress' },
    { id: 'skeleton', label: 'Skeleton' },
    { id: 'empty-state', label: 'Empty State' },
  ],
  'Navigation': [
    { id: 'breadcrumb', label: 'Breadcrumb' },
    { id: 'pagination', label: 'Pagination' },
    { id: 'stepper', label: 'Stepper' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'command-palette', label: 'Command' },
    { id: 'context-menu', label: 'Context Menu' },
  ],
  'Data': [
    { id: 'database-local', label: 'Local DB' },
    { id: 'http-fetch', label: 'HTTP Fetch' },
  ],
  'Utility': [
    { id: 'drag-drop-zone', label: 'Drag & Drop' },
    { id: 'calendar-full', label: 'Calendar' },
    { id: 'map-interactive', label: 'Map' },
  ],
}

const CATEGORY_COLORS: Record<string, string> = {
  'Layout': '#3B82F6',
  'Input': '#10B981',
  'Buttons': '#8B5CF6',
  'Display': '#6366F1',
  'Lists & Tables': '#EC4899',
  'Charts': '#F59E0B',
  'Media': '#EF4444',
  'Forms': '#14B8A6',
  'Feedback': '#F97316',
  'Navigation': '#06B6D4',
  'Data': '#84CC16',
  'Utility': '#A855F7',
}

function WorkflowBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connecting, setConnecting] = useState<{ nodeId: string; port: 'output' } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const canvasRef = useRef<HTMLDivElement>(null)

  // Redirect OAuth callbacks to proper handler
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      router.replace(`/auth/callback?${searchParams.toString()}`)
    }
  }, [searchParams, router])

  const addNode = (capsuleId: string, label: string) => {
    // Calculate position in a grid layout
    const gridSize = 300
    const row = Math.floor(nodes.length / 3)
    const col = nodes.length % 3

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'capsule',
      capsuleId,
      label,
      x: 100 + col * gridSize,
      y: 100 + row * gridSize,
      inputs: {}
    }
    setNodes([...nodes, newNode])
  }

  // Zoom functionality
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5))
  const handleZoomReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Auto-layout nodes
  const handleAutoLayout = () => {
    const gridSize = 300
    const newNodes = nodes.map((node, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      return {
        ...node,
        x: 100 + col * gridSize,
        y: 100 + row * gridSize
      }
    })
    setNodes(newNodes)
  }

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNode(nodeId)
    setDragging(nodeId)

    const node = nodes.find(n => n.id === nodeId)
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setDragOffset({
        x: (e.clientX - rect.left - pan.x) / zoom - node.x,
        y: (e.clientY - rect.top - pan.y) / zoom - node.y
      })
    }
  }

  // Canvas panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) { // Middle mouse or Shift+Left
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      e.preventDefault()
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const newX = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x
      const newY = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y

      setNodes(prev => prev.map(node =>
        node.id === dragging
          ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
          : node
      ))
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
    }
  }, [dragging, dragOffset, isPanning, panStart, pan, zoom])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
    setIsPanning(false)
  }, [])

  // Add event listeners
  useEffect(() => {
    if (dragging || isPanning) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, isPanning, handleMouseMove, handleMouseUp])

  // Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.05 : 0.05
        setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)))
      }
    }

    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false })
      return () => canvas.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId))
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId))
    setSelectedNode(null)
  }

  const getCapsuleColor = (capsuleId: string) => {
    for (const [category, capsules] of Object.entries(CAPSULE_CATEGORIES)) {
      if (capsules.some(c => c.id === capsuleId)) {
        return CATEGORY_COLORS[category]
      }
    }
    return '#6B7280'
  }

  const getCategoryForCapsule = (capsuleId: string) => {
    for (const [category, capsules] of Object.entries(CAPSULE_CATEGORIES)) {
      if (capsules.some(c => c.id === capsuleId)) {
        return category
      }
    }
    return 'Other'
  }

  const handlePortClick = (nodeId: string, port: 'input' | 'output') => {
    if (port === 'output') {
      // Start connection from output port
      setConnecting({ nodeId, port: 'output' })
    } else if (port === 'input' && connecting) {
      // Complete connection to input port
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: connecting.nodeId,
        to: nodeId,
        fromPort: 'output',
        toPort: 'input'
      }
      setConnections([...connections, newConnection])
      setConnecting(null)
    }
  }

  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    return {
      x: node.x + 96, // Half of node width (192px / 2)
      y: node.y + 50  // Approximate center height
    }
  }

  const handleSave = () => {
    const workflow = {
      name: 'My Workflow',
      nodes,
      connections,
      createdAt: new Date().toISOString()
    }
    console.log('Saving workflow:', workflow)
    // TODO: Save to backend/localStorage
    alert('Workflow saved to console!')
  }

  const handleExport = () => {
    const workflow = {
      name: 'My Workflow',
      nodes,
      connections,
      createdAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workflow-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRun = () => {
    console.log('Running workflow:', { nodes, connections })
    alert(`Running workflow with ${nodes.length} nodes and ${connections.length} connections!`)
    // TODO: Execute workflow
  }

  // Filter capsules by search and category
  const filteredCategories = Object.entries(CAPSULE_CATEGORIES).reduce((acc, [category, capsules]) => {
    if (selectedCategory !== 'All' && category !== selectedCategory) return acc

    const filtered = capsules.filter(c => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return c.label.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
    })

    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {} as Record<string, typeof CAPSULE_CATEGORIES[keyof typeof CAPSULE_CATEGORIES]>)

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="h-16 bg-gradient-to-r from-purple-600 to-blue-600 border-b border-purple-700 flex items-center justify-between px-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Workflow Builder</h1>
              <p className="text-xs text-purple-100">
                {nodes.length} nodo{nodes.length !== 1 ? 's' : ''} • {connections.length} conexi{connections.length !== 1 ? 'ones' : 'ón'}
              </p>
            </div>
          </div>
          {connecting && (
            <div className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg">
              <span className="text-xs text-blue-100 animate-pulse flex items-center gap-2">
                <Circle className="w-3 h-3 fill-blue-300" />
                Conectando...
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoLayout}
            disabled={nodes.length < 2}
            className="h-9 px-3 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          >
            <LayoutGrid size={14} />
            Auto-organizar
          </button>
          <div className="w-px h-6 bg-white/20" />
          <button
            onClick={handleSave}
            disabled={nodes.length === 0}
            className="h-9 px-3 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          >
            <Save size={14} />
            Guardar
          </button>
          <button
            onClick={handleExport}
            disabled={nodes.length === 0}
            className="h-9 px-3 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          >
            <Download size={14} />
            Exportar
          </button>
          <div className="w-px h-6 bg-white/20" />
          <button
            onClick={handleRun}
            disabled={nodes.length === 0}
            className="h-9 px-4 text-xs font-medium text-purple-600 bg-white hover:bg-purple-50 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold"
          >
            <Play size={14} />
            Ejecutar
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Capsule Palette */}
        <aside className="w-80 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
          <div className="p-4 space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Cápsulas disponibles
              </h2>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar cápsulas..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Category filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="All">Todas las categorías</option>
                {Object.keys(CAPSULE_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-gray-500 px-2">
              {Object.values(filteredCategories).reduce((acc, cat) => acc + cat.length, 0)} de {Object.values(CAPSULE_CATEGORIES).reduce((acc, cat) => acc + cat.length, 0)} cápsulas
            </div>

            {Object.entries(filteredCategories).map(([category, capsules]) => (
              <div key={category}>
                <div className="text-[9px] uppercase tracking-wider font-medium text-gray-400 mb-1.5 px-2 flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                  />
                  {category}
                </div>
                <div className="space-y-0.5">
                  {capsules.map((capsule) => (
                    <button
                      key={capsule.id}
                      onClick={() => addNode(capsule.id, capsule.label)}
                      className="w-full h-7 px-2.5 text-[11px] font-medium text-left text-gray-700 hover:bg-white rounded transition-all flex items-center gap-2 group"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full opacity-60"
                        style={{ backgroundColor: CATEGORY_COLORS[category] }}
                      />
                      <span className="flex-1 truncate">{capsule.label}</span>
                      <Plus size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gray-100">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Zoom In (Ctrl + Scroll)"
            >
              <ZoomIn size={16} className="text-gray-700" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors text-xs font-medium text-gray-700"
              title="Reset View"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Zoom Out (Ctrl + Scroll)"
            >
              <ZoomOut size={16} className="text-gray-700" />
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button
              onClick={handleZoomReset}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Fit View"
            >
              <Maximize2 size={16} className="text-gray-700" />
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 text-xs text-gray-600 max-w-xs">
            <div className="font-semibold text-gray-900 mb-2">💡 Atajos de teclado</div>
            <div className="space-y-1">
              <div><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Ctrl + Scroll</kbd> Zoom</div>
              <div><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Shift + Click</kbd> Pan canvas</div>
              <div><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Middle Click</kbd> Pan canvas</div>
            </div>
          </div>

          <div
            ref={canvasRef}
            className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] cursor-move"
            style={{ cursor: isPanning ? 'grabbing' : dragging ? 'default' : 'grab' }}
            onClick={() => {
              setSelectedNode(null)
              setConnecting(null)
            }}
            onMouseDown={handleCanvasMouseDown}
          >
            {/* Transformed container for zoom and pan */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                width: '5000px',
                height: '5000px',
                position: 'relative'
              }}
            >
              {/* Connection Lines */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, width: '5000px', height: '5000px' }}>
                {connections.map((conn) => {
                  const from = getNodeCenter(conn.from)
                  const to = getNodeCenter(conn.to)
                  const midX = (from.x + to.x) / 2

                  return (
                    <g key={conn.id}>
                      <path
                        d={`M ${from.x + 96} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 96} ${to.y}`}
                        stroke="url(#connectionGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="0"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      />
                      <circle
                        cx={from.x + 96}
                        cy={from.y}
                        r="4"
                        fill="#8B5CF6"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <circle
                        cx={to.x - 96}
                        cy={to.y}
                        r="4"
                        fill="#3B82F6"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </g>
                  )
                })}
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Nodes */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute w-56 bg-white rounded-xl shadow-lg border-2 transition-all cursor-move group ${
                    selectedNode === node.id
                      ? 'border-purple-500 shadow-2xl ring-4 ring-purple-100 z-10'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
                  }`}
                  style={{
                    left: node.x,
                    top: node.y,
                  }}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                >
                  {/* Node Header */}
                  <div
                    className="h-12 px-4 flex items-center gap-3 rounded-t-xl"
                    style={{
                      background: `linear-gradient(135deg, ${getCapsuleColor(node.capsuleId)}15 0%, ${getCapsuleColor(node.capsuleId)}05 100%)`,
                      borderBottom: `2px solid ${getCapsuleColor(node.capsuleId)}20`
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: getCapsuleColor(node.capsuleId) }}
                    >
                      <Grid3x3 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 flex-1 truncate">
                      {node.label}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNode(node.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar nodo"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>

                  {/* Node Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-1 rounded-md text-[10px] font-semibold text-white"
                        style={{ backgroundColor: getCapsuleColor(node.capsuleId) }}
                      >
                        {getCategoryForCapsule(node.capsuleId)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100">
                      {node.capsuleId}
                    </div>
                  </div>

                  {/* Connection Ports */}
                  <div
                    className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-3 rounded-full transition-all cursor-pointer pointer-events-auto shadow-lg ${
                      connecting && connecting.nodeId !== node.id
                        ? 'border-blue-500 hover:bg-blue-50 scale-125 animate-pulse'
                        : 'border-gray-300 hover:border-blue-500 hover:scale-110'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePortClick(node.id, 'input')
                    }}
                    title="Puerto de entrada"
                    style={{ zIndex: 10, borderWidth: '3px' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                  </div>
                  <div
                    className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-3 rounded-full transition-all cursor-pointer pointer-events-auto shadow-lg ${
                      connecting?.nodeId === node.id
                        ? 'border-purple-500 bg-purple-50 scale-125'
                        : 'border-gray-300 hover:border-purple-500 hover:scale-110'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePortClick(node.id, 'output')
                    }}
                    title="Puerto de salida"
                    style={{ zIndex: 10, borderWidth: '3px' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {nodes.length === 0 && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-dashed border-gray-300 max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Grid3x3 className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Workflow vacío
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      Comienza añadiendo cápsulas desde la barra lateral. Conéctalas para crear flujos de datos y automatizaciones.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                      <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🎯</span>
                        <span className="font-medium">Añade nodos</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🔗</span>
                        <span className="font-medium">Conecta flujos</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🎨</span>
                        <span className="font-medium">Organiza layout</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">💾</span>
                        <span className="font-medium">Exporta JSON</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedNode && (() => {
          const node = nodes.find(n => n.id === selectedNode)
          if (!node) return null

          return (
            <aside className="w-80 border-l border-gray-200 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Propiedades del nodo
                  </h3>
                  <button
                    onClick={() => deleteNode(selectedNode)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all"
                    title="Eliminar nodo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Capsule Info */}
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: getCapsuleColor(node.capsuleId) }}
                      >
                        <Grid3x3 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 mb-0.5">{node.label}</div>
                        <span
                          className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold text-white"
                          style={{ backgroundColor: getCapsuleColor(node.capsuleId) }}
                        >
                          {getCategoryForCapsule(node.capsuleId)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      {node.capsuleId}
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Posición
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-500 mb-1.5 block font-medium">Eje X</label>
                        <input
                          type="number"
                          value={Math.round(node.x)}
                          onChange={(e) => {
                            const newX = parseInt(e.target.value) || 0
                            setNodes(prev => prev.map(n =>
                              n.id === selectedNode ? { ...n, x: newX } : n
                            ))
                          }}
                          className="w-full h-9 px-3 text-sm bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 mb-1.5 block font-medium">Eje Y</label>
                        <input
                          type="number"
                          value={Math.round(node.y)}
                          onChange={(e) => {
                            const newY = parseInt(e.target.value) || 0
                            setNodes(prev => prev.map(n =>
                              n.id === selectedNode ? { ...n, y: newY } : n
                            ))
                          }}
                          className="w-full h-9 px-3 text-sm bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Connections */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Conexiones
                    </label>
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Entrantes</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm font-bold text-gray-900">
                            {connections.filter(c => c.to === selectedNode).length}
                          </span>
                        </div>
                      </div>
                      <div className="h-px bg-gray-100" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Salientes</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span className="text-sm font-bold text-gray-900">
                            {connections.filter(c => c.from === selectedNode).length}
                          </span>
                        </div>
                      </div>
                      {connections.filter(c => c.from === selectedNode || c.to === selectedNode).length === 0 && (
                        <>
                          <div className="h-px bg-gray-100" />
                          <div className="text-xs text-gray-400 italic text-center py-2">
                            Sin conexiones
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Node ID */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      ID del nodo
                    </label>
                    <input
                      type="text"
                      value={selectedNode}
                      disabled
                      className="w-full h-9 px-3 text-xs bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </aside>
          )
        })()}
      </div>
    </div>
  )
}

export default function WorkflowBuilder() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <WorkflowBuilderContent />
    </Suspense>
  )
}

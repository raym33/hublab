'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function WorkflowBuilder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connecting, setConnecting] = useState<{ nodeId: string; port: 'output' } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Redirect OAuth callbacks to proper handler
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      router.replace(`/auth/callback?${searchParams.toString()}`)
    }
  }, [searchParams, router])

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
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      })
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const newX = e.clientX - rect.left - dragOffset.x
      const newY = e.clientY - rect.top - dragOffset.y

      setNodes(prev => prev.map(node =>
        node.id === dragging
          ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
          : node
      ))
    }
  }, [dragging, dragOffset])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  // Add event listeners
  useEffect(() => {
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

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-medium text-gray-900">Workflow Builder</h1>
          <div className="h-4 w-px bg-gray-300" />
          <span className="text-xs text-gray-500">{nodes.length} nodes</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{connections.length} connections</span>
          {connecting && (
            <>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-blue-600 animate-pulse">Connecting...</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={nodes.length === 0}
            className="h-8 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            Save
          </button>
          <button
            onClick={handleExport}
            disabled={nodes.length === 0}
            className="h-8 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Export
          </button>
          <div className="w-px h-5 bg-gray-300" />
          <button
            onClick={handleRun}
            disabled={nodes.length === 0}
            className="h-8 px-3 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={14} />
            Run
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Capsule Palette */}
        <aside className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-3 space-y-4">
            <div className="px-2">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                Capsules
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {Object.values(CAPSULE_CATEGORIES).reduce((acc, cat) => acc + cat.length, 0)} available
              </div>
            </div>

            {Object.entries(CAPSULE_CATEGORIES).map(([category, capsules]) => (
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
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
            onClick={() => {
              setSelectedNode(null)
              setConnecting(null)
            }}
          >
            {/* Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              {connections.map((conn) => {
                const from = getNodeCenter(conn.from)
                const to = getNodeCenter(conn.to)
                const midX = (from.x + to.x) / 2

                return (
                  <g key={conn.id}>
                    <path
                      d={`M ${from.x + 96} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 96} ${to.y}`}
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="0"
                    />
                    <circle
                      cx={from.x + 96}
                      cy={from.y}
                      r="3"
                      fill="#3B82F6"
                    />
                    <circle
                      cx={to.x - 96}
                      cy={to.y}
                      r="3"
                      fill="#10B981"
                    />
                  </g>
                )
              })}
            </svg>

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
                <div className="p-2.5">
                  <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                    {getCategoryForCapsule(node.capsuleId)}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-mono">
                    {node.capsuleId}
                  </div>
                </div>

                {/* Connection Ports */}
                <div
                  className={`absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 rounded-full transition-all cursor-pointer pointer-events-auto ${
                    connecting && connecting.nodeId !== node.id
                      ? 'border-green-500 hover:bg-green-50 scale-110'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePortClick(node.id, 'input')
                  }}
                  title="Input port"
                  style={{ zIndex: 10 }}
                />
                <div
                  className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 rounded-full transition-all cursor-pointer pointer-events-auto ${
                    connecting?.nodeId === node.id
                      ? 'border-blue-500 bg-blue-50 scale-110'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePortClick(node.id, 'output')
                  }}
                  title="Output port"
                  style={{ zIndex: 10 }}
                />
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
        {selectedNode && (() => {
          const node = nodes.find(n => n.id === selectedNode)
          if (!node) return null

          return (
            <aside className="w-72 border-l border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                    Properties
                  </div>
                  <button
                    onClick={() => deleteNode(selectedNode)}
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Capsule Info */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getCapsuleColor(node.capsuleId) }}
                      />
                      <div className="text-xs font-semibold text-gray-900">{node.label}</div>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">{node.capsuleId}</div>
                    <div className="text-[9px] text-gray-400 uppercase tracking-wide mt-1">
                      {getCategoryForCapsule(node.capsuleId)}
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-2 block">
                      Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-gray-400 mb-1 block">X</label>
                        <input
                          type="number"
                          value={Math.round(node.x)}
                          onChange={(e) => {
                            const newX = parseInt(e.target.value) || 0
                            setNodes(prev => prev.map(n =>
                              n.id === selectedNode ? { ...n, x: newX } : n
                            ))
                          }}
                          className="w-full h-7 px-2 text-xs bg-white border border-gray-200 rounded text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 mb-1 block">Y</label>
                        <input
                          type="number"
                          value={Math.round(node.y)}
                          onChange={(e) => {
                            const newY = parseInt(e.target.value) || 0
                            setNodes(prev => prev.map(n =>
                              n.id === selectedNode ? { ...n, y: newY } : n
                            ))
                          }}
                          className="w-full h-7 px-2 text-xs bg-white border border-gray-200 rounded text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Node ID */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-2 block">
                      Node ID
                    </label>
                    <input
                      type="text"
                      value={selectedNode}
                      disabled
                      className="w-full h-7 px-2 text-[10px] bg-gray-100 border border-gray-200 rounded text-gray-500 font-mono"
                    />
                  </div>

                  {/* Connections */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-2 block">
                      Connections
                    </label>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-500">Incoming:</span>
                        <span className="font-semibold text-gray-900">
                          {connections.filter(c => c.to === selectedNode).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-500">Outgoing:</span>
                        <span className="font-semibold text-gray-900">
                          {connections.filter(c => c.from === selectedNode).length}
                        </span>
                      </div>
                      {connections.filter(c => c.from === selectedNode || c.to === selectedNode).length === 0 && (
                        <div className="text-[10px] text-gray-400 italic pt-1 border-t">
                          No connections yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inputs Configuration */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-2 block">
                      Inputs
                    </label>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-[10px] text-gray-400 italic">
                        Configure capsule inputs here
                      </div>
                    </div>
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

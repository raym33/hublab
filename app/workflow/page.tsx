'use client'

import { useState, useRef, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Play, Save, Download, Trash2, Circle, ZoomIn, ZoomOut, Maximize2, Grid3x3, Search, LayoutGrid, HelpCircle, Lightbulb, X, CheckCircle, XCircle, ArrowRight, Clock, FolderOpen, Loader2 } from 'lucide-react'
import { allCapsules, getAllCategories, categoryMetadata } from '@/lib/all-capsules'
import { Minimap, ExecutionLogsPanel, WorkflowSaveDialog } from '@/components/workflow'
import { supabase } from '@/lib/supabase'

// Types for workflow execution
interface ExecutionLog {
  id: string
  node_id: string
  node_label: string | null
  capsule_id: string | null
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  status: 'started' | 'completed' | 'failed' | 'skipped' | null
  duration_ms: number | null
  created_at: string
  sequence_number: number
  input_data?: Record<string, unknown> | null
  output_data?: Record<string, unknown> | null
  error_message?: string | null
}

interface Execution {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout'
  started_at: string | null
  completed_at: string | null
  duration_ms: number | null
  nodes_completed: number
  nodes_total: number
  error_message: string | null
  error_node_id: string | null
}

interface SavedWorkflow {
  id: string
  name: string
  description: string | null
  nodes: Node[]
  connections: Connection[]
  category: string | null
  tags: string[]
  is_public: boolean
  execution_count: number
  updated_at: string
}

interface Node {
  id: string
  type: 'capsule'
  capsuleId: string
  label: string
  x: number
  y: number
  inputs: Record<string, any>
}

// Connection rules: which categories can connect to which (updated for HubLab's 16 real categories + Logic + Integration)
const CONNECTION_RULES: Record<string, string[]> = {
  'UI': ['Form', 'Layout', 'Navigation', 'Interaction', 'Logic', 'Integration'],
  'Form': ['UI', 'DataViz', 'AI', 'Utility', 'Logic', 'Integration'],
  'DataViz': ['UI', 'Dashboard', 'AI', 'Logic'],
  'Media': ['UI', 'AI', 'Image', 'Logic'],
  'AI': ['UI', 'Form', 'DataViz', 'LLM', 'Image', 'Speech', 'Logic', 'Integration'],
  'Animation': ['UI', 'Interaction', 'Logic'],
  'Interaction': ['UI', 'Form', 'Animation', 'Logic'],
  'Utility': ['UI', 'Form', 'DataViz', 'AI', 'Logic', 'Integration'],
  'Layout': ['UI', 'Form', 'DataViz', 'Media', 'Navigation', 'Dashboard', 'E-commerce', 'Logic'],
  'Navigation': ['UI', 'Layout', 'E-commerce', 'Logic'],
  'E-commerce': ['UI', 'Form', 'Layout', 'Navigation', 'Logic', 'Integration'],
  'Image': ['UI', 'AI', 'Media', 'Logic'],
  'Speech': ['AI', 'UI', 'Logic'],
  'LLM': ['AI', 'Form', 'UI', 'Logic', 'Integration'],
  'Social': ['UI', 'Media', 'Logic'],
  'Dashboard': ['UI', 'DataViz', 'Layout', 'Logic'],
  // Logic can connect to anything - it's the control flow
  'Logic': ['UI', 'Form', 'DataViz', 'Media', 'AI', 'Animation', 'Interaction', 'Utility', 'Layout', 'Navigation', 'E-commerce', 'Image', 'Speech', 'LLM', 'Social', 'Dashboard', 'Logic', 'Integration'],
  // Integration can connect to anything
  'Integration': ['UI', 'Form', 'DataViz', 'Media', 'AI', 'Animation', 'Interaction', 'Utility', 'Layout', 'Navigation', 'E-commerce', 'Image', 'Speech', 'LLM', 'Social', 'Dashboard', 'Logic', 'Integration']
}

interface Connection {
  id: string
  from: string
  to: string
  fromPort: string
  toPort: string
}

// Logic/Condition nodes for workflow control flow
const LOGIC_NODES = [
  { id: 'if-condition', label: 'IF Condition' },
  { id: 'if-else', label: 'IF-ELSE' },
  { id: 'switch', label: 'Switch' },
  { id: 'and-gate', label: 'AND Gate' },
  { id: 'or-gate', label: 'OR Gate' },
  { id: 'not-gate', label: 'NOT Gate' },
  { id: 'compare', label: 'Compare' },
  { id: 'filter-branch', label: 'Filter Branch' },
]

// Integration nodes for external connections
const INTEGRATION_NODES = [
  { id: 'http-request', label: 'HTTP Request' },
  { id: 'webhook-trigger', label: 'Webhook Trigger' },
  { id: 'delay', label: 'Delay' },
  { id: 'set-variable', label: 'Set Variable' },
  { id: 'get-variable', label: 'Get Variable' },
]

// Build CAPSULE_CATEGORIES dynamically from real HubLab capsules (285 total)
const CAPSULE_CATEGORIES: Record<string, { id: string; label: string }[]> = (() => {
  const categoriesMap: Record<string, { id: string; label: string }[]> = {}

  allCapsules.forEach(capsule => {
    if (!categoriesMap[capsule.category]) {
      categoriesMap[capsule.category] = []
    }
    categoriesMap[capsule.category].push({
      id: capsule.id,
      label: capsule.name
    })
  })

  // Add Logic category for conditional nodes
  categoriesMap['Logic'] = LOGIC_NODES

  // Add Integration category
  categoriesMap['Integration'] = INTEGRATION_NODES

  return categoriesMap
})()

// Use actual HubLab category colors
const TAILWIND_COLORS: Record<string, string> = {
  'blue': '#3B82F6',
  'green': '#10B981',
  'purple': '#8B5CF6',
  'indigo': '#6366F1',
  'pink': '#EC4899',
  'orange': '#F97316',
  'red': '#EF4444',
  'teal': '#14B8A6',
  'cyan': '#06B6D4',
  'lime': '#84CC16',
  'violet': '#A855F7',
  'amber': '#F59E0B',
  'emerald': '#10B981',
  'sky': '#0EA5E9',
  'slate': '#64748B',
  'gray': '#6B7280',
  'rose': '#F43F5E',
  'yellow': '#EAB308',
}

const CATEGORY_COLORS: Record<string, string> = {
  ...Object.fromEntries(
    Object.keys(categoryMetadata).map(category => [
      category,
      TAILWIND_COLORS[categoryMetadata[category].color] || '#6B7280'
    ])
  ),
  // Custom colors for workflow-specific categories
  'Logic': '#F59E0B',      // Amber - for conditional/logic nodes
  'Integration': '#06B6D4' // Cyan - for external integrations
}

// Pre-built workflow templates
const WORKFLOW_TEMPLATES = [
  {
    id: 'form-submission',
    name: 'Formulario con Feedback',
    description: 'Formulario simple con inputs, botón y mensaje de confirmación',
    icon: '📝',
    nodes: [
      { id: 'node-1', type: 'capsule' as const, capsuleId: 'input-text', label: 'Text Input', x: 100, y: 100, inputs: {} },
      { id: 'node-2', type: 'capsule' as const, capsuleId: 'input-text', label: 'Text Input', x: 100, y: 250, inputs: {} },
      { id: 'node-3', type: 'capsule' as const, capsuleId: 'button-primary', label: 'Primary Button', x: 450, y: 175, inputs: {} },
      { id: 'node-4', type: 'capsule' as const, capsuleId: 'toast', label: 'Toast', x: 800, y: 175, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-2', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-3', to: 'node-4', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'data-dashboard',
    name: 'Dashboard de Datos',
    description: 'Visualización de datos con tabla y gráficos',
    icon: '📊',
    nodes: [
      { id: 'node-1', type: 'capsule' as const, capsuleId: 'data-table', label: 'Data Table', x: 100, y: 100, inputs: {} },
      { id: 'node-2', type: 'capsule' as const, capsuleId: 'chart-bar', label: 'Bar Chart', x: 450, y: 50, inputs: {} },
      { id: 'node-3', type: 'capsule' as const, capsuleId: 'chart-pie', label: 'Pie Chart', x: 450, y: 200, inputs: {} },
      { id: 'node-4', type: 'capsule' as const, capsuleId: 'card', label: 'Card', x: 800, y: 125, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-1', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-3', to: 'node-4', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'search-filter',
    name: 'Búsqueda y Filtrado',
    description: 'Sistema de búsqueda con filtros y resultados',
    icon: '🔍',
    nodes: [
      { id: 'node-1', type: 'capsule' as const, capsuleId: 'search-input', label: 'Search', x: 100, y: 100, inputs: {} },
      { id: 'node-2', type: 'capsule' as const, capsuleId: 'dropdown-select', label: 'Dropdown', x: 100, y: 250, inputs: {} },
      { id: 'node-3', type: 'capsule' as const, capsuleId: 'list-view', label: 'List', x: 450, y: 175, inputs: {} },
      { id: 'node-4', type: 'capsule' as const, capsuleId: 'badge', label: 'Badge', x: 800, y: 175, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-2', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-3', to: 'node-4', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'media-gallery',
    name: 'Galería Multimedia',
    description: 'Galería de imágenes con carrusel y vista previa',
    icon: '🖼️',
    nodes: [
      { id: 'node-1', type: 'capsule' as const, capsuleId: 'carousel', label: 'Carousel', x: 100, y: 100, inputs: {} },
      { id: 'node-2', type: 'capsule' as const, capsuleId: 'image', label: 'Image', x: 450, y: 100, inputs: {} },
      { id: 'node-3', type: 'capsule' as const, capsuleId: 'modal', label: 'Modal', x: 800, y: 100, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-2', to: 'node-3', fromPort: 'output', toPort: 'input' }
    ]
  }
]

interface HistoryState {
  nodes: Node[]
  connections: Connection[]
}

function WorkflowBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connecting, setConnecting] = useState<{ nodeId: string; port: 'output' } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showTutorial, setShowTutorial] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Backend integration state
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)
  const [currentWorkflow, setCurrentWorkflow] = useState<SavedWorkflow | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLogsPanel, setShowLogsPanel] = useState(false)
  const [currentExecution, setCurrentExecution] = useState<Execution | null>(null)
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([])
  const [userToken, setUserToken] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // Get user token on mount
  useEffect(() => {
    const getToken = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        setUserToken(session.access_token)
      }
    }
    getToken()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserToken(session?.access_token || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Track canvas size for minimap
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setCanvasSize({ width: rect.width, height: rect.height })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Load workflow from URL param
  useEffect(() => {
    const workflowId = searchParams.get('id')
    if (workflowId && userToken) {
      loadWorkflow(workflowId)
    }
  }, [searchParams, userToken])

  // Load workflow by ID
  const loadWorkflow = async (id: string) => {
    if (!userToken) return

    try {
      const response = await fetch(`/api/workflows/${id}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      })

      if (response.ok) {
        const workflow = await response.json()
        setCurrentWorkflowId(workflow.id)
        setCurrentWorkflow(workflow)
        setNodes(workflow.nodes || [])
        setConnections(workflow.connections || [])
      }
    } catch (error) {
      console.error('Error loading workflow:', error)
    }
  }

  // Save workflow
  const handleSaveWorkflow = async (data: {
    name: string
    description: string
    category: string
    tags: string[]
    isPublic: boolean
  }) => {
    if (!userToken) {
      alert('Debes iniciar sesión para guardar workflows')
      return
    }

    setIsSaving(true)
    try {
      const workflowData = {
        name: data.name,
        description: data.description,
        category: data.category || undefined,
        tags: data.tags,
        is_public: data.isPublic,
        nodes,
        connections
      }

      const url = currentWorkflowId
        ? `/api/workflows/${currentWorkflowId}`
        : '/api/workflows'

      const response = await fetch(url, {
        method: currentWorkflowId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(workflowData)
      })

      if (response.ok) {
        const saved = await response.json()
        setCurrentWorkflowId(saved.id)
        setCurrentWorkflow(saved)
        alert('Workflow guardado correctamente')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  // Execute workflow
  const handleExecuteWorkflow = async () => {
    if (!userToken) {
      alert('Debes iniciar sesión para ejecutar workflows')
      return
    }

    if (nodes.length === 0) {
      alert('El workflow no tiene nodos para ejecutar')
      return
    }

    // If workflow not saved, prompt to save first
    if (!currentWorkflowId) {
      const shouldSave = confirm('Debes guardar el workflow antes de ejecutarlo. ¿Deseas guardarlo ahora?')
      if (shouldSave) {
        setShowSaveDialog(true)
      }
      return
    }

    setIsExecuting(true)
    setShowLogsPanel(true)
    setExecutionLogs([])
    setCurrentExecution(null)

    try {
      const response = await fetch(`/api/workflows/${currentWorkflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ input_data: {} })
      })

      const result = await response.json()

      // Create execution object from result
      const execution: Execution = {
        id: result.execution_id,
        status: result.status,
        started_at: new Date().toISOString(),
        completed_at: result.status !== 'running' ? new Date().toISOString() : null,
        duration_ms: result.duration_ms,
        nodes_completed: result.nodes_completed,
        nodes_total: result.nodes_total,
        error_message: result.error || null,
        error_node_id: result.error_node_id || null
      }

      setCurrentExecution(execution)

      // Fetch logs for this execution
      if (result.execution_id) {
        const logsResponse = await fetch(`/api/executions/${result.execution_id}/logs`, {
          headers: { 'Authorization': `Bearer ${userToken}` }
        })

        if (logsResponse.ok) {
          const logsData = await logsResponse.json()
          setExecutionLogs(logsData.logs || [])
        }
      }
    } catch (error) {
      console.error('Error executing workflow:', error)
      alert('Error al ejecutar el workflow')
    } finally {
      setIsExecuting(false)
    }
  }

  // Refresh execution logs
  const refreshExecutionLogs = async () => {
    if (!currentExecution?.id || !userToken) return

    try {
      const logsResponse = await fetch(`/api/executions/${currentExecution.id}/logs`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      })

      if (logsResponse.ok) {
        const logsData = await logsResponse.json()
        setExecutionLogs(logsData.logs || [])
      }
    } catch (error) {
      console.error('Error refreshing logs:', error)
    }
  }

  // Handle node click from logs panel
  const handleNodeClickFromLogs = (nodeId: string) => {
    setSelectedNode(nodeId)
    const node = nodes.find(n => n.id === nodeId)
    if (node && canvasRef.current) {
      // Pan to center the node
      const rect = canvasRef.current.getBoundingClientRect()
      const newPan = {
        x: -(node.x - rect.width / 2 / zoom + 112) * zoom,
        y: -(node.y - rect.height / 2 / zoom + 50) * zoom
      }
      setPan(newPan)
    }
  }

  // Handle viewport change from minimap
  const handleViewportChange = (x: number, y: number) => {
    setPan({ x, y })
  }

  // Redirect OAuth callbacks to proper handler
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      router.replace(`/auth/callback?${searchParams.toString()}`)
    }
  }, [searchParams, router])

  // Save state to history
  const saveToHistory = useCallback(() => {
    const newState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      connections: JSON.parse(JSON.stringify(connections))
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift()
    } else {
      setHistoryIndex(prev => prev + 1)
    }
    setHistory(newHistory)
  }, [nodes, connections, history, historyIndex])

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const state = history[newIndex]
      setNodes(state.nodes)
      setConnections(state.connections)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex])

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const state = history[newIndex]
      setNodes(state.nodes)
      setConnections(state.connections)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex])

  const addNode = (capsuleId: string, label: string) => {
    saveToHistory()
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

  // Load template
  const loadTemplate = (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      saveToHistory()
      setNodes(template.nodes)
      setConnections(template.connections)
      setShowTemplates(false)
    }
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected node or connection
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.repeat) {
        if (selectedNode) {
          e.preventDefault()
          deleteNode(selectedNode)
        } else if (selectedConnection) {
          e.preventDefault()
          deleteConnection(selectedConnection)
        }
      }

      // Undo (Ctrl+Z or Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }

      // Redo (Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y)
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
          (e.ctrlKey && e.key === 'y')) {
        e.preventDefault()
        handleRedo()
      }

      // Save (Ctrl+S or Cmd+S)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        setShowSaveDialog(true)
      }

      // Escape to cancel connection or deselect
      if (e.key === 'Escape') {
        setConnecting(null)
        setSelectedNode(null)
        setSelectedConnection(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, selectedConnection, handleUndo, handleRedo])

  const deleteNode = (nodeId: string) => {
    saveToHistory()
    setNodes(nodes.filter(n => n.id !== nodeId))
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId))
    setSelectedNode(null)
  }

  const deleteConnection = (connectionId: string) => {
    saveToHistory()
    setConnections(connections.filter(c => c.id !== connectionId))
    setSelectedConnection(null)
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

  // Validate if a connection is allowed
  const canConnect = (fromNodeId: string, toNodeId: string): { allowed: boolean; reason?: string } => {
    const fromNode = nodes.find(n => n.id === fromNodeId)
    const toNode = nodes.find(n => n.id === toNodeId)

    if (!fromNode || !toNode) {
      return { allowed: false, reason: 'Nodo no encontrado' }
    }

    if (fromNodeId === toNodeId) {
      return { allowed: false, reason: 'No puedes conectar un nodo consigo mismo' }
    }

    // Check if connection already exists
    if (connections.some(c => c.from === fromNodeId && c.to === toNodeId)) {
      return { allowed: false, reason: 'Esta conexión ya existe' }
    }

    const fromCategory = getCategoryForCapsule(fromNode.capsuleId)
    const toCategory = getCategoryForCapsule(toNode.capsuleId)

    const allowedTargets = CONNECTION_RULES[fromCategory] || []

    if (!allowedTargets.includes(toCategory)) {
      return {
        allowed: false,
        reason: `${fromCategory} no puede conectarse a ${toCategory}. Intenta con: ${allowedTargets.join(', ')}`
      }
    }

    return { allowed: true }
  }

  const handlePortClick = (nodeId: string, port: 'input' | 'output') => {
    if (port === 'output') {
      // Start connection from output port
      setConnecting({ nodeId, port: 'output' })
      setConnectionError(null)
    } else if (port === 'input' && connecting) {
      // Validate connection before creating
      const validation = canConnect(connecting.nodeId, nodeId)

      if (!validation.allowed) {
        setConnectionError(validation.reason || 'Conexión no permitida')
        setTimeout(() => setConnectionError(null), 4000)
        return
      }

      // Complete connection to input port
      saveToHistory()
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: connecting.nodeId,
        to: nodeId,
        fromPort: 'output',
        toPort: 'input'
      }
      setConnections([...connections, newConnection])
      setConnecting(null)
      setConnectionError(null)

      // Advance tutorial if in tutorial mode
      if (showTutorial && tutorialStep === 2) {
        setTutorialStep(3)
      }
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
    setShowSaveDialog(true)
  }

  const handleExport = () => {
    const workflow = {
      name: currentWorkflow?.name || 'My Workflow',
      description: currentWorkflow?.description,
      nodes,
      connections,
      createdAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workflow-${currentWorkflow?.name || 'untitled'}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRun = () => {
    handleExecuteWorkflow()
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
              <h1 className="text-lg font-bold text-white">
                {currentWorkflow?.name || 'Workflow Builder'}
              </h1>
              <p className="text-xs text-purple-100">
                {nodes.length} nodo{nodes.length !== 1 ? 's' : ''} • {connections.length} conexi{connections.length !== 1 ? 'ones' : 'ón'}
                {currentWorkflow && ` • v${currentWorkflow.execution_count || 0} ejecuciones`}
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
            onClick={() => setShowTemplates(!showTemplates)}
            className="h-9 px-3 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all flex items-center gap-1.5 border border-white/20"
          >
            <Lightbulb size={14} />
            Plantillas
          </button>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="h-9 px-3 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all flex items-center gap-1.5 border border-white/20"
          >
            <HelpCircle size={14} />
            Guía
          </button>
          <div className="w-px h-6 bg-white/20" />
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="h-9 px-3 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            title="Deshacer (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="h-9 px-3 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            title="Rehacer (Ctrl+Shift+Z)"
          >
            ↷
          </button>
          <div className="w-px h-6 bg-white/20" />
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
          {currentExecution && (
            <button
              onClick={() => setShowLogsPanel(true)}
              className="h-9 px-3 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Clock size={14} />
              Logs
            </button>
          )}
          <button
            onClick={handleRun}
            disabled={nodes.length === 0 || isExecuting}
            className="h-9 px-4 text-xs font-medium text-purple-600 bg-white hover:bg-purple-50 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold"
          >
            {isExecuting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <Play size={14} />
                Ejecutar
              </>
            )}
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
              <svg className="absolute inset-0" style={{ zIndex: 1, width: '5000px', height: '5000px' }}>
                {connections.map((conn) => {
                  const from = getNodeCenter(conn.from)
                  const to = getNodeCenter(conn.to)
                  const midX = (from.x + to.x) / 2
                  const isSelected = selectedConnection === conn.id

                  return (
                    <g key={conn.id}>
                      {/* Invisible wider path for easier clicking */}
                      <path
                        d={`M ${from.x + 96} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 96} ${to.y}`}
                        stroke="transparent"
                        strokeWidth="20"
                        fill="none"
                        className="cursor-pointer pointer-events-auto"
                        onClick={() => setSelectedConnection(conn.id)}
                      />
                      {/* Visible connection path */}
                      <path
                        d={`M ${from.x + 96} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 96} ${to.y}`}
                        stroke={isSelected ? '#EF4444' : 'url(#connectionGradient)'}
                        strokeWidth={isSelected ? '4' : '3'}
                        fill="none"
                        strokeDasharray="0"
                        className="pointer-events-none transition-all"
                        style={{
                          filter: isSelected
                            ? 'drop-shadow(0 4px 8px rgba(239,68,68,0.4))'
                            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                      >
                        {!isSelected && (
                          <animate
                            attributeName="stroke-dasharray"
                            from="0,10"
                            to="10,0"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        )}
                      </path>
                      <circle
                        cx={from.x + 96}
                        cy={from.y}
                        r="4"
                        fill={isSelected ? "#EF4444" : "#8B5CF6"}
                        stroke="white"
                        strokeWidth="2"
                        className="pointer-events-none"
                      />
                      <circle
                        cx={to.x - 96}
                        cy={to.y}
                        r="4"
                        fill={isSelected ? "#EF4444" : "#3B82F6"}
                        stroke="white"
                        strokeWidth="2"
                        className="pointer-events-none"
                      />
                      {/* Delete button when selected */}
                      {isSelected && (
                        <g
                          className="cursor-pointer pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteConnection(conn.id)
                          }}
                        >
                          <circle
                            cx={midX}
                            cy={(from.y + to.y) / 2}
                            r="12"
                            fill="#EF4444"
                            stroke="white"
                            strokeWidth="2"
                            className="hover:fill-red-600 transition-colors"
                          />
                          <path
                            d={`M ${midX - 4} ${(from.y + to.y) / 2 - 4} L ${midX + 4} ${(from.y + to.y) / 2 + 4} M ${midX + 4} ${(from.y + to.y) / 2 - 4} L ${midX - 4} ${(from.y + to.y) / 2 + 4}`}
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="pointer-events-none"
                          />
                        </g>
                      )}
                    </g>
                  )
                })}

                {/* Temporary connection line while dragging */}
                {connecting && (
                  <g>
                    <path
                      d={`M ${getNodeCenter(connecting.nodeId).x + 96} ${getNodeCenter(connecting.nodeId).y} L ${getNodeCenter(connecting.nodeId).x + 200} ${getNodeCenter(connecting.nodeId).y}`}
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                      className="pointer-events-none"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="10"
                        dur="0.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <circle
                      cx={getNodeCenter(connecting.nodeId).x + 96}
                      cy={getNodeCenter(connecting.nodeId).y}
                      r="5"
                      fill="#8B5CF6"
                      className="pointer-events-none"
                    >
                      <animate
                        attributeName="r"
                        values="5;7;5"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                )}

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
                        ? canConnect(connecting.nodeId, node.id).allowed
                          ? 'border-green-500 hover:bg-green-50 scale-125 animate-pulse'
                          : 'border-red-500 hover:bg-red-50 scale-125 animate-pulse'
                        : 'border-gray-300 hover:border-blue-500 hover:scale-110'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePortClick(node.id, 'input')
                    }}
                    title={connecting && connecting.nodeId !== node.id
                      ? canConnect(connecting.nodeId, node.id).allowed
                        ? 'Conexión válida - Click para conectar'
                        : canConnect(connecting.nodeId, node.id).reason
                      : 'Puerto de entrada'}
                    style={{ zIndex: 10, borderWidth: '3px' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {connecting && connecting.nodeId !== node.id ? (
                        canConnect(connecting.nodeId, node.id).allowed ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )
                      ) : (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
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
                    title={connecting?.nodeId === node.id ? 'Iniciando conexión...' : 'Puerto de salida - Click para comenzar conexión'}
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
                      Crea tu primer workflow
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      Arrastra cápsulas desde la barra lateral y conéctalas para crear flujos de datos y automatizaciones.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                      <button
                        onClick={() => setShowTemplates(true)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg font-medium"
                      >
                        <Lightbulb className="w-4 h-4" />
                        Ver plantillas
                      </button>
                      <button
                        onClick={() => setShowGuide(true)}
                        className="px-4 py-2 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Ver guía
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                      <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🎯</span>
                        <span className="font-medium">1. Añade nodos</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🔗</span>
                        <span className="font-medium">2. Conecta flujos</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🎨</span>
                        <span className="font-medium">3. Organiza layout</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">💾</span>
                        <span className="font-medium">4. Exporta JSON</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connection Error Toast */}
          {connectionError && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-bottom-4">
              <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border-2 border-red-600">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{connectionError}</span>
              </div>
            </div>
          )}

          {/* Templates Panel */}
          {showTemplates && (
            <div className="absolute top-20 left-4 z-30 w-96 animate-in slide-in-from-left-4">
              <div className="bg-white rounded-xl shadow-2xl border-2 border-purple-200">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-t-xl flex items-center justify-between">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Plantillas de Workflow
                  </h3>
                  <button onClick={() => setShowTemplates(false)} className="text-white hover:bg-white/20 p-1 rounded">
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="space-y-3">
                    {WORKFLOW_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => loadTemplate(template.id)}
                        className="w-full text-left bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl group-hover:scale-110 transition-transform">
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                              {template.name}
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed mb-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                {template.nodes.length} nodos
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                {template.connections.length} conexiones
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800 leading-relaxed">
                      💡 <strong>Tip:</strong> Las plantillas te ayudan a comenzar rápidamente con configuraciones comunes de workflow. Puedes modificarlas después de cargarlas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guide Panel */}
          {showGuide && (
            <div className="absolute top-20 right-4 z-30 w-96 animate-in slide-in-from-right-4">
              <div className="bg-white rounded-xl shadow-2xl border-2 border-purple-200">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-t-xl flex items-center justify-between">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Guía de Conexiones
                  </h3>
                  <button onClick={() => setShowGuide(false)} className="text-white hover:bg-white/20 p-1 rounded">
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="space-y-4">
                    {/* What is a workflow */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-sm text-blue-900 mb-2 flex items-center gap-2">
                        <Circle className="w-3 h-3 fill-blue-600" />
                        ¿Qué es un workflow?
                      </h4>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        Un workflow es un flujo de datos entre componentes. Los datos fluyen desde un componente de entrada hasta componentes que los procesan y muestran.
                      </p>
                    </div>

                    {/* Connection rules */}
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-3">📋 Reglas de Conexión</h4>
                      <div className="space-y-2 text-xs">
                        {Object.entries(CONNECTION_RULES).slice(0, 6).map(([category, targets]) => (
                          <div key={category} className="bg-gray-50 p-2 rounded-lg">
                            <div className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[category] || '#6B7280' }} />
                              {category}
                            </div>
                            <div className="text-gray-600 pl-4 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3 flex-shrink-0" />
                              {targets.slice(0, 3).join(', ')}
                              {targets.length > 3 && '...'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Common patterns */}
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-3">💡 Patrones Comunes</h4>
                      <div className="space-y-3">
                        <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded-r-lg">
                          <div className="font-semibold text-xs text-green-900 mb-1">✅ Formulario → Base de Datos → Lista</div>
                          <div className="text-[10px] text-green-700">Recoger datos, guardarlos y mostrarlos</div>
                        </div>

                        <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r-lg">
                          <div className="font-semibold text-xs text-blue-900 mb-1">✅ Input → Chart → Display</div>
                          <div className="text-[10px] text-blue-700">Entrada de datos, visualización y presentación</div>
                        </div>

                        <div className="border-l-4 border-purple-500 bg-purple-50 p-3 rounded-r-lg">
                          <div className="font-semibold text-xs text-purple-900 mb-1">✅ Button → API → Feedback</div>
                          <div className="text-[10px] text-purple-700">Acción, proceso y notificación</div>
                        </div>

                        <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded-r-lg">
                          <div className="font-semibold text-xs text-red-900 mb-1">❌ Display → Input</div>
                          <div className="text-[10px] text-red-700">No válido: los datos no pueden volver hacia atrás</div>
                        </div>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <h4 className="font-bold text-xs text-amber-900 mb-2">💡 Tips</h4>
                      <ul className="text-[10px] text-amber-800 space-y-1">
                        <li>• Los <strong>Layout</strong> pueden contener casi cualquier componente</li>
                        <li>• Los <strong>Input</strong> alimentan a formularios y datos</li>
                        <li>• Los <strong>Buttons</strong> activan acciones y navegación</li>
                        <li>• Los <strong>Data</strong> procesan y transforman información</li>
                        <li>• Los <strong>Display</strong> muestran resultados al usuario</li>
                        <li>• Los <strong>Feedback</strong> informan sobre acciones completadas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {/* Minimap */}
      <Minimap
        nodes={nodes}
        connections={connections}
        viewportX={pan.x}
        viewportY={pan.y}
        zoom={zoom}
        containerWidth={canvasSize.width}
        containerHeight={canvasSize.height}
        selectedNodeId={selectedNode}
        getCapsuleColor={getCapsuleColor}
        onViewportChange={handleViewportChange}
      />

      {/* Execution Logs Panel */}
      <ExecutionLogsPanel
        isOpen={showLogsPanel}
        onClose={() => setShowLogsPanel(false)}
        execution={currentExecution}
        logs={executionLogs}
        isExecuting={isExecuting}
        onRefresh={refreshExecutionLogs}
        onNodeClick={handleNodeClickFromLogs}
      />

      {/* Save Dialog */}
      <WorkflowSaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveWorkflow}
        initialName={currentWorkflow?.name || ''}
        initialDescription={currentWorkflow?.description || ''}
        initialCategory={currentWorkflow?.category || ''}
        initialTags={currentWorkflow?.tags || []}
        initialIsPublic={currentWorkflow?.is_public || false}
        isUpdate={!!currentWorkflowId}
      />
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

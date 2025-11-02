'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
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
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { getAllCapsulesExtended } from '@/lib/capsules-v2/definitions-extended'
import * as LivePreviews from '@/components/LiveCapsulePreviews'
import CapsulePreviewModal from '@/components/CapsulePreviewModal'
import CodeExportModal from '@/components/CodeExportModal'
import { Layers, Bot, Eye, Menu, X, ChevronDown, ChevronRight, Search, Download, Undo2, Redo2, Trash2, Keyboard } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface CapsuleCategory {
  name: string
  capsules: any[]
  expanded: boolean
}

type MobileTab = 'canvas' | 'capsules' | 'preview' | 'ai'

function StudioV2Inner() {
  // Get ReactFlow instance for proper coordinate transformation
  const { screenToFlowPosition } = useReactFlow()

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // Undo/Redo state
  const [history, setHistory] = useState<{ nodes: Node[], edges: any[] }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Mobile/Responsive state
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<MobileTab>('canvas')
  const [showCapsuleDrawer, setShowCapsuleDrawer] = useState(false)
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false)
  const [showAIDrawer, setShowAIDrawer] = useState(false)
  const [isDraggingCapsule, setIsDraggingCapsule] = useState(false)

  // Desktop UI state
  const [leftPanelWidth, setLeftPanelWidth] = useState(280)
  const [rightPanelWidth, setRightPanelWidth] = useState(320)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [previewCapsule, setPreviewCapsule] = useState<any>(null)

  // Modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedCapsuleForPreview, setSelectedCapsuleForPreview] = useState<any>(null)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

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

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Auto-close desktop panels on mobile
      if (mobile) {
        setShowAssistant(false)
      } else {
        setShowAssistant(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Save to history when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push({ nodes, edges })
      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift()
      } else {
        setHistoryIndex(historyIndex + 1)
      }
      setHistory(newHistory)
    }
  }, [nodes, edges])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Cmd+Z / Ctrl+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      // Redo: Cmd+Shift+Z / Ctrl+Shift+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      }
      // Delete selected nodes: Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode) {
        e.preventDefault()
        deleteSelectedNode()
      }
      // Export: Cmd+E / Ctrl+E
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        setIsExportModalOpen(true)
      }
      // Search: Cmd+F / Ctrl+F
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        document.getElementById('capsule-search')?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, historyIndex])

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const state = history[newIndex]
      setNodes(state.nodes)
      setEdges(state.edges)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const state = history[newIndex]
      setNodes(state.nodes)
      setEdges(state.edges)
    }
  }

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setSelectedNode(null)
    }
  }

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
    setIsDraggingCapsule(true)
  }

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const capsuleData = event.dataTransfer.getData('application/reactflow')

      if (!capsuleData) return

      const capsule = JSON.parse(capsuleData)

      // Use ReactFlow's screenToFlowPosition to properly convert screen coordinates
      // to flow coordinates, accounting for zoom and pan
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = {
        id: `${capsule.id}-${Date.now()}`,
        type: 'default',
        position,
        data: {
          label: capsule.name,
          capsule
        },
      }

      setNodes((nds) => nds.concat(newNode))
      setIsDraggingCapsule(false)

      // Close drawer on mobile after adding
      if (isMobile) {
        setShowCapsuleDrawer(false)
        setActiveTab('canvas')
      }
    },
    [screenToFlowPosition, setNodes, isMobile],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDragEnd = useCallback(() => {
    setIsDraggingCapsule(false)
  }, [])

  const handleCapsuleClick = (capsule: any) => {
    setSelectedCapsuleForPreview(capsule)
    setIsPreviewModalOpen(true)
  }

  const handleAddToCanvas = () => {
    if (!selectedCapsuleForPreview) return

    const newNode = {
      id: `${Date.now()}`,
      type: 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100
      },
      data: {
        label: selectedCapsuleForPreview.name,
        capsule: selectedCapsuleForPreview
      }
    }

    setNodes((nds) => [...nds, newNode])

    // Close modal and clear selection after adding
    setIsPreviewModalOpen(false)
    setSelectedCapsuleForPreview(null)
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

  // Capsules Panel Component (reusable for desktop & mobile)
  const CapsulesPanel = () => (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Capsules</h2>
          {isMobile && (
            <button
              onClick={() => setShowCapsuleDrawer(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="capsule-search"
            type="text"
            placeholder="Search capsules... (⌘F)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredCategories.map((category) => (
          <div key={category.name} className="mb-3">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center justify-between p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-semibold text-white capitalize">{category.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{category.capsules.length}</span>
                {category.expanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {category.expanded && (
              <div className="ml-2 space-y-1 mt-1">
                {category.capsules.map((capsule) => (
                  <div
                    key={capsule.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, capsule)}
                    onDragEnd={onDragEnd}
                    onClick={() => handleCapsuleClick(capsule)}
                    className="p-2 rounded bg-gray-700/50 border border-gray-600 cursor-move hover:bg-gray-600 hover:border-blue-500 transition-all active:scale-95"
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
  )

  // Preview Panel Component
  const PreviewPanel = () => (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          {previewCapsule ? `Preview: ${previewCapsule.name}` : 'Live Preview'}
        </h3>
        <button
          onClick={() => {
            if (isMobile) {
              setShowPreviewDrawer(false)
            } else {
              setBottomPanelHeight(0)
              setPreviewCapsule(null)
            }
          }}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {previewCapsule ? (
          <div className="bg-white rounded-lg p-6">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">{previewCapsule.name}</h4>
              <p className="text-sm text-gray-600 mb-1">{previewCapsule.description}</p>
              <div className="text-xs text-gray-500">
                Category: <span className="text-blue-600">{previewCapsule.category}</span>
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              {(() => {
                try {
                  const componentName = `Live${previewCapsule.name.replace(/\s+/g, '')}`
                  const PreviewComponent = (LivePreviews as any)[componentName]

                  if (PreviewComponent) {
                    return <PreviewComponent />
                  } else {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        <p className="mb-2">No live preview available for this capsule yet.</p>
                        <p className="text-sm">
                          Component name: <code className="bg-gray-200 px-2 py-1 rounded">{componentName}</code>
                        </p>
                      </div>
                    )
                  }
                } catch (error: any) {
                  return (
                    <div className="text-center py-8 text-red-500">
                      <p className="mb-2 font-semibold">Preview Error</p>
                      <p className="text-sm text-gray-600">{error.message}</p>
                    </div>
                  )
                }
              })()}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400 text-center py-8">
            Click on any capsule to see a live preview
          </div>
        )}
      </div>
    </div>
  )

  // AI Assistant Panel Component
  const AIPanel = () => (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-bold text-white">AI Assistant</h3>
        </div>
        <button
          onClick={() => {
            if (isMobile) {
              setShowAIDrawer(false)
            } else {
              setShowAssistant(false)
            }
          }}
          className="text-white hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

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

      <div className="p-4 bg-gray-900 border-t border-gray-700 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type your message here..."
            disabled={isAssistantThinking}
            className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:bg-gray-100"
          />
          <button
            onClick={sendMessage}
            disabled={!userInput.trim() || isAssistantThinking}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isAssistantThinking ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* DESKTOP LAYOUT (>= 768px) */}
      {!isMobile && (
        <div className="flex-1 flex">
          {/* Left Panel - Capsules */}
          <div
            className="bg-gray-800 border-r border-gray-700 overflow-hidden"
            style={{ width: `${leftPanelWidth}px` }}
          >
            <CapsulesPanel />
          </div>

          {/* Center - Canvas */}
          <div className={`flex-1 flex flex-col transition-all ${isDraggingCapsule ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

              {/* Control Buttons Panel */}
              <Panel position="top-right" className="m-2">
                <div className="flex flex-col gap-2">
                  {/* Top row: Undo/Redo/Delete */}
                  <div className="flex gap-2 bg-white rounded-lg shadow-lg p-1">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Undo (⌘Z)"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Redo (⌘⇧Z)"
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-gray-300"></div>
                    <button
                      onClick={deleteSelectedNode}
                      disabled={!selectedNode}
                      className="p-2 hover:bg-red-50 text-red-600 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Delete Selected (Del)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom row: Export & Shortcuts */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                      className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:shadow-lg transition-all border border-gray-200"
                      title="Keyboard Shortcuts"
                    >
                      <Keyboard className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                      title="Export Code (⌘E)"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Export</span>
                    </button>
                  </div>
                </div>
              </Panel>

              {/* Keyboard Shortcuts Tooltip */}
              {showKeyboardShortcuts && (
                <Panel position="top-right" className="mr-2 mt-32">
                  <div className="bg-white rounded-lg shadow-2xl p-4 border border-gray-200 max-w-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm">Keyboard Shortcuts</h3>
                      <button
                        onClick={() => setShowKeyboardShortcuts(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Undo</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">⌘Z</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Redo</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">⌘⇧Z</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Delete Node</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">Del</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Export</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">⌘E</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Search</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">⌘F</kbd>
                      </div>
                    </div>
                  </div>
                </Panel>
              )}
            </ReactFlow>

            {/* Bottom Panel - Preview */}
            {bottomPanelHeight > 0 && (
              <div
                className="bg-gray-800 border-t border-gray-700"
                style={{ height: `${bottomPanelHeight}px` }}
              >
                <PreviewPanel />
              </div>
            )}
          </div>

          {/* Right Panel - AI Assistant (Desktop) */}
          {showAssistant && (
            <div
              className="bg-gray-800 border-l border-gray-700 overflow-hidden"
              style={{ width: `${rightPanelWidth}px` }}
            >
              <AIPanel />
            </div>
          )}

          {/* Toggle AI Button (when hidden) */}
          {!showAssistant && (
            <button
              onClick={() => setShowAssistant(true)}
              className="fixed bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-xl z-50"
            >
              🤖
            </button>
          )}
        </div>
      )}

      {/* MOBILE LAYOUT (< 768px) */}
      {isMobile && (
        <>
          {/* Canvas - Always Visible */}
          <div className="flex-1 relative overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              minZoom={0.1}
              maxZoom={4}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              panOnScroll
              panOnScrollSpeed={0.5}
              zoomOnScroll={false}
              zoomOnPinch
              preventScrolling={true}
            >
              <Controls
                className="!left-2 !bottom-20"
                showInteractive={false}
              />
              <Background
                variant={BackgroundVariant.Dots}
                gap={16}
                size={1.5}
                className="bg-gray-900"
              />

              {/* Export Button Panel (Mobile) - Repositioned */}
              <Panel position="top-left" className="m-2">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg active:scale-95 transition-all touch-manipulation"
                  title="Export Code"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-xs font-semibold">Export</span>
                </button>
              </Panel>

              {/* Mobile Helper Text */}
              {nodes.length === 0 && (
                <Panel position="top-center" className="mt-16">
                  <div className="bg-gray-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700 max-w-xs">
                    <p className="text-sm text-center">
                      Tap <span className="font-semibold text-blue-400">Capsules</span> below to add components
                    </p>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>

          {/* Bottom Navigation Bar - Enhanced for Mobile */}
          <div className="bg-gray-800/95 backdrop-blur-md border-t-2 border-gray-700 safe-area-bottom shadow-2xl">
            <div className="grid grid-cols-4 gap-1 px-2 py-3">
              <button
                onClick={() => {
                  setActiveTab('canvas')
                  setShowCapsuleDrawer(false)
                  setShowPreviewDrawer(false)
                  setShowAIDrawer(false)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
                  activeTab === 'canvas'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-400 active:bg-gray-700'
                }`}
              >
                <Layers className={`w-6 h-6 mb-1 ${activeTab === 'canvas' ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-semibold">Canvas</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('capsules')
                  setShowCapsuleDrawer(true)
                  setShowPreviewDrawer(false)
                  setShowAIDrawer(false)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
                  activeTab === 'capsules'
                    ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'text-gray-400 active:bg-gray-700'
                }`}
              >
                <Menu className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">Capsules</span>
                {nodes.length === 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('preview')
                  setShowCapsuleDrawer(false)
                  setShowPreviewDrawer(true)
                  setShowAIDrawer(false)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
                  activeTab === 'preview'
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg'
                    : 'text-gray-400 active:bg-gray-700'
                }`}
                disabled={nodes.length === 0}
              >
                <Eye className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">Preview</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('ai')
                  setShowCapsuleDrawer(false)
                  setShowPreviewDrawer(false)
                  setShowAIDrawer(true)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-95 touch-manipulation ${
                  activeTab === 'ai'
                    ? 'bg-gradient-to-br from-pink-600 to-pink-700 text-white shadow-lg'
                    : 'text-gray-400 active:bg-gray-700'
                }`}
              >
                <Bot className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">AI</span>
              </button>
            </div>
          </div>

          {/* Capsules Drawer (Mobile) - Enhanced */}
          {showCapsuleDrawer && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowCapsuleDrawer(false)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300"
                style={{ height: '75vh', maxHeight: '75vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drawer Handle */}
                <div className="sticky top-0 z-10 bg-gray-800 rounded-t-3xl pt-3 pb-2">
                  <div className="h-1.5 w-16 bg-gray-600 rounded-full mx-auto mb-1"></div>
                  <div className="flex items-center justify-between px-4 pt-2">
                    <h3 className="text-lg font-bold text-white">Capsules Library</h3>
                    <button
                      onClick={() => setShowCapsuleDrawer(false)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto h-full pb-20">
                  <CapsulesPanel />
                </div>
              </div>
            </div>
          )}

          {/* Preview Drawer (Mobile) - Enhanced */}
          {showPreviewDrawer && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowPreviewDrawer(false)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300"
                style={{ height: '70vh', maxHeight: '70vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drawer Handle */}
                <div className="sticky top-0 z-10 bg-gray-800 rounded-t-3xl pt-3 pb-2">
                  <div className="h-1.5 w-16 bg-gray-600 rounded-full mx-auto mb-1"></div>
                  <div className="flex items-center justify-between px-4 pt-2">
                    <h3 className="text-lg font-bold text-white">Preview</h3>
                    <button
                      onClick={() => setShowPreviewDrawer(false)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto h-full pb-20">
                  <PreviewPanel />
                </div>
              </div>
            </div>
          )}

          {/* AI Drawer (Mobile) - Enhanced */}
          {showAIDrawer && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowAIDrawer(false)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col"
                style={{ height: '75vh', maxHeight: '75vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drawer Handle */}
                <div className="sticky top-0 z-10 bg-gray-800 rounded-t-3xl pt-3 pb-2 border-b border-gray-700">
                  <div className="h-1.5 w-16 bg-gray-600 rounded-full mx-auto mb-1"></div>
                  <div className="flex items-center justify-between px-4 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                    </div>
                    <button
                      onClick={() => setShowAIDrawer(false)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <AIPanel />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Capsule Preview Modal */}
      <CapsulePreviewModal
        capsule={selectedCapsuleForPreview}
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false)
          setSelectedCapsuleForPreview(null)
        }}
        onAddToCanvas={handleAddToCanvas}
      />

      {/* Code Export Modal */}
      <CodeExportModal
        nodes={nodes}
        edges={edges}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  )
}

// Wrapper component that provides ReactFlow context
export default function StudioV2Page() {
  return (
    <ReactFlowProvider>
      <StudioV2Inner />
    </ReactFlowProvider>
  )
}

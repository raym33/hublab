'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Plus, Sparkles, Play, Download, Save, Zap, ArrowRight, Check, X, Layers } from 'lucide-react'
import { EXAMPLE_CAPSULES } from '@/lib/capsule-compiler/example-capsules'
import { WORKFLOW_TEMPLATES } from '@/lib/capsule-compiler/workflow-templates'
import type { UniversalCapsule, CapsuleComposition, CapsuleNode as CompilerNode, CapsuleConnection } from '@/lib/capsule-compiler/types'

interface Position {
  x: number
  y: number
}

interface WorkflowNode {
  id: string
  capsuleId: string
  capsule: UniversalCapsule
  position: Position
  config: Record<string, any>
}

interface Connection {
  id: string
  from: string
  to: string
  fromOutput: string
  toInput: string
}

export default function CapsuleStudio() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<{ nodeId: string; output: string } | null>(null)
  const [platform, setPlatform] = useState<'web' | 'desktop' | 'ios' | 'android'>('web')
  const [isCompiling, setIsCompiling] = useState(false)
  const [compilationResult, setCompilationResult] = useState<any>(null)
  const [showAIPrompt, setShowAIPrompt] = useState(false)
  const [aiPrompt, setAIPrompt] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })

  // Add capsule to canvas
  const addCapsule = useCallback((capsule: UniversalCapsule, position?: Position) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}-${Math.random()}`,
      capsuleId: capsule.id,
      capsule,
      position: position || { x: 100 + nodes.length * 50, y: 100 + nodes.length * 50 },
      config: {}
    }
    setNodes(prev => [...prev, newNode])
  }, [nodes.length])

  // Handle node drag
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return
    e.stopPropagation()

    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    setDraggingNode(nodeId)
    setSelectedNode(nodeId)
    setDragOffset({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingNode) return

    setNodes(prev => prev.map(node =>
      node.id === draggingNode
        ? { ...node, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } }
        : node
    ))
  }, [draggingNode, dragOffset])

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null)
  }, [])

  useEffect(() => {
    if (draggingNode) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggingNode, handleMouseMove, handleMouseUp])

  // Start connection
  const startConnection = (nodeId: string, outputKey: string) => {
    setConnecting({ nodeId, output: outputKey })
  }

  // Complete connection
  const completeConnection = (toNodeId: string, inputKey: string) => {
    if (!connecting) return
    if (connecting.nodeId === toNodeId) {
      setConnecting(null)
      return
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      from: connecting.nodeId,
      to: toNodeId,
      fromOutput: connecting.output,
      toInput: inputKey
    }

    setConnections(prev => [...prev, newConnection])
    setConnecting(null)
  }

  // Delete node
  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId))
    if (selectedNode === nodeId) setSelectedNode(null)
  }

  // Compile workflow
  const handleCompile = async () => {
    setIsCompiling(true)
    setCompilationResult(null)

    try {
      // Build composition from nodes and connections
      const composition: CapsuleComposition = {
        id: `workflow-${Date.now()}`,
        name: 'My Workflow',
        version: '1.0.0',
        platform,
        nodes: nodes.map(node => ({
          id: node.id,
          capsuleId: node.capsuleId,
          version: node.capsule.version,
          config: node.config
        })),
        connections: connections.map(conn => ({
          from: conn.from,
          to: conn.to,
          outputKey: conn.fromOutput,
          inputKey: conn.toInput
        })),
        entrypoint: nodes[0]?.id || ''
      }

      const response = await fetch('/api/compiler/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition,
          platform
        })
      })

      const result = await response.json()
      setCompilationResult(result)
    } catch (error) {
      console.error('Compilation error:', error)
      setCompilationResult({ success: false, error: String(error) })
    } finally {
      setIsCompiling(false)
    }
  }

  // AI-powered generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return

    setIsCompiling(true)
    try {
      const response = await fetch('/api/compiler/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          platform
        })
      })

      const result = await response.json()

      if (result.success && result.composition) {
        // Load the generated workflow
        const comp = result.composition
        const newNodes: WorkflowNode[] = comp.nodes.map((node: CompilerNode, index: number) => {
          const capsule = EXAMPLE_CAPSULES.find(c => c.id === node.capsuleId)
          if (!capsule) return null

          return {
            id: node.id,
            capsuleId: node.capsuleId,
            capsule,
            position: { x: 150 + (index % 4) * 250, y: 150 + Math.floor(index / 4) * 200 },
            config: node.config || {}
          }
        }).filter(Boolean) as WorkflowNode[]

        const newConnections: Connection[] = comp.connections.map((conn: CapsuleConnection) => ({
          id: `conn-${Date.now()}-${Math.random()}`,
          from: conn.from,
          to: conn.to,
          fromOutput: conn.outputKey,
          toInput: conn.inputKey
        }))

        setNodes(newNodes)
        setConnections(newConnections)
      }

      setCompilationResult(result)
      setShowAIPrompt(false)
      setAIPrompt('')
    } catch (error) {
      console.error('AI generation error:', error)
    } finally {
      setIsCompiling(false)
    }
  }

  // Clear canvas
  const clearCanvas = () => {
    setNodes([])
    setConnections([])
    setSelectedNode(null)
    setCompilationResult(null)
  }

  // Load template
  const loadTemplate = (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId)
    if (!template) return

    clearCanvas()

    const newNodes: WorkflowNode[] = template.composition.nodes.map((node, index) => {
      const capsule = EXAMPLE_CAPSULES.find(c => c.id === node.capsuleId)
      if (!capsule) return null

      return {
        id: node.id,
        capsuleId: node.capsuleId,
        capsule,
        position: { x: 150 + (index % 4) * 280, y: 150 + Math.floor(index / 4) * 200 },
        config: node.config || {}
      }
    }).filter(Boolean) as WorkflowNode[]

    const newConnections: Connection[] = template.composition.connections.map(conn => ({
      id: `conn-${Date.now()}-${Math.random()}`,
      from: conn.from,
      to: conn.to,
      fromOutput: conn.outputKey,
      toInput: conn.inputKey
    }))

    setNodes(newNodes)
    setConnections(newConnections)
    setShowTemplates(false)
  }

  // Get node position
  const getNodePosition = (nodeId: string) => {
    return nodes.find(n => n.id === nodeId)?.position || { x: 0, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Capsule Studio</h1>
                <p className="text-sm text-gray-400">Visual workflow builder</p>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10"></div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Platform:</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="web">Web</option>
                <option value="desktop">Desktop</option>
                <option value="ios">iOS</option>
                <option value="android">Android</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              <Layers className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setShowAIPrompt(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Generate
            </button>
            <button
              onClick={handleCompile}
              disabled={nodes.length === 0 || isCompiling}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {isCompiling ? 'Compiling...' : 'Compile'}
            </button>
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Capsule Palette */}
        <div className="w-80 border-r border-white/10 bg-black/20 backdrop-blur-xl overflow-y-auto">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white mb-2">Capsules</h2>
            <p className="text-sm text-gray-400">{EXAMPLE_CAPSULES.length} available</p>
          </div>

          <div className="p-4 space-y-2">
            {EXAMPLE_CAPSULES.map((capsule) => (
              <button
                key={capsule.id}
                onClick={() => addCapsule(capsule)}
                className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all group"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="font-medium text-white text-sm">{capsule.name}</div>
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs text-gray-400 line-clamp-2">{capsule.description}</div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">
                    {capsule.category}
                  </span>
                  <span className="text-gray-500">{capsule.version}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-slate-950"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        >
          {/* SVG for connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {connections.map(conn => {
              const fromPos = getNodePosition(conn.from)
              const toPos = getNodePosition(conn.to)

              const x1 = fromPos.x + 240
              const y1 = fromPos.y + 60
              const x2 = toPos.x
              const y2 = toPos.y + 60

              const midX = (x1 + x2) / 2

              return (
                <g key={conn.id}>
                  <path
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    stroke="rgba(59, 130, 246, 0.5)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx={x2} cy={y2} r="4" fill="rgb(59, 130, 246)" />
                </g>
              )
            })}

            {/* Connection being drawn */}
            {connecting && (
              <line
                x1={getNodePosition(connecting.nodeId).x + 240}
                y1={getNodePosition(connecting.nodeId).y + 60}
                x2={getNodePosition(connecting.nodeId).x + 240}
                y2={getNodePosition(connecting.nodeId).y + 60}
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute w-60 bg-slate-800/90 backdrop-blur-sm border-2 rounded-xl shadow-2xl cursor-move transition-all ${
                selectedNode === node.id
                  ? 'border-blue-500 shadow-blue-500/50'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
                zIndex: selectedNode === node.id ? 10 : 2
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            >
              {/* Node Header */}
              <div className="p-3 border-b border-slate-700">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-white text-sm">{node.capsule.name}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNode(node.id)
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-400">{node.capsule.category}</div>
              </div>

              {/* Inputs */}
              {node.capsule.inputs && Object.keys(node.capsule.inputs).length > 0 && (
                <div className="p-2 space-y-1">
                  {Object.entries(node.capsule.inputs).map(([key, input]) => (
                    <div key={key} className="flex items-center gap-2">
                      <button
                        onClick={() => completeConnection(node.id, key)}
                        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                      />
                      <span className="text-xs text-gray-300">{input.description || key}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Outputs */}
              {node.capsule.outputs && Object.keys(node.capsule.outputs).length > 0 && (
                <div className="p-2 border-t border-slate-700 space-y-1">
                  {Object.entries(node.capsule.outputs).map(([key, output]) => (
                    <div key={key} className="flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-300">{output.description || key}</span>
                      <button
                        onClick={() => startConnection(node.id, key)}
                        className="w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Building</h3>
                <p className="text-gray-400 mb-4">Add capsules from the left panel or use AI to generate a workflow</p>
                <button
                  onClick={() => setShowAIPrompt(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate with AI
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-xl overflow-y-auto">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Properties</h2>
            </div>
            <div className="p-4">
              {(() => {
                const node = nodes.find(n => n.id === selectedNode)
                if (!node) return null

                return (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-white mb-1">{node.capsule.name}</div>
                      <div className="text-xs text-gray-400">{node.capsule.description}</div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="text-sm font-medium text-white mb-2">Configuration</div>
                      <div className="text-xs text-gray-400">
                        Configure capsule parameters here
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-7 h-7 text-blue-400" />
                  Workflow Templates
                </h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-400 mt-2">Start with a pre-built workflow and customize it to your needs</p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORKFLOW_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template.id)}
                    className="bg-slate-900/50 border border-white/10 rounded-xl p-5 text-left hover:bg-slate-900 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{template.icon}</div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          template.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                          template.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {template.difficulty}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                        {template.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {template.composition.nodes.length} nodes
                      </span>
                    </div>
                    {template.requiredEnvVars && template.requiredEnvVars.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Required:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.requiredEnvVars.map(env => (
                            <span key={env} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                              {env}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Prompt Modal */}
      {showAIPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                AI Workflow Generator
              </h2>
            </div>
            <div className="p-6">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Describe what you want to build... Example: Create a workflow that processes payments, sends confirmation emails, and logs transactions"
                className="w-full h-32 px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 resize-none"
                autoFocus
              />
            </div>
            <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAIPrompt(false)
                  setAIPrompt('')
                }}
                className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || isCompiling}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isCompiling ? 'Generating...' : 'Generate Workflow'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compilation Result */}
      {compilationResult && (
        <div className="fixed bottom-6 right-6 bg-slate-800 rounded-xl border border-white/10 shadow-2xl max-w-md z-50">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {compilationResult.success ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <X className="w-5 h-5 text-red-400" />
              )}
              <span className="font-semibold text-white">
                {compilationResult.success ? 'Compilation Successful' : 'Compilation Failed'}
              </span>
            </div>
            <button
              onClick={() => setCompilationResult(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            {compilationResult.success ? (
              <div className="text-sm text-gray-300">
                Generated {compilationResult.stats?.linesOfCode || 0} lines of code using{' '}
                {compilationResult.stats?.capsulesProcessed || 0} capsules
              </div>
            ) : (
              <div className="text-sm text-red-400">
                {compilationResult.error || 'An error occurred during compilation'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

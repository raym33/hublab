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
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { CAPSULES_DEFINITIONS, CapsuleDefinition } from '@/lib/capsules-config'

export default function WorkspacePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [nodeConfig, setNodeConfig] = useState<Record<string, any>>({})
  const [showCode, setShowCode] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const onDragStart = (event: React.DragEvent, capsule: CapsuleDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(capsule))
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const capsuleData = event.dataTransfer.getData('application/reactflow')
      if (!capsuleData) return

      const capsule: CapsuleDefinition = JSON.parse(capsuleData)
      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 40,
      }

      const nodeId = `${capsule.id}-${Date.now()}`
      const newNode: Node = {
        id: nodeId,
        type: 'default',
        position,
        data: {
          label: (
            <div className="flex flex-col items-center gap-1 p-3">
              <div className="text-2xl">{capsule.icon}</div>
              <div className="text-xs font-bold">{capsule.name}</div>
            </div>
          ),
          capsule,
        },
        style: {
          background: capsule.color,
          color: 'white',
          border: '2px solid #000',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
        },
      }

      setNodes((nds) => nds.concat(newNode))

      // Initialize config for this node
      const defaultConfig: Record<string, any> = {}
      capsule.inputs.forEach(field => {
        if (field.default !== undefined) {
          defaultConfig[field.name] = field.default
        }
      })
      setNodeConfig(prev => ({ ...prev, [nodeId]: defaultConfig }))
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

  const generateWorkflowCode = () => {
    let code = `// Generated Workflow Code\n`
    code += `// Install dependencies: npm install ${[...new Set(nodes.map(n => n.data.capsule.npmPackage).filter(Boolean))].join(' ')}\n\n`

    code += `import { createWorkflow } from 'capsulas-framework'\n\n`

    code += `const workflow = createWorkflow({\n`
    code += `  id: '${Date.now()}',\n`
    code += `  name: 'My Workflow',\n`
    code += `  nodes: [\n`

    nodes.forEach((node, idx) => {
      const capsule = node.data.capsule as CapsuleDefinition
      const config = nodeConfig[node.id] || {}

      code += `    {\n`
      code += `      id: '${node.id}',\n`
      code += `      capsule: '${capsule.id}',\n`
      code += `      config: ${JSON.stringify(config, null, 8).replace(/\n/g, '\n      ')},\n`
      code += `    }${idx < nodes.length - 1 ? ',' : ''}\n`
    })

    code += `  ],\n`
    code += `  connections: [\n`

    edges.forEach((edge, idx) => {
      code += `    { from: '${edge.source}', to: '${edge.target}' }${idx < edges.length - 1 ? ',' : ''}\n`
    })

    code += `  ]\n`
    code += `})\n\n`
    code += `// Execute workflow\n`
    code += `workflow.execute(inputData).then(result => {\n`
    code += `  console.log('Workflow result:', result)\n`
    code += `})\n`

    return code
  }

  const exportWorkflow = () => {
    const workflow = {
      nodes: nodes.map(n => ({
        id: n.id,
        position: n.position,
        capsuleId: n.data.capsule.id,
        config: nodeConfig[n.id] || {}
      })),
      edges: edges.map(e => ({
        source: e.source,
        target: e.target
      }))
    }

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workflow-${Date.now()}.json`
    a.click()
  }

  const categories = ['all', ...new Set(CAPSULES_DEFINITIONS.map((c) => c.category))]
  const filteredCapsules = selectedCategory === 'all'
    ? CAPSULES_DEFINITIONS
    : CAPSULES_DEFINITIONS.filter((c) => c.category === selectedCategory)

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
                {cat.toUpperCase()} {cat !== 'all' && `(${CAPSULES_DEFINITIONS.filter(c => c.category === cat).length})`}
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
              <div className="flex items-start gap-3">
                <div className="text-2xl">{capsule.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{capsule.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{capsule.description}</div>
                  {capsule.npmPackage && (
                    <div className="text-xs text-gray-500 mt-1 font-mono">
                      📦 {capsule.npmPackage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b-2 border-black z-10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Workflow Builder</h1>
              <p className="text-sm text-gray-600">{nodes.length} nodes, {edges.length} connections</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCode(!showCode)}
                className="px-4 py-2 border-2 border-black rounded font-bold text-sm hover:bg-gray-100"
              >
                {showCode ? 'Hide Code' : 'View Code'}
              </button>
              <button
                onClick={exportWorkflow}
                className="px-4 py-2 border-2 border-black rounded font-bold text-sm hover:bg-gray-100"
              >
                Export JSON
              </button>
              <button
                onClick={() => {
                  setNodes([])
                  setEdges([])
                  setNodeConfig({})
                  setSelectedNode(null)
                }}
                className="px-4 py-2 border-2 border-red-600 text-red-600 rounded font-bold text-sm hover:bg-red-50"
              >
                Clear All
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
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

            {/* Code Panel */}
            {showCode && (
              <Panel position="top-right" className="bg-gray-900 text-white p-4 rounded-lg border-2 border-black max-w-2xl max-h-96 overflow-auto">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Generated Code</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateWorkflowCode())
                      alert('Code copied to clipboard!')
                    }}
                    className="px-3 py-1 bg-white text-black rounded text-xs font-bold hover:bg-gray-200"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {generateWorkflowCode()}
                </pre>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      {/* Right Panel - Node Configuration */}
      {selectedNode && (
        <div className="w-96 bg-white border-l-2 border-black p-6 overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Configure Node</h2>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedNode.data.capsule.icon}</span>
              <div>
                <div className="font-bold">{selectedNode.data.capsule.name}</div>
                <div className="text-xs text-gray-600">{selectedNode.data.capsule.description}</div>
              </div>
            </div>
          </div>

          {/* Configuration Fields */}
          <div className="space-y-4">
            {selectedNode.data.capsule.inputs.map((field: any) => (
              <div key={field.name}>
                <label className="block text-sm font-bold mb-1">
                  {field.name}
                  {field.required && <span className="text-red-600">*</span>}
                </label>
                <p className="text-xs text-gray-600 mb-2">{field.description}</p>

                {field.type === 'select' ? (
                  <select
                    value={nodeConfig[selectedNode.id]?.[field.name] || field.default || ''}
                    onChange={(e) => setNodeConfig(prev => ({
                      ...prev,
                      [selectedNode.id]: {
                        ...prev[selectedNode.id],
                        [field.name]: e.target.value
                      }
                    }))}
                    className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm font-mono"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={nodeConfig[selectedNode.id]?.[field.name] || ''}
                    onChange={(e) => setNodeConfig(prev => ({
                      ...prev,
                      [selectedNode.id]: {
                        ...prev[selectedNode.id],
                        [field.name]: e.target.value
                      }
                    }))}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm font-mono"
                  />
                ) : field.type === 'boolean' ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={nodeConfig[selectedNode.id]?.[field.name] ?? field.default ?? false}
                      onChange={(e) => setNodeConfig(prev => ({
                        ...prev,
                        [selectedNode.id]: {
                          ...prev[selectedNode.id],
                          [field.name]: e.target.checked
                        }
                      }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={nodeConfig[selectedNode.id]?.[field.name] ?? field.default ?? ''}
                    onChange={(e) => setNodeConfig(prev => ({
                      ...prev,
                      [selectedNode.id]: {
                        ...prev[selectedNode.id],
                        [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value
                      }
                    }))}
                    placeholder={field.placeholder}
                    className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm font-mono"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Documentation Link */}
          {selectedNode.data.capsule.documentation && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded">
              <div className="text-sm font-bold mb-2">📚 Documentation</div>
              <a
                href={selectedNode.data.capsule.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View official docs →
              </a>
            </div>
          )}

          {/* Outputs */}
          <div className="mt-6">
            <div className="text-sm font-bold mb-2">Outputs</div>
            <div className="space-y-1">
              {selectedNode.data.capsule.outputs.map((output: string) => (
                <div key={output} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {output}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

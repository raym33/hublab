'use client'

import { useState } from 'react'
import { X, Download, Copy, Check, Code, FileCode, Zap } from 'lucide-react'

interface CodeExportModalProps {
  nodes: any[]
  edges: any[]
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = 'component' | 'page' | 'app'

export default function CodeExportModal({
  nodes,
  edges,
  isOpen,
  onClose
}: CodeExportModalProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('component')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  // Generate imports for all capsules used in the workflow
  const generateImports = () => {
    const imports = new Set<string>()

    nodes.forEach(node => {
      if (node.data?.capsule?.name) {
        const componentName = node.data.capsule.name.replace(/\s+/g, '')
        imports.add(componentName)
      }
    })

    return Array.from(imports)
      .map(name => `import ${name} from '@/components/capsules/${name}'`)
      .join('\n')
  }

  // Generate component JSX from workflow nodes
  const generateComponentJSX = () => {
    if (nodes.length === 0) {
      return '  <div className="p-8 text-center text-gray-500">\n    Your workflow is empty\n  </div>'
    }

    return nodes
      .map(node => {
        if (!node.data?.capsule) return null

        const componentName = node.data.capsule.name.replace(/\s+/g, '')
        const props = node.data.capsule.props || []

        // Generate prop examples
        const propStrings = props
          .filter((p: any) => p.required)
          .map((p: any) => {
            if (p.type === 'string') return `${p.name}="example"`
            if (p.type === 'number') return `${p.name}={0}`
            if (p.type === 'boolean') return `${p.name}={true}`
            if (p.type === 'array') return `${p.name}={[]}`
            if (p.type === 'object') return `${p.name}={{}}`
            return `${p.name}={null}`
          })
          .join(' ')

        return `  <${componentName}${propStrings ? ' ' + propStrings : ''} />`
      })
      .filter(Boolean)
      .join('\n\n')
  }

  // Generate code based on export format
  const generateCode = () => {
    const imports = generateImports()
    const jsx = generateComponentJSX()

    if (exportFormat === 'component') {
      return `'use client'

import React from 'react'
${imports}

export default function WorkflowComponent() {
  return (
    <div className="p-4 space-y-4">
${jsx}
    </div>
  )
}
`
    }

    if (exportFormat === 'page') {
      return `'use client'

import React from 'react'
${imports}

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">My Workflow</h1>
        <div className="space-y-4">
${jsx}
        </div>
      </div>
    </div>
  )
}
`
    }

    if (exportFormat === 'app') {
      return `# My HubLab App

Generated from HubLab Studio V2.

## Installation

\`\`\`bash
npm install
\`\`\`

## File Structure

\`\`\`
app/
  page.tsx          # Main workflow page
components/
  capsules/         # Copy your capsules here
\`\`\`

## app/page.tsx

\`\`\`tsx
'use client'

import React from 'react'
${imports}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">My App</h1>
        <div className="space-y-6">
${jsx}
        </div>
      </div>
    </div>
  )
}
\`\`\`

## Next Steps

1. Create a new Next.js app: \`npx create-next-app@latest my-app\`
2. Copy the generated code into \`app/page.tsx\`
3. Copy your capsule components into \`components/capsules/\`
4. Run \`npm run dev\`
`
    }

    return ''
  }

  const code = generateCode()

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = exportFormat === 'app' ? 'README.md' : `workflow.${exportFormat === 'page' ? 'page' : 'component'}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Code</h2>
              <p className="text-sm text-gray-500">Export your workflow as production-ready code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Export Format Options */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setExportFormat('component')}
              className={`p-4 rounded-xl border-2 transition-all ${
                exportFormat === 'component'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileCode className={`w-6 h-6 mx-auto mb-2 ${
                exportFormat === 'component' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-semibold text-gray-900">Component</div>
              <div className="text-xs text-gray-500 mt-1">Reusable React component</div>
            </button>

            <button
              onClick={() => setExportFormat('page')}
              className={`p-4 rounded-xl border-2 transition-all ${
                exportFormat === 'page'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Code className={`w-6 h-6 mx-auto mb-2 ${
                exportFormat === 'page' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-semibold text-gray-900">Page</div>
              <div className="text-xs text-gray-500 mt-1">Full Next.js page</div>
            </button>

            <button
              onClick={() => setExportFormat('app')}
              className={`p-4 rounded-xl border-2 transition-all ${
                exportFormat === 'app'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Zap className={`w-6 h-6 mx-auto mb-2 ${
                exportFormat === 'app' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-semibold text-gray-900">App</div>
              <div className="text-xs text-gray-500 mt-1">Complete Next.js app</div>
            </button>
          </div>
        </div>

        {/* Code Preview */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full rounded-lg bg-gray-900 overflow-auto">
            <pre className="p-4 text-sm text-gray-100 font-mono">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            {nodes.length === 0 ? (
              <span className="text-amber-600 font-medium">⚠️ No components in workflow</span>
            ) : (
              <span>{nodes.length} component{nodes.length !== 1 ? 's' : ''} in workflow</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              disabled={nodes.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">Copy Code</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={nodes.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useMemo } from 'react'
import { Capsule } from '@/types/capsule'
import { Code, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CanvasItem {
  id: string
  capsule: Capsule
  props?: Record<string, any>
}

interface CodePreviewProps {
  canvasItems: CanvasItem[]
}

export default function CodePreview({ canvasItems }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)

  const generatedCode = useMemo(() => {
    if (canvasItems.length === 0) {
      return `'use client'

export default function MyApp() {
  return (
    <div className="p-8">
      <p>Tu app aparecerá aquí...</p>
    </div>
  )
}
`
    }

    // Generar imports únicos
    const imports = new Set<string>()
    canvasItems.forEach(item => {
      // Extraer imports del código de la cápsula
      const codeLines = item.capsule.code.split('\n')
      codeLines.forEach(line => {
        if (line.trim().startsWith('import ')) {
          imports.add(line.trim())
        }
      })
    })

    // Generar componentes
    const components = canvasItems.map((item, index) => {
      const componentName = `Component${index + 1}`
      const propsStr = item.props && Object.keys(item.props).length > 0
        ? `{...${JSON.stringify(item.props)}}`
        : ''

      return `      <${componentName} ${propsStr} />`
    }).join('\n')

    // Generar definiciones de componentes inline
    const componentDefinitions = canvasItems.map((item, index) => {
      const componentName = `Component${index + 1}`
      // Simplificación: usar el código de la cápsula directamente
      const codeWithoutImports = item.capsule.code
        .split('\n')
        .filter(line => !line.trim().startsWith('import '))
        .join('\n')
        .replace(/export default function \w+/g, `function ${componentName}`)

      return codeWithoutImports
    }).join('\n\n')

    return `'use client'
${Array.from(imports).join('\n')}

${componentDefinitions}

export default function MyApp() {
  return (
    <div className="p-8 space-y-6">
${components}
    </div>
  )
}
`
  }, [canvasItems])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Código generado
            </h2>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {canvasItems.length} componente{canvasItems.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Code display */}
      <div className="flex-1 overflow-auto p-4 bg-gray-900">
        <pre className="text-xs text-gray-100 font-mono">
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  )
}

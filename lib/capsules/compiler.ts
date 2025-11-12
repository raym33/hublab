/**
 * Compilador V2 - Simple y Funcional
 * Ensambla cápsulas en una aplicación React completa
 */

import { getCapsuleByIdExtended } from './definitions-extended'
import type { AppComposition, CompilationResult } from './types'

export class CapsuleCompiler {
  /**
   * Compila una composición de cápsulas en código ejecutable
   */
  compile(composition: AppComposition): CompilationResult {
    try {
      // 1. Obtener todas las cápsulas necesarias
      const capsules = composition.capsules.map(instance => {
        const definition = getCapsuleByIdExtended(instance.capsuleId)
        if (!definition) {
          throw new Error(`Capsule not found: ${instance.capsuleId}`)
        }
        return { definition, instance }
      })

      // 2. Generar el código de cada cápsula con sus props
      const capsuleComponents = capsules.map(({ definition, instance }) => {
        return this.generateCapsuleCode(definition.code, instance.instanceId)
      }).join('\n\n')

      // 3. Generar el componente App que renderiza todo
      const appCode = this.generateAppCode(composition, capsules)

      // 4. Generar el HTML completo
      const html = this.generateHTML(capsuleComponents + '\n\n' + appCode, composition.name)

      // 5. Recopilar dependencias
      const dependencies = Array.from(
        new Set(capsules.flatMap(c => c.definition.dependencies))
      )

      return {
        success: true,
        code: capsuleComponents + '\n\n' + appCode,
        html,
        dependencies
      }
    } catch (error: any) {
      return {
        success: false,
        code: '',
        html: '',
        error: error.message,
        dependencies: []
      }
    }
  }

  /**
   * Genera el código de una cápsula con un ID único
   */
  private generateCapsuleCode(code: string, instanceId: string): string {
    // Renombrar la función para hacerla única
    return code.replace(/^function\s+(\w+)/, `function $1_${instanceId}`)
  }

  /**
   * Genera el componente App principal
   */
  private generateAppCode(
    composition: AppComposition,
    capsules: Array<{ definition: any; instance: any }>
  ): string {
    const layoutClass = this.getLayoutClass(composition.layout)

    const instancesCode = capsules.map(({ definition, instance }) => {
      const ComponentName = `${this.capitalize(definition.id)}_${instance.instanceId}`
      const propsStr = this.generatePropsString(instance.props)

      return `    <${ComponentName} ${propsStr} />`
    }).join('\n')

    return `
function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{composition.name}</h1>
        <p className="text-gray-600 mb-8">{composition.description}</p>

        <div className="${layoutClass}">
${instancesCode}
        </div>
      </div>
    </div>
  )
}`
  }

  /**
   * Genera el HTML completo ejecutable
   */
  private generateHTML(code: string, title: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

${code}

    // Renderizar la aplicación
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`
  }

  /**
   * Obtiene la clase CSS para el layout
   */
  private getLayoutClass(layout: string): string {
    const layouts: Record<string, string> = {
      single: 'flex flex-col items-center',
      grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      flex: 'flex flex-wrap gap-6'
    }
    return layouts[layout] || 'space-y-6'
  }

  /**
   * Genera string de props para JSX
   */
  private generatePropsString(props: Record<string, any>): string {
    return Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          return `${key}={${value}}`
        } else if (Array.isArray(value) || typeof value === 'object') {
          return `${key}={${JSON.stringify(value)}}`
        }
        return ''
      })
      .filter(Boolean)
      .join(' ')
  }

  /**
   * Capitaliza la primera letra
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

// Exportar una instancia singleton
export const capsuleCompiler = new CapsuleCompiler()

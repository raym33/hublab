/**
 * Browser-based Capsule Compiler
 * Inspired by Monaco Editor and VSCode's client-side compilation
 * Runs entirely in the browser to avoid server timeouts
 */

import type { CapsuleDefinition, CapsuleComposition } from '@/lib/capsule-compiler/types'

export class BrowserCapsuleCompiler {
  private worker: Worker | null = null
  private compilationCache = new Map<string, any>()

  constructor() {
    // Initialize worker if available
    if (typeof Worker !== 'undefined') {
      this.initializeWorker()
    }
  }

  private initializeWorker() {
    // We'll create a worker for heavy processing
    const workerCode = `
      self.onmessage = function(e) {
        const { type, payload } = e.data

        if (type === 'compile') {
          try {
            // Simulate compilation process
            const result = compileComposition(payload)
            self.postMessage({ type: 'success', result })
          } catch (error) {
            self.postMessage({ type: 'error', error: error.message })
          }
        }
      }

      function compileComposition(composition) {
        // Basic template compilation
        const { name, capsules, layout, description } = composition

        // Generate React component code
        const imports = generateImports(capsules)
        const componentCode = generateComponent(name, capsules, layout)
        const styles = generateStyles(capsules)

        return {
          'App.tsx': imports + componentCode,
          'styles.css': styles,
          'package.json': generatePackageJson(name),
          'README.md': description || 'Generated with HubLab Compiler'
        }
      }

      function generateImports(capsules) {
        let imports = "import React from 'react'\\n"
        imports += "import './styles.css'\\n\\n"
        return imports
      }

      function generateComponent(name, capsules, layout) {
        return \`
export default function \${name}() {
  return (
    <div className="app">
      <h1>\${name}</h1>
      \${capsules.map(c => \`<div className="capsule">\${c.name}</div>\`).join('\\n')}
    </div>
  )
}
        \`
      }

      function generateStyles(capsules) {
        return \`
.app {
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.capsule {
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
        \`
      }

      function generatePackageJson(name) {
        return JSON.stringify({
          name: name.toLowerCase().replace(/\\s+/g, '-'),
          version: '1.0.0',
          dependencies: {
            'react': '^18.0.0',
            'react-dom': '^18.0.0'
          }
        }, null, 2)
      }
    `

    // Create blob and worker
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(blob)
    this.worker = new Worker(workerUrl)
  }

  /**
   * Compile a composition entirely in the browser
   */
  async compile(composition: CapsuleComposition): Promise<any> {
    // Check cache first
    const cacheKey = JSON.stringify(composition)
    if (this.compilationCache.has(cacheKey)) {
      return this.compilationCache.get(cacheKey)
    }

    // Use worker if available
    if (this.worker) {
      return this.compileWithWorker(composition, cacheKey)
    }

    // Fallback to main thread compilation
    return this.compileOnMainThread(composition, cacheKey)
  }

  private compileWithWorker(composition: CapsuleComposition, cacheKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Compilation timeout'))
      }, 10000) // 10 second timeout

      this.worker.onmessage = (e) => {
        clearTimeout(timeout)
        if (e.data.type === 'success') {
          this.compilationCache.set(cacheKey, e.data.result)
          resolve(e.data.result)
        } else {
          reject(new Error(e.data.error))
        }
      }

      this.worker.postMessage({ type: 'compile', payload: composition })
    })
  }

  private async compileOnMainThread(composition: CapsuleComposition, cacheKey: string): Promise<any> {
    // Simple compilation logic for main thread
    const result = {
      files: this.generateFiles(composition),
      preview: this.generatePreview(composition),
      metadata: {
        compiledAt: new Date().toISOString(),
        compiler: 'browser-v1',
        capsuleCount: composition.capsules?.length || 0
      }
    }

    this.compilationCache.set(cacheKey, result)
    return result
  }

  private generateFiles(composition: CapsuleComposition): Record<string, string> {
    const files: Record<string, string> = {}

    // Generate main component
    files['App.tsx'] = this.generateAppComponent(composition)

    // Generate styles
    files['styles.css'] = this.generateStyles(composition)

    // Generate package.json
    files['package.json'] = this.generatePackageJson(composition)

    // Generate individual capsule files
    composition.capsules?.forEach((capsule, index) => {
      files[`components/Capsule${index}.tsx`] = this.generateCapsuleComponent(capsule)
    })

    return files
  }

  private generateAppComponent(composition: CapsuleComposition): string {
    const { name, capsules = [] } = composition

    return `import React from 'react'
import './styles.css'
${capsules.map((_, i) => `import Capsule${i} from './components/Capsule${i}'`).join('\n')}

export default function ${name.replace(/\s+/g, '')}() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>${name}</h1>
      </header>
      <main className="app-main">
        ${capsules.map((_, i) => `<Capsule${i} />`).join('\n        ')}
      </main>
    </div>
  )
}`
  }

  private generateCapsuleComponent(capsule: CapsuleDefinition): string {
    const { name, config = {} } = capsule

    return `import React from 'react'

export default function ${name.replace(/\s+/g, '')}() {
  return (
    <div className="capsule">
      <h2>${name}</h2>
      <div className="capsule-content">
        ${JSON.stringify(config, null, 2)}
      </div>
    </div>
  )
}`
  }

  private generateStyles(composition: CapsuleComposition): string {
    return `/* Generated Styles for ${composition.name} */

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.app-header h1 {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.capsule {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.capsule:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.capsule h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.capsule-content {
  color: #666;
  line-height: 1.6;
  font-family: 'Courier New', monospace;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
}`
  }

  private generatePackageJson(composition: CapsuleComposition): string {
    return JSON.stringify({
      name: composition.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      private: true,
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'typescript': '^5.0.0'
      },
      scripts: {
        'start': 'react-scripts start',
        'build': 'react-scripts build'
      }
    }, null, 2)
  }

  private generatePreview(composition: CapsuleComposition): string {
    // Generate a simple HTML preview
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${composition.name}</title>
  <style>
    body { font-family: system-ui; margin: 0; padding: 20px; background: #f0f0f0; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; padding: 2rem; border-radius: 12px; text-align: center; }
    .capsules { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem; margin-top: 2rem; }
    .capsule { background: white; padding: 1.5rem; border-radius: 8px;
               box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${composition.name}</h1>
      <p>${composition.description || 'Generated with HubLab Browser Compiler'}</p>
    </div>
    <div class="capsules">
      ${composition.capsules?.map(c => `
        <div class="capsule">
          <h3>${c.name}</h3>
          <p>${c.description || 'Capsule component'}</p>
        </div>
      `).join('') || ''}
    </div>
  </div>
</body>
</html>`
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.compilationCache.clear()
  }
}

// Export singleton instance
export const browserCompiler = new BrowserCapsuleCompiler()
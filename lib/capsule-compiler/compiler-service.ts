import { CapsuleComposition, CompilationResult, UniversalCapsule } from './types'
import { getCapsule } from './example-capsules'

/**
 * Real compiler service that generates production code
 */
export class CompilerService {
  private startTime: number = 0

  /**
   * Compile a composition into production-ready code
   */
  async compile(composition: CapsuleComposition): Promise<CompilationResult> {
    this.startTime = Date.now()

    try {
      // Phase 1: Validate
      const validation = this.validate(composition)
      if (!validation.valid) {
        return this.errorResult(validation.errors)
      }

      // Phase 2: Resolve dependencies
      const capsules = this.resolveDependencies(composition)

      // Phase 3: Type check
      const typeCheck = this.typeCheck(composition, capsules)
      if (!typeCheck.valid) {
        return this.errorResult(typeCheck.errors)
      }

      // Phase 4: Generate code
      const code = this.generateCode(composition, capsules)

      // Phase 5: Generate manifest
      const manifest = this.generateManifest(composition, capsules)

      // Phase 6: Calculate stats
      const stats = this.calculateStats(code, capsules)

      return {
        success: true,
        platform: composition.platform,
        output: {
          code,
          assets: [],
          manifest
        },
        stats,
        errors: [],
        warnings: []
      }
    } catch (error) {
      return this.errorResult([{
        type: 'runtime',
        message: error instanceof Error ? error.message : 'Unknown compilation error'
      }])
    }
  }

  /**
   * Validate composition structure
   */
  private validate(composition: CapsuleComposition): { valid: boolean; errors: any[] } {
    const errors: any[] = []

    // Check required fields
    if (!composition.name) {
      errors.push({ type: 'validation', message: 'Composition name is required' })
    }

    if (!composition.capsules || composition.capsules.length === 0) {
      errors.push({ type: 'validation', message: 'At least one capsule is required' })
    }

    // Check all capsules exist
    for (const instance of composition.capsules) {
      const capsule = getCapsule(instance.capsuleId)
      if (!capsule) {
        errors.push({
          type: 'validation',
          message: `Capsule not found: ${instance.capsuleId}`
        })
      }
    }

    // Check connections are valid
    for (const conn of composition.connections || []) {
      const [fromId] = conn.from.split('.')
      const [toId] = conn.to.split('.')

      const fromExists = composition.capsules.some(c => c.id === fromId)
      const toExists = composition.capsules.some(c => c.id === toId)

      if (!fromExists || !toExists) {
        errors.push({
          type: 'validation',
          message: `Invalid connection: ${conn.from} → ${conn.to}`
        })
      }
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Resolve all capsule dependencies
   */
  private resolveDependencies(composition: CapsuleComposition): Map<string, UniversalCapsule> {
    const capsules = new Map<string, UniversalCapsule>()

    for (const instance of composition.capsules) {
      const capsule = getCapsule(instance.capsuleId)
      if (capsule) {
        capsules.set(instance.capsuleId, capsule)
      }
    }

    return capsules
  }

  /**
   * Type check all connections
   */
  private typeCheck(
    composition: CapsuleComposition,
    capsules: Map<string, UniversalCapsule>
  ): { valid: boolean; errors: any[] } {
    // For now, basic type checking
    // TODO: Implement full type inference and checking
    return { valid: true, errors: [] }
  }

  /**
   * Generate production React code
   */
  private generateCode(
    composition: CapsuleComposition,
    capsules: Map<string, UniversalCapsule>
  ): Record<string, string> {
    const code: Record<string, string> = {}

    // Generate App.tsx (main entry point)
    code['src/App.tsx'] = this.generateAppFile(composition, capsules)

    // Generate each capsule component
    for (const [capsuleId, capsule] of capsules) {
      const componentCode = this.extractComponentCode(capsule)
      code[`src/components/${capsuleId}.tsx`] = componentCode
    }

    // Generate index.tsx
    code['src/main.tsx'] = this.generateMainFile()

    // Generate index.html
    code['index.html'] = this.generateHTMLFile(composition.name)

    // Generate vite.config.ts
    code['vite.config.ts'] = this.generateViteConfig()

    // Generate tsconfig.json
    code['tsconfig.json'] = this.generateTSConfig()

    // Generate index.css (Tailwind directives)
    code['src/index.css'] = this.generateIndexCSS()

    return code
  }

  /**
   * Generate main App component
   */
  private generateAppFile(
    composition: CapsuleComposition,
    capsules: Map<string, UniversalCapsule>
  ): string {
    let code = `import { useState } from 'react'\n`

    // Import all capsule components
    for (const [capsuleId] of capsules) {
      const componentName = this.toPascalCase(capsuleId)
      code += `import { ${componentName} } from './components/${capsuleId}'\n`
    }

    code += `\nexport default function App() {\n`

    // Generate state for connections
    const stateVars = this.extractStateFromConnections(composition)
    for (const stateVar of stateVars) {
      code += `  const [${stateVar}, set${this.toPascalCase(stateVar)}] = useState<any>(null)\n`
    }

    code += `\n  return (\n`
    code += `    <div className="min-h-screen bg-gray-50">\n`

    // Generate JSX for capsule tree
    code += this.generateJSX(composition, capsules, '      ')

    code += `    </div>\n`
    code += `  )\n`
    code += `}\n`

    return code
  }

  /**
   * Generate JSX for capsule instances
   */
  private generateJSX(
    composition: CapsuleComposition,
    capsules: Map<string, UniversalCapsule>,
    indent: string
  ): string {
    let jsx = ''

    for (const instance of composition.capsules) {
      const componentName = this.toPascalCase(instance.capsuleId)
      jsx += `${indent}<${componentName}\n`

      // Add props
      if (instance.inputs) {
        for (const [key, value] of Object.entries(instance.inputs)) {
          if (typeof value === 'string') {
            jsx += `${indent}  ${key}="${value}"\n`
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            jsx += `${indent}  ${key}={${value}}\n`
          } else {
            jsx += `${indent}  ${key}={${JSON.stringify(value)}}\n`
          }
        }
      }

      // Add event handlers from connections
      const handlers = this.findHandlers(instance.id, composition)
      for (const handler of handlers) {
        jsx += `${indent}  ${handler.prop}={${handler.callback}}\n`
      }

      jsx += `${indent}/>\n`
    }

    return jsx
  }

  /**
   * Extract state variables needed from connections
   */
  private extractStateFromConnections(composition: CapsuleComposition): string[] {
    const states = new Set<string>()

    for (const conn of composition.connections || []) {
      const [fromId, fromOutput] = conn.from.split('.')
      const [toId, toInput] = conn.to.split('.')

      // Create state variable for data flow
      states.add(`${fromId}_${fromOutput}`)
    }

    return Array.from(states)
  }

  /**
   * Find event handlers for a capsule instance
   */
  private findHandlers(instanceId: string, composition: CapsuleComposition): any[] {
    const handlers: any[] = []

    for (const conn of composition.connections || []) {
      const [fromId, fromOutput] = conn.from.split('.')
      if (fromId === instanceId) {
        handlers.push({
          prop: fromOutput,
          callback: `(data) => set${this.toPascalCase(fromId)}_${fromOutput}(data)`
        })
      }
    }

    return handlers
  }

  /**
   * Extract component code from capsule
   */
  private extractComponentCode(capsule: UniversalCapsule): string {
    const webPlatform = capsule.platforms.web
    if (!webPlatform) {
      throw new Error(`No web platform implementation for ${capsule.id}`)
    }

    return webPlatform.code
  }

  /**
   * Generate main.tsx entry point
   */
  private generateMainFile(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`
  }

  /**
   * Generate index.html
   */
  private generateHTMLFile(appName: string): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
  }

  /**
   * Generate vite.config.ts
   */
  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`
  }

  /**
   * Generate tsconfig.json
   */
  private generateTSConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }]
    }, null, 2)
  }

  /**
   * Generate package.json and other manifests
   */
  private generateManifest(
    composition: CapsuleComposition,
    capsules: Map<string, UniversalCapsule>
  ): any {
    // Collect all npm dependencies
    const dependencies: Record<string, string> = {
      react: '^18.3.0',
      'react-dom': '^18.3.0'
    }

    const devDependencies: Record<string, string> = {
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
      '@vitejs/plugin-react': '^4.3.0',
      typescript: '^5.5.0',
      vite: '^5.4.0',
      tailwindcss: '^3.4.0',
      postcss: '^8.4.0',
      autoprefixer: '^10.4.0'
    }

    // Merge capsule dependencies
    for (const [_, capsule] of capsules) {
      if (capsule.dependencies?.npm) {
        Object.assign(dependencies, capsule.dependencies.npm)
      }
    }

    return {
      packageJson: {
        name: composition.name.toLowerCase().replace(/\s+/g, '-'),
        version: composition.version || '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          preview: 'vite preview'
        },
        dependencies,
        devDependencies
      },
      'tailwind.config.js': this.generateTailwindConfig(),
      'postcss.config.js': this.generatePostCSSConfig()
    }
  }

  /**
   * Generate Tailwind config
   */
  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
  }

  /**
   * Generate PostCSS config
   */
  private generatePostCSSConfig(): string {
    return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
  }

  /**
   * Generate index.css with Tailwind directives
   */
  private generateIndexCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`
  }

  /**
   * Calculate compilation statistics
   */
  private calculateStats(code: Record<string, string>, capsules: Map<string, UniversalCapsule>): any {
    const duration = Date.now() - this.startTime

    // Count lines of code
    let linesOfCode = 0
    for (const content of Object.values(code)) {
      linesOfCode += content.split('\n').length
    }

    // Estimate bundle size (rough approximation)
    const totalChars = Object.values(code).join('').length
    const bundleSize = Math.round(totalChars * 0.6) // Rough minification estimate

    return {
      duration,
      capsulesProcessed: capsules.size,
      linesOfCode,
      dependencies: {
        capsules: capsules.size,
        npm: 6 // React, ReactDOM, + dev deps
      },
      bundleSize: {
        raw: totalChars,
        minified: bundleSize,
        gzipped: Math.round(bundleSize * 0.3)
      }
    }
  }

  /**
   * Create error result
   */
  private errorResult(errors: any[]): CompilationResult {
    return {
      success: false,
      platform: 'web',
      output: {
        code: {},
        assets: [],
        manifest: {}
      },
      stats: {
        duration: Date.now() - this.startTime,
        capsulesProcessed: 0,
        linesOfCode: 0,
        dependencies: { capsules: 0, npm: 0 },
        bundleSize: { raw: 0, minified: 0, gzipped: 0 }
      },
      errors,
      warnings: []
    }
  }

  /**
   * Convert kebab-case to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
}

/**
 * Singleton instance
 */
export const compilerService = new CompilerService()

/**
 * Universal Capsule Compiler
 * Compiles capsule compositions to native code for any platform
 */

import type {
  CapsuleComposition,
  CapsuleNode,
  Platform,
  CompilationResult,
  CompilationOutput,
  UniversalCapsule,
  CapsuleRegistry,
  CompilationError,
  CompilationWarning
} from './types'

export class UniversalCapsuleCompiler {
  private registry: CapsuleRegistry
  private platformCompilers: Map<Platform, PlatformCompiler>

  constructor(registry: CapsuleRegistry) {
    this.registry = registry
    this.platformCompilers = new Map()

    // Register platform compilers
    this.registerPlatformCompiler('web', new WebCompiler())
    this.registerPlatformCompiler('desktop', new DesktopCompiler())
    this.registerPlatformCompiler('ios', new iOSCompiler())
    this.registerPlatformCompiler('android', new AndroidCompiler())
    this.registerPlatformCompiler('ai-os', new AIIntentCompiler())
  }

  /**
   * Main compilation entry point
   */
  async compile(
    composition: CapsuleComposition,
    options?: CompilationOptions
  ): Promise<CompilationResult> {
    const startTime = Date.now()
    const platform = composition.config.platform

    try {
      // 1. Validate composition
      const validation = await this.validate(composition)
      if (!validation.valid) {
        return {
          success: false,
          platform,
          errors: validation.errors,
          stats: {
            duration: Date.now() - startTime,
            capsulesProcessed: 0,
            linesOfCode: 0,
            dependencies: { capsules: 0, npm: 0 }
          }
        }
      }

      // 2. Resolve all capsules from registry
      const resolved = await this.resolveCapsulesRecursive(composition.root)

      // 3. Type check all connections
      const typeCheck = this.typeCheck(resolved, composition)
      if (typeCheck.errors.length > 0) {
        return {
          success: false,
          platform,
          errors: typeCheck.errors,
          stats: {
            duration: Date.now() - startTime,
            capsulesProcessed: resolved.length,
            linesOfCode: 0,
            dependencies: { capsules: resolved.length, npm: 0 }
          }
        }
      }

      // 4. Get platform-specific compiler
      const compiler = this.platformCompilers.get(platform)
      if (!compiler) {
        return {
          success: false,
          platform,
          errors: [{
            type: 'platform',
            message: `No compiler available for platform: ${platform}`
          }],
          stats: {
            duration: Date.now() - startTime,
            capsulesProcessed: 0,
            linesOfCode: 0,
            dependencies: { capsules: 0, npm: 0 }
          }
        }
      }

      // 5. Generate platform-specific code
      const generated = await compiler.generate(composition, resolved)

      // 6. Optimize if requested
      const optimized = composition.config.optimizations
        ? await compiler.optimize(generated, composition.config.optimizations)
        : generated

      // 7. Bundle
      const bundled = await compiler.bundle(optimized)

      // 8. Calculate stats
      const stats = {
        duration: Date.now() - startTime,
        capsulesProcessed: resolved.length,
        linesOfCode: this.countLines(bundled.code),
        bundleSize: this.calculateSize(bundled.code),
        dependencies: {
          capsules: resolved.length,
          npm: Object.keys(bundled.packageJson.dependencies).length
        }
      }

      return {
        success: true,
        platform,
        output: bundled,
        warnings: typeCheck.warnings,
        stats
      }
    } catch (error) {
      return {
        success: false,
        platform,
        errors: [{
          type: 'syntax',
          message: error instanceof Error ? error.message : 'Unknown error'
        }],
        stats: {
          duration: Date.now() - startTime,
          capsulesProcessed: 0,
          linesOfCode: 0,
          dependencies: { capsules: 0, npm: 0 }
        }
      }
    }
  }

  /**
   * Validate composition structure
   */
  private async validate(composition: CapsuleComposition) {
    const errors = []

    // Check root exists
    if (!composition.root) {
      errors.push({
        type: 'validation' as const,
        message: 'Composition must have a root capsule'
      })
    }

    // Check circular dependencies
    const circular = this.detectCircularDependencies(composition.root)
    if (circular) {
      errors.push({
        type: 'dependency' as const,
        message: `Circular dependency detected: ${circular.join(' -> ')}`
      })
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Resolve all capsules recursively
   */
  private async resolveCapsulesRecursive(
    node: CapsuleNode,
    resolved: Map<string, UniversalCapsule> = new Map()
  ): Promise<UniversalCapsule[]> {
    // Get capsule from registry
    if (!resolved.has(node.capsuleId)) {
      const capsule = await this.registry.get(node.capsuleId, node.capsuleVersion)
      resolved.set(node.capsuleId, capsule)

      // Resolve dependencies
      if (capsule.dependencies.capsules) {
        for (const depId of capsule.dependencies.capsules) {
          const depNode = { capsuleId: depId, id: depId, props: {} }
          await this.resolveCapsulesRecursive(depNode, resolved)
        }
      }
    }

    // Resolve children
    if (node.children) {
      for (const child of node.children) {
        await this.resolveCapsulesRecursive(child, resolved)
      }
    }

    return Array.from(resolved.values())
  }

  /**
   * Type check all connections
   */
  private typeCheck(capsules: UniversalCapsule[], composition: CapsuleComposition) {
    const errors: CompilationError[] = []
    const warnings: CompilationWarning[] = []

    const checkNode = (node: CapsuleNode) => {
      const capsule = capsules.find(c => c.id === node.capsuleId)
      if (!capsule) return

      // Check required inputs are provided
      for (const input of capsule.inputs) {
        // Skip 'children' validation if node has children (JSX children)
        if (input.name === 'children' && node.children && node.children.length > 0) {
          continue
        }

        // Skip function validation (functions will be added in code generation)
        if (input.type === 'function') {
          continue
        }

        if (input.required && !(input.name in node.props)) {
          errors.push({
            type: 'validation' as const,
            message: `Required input "${input.name}" missing for capsule "${node.capsuleId}"`,
            location: { capsuleId: node.id }
          })
        }
      }

      // Check connections
      if (node.connections) {
        for (const conn of node.connections) {
          const fromCapsule = capsules.find(c => c.id === conn.from.capsuleId)
          const toCapsule = capsules.find(c => c.id === conn.to.capsuleId)

          if (!fromCapsule || !toCapsule) continue

          const fromOutput = fromCapsule.outputs.find(o => o.name === conn.from.output)
          const toInput = toCapsule.inputs.find(i => i.name === conn.to.input)

          if (!fromOutput || !toInput) {
            errors.push({
              type: 'validation' as const,
              message: `Invalid connection from ${conn.from.capsuleId}.${conn.from.output} to ${conn.to.capsuleId}.${conn.to.input}`
            })
          } else if (fromOutput.type !== toInput.type) {
            warnings.push({
              type: 'compatibility' as const,
              message: `Type mismatch: ${fromOutput.type} -> ${toInput.type} in connection ${conn.from.capsuleId} to ${conn.to.capsuleId}`
            })
          }
        }
      }

      // Check children
      if (node.children) {
        node.children.forEach(checkNode)
      }
    }

    checkNode(composition.root)

    return { errors, warnings }
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(
    node: CapsuleNode,
    visited: Set<string> = new Set(),
    path: string[] = []
  ): string[] | null {
    if (path.includes(node.capsuleId)) {
      return [...path.slice(path.indexOf(node.capsuleId)), node.capsuleId]
    }

    if (visited.has(node.capsuleId)) {
      return null
    }

    visited.add(node.capsuleId)
    path.push(node.capsuleId)

    if (node.children) {
      for (const child of node.children) {
        const circular = this.detectCircularDependencies(child, visited, [...path])
        if (circular) return circular
      }
    }

    return null
  }

  /**
   * Count lines of code
   */
  private countLines(code: Record<string, string>): number {
    return Object.values(code).reduce(
      (total, content) => total + content.split('\n').length,
      0
    )
  }

  /**
   * Calculate bundle size
   */
  private calculateSize(code: Record<string, string>): number {
    return Object.values(code).reduce(
      (total, content) => total + Buffer.byteLength(content, 'utf8'),
      0
    )
  }

  /**
   * Register custom platform compiler
   */
  registerPlatformCompiler(platform: Platform, compiler: PlatformCompiler) {
    this.platformCompilers.set(platform, compiler)
  }
}

// ===== PLATFORM COMPILERS =====

interface PlatformCompiler {
  generate(composition: CapsuleComposition, capsules: UniversalCapsule[]): Promise<CompilationOutput>
  optimize(output: CompilationOutput, config: any): Promise<CompilationOutput>
  bundle(output: CompilationOutput): Promise<CompilationOutput>
}

/**
 * Web Platform Compiler (React)
 */
class WebCompiler implements PlatformCompiler {
  async generate(composition: CapsuleComposition, capsules: UniversalCapsule[]): Promise<CompilationOutput> {
    const code: Record<string, string> = {}

    // Generate App.tsx
    code['src/App.tsx'] = this.generateAppComponent(composition, capsules)

    // Generate component files for each capsule
    for (const capsule of capsules) {
      const impl = capsule.platforms.web
      if (impl) {
        code[`src/components/${capsule.id}.tsx`] = impl.code
      }
    }

    // Generate index.tsx
    code['src/index.tsx'] = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`

    // Generate package.json
    const dependencies: Record<string, string> = {
      'react': '^18.3.0',
      'react-dom': '^18.3.0'
    }

    // Add capsule dependencies
    for (const capsule of capsules) {
      if (capsule.dependencies.npm) {
        Object.assign(dependencies, capsule.dependencies.npm)
      }
    }

    return {
      code,
      packageJson: {
        name: composition.name,
        version: composition.version,
        dependencies,
        devDependencies: {
          '@types/react': '^18.3.0',
          '@types/react-dom': '^18.3.0',
          '@vitejs/plugin-react': '^4.3.0',
          'typescript': '^5.5.0',
          'vite': '^5.4.0'
        }
      },
      config: {
        'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})`
      },
      buildInstructions: {
        install: ['npm install'],
        build: ['npm run build'],
        dev: ['npm run dev']
      }
    }
  }

  private generateAppComponent(composition: CapsuleComposition, capsules: UniversalCapsule[]): string {
    // Generate imports
    const imports = capsules
      .map(c => `import { ${this.toPascalCase(c.id)} } from './components/${c.id}'`)
      .join('\n')

    // Generate component tree
    const tree = this.generateNodeTree(composition.root, 0)

    return `${imports}

export default function App() {
  return (
${tree}
  )
}`
  }

  private generateNodeTree(node: CapsuleNode, indent: number): string {
    const spaces = '  '.repeat(indent + 2)
    const componentName = this.toPascalCase(node.capsuleId)

    // Generate props
    const props = Object.entries(node.props)
      .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
      .join(' ')

    // Generate children
    if (node.children && node.children.length > 0) {
      const children = node.children
        .map(child => this.generateNodeTree(child, indent + 1))
        .join('\n')

      return `${spaces}<${componentName} ${props}>
${children}
${spaces}</${componentName}>`
    }

    return `${spaces}<${componentName} ${props} />`
  }

  private toPascalCase(str: string): string {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
  }

  async optimize(output: CompilationOutput, config: any): Promise<CompilationOutput> {
    // TODO: Implement optimizations (tree shaking, minification, etc.)
    return output
  }

  async bundle(output: CompilationOutput): Promise<CompilationOutput> {
    // Vite handles bundling
    return output
  }
}

/**
 * Desktop Platform Compiler (Electron)
 */
class DesktopCompiler extends WebCompiler {
  async generate(composition: CapsuleComposition, capsules: UniversalCapsule[]): Promise<CompilationOutput> {
    const webOutput = await super.generate(composition, capsules)

    // Add Electron main process
    webOutput.code['electron/main.ts'] = `import { app, BrowserWindow } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})`

    // Update package.json
    webOutput.packageJson.dependencies['electron'] = '^31.0.0'
    webOutput.packageJson.devDependencies['electron-builder'] = '^24.13.0'

    return webOutput
  }
}

/**
 * iOS Platform Compiler (React Native)
 */
class iOSCompiler implements PlatformCompiler {
  async generate(composition: CapsuleComposition, capsules: UniversalCapsule[]): Promise<CompilationOutput> {
    // TODO: Generate React Native code for iOS
    return {
      code: {},
      packageJson: { name: '', version: '', dependencies: {}, devDependencies: {} },
      buildInstructions: { install: [], build: [], dev: [] }
    }
  }

  async optimize(output: CompilationOutput, config: any): Promise<CompilationOutput> {
    return output
  }

  async bundle(output: CompilationOutput): Promise<CompilationOutput> {
    return output
  }
}

/**
 * Android Platform Compiler (React Native)
 */
class AndroidCompiler implements PlatformCompiler {
  async generate(composition: CapsuleComposition, capsules: UniversalCapsule[]): Promise<CompilationOutput> {
    // TODO: Generate React Native code for Android
    return {
      code: {},
      packageJson: { name: '', version: '', dependencies: {}, devDependencies: {} },
      buildInstructions: { install: [], build: [], dev: [] }
    }
  }

  async optimize(output: CompilationOutput, config: any): Promise<CompilationOutput> {
    return output
  }

  async bundle(output: CompilationOutput): Promise<CompilationOutput> {
    return output
  }
}

/**
 * AI OS Compiler (Intent-based)
 */
class AIIntentCompiler implements PlatformCompiler {
  async generate(composition: CapsuleComposition, capsules: UniversalCapsule[]): Promise<CompilationOutput> {
    // Generate intent definitions
    const intents = this.extractIntents(composition, capsules)

    const code = {
      'intents.json': JSON.stringify(intents, null, 2)
    }

    return {
      code,
      packageJson: {
        name: composition.name,
        version: composition.version,
        dependencies: {},
        devDependencies: {}
      },
      buildInstructions: {
        install: [],
        build: [],
        dev: []
      }
    }
  }

  private extractIntents(composition: CapsuleComposition, capsules: UniversalCapsule[]) {
    // TODO: Convert capsule composition to AI intents
    return {
      app: composition.name,
      intents: []
    }
  }

  async optimize(output: CompilationOutput, config: any): Promise<CompilationOutput> {
    return output
  }

  async bundle(output: CompilationOutput): Promise<CompilationOutput> {
    return output
  }
}

// ===== TYPES =====

interface CompilationOptions {
  optimize?: boolean
  minify?: boolean
  sourceMaps?: boolean
}

export { WebCompiler, DesktopCompiler, iOSCompiler, AndroidCompiler, AIIntentCompiler }
export type { PlatformCompiler, CompilationOptions }

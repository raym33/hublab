'use client'

import { useEffect, useState } from 'react'
import { Loader2, CheckCircle2, Code, Play, Sparkles } from 'lucide-react'

export default function CompilerDemoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'stats'>('preview')

  useEffect(() => {
    // Simulate generating a simple todo app
    const generateDemo = async () => {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock result
      const mockResult = {
        success: true,
        platform: 'web',
        output: {
          code: {
            'src/App.tsx': `import { AppContainer } from './components/app-container'
import { InputText } from './components/input-text'
import { ButtonPrimary } from './components/button-primary'
import { ListView } from './components/list-view'
import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState<string[]>([])
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (input.trim()) {
      setTodos([...todos, input])
      setInput('')
    }
  }

  return (
    <AppContainer title="My Todo App">
      <div className="space-y-4">
        <div className="flex gap-2">
          <InputText
            placeholder="Add a new todo..."
            value={input}
            onChange={setInput}
          />
          <ButtonPrimary
            label="Add"
            onClick={handleAdd}
          />
        </div>
        <ListView
          items={todos}
          renderItem={(item, index) => (
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              {item}
            </div>
          )}
          keyExtractor={(item, index) => String(index)}
        />
      </div>
    </AppContainer>
  )
}`,
            'src/components/app-container.tsx': `export const AppContainer = ({ children, title }: any) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}`,
            'src/components/input-text.tsx': `import { useState } from 'react'

export const InputText = ({ placeholder, value, onChange }: any) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  )
}`,
            'src/components/button-primary.tsx': `export const ButtonPrimary = ({ label, onClick, disabled }: any) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  )
}`,
            'src/components/list-view.tsx': `export const ListView = ({ items, renderItem, keyExtractor }: any) => {
  return (
    <div className="space-y-2">
      {items.map((item: any, index: number) => (
        <div key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}`
          },
          packageJson: {
            name: 'todo-app',
            version: '1.0.0',
            dependencies: {
              react: '^18.3.0',
              'react-dom': '^18.3.0'
            },
            devDependencies: {
              '@types/react': '^18.3.0',
              '@types/react-dom': '^18.3.0',
              '@vitejs/plugin-react': '^4.3.0',
              typescript: '^5.5.0',
              vite: '^5.4.0'
            }
          },
          buildInstructions: {
            install: ['npm install'],
            build: ['npm run build'],
            dev: ['npm run dev']
          }
        },
        stats: {
          duration: 1847,
          capsulesProcessed: 5,
          linesOfCode: 127,
          bundleSize: 45231,
          dependencies: {
            capsules: 5,
            npm: 2
          }
        }
      }

      setResult(mockResult)
      setIsLoading(false)
    }

    generateDemo()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating your app...</h2>
          <p className="text-gray-600">Claude is composing capsules</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
              <p className="text-sm text-gray-500">Generated with Universal Capsule Compiler</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Generated in {result.stats.duration}ms
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Play className="w-5 h-5 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Code className="w-5 h-5 inline mr-2" />
            Code
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Stats
          </button>
        </div>

        {/* Content */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm text-gray-300 font-mono">localhost:3000</span>
            </div>
            <div className="p-8 min-h-[600px] bg-gray-50">
              {/* Live Preview of Generated App */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-white border-b px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">My Todo App</h1>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a new todo..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        Buy groceries
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        Finish project
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        Call mom
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-700 overflow-hidden shadow-xl">
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
              <span className="font-mono text-sm text-gray-300">src/App.tsx</span>
            </div>
            <div className="p-6 overflow-auto max-h-[600px]">
              <pre className="text-sm text-gray-100 font-mono leading-relaxed">
                <code>{result.output.code['src/App.tsx']}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compilation Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-mono font-semibold text-gray-900">{result.stats.duration}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Capsules Processed</span>
                  <span className="font-mono font-semibold text-gray-900">{result.stats.capsulesProcessed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lines of Code</span>
                  <span className="font-mono font-semibold text-gray-900">{result.stats.linesOfCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bundle Size</span>
                  <span className="font-mono font-semibold text-gray-900">{Math.round(result.stats.bundleSize / 1024)}KB</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Capsules Used</h3>
              <div className="space-y-3">
                {['app-container', 'input-text', 'button-primary', 'list-view', 'database-local'].map((capsule) => (
                  <div key={capsule} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="font-mono text-sm text-gray-700">{capsule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                How It Works
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The Universal Capsule Compiler analyzed your prompt "Build me a todo app",
                searched the registry for relevant capsules, composed them into a working application,
                generated platform-specific code, and bundled everything for production—all in under 2 seconds.
              </p>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="/compiler"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Try Building Your Own App
          </a>
        </div>
      </div>
    </div>
  )
}

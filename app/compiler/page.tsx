'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Code, Zap, Download, Play, Loader2, CheckCircle2, XCircle, Package, Save } from 'lucide-react'
import { downloadProjectAsZip } from '@/lib/capsule-compiler/download-utils'
import { supabase } from '@/lib/supabase'
import SaveCompositionDialog from '@/components/SaveCompositionDialog'
import type { CompilationResult } from '@/lib/capsule-compiler/types'

export default function CapsuleCompilerDemo() {
  const [prompt, setPrompt] = useState('')
  const [platform, setPlatform] = useState<'web' | 'desktop' | 'ios' | 'android' | 'ai-os'>('web')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CompilationResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check auth status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const examples = [
    { text: 'Build me a todo app with local storage', icon: '✅' },
    { text: 'Create a chat interface with message history', icon: '💬' },
    { text: 'Make a simple calculator app', icon: '🔢' },
    { text: 'Build a weather dashboard app', icon: '🌤️' }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setResult(null)
    setSelectedFile(null)

    try {
      const response = await fetch('/api/compiler/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          platform
        })
      })

      const data = await response.json()
      setResult(data)

      // Auto-select first file
      if (data.success && data.output?.code) {
        const firstFile = Object.keys(data.output.code)[0]
        setSelectedFile(firstFile)
      }
    } catch (error) {
      console.error('Generation error:', error)
      setResult({
        success: false,
        platform,
        errors: [{ type: 'network', message: 'Failed to connect to compiler service' }],
        stats: {
          duration: 0,
          capsulesProcessed: 0,
          linesOfCode: 0,
          dependencies: { capsules: 0, npm: 0 }
        }
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!result) return

    try {
      // Extract project name from prompt or use default
      const projectName = prompt.split(' ').slice(0, 3).join('-') || 'my-app'
      await downloadProjectAsZip(result, projectName)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download project. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Universal Capsule Compiler</h1>
              <p className="text-sm text-gray-500">AI-powered app generation</p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Claude AI
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Describe Your App
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Claude will generate a production-ready app using universal capsules that work on any platform
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What do you want to build?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Build me a todo app with local storage and the ability to mark tasks as complete..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
                disabled={isGenerating}
              />

              {/* Examples */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 font-medium">Try:</span>
                {examples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example.text)}
                    disabled={isGenerating}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {example.icon} {example.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection & Generate Button */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Platform:</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  disabled={isGenerating}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="web">Web (React)</option>
                  <option value="desktop">Desktop (Electron)</option>
                  <option value="ios">iOS (React Native)</option>
                  <option value="android">Android (React Native)</option>
                  <option value="ai-os">AI OS (Intent-based)</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate App
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="max-w-7xl mx-auto">
            {/* Status Banner */}
            <div className={`mb-6 p-4 rounded-xl border-2 ${
              result.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {result.success ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'App Generated Successfully!' : 'Generation Failed'}
                  </h3>
                  <p className={`text-sm ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.success
                      ? `Generated in ${result.stats.duration}ms using ${result.stats.capsulesProcessed} capsules`
                      : result.errors?.[0]?.message || 'An error occurred'
                    }
                  </p>
                </div>
                {result.success && (
                  <div className="flex items-center gap-2">
                    {user && (
                      <button
                        onClick={() => setShowSaveDialog(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    )}
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            {result.success && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.stats.capsulesProcessed}</div>
                  <div className="text-sm text-gray-600">Capsules</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.stats.linesOfCode}</div>
                  <div className="text-sm text-gray-600">Lines of Code</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.stats.duration}ms</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.stats.dependencies.npm}</div>
                  <div className="text-sm text-gray-600">NPM Packages</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {result.stats.bundleSize?.minified ? `${Math.round(result.stats.bundleSize.minified / 1024)}KB` : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Bundle Size</div>
                </div>
              </div>
            )}

            {/* Code Viewer */}
            {result.success && result.output && (
              <div className="grid md:grid-cols-12 gap-6">
                {/* File Explorer */}
                <div className="md:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 text-sm">Files</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {Object.keys(result.output.code).map((file) => (
                      <button
                        key={file}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          selectedFile === file ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <Code className="w-4 h-4 inline mr-2" />
                        {file}
                      </button>
                    ))}
                    {result.output.manifest?.packageJson && (
                      <button
                        onClick={() => setSelectedFile('package.json')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          selectedFile === 'package.json' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <Package className="w-4 h-4 inline mr-2" />
                        package.json
                      </button>
                    )}
                  </div>
                </div>

                {/* Code Display */}
                <div className="md:col-span-9 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-300">{selectedFile || 'Select a file'}</span>
                    {selectedFile && (
                      <button
                        onClick={() => {
                          const code = selectedFile === 'package.json'
                            ? JSON.stringify(result.output?.manifest?.packageJson, null, 2)
                            : result.output?.code[selectedFile]
                          navigator.clipboard.writeText(code || '')
                        }}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Copy
                      </button>
                    )}
                  </div>
                  <div className="p-6 overflow-auto max-h-[600px]">
                    <pre className="text-sm text-gray-100 font-mono leading-relaxed">
                      <code>
                        {selectedFile === 'package.json'
                          ? JSON.stringify(result.output.manifest?.packageJson, null, 2)
                          : selectedFile && result.output.code[selectedFile]
                        }
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Build Instructions */}
            {result.success && result.output && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  Quick Start
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">1. Download the project:</div>
                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
                      Click the "Download" button above to get your complete project as a ZIP file
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">2. Install dependencies:</div>
                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
                      npm install
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">3. Run development server:</div>
                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
                      npm run dev
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">4. Build for production:</div>
                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
                      npm run build
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {result && result.success && (
        <SaveCompositionDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          prompt={prompt}
          platform={platform}
          compilationResult={result}
          onSaved={(id) => {
            console.log('Composition saved:', id)
            alert('Composition saved successfully!')
          }}
        />
      )}
    </div>
  )
}

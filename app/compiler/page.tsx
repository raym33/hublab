'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles, Code, Zap, Download, Play, Loader2, CheckCircle2, XCircle,
  Package, Save, Eye, Monitor, Smartphone, Tablet, Settings,
  Copy, FileCode, Terminal, Maximize2
} from 'lucide-react'
import { downloadProjectAsZip } from '@/lib/capsule-compiler/download-utils'
import { supabase } from '@/lib/supabase'
import SaveCompositionDialog from '@/components/SaveCompositionDialog'
import type { CompilationResult } from '@/lib/capsule-compiler/types'

type ViewMode = 'desktop' | 'tablet' | 'mobile'
type TabType = 'preview' | 'code' | 'console'

export default function CapsuleCompilerPro() {
  const [prompt, setPrompt] = useState('')
  const [platform, setPlatform] = useState<'web' | 'desktop' | 'ios' | 'android' | 'ai-os'>('web')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CompilationResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('preview')
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform })
      })

      const data = await response.json()
      setResult(data)

      if (data.success && data.output?.code) {
        const firstFile = Object.keys(data.output.code)[0]
        setSelectedFile(firstFile)
        setActiveTab('preview')
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
      const projectName = prompt.split(' ').slice(0, 3).join('-') || 'my-app'
      await downloadProjectAsZip(result, projectName)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download project. Please try again.')
    }
  }

  const copyCode = () => {
    const code = selectedFile === 'package.json'
      ? JSON.stringify(result?.output?.manifest?.packageJson, null, 2)
      : result?.output?.code[selectedFile!]
    if (code) {
      navigator.clipboard.writeText(code)
    }
  }

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      default: return '100%'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Compiler Pro
              </h1>
              <p className="text-xs text-gray-400">Powered by Claude AI</p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Home
          </a>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto">
        {/* Input Section */}
        <div className="p-6 border-b border-white/10 bg-black/10">
          <div className="max-w-4xl mx-auto">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Describe tu aplicación
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ejemplo: Crea un todo app con local storage, drag & drop, categorías y dark mode..."
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-white placeholder:text-gray-500"
              disabled={isGenerating}
            />

            {/* Examples */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 font-medium">Try:</span>
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example.text)}
                  disabled={isGenerating}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-lg transition-colors disabled:opacity-50 border border-white/10"
                >
                  {example.icon} {example.text}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-400">Platform:</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
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
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando...
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

        {/* Results - Split Screen */}
        {result && result.success && (
          <div className="flex h-[calc(100vh-280px)]">
            {/* Left Sidebar - Files & Stats */}
            <div className="w-80 border-r border-white/10 bg-black/20 overflow-y-auto">
              {/* Stats */}
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Generated Successfully
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-lg font-bold text-white">{result.stats.capsulesProcessed}</div>
                    <div className="text-xs text-gray-400">Capsules</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-lg font-bold text-white">{result.stats.linesOfCode}</div>
                    <div className="text-xs text-gray-400">Lines</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-lg font-bold text-white">{result.stats.duration}ms</div>
                    <div className="text-xs text-gray-400">Time</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-lg font-bold text-white">{result.stats.dependencies.npm}</div>
                    <div className="text-xs text-gray-400">Packages</div>
                  </div>
                </div>
              </div>

              {/* Files */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  Files
                </h3>
                <div className="space-y-1">
                  {Object.keys(result.output?.code || {}).map((file) => (
                    <button
                      key={file}
                      onClick={() => { setSelectedFile(file); setActiveTab('code'); }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                        selectedFile === file
                          ? 'bg-purple-600 text-white font-medium'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <Code className="w-4 h-4 inline mr-2" />
                      {file}
                    </button>
                  ))}
                  {result.output?.manifest?.packageJson && (
                    <button
                      onClick={() => { setSelectedFile('package.json'); setActiveTab('code'); }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                        selectedFile === 'package.json'
                          ? 'bg-purple-600 text-white font-medium'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <Package className="w-4 h-4 inline mr-2" />
                      package.json
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/10 space-y-2">
                {user && (
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Project
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download ZIP
                </button>
              </div>
            </div>

            {/* Main Content - Tabs */}
            <div className="flex-1 flex flex-col bg-black/10">
              {/* Tab Bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === 'preview'
                        ? 'text-white border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === 'code'
                        ? 'text-white border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-2" />
                    Code
                  </button>
                  <button
                    onClick={() => setActiveTab('console')}
                    className={`px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === 'console'
                        ? 'text-white border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-4 h-4 inline mr-2" />
                    Console
                  </button>
                </div>

                {activeTab === 'preview' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'}`}
                      title="Desktop"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('tablet')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'}`}
                      title="Tablet"
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'}`}
                      title="Mobile"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {activeTab === 'code' && selectedFile && (
                  <button
                    onClick={copyCode}
                    className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-6">
                {activeTab === 'preview' && (
                  <div className="flex items-center justify-center h-full">
                    <div
                      className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
                      style={{ width: getPreviewWidth(), height: viewMode === 'mobile' ? '667px' : '100%', maxHeight: '900px' }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center p-8">
                          <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm font-medium text-gray-600">Preview Coming Soon</p>
                          <p className="text-xs mt-2 opacity-75 text-gray-500">Download and run locally to see your app in action</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden h-full">
                    <div className="bg-slate-800 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-300">{selectedFile || 'Select a file'}</span>
                    </div>
                    <div className="p-6 overflow-auto max-h-[calc(100vh-400px)]">
                      <pre className="text-sm text-gray-100 font-mono leading-relaxed">
                        <code>
                          {selectedFile === 'package.json'
                            ? JSON.stringify(result.output?.manifest?.packageJson, null, 2)
                            : selectedFile && result.output?.code[selectedFile]
                          }
                        </code>
                      </pre>
                    </div>
                  </div>
                )}

                {activeTab === 'console' && (
                  <div className="bg-slate-900 rounded-xl border border-white/10 p-6 h-full font-mono text-sm">
                    <div className="text-green-400">
                      <p>✓ Compilation successful</p>
                      <p className="text-gray-500 mt-2">✓ {result.stats.linesOfCode} lines generated</p>
                      <p className="text-gray-500">✓ {result.stats.capsulesProcessed} capsules processed</p>
                      <p className="text-gray-500">✓ {result.stats.dependencies.npm} dependencies added</p>
                      <p className="text-gray-400 mt-4">No errors or warnings</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {result && !result.success && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto bg-red-500/10 border-2 border-red-500 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-400">Generation Failed</h3>
                  <p className="text-sm text-red-300 mt-1">
                    {result.errors?.[0]?.message || 'An error occurred'}
                  </p>
                </div>
              </div>
            </div>
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
            alert('Project saved successfully!')
          }}
        />
      )}
    </div>
  )
}

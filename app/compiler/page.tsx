'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import {
  Sparkles, Code, Zap, Download, Play, Loader2, CheckCircle2, XCircle,
  Package, Save, Eye, Monitor, Smartphone, Tablet, Settings,
  Copy, FileCode, Terminal, Maximize2, ChevronDown, ChevronUp
} from 'lucide-react'
import { downloadProjectAsZip } from '@/lib/capsule-compiler/download-utils'
import { supabase } from '@/lib/supabase'
import SaveCompositionDialog from '@/components/SaveCompositionDialog'
import TemplateSelector from '@/components/TemplateSelector'
import IterativeChat from '@/components/IterativeChat'
import CapsuleSelector from '@/components/CapsuleSelector'
import type { CompilationResult } from '@/lib/capsule-compiler/types'
import type { AppTemplate } from '@/lib/capsule-compiler/templates'
import type { CompleteCapsule } from '@/lib/complete-capsules'

// Lazy load Monaco Editor and LivePreview for better performance
const MonacoEditor = lazy(() => import('@/components/MonacoEditor'))
const LivePreview = lazy(() => import('@/components/LivePreview'))

type ViewMode = 'desktop' | 'tablet' | 'mobile'
type TabType = 'preview' | 'code' | 'console'

interface ConsoleMessage {
  type: 'log' | 'warn' | 'error' | 'info'
  message: string
  timestamp: number
}

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
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [previousPrompts, setPreviousPrompts] = useState<string[]>([])
  const [versionHistory, setVersionHistory] = useState<CompilationResult[]>([])
  const [showIterativeChat, setShowIterativeChat] = useState(false)
  const [showCapsuleSelector, setShowCapsuleSelector] = useState(false)
  const [selectedCapsules, setSelectedCapsules] = useState<CompleteCapsule[]>([])
  const [showMobileStats, setShowMobileStats] = useState(true)

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
    setConsoleMessages([])

    try {
      const response = await fetch('/api/compiler/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          platform,
          selectedCapsules: selectedCapsules.map(c => c.id)
        })
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

  const handleSelectTemplate = async (template: AppTemplate) => {
    setPrompt(template.description)
    setIsGenerating(true)
    setResult(null)
    setSelectedFile(null)
    setConsoleMessages([])

    try {
      const response = await fetch('/api/compiler/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition: template.composition,
          platform
        })
      })

      const data = await response.json()
      setResult(data)

      if (data.success && data.output?.code) {
        const firstFile = Object.keys(data.output.code)[0]
        setSelectedFile(firstFile)
        setActiveTab('preview')
      }
    } catch (error) {
      console.error('Template generation error:', error)
      setResult({
        success: false,
        platform,
        errors: [{ type: 'network', message: 'Failed to generate from template' }],
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

  const handleImprove = async (instruction: string) => {
    if (!result?.output?.code) return

    setIsImproving(true)

    try {
      const response = await fetch('/api/compiler/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction,
          currentCode: result.output.code,
          previousPrompts,
          platform
        })
      })

      const data = await response.json()

      if (data.success) {
        // Save current state to history
        setVersionHistory(prev => [...prev, result])

        // Update with improved version
        setResult(data)
        setPreviousPrompts(prev => [...prev, instruction])

        if (data.output?.code) {
          const firstFile = Object.keys(data.output.code)[0]
          setSelectedFile(firstFile)
        }
      }
    } catch (error) {
      console.error('Improvement error:', error)
      throw error
    } finally {
      setIsImproving(false)
    }
  }

  const handleUndo = () => {
    if (versionHistory.length === 0) return

    const previousVersion = versionHistory[versionHistory.length - 1]
    setVersionHistory(prev => prev.slice(0, -1))
    setResult(previousVersion)
    setPreviousPrompts(prev => prev.slice(0, -1))
  }

  const copyCode = () => {
    const code = selectedFile === 'package.json'
      ? JSON.stringify(result?.output?.manifest?.packageJson, null, 2)
      : result?.output?.code[selectedFile!]
    if (code) {
      navigator.clipboard.writeText(code)
    }
  }

  const handleConsoleMessage = (message: ConsoleMessage) => {
    setConsoleMessages(prev => [...prev, message])
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
      {/* Header - Responsive */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
                AI Compiler Pro
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate">Powered by Claude AI</p>
            </div>
          </div>
          <a
            href="/"
            className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap"
          >
            ← Home
          </a>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto">
        {/* Input Section - Fully Responsive */}
        <div className="p-3 sm:p-6 border-b border-white/10 bg-black/10">
          <div className="max-w-4xl mx-auto">
            <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3">
              Describe tu aplicación
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ejemplo: Crea un todo app con local storage, drag & drop, categorías y dark mode..."
              className="w-full h-20 sm:h-24 px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base text-white placeholder:text-gray-500 touch-manipulation"
              disabled={isGenerating}
              style={{ WebkitAppearance: 'none' }}
            />

            {/* Examples & Template Buttons - Responsive */}
            <div className="mt-2 sm:mt-3 space-y-2">
              {/* Examples - Hidden on very small screens, scrollable on mobile */}
              <div className="hidden xs:flex overflow-x-auto pb-2 gap-1.5 sm:gap-2 scrollbar-hide">
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium whitespace-nowrap flex items-center">Try:</span>
                {examples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example.text)}
                    disabled={isGenerating}
                    className="px-2 sm:px-3 py-1 bg-white/5 active:bg-white/10 text-gray-300 text-[10px] sm:text-xs rounded-md sm:rounded-lg transition-colors disabled:opacity-50 border border-white/10 whitespace-nowrap touch-manipulation flex-shrink-0"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className="hidden sm:inline">{example.icon} {example.text}</span>
                    <span className="sm:hidden">{example.icon}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={() => setShowCapsuleSelector(true)}
                  disabled={isGenerating}
                  className="px-3 sm:px-4 py-2 sm:py-2 bg-white/5 active:bg-white/10 border border-white/10 text-white text-xs sm:text-sm font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate">Browse Capsules</span>
                  {selectedCapsules.length > 0 && (
                    <span className="px-1.5 sm:px-2 py-0.5 bg-purple-500 text-white text-[10px] sm:text-xs rounded-full">
                      {selectedCapsules.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  disabled={isGenerating}
                  className="px-3 sm:px-4 py-2 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 active:from-purple-700 active:to-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate">Browse Templates</span>
                </button>
              </div>
            </div>

            {/* Controls - Stack on mobile */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <label className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Platform:</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  disabled={isGenerating}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm font-medium text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50 touch-manipulation"
                  style={{ WebkitAppearance: 'none' }}
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
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 active:from-blue-700 active:to-purple-700 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="truncate">Generando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate">Generate App</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results - Split Screen - Responsive */}
        {result && result.success && (
          <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-280px)]">
            {/* Mobile Toggle for Stats/Files */}
            <button
              onClick={() => setShowMobileStats(!showMobileStats)}
              className="lg:hidden w-full px-4 py-3 bg-black/20 border-b border-white/10 flex items-center justify-between text-sm font-medium text-gray-300 active:bg-black/30 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Stats & Files
              </span>
              {showMobileStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Left Sidebar - Files & Stats - Collapsible on Mobile */}
            <div className={`${showIterativeChat ? 'lg:w-64' : 'lg:w-80'} w-full lg:border-r border-b lg:border-b-0 border-white/10 bg-black/20 overflow-y-auto transition-all ${showMobileStats ? 'max-h-96' : 'max-h-0 lg:max-h-none overflow-hidden'} lg:overflow-y-auto`}>
              {/* Stats */}
              <div className="p-3 sm:p-4 border-b border-white/10">
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
              <div className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Files
                </h3>
                <div className="space-y-1">
                  {Object.keys(result.output?.code || {}).map((file) => (
                    <button
                      key={file}
                      onClick={() => { setSelectedFile(file); setActiveTab('code'); setShowMobileStats(false); }}
                      className={`w-full text-left px-3 py-2.5 text-xs sm:text-sm rounded-lg transition-all touch-manipulation ${
                        selectedFile === file
                          ? 'bg-purple-600 text-white font-medium'
                          : 'text-gray-400 active:bg-white/10'
                      }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2" />
                      <span className="truncate inline-block max-w-[calc(100%-2rem)]">{file}</span>
                    </button>
                  ))}
                  {result.output?.manifest?.packageJson && (
                    <button
                      onClick={() => { setSelectedFile('package.json'); setActiveTab('code'); setShowMobileStats(false); }}
                      className={`w-full text-left px-3 py-2.5 text-xs sm:text-sm rounded-lg transition-all touch-manipulation ${
                        selectedFile === 'package.json'
                          ? 'bg-purple-600 text-white font-medium'
                          : 'text-gray-400 active:bg-white/10'
                      }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2" />
                      package.json
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 sm:p-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => setShowIterativeChat(!showIterativeChat)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 ${
                    showIterativeChat
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-white/5 border border-white/10'
                  } text-white text-xs sm:text-sm font-medium rounded-lg active:opacity-90 transition-all touch-manipulation`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {showIterativeChat ? 'Hide' : 'Improve with'} AI
                </button>
                {user && (
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-medium rounded-lg active:bg-white/10 transition-colors touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Save Project
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg active:from-green-700 active:to-emerald-700 transition-all touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Download ZIP
                </button>
              </div>
            </div>

            {/* Main Content - Tabs */}
            <div className="flex-1 flex flex-col bg-black/10 min-h-[400px] lg:min-h-0">
              {/* Tab Bar - Responsive */}
              <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-2 sm:px-4">
                <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all touch-manipulation whitespace-nowrap ${
                      activeTab === 'preview'
                        ? 'text-white border-b-2 border-purple-500'
                        : 'text-gray-400 active:text-white'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Preview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all touch-manipulation whitespace-nowrap ${
                      activeTab === 'code'
                        ? 'text-white border-b-2 border-purple-500'
                        : 'text-gray-400 active:text-white'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Code</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('console')}
                    className={`px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all touch-manipulation whitespace-nowrap ${
                      activeTab === 'console'
                        ? 'text-white border-b-2 border-purple-500'
                        : 'text-gray-400 active:text-white'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Console</span>
                  </button>
                </div>

                {activeTab === 'preview' && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all touch-manipulation ${viewMode === 'desktop' ? 'bg-purple-600' : 'bg-white/5 active:bg-white/10'}`}
                      title="Desktop"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('tablet')}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all touch-manipulation ${viewMode === 'tablet' ? 'bg-purple-600' : 'bg-white/5 active:bg-white/10'}`}
                      title="Tablet"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Tablet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all touch-manipulation ${viewMode === 'mobile' ? 'bg-purple-600' : 'bg-white/5 active:bg-white/10'}`}
                      title="Mobile"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}

                {activeTab === 'code' && selectedFile && (
                  <button
                    onClick={copyCode}
                    className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs bg-white/5 active:bg-white/10 text-gray-300 rounded-lg transition-all flex items-center gap-1 sm:gap-2 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Copy className="w-3 h-3" />
                    <span className="hidden xs:inline">Copy</span>
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'preview' && result.output?.code && (
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                          <p className="text-sm text-gray-400">Loading preview...</p>
                        </div>
                      </div>
                    }
                  >
                    <SecureLivePreview
                      code={result.output.code}
                      platform={result.platform}
                      viewMode={viewMode}
                      onConsoleMessage={handleConsoleMessage}
                    />
                  </Suspense>
                )}

                {activeTab === 'code' && selectedFile && (
                  <div className="bg-slate-900 rounded-lg sm:rounded-xl border border-white/10 overflow-hidden h-full">
                    <div className="bg-slate-800 px-3 sm:px-4 py-2 border-b border-white/10 flex items-center justify-between">
                      <span className="font-mono text-xs sm:text-sm text-gray-300 truncate">{selectedFile}</span>
                    </div>
                    <div className="h-[calc(100%-48px)]">
                      <Suspense
                        fallback={
                          <div className="flex items-center justify-center h-full bg-slate-900">
                            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                          </div>
                        }
                      >
                        <MonacoEditor
                          value={
                            selectedFile === 'package.json'
                              ? JSON.stringify(result.output?.manifest?.packageJson, null, 2)
                              : result.output?.code[selectedFile] || ''
                          }
                          language={selectedFile.split('.').pop() || 'typescript'}
                          readOnly={true}
                          height="100%"
                        />
                      </Suspense>
                    </div>
                  </div>
                )}

                {activeTab === 'console' && (
                  <div className="bg-slate-900 rounded-lg sm:rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
                    <div className="bg-slate-800 px-3 sm:px-4 py-2 border-b border-white/10 flex items-center justify-between">
                      <span className="font-mono text-xs sm:text-sm text-gray-300 flex items-center gap-1.5 sm:gap-2">
                        <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Console Output</span>
                        <span className="xs:hidden">Console</span>
                      </span>
                      <button
                        onClick={() => setConsoleMessages([])}
                        className="text-[10px] sm:text-xs text-gray-400 active:text-white transition-colors px-2 py-1 touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 font-mono text-xs sm:text-sm space-y-1">
                      {/* Compilation Info */}
                      <div className="text-green-400 pb-3 border-b border-white/10 mb-3">
                        <p>✓ Compilation successful</p>
                        <p className="text-gray-500">✓ {result.stats.linesOfCode} lines generated</p>
                        <p className="text-gray-500">✓ {result.stats.capsulesProcessed} capsules processed</p>
                        <p className="text-gray-500">✓ {result.stats.dependencies.npm} dependencies added</p>
                      </div>

                      {/* Console Messages */}
                      {consoleMessages.length === 0 ? (
                        <p className="text-gray-500 italic">No console output yet...</p>
                      ) : (
                        consoleMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`py-1 ${
                              msg.type === 'error' ? 'text-red-400' :
                              msg.type === 'warn' ? 'text-yellow-400' :
                              msg.type === 'info' ? 'text-blue-400' :
                              'text-gray-300'
                            }`}
                          >
                            <span className="text-gray-500 text-xs mr-2">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="text-gray-400 mr-2">[{msg.type}]</span>
                            <span>{msg.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Iterative AI Chat Panel - Responsive */}
              {showIterativeChat && (
                <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 flex-shrink-0 max-h-[400px] lg:max-h-none">
                  <IterativeChat
                    currentResult={result}
                    onImprove={handleImprove}
                    isImproving={isImproving}
                    onUndo={handleUndo}
                    canUndo={versionHistory.length > 0}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error State - Responsive */}
        {result && !result.success && (
          <div className="p-3 sm:p-6">
            <div className="max-w-4xl mx-auto bg-red-500/10 border-2 border-red-500 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-red-400">Generation Failed</h3>
                  <p className="text-xs sm:text-sm text-red-300 mt-1 break-words">
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

      {/* Template Selector */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Capsule Selector */}
      {showCapsuleSelector && (
        <CapsuleSelector
          onClose={() => setShowCapsuleSelector(false)}
          onSelectCapsules={setSelectedCapsules}
          initialSelected={selectedCapsules}
        />
      )}
    </div>
  )
}

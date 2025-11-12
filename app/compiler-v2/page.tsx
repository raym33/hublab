'use client'

import { useState, useEffect } from 'react'
import { Zap, Play, Download, Code, Eye, Loader2, CheckCircle2, XCircle, Sparkles, Package, Layers, Info } from 'lucide-react'

interface Capsule {
  id: string
  name: string
  description: string
  category: string
  props: any[]
}

interface CompilationResult {
  success: boolean
  composition: any
  result?: {
    code: string
    html: string
    dependencies: string[]
  }
  error?: string
}

export default function CompilerV2() {
  const [activeSection, setActiveSection] = useState<'templates' | 'capsules'>('capsules')
  const [selectedTemplate, setSelectedTemplate] = useState('todo-app')
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCompiling, setIsCompiling] = useState(false)
  const [result, setResult] = useState<CompilationResult | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null)

  const templates = [
    { id: 'todo-app', name: 'Todo App', icon: '✅', description: 'Task management application' },
    { id: 'calculator', name: 'Calculator', icon: '🔢', description: 'Simple calculator with counters' },
    { id: 'contact-form', name: 'Contact Form', icon: '📧', description: 'Professional contact form' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Dashboard with stats' },
    { id: 'timer-app', name: 'Timer', icon: '⏱️', description: 'Productivity timer' },
    { id: 'tabs-demo', name: 'Tabs', icon: '📑', description: 'Tabbed interface' },
    { id: 'ui-components', name: 'UI Kit', icon: '🎨', description: 'Component showcase' },
    { id: 'landing-page', name: 'Landing Page', icon: '🚀', description: 'Simple landing page' }
  ]

  const categoryInfo: Record<string, { name: string; icon: string; description: string }> = {
    ui: { name: 'UI Components', icon: '🎨', description: 'Visual interface elements like buttons, inputs, and cards' },
    layout: { name: 'Layouts', icon: '📐', description: 'Structural components for organizing content on the page' },
    logic: { name: 'Logic', icon: '⚡', description: 'Interactive components with built-in functionality' },
    feature: { name: 'Features', icon: '✨', description: 'Complete features ready to use in your app' }
  }

  // Fetch capsules
  useEffect(() => {
    fetch('/api/compiler/v2?type=capsules')
      .then(res => res.json())
      .then(data => {
        setCapsules(data.capsules || [])
      })
      .catch(err => console.error('Error loading capsules:', err))
  }, [])

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(capsules.map(c => c.category)))]

  // Filter capsules by category
  const filteredCapsules = selectedCategory === 'all'
    ? capsules
    : capsules.filter(c => c.category === selectedCategory)

  const handleCompile = async () => {
    setIsCompiling(true)
    setResult(null)

    try {
      const response = await fetch('/api/compiler/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selectedTemplate })
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setActiveTab('preview')
      }
    } catch (error: any) {
      setResult({
        success: false,
        composition: null,
        error: error.message
      })
    } finally {
      setIsCompiling(false)
    }
  }

  const handleDownload = () => {
    if (!result?.result?.html) return

    const blob = new Blob([result.result.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTemplate}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Capsule System V2</h1>
                <p className="text-sm text-gray-600">Explora {capsules.length} componentes modulares disponibles</p>
              </div>
            </div>

            {result?.success && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                Download HTML
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Section Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveSection('capsules')}
            className={`flex-1 p-6 rounded-xl border-2 transition-all ${
              activeSection === 'capsules'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Package className="w-6 h-6" />
              <h3 className="text-xl font-bold">Explorar Cápsulas</h3>
            </div>
            <p className={`text-sm ${activeSection === 'capsules' ? 'text-blue-100' : 'text-gray-600'}`}>
              Ver todas las cápsulas disponibles por categoría
            </p>
          </button>

          <button
            onClick={() => setActiveSection('templates')}
            className={`flex-1 p-6 rounded-xl border-2 transition-all ${
              activeSection === 'templates'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-xl font-bold">Compilar App Completa</h3>
            </div>
            <p className={`text-sm ${activeSection === 'templates' ? 'text-blue-100' : 'text-gray-600'}`}>
              Usar templates predefinidos para crear apps completas
            </p>
          </button>
        </div>

        {/* Capsules Browser */}
        {activeSection === 'capsules' && (
          <div>
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">¿Qué son las cápsulas?</h4>
                <p className="text-sm text-blue-700">
                  Las cápsulas son componentes React reutilizables y autocontenidos. Cada cápsula incluye su propio código, estilos (Tailwind CSS) y lógica.
                  Puedes usarlas individualmente o combinarlas para crear aplicaciones completas.
                </p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrar por categoría:</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {category === 'all' ? '📦 Todas' : categoryInfo[category]?.icon + ' ' + categoryInfo[category]?.name || category}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Description */}
            {selectedCategory !== 'all' && categoryInfo[selectedCategory] && (
              <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{categoryInfo[selectedCategory].icon}</span>
                  <h3 className="font-bold text-gray-900">{categoryInfo[selectedCategory].name}</h3>
                </div>
                <p className="text-sm text-gray-600">{categoryInfo[selectedCategory].description}</p>
              </div>
            )}

            {/* Capsules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCapsules.map((capsule) => (
                <div
                  key={capsule.id}
                  onClick={() => setSelectedCapsule(capsule)}
                  className="bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {capsule.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {categoryInfo[capsule.category]?.icon} {categoryInfo[capsule.category]?.name || capsule.category}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layers className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{capsule.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {capsule.props.length} {capsule.props.length === 1 ? 'prop' : 'props'}
                    </span>
                    <span className="text-xs text-blue-600 font-medium group-hover:underline">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredCapsules.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No hay cápsulas en esta categoría</h3>
                <p className="text-gray-600">Selecciona otra categoría para ver más cápsulas</p>
              </div>
            )}
          </div>
        )}

        {/* Template Compiler */}
        {activeSection === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Template Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Templates</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-700">
                    <strong>¿Qué son los templates?</strong><br/>
                    Apps completas pre-configuradas con múltiples cápsulas combinadas.
                    Perfectas para comenzar rápido.
                  </p>
                </div>

                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedTemplate === template.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{template.name}</div>
                          <div className={`text-xs ${
                            selectedTemplate === template.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {template.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCompile}
                  disabled={isCompiling}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCompiling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Compilando...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Compilar App
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Area - Preview/Code */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'preview'
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'code'
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    Código
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {!result && !isCompiling && (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Listo para Compilar</h3>
                      <p className="text-gray-600 mb-6">
                        Selecciona un template y haz click en "Compilar App"
                      </p>
                    </div>
                  )}

                  {isCompiling && (
                    <div className="text-center py-20">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Compilando tu app...</h3>
                      <p className="text-gray-600">Esto tomará solo un momento</p>
                    </div>
                  )}

                  {result && !result.success && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-red-900 mb-1">Error de Compilación</h3>
                          <p className="text-red-700 text-sm">{result.error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result?.success && activeTab === 'preview' && (
                    <div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-green-900">{result.composition.name}</h4>
                          <p className="text-sm text-green-700">{result.composition.description}</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                        <iframe
                          srcDoc={result.result?.html}
                          className="w-full h-full"
                          sandbox="allow-scripts"
                          title="Preview"
                        />
                      </div>
                    </div>
                  )}

                  {result?.success && activeTab === 'code' && (
                    <div>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-auto" style={{ maxHeight: '600px' }}>
                        <pre className="text-sm text-gray-100">
                          <code>{result.result?.html}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Capsule Detail Modal */}
      {selectedCapsule && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCapsule(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCapsule.name}</h2>
                  <p className="text-sm text-gray-600">
                    {categoryInfo[selectedCapsule.category]?.icon} {categoryInfo[selectedCapsule.category]?.name || selectedCapsule.category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCapsule(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-700 mb-6">{selectedCapsule.description}</p>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Propiedades disponibles:</h3>
                <div className="space-y-3">
                  {selectedCapsule.props.map((prop, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start justify-between mb-1">
                        <code className="text-sm font-mono text-blue-600">{prop.name}</code>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {prop.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{prop.description}</p>
                      {prop.default !== undefined && (
                        <p className="text-xs text-gray-500">
                          Default: <code className="bg-gray-100 px-1 rounded">{JSON.stringify(prop.default)}</code>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

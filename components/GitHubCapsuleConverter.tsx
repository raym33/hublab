'use client'

import { useState } from 'react'
import { GitBranch, Download, Loader2, CheckCircle, XCircle, ExternalLink, Sparkles, Star, Code2 } from 'lucide-react'

interface ConversionResult {
  success: boolean
  capsule?: {
    id: string
    name: string
    category: string
    description: string
    code: string
    setupInstructions: string
    repoUrl: string
    stargazers: number
    dependencies: string[]
  }
  metadata?: {
    embedType: string
    detectedCategory: string
    language: string
    stars: number
  }
  error?: string
}

export default function GitHubCapsuleConverter({ onCapsuleCreated }: { onCapsuleCreated?: (capsule: any) => void }) {
  const [repoUrl, setRepoUrl] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [embedType, setEmbedType] = useState<string>('')
  const [category, setCategory] = useState<string>('')

  const handleConvert = async () => {
    if (!repoUrl.trim()) {
      setResult({
        success: false,
        error: 'Please enter a GitHub repository URL'
      })
      return
    }

    setIsConverting(true)
    setResult(null)

    try {
      const response = await fetch('/api/github-to-capsule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          ...(embedType && { embedType }),
          ...(category && { category })
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed')
      }

      setResult(data)

      // Notify parent component if callback provided
      if (data.success && data.capsule && onCapsuleCreated) {
        onCapsuleCreated(data.capsule)
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Failed to convert repository'
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownloadCode = () => {
    if (!result?.capsule) return

    const blob = new Blob([result.capsule.code], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${result.capsule.id}.tsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleCopyCode = async () => {
    if (!result?.capsule) return

    try {
      await navigator.clipboard.writeText(result.capsule.code)
      alert('Code copied to clipboard!')
    } catch (error) {
      alert('Failed to copy code')
    }
  }

  const exampleRepos = [
    'https://github.com/OpenCut-app/OpenCut',
    'https://github.com/shadcn-ui/ui',
    'https://github.com/recharts/recharts',
    'https://github.com/excalidraw/excalidraw'
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-3xl font-bold">GitHub to Capsule Converter</h2>
        </div>
        <p className="text-blue-100">
          Transform any GitHub repository into a HubLab capsule in seconds
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-2xl shadow-2xl border-2 border-gray-200 p-6">
        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            GitHub Repository URL
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
                placeholder="https://github.com/owner/repository"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                disabled={isConverting}
              />
            </div>
            <button
              onClick={handleConvert}
              disabled={isConverting || !repoUrl.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2 font-semibold"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Convert
                </>
              )}
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleRepos.map((url) => {
              const repoName = url.split('/').slice(-2).join('/')
              return (
                <button
                  key={url}
                  onClick={() => setRepoUrl(url)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                  disabled={isConverting}
                >
                  {repoName}
                </button>
              )
            })}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Embed Type (optional)
                  </label>
                  <select
                    value={embedType}
                    onChange={(e) => setEmbedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                    disabled={isConverting}
                  >
                    <option value="">Auto-detect</option>
                    <option value="iframe">IFrame (Web Apps)</option>
                    <option value="component">Component (React)</option>
                    <option value="npm-package">NPM Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (optional)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                    disabled={isConverting}
                  >
                    <option value="">Auto-detect</option>
                    <option value="Media">Media</option>
                    <option value="UI">UI</option>
                    <option value="DataViz">Data Visualization</option>
                    <option value="Form">Form</option>
                    <option value="AI">AI</option>
                    <option value="Animation">Animation</option>
                    <option value="Utility">Utility</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        {result && (
          <div className="mt-6">
            {result.success && result.capsule ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                {/* Success Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-green-900 mb-1">
                        {result.capsule.name}
                      </h3>
                      <p className="text-sm text-green-700">{result.capsule.description}</p>
                    </div>
                  </div>
                  <a
                    href={result.capsule.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-green-700 hover:text-green-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub
                  </a>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Category</p>
                    <p className="text-sm font-semibold text-gray-900">{result.capsule.category}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Embed Type</p>
                    <p className="text-sm font-semibold text-gray-900">{result.metadata?.embedType}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Language</p>
                    <p className="text-sm font-semibold text-gray-900">{result.metadata?.language}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">GitHub Stars</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {result.capsule.stargazers.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Dependencies */}
                {result.capsule.dependencies.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Dependencies ({result.capsule.dependencies.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {result.capsule.dependencies.slice(0, 8).map((dep) => (
                        <span key={dep} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-green-200">
                          {dep}
                        </span>
                      ))}
                      {result.capsule.dependencies.length > 8 && (
                        <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-green-200">
                          +{result.capsule.dependencies.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDownloadCode}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Code
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 border-2 border-green-600 rounded-lg hover:bg-green-50 transition font-medium"
                  >
                    <Code2 className="w-4 h-4" />
                    Copy Code
                  </button>
                  <a
                    href={`/studio-v2?capsule=${result.capsule.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 border-2 border-green-600 rounded-lg hover:bg-green-50 transition font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    Add to Canvas
                  </a>
                </div>

                {/* Code Preview */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-green-700 hover:text-green-800">
                    View Generated Code
                  </summary>
                  <div className="mt-2 p-4 bg-gray-900 rounded-lg overflow-x-auto">
                    <pre className="text-xs text-gray-100">
                      <code>{result.capsule.code.slice(0, 500)}...</code>
                    </pre>
                  </div>
                </details>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-1">Conversion Failed</h3>
                    <p className="text-sm text-red-700">{result.error}</p>
                    <div className="mt-3 text-xs text-red-600">
                      <p className="font-medium mb-1">Common issues:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Repository not found or private</li>
                        <li>Invalid GitHub URL format</li>
                        <li>GitHub API rate limit exceeded</li>
                        <li>Repository has no package.json</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Enter any public GitHub repository URL</li>
            <li>System analyzes the repo (metadata, dependencies, topics)</li>
            <li>Automatically generates production-ready React component</li>
            <li>Download or add directly to your Studio V2 canvas</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

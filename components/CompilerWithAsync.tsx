'use client'

import { useState } from 'react'
import { useAsyncCompiler } from '@/hooks/useAsyncCompiler'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface CompilerWithAsyncProps {
  onCompilationComplete?: (result: any) => void
}

export function CompilerWithAsync({ onCompilationComplete }: CompilerWithAsyncProps) {
  const [prompt, setPrompt] = useState('')
  const [platform, setPlatform] = useState('web')
  const [statusMessage, setStatusMessage] = useState('')

  const {
    startCompilation,
    cancelCompilation,
    isCompiling,
    result,
    error,
    progress,
    retryCount
  } = useAsyncCompiler({
    pollInterval: 2000,
    maxRetries: 30,
    onProgress: (status) => {
      setStatusMessage(status)
    },
    onComplete: (result) => {
      console.log('Compilation completed:', result)
      onCompilationComplete?.(result)
      setStatusMessage('✅ Compilation successful!')
    },
    onError: (error) => {
      console.error('Compilation error:', error)
      setStatusMessage(`❌ Error: ${error}`)
    }
  })

  const handleCompile = async () => {
    if (!prompt.trim()) {
      setStatusMessage('Please enter a prompt')
      return
    }

    await startCompilation({
      prompt,
      platform
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your app
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Create a todo app with dark mode and categories..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isCompiling}
          />
        </div>

        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isCompiling}
          >
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </div>

        <button
          onClick={handleCompile}
          disabled={isCompiling || !prompt.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isCompiling ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Compiling...
            </span>
          ) : (
            'Start Compilation'
          )}
        </button>

        {isCompiling && (
          <button
            onClick={cancelCompilation}
            className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Status Section */}
      {(statusMessage || progress) && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Status</h3>

          {/* Progress indicator */}
          {progress && (
            <div className="flex items-center gap-2 mb-2">
              {progress === 'pending' && (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-700">Pending...</span>
                </>
              )}
              {progress === 'processing' && (
                <>
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <span className="text-blue-700">Processing...</span>
                </>
              )}
              {progress === 'completed' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">Completed!</span>
                </>
              )}
              {progress === 'failed' && (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">Failed</span>
                </>
              )}
            </div>
          )}

          {/* Status message */}
          {statusMessage && (
            <p className="text-sm text-gray-600">{statusMessage}</p>
          )}

          {/* Retry counter */}
          {isCompiling && retryCount > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Checking status... (Attempt {retryCount}/30)
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Result Preview */}
      {result && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Compilation Result</h3>
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              ✅ Successfully compiled {result.stats?.capsulesProcessed || 0} capsules
            </p>
            <p className="text-sm text-green-700">
              📊 {result.stats?.linesOfCode || 0} lines of code generated
            </p>
            <p className="text-sm text-green-700">
              ⏱ Completed in {result.stats?.duration || 0}ms
            </p>
          </div>

          {/* Show compiled code preview */}
          {result.output && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-green-800 hover:text-green-600">
                View Generated Code
              </summary>
              <pre className="mt-2 p-3 bg-white rounded border border-green-300 text-xs overflow-x-auto">
                {JSON.stringify(result.output, null, 2).slice(0, 500)}...
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
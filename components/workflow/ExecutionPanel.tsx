/**
 * Execution Panel - Shows real-time workflow execution logs
 */

'use client'

import { ExecutionLog } from '@/lib/workflow-executor'
import { X, Play, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react'

interface ExecutionPanelProps {
  logs: ExecutionLog[]
  isExecuting: boolean
  onClose: () => void
  onClear: () => void
}

export function ExecutionPanel({ logs, isExecuting, onClose, onClear }: ExecutionPanelProps) {
  const getLogIcon = (type: ExecutionLog['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />
      case 'start':
        return <Play className="w-4 h-4 text-purple-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getLogColor = (type: ExecutionLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-700 bg-green-50'
      case 'error':
        return 'text-red-700 bg-red-50'
      case 'info':
        return 'text-blue-700 bg-blue-50'
      case 'start':
        return 'text-purple-700 bg-purple-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-2xl z-50 animate-in slide-in-from-bottom">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Play className="w-5 h-5 text-white" />
          <h3 className="text-white font-bold">Execution Logs</h3>
          {isExecuting && (
            <div className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Executing...
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-md text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-80 overflow-y-auto bg-gray-900 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No execution logs yet</p>
              <p className="text-xs mt-1">Click "Run Workflow" to start</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 px-3 py-2 rounded-md ${getLogColor(log.type)}`}
              >
                <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{log.nodeName}</span>
                    <span className="text-xs opacity-60">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{log.message}</p>
                  {log.data && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer hover:underline">
                        View data
                      </summary>
                      <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

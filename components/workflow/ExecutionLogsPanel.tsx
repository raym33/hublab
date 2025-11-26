'use client'

import { useState, useEffect, useRef } from 'react'
import {
  X,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Bug,
  Clock,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw
} from 'lucide-react'

interface ExecutionLog {
  id: string
  node_id: string
  node_label: string | null
  capsule_id: string | null
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  status: 'started' | 'completed' | 'failed' | 'skipped' | null
  duration_ms: number | null
  created_at: string
  sequence_number: number
  input_data?: Record<string, unknown> | null
  output_data?: Record<string, unknown> | null
  error_message?: string | null
}

interface Execution {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout'
  started_at: string | null
  completed_at: string | null
  duration_ms: number | null
  nodes_completed: number
  nodes_total: number
  error_message: string | null
  error_node_id: string | null
}

interface ExecutionLogsPanelProps {
  isOpen: boolean
  onClose: () => void
  execution: Execution | null
  logs: ExecutionLog[]
  isExecuting: boolean
  onRefresh?: () => void
  onNodeClick?: (nodeId: string) => void
}

const LOG_LEVEL_ICONS = {
  debug: <Bug className="w-3.5 h-3.5 text-gray-500" />,
  info: <Info className="w-3.5 h-3.5 text-blue-500" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  error: <XCircle className="w-3.5 h-3.5 text-red-500" />
}

const LOG_STATUS_ICONS = {
  started: <Play className="w-3.5 h-3.5 text-blue-500" />,
  completed: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  failed: <XCircle className="w-3.5 h-3.5 text-red-500" />,
  skipped: <AlertTriangle className="w-3.5 h-3.5 text-gray-400" />
}

const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-600',
  running: 'bg-blue-100 text-blue-600',
  completed: 'bg-green-100 text-green-600',
  failed: 'bg-red-100 text-red-600',
  cancelled: 'bg-amber-100 text-amber-600',
  timeout: 'bg-orange-100 text-orange-600'
}

export default function ExecutionLogsPanel({
  isOpen,
  onClose,
  execution,
  logs,
  isExecuting,
  onRefresh,
  onNodeClick
}: ExecutionLogsPanelProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isExecuting && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs.length, isExecuting])

  const toggleLogExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const filteredLogs = logs.filter(log => {
    if (filterLevel === 'all') return true
    return log.level === filterLevel
  })

  const formatDuration = (ms: number | null) => {
    if (ms === null) return '-'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const base = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    const ms = date.getMilliseconds().toString().padStart(3, '0')
    return `${base}.${ms}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="h-14 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Logs de Ejecución</h3>
            {execution && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[execution.status]}`}>
                {execution.status.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && !isExecuting && (
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Refrescar logs"
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Execution Summary */}
      {execution && (
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-lg font-bold text-gray-900">
                {execution.nodes_completed}/{execution.nodes_total}
              </div>
              <div className="text-[10px] text-gray-500">Nodos</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-lg font-bold text-gray-900">
                {formatDuration(execution.duration_ms)}
              </div>
              <div className="text-[10px] text-gray-500">Duración</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-lg font-bold text-gray-900">
                {logs.filter(l => l.level === 'error').length}
              </div>
              <div className="text-[10px] text-gray-500">Errores</div>
            </div>
          </div>

          {execution.error_message && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-xs font-medium text-red-800 mb-1">Error:</div>
              <div className="text-xs text-red-600">{execution.error_message}</div>
            </div>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-2 border-b border-gray-200 flex items-center gap-2">
        <span className="text-xs text-gray-500">Filtrar:</span>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="text-xs px-2 py-1 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Todos</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">
          {filteredLogs.length} logs
        </span>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto">
        {isExecuting && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm">Iniciando ejecución...</span>
          </div>
        )}

        {!isExecuting && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm">No hay logs disponibles</span>
            <span className="text-xs mt-1">Ejecuta el workflow para ver logs</span>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {filteredLogs.map((log, index) => (
            <div
              key={log.id || index}
              className={`p-2 hover:bg-gray-50 transition-colors ${
                log.level === 'error' ? 'bg-red-50/50' :
                log.level === 'warn' ? 'bg-amber-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                {/* Expand/Collapse */}
                <button
                  onClick={() => toggleLogExpanded(log.id || String(index))}
                  className="p-0.5 hover:bg-gray-200 rounded transition-colors mt-0.5"
                >
                  {expandedLogs.has(log.id || String(index)) ? (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </button>

                {/* Status/Level Icon */}
                <div className="mt-0.5">
                  {log.status ? LOG_STATUS_ICONS[log.status] : LOG_LEVEL_ICONS[log.level]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {log.node_label && (
                      <button
                        onClick={() => onNodeClick?.(log.node_id)}
                        className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium hover:bg-purple-200 transition-colors truncate max-w-[120px]"
                        title={log.node_label}
                      >
                        {log.node_label}
                      </button>
                    )}
                    <span className="text-[10px] text-gray-400">
                      {formatTime(log.created_at)}
                    </span>
                    {log.duration_ms !== null && (
                      <span className="text-[10px] text-gray-400">
                        ({formatDuration(log.duration_ms)})
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 break-words">
                    {log.message}
                  </p>

                  {/* Expanded Details */}
                  {expandedLogs.has(log.id || String(index)) && (
                    <div className="mt-2 space-y-2">
                      {log.input_data && Object.keys(log.input_data).length > 0 && (
                        <div className="text-[10px]">
                          <div className="font-medium text-gray-500 mb-1">Input:</div>
                          <pre className="bg-gray-100 p-1.5 rounded text-gray-600 overflow-x-auto max-h-24 overflow-y-auto">
                            {JSON.stringify(log.input_data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.output_data && Object.keys(log.output_data).length > 0 && (
                        <div className="text-[10px]">
                          <div className="font-medium text-gray-500 mb-1">Output:</div>
                          <pre className="bg-green-50 p-1.5 rounded text-gray-600 overflow-x-auto max-h-24 overflow-y-auto">
                            {JSON.stringify(log.output_data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.error_message && (
                        <div className="text-[10px]">
                          <div className="font-medium text-red-500 mb-1">Error:</div>
                          <pre className="bg-red-50 p-1.5 rounded text-red-600 overflow-x-auto">
                            {log.error_message}
                          </pre>
                        </div>
                      )}

                      {log.capsule_id && (
                        <div className="text-[10px] text-gray-400">
                          Capsule: <span className="font-mono">{log.capsule_id}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Auto-scroll anchor */}
        <div ref={logsEndRef} />

        {/* Loading indicator for running execution */}
        {isExecuting && logs.length > 0 && (
          <div className="p-3 flex items-center justify-center gap-2 text-blue-600 bg-blue-50">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">Ejecutando...</span>
          </div>
        )}
      </div>
    </div>
  )
}

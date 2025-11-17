/**
 * Saved Workflows Panel - Manage saved workflows
 */

'use client'

import { SavedWorkflow } from '@/hooks/useWorkflowPersistence'
import { X, Folder, Trash2, Copy, Download, Calendar, Clock } from 'lucide-react'

interface SavedWorkflowsPanelProps {
  workflows: SavedWorkflow[]
  onLoad: (workflow: SavedWorkflow) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onExport: (id: string) => void
  onClose: () => void
}

export function SavedWorkflowsPanel({
  workflows,
  onLoad,
  onDelete,
  onDuplicate,
  onExport,
  onClose
}: SavedWorkflowsPanelProps) {
  return (
    <div className="absolute top-20 left-4 z-30 w-96 animate-in slide-in-from-left-4">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-purple-200 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-t-xl flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Saved Workflows ({workflows.length})
          </h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {workflows.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 mb-2">No saved workflows yet</p>
              <p className="text-xs text-gray-500">
                Create a workflow and click "Save" to store it
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900 mb-1">
                        {workflow.name}
                      </h4>
                      {workflow.description && (
                        <p className="text-xs text-gray-600 mb-2">
                          {workflow.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          {workflow.nodes.length} nodes
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                          {workflow.connections.length} connections
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(workflow.updatedAt).toLocaleDateString()}
                        <Clock className="w-3 h-3 ml-1" />
                        {new Date(workflow.updatedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onLoad(workflow)}
                      className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs font-medium"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => onDuplicate(workflow.id)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onExport(workflow.id)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      title="Export"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${workflow.name}"?`)) {
                          onDelete(workflow.id)
                        }
                      }}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Global Variables Panel - Manage global workflow variables
 */

'use client'

import { useState } from 'react'
import { X, Plus, Variable, Trash2 } from 'lucide-react'

interface GlobalVariablesPanelProps {
  variables: Record<string, string>
  onChange: (variables: Record<string, string>) => void
  onClose: () => void
}

export function GlobalVariablesPanel({ variables, onChange, onClose }: GlobalVariablesPanelProps) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const handleAdd = () => {
    if (!newKey.trim()) return
    onChange({ ...variables, [newKey]: newValue })
    setNewKey('')
    setNewValue('')
  }

  const handleDelete = (key: string) => {
    const updated = { ...variables }
    delete updated[key]
    onChange(updated)
  }

  const handleUpdate = (key: string, value: string) => {
    onChange({ ...variables, [key]: value })
  }

  return (
    <div className="absolute top-20 right-4 z-30 w-96 animate-in slide-in-from-right-4">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 rounded-t-xl flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Variable className="w-5 h-5" />
            Global Variables
          </h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Add new variable */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">Add New Variable</h4>
            <div className="space-y-2">
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Variable name (e.g., API_KEY)"
                className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              />
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Variable value"
                className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button
                onClick={handleAdd}
                disabled={!newKey.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Variable
              </button>
            </div>
          </div>

          {/* Existing variables */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Current Variables ({Object.keys(variables).length})
            </h4>

            {Object.keys(variables).length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Variable className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No variables defined</p>
                <p className="text-xs mt-1">Add variables to use in your workflow</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {key}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Delete variable "${key}"?`)) {
                            handleDelete(key)
                          }
                        }}
                        className="p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleUpdate(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 leading-relaxed">
              💡 <strong>Tip:</strong> Use variables in nodes with the syntax{' '}
              <code className="bg-amber-100 px-1 rounded">{'${VARIABLE_NAME}'}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

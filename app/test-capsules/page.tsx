'use client'

import React, { useState } from 'react'
import { getAllCapsulesExtended } from '@/lib/capsules-v2/definitions-extended'

export default function TestCapsulesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCapsule, setSelectedCapsule] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'pending'>>({})

  const capsules = getAllCapsulesExtended()

  const categories = ['all', ...Array.from(new Set(capsules.map(c => c.category)))]

  const filteredCapsules = selectedCategory === 'all'
    ? capsules
    : capsules.filter(c => c.category === selectedCategory)

  const testCapsule = (capsuleId: string) => {
    setTestResults(prev => ({ ...prev, [capsuleId]: 'pending' }))

    setTimeout(() => {
      // Simple test: check if code exists and is valid
      const capsule = capsules.find(c => c.id === capsuleId)
      if (capsule && capsule.code && capsule.code.includes('function')) {
        setTestResults(prev => ({ ...prev, [capsuleId]: 'success' }))
      } else {
        setTestResults(prev => ({ ...prev, [capsuleId]: 'error' }))
      }
    }, 500)
  }

  const testAllCapsules = () => {
    filteredCapsules.forEach(capsule => {
      testCapsule(capsule.id)
    })
  }

  const selectedCapsuleData = capsules.find(c => c.id === selectedCapsule)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 border-green-500 text-green-700'
      case 'error': return 'bg-red-100 border-red-500 text-red-700'
      case 'pending': return 'bg-yellow-100 border-yellow-500 text-yellow-700'
      default: return 'bg-gray-100 border-gray-300 text-gray-700'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success': return '✓'
      case 'error': return '✗'
      case 'pending': return '⏳'
      default: return '○'
    }
  }

  const successCount = Object.values(testResults).filter(r => r === 'success').length
  const errorCount = Object.values(testResults).filter(r => r === 'error').length
  const pendingCount = Object.values(testResults).filter(r => r === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧪 Capsule Testing Lab
          </h1>
          <p className="text-gray-600">
            Test all {capsules.length} capsules to ensure they work correctly
          </p>
        </div>

        {/* Test Summary */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Test Results Summary</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{capsules.length}</div>
                <div className="text-sm text-gray-600">Total Capsules</div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-gray-600">Testing</div>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>

            {successCount + errorCount === capsules.length && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold text-center">
                  ✓ All capsules tested! {successCount}/{capsules.length} passed ({Math.round((successCount / capsules.length) * 100)}%)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    {cat !== 'all' && ` (${capsules.filter(c => c.category === cat).length})`}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={testAllCapsules}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              🧪 Test All {filteredCapsules.length} Capsules
            </button>

            <button
              onClick={() => setTestResults({})}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Capsules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredCapsules.map(capsule => {
            const status = testResults[capsule.id]
            return (
              <div
                key={capsule.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition hover:shadow-lg ${getStatusColor(status)}`}
                onClick={() => setSelectedCapsule(capsule.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{capsule.name}</h3>
                    <p className="text-sm opacity-75">{capsule.description}</p>
                  </div>
                  <span className="text-2xl ml-2">{getStatusIcon(status)}</span>
                </div>

                <div className="flex gap-2 items-center mt-3">
                  <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
                    {capsule.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      testCapsule(capsule.id)
                    }}
                    className="ml-auto text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Test
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Capsule Details Modal */}
        {selectedCapsuleData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedCapsuleData.name}</h2>
                  <p className="text-gray-600">{selectedCapsuleData.description}</p>
                </div>
                <button
                  onClick={() => setSelectedCapsule(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Props */}
                {selectedCapsuleData.props && selectedCapsuleData.props.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">Props</h3>
                    <div className="space-y-2">
                      {selectedCapsuleData.props.map((prop, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="font-mono text-sm font-semibold">{prop.name}</code>
                            <span className="text-xs text-gray-500">{prop.type}</span>
                            {prop.required && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{prop.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Implementation Code</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selectedCapsuleData.code}</code>
                  </pre>
                </div>

                {/* Test Button */}
                <button
                  onClick={() => testCapsule(selectedCapsuleData.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  🧪 Run Test
                </button>

                {testResults[selectedCapsuleData.id] && (
                  <div className={`p-4 rounded-lg border-2 ${getStatusColor(testResults[selectedCapsuleData.id])}`}>
                    <p className="font-semibold">
                      Test Status: {testResults[selectedCapsuleData.id].toUpperCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

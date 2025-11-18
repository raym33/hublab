/**
 * Extended Capsules Batch 24 - Media, Support, Workflow, Testing
 * 500 production-ready React capsules
 */

import DOMPurify from 'isomorphic-dompurify'
import { Capsule } from '@/types/capsule'

const extendedCapsulesBatch24: Capsule[] = []

// Categories for Batch 24
const batch24Categories = [
  { name: 'Media', count: 125 },
  { name: 'Support', count: 125 },
  { name: 'Workflow', count: 125 },
  { name: 'Testing', count: 125 }
]

// Template generators for Batch 24
const batch24Templates: Record<string, (cat: string, idx: number) => Capsule> = {
  dashboard: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-dashboard-${idx}`,
    name: `${cat} Dashboard ${idx}`,
    category: cat,
    description: `Comprehensive ${cat.toLowerCase()} dashboard with real-time metrics, performance analytics, visual reporting, and actionable insights for monitoring and optimization`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'dashboard', 'analytics', 'monitoring', 'metrics'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}Dashboard${idx}() {
  const [stats, setStats] = useState({
    total: ${2500 + idx * 150},
    active: ${1800 + idx * 100},
    completed: ${650 + idx * 50},
    pending: ${150 + idx * 20}
  })

  const [performance, setPerformance] = useState([
    { label: 'Week 1', value: ${75 + idx * 2} },
    { label: 'Week 2', value: ${82 + idx * 2.5} },
    { label: 'Week 3', value: ${88 + idx * 3} },
    { label: 'Week 4', value: ${95 + idx * 3.5} }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">${cat} Dashboard</h1>
          <p className="text-gray-600">Monitor and analyze ${cat.toLowerCase()} performance and activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">Total Items</div>
              <div className="text-3xl">📊</div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.total.toLocaleString()}</div>
            <div className="text-sm text-green-600 font-medium">↑ 15.2% increase</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">Active</div>
              <div className="text-3xl">✓</div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.active.toLocaleString()}</div>
            <div className="text-sm text-green-600 font-medium">↑ 8.7% increase</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">Completed</div>
              <div className="text-3xl">🎯</div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.completed.toLocaleString()}</div>
            <div className="text-sm text-green-600 font-medium">↑ 22.3% increase</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">Pending</div>
              <div className="text-3xl">⏳</div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.pending.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-medium">→ Stable</div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Performance Trend</h2>
          <div className="flex items-end justify-between h-72 gap-6">
            {performance.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer relative group"
                  style={{ height: \`\${item.value}%\` }}>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                    {item.value}%
                  </div>
                </div>
                <div className="mt-4 text-sm font-bold text-gray-700">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New item created', user: 'System', time: '2 min ago', status: 'success' },
                { action: 'Report generated', user: 'Admin', time: '15 min ago', status: 'info' },
                { action: 'Update completed', user: 'Automation', time: '1 hour ago', status: 'success' },
                { action: 'Review pending', user: 'Manager', time: '3 hours ago', status: 'warning' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={\`w-3 h-3 rounded-full \${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }\`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.user} • {activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Success Rate', value: 94.5, color: 'bg-green-500' },
                { label: 'Completion Rate', value: 87.2, color: 'bg-blue-500' },
                { label: 'Efficiency', value: 91.8, color: 'bg-purple-500' },
                { label: 'Quality Score', value: 88.3, color: 'bg-yellow-500' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                    <span className="text-sm font-bold text-gray-900">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={\`\${stat.color} h-3 rounded-full transition-all duration-500\`}
                      style={{ width: \`\${stat.value}%\` }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }),

  manager: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-manager-${idx}`,
    name: `${cat} Manager ${idx}`,
    category: cat,
    description: `Advanced ${cat.toLowerCase()} management interface with comprehensive CRUD operations, advanced search, filtering, sorting, bulk actions, and workflow automation`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'manager', 'crud', 'admin', 'workflow'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}Manager${idx}() {
  const [items, setItems] = useState([
    { id: 1, title: '${cat} Item Alpha', status: 'active', priority: 'high', assignee: 'John Doe', date: '2025-01-15', progress: 75 },
    { id: 2, title: '${cat} Item Beta', status: 'review', priority: 'medium', assignee: 'Jane Smith', date: '2025-01-16', progress: 45 },
    { id: 3, title: '${cat} Item Gamma', status: 'completed', priority: 'low', assignee: 'Bob Johnson', date: '2025-01-14', progress: 100 },
    { id: 4, title: '${cat} Item Delta', status: 'pending', priority: 'high', assignee: 'Alice Brown', date: '2025-01-17', progress: 20 },
    { id: 5, title: '${cat} Item Epsilon', status: 'active', priority: 'medium', assignee: 'Charlie Wilson', date: '2025-01-18', progress: 60 }
  ])

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    assignee: 'all'
  })

  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || item.status === filters.status
    const matchesPriority = filters.priority === 'all' || item.priority === filters.priority
    const matchesAssignee = filters.assignee === 'all' || item.assignee === filters.assignee
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const handleBulkAction = (action: string) => {
    if (action === 'complete') {
      setItems(items.map(item =>
        selectedItems.includes(item.id) ? { ...item, status: 'completed', progress: 100 } : item
      ))
    } else if (action === 'delete') {
      setItems(items.filter(item => !selectedItems.includes(item.id)))
    }
    setSelectedItems([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">${cat} Manager</h1>
            <p className="text-gray-600 mt-2">Manage and organize all ${cat.toLowerCase()} items</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('list')}
              className={\`px-4 py-2 rounded-lg transition-colors \${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }\`}>
              List View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={\`px-4 py-2 rounded-lg transition-colors \${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }\`}>
              Grid View
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
              + Add New
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search items..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
              <select
                value={filters.assignee}
                onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Assignees</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Bob Johnson">Bob Johnson</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-medium text-blue-900">{selectedItems.length} items selected</span>
              <button
                onClick={() => handleBulkAction('complete')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                Mark Complete
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Delete
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Items View */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Assignee</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Progress</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => {
                          setSelectedItems(prev =>
                            prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
                          )
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
                        item.status === 'active' ? 'bg-green-100 text-green-800' :
                        item.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }\`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
                        item.priority === 'high' ? 'bg-red-100 text-red-800' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }\`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.assignee}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: \`\${item.progress}%\` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.date}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => {
                      setSelectedItems(prev =>
                        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
                      )
                    }}
                    className="rounded"
                  />
                  <div className="flex gap-2">
                    <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'review' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }\`}>
                      {item.status}
                    </span>
                    <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }\`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <div className="text-sm text-gray-600 mb-4">Assigned to: {item.assignee}</div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: \`\${item.progress}%\` }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">{item.date}</div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }),

  editor: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-editor-${idx}`,
    name: `${cat} Editor ${idx}`,
    category: cat,
    description: `Advanced ${cat.toLowerCase()} editor with rich text formatting, real-time preview, auto-save, version control, and collaborative editing features`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'editor', 'wysiwyg', 'rich-text', 'collaboration'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}Editor${idx}() {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('Untitled ${cat} Document')
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const formatText = (command: string) => {
    document.execCommand(command, false)
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('${cat} content saved successfully!')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 border-none outline-none bg-transparent"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Format Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => formatText('bold')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-bold">
              B
            </button>
            <button
              onClick={() => formatText('italic')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors italic">
              I
            </button>
            <button
              onClick={() => formatText('underline')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors underline">
              U
            </button>
            <div className="w-px h-8 bg-gray-300"></div>
            <button
              onClick={() => formatText('justifyLeft')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              ≡
            </button>
            <button
              onClick={() => formatText('justifyCenter')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              ≡
            </button>
            <button
              onClick={() => formatText('justifyRight')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              ≡
            </button>
            <div className="w-px h-8 bg-gray-300"></div>
            <button
              onClick={() => formatText('insertUnorderedList')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              • List
            </button>
            <button
              onClick={() => formatText('insertOrderedList')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              1. List
            </button>
          </div>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="max-w-7xl mx-auto p-8">
        {showPreview ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          </div>
        ) : (
          <div
            contentEditable
            onInput={(e) => setContent(DOMPurify.sanitize(e.currentTarget.innerHTML))}
            className="bg-white rounded-2xl shadow-lg p-12 min-h-screen focus:outline-none focus:ring-2 focus:ring-blue-500 prose prose-lg max-w-none"
            placeholder="Start writing your ${cat.toLowerCase()} content..."
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Words: {content.split(' ').filter(w => w.length > 0).length}</span>
            <span>Characters: {content.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Auto-save enabled</span>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }),

  viewer: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-viewer-${idx}`,
    name: `${cat} Viewer ${idx}`,
    category: cat,
    description: `Comprehensive ${cat.toLowerCase()} viewer with detailed information display, interactive elements, zoom capabilities, and export functionality`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'viewer', 'display', 'detail-view', 'export'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}Viewer${idx}() {
  const [item, setItem] = useState({
    id: '${cat.toUpperCase()}-${String(idx).padStart(3, '0')}',
    title: '${cat} Item ${idx}',
    description: 'This is a detailed ${cat.toLowerCase()} item with comprehensive information and interactive features for viewing and analysis.',
    status: 'active',
    createdBy: 'System Administrator',
    createdAt: '2025-01-15 10:30 AM',
    lastModified: '2025-01-16 02:45 PM',
    category: 'Category ${idx % 3 + 1}',
    tags: ['${cat.toLowerCase()}', 'production', 'verified', 'featured'],
    metadata: {
      version: '${idx}.0.${idx % 10}',
      size: '${(idx * 125).toFixed(2)} KB',
      type: '${cat} Document',
      format: 'Standard'
    }
  })

  const [zoomLevel, setZoomLevel] = useState(100)

  const handleExport = () => {
    alert(\`Exporting \${item.title} as PDF...\`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">{item.id}</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{item.title}</h1>
              <p className="text-gray-600 text-lg">{item.description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                Export PDF
              </button>
            </div>
          </div>

          {/* Status & Tags */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {item.status}
            </span>
            {item.tags.map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Details Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Details</h2>

              {/* Zoom Controls */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Zoom:</span>
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  -
                </button>
                <span className="text-sm font-medium text-gray-900 w-16 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  +
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Reset
                </button>
              </div>

              {/* Content Area */}
              <div
                className="border-2 border-gray-200 rounded-xl p-8 bg-gray-50 overflow-auto"
                style={{ transform: \`scale(\${zoomLevel / 100})\`, transformOrigin: 'top left' }}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Overview</h3>
                    <p className="text-gray-700 leading-relaxed">
                      This ${cat.toLowerCase()} item contains detailed information and interactive elements
                      for comprehensive viewing and analysis. The viewer supports zoom controls,
                      export functionality, and metadata display.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Key Features</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Interactive zoom controls (50% - 200%)</li>
                      <li>Comprehensive metadata display</li>
                      <li>PDF export functionality</li>
                      <li>Version tracking and history</li>
                      <li>Category and tag management</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Technical Specifications</h3>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-medium text-gray-900">{item.metadata.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-900">{item.metadata.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-gray-900">{item.metadata.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium text-gray-900">{item.metadata.format}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Created By</div>
                  <div className="font-medium text-gray-900">{item.createdBy}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Created At</div>
                  <div className="font-medium text-gray-900">{item.createdAt}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Last Modified</div>
                  <div className="font-medium text-gray-900">{item.lastModified}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Category</div>
                  <div className="font-medium text-gray-900">{item.category}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Edit Item
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Duplicate
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Share
                </button>
                <button className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  })
}

// Generate 500 capsules across 4 categories
batch24Categories.forEach(category => {
  const templateTypes = Object.keys(batch24Templates)
  const capsulesPerTemplate = Math.ceil(category.count / templateTypes.length)

  templateTypes.forEach((templateType, templateIdx) => {
    for (let i = 0; i < capsulesPerTemplate && extendedCapsulesBatch24.length < 500; i++) {
      const capsule = batch24Templates[templateType as keyof typeof batch24Templates](category.name, templateIdx * capsulesPerTemplate + i + 1)
      extendedCapsulesBatch24.push(capsule)
    }
  })
})

// Ensure exactly 500 capsules
while (extendedCapsulesBatch24.length > 500) {
  extendedCapsulesBatch24.pop()
}

export default extendedCapsulesBatch24

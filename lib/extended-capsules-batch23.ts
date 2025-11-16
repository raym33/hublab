/**
 * Extended Capsules Batch 23 - HR, Insurance, Agriculture, Energy
 * 500 production-ready React capsules
 */

import { Capsule } from '@/types/capsule'

const extendedCapsulesBatch23: Capsule[] = []

// Categories for Batch 23
const batch23Categories = [
  { name: 'HR', count: 125 },
  { name: 'Insurance', count: 125 },
  { name: 'Agriculture', count: 125 },
  { name: 'Energy', count: 125 }
]

// Template generators for Batch 23
const batch23Templates: Record<string, (cat: string, idx: number) => Capsule> = {
  dashboard: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-dashboard-${idx}`,
    name: `${cat} Analytics Dashboard ${idx}`,
    category: cat,
    description: `Comprehensive ${cat.toLowerCase()} analytics dashboard with KPIs, metrics tracking, trend analysis, real-time updates, and actionable insights for strategic decisions`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'dashboard', 'analytics', 'kpi', 'reporting'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}AnalyticsDashboard${idx}() {
  const [metrics, setMetrics] = useState({
    total: ${5000 + idx * 200},
    active: ${4200 + idx * 150},
    growth: ${12 + idx * 2}.5,
    efficiency: ${85 + idx * 3}
  })

  const [chartData, setChartData] = useState([
    { month: 'Jan', value: ${120 + idx * 10}, target: ${150 + idx * 12} },
    { month: 'Feb', value: ${135 + idx * 11}, target: ${150 + idx * 12} },
    { month: 'Mar', value: ${148 + idx * 12}, target: ${150 + idx * 12} },
    { month: 'Apr', value: ${162 + idx * 13}, target: ${175 + idx * 14} },
    { month: 'May', value: ${178 + idx * 14}, target: ${175 + idx * 14} },
    { month: 'Jun', value: ${195 + idx * 15}, target: ${200 + idx * 16} }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">${cat} Analytics</h1>
          <p className="text-gray-600">Real-time ${cat.toLowerCase()} performance insights and metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-blue-100 text-sm mb-2">Total ${cat} Count</div>
            <div className="text-4xl font-bold mb-2">{metrics.total.toLocaleString()}</div>
            <div className="flex items-center text-blue-100 text-sm">
              <span className="mr-2">↑</span>
              <span>{metrics.growth}% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-green-100 text-sm mb-2">Active Items</div>
            <div className="text-4xl font-bold mb-2">{metrics.active.toLocaleString()}</div>
            <div className="flex items-center text-green-100 text-sm">
              <span className="mr-2">↑</span>
              <span>8.2% increase</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-purple-100 text-sm mb-2">Efficiency Rate</div>
            <div className="text-4xl font-bold mb-2">{metrics.efficiency}%</div>
            <div className="flex items-center text-purple-100 text-sm">
              <span className="mr-2">↑</span>
              <span>5.1% improvement</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-orange-100 text-sm mb-2">Growth Rate</div>
            <div className="text-4xl font-bold mb-2">{metrics.growth}%</div>
            <div className="flex items-center text-orange-100 text-sm">
              <span className="mr-2">→</span>
              <span>Steady growth</span>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6-Month Performance Trend</h2>
          <div className="flex items-end justify-between h-80 gap-4">
            {chartData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full relative" style={{ height: '100%' }}>
                  {/* Target line */}
                  <div className="absolute w-full border-t-2 border-dashed border-gray-300"
                    style={{ bottom: \`\${(item.target / Math.max(...chartData.map(d => d.target))) * 100}%\` }}>
                  </div>
                  {/* Actual bar */}
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer group"
                    style={{ height: \`\${(item.value / Math.max(...chartData.map(d => d.target))) * 100}%\` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap transition-opacity">
                      {item.value}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm font-medium text-gray-700">{item.month}</div>
                <div className="text-xs text-gray-500">Target: {item.target}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Category Distribution</h3>
            <div className="space-y-3">
              {[
                { name: 'Category A', value: 45, color: 'bg-blue-500' },
                { name: 'Category B', value: 30, color: 'bg-green-500' },
                { name: 'Category C', value: 15, color: 'bg-yellow-500' },
                { name: 'Category D', value: 10, color: 'bg-red-500' }
              ].map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <span className="text-sm font-bold text-gray-900">{cat.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={\`\${cat.color} h-3 rounded-full transition-all duration-500\`}
                      style={{ width: \`\${cat.value}%\` }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New entry added', time: '5 min ago', type: 'success' },
                { action: 'Report generated', time: '15 min ago', type: 'info' },
                { action: 'Data updated', time: '1 hour ago', type: 'warning' },
                { action: 'Review completed', time: '2 hours ago', type: 'success' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={\`w-2 h-2 rounded-full \${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }\`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
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
    name: `${cat} Management System ${idx}`,
    category: cat,
    description: `Advanced ${cat.toLowerCase()} management system with comprehensive CRUD operations, advanced filtering, bulk actions, data import/export, and workflow automation`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'manager', 'crud', 'workflow', 'automation'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}ManagementSystem${idx}() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item Alpha-${idx}', status: 'active', category: 'Type A', priority: 'high', date: '2025-01-15', value: ${1000 + idx * 100} },
    { id: 2, name: 'Item Beta-${idx}', status: 'pending', category: 'Type B', priority: 'medium', date: '2025-01-16', value: ${850 + idx * 80} },
    { id: 3, name: 'Item Gamma-${idx}', status: 'completed', category: 'Type A', priority: 'low', date: '2025-01-14', value: ${650 + idx * 60} },
    { id: 4, name: 'Item Delta-${idx}', status: 'active', category: 'Type C', priority: 'high', date: '2025-01-17', value: ${1200 + idx * 120} },
    { id: 5, name: 'Item Epsilon-${idx}', status: 'review', category: 'Type B', priority: 'medium', date: '2025-01-18', value: ${900 + idx * 90} }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [sortField, setSortField] = useState<string>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      const aVal = a[sortField as keyof typeof a]
      const bVal = b[sortField as keyof typeof b]
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleBulkAction = (action: string) => {
    if (action === 'delete') {
      setItems(items.filter(item => !selectedItems.includes(item.id)))
      setSelectedItems([])
    } else if (action === 'activate') {
      setItems(items.map(item =>
        selectedItems.includes(item.id) ? { ...item, status: 'active' } : item
      ))
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">${cat} Management</h1>
            <p className="text-gray-600 mt-2">Comprehensive ${cat.toLowerCase()} administration and control</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
            + Add New Item
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Categories</option>
                <option value="Type A">Type A</option>
                <option value="Type B">Type B</option>
                <option value="Type C">Type C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="value">Value</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-medium text-blue-900">{selectedItems.length} selected</span>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Delete
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
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
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'review' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }\`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }\`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">\${item.value.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                      <button className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <div>Showing {filteredItems.length} of {items.length} items</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Previous</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }),

  monitor: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-monitor-${idx}`,
    name: `${cat} Monitor ${idx}`,
    category: cat,
    description: `Real-time ${cat.toLowerCase()} monitoring system with live alerts, performance metrics, threshold tracking, and automated notifications for proactive management`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'monitor', 'real-time', 'alerts', 'notifications'],
    code: `'use client'

import { useState, useEffect } from 'react'

export default function ${cat.replace(/\s+/g, '')}Monitor${idx}() {
  const [metrics, setMetrics] = useState({
    temperature: ${20 + idx * 2},
    pressure: ${100 + idx * 10},
    efficiency: ${92 + idx},
    output: ${500 + idx * 50}
  })

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'High temperature detected in Zone ${idx}', time: '2 min ago', active: true },
    { id: 2, type: 'info', message: 'Routine maintenance scheduled', time: '15 min ago', active: false },
    { id: 3, type: 'success', message: 'System optimization completed', time: '1 hour ago', active: false }
  ])

  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        temperature: Math.max(0, Math.min(100, prev.temperature + (Math.random() - 0.5) * 5)),
        pressure: Math.max(0, Math.min(200, prev.pressure + (Math.random() - 0.5) * 10)),
        efficiency: Math.max(0, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 2)),
        output: Math.max(0, prev.output + (Math.random() - 0.5) * 50)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">${cat} Monitoring System</h1>
            <p className="text-gray-400">Real-time ${cat.toLowerCase()} performance tracking and alerts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={\`px-4 py-2 rounded-full font-medium \${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}\`}>
              <span className={\`inline-block w-2 h-2 rounded-full mr-2 \${isOnline ? 'bg-green-400' : 'bg-red-400'}\`}></span>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Temperature</div>
            <div className="text-4xl font-bold mb-2">{metrics.temperature.toFixed(1)}°C</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div
                className={\`h-2 rounded-full transition-all duration-500 \${
                  metrics.temperature > 70 ? 'bg-red-500' :
                  metrics.temperature > 50 ? 'bg-yellow-500' :
                  'bg-green-500'
                }\`}
                style={{ width: \`\${metrics.temperature}%\` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Pressure</div>
            <div className="text-4xl font-bold mb-2">{metrics.pressure.toFixed(0)} PSI</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: \`\${(metrics.pressure / 200) * 100}%\` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Efficiency</div>
            <div className="text-4xl font-bold mb-2">{metrics.efficiency.toFixed(1)}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: \`\${metrics.efficiency}%\` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Output</div>
            <div className="text-4xl font-bold mb-2">{metrics.output.toFixed(0)}</div>
            <div className="text-green-400 text-sm mt-2">↑ 12.5% from baseline</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Active Alerts</h2>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={\`p-4 rounded-xl border \${
                      alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                      alert.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                      'bg-blue-500/10 border-blue-500/30'
                    }\`}>
                    <div className="flex items-start gap-3">
                      <div className={\`text-2xl \${
                        alert.type === 'warning' ? 'text-yellow-400' :
                        alert.type === 'success' ? 'text-green-400' :
                        'text-blue-400'
                      }\`}>
                        {alert.type === 'warning' ? '⚠️' : alert.type === 'success' ? '✓' : 'ℹ️'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{alert.message}</div>
                        <div className="text-xs text-gray-400">{alert.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Graph */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Real-Time Performance</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg relative group cursor-pointer"
                    style={{ height: \`\${20 + Math.random() * 80}%\` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg group-hover:from-blue-600 group-hover:to-blue-500 transition-all"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }),

  calculator: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-calculator-${idx}`,
    name: `${cat} Calculator ${idx}`,
    category: cat,
    description: `Interactive ${cat.toLowerCase()} calculator and estimator with custom formulas, real-time calculations, scenario modeling, and detailed breakdown reports`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'calculator', 'estimator', 'formulas', 'analysis'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}Calculator${idx}() {
  const [inputs, setInputs] = useState({
    baseValue: ${1000 + idx * 100},
    rate: ${5 + idx * 0.5},
    duration: ${12 + idx},
    multiplier: ${1 + idx * 0.1}
  })

  const [results, setResults] = useState({
    total: 0,
    monthly: 0,
    breakdown: [] as { label: string; value: number }[]
  })

  const calculate = () => {
    const total = inputs.baseValue * (1 + inputs.rate / 100) * inputs.duration * inputs.multiplier
    const monthly = total / inputs.duration
    const breakdown = [
      { label: 'Base Amount', value: inputs.baseValue },
      { label: 'Rate Applied', value: inputs.baseValue * (inputs.rate / 100) },
      { label: 'Duration Factor', value: inputs.baseValue * inputs.duration },
      { label: 'Multiplier Effect', value: inputs.baseValue * (inputs.multiplier - 1) },
      { label: 'Total', value: total }
    ]

    setResults({ total, monthly, breakdown })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">${cat} Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate and estimate ${cat.toLowerCase()} values with precision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Input Parameters</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Value (\$)
                </label>
                <input
                  type="number"
                  value={inputs.baseValue}
                  onChange={(e) => setInputs({ ...inputs, baseValue: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium"
                />
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: \`\${Math.min(100, (inputs.baseValue / 10000) * 100)}%\` }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.rate}
                  onChange={(e) => setInputs({ ...inputs, rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium"
                />
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: \`\${Math.min(100, (inputs.rate / 20) * 100)}%\` }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (months)
                </label>
                <input
                  type="number"
                  value={inputs.duration}
                  onChange={(e) => setInputs({ ...inputs, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium"
                />
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: \`\${Math.min(100, (inputs.duration / 36) * 100)}%\` }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiplier (x)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.multiplier}
                  onChange={(e) => setInputs({ ...inputs, multiplier: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium"
                />
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: \`\${Math.min(100, ((inputs.multiplier - 1) / 2) * 100)}%\` }}
                  />
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
                Calculate Results
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Calculated Results</h2>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-indigo-200 text-sm mb-2">Total Amount</div>
                  <div className="text-5xl font-bold">\${results.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-indigo-200 text-sm mb-2">Monthly Average</div>
                  <div className="text-3xl font-bold">\${results.monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>

            {results.breakdown.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Breakdown</h3>
                <div className="space-y-3">
                  {results.breakdown.map((item, i) => (
                    <div key={i} className={\`p-4 rounded-xl \${
                      item.label === 'Total' ? 'bg-indigo-50 border-2 border-indigo-600' : 'bg-gray-50'
                    }\`}>
                      <div className="flex justify-between items-center">
                        <span className={\`font-medium \${item.label === 'Total' ? 'text-indigo-900' : 'text-gray-700'}\`}>
                          {item.label}
                        </span>
                        <span className={\`font-bold \${item.label === 'Total' ? 'text-2xl text-indigo-600' : 'text-gray-900'}\`}>
                          \${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
batch23Categories.forEach(category => {
  const templateTypes = Object.keys(batch23Templates)
  const capsulesPerTemplate = Math.ceil(category.count / templateTypes.length)

  templateTypes.forEach((templateType, templateIdx) => {
    for (let i = 0; i < capsulesPerTemplate && extendedCapsulesBatch23.length < 500; i++) {
      const capsule = batch23Templates[templateType as keyof typeof batch23Templates](category.name, templateIdx * capsulesPerTemplate + i + 1)
      extendedCapsulesBatch23.push(capsule)
    }
  })
})

// Ensure exactly 500 capsules
while (extendedCapsulesBatch23.length > 500) {
  extendedCapsulesBatch23.pop()
}

export default extendedCapsulesBatch23

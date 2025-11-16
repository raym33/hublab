/**
 * Extended Capsules Batch 22 - Travel, Fitness, Events, Supply Chain
 * 500 production-ready React capsules
 */

import { Capsule } from '@/types/capsule'

const extendedCapsulesBatch22: Capsule[] = []

// Categories for Batch 22
const batch22Categories = [
  { name: 'Travel', count: 125 },
  { name: 'Fitness', count: 125 },
  { name: 'Events', count: 125 },
  { name: 'Supply Chain', count: 125 }
]

// Template generators for Batch 22
const batch22Templates: Record<string, (cat: string, idx: number) => Capsule> = {
  dashboard: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-dashboard-${idx}`,
    name: `${cat} Dashboard ${idx}`,
    category: cat,
    description: `Comprehensive ${cat.toLowerCase()} analytics dashboard with real-time metrics, KPIs, trend visualization, and performance monitoring for data-driven decisions`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'dashboard', 'analytics', 'metrics', 'reporting'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}Dashboard${idx}() {
  const [metrics, setMetrics] = useState({
    total: ${1000 + idx * 100},
    active: ${800 + idx * 50},
    pending: ${150 + idx * 10},
    completed: ${650 + idx * 40}
  })

  const [trends, setTrends] = useState([
    { month: 'Jan', value: ${50 + idx * 5} },
    { month: 'Feb', value: ${65 + idx * 6} },
    { month: 'Mar', value: ${80 + idx * 7} },
    { month: 'Apr', value: ${95 + idx * 8} },
    { month: 'May', value: ${110 + idx * 9} },
    { month: 'Jun', value: ${125 + idx * 10} }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">${cat} Dashboard</h1>
          <p className="text-gray-600">Monitor and analyze your ${cat.toLowerCase()} performance</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-1">Total Items</div>
            <div className="text-3xl font-bold text-gray-900">{metrics.total.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-2">↑ 12.5%</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-1">Active</div>
            <div className="text-3xl font-bold text-gray-900">{metrics.active.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-2">↑ 8.3%</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-gray-900">{metrics.pending.toLocaleString()}</div>
            <div className="text-sm text-yellow-600 mt-2">→ 0.0%</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-gray-900">{metrics.completed.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-2">↑ 15.7%</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">6-Month Trend</h2>
          <div className="flex items-end justify-between h-64 gap-4">
            {trends.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                  style={{ height: \`\${(item.value / Math.max(...trends.map(t => t.value))) * 100}%\` }}>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-600">{item.month}</div>
                <div className="text-xs text-gray-500">{item.value}</div>
              </div>
            ))}
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
    description: `Advanced ${cat.toLowerCase()} management system with CRUD operations, search, filtering, bulk actions, and real-time updates for efficient data administration`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'manager', 'crud', 'admin', 'data-management'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}Manager${idx}() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item Alpha', status: 'active', date: '2025-01-15', priority: 'high' },
    { id: 2, name: 'Item Beta', status: 'pending', date: '2025-01-16', priority: 'medium' },
    { id: 3, name: 'Item Gamma', status: 'completed', date: '2025-01-14', priority: 'low' },
    { id: 4, name: 'Item Delta', status: 'active', date: '2025-01-17', priority: 'high' },
    { id: 5, name: 'Item Epsilon', status: 'pending', date: '2025-01-18', priority: 'medium' }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleBulkDelete = () => {
    setItems(items.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  const toggleSelect = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">${cat} Manager</h1>
            <p className="text-gray-600 mt-1">Manage and organize your ${cat.toLowerCase()} items</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Add New Item
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-end">
              {selectedItems.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete Selected ({selectedItems.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }\`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }\`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }),

  booking: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-booking-${idx}`,
    name: `${cat} Booking System ${idx}`,
    category: cat,
    description: `Interactive ${cat.toLowerCase()} booking and reservation system with calendar view, availability checking, pricing, and confirmation workflow`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'booking', 'reservation', 'calendar', 'scheduling'],
    code: `'use client'

import { useState } from 'react'

export default function ${cat.replace(/\s+/g, '')}BookingSystem${idx}() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [attendees, setAttendees] = useState(1)

  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
  const pricePerPerson = ${50 + idx * 5}

  const handleBooking = () => {
    alert(\`Booking confirmed for \${selectedDate} at \${selectedTime} for \${attendees} person(s)\`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">${cat} Booking</h1>
            <p className="text-blue-100">Reserve your spot in just a few clicks</p>
          </div>

          <div className="p-8">
            {/* Step 1: Select Date */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Select Date</h2>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 14 }, (_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() + i)
                  const dateStr = date.toISOString().split('T')[0]
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={\`p-4 rounded-lg border-2 transition-all \${
                        selectedDate === dateStr
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }\`}>
                      <div className="text-xs text-gray-600">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-lg font-bold text-gray-900">{date.getDate()}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Select Time */}
            {selectedDate && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Select Time</h2>
                <div className="grid grid-cols-4 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={\`p-4 rounded-lg border-2 font-medium transition-all \${
                        selectedTime === time
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }\`}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Number of Attendees */}
            {selectedTime && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Number of Attendees</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAttendees(Math.max(1, attendees - 1))}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors text-xl font-bold">
                    −
                  </button>
                  <div className="text-3xl font-bold text-gray-900 w-16 text-center">{attendees}</div>
                  <button
                    onClick={() => setAttendees(attendees + 1)}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors text-xl font-bold">
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Summary & Confirm */}
            {selectedTime && (
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attendees:</span>
                      <span className="font-medium">{attendees}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300 font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-blue-600">\${(pricePerPerson * attendees).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }),

  tracker: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\s+/g, '-')}-tracker-${idx}`,
    name: `${cat} Tracker ${idx}`,
    category: cat,
    description: `Real-time ${cat.toLowerCase()} tracking and monitoring system with progress visualization, status updates, and historical data analysis`,
    tags: [cat.toLowerCase().replace(/\s+/g, '-'), 'tracker', 'monitoring', 'progress', 'real-time'],
    code: `'use client'

import { useState, useEffect } from 'react'

export default function ${cat.replace(/\s+/g, '')}Tracker${idx}() {
  const [trackingData, setTrackingData] = useState([
    { id: 'TRK001', status: 'in-transit', location: 'Distribution Center', progress: 65, eta: '2 hours' },
    { id: 'TRK002', status: 'delivered', location: 'Final Destination', progress: 100, eta: 'Delivered' },
    { id: 'TRK003', status: 'processing', location: 'Warehouse', progress: 25, eta: '6 hours' },
    { id: 'TRK004', status: 'in-transit', location: 'Regional Hub', progress: 45, eta: '4 hours' }
  ])

  const [selectedItem, setSelectedItem] = useState(trackingData[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingData(prev => prev.map(item => {
        if (item.status === 'in-transit' && item.progress < 100) {
          return { ...item, progress: Math.min(100, item.progress + Math.random() * 5) }
        }
        return item
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">${cat} Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor your ${cat.toLowerCase()} in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4">Active Items</h2>
              <div className="space-y-3">
                {trackingData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={\`p-4 rounded-lg border-2 cursor-pointer transition-all \${
                      selectedItem.id === item.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }\`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-gray-900">{item.id}</div>
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
                        item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        item.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }\`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{item.location}</div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: \`\${item.progress}%\` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.id}</h2>
                  <span className={\`px-4 py-2 rounded-full font-medium \${
                    selectedItem.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    selectedItem.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }\`}>
                    {selectedItem.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-gray-600">Current Location: <span className="font-medium text-gray-900">{selectedItem.location}</span></div>
                <div className="text-gray-600">Estimated Arrival: <span className="font-medium text-gray-900">{selectedItem.eta}</span></div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-blue-600">{Math.round(selectedItem.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: \`\${selectedItem.progress}%\` }}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {[
                    { time: '09:00 AM', status: 'Order Received', completed: true },
                    { time: '10:30 AM', status: 'Processing Started', completed: true },
                    { time: '02:15 PM', status: 'In Transit', completed: selectedItem.progress > 30 },
                    { time: '05:45 PM', status: 'Out for Delivery', completed: selectedItem.progress > 70 },
                    { time: 'Pending', status: 'Delivered', completed: selectedItem.progress === 100 }
                  ].map((event, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center \${
                        event.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                      }\`}>
                        {event.completed ? '✓' : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className={\`font-medium \${event.completed ? 'text-gray-900' : 'text-gray-400'}\`}>
                          {event.status}
                        </div>
                        <div className="text-sm text-gray-500">{event.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
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
batch22Categories.forEach(category => {
  const templateTypes = Object.keys(batch22Templates)
  const capsulesPerTemplate = Math.ceil(category.count / templateTypes.length)

  templateTypes.forEach((templateType, templateIdx) => {
    for (let i = 0; i < capsulesPerTemplate && extendedCapsulesBatch22.length < 500; i++) {
      const capsule = batch22Templates[templateType as keyof typeof batch22Templates](category.name, templateIdx * capsulesPerTemplate + i + 1)
      extendedCapsulesBatch22.push(capsule)
    }
  })
})

// Ensure exactly 500 capsules
while (extendedCapsulesBatch22.length > 500) {
  extendedCapsulesBatch22.pop()
}

export default extendedCapsulesBatch22

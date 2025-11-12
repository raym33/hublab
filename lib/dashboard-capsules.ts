/**
 * Dashboard Capsules
 *
 * 5 production-ready dashboard and analytics components
 * Perfect for admin panels, analytics dashboards, and data visualization
 */

import { Capsule } from '@/types/capsule'

const dashboardCapsules: Capsule[] = [
  {
    id: 'kpi-card',
    name: 'KPI Card Widget',
    category: 'Dashboard',
    description: 'Modern KPI card with trend indicators, sparklines, and comparison data. Shows percentage change, trend direction, and optional mini charts. Perfect for dashboards and analytics pages.',
    tags: ['kpi', 'metrics', 'dashboard', 'analytics', 'card', 'stats'],
    code: `'use client'

import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ComponentType<{ size?: number; className?: string }>
  color?: string
  subtitle?: string
  sparklineData?: number[]
}

export default function KPICard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'blue',
  subtitle,
  sparklineData = []
}: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  }

  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  const max = Math.max(...sparklineData)
  const min = Math.min(...sparklineData)
  const range = max - min

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={\`p-3 rounded-lg border \${colorClasses[color as keyof typeof colorClasses]}\`}>
            <Icon size={24} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {change !== undefined && (
          <div className={\`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium \${trendColors[trend]}\`}>
            <TrendIcon size={16} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}

        {sparklineData.length > 0 && (
          <svg className="w-24 h-8" viewBox={\`0 0 \${sparklineData.length * 10} 30\`}>
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}
              points={sparklineData
                .map((value, index) => {
                  const x = index * 10
                  const y = 30 - ((value - min) / range) * 25
                  return \`\${x},\${y}\`
                })
                .join(' ')}
            />
          </svg>
        )}
      </div>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'analytics-chart',
    name: 'Real-time Analytics Chart',
    category: 'Dashboard',
    description: 'Interactive line/bar chart with multiple datasets, legends, tooltips, and auto-updating data. Responsive design with hover states. Built with Canvas for smooth performance.',
    tags: ['chart', 'analytics', 'graph', 'visualization', 'real-time', 'canvas'],
    code: `'use client'

import { useEffect, useRef, useState } from 'react'

interface Dataset {
  label: string
  data: number[]
  color: string
}

interface AnalyticsChartProps {
  datasets: Dataset[]
  labels: string[]
  type?: 'line' | 'bar'
  height?: number
  animate?: boolean
  showGrid?: boolean
  showLegend?: boolean
}

export default function AnalyticsChart({
  datasets,
  labels,
  type = 'line',
  height = 300,
  animate = true,
  showGrid = true,
  showLegend = true
}: AnalyticsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; label: string } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const width = canvas.offsetWidth
    const chartHeight = height - 60
    const padding = 40

    // Calculate max value
    const maxValue = Math.max(...datasets.flatMap(d => d.data))
    const scale = chartHeight / (maxValue * 1.1)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#f3f4f6'
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight * i) / 5
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }
    }

    // Draw datasets
    datasets.forEach((dataset, datasetIndex) => {
      const barWidth = (width - padding * 2) / labels.length / datasets.length

      dataset.data.forEach((value, index) => {
        const x = padding + (index * (width - padding * 2)) / (labels.length - 1)
        const y = height - 40 - value * scale

        if (type === 'bar') {
          const barX = padding + index * ((width - padding * 2) / labels.length) + datasetIndex * barWidth
          ctx.fillStyle = dataset.color
          ctx.fillRect(barX, y, barWidth - 4, value * scale)
        } else {
          // Draw line
          ctx.strokeStyle = dataset.color
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'

          if (index === 0) {
            ctx.beginPath()
            ctx.moveTo(x, y)
          } else {
            const prevX = padding + ((index - 1) * (width - padding * 2)) / (labels.length - 1)
            const prevY = height - 40 - dataset.data[index - 1] * scale
            ctx.lineTo(prevX, prevY)
            ctx.lineTo(x, y)
            ctx.stroke()
          }

          // Draw points
          ctx.fillStyle = dataset.color
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    })

    // Draw labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    labels.forEach((label, index) => {
      const x = padding + (index * (width - padding * 2)) / (labels.length - 1)
      ctx.fillText(label, x, height - 15)
    })

  }, [datasets, labels, type, height, showGrid])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
        <p className="text-sm text-gray-500">Real-time performance metrics</p>
      </div>

      {showLegend && (
        <div className="flex gap-4 mb-4">
          {datasets.map((dataset, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dataset.color }} />
              <span className="text-sm text-gray-600">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: \`\${height}px\` }}
      />

      {hoveredPoint && (
        <div className="mt-2 text-sm text-gray-600">
          {hoveredPoint.label}: {hoveredPoint.value}
        </div>
      )}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'activity-feed',
    name: 'Activity Feed Timeline',
    category: 'Dashboard',
    description: 'Real-time activity feed with avatars, timestamps, and action types. Auto-updating with smooth animations. Perfect for showing user actions, system events, or notifications.',
    tags: ['activity', 'feed', 'timeline', 'notifications', 'events', 'real-time'],
    code: `'use client'

import { useState, useEffect } from 'react'
import { User, FileText, CheckCircle, AlertTriangle, MessageCircle, Upload, Download, Settings } from 'lucide-react'

interface Activity {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  action: string
  user: string
  timestamp: Date
  description?: string
}

interface ActivityFeedProps {
  activities?: Activity[]
  maxItems?: number
  autoUpdate?: boolean
  updateInterval?: number
}

export default function ActivityFeed({
  activities: initialActivities = [],
  maxItems = 10,
  autoUpdate = false,
  updateInterval = 5000
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)

  useEffect(() => {
    if (!autoUpdate) return

    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity: Activity = {
        id: Math.random().toString(36),
        type: ['success', 'warning', 'info', 'error'][Math.floor(Math.random() * 4)] as Activity['type'],
        action: ['uploaded a file', 'updated settings', 'completed a task', 'sent a message'][Math.floor(Math.random() * 4)],
        user: ['Alice', 'Bob', 'Charlie', 'Diana'][Math.floor(Math.random() * 4)],
        timestamp: new Date(),
        description: 'Recent activity update'
      }

      setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)])
    }, updateInterval)

    return () => clearInterval(interval)
  }, [autoUpdate, updateInterval, maxItems])

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'warning': return AlertTriangle
      case 'error': return AlertTriangle
      default: return MessageCircle
    }
  }

  const getColors = (type: Activity['type']) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-600'
      case 'warning': return 'bg-yellow-100 text-yellow-600'
      case 'error': return 'bg-red-100 text-red-600'
      default: return 'bg-blue-100 text-blue-600'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return \`\${minutes}m ago\`
    if (hours < 24) return \`\${hours}h ago\`
    return \`\${days}d ago\`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Feed</h3>
          <p className="text-sm text-gray-500">Recent system activities</p>
        </div>
        {autoUpdate && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {activities.slice(0, maxItems).map((activity, index) => {
          const Icon = getIcon(activity.type)
          return (
            <div
              key={activity.id}
              className="flex gap-4 animate-fade-in"
              style={{ animationDelay: \`\${index * 50}ms\` }}
            >
              <div className={\`flex-shrink-0 w-10 h-10 rounded-full \${getColors(activity.type)} flex items-center justify-center\`}>
                <Icon size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>
                  {' '}{activity.action}
                </p>
                {activity.description && (
                  <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          )
        })}

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recent activities
          </div>
        )}
      </div>

      <style jsx>{\`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      \`}</style>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'data-table',
    name: 'Advanced Data Table',
    category: 'Dashboard',
    description: 'Feature-rich data table with sorting, filtering, pagination, and row selection. Responsive design with sticky headers. Perfect for admin panels and data-heavy dashboards.',
    tags: ['table', 'data', 'grid', 'sorting', 'filtering', 'pagination', 'admin'],
    code: `'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search, Filter, Download } from 'lucide-react'

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  pageSize?: number
  searchable?: boolean
  exportable?: boolean
}

export default function DataTable({
  data,
  columns,
  pageSize = 10,
  searchable = true,
  exportable = true
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm])

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortKey, sortDirection])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)))
    }
  }

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }

  const exportData = () => {
    const csv = [
      columns.map(col => col.label).join(','),
      ...sortedData.map(row => columns.map(col => row[col.key]).join(','))
    ].join('\\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data-export.csv'
    a.click()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
        {searchable && (
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {exportable && (
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} />
            Export
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={\`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider \${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}\`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={\`hover:bg-gray-50 \${selectedRows.has(rowIndex) ? 'bg-blue-50' : ''}\`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowIndex)}
                    onChange={() => handleSelectRow(rowIndex)}
                    className="rounded border-gray-300"
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'performance-dashboard',
    name: 'Performance Metrics Dashboard',
    category: 'Dashboard',
    description: 'Complete dashboard layout with multiple KPI cards, charts, and real-time updates. Responsive grid system with customizable widgets. Perfect for executive dashboards and monitoring tools.',
    tags: ['dashboard', 'metrics', 'kpi', 'performance', 'analytics', 'monitoring'],
    code: `'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, DollarSign, Activity, Clock, Target, Zap, Eye } from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Total Revenue',
      value: '$124,592',
      change: 12.5,
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: '8,492',
      change: 8.2,
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: '3.42%',
      change: -2.1,
      trend: 'down',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Avg Response Time',
      value: '245ms',
      change: -15.3,
      trend: 'up',
      icon: Zap,
      color: 'orange'
    }
  ])

  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
      // Simulate metric updates
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        change: metric.change + (Math.random() - 0.5) * 2
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Last updated: {lastUpdated.toLocaleTimeString()}
          <span className="inline-flex items-center ml-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
            Live
          </span>
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const colorClasses = {
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          }

          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                </div>
                <div className={\`p-3 rounded-lg \${colorClasses[metric.color as keyof typeof colorClasses]}\`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp
                  size={16}
                  className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}
                  style={{ transform: metric.trend === 'down' ? 'rotate(180deg)' : 'none' }}
                />
                <span className={\`text-sm font-medium \${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}\`}>
                  {Math.abs(metric.change).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Traffic Overview</h3>
              <p className="text-sm text-gray-500">Page views over time</p>
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 60, 90, 75].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                  style={{ height: \`\${height}%\` }}
                />
                <span className="text-xs text-gray-500">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Traffic Sources</h3>

          <div className="space-y-4">
            {[
              { source: 'Organic Search', visitors: 12543, percentage: 42 },
              { source: 'Direct', visitors: 8234, percentage: 28 },
              { source: 'Social Media', visitors: 5421, percentage: 18 },
              { source: 'Referral', visitors: 3562, percentage: 12 }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm text-gray-500">{item.visitors.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: \`\${item.percentage}%\` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>

        <div className="space-y-4">
          {[
            { action: 'New user registration', user: 'john@example.com', time: '2 minutes ago', type: 'success' },
            { action: 'Payment received', user: 'sarah@example.com', time: '15 minutes ago', type: 'success' },
            { action: 'Failed login attempt', user: 'unknown@example.com', time: '1 hour ago', type: 'warning' },
            { action: 'System update completed', user: 'System', time: '2 hours ago', type: 'info' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
              <div className={\`w-2 h-2 rounded-full \${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }\`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }
]

export default dashboardCapsules

'use client'

import React, { useState } from 'react'

/**
 * Data Analytics Dashboard
 *
 * A comprehensive analytics dashboard with charts, metrics, and data visualizations.
 * Perfect for business intelligence, reporting, and data science applications.
 *
 * Exported from HubLab Studio V2
 * Categories: Dashboard, DataViz, Analytics, BI
 *
 * @example
 * ```tsx
 * import DataAnalyticsDashboard from './DataAnalyticsDashboard'
 *
 * export default function Page() {
 *   return <DataAnalyticsDashboard />
 * }
 * ```
 */

interface MetricCard {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down'
  icon: string
}

interface ChartDataPoint {
  label: string
  value: number
}

export default function DataAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const metrics: MetricCard[] = [
    { label: 'Total Revenue', value: '$245,890', change: 12.5, trend: 'up', icon: '💰' },
    { label: 'Active Users', value: '12,458', change: 8.2, trend: 'up', icon: '👥' },
    { label: 'Conversion Rate', value: '3.24%', change: -2.1, trend: 'down', icon: '📈' },
    { label: 'Avg. Order Value', value: '$89.50', change: 5.7, trend: 'up', icon: '🛒' }
  ]

  const revenueData: ChartDataPoint[] = [
    { label: 'Jan', value: 45000 },
    { label: 'Feb', value: 52000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 61000 },
    { label: 'May', value: 58000 },
    { label: 'Jun', value: 67000 },
    { label: 'Jul', value: 72000 }
  ]

  const topProducts = [
    { name: 'Premium Package', sales: 1245, revenue: 124500, trend: 'up' },
    { name: 'Standard Plan', sales: 892, revenue: 89200, trend: 'up' },
    { name: 'Basic Tier', sales: 654, revenue: 32700, trend: 'down' },
    { name: 'Enterprise', sales: 234, revenue: 117000, trend: 'up' },
    { name: 'Starter Kit', sales: 189, revenue: 9450, trend: 'down' }
  ]

  const customerSegments = [
    { segment: 'Enterprise', count: 234, percentage: 18.8, color: 'bg-blue-500' },
    { segment: 'SMB', count: 892, percentage: 41.2, color: 'bg-green-500' },
    { segment: 'Startup', count: 654, percentage: 28.4, color: 'bg-purple-500' },
    { segment: 'Individual', count: 189, percentage: 11.6, color: 'bg-orange-500' }
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.value))

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
            <p className="text-slate-600">Real-time business intelligence and insights</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{metric.icon}</div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {metric.trend === 'up' ? '↑' : '↓'}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
              <div className="text-3xl font-bold text-slate-900">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Revenue Trend</h2>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Revenue ($)</span>
              </div>
            </div>

            <div className="h-80 flex items-end justify-between gap-2">
              {revenueData.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-slate-100 rounded-t relative group">
                    <div
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-500"
                      style={{ height: `${(point.value / maxRevenue) * 300}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${(point.value / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 font-medium">{point.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Customer Segments</h2>

          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{segment.segment}</span>
                  <span className="text-sm text-slate-600">{segment.count} ({segment.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${segment.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{customerSegments.reduce((acc, s) => acc + s.count, 0).toLocaleString()}</div>
              <div className="text-sm text-slate-600 mt-1">Total Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Top Products</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Product</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Sales</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Revenue</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-slate-100 text-slate-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-900">{product.name}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium text-slate-900">{product.sales.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium text-slate-900">${product.revenue.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.trend === 'up' ? '↑ Growing' : '↓ Declining'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Export Analytics Report</h3>
              <p className="text-blue-100">Download comprehensive analytics data for {timeRange}</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Export CSV
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-400 transition-colors border border-blue-400">
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

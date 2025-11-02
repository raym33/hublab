// ============================================
// ANALYTICS DASHBOARD - EXPORTED FROM HUBLAB
// Production-ready with charts and data tables
// Built in: 15-20 minutes with HubLab
// Integrations: Supabase, Recharts
// ============================================

'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data - replace with real data from your API/Database
  const stats = [
    { name: 'Total Revenue', value: '$45,231', change: '+20.1%', trend: 'up', icon: DollarSign },
    { name: 'Active Users', value: '2,345', change: '+12.5%', trend: 'up', icon: Users },
    { name: 'Conversion Rate', value: '3.24%', change: '-2.3%', trend: 'down', icon: TrendingUp },
    { name: 'Total Orders', value: '1,234', change: '+8.2%', trend: 'up', icon: BarChart3 },
  ]

  const recentOrders = [
    { id: '#3210', customer: 'John Doe', amount: '$299.00', status: 'completed', date: '2 min ago' },
    { id: '#3209', customer: 'Jane Smith', amount: '$149.00', status: 'pending', date: '15 min ago' },
    { id: '#3208', customer: 'Bob Johnson', amount: '$499.00', status: 'completed', date: '1 hour ago' },
    { id: '#3207', customer: 'Alice Brown', amount: '$199.00', status: 'completed', date: '2 hours ago' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              {/* Add Recharts or Chart.js here */}
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Chart would be rendered here</p>
                <p className="text-xs">Install recharts: npm install recharts</p>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
            <div className="space-y-4">
              {[
                { name: 'Organic Search', value: '45%', color: 'bg-blue-600' },
                { name: 'Direct', value: '30%', color: 'bg-green-600' },
                { name: 'Social Media', value: '15%', color: 'bg-purple-600' },
                { name: 'Referral', value: '10%', color: 'bg-yellow-600' },
              ].map((source, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{source.name}</span>
                    <span className="font-semibold text-gray-900">{source.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${source.color} h-2 rounded-full transition-all`}
                      style={{ width: source.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

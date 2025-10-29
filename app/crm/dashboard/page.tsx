'use client'

import { useState } from 'react'
import {
  Activity,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Search,
  MoreVertical,
} from 'lucide-react'

interface Event {
  id: string
  type: 'email' | 'meeting' | 'slack'
  source: string
  title: string
  timestamp: string
  processed: boolean
  confidence?: number
}

interface Action {
  id: string
  type: string
  status: 'pending' | 'approved' | 'executed' | 'failed'
  resource: string
  timestamp: string
  confidence: number
}

export default function CRMDashboard() {
  const [timeRange, setTimeRange] = useState('today')

  const stats = [
    {
      label: 'Events Processed',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Activity,
      color: 'blue',
    },
    {
      label: 'CRM Updates',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Pending Approval',
      value: '3',
      change: '0',
      trend: 'neutral',
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'Pipeline Value',
      value: '$124K',
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple',
    },
  ]

  const recentEvents: Event[] = [
    {
      id: '1',
      type: 'meeting',
      source: 'Google Calendar',
      title: 'Demo with ACME Corp completed',
      timestamp: '2 minutes ago',
      processed: true,
      confidence: 0.98,
    },
    {
      id: '2',
      type: 'email',
      source: 'Gmail',
      title: 'Purchase order received from Beta Inc',
      timestamp: '15 minutes ago',
      processed: true,
      confidence: 0.95,
    },
    {
      id: '3',
      type: 'meeting',
      source: 'Zoom',
      title: 'Follow-up call scheduled with Delta LLC',
      timestamp: '1 hour ago',
      processed: true,
      confidence: 0.92,
    },
    {
      id: '4',
      type: 'email',
      source: 'Gmail',
      title: 'New lead inquiry from contact form',
      timestamp: '2 hours ago',
      processed: false,
      confidence: 0.87,
    },
    {
      id: '5',
      type: 'slack',
      source: 'Slack',
      title: 'Sales team mentioned new opportunity',
      timestamp: '3 hours ago',
      processed: true,
      confidence: 0.89,
    },
  ]

  const recentActions: Action[] = [
    {
      id: '1',
      type: 'update_deal_stage',
      status: 'executed',
      resource: 'ACME Corp - Deal',
      timestamp: '2 minutes ago',
      confidence: 0.98,
    },
    {
      id: '2',
      type: 'create_deal',
      status: 'executed',
      resource: 'Beta Inc - New Deal',
      timestamp: '15 minutes ago',
      confidence: 0.95,
    },
    {
      id: '3',
      type: 'create_task',
      status: 'executed',
      resource: 'Follow-up with Delta LLC',
      timestamp: '1 hour ago',
      confidence: 0.92,
    },
    {
      id: '4',
      type: 'upsert_contact',
      status: 'pending',
      resource: 'john.doe@example.com',
      timestamp: '2 hours ago',
      confidence: 0.87,
    },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail
      case 'meeting':
        return Calendar
      case 'slack':
        return Users
      default:
        return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">CRM Dashboard</h1>
              <p className="mt-2 text-slate-600">
                Real-time activity and automation insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  {stat.trend === 'up' && (
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Recent Events</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <Filter className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <Search className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {recentEvents.map((event) => {
                const Icon = getEventIcon(event.type)
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-slate-900 text-sm">
                          {event.title}
                        </h3>
                        {event.processed && (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{event.source}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{event.timestamp}</span>
                        {event.confidence && (
                          <span className="text-xs text-slate-600">
                            {Math.round(event.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button className="w-full mt-4 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium">
              View All Events
            </button>
          </div>

          {/* Recent Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">CRM Actions</h2>
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <MoreVertical className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              {recentActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-green-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-medium text-slate-900 text-sm">
                          {action.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">{action.resource}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          action.status
                        )}`}
                      >
                        {action.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">{action.timestamp}</span>
                      <span className="text-xs text-slate-600">
                        {Math.round(action.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium">
              View All Actions
            </button>
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Activity Trend</h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
            <div className="text-center">
              <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Activity Chart</p>
              <p className="text-sm text-slate-500 mt-1">
                Real-time visualization coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

# 🎨 Frontend Integration Guide - HubLab Ambient Agent CRM

Complete guide for integrating backend APIs with frontend components.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Type Imports](#type-imports)
3. [Custom Hooks](#custom-hooks)
4. [Page Integration](#page-integration)
5. [Real-time Updates](#real-time-updates)
6. [Error Handling](#error-handling)
7. [Loading States](#loading-states)
8. [Testing](#testing)

---

## 🚀 Quick Start

### Step 1: Import Types

```typescript
// In your component or hook
import {
  CRMAction,
  Event,
  DashboardStats,
  ActionStatus,
  CRMConnection,
} from '@/lib/types/crm'
```

### Step 2: Import Database Helpers

```typescript
// Direct database access (server-side or client with Supabase)
import {
  getDashboardStats,
  getRecentEvents,
  getRecentActions,
  getPendingActions,
} from '@/lib/crm-database'
```

### Step 3: Use in Components

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/lib/crm-database'
import { supabase } from '@/lib/supabase'
import type { DashboardStats } from '@/lib/types/crm'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getDashboardStats(user.id)
        setStats(data)
      }
    }
    fetchStats()
  }, [])

  return <div>{stats?.events_processed_today} events today</div>
}
```

---

## 📦 Type Imports

All types are exported from `lib/types/crm.ts`:

### Core Types

```typescript
import {
  // CRM Connection
  CRMConnection,
  CRMType,
  CreateCRMConnectionInput,

  // Events
  Event,
  EventType,
  EventSource,
  CreateEventInput,
  NormalizedEvent,

  // Actions
  CRMAction,
  ActionType,
  ActionStatus,
  ResourceType,
  CreateCRMActionInput,

  // Audit
  AuditLog,
  CreateAuditLogInput,

  // Dashboard
  DashboardStats,
  RecentActivity,

  // HubSpot
  HubSpotContact,
  HubSpotDeal,
  HubSpotCompany,
} from '@/lib/types/crm'
```

### Using Types in Components

```typescript
interface ApprovalCardProps {
  action: CRMAction
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export function ApprovalCard({ action, onApprove, onReject }: ApprovalCardProps) {
  const getRiskLevel = (confidence: number): 'low' | 'medium' | 'high' => {
    if (confidence >= 0.9) return 'low'
    if (confidence >= 0.7) return 'medium'
    return 'high'
  }

  const risk = getRiskLevel(action.confidence)

  return (
    <div className={`border rounded-lg p-4 ${
      risk === 'high' ? 'border-red-300' :
      risk === 'medium' ? 'border-yellow-300' :
      'border-green-300'
    }`}>
      <h3>{action.action_type}</h3>
      <p>{action.justification}</p>
      <div className="flex gap-2 mt-4">
        <button onClick={() => onApprove(action.id)}>Approve</button>
        <button onClick={() => onReject(action.id)}>Reject</button>
      </div>
    </div>
  )
}
```

---

## 🪝 Custom Hooks

### Hook 1: usePendingApprovals

```typescript
// hooks/usePendingApprovals.ts
import { useState, useEffect, useCallback } from 'react'
import { CRMAction } from '@/lib/types/crm'

interface ApprovalStats {
  total: number
  high_risk: number
  medium_risk: number
  low_risk: number
  avg_confidence: number
}

interface UsePendingApprovalsReturn {
  approvals: CRMAction[]
  stats: ApprovalStats
  loading: boolean
  error: string | null
  approve: (actionId: string) => Promise<void>
  reject: (actionId: string) => Promise<void>
  batchApprove: (actionIds: string[]) => Promise<void>
  refresh: () => Promise<void>
}

export function usePendingApprovals(): UsePendingApprovalsReturn {
  const [approvals, setApprovals] = useState<CRMAction[]>([])
  const [stats, setStats] = useState<ApprovalStats>({
    total: 0,
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
    avg_confidence: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/crm/approvals?requires_approval=true')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch approvals')
      }

      setApprovals(result.data.actions)
      setStats(result.data.stats)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Error fetching approvals:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApprovals()
  }, [fetchApprovals])

  const approve = async (actionId: string) => {
    const response = await fetch('/api/crm/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_id: actionId, decision: 'approve' }),
    })

    if (!response.ok) {
      throw new Error('Failed to approve action')
    }

    await fetchApprovals() // Refresh list
  }

  const reject = async (actionId: string) => {
    const response = await fetch('/api/crm/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_id: actionId, decision: 'reject' }),
    })

    if (!response.ok) {
      throw new Error('Failed to reject action')
    }

    await fetchApprovals()
  }

  const batchApprove = async (actionIds: string[]) => {
    const response = await fetch('/api/crm/approvals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_ids: actionIds, decision: 'approve' }),
    })

    if (!response.ok) {
      throw new Error('Failed to batch approve')
    }

    await fetchApprovals()
  }

  return {
    approvals,
    stats,
    loading,
    error,
    approve,
    reject,
    batchApprove,
    refresh: fetchApprovals,
  }
}
```

### Hook 2: useCRMStats

```typescript
// hooks/useCRMStats.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getDashboardStats } from '@/lib/crm-database'

interface CRMStats {
  events_processed_today: number
  crm_updates_today: number
  pending_approvals: number
  auto_approval_rate: number
}

export function useCRMStats() {
  const [stats, setStats] = useState<CRMStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('User not authenticated')
        }

        const data = await getDashboardStats(user.id)
        setStats(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error }
}
```

### Hook 3: useRecentEvents

```typescript
// hooks/useRecentEvents.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getRecentEvents } from '@/lib/crm-database'
import { Event } from '@/lib/types/crm'

export function useRecentEvents(limit = 20) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const data = await getRecentEvents(user.id, limit)
        setEvents(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [limit])

  return { events, loading, error }
}
```

### Hook 4: useRecentActions

```typescript
// hooks/useRecentActions.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getRecentActions } from '@/lib/crm-database'
import { CRMAction } from '@/lib/types/crm'

export function useRecentActions(limit = 20) {
  const [actions, setActions] = useState<CRMAction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const data = await getRecentActions(user.id, limit)
        setActions(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Error fetching actions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchActions()
  }, [limit])

  return { actions, loading, error }
}
```

### Hook 5: useHubSpotConnection

```typescript
// hooks/useHubSpotConnection.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCRMConnectionByType } from '@/lib/crm-database'
import { CRMConnection } from '@/lib/types/crm'

export function useHubSpotConnection() {
  const [connection, setConnection] = useState<CRMConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const data = await getCRMConnectionByType(user.id, 'hubspot')
        setConnection(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Error fetching connection:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConnection()
  }, [])

  const isConnected = connection !== null && connection.is_active

  return { connection, isConnected, loading, error }
}
```

---

## 📄 Page Integration

### Dashboard Page

```typescript
// app/crm/dashboard/page.tsx
'use client'

import { useCRMStats } from '@/hooks/useCRMStats'
import { useRecentEvents } from '@/hooks/useRecentEvents'
import { useRecentActions } from '@/hooks/useRecentActions'
import { StatCard } from '@/components/crm/StatCard'
import { EventCard } from '@/components/crm/EventCard'
import { ActionCard } from '@/components/crm/ActionCard'
import { Activity, CheckCircle, Clock, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useCRMStats()
  const { events, loading: eventsLoading } = useRecentEvents(5)
  const { actions, loading: actionsLoading } = useRecentActions(5)

  if (statsLoading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">CRM Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Events Processed"
          value={stats?.events_processed_today || 0}
          icon={Activity}
          color="blue"
        />
        <StatCard
          label="CRM Updates"
          value={stats?.crm_updates_today || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          label="Pending Approvals"
          value={stats?.pending_approvals || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          label="Auto-Approval Rate"
          value={`${stats?.auto_approval_rate || 0}%`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          {eventsLoading ? (
            <div>Loading events...</div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  type={event.event_type}
                  source={event.source}
                  title={event.normalized_data?.metadata?.subject || 'Event'}
                  timestamp={new Date(event.created_at).toLocaleString()}
                  processed={event.processed}
                  confidence={0.9}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">CRM Actions</h2>
          {actionsLoading ? (
            <div>Loading actions...</div>
          ) : (
            <div className="space-y-3">
              {actions.map((action) => (
                <ActionCard
                  key={action.id}
                  type={action.action_type}
                  status={action.status}
                  resource={`${action.resource_type}: ${action.resource_id || 'new'}`}
                  timestamp={new Date(action.created_at).toLocaleString()}
                  confidence={action.confidence}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### Approvals Page

```typescript
// app/crm/approvals/page.tsx
'use client'

import { usePendingApprovals } from '@/hooks/usePendingApprovals'
import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ApprovalsPage() {
  const { approvals, stats, loading, error, approve, reject } = usePendingApprovals()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (loading) return <div className="p-6">Loading approvals...</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Pending Approvals</h1>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-600">High Risk</div>
          <div className="text-2xl font-bold text-red-600">{stats.high_risk}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-600">Medium Risk</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.medium_risk}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-600">Low Risk</div>
          <div className="text-2xl font-bold text-green-600">{stats.low_risk}</div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {approvals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No pending approvals
          </div>
        ) : (
          approvals.map((action) => {
            const isExpanded = expandedIds.has(action.id)
            const getRiskColor = (confidence: number) => {
              if (confidence >= 0.9) return 'bg-green-100 text-green-800'
              if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800'
              return 'bg-red-100 text-red-800'
            }

            return (
              <div
                key={action.id}
                className="bg-white border rounded-lg p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {action.action_type.replace(/_/g, ' ')}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${getRiskColor(
                          action.confidence
                        )}`}
                      >
                        {Math.round(action.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{action.resource_type}</p>
                  </div>
                </div>

                {/* Justification */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    AI Reasoning:
                  </div>
                  <p className="text-sm text-gray-600">{action.justification}</p>
                </div>

                {/* Expandable Payload */}
                <button
                  onClick={() => toggleExpanded(action.id)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-2"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {isExpanded ? 'Hide' : 'Show'} proposed changes
                </button>

                {isExpanded && (
                  <div className="bg-gray-50 rounded p-4 mb-4">
                    <pre className="text-xs">
                      {JSON.stringify(action.payload, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => approve(action.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <CheckCircle size={16} />
                    Approve & Execute
                  </button>
                  <button
                    onClick={() => reject(action.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
```

### Setup Page (HubSpot Connection)

```typescript
// app/crm/setup/page.tsx
'use client'

import { useHubSpotConnection } from '@/hooks/useHubSpotConnection'
import { CheckCircle, ExternalLink } from 'lucide-react'

export default function SetupPage() {
  const { isConnected, loading } = useHubSpotConnection()

  const handleConnect = () => {
    window.location.href = '/api/crm/hubspot/connect'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">CRM Setup</h1>

      {/* HubSpot Card */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-600">H</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">HubSpot</h3>
              {loading ? (
                <p className="text-sm text-gray-600">Checking connection...</p>
              ) : isConnected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Not connected</p>
              )}
            </div>
          </div>

          {!isConnected && !loading && (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Connect
              <ExternalLink size={16} />
            </button>
          )}
        </div>

        {isConnected && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Last sync: 2 minutes ago
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## ⚡ Real-time Updates

### Using Supabase Realtime

```typescript
// hooks/useRealtimeApprovals.ts
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePendingApprovals } from './usePendingApprovals'

export function useRealtimeApprovals() {
  const { refresh } = usePendingApprovals()

  useEffect(() => {
    // Subscribe to changes in crm_actions table
    const channel = supabase
      .channel('crm-actions-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'crm_actions',
        },
        (payload) => {
          console.log('CRM action changed:', payload)
          refresh() // Refresh approvals list
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [refresh])
}
```

---

## 🚨 Error Handling

### Error Boundary Component

```typescript
// components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 border border-red-300 rounded-lg bg-red-50">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-red-600">
              {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
```

### Error Toast Notifications

```typescript
// hooks/useToast.ts
import { useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  return { toast, showToast }
}
```

---

## ⏳ Loading States

### Skeleton Loaders

```typescript
// components/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border rounded-lg p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  )
}
```

### Loading States in Hooks

```typescript
const { approvals, loading, error } = usePendingApprovals()

if (loading) return <SkeletonCard />
if (error) return <ErrorMessage error={error} />
return <ApprovalsList approvals={approvals} />
```

---

## 🧪 Testing

### Unit Tests with Jest

```typescript
// __tests__/usePendingApprovals.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { usePendingApprovals } from '@/hooks/usePendingApprovals'

global.fetch = jest.fn()

describe('usePendingApprovals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches approvals on mount', async () => {
    const mockData = {
      success: true,
      data: {
        actions: [],
        stats: { total: 0, high_risk: 0, medium_risk: 0, low_risk: 0, avg_confidence: 0 },
      },
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() => usePendingApprovals())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.approvals).toEqual([])
    expect(result.current.stats.total).toBe(0)
  })

  it('handles errors gracefully', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => usePendingApprovals())

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
    })
  })
})
```

---

## 🎉 Complete Integration Checklist

- [ ] Import types from `lib/types/crm.ts`
- [ ] Create custom hooks for data fetching
- [ ] Update pages to use real hooks instead of mock data
- [ ] Add loading states with skeleton loaders
- [ ] Add error boundaries and error handling
- [ ] Test API endpoints work correctly
- [ ] Add real-time updates with Supabase
- [ ] Test authentication flow
- [ ] Test HubSpot OAuth connection
- [ ] Add unit tests for hooks
- [ ] Add E2E tests for critical flows

---

**Last Updated:** October 2025
**Version:** 1.0.0

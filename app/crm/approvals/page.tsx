'use client'

import { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Mail,
  Calendar,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface PendingAction {
  id: string
  type: 'upsert_contact' | 'update_deal' | 'create_deal' | 'log_activity' | 'create_task'
  resource: string
  event: {
    type: 'email' | 'meeting' | 'slack'
    title: string
    timestamp: string
  }
  proposed_changes: {
    field: string
    current: string | null
    proposed: string
  }[]
  confidence: number
  justification: string
  risk_level: 'low' | 'medium' | 'high'
  timestamp: string
}

export default function ApprovalsPage() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set())

  const pendingActions: PendingAction[] = [
    {
      id: '1',
      type: 'create_deal',
      resource: 'Beta Inc - Enterprise License',
      event: {
        type: 'email',
        title: 'Purchase order received from Beta Inc',
        timestamp: '15 minutes ago',
      },
      proposed_changes: [
        { field: 'Deal Name', current: null, proposed: 'Beta Inc - Enterprise License' },
        { field: 'Amount', current: null, proposed: '$85,000' },
        { field: 'Stage', current: null, proposed: 'Negotiation' },
        { field: 'Close Date', current: null, proposed: '2025-12-15' },
        { field: 'Company', current: null, proposed: 'Beta Inc' },
      ],
      confidence: 0.87,
      justification:
        'Email contains purchase order attachment with deal details. Amount extracted from PO document. Company exists in CRM.',
      risk_level: 'medium',
      timestamp: '15 minutes ago',
    },
    {
      id: '2',
      type: 'upsert_contact',
      resource: 'john.doe@newcompany.com',
      event: {
        type: 'email',
        title: 'New lead inquiry from contact form',
        timestamp: '2 hours ago',
      },
      proposed_changes: [
        { field: 'Email', current: null, proposed: 'john.doe@newcompany.com' },
        { field: 'First Name', current: null, proposed: 'John' },
        { field: 'Last Name', current: null, proposed: 'Doe' },
        { field: 'Company', current: null, proposed: 'New Company Inc' },
        { field: 'Phone', current: null, proposed: '+1 555-0123' },
      ],
      confidence: 0.92,
      justification:
        'Contact form submission with complete information. Email validated. Company domain matches provided name.',
      risk_level: 'low',
      timestamp: '2 hours ago',
    },
    {
      id: '3',
      type: 'update_deal',
      resource: 'Gamma Corp - Software Suite',
      event: {
        type: 'meeting',
        title: 'Pricing negotiation with Gamma Corp',
        timestamp: '4 hours ago',
      },
      proposed_changes: [
        { field: 'Stage', current: 'Proposal Sent', proposed: 'Negotiation' },
        { field: 'Amount', current: '$120,000', proposed: '$95,000' },
        { field: 'Notes', current: '', proposed: 'Customer requested 20% discount for multi-year contract' },
      ],
      confidence: 0.78,
      justification:
        'Meeting notes indicate price reduction discussion. Amount extracted from transcript. Stage change reflects negotiation phase.',
      risk_level: 'high',
      timestamp: '4 hours ago',
    },
  ]

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedActions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedActions(newExpanded)
  }

  const handleApprove = (id: string) => {
    console.log('Approved:', id)
    // TODO: Implement approval logic
  }

  const handleReject = (id: string) => {
    console.log('Rejected:', id)
    // TODO: Implement rejection logic
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail
      case 'meeting':
        return Calendar
      case 'slack':
        return Users
      default:
        return Clock
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      upsert_contact: 'Create/Update Contact',
      update_deal: 'Update Deal',
      create_deal: 'Create Deal',
      log_activity: 'Log Activity',
      create_task: 'Create Task',
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Pending Approvals</h1>
              <p className="mt-2 text-slate-600">
                Review and approve proposed CRM updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approve All Low Risk
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                Configure Auto-Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-slate-900">{pendingActions.length}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">High Risk</p>
                <p className="text-3xl font-bold text-slate-900">
                  {pendingActions.filter((a) => a.risk_level === 'high').length}
                </p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Avg Confidence</p>
                <p className="text-3xl font-bold text-slate-900">
                  {Math.round(
                    pendingActions.reduce((sum, a) => sum + a.confidence, 0) /
                      pendingActions.length *
                      100
                  )}
                  %
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pipeline Impact</p>
                <p className="text-3xl font-bold text-slate-900">$180K</p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Pending Actions List */}
        <div className="space-y-4">
          {pendingActions.map((action) => {
            const EventIcon = getEventIcon(action.event.type)
            const isExpanded = expandedActions.has(action.id)

            return (
              <div
                key={action.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <EventIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                              {getActionTypeLabel(action.type)}
                            </h3>
                            <p className="text-sm text-slate-600">{action.resource}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(
                                action.risk_level
                              )}`}
                            >
                              {action.risk_level.toUpperCase()} RISK
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                              {Math.round(action.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                          <span>Triggered by: {action.event.title}</span>
                          <span>•</span>
                          <span>{action.event.timestamp}</span>
                        </div>

                        {/* Justification */}
                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-slate-700 flex items-start gap-2">
                            <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>AI Reasoning:</strong> {action.justification}
                            </span>
                          </p>
                        </div>

                        {/* Toggle Changes */}
                        <button
                          onClick={() => toggleExpanded(action.id)}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide proposed changes
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show {action.proposed_changes.length} proposed changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Proposed Changes (Expandable) */}
                  {isExpanded && (
                    <div className="ml-16 mt-4 border-l-2 border-blue-200 pl-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">
                        Proposed Changes
                      </h4>
                      <div className="space-y-3">
                        {action.proposed_changes.map((change, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 mb-2">
                                  {change.field}
                                </p>
                                <div className="flex items-center gap-3">
                                  {change.current ? (
                                    <>
                                      <div className="flex-1">
                                        <p className="text-xs text-slate-500 mb-1">Current</p>
                                        <p className="text-sm text-slate-700 bg-red-50 px-3 py-2 rounded">
                                          {change.current}
                                        </p>
                                      </div>
                                      <div className="text-slate-400">→</div>
                                      <div className="flex-1">
                                        <p className="text-xs text-slate-500 mb-1">Proposed</p>
                                        <p className="text-sm text-slate-900 bg-green-50 px-3 py-2 rounded font-medium">
                                          {change.proposed}
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex-1">
                                      <p className="text-xs text-slate-500 mb-1">New Value</p>
                                      <p className="text-sm text-slate-900 bg-blue-50 px-3 py-2 rounded font-medium">
                                        {change.proposed}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-6 ml-16">
                    <button
                      onClick={() => handleApprove(action.id)}
                      className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve & Execute
                    </button>
                    <button
                      onClick={() => handleReject(action.id)}
                      className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                    <button className="px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State (if no pending actions) */}
        {pendingActions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              All caught up!
            </h3>
            <p className="text-slate-600">
              No pending approvals at the moment. All actions are either auto-approved or executed.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

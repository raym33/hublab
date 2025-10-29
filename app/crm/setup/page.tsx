'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, Settings, ArrowRight } from 'lucide-react'

type CRMType = 'hubspot' | 'salesforce' | 'pipedrive' | 'zoho'
type ConnectorType = 'gmail' | 'calendar' | 'slack' | 'outlook' | 'zoom'

interface CRMConnection {
  id: string
  type: CRMType
  name: string
  connected: boolean
  lastSync?: string
}

interface WatcherConfig {
  type: ConnectorType
  name: string
  enabled: boolean
  config?: any
}

export default function CRMSetupPage() {
  const [activeTab, setActiveTab] = useState<'crm' | 'watchers' | 'rules'>('crm')
  const [crmConnections, setCrmConnections] = useState<CRMConnection[]>([
    { id: '1', type: 'hubspot', name: 'HubSpot', connected: false },
    { id: '2', type: 'salesforce', name: 'Salesforce', connected: false },
    { id: '3', type: 'pipedrive', name: 'Pipedrive', connected: false },
    { id: '4', type: 'zoho', name: 'Zoho CRM', connected: false },
  ])

  const [watchers, setWatchers] = useState<WatcherConfig[]>([
    { type: 'gmail', name: 'Gmail', enabled: false },
    { type: 'calendar', name: 'Google Calendar', enabled: false },
    { type: 'slack', name: 'Slack', enabled: false },
    { type: 'outlook', name: 'Outlook', enabled: false },
    { type: 'zoom', name: 'Zoom', enabled: false },
  ])

  const handleConnectCRM = (id: string) => {
    // TODO: Implement OAuth flow
    console.log('Connecting CRM:', id)
  }

  const toggleWatcher = (type: ConnectorType) => {
    setWatchers(watchers.map(w =>
      w.type === type ? { ...w, enabled: !w.enabled } : w
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Ambient Agent CRM Setup
              </h1>
              <p className="mt-2 text-slate-600">
                Connect your CRM and data sources to automate your workflow
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                ✓ Auto-sync enabled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'crm'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CRM Connections
          </button>
          <button
            onClick={() => setActiveTab('watchers')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'watchers'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Sources
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'rules'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Automation Rules
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Connect Your CRM
              </h2>
              <p className="text-slate-600 mb-6">
                Connect one or more CRM systems. Your data stays in your CRM—we just help keep it updated.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crmConnections.map((crm) => (
                  <div
                    key={crm.id}
                    className="border border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                          {crm.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{crm.name}</h3>
                          {crm.connected ? (
                            <span className="text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Connected
                            </span>
                          ) : (
                            <span className="text-sm text-slate-500">Not connected</span>
                          )}
                        </div>
                      </div>
                      {crm.connected && (
                        <button className="text-slate-400 hover:text-slate-600">
                          <Settings className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {crm.connected && crm.lastSync && (
                      <p className="text-sm text-slate-500 mb-4">
                        Last synced: {crm.lastSync}
                      </p>
                    )}

                    {crm.connected ? (
                      <button className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                        Configure Settings
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnectCRM(crm.id)}
                        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        Connect {crm.name}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Getting Started
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                    <li>Connect your CRM (we recommend starting with HubSpot)</li>
                    <li>Enable data sources (Gmail, Calendar) in the next tab</li>
                    <li>Configure automation rules to match your workflow</li>
                    <li>Enable auto-sync or review changes manually via Slack</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'watchers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Data Sources (Watchers)
              </h2>
              <p className="text-slate-600 mb-6">
                Enable the sources you want to monitor. We'll watch for sales signals and update your CRM automatically.
              </p>

              <div className="space-y-4">
                {watchers.map((watcher) => (
                  <div
                    key={watcher.type}
                    className="border border-slate-200 rounded-lg p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {watcher.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{watcher.name}</h3>
                        <p className="text-sm text-slate-500">
                          {watcher.enabled
                            ? 'Actively monitoring for updates'
                            : 'Not enabled'}
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watcher.enabled}
                        onChange={() => toggleWatcher(watcher.type)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Watcher Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm text-slate-600 mb-1">Events Today</p>
                <p className="text-3xl font-bold text-slate-900">247</p>
                <p className="text-sm text-green-600 mt-2">↑ 12% from yesterday</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm text-slate-600 mb-1">Actions Created</p>
                <p className="text-3xl font-bold text-slate-900">18</p>
                <p className="text-sm text-blue-600 mt-2">3 pending approval</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm text-slate-600 mb-1">Auto-sync Rate</p>
                <p className="text-3xl font-bold text-slate-900">94%</p>
                <p className="text-sm text-slate-600 mt-2">High confidence updates</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Automation Rules
              </h2>
              <p className="text-slate-600 mb-6">
                Configure when and how the agent should update your CRM.
              </p>

              <div className="space-y-4">
                {/* Rule 1 */}
                <div className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Post-Meeting Updates
                      </h3>
                      <p className="text-sm text-slate-600">
                        When a meeting ends, create activity log and update deal stage
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      Calendar
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Auto-approve
                    </span>
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Email with Purchase Order
                      </h3>
                      <p className="text-sm text-slate-600">
                        Create or update deal when email contains PO attachment
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      Gmail
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Requires approval
                    </span>
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        No-Show Detection
                      </h3>
                      <p className="text-sm text-slate-600">
                        If attendee doesn't join meeting, reschedule and mark as at-risk
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      Calendar
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Auto-approve
                    </span>
                  </div>
                </div>
              </div>

              <button className="mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                + Add Custom Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

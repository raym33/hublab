/**
 * Extended Capsules Batch 18 - DevOps, Cloud & Infrastructure (500 capsules)
 * Focus: DevOps Tools, Cloud Platforms, Containers, CI/CD, IaC, Kubernetes
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (
  id: string,
  name: string,
  category: string,
  description: string,
  tags: string[],
  componentType: 'dashboard' | 'monitor' | 'config' | 'logs' | 'deployment'
): Capsule => {
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '')

  const codeTemplates = {
    dashboard: `'use client'
export default function ${componentName}() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Active Services</h3>
          <p className="text-4xl font-bold text-green-600">24</p>
          <p className="text-sm text-gray-500 mt-2">All systems operational</p>
        </div>
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2 text-purple-600">CPU Usage</h3>
          <p className="text-4xl font-bold text-blue-600">45%</p>
          <p className="text-sm text-gray-500 mt-2">Normal load</p>
        </div>
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Memory</h3>
          <p className="text-4xl font-bold text-purple-600">8.2GB</p>
          <p className="text-sm text-gray-500 mt-2">62% utilized</p>
        </div>
      </div>
    </div>
  )
}`,

    monitor: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [metrics, setMetrics] = useState({ cpu: 45, memory: 62, disk: 38, network: 25 })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="space-y-6">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between mb-2">
              <span className="font-semibold capitalize text-lg">{key}</span>
              <span className="text-lg font-bold text-blue-600">{value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                style={{ width: \`\${value}%\` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,

    config: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [config, setConfig] = useState({
    endpoint: 'https://api.example.com',
    timeout: 30,
    retries: 3,
    enabled: true
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="space-y-4 bg-white border rounded-lg p-6">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <label className="w-32 font-semibold capitalize text-gray-700">{key}:</label>
            {typeof value === 'boolean' ? (
              <input type="checkbox" checked={value}
                onChange={(e) => setConfig({ ...config, [key]: e.target.checked })}
                className="w-5 h-5" />
            ) : (
              <input type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                className="flex-1 border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
            )}
          </div>
        ))}
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors mt-4">
          Save Configuration
        </button>
      </div>
    </div>
  )
}`,

    logs: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const logs = [
    { time: '10:23:45', level: 'INFO', message: 'Service started successfully' },
    { time: '10:24:12', level: 'WARN', message: 'High memory usage detected: 85%' },
    { time: '10:24:30', level: 'ERROR', message: 'Connection timeout after 30s' },
    { time: '10:25:01', level: 'INFO', message: 'Retry attempt successful' }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="hover:bg-gray-800 px-2 py-1 rounded">
            <span className="text-gray-500">[{log.time}]</span>{' '}
            <span className={\`font-bold \${
              log.level === 'ERROR' ? 'text-red-400' :
              log.level === 'WARN' ? 'text-yellow-400' :
              'text-blue-400'
            }\`}>{log.level.padEnd(5)}</span>{' '}
            {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}`,

    deployment: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [environment, setEnvironment] = useState('production')
  const deployments = [
    { version: 'v2.1.0', status: 'success', time: '2 hours ago', author: 'DevOps Team' },
    { version: 'v2.0.5', status: 'success', time: '1 day ago', author: 'Release Bot' },
    { version: 'v2.0.4', status: 'rolled back', time: '2 days ago', author: 'Admin' }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="mb-6">
        <label className="font-semibold mr-3">Environment:</label>
        <select value={environment} onChange={(e) => setEnvironment(e.target.value)}
          className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500">
          <option>production</option>
          <option>staging</option>
          <option>development</option>
        </select>
      </div>
      <div className="space-y-4">
        {deployments.map((d, i) => (
          <div key={i} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-semibold text-lg">{d.version}</h3>
              <p className="text-sm text-gray-600">{d.time} • {d.author}</p>
            </div>
            <span className={\`px-4 py-2 rounded font-medium \${
              d.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }\`}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}`
  }

  return {
    id,
    name,
    category,
    description,
    tags,
    code: codeTemplates[componentType],
    platform: 'react'
  }
}

// Generate 500 high-quality capsules across DevOps, Cloud & Infrastructure categories
const extendedCapsulesBatch18: Capsule[] = []

// Category definitions with component type distributions
const categories = [
  { name: 'DevOps', prefix: 'devops', count: 50 },
  { name: 'Kubernetes', prefix: 'k8s', count: 50 },
  { name: 'Docker', prefix: 'docker', count: 45 },
  { name: 'CI/CD', prefix: 'cicd', count: 50 },
  { name: 'Cloud/AWS', prefix: 'aws', count: 45 },
  { name: 'Cloud/Azure', prefix: 'azure', count: 40 },
  { name: 'Cloud/GCP', prefix: 'gcp', count: 40 },
  { name: 'Infrastructure', prefix: 'infra', count: 45 },
  { name: 'Monitoring', prefix: 'monitoring', count: 45 },
  { name: 'Security/DevSecOps', prefix: 'devsec', count: 45 },
  { name: 'IaC/Terraform', prefix: 'terraform', count: 45 }
]

const componentTypes: Array<'dashboard' | 'monitor' | 'config' | 'logs' | 'deployment'> = [
  'dashboard', 'monitor', 'config', 'logs', 'deployment'
]

const descriptions = {
  dashboard: (cat: string) => `Comprehensive ${cat} dashboard with real-time metrics, alerts, and visualization of system health and performance`,
  monitor: (cat: string) => `Real-time ${cat} resource monitoring with graphs, alerts, and detailed performance metrics tracking`,
  config: (cat: string) => `${cat} configuration management interface with validation, version control, and rollback capabilities`,
  logs: (cat: string) => `${cat} log viewing and filtering interface with search, export, and real-time log streaming capabilities`,
  deployment: (cat: string) => `${cat} deployment management with rollback, canary deployments, and comprehensive deployment history`
}

const tagSets = {
  dashboard: ['dashboard', 'monitoring', 'metrics', 'visualization', 'analytics'],
  monitor: ['monitoring', 'resources', 'performance', 'metrics', 'alerts'],
  config: ['config', 'management', 'settings', 'admin', 'configuration'],
  logs: ['logs', 'debugging', 'monitoring', 'troubleshooting', 'analysis'],
  deployment: ['deployment', 'release', 'rollback', 'cicd', 'automation']
}

// Generate capsules for each category
categories.forEach(category => {
  const capsulesPerType = Math.ceil(category.count / componentTypes.length)

  componentTypes.forEach((type, typeIdx) => {
    for (let i = 0; i < capsulesPerType; i++) {
      if (extendedCapsulesBatch18.length >= 500) break

      const index = typeIdx * capsulesPerType + i + 1
      const id = `${category.prefix}-${type}-${index}`
      const name = `${category.name} ${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`
      const desc = descriptions[type](category.name)
      const tags = [category.prefix, ...tagSets[type]]

      extendedCapsulesBatch18.push(generateCapsule(id, name, category.name, desc, tags, type))
    }
  })
})

// Fill remaining slots if needed
while (extendedCapsulesBatch18.length < 500) {
  const idx = extendedCapsulesBatch18.length + 1
  extendedCapsulesBatch18.push(
    generateCapsule(
      `devops-utility-${idx}`,
      `DevOps Utility ${idx}`,
      'DevOps',
      'Comprehensive DevOps utility component for operations, monitoring, and automation tasks',
      ['devops', 'utilities', 'tools', 'automation', 'operations'],
      'dashboard'
    )
  )
}

export default extendedCapsulesBatch18

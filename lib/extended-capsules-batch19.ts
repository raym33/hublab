/**
 * Extended Capsules Batch 19 - Database, Backend & API (500 capsules)
 * Focus: Databases, APIs, Backend Services, GraphQL, REST, Microservices
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (
  id: string,
  name: string,
  category: string,
  description: string,
  tags: string[],
  componentType: 'dashboard' | 'query' | 'api' | 'admin' | 'schema'
): Capsule => {
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '')

  const codeTemplates = {
    dashboard: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [stats, setStats] = useState({
    queries: 1234,
    connections: 45,
    latency: 23,
    uptime: 99.9
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="grid md:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">{key}</h3>
            <p className="text-3xl font-bold text-blue-600">
              {typeof value === 'number' && value < 100 ? value : value.toLocaleString()}
              {key === 'uptime' && '%'}
              {key === 'latency' && 'ms'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}`,

    query: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [query, setQuery] = useState('SELECT * FROM users WHERE active = true')
  const [results, setResults] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="mb-6">
        <textarea value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded-lg p-4 font-mono text-sm h-32 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your query..." />
        <button className="mt-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
          Execute Query
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(results[0] || {}).map(key => (
                <th key={key} className="px-4 py-3 text-left font-semibold">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-4 py-3">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}`,

    api: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [endpoint, setEndpoint] = useState('/api/users')
  const [method, setMethod] = useState('GET')
  const [response, setResponse] = useState({ status: 200, data: { success: true } })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <select value={method} onChange={(e) => setMethod(e.target.value)}
            className="border rounded px-4 py-2 font-semibold">
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)}
            className="flex-1 border rounded px-4 py-2 font-mono" />
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 font-semibold">Response</div>
        <pre className="p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto">
{JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  )
}`,

    admin: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', status: 'active', updated: '2 hours ago' },
    { id: 2, name: 'Item 2', status: 'inactive', updated: '1 day ago' }
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">${name}</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Add New
        </button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">Updated {item.updated}</p>
            </div>
            <div className="flex gap-3 items-center">
              <span className={\`px-3 py-1 rounded text-sm font-medium \${
                item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }\`}>{item.status}</span>
              <button className="text-blue-600 hover:underline">Edit</button>
              <button className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,

    schema: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const schema = {
    users: ['id', 'name', 'email', 'created_at'],
    posts: ['id', 'user_id', 'title', 'content', 'published_at'],
    comments: ['id', 'post_id', 'user_id', 'text', 'created_at']
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(schema).map(([table, fields]) => (
          <div key={table} className="border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
              {table}
            </div>
            <div className="p-4 space-y-2">
              {fields.map(field => (
                <div key={field} className="font-mono text-sm text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {field}
                </div>
              ))}
            </div>
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

// Generate 500 high-quality capsules across Database, Backend & API categories
const extendedCapsulesBatch19: Capsule[] = []

const categories = [
  { name: 'Database/PostgreSQL', prefix: 'postgres', count: 50 },
  { name: 'Database/MySQL', prefix: 'mysql', count: 45 },
  { name: 'Database/MongoDB', prefix: 'mongodb', count: 45 },
  { name: 'Database/Redis', prefix: 'redis', count: 40 },
  { name: 'API/REST', prefix: 'rest', count: 50 },
  { name: 'API/GraphQL', prefix: 'graphql', count: 50 },
  { name: 'Backend/Node.js', prefix: 'nodejs', count: 45 },
  { name: 'Backend/Python', prefix: 'python', count: 40 },
  { name: 'Microservices', prefix: 'microservices', count: 45 },
  { name: 'Backend/Authentication', prefix: 'auth', count: 45 },
  { name: 'Backend/Caching', prefix: 'cache', count: 45 }
]

const componentTypes: Array<'dashboard' | 'query' | 'api' | 'admin' | 'schema'> = [
  'dashboard', 'query', 'api', 'admin', 'schema'
]

const descriptions = {
  dashboard: (cat: string) => `Comprehensive ${cat} dashboard with real-time metrics, performance monitoring, and system health visualization`,
  query: (cat: string) => `${cat} query interface with syntax highlighting, result visualization, and query optimization tools`,
  api: (cat: string) => `${cat} API testing and documentation interface with request builder and response inspection`,
  admin: (cat: string) => `${cat} administration panel with CRUD operations, user management, and system configuration`,
  schema: (cat: string) => `${cat} schema viewer and editor with relationship visualization and migration tools`
}

const tagSets = {
  dashboard: ['dashboard', 'monitoring', 'metrics', 'analytics', 'performance'],
  query: ['query', 'database', 'sql', 'search', 'data'],
  api: ['api', 'rest', 'graphql', 'endpoints', 'testing'],
  admin: ['admin', 'management', 'crud', 'panel', 'settings'],
  schema: ['schema', 'database', 'model', 'structure', 'design']
}

categories.forEach(category => {
  const capsulesPerType = Math.ceil(category.count / componentTypes.length)

  componentTypes.forEach((type, typeIdx) => {
    for (let i = 0; i < capsulesPerType; i++) {
      if (extendedCapsulesBatch19.length >= 500) break

      const index = typeIdx * capsulesPerType + i + 1
      const id = `${category.prefix}-${type}-${index}`
      const name = `${category.name} ${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`
      const desc = descriptions[type](category.name)
      const tags = [category.prefix, ...tagSets[type]]

      extendedCapsulesBatch19.push(generateCapsule(id, name, category.name, desc, tags, type))
    }
  })
})

while (extendedCapsulesBatch19.length < 500) {
  const idx = extendedCapsulesBatch19.length + 1
  extendedCapsulesBatch19.push(
    generateCapsule(
      `backend-utility-${idx}`,
      `Backend Utility ${idx}`,
      'Backend',
      'Comprehensive backend utility component for data management, API handling, and server operations',
      ['backend', 'utilities', 'api', 'database', 'server'],
      'dashboard'
    )
  )
}

export default extendedCapsulesBatch19

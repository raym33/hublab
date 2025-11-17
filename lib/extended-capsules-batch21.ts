/**
 * Extended Capsules Batch 21 - Data Science, Analytics & AI/ML (500 capsules)
 * Focus: Machine Learning, Data Analysis, Visualization, Statistics, Predictive Analytics
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (
  id: string,
  name: string,
  category: string,
  description: string,
  tags: string[],
  componentType: 'chart' | 'model' | 'analysis' | 'pipeline' | 'visualization'
): Capsule => {
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '')

  const codeTemplates = {
    chart: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [data, setData] = useState([
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 82 },
    { label: 'Apr', value: 90 },
    { label: 'May', value: 95 },
    { label: 'Jun', value: 88 }
  ])

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-end gap-4 h-64">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end">
              <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                style={{ height: \`\${(item.value / maxValue) * 100}%\` }}>
                <div className="text-white text-sm font-bold p-2 text-center">{item.value}</div>
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`,

    model: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [model, setModel] = useState({
    name: 'Predictive Model',
    accuracy: 0.94,
    precision: 0.92,
    recall: 0.89,
    f1Score: 0.90
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Model Metrics</h3>
          <div className="space-y-4">
            {Object.entries(model).filter(([k]) => k !== 'name').map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-blue-600 font-bold">{(value * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                    style={{ width: \`\${value * 100}%\` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Model Info</h3>
          <div className="space-y-3">
            <p className="text-gray-700"><span className="font-semibold">Name:</span> {model.name}</p>
            <p className="text-gray-700"><span className="font-semibold">Type:</span> Classification</p>
            <p className="text-gray-700"><span className="font-semibold">Algorithm:</span> Random Forest</p>
            <p className="text-gray-700"><span className="font-semibold">Status:</span> <span className="text-green-600">Active</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}`,

    analysis: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [analysis, setAnalysis] = useState({
    dataset: 'Customer Data',
    records: 15420,
    features: 24,
    missing: 0.8,
    outliers: 125
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(analysis).map(([key, value]) => (
          <div key={key} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
              {key.replace(/([A-Z])/g, ' $1')}
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {typeof value === 'number' && value < 10 ? value.toFixed(1) + '%' : value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}`,

    pipeline: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [pipeline, setPipeline] = useState([
    { step: 'Data Collection', status: 'completed', duration: '2m 30s' },
    { step: 'Data Cleaning', status: 'completed', duration: '5m 15s' },
    { step: 'Feature Engineering', status: 'running', duration: '3m 20s' },
    { step: 'Model Training', status: 'pending', duration: '--' },
    { step: 'Evaluation', status: 'pending', duration: '--' }
  ])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="space-y-4">
        {pipeline.map((step, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className={\`text-2xl \${
                  step.status === 'completed' ? 'text-green-600' :
                  step.status === 'running' ? 'text-blue-600' :
                  'text-gray-400'
                }\`}>
                  {step.status === 'completed' ? '✓' : step.status === 'running' ? '⟳' : '○'}
                </span>
                <div>
                  <h3 className="font-semibold text-lg">{step.step}</h3>
                  <p className="text-sm text-gray-600">{step.duration}</p>
                </div>
              </div>
              <span className={\`px-4 py-2 rounded font-medium \${
                step.status === 'completed' ? 'bg-green-100 text-green-700' :
                step.status === 'running' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }\`}>{step.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,

    visualization: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [view, setView] = useState('scatter')
  const data = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100
  }))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="mb-6">
        <select value={view} onChange={(e) => setView(e.target.value)}
          className="border rounded px-4 py-2">
          <option value="scatter">Scatter Plot</option>
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>
      <div className="border rounded-lg p-6 bg-white h-96 flex items-center justify-center">
        <div className="text-gray-400">
          <svg width="400" height="300" className="border-l border-b border-gray-300">
            {data.map((point, i) => (
              <circle key={i} cx={point.x * 3.8} cy={280 - point.y * 2.8}
                r="4" fill="#3B82F6" opacity="0.6" />
            ))}
          </svg>
        </div>
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

const extendedCapsulesBatch21: Capsule[] = []

const categories = [
  { name: 'Data Science', prefix: 'ds', count: 60 },
  { name: 'Machine Learning', prefix: 'ml', count: 60 },
  { name: 'Data Visualization', prefix: 'dataviz', count: 50 },
  { name: 'Statistics', prefix: 'stats', count: 50 },
  { name: 'Predictive Analytics', prefix: 'predictive', count: 50 },
  { name: 'Big Data', prefix: 'bigdata', count: 45 },
  { name: 'Deep Learning', prefix: 'dl', count: 45 },
  { name: 'NLP', prefix: 'nlp', count: 40 },
  { name: 'Computer Vision', prefix: 'cv', count: 40 },
  { name: 'Time Series', prefix: 'timeseries', count: 40 },
  { name: 'Data Engineering', prefix: 'dataeng', count: 20 }
]

const componentTypes: Array<'chart' | 'model' | 'analysis' | 'pipeline' | 'visualization'> = [
  'chart', 'model', 'analysis', 'pipeline', 'visualization'
]

const descriptions = {
  chart: (cat: string) => `Interactive ${cat} chart with dynamic data rendering, real-time updates, and comprehensive visualization options`,
  model: (cat: string) => `${cat} predictive model with accuracy metrics, performance tracking, and model evaluation tools`,
  analysis: (cat: string) => `Comprehensive ${cat} analysis dashboard with statistical insights, data profiling, and quality metrics`,
  pipeline: (cat: string) => `${cat} data pipeline with ETL processes, workflow orchestration, and status monitoring`,
  visualization: (cat: string) => `Advanced ${cat} visualization with interactive charts, custom plots, and data exploration tools`
}

const tagSets = {
  chart: ['chart', 'visualization', 'data', 'analytics', 'graphs'],
  model: ['model', 'ml', 'prediction', 'training', 'evaluation'],
  analysis: ['analysis', 'statistics', 'insights', 'profiling', 'metrics'],
  pipeline: ['pipeline', 'etl', 'workflow', 'automation', 'processing'],
  visualization: ['visualization', 'interactive', 'charts', 'plots', 'explore']
}

categories.forEach(category => {
  const capsulesPerType = Math.ceil(category.count / componentTypes.length)

  componentTypes.forEach((type, typeIdx) => {
    for (let i = 0; i < capsulesPerType; i++) {
      if (extendedCapsulesBatch21.length >= 500) break

      const index = typeIdx * capsulesPerType + i + 1
      const id = `${category.prefix}-${type}-${index}`
      const name = `${category.name} ${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`
      const desc = descriptions[type](category.name)
      const tags = [category.prefix, ...tagSets[type]]

      extendedCapsulesBatch21.push(generateCapsule(id, name, category.name, desc, tags, type))
    }
  })
})

while (extendedCapsulesBatch21.length < 500) {
  const idx = extendedCapsulesBatch21.length + 1
  extendedCapsulesBatch21.push(
    generateCapsule(
      `data-utility-${idx}`,
      `Data Utility ${idx}`,
      'Data Science',
      'Comprehensive data science utility component for analysis, visualization, and insights',
      ['data', 'utilities', 'analytics', 'science', 'tools'],
      'chart'
    )
  )
}

export default extendedCapsulesBatch21

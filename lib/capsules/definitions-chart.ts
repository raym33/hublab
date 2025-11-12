import { CapsuleDefinition } from './types'

/**
 * Chart & Visualization Capsules
 * Data visualization and chart components
 */

export const CHART_CAPSULES: CapsuleDefinition[] = [
  // Bar Chart
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    description: 'Simple bar chart visualization',
    category: 'chart',
    props: [
      { name: 'data', type: 'array', required: true, default: [
        { label: 'Jan', value: 30 },
        { label: 'Feb', value: 45 },
        { label: 'Mar', value: 60 },
        { label: 'Apr', value: 40 }
      ], description: 'Chart data' },
      { name: 'color', type: 'string', required: false, default: 'blue', description: 'Bar color' }
    ],
    dependencies: [],
    code: `
function BarChart({ data = [{ label: 'Jan', value: 30 }], color = 'blue' }) {
  const maxValue = Math.max(...data.map(d => d.value))

  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-end justify-between gap-2 h-64">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex-1 w-full flex items-end justify-center">
              <div
                className={\`w-full \${colors[color] || colors.blue} rounded-t transition-all hover:opacity-80\`}
                style={{ height: \`\${(item.value / maxValue) * 100}%\` }}
              />
            </div>
            <div className="text-xs text-gray-600 text-center">{item.label}</div>
            <div className="text-xs font-semibold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // Line Chart
  {
    id: 'line-chart',
    name: 'Line Chart',
    description: 'Simple line chart visualization',
    category: 'chart',
    props: [
      { name: 'data', type: 'array', required: true, default: [20, 35, 30, 45, 40, 50], description: 'Data points' },
      { name: 'labels', type: 'array', required: false, default: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], description: 'X-axis labels' }
    ],
    dependencies: [],
    code: `
function LineChart({ data = [20, 35, 30, 45, 40, 50], labels = [] }) {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="relative h-64">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={data.map((value, idx) => {
              const x = (idx / (data.length - 1)) * 100
              const y = 100 - ((value - minValue) / (maxValue - minValue)) * 100
              return \`\${x},\${y}\`
            }).join(' ')}
          />
          {data.map((value, idx) => {
            const x = (idx / (data.length - 1)) * 100
            const y = 100 - ((value - minValue) / (maxValue - minValue)) * 100
            return (
              <circle key={idx} cx={x} cy={y} r="2" fill="#3B82F6" />
            )
          })}
        </svg>
      </div>
      {labels.length > 0 && (
        <div className="flex justify-between mt-4 text-xs text-gray-600">
          {labels.map((label, idx) => (
            <div key={idx}>{label}</div>
          ))}
        </div>
      )}
    </div>
  )
}`
  },

  // Pie Chart
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    description: 'Circular pie chart',
    category: 'chart',
    props: [
      { name: 'data', type: 'array', required: true, default: [
        { label: 'Category A', value: 30, color: '#3B82F6' },
        { label: 'Category B', value: 20, color: '#10B981' },
        { label: 'Category C', value: 50, color: '#F59E0B' }
      ], description: 'Pie chart data' }
    ],
    dependencies: [],
    code: `
function PieChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-6">
        <svg className="w-48 h-48" viewBox="0 0 100 100">
          {data.map((item, idx) => {
            const percentage = item.value / total
            const angle = percentage * 360
            const startAngle = currentAngle
            currentAngle += angle

            const x1 = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)
            const y1 = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)
            const x2 = 50 + 50 * Math.cos((startAngle + angle - 90) * Math.PI / 180)
            const y2 = 50 + 50 * Math.sin((startAngle + angle - 90) * Math.PI / 180)
            const largeArc = angle > 180 ? 1 : 0

            return (
              <path
                key={idx}
                d={\`M 50 50 L \${x1} \${y1} A 50 50 0 \${largeArc} 1 \${x2} \${y2} Z\`}
                fill={item.color}
              />
            )
          })}
        </svg>
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`
  },

  // Donut Chart
  {
    id: 'donut-chart',
    name: 'Donut Chart',
    description: 'Donut chart with center value',
    category: 'chart',
    props: [
      { name: 'value', type: 'number', required: true, default: 75, description: 'Percentage value' },
      { name: 'label', type: 'string', required: false, default: 'Complete', description: 'Center label' }
    ],
    dependencies: [],
    code: `
function DonutChart({ value = 75, label = 'Complete' }) {
  const percentage = Math.min(100, Math.max(0, value))
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="bg-white p-6 rounded-lg shadow-md inline-block">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="40"
            stroke="#E5E7EB"
            strokeWidth="16"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="40"
            stroke="#3B82F6"
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900">{percentage}%</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  )
}`
  },

  // Sparkline
  {
    id: 'sparkline',
    name: 'Sparkline',
    description: 'Compact inline line chart',
    category: 'chart',
    props: [
      { name: 'data', type: 'array', required: true, default: [10, 15, 13, 17, 14, 20, 18, 22, 19, 25], description: 'Data points' },
      { name: 'color', type: 'string', required: false, default: '#3B82F6', description: 'Line color' }
    ],
    dependencies: [],
    code: `
function Sparkline({ data = [10, 15, 13, 17, 14, 20], color = '#3B82F6' }) {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)

  return (
    <div className="inline-block">
      <svg className="w-32 h-8" preserveAspectRatio="none" viewBox="0 0 100 30">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={data.map((value, idx) => {
            const x = (idx / (data.length - 1)) * 100
            const y = 30 - ((value - minValue) / (maxValue - minValue)) * 30
            return \`\${x},\${y}\`
          }).join(' ')}
        />
      </svg>
    </div>
  )
}`
  },

  // Gauge Chart
  {
    id: 'gauge-chart',
    name: 'Gauge Chart',
    description: 'Semicircular gauge/meter',
    category: 'chart',
    props: [
      { name: 'value', type: 'number', required: true, default: 65, description: 'Gauge value (0-100)' },
      { name: 'label', type: 'string', required: false, default: 'Performance', description: 'Gauge label' }
    ],
    dependencies: [],
    code: `
function GaugeChart({ value = 65, label = 'Performance' }) {
  const percentage = Math.min(100, Math.max(0, value))
  const angle = (percentage / 100) * 180

  return (
    <div className="bg-white p-6 rounded-lg shadow-md inline-block">
      <div className="relative w-48 h-24">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (percentage / 100) * 251.2}
          />
          <line
            x1="100"
            y1="90"
            x2={100 + 70 * Math.cos((angle - 180) * Math.PI / 180)}
            y2={90 + 70 * Math.sin((angle - 180) * Math.PI / 180)}
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
          <div className="text-xs text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  )
}`
  },

  // Area Chart
  {
    id: 'area-chart',
    name: 'Area Chart',
    description: 'Filled area chart',
    category: 'chart',
    props: [
      { name: 'data', type: 'array', required: true, default: [10, 25, 20, 35, 30, 45, 40], description: 'Data points' }
    ],
    dependencies: [],
    code: `
function AreaChart({ data = [10, 25, 20, 35, 30, 45, 40] }) {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)

  const points = data.map((value, idx) => {
    const x = (idx / (data.length - 1)) * 100
    const y = 100 - ((value - minValue) / (maxValue - minValue)) * 100
    return \`\${x},\${y}\`
  }).join(' ')

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="relative h-64">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={\`0,100 \${points} 100,100\`}
            fill="url(#areaGradient)"
          />
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={points}
          />
        </svg>
      </div>
    </div>
  )
}`
  },

  // Heatmap
  {
    id: 'heatmap',
    name: 'Heatmap',
    description: 'Color-coded heatmap grid',
    category: 'chart',
    props: [
      { name: 'data', type: 'array', required: true, default: [
        [10, 20, 30, 40],
        [15, 25, 35, 45],
        [12, 22, 32, 42]
      ], description: 'Grid data' }
    ],
    dependencies: [],
    code: `
function Heatmap({ data = [[10, 20, 30], [15, 25, 35]] }) {
  const flatData = data.flat()
  const maxValue = Math.max(...flatData)
  const minValue = Math.min(...flatData)

  const getColor = (value) => {
    const intensity = (value - minValue) / (maxValue - minValue)
    const blue = Math.round(59 + (139 - 59) * intensity)
    const green = Math.round(130 + (0 - 130) * (1 - intensity))
    return \`rgb(59, \${green}, \${blue})\`
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="inline-block">
        {data.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((cell, cellIdx) => (
              <div
                key={cellIdx}
                className="w-12 h-12 flex items-center justify-center text-white text-xs font-semibold border border-white"
                style={{ backgroundColor: getColor(cell) }}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}`
  }
]

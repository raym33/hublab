/**
 * Cápsulas Avanzadas V2 - Migradas del sistema anterior
 * Incluye: Data Visualization, Forms, Layouts, Animations
 */

import { CapsuleDefinition } from './types'

// DATA VISUALIZATION CAPSULES (10 cápsulas)
export const DATA_VIZ_CAPSULES: CapsuleDefinition[] = [
  // Simple Chart (sin dependencias externas)
  {
    id: 'chart-simple',
    name: 'Simple Chart',
    description: 'Basic chart visualization',
    category: 'ui',
    props: [
      { name: 'data', type: 'array', required: true, default: [10, 25, 40, 30, 50], description: 'Chart data values' },
      { name: 'type', type: 'string', required: false, default: 'bar', description: 'Chart type: bar, line' },
      { name: 'title', type: 'string', required: false, default: 'Data Chart', description: 'Chart title' }
    ],
    dependencies: [],
    code: `
function SimpleChart({ data = [10, 25, 40, 30, 50], type = 'bar', title = 'Data Chart' }) {
  const maxValue = Math.max(...data)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>

      <div className="flex items-end gap-2 h-48">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs font-semibold text-gray-700">{value}</div>
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all"
                style={{ height: \`\${height}%\` }}
              />
              <div className="text-xs text-gray-600">{index + 1}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}`
  },

  // Stat Card
  {
    id: 'stat-card',
    name: 'Stat Card',
    description: 'Statistical display card with trend',
    category: 'ui',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Total Users', description: 'Stat label' },
      { name: 'value', type: 'string', required: true, default: '1,234', description: 'Stat value' },
      { name: 'change', type: 'number', required: false, default: 12.5, description: 'Percentage change' },
      { name: 'icon', type: 'string', required: false, default: '👥', description: 'Icon emoji' }
    ],
    dependencies: [],
    code: `
function StatCard({ label = 'Total Users', value = '1,234', change = 12.5, icon = '👥' }) {
  const isPositive = change >= 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {change !== undefined && (
          <span className={\`text-sm font-semibold \${isPositive ? 'text-green-600' : 'text-red-600'}\`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}`
  },

  // Data Table
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Sortable data table',
    category: 'ui',
    props: [
      { name: 'columns', type: 'array', required: true, default: ['Name', 'Age', 'City'], description: 'Table columns' },
      { name: 'rows', type: 'array', required: true, default: [
        ['John Doe', '28', 'New York'],
        ['Jane Smith', '34', 'Los Angeles'],
        ['Bob Johnson', '42', 'Chicago']
      ], description: 'Table rows' }
    ],
    dependencies: [],
    code: `
function DataTable({ columns = ['Name', 'Age', 'City'], rows = [['John', '28', 'NYC']] }) {
  const [sortedRows, setSortedRows] = React.useState(rows)
  const [sortCol, setSortCol] = React.useState(null)
  const [sortAsc, setSortAsc] = React.useState(true)

  const handleSort = (colIndex) => {
    const sorted = [...sortedRows].sort((a, b) => {
      if (sortAsc) {
        return a[colIndex] > b[colIndex] ? 1 : -1
      } else {
        return a[colIndex] < b[colIndex] ? 1 : -1
      }
    })
    setSortedRows(sorted)
    setSortCol(colIndex)
    setSortAsc(!sortAsc)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                onClick={() => handleSort(index)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                {col} {sortCol === index && (sortAsc ? '↑' : '↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}`
  },

  // KPI Grid
  {
    id: 'kpi-grid',
    name: 'KPI Grid',
    description: 'Grid of key performance indicators',
    category: 'layout',
    props: [
      { name: 'kpis', type: 'array', required: true, default: [
        { label: 'Revenue', value: '$125K', change: 12.5 },
        { label: 'Users', value: '1,234', change: 8.2 },
        { label: 'Orders', value: '456', change: -2.1 },
        { label: 'Growth', value: '23%', change: 15.3 }
      ], description: 'KPI data' }
    ],
    dependencies: [],
    code: `
function KPIGrid({ kpis = [{ label: 'Metric', value: '100', change: 10 }] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const isPositive = kpi.change >= 0
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</div>
            <div className={\`text-sm font-semibold \${isPositive ? 'text-green-600' : 'text-red-600'}\`}>
              {isPositive ? '↑' : '↓'} {Math.abs(kpi.change)}%
            </div>
          </div>
        )
      })}
    </div>
  )
}`
  }
]

// LAYOUT CAPSULES (10 cápsulas)
export const LAYOUT_CAPSULES: CapsuleDefinition[] = [
  // Grid Layout
  {
    id: 'grid-layout',
    name: 'Grid Layout',
    description: 'Responsive grid container',
    category: 'layout',
    props: [
      { name: 'columns', type: 'number', required: false, default: 3, description: 'Number of columns' },
      { name: 'gap', type: 'string', required: false, default: 'md', description: 'Gap size: sm, md, lg' },
      { name: 'items', type: 'array', required: true, default: ['Item 1', 'Item 2', 'Item 3'], description: 'Grid items' }
    ],
    dependencies: [],
    code: `
function GridLayout({ columns = 3, gap = 'md', items = ['Item 1', 'Item 2', 'Item 3'] }) {
  const gaps = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }

  return (
    <div className={\`grid grid-cols-1 md:grid-cols-\${columns} \${gaps[gap]}\`}>
      {items.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {item}
        </div>
      ))}
    </div>
  )
}`
  },

  // Flex Container
  {
    id: 'flex-container',
    name: 'Flex Container',
    description: 'Flexible box layout',
    category: 'layout',
    props: [
      { name: 'direction', type: 'string', required: false, default: 'row', description: 'Direction: row, column' },
      { name: 'justify', type: 'string', required: false, default: 'start', description: 'Justify: start, center, end, between, around' },
      { name: 'items', type: 'array', required: true, default: ['Box 1', 'Box 2', 'Box 3'], description: 'Flex items' }
    ],
    dependencies: [],
    code: `
function FlexContainer({ direction = 'row', justify = 'start', items = ['Box 1', 'Box 2', 'Box 3'] }) {
  const directions = { row: 'flex-row', column: 'flex-col' }
  const justifies = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  }

  return (
    <div className={\`flex \${directions[direction]} \${justifies[justify]} gap-4\`}>
      {items.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {item}
        </div>
      ))}
    </div>
  )
}`
  },

  // Split Panel
  {
    id: 'split-panel',
    name: 'Split Panel',
    description: 'Two-column split layout',
    category: 'layout',
    props: [
      { name: 'leftContent', type: 'string', required: true, default: 'Left Content', description: 'Left side content' },
      { name: 'rightContent', type: 'string', required: true, default: 'Right Content', description: 'Right side content' },
      { name: 'ratio', type: 'string', required: false, default: '50-50', description: 'Split ratio: 50-50, 60-40, 70-30' }
    ],
    dependencies: [],
    code: `
function SplitPanel({ leftContent = 'Left Content', rightContent = 'Right Content', ratio = '50-50' }) {
  const ratios = {
    '50-50': 'grid-cols-2',
    '60-40': 'grid-cols-[60%_40%]',
    '70-30': 'grid-cols-[70%_30%]'
  }

  return (
    <div className={\`grid \${ratios[ratio]} gap-4\`}>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {leftContent}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {rightContent}
      </div>
    </div>
  )
}`
  },

  // Container
  {
    id: 'container',
    name: 'Container',
    description: 'Centered content container',
    category: 'layout',
    props: [
      { name: 'maxWidth', type: 'string', required: false, default: 'xl', description: 'Max width: sm, md, lg, xl, 2xl' },
      { name: 'padding', type: 'string', required: false, default: 'md', description: 'Padding: sm, md, lg' },
      { name: 'content', type: 'string', required: true, default: 'Container content', description: 'Content' }
    ],
    dependencies: [],
    code: `
function Container({ maxWidth = 'xl', padding = 'md', content = 'Container content' }) {
  const widths = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl'
  }
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div className={\`mx-auto \${widths[maxWidth]} \${paddings[padding]}\`}>
      {content}
    </div>
  )
}`
  },

  // Stack
  {
    id: 'stack',
    name: 'Stack',
    description: 'Vertical stack layout',
    category: 'layout',
    props: [
      { name: 'items', type: 'array', required: true, default: ['Item 1', 'Item 2', 'Item 3'], description: 'Stack items' },
      { name: 'spacing', type: 'string', required: false, default: 'md', description: 'Spacing: sm, md, lg' }
    ],
    dependencies: [],
    code: `
function Stack({ items = ['Item 1', 'Item 2', 'Item 3'], spacing = 'md' }) {
  const spacings = { sm: 'space-y-2', md: 'space-y-4', lg: 'space-y-6' }

  return (
    <div className={\`\${spacings[spacing]}\`}>
      {items.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          {item}
        </div>
      ))}
    </div>
  )
}`
  }
]

// ANIMATION CAPSULES (5 cápsulas)
export const ANIMATION_CAPSULES: CapsuleDefinition[] = [
  // Fade In
  {
    id: 'fade-in',
    name: 'Fade In',
    description: 'Fade in animation',
    category: 'ui',
    props: [
      { name: 'content', type: 'string', required: true, default: 'Fading content', description: 'Content to animate' },
      { name: 'duration', type: 'string', required: false, default: 'slow', description: 'Duration: fast, slow' }
    ],
    dependencies: [],
    code: `
function FadeIn({ content = 'Fading content', duration = 'slow' }) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    setVisible(true)
  }, [])

  const durations = {
    fast: 'duration-300',
    slow: 'duration-1000'
  }

  return (
    <div className={\`transition-opacity \${durations[duration]} \${visible ? 'opacity-100' : 'opacity-0'}\`}>
      {content}
    </div>
  )
}`
  },

  // Slide In
  {
    id: 'slide-in',
    name: 'Slide In',
    description: 'Slide in animation',
    category: 'ui',
    props: [
      { name: 'content', type: 'string', required: true, default: 'Sliding content', description: 'Content to animate' },
      { name: 'direction', type: 'string', required: false, default: 'left', description: 'Direction: left, right, top, bottom' }
    ],
    dependencies: [],
    code: `
function SlideIn({ content = 'Sliding content', direction = 'left' }) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const directions = {
    left: visible ? 'translate-x-0' : '-translate-x-full',
    right: visible ? 'translate-x-0' : 'translate-x-full',
    top: visible ? 'translate-y-0' : '-translate-y-full',
    bottom: visible ? 'translate-y-0' : 'translate-y-full'
  }

  return (
    <div className={\`transition-transform duration-500 \${directions[direction]}\`}>
      {content}
    </div>
  )
}`
  },

  // Pulse
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Pulsing animation',
    category: 'ui',
    props: [
      { name: 'content', type: 'string', required: true, default: 'Pulsing', description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function Pulse({ content = 'Pulsing' }) {
  return (
    <div className="animate-pulse">
      {content}
    </div>
  )
}`
  },

  // Bounce
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Bounce animation',
    category: 'ui',
    props: [
      { name: 'content', type: 'string', required: true, default: 'Bouncing', description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function Bounce({ content = 'Bouncing' }) {
  return (
    <div className="animate-bounce">
      {content}
    </div>
  )
}`
  },

  // Rotate
  {
    id: 'rotate',
    name: 'Rotate',
    description: 'Rotation animation',
    category: 'ui',
    props: [
      { name: 'content', type: 'string', required: true, default: '🔄', description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function Rotate({ content = '🔄' }) {
  return (
    <div className="animate-spin">
      {content}
    </div>
  )
}`
  }
]

// Exportar todas las cápsulas avanzadas
export const ADVANCED_CAPSULES = [
  ...DATA_VIZ_CAPSULES,
  ...LAYOUT_CAPSULES,
  ...ANIMATION_CAPSULES
]

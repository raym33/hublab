import { CapsuleDefinition } from './types'

/**
 * Data Display Capsules
 * Components for displaying data and statistics
 */

export const DATA_CAPSULES: CapsuleDefinition[] = [
  // Stat Card
  {
    id: 'stat-card',
    name: 'Stat Card',
    description: 'Card displaying a statistic with label',
    category: 'data',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Total Sales', description: 'Stat label' },
      { name: 'value', type: 'string', required: true, default: '$12,345', description: 'Stat value' },
      { name: 'change', type: 'string', required: false, default: '+12%', description: 'Change indicator' },
      { name: 'icon', type: 'string', required: false, default: '💰', description: 'Icon' }
    ],
    dependencies: [],
    code: `
function StatCard({ label = 'Total Sales', value = '\\$12,345', change = '+12%', icon = '💰' }) {
  const isPositive = change.startsWith('+')

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={\`text-sm mt-2 \${isPositive ? 'text-green-600' : 'text-red-600'}\`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}`
  },

  // Progress Bar
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    description: 'Horizontal progress bar',
    category: 'data',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Progress', description: 'Progress label' },
      { name: 'value', type: 'number', required: true, default: 65, description: 'Progress value (0-100)' },
      { name: 'color', type: 'string', required: false, default: 'blue', description: 'Bar color' }
    ],
    dependencies: [],
    code: `
function ProgressBar({ label = 'Progress', value = 65, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-600">{value}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={\`h-2 rounded-full transition-all \${colors[color] || colors.blue}\`}
          style={{ width: \`\${Math.min(100, Math.max(0, value))}%\` }}
        />
      </div>
    </div>
  )
}`
  },

  // Table
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Responsive data table',
    category: 'data',
    props: [
      { name: 'headers', type: 'array', required: true, default: ['Name', 'Email', 'Role'], description: 'Table headers' },
      { name: 'rows', type: 'array', required: true, default: [
        ['John Doe', 'john@example.com', 'Admin'],
        ['Jane Smith', 'jane@example.com', 'User']
      ], description: 'Table rows' }
    ],
    dependencies: [],
    code: `
function DataTable({ headers = ['Name', 'Email', 'Role'], rows = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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

  // Badge
  {
    id: 'badge',
    name: 'Badge',
    description: 'Small status or label badge',
    category: 'data',
    props: [
      { name: 'text', type: 'string', required: true, default: 'New', description: 'Badge text' },
      { name: 'variant', type: 'string', required: false, default: 'primary', description: 'Badge variant: primary, success, warning, danger' }
    ],
    dependencies: [],
    code: `
function Badge({ text = 'New', variant = 'primary' }) {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  }

  return (
    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${variants[variant] || variants.primary}\`}>
      {text}
    </span>
  )
}`
  },

  // Avatar
  {
    id: 'avatar',
    name: 'Avatar',
    description: 'User avatar with initials fallback',
    category: 'data',
    props: [
      { name: 'name', type: 'string', required: true, default: 'John Doe', description: 'User name' },
      { name: 'image', type: 'string', required: false, default: '', description: 'Image URL' },
      { name: 'size', type: 'string', required: false, default: 'md', description: 'Size: sm, md, lg' }
    ],
    dependencies: [],
    code: `
function Avatar({ name = 'John Doe', image = '', size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={\`\${sizes[size]} rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold\`}>
      {image ? (
        <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}`
  },

  // Timeline
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Vertical timeline of events',
    category: 'data',
    props: [
      { name: 'events', type: 'array', required: true, default: [
        { title: 'Event 1', description: 'Description 1', date: '2023-01-01' },
        { title: 'Event 2', description: 'Description 2', date: '2023-02-01' }
      ], description: 'Timeline events' }
    ],
    dependencies: [],
    code: `
function Timeline({ events = [] }) {
  return (
    <div className="space-y-8">
      {events.map((event, idx) => (
        <div key={idx} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-blue-600" />
            {idx < events.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-300 mt-2" />
            )}
          </div>

          <div className="flex-1 pb-8">
            <div className="text-sm text-gray-500">{event.date}</div>
            <div className="font-semibold text-gray-900 mt-1">{event.title}</div>
            <div className="text-sm text-gray-600 mt-1">{event.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}`
  },

  // Empty State
  {
    id: 'empty-state',
    name: 'Empty State',
    description: 'Empty state placeholder',
    category: 'data',
    props: [
      { name: 'title', type: 'string', required: true, default: 'No data found', description: 'Title' },
      { name: 'description', type: 'string', required: false, default: 'Try adjusting your filters', description: 'Description' },
      { name: 'icon', type: 'string', required: false, default: '📭', description: 'Icon' }
    ],
    dependencies: [],
    code: `
function EmptyState({ title = 'No data found', description = 'Try adjusting your filters', icon = '📭' }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  )
}`
  }
]

/**
 * Data Visualization Capsules
 *
 * Cápsulas para visualización de datos: charts, graphs, y analytics
 */

import { Capsule } from '@/types/capsule'

export const dataVisualizationCapsules: Capsule[] = [
  // 1. Real-Time Line Chart
  {
    id: 'realtime-line-chart',
    name: 'Real-Time Line Chart',
    category: 'DataViz',
    description: 'Gráfico de líneas que se actualiza en tiempo real con animaciones fluidas',
    tags: ['chart', 'realtime', 'line', 'analytics', 'live'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'

interface DataPoint {
  timestamp: number
  value: number
}

interface RealTimeLineChartProps {
  title: string
  color?: string
  maxPoints?: number
  updateInterval?: number
  dataSource?: () => number
  yAxisLabel?: string
  showGrid?: boolean
}

export default function RealTimeLineChart({
  title,
  color = '#3b82f6',
  maxPoints = 50,
  updateInterval = 1000,
  dataSource = () => Math.random() * 100,
  yAxisLabel = 'Value',
  showGrid = true
}: RealTimeLineChartProps) {
  const [data, setData] = useState<DataPoint[]>([])
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setData(prev => {
        const newData = [
          ...prev,
          { timestamp: Date.now(), value: dataSource() }
        ].slice(-maxPoints)
        return newData
      })
    }, updateInterval)

    return () => clearInterval(interval)
  }, [isPaused, updateInterval, maxPoints, dataSource])

  const maxValue = Math.max(...data.map(d => d.value), 100)
  const minValue = Math.min(...data.map(d => d.value), 0)
  const range = maxValue - minValue || 1

  const points = data.map((d, i) => {
    const x = (i / (maxPoints - 1)) * 100
    const y = 100 - ((d.value - minValue) / range) * 100
    return \`\${x},\${y}\`
  }).join(' ')

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={\`px-3 py-1 rounded text-sm font-medium \${
            isPaused
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }\`}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid */}
          {showGrid && (
            <g className="opacity-20">
              {[0, 25, 50, 75, 100].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="#9ca3af"
                  strokeWidth="0.2"
                />
              ))}
            </g>
          )}

          {/* Area under line */}
          {data.length > 1 && (
            <polygon
              points={\`0,100 \${points} 100,100\`}
              fill={color}
              opacity="0.1"
            />
          )}

          {/* Line */}
          {data.length > 1 && (
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Current value */}
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-lg shadow-sm">
          <div className="text-xs text-gray-600">{yAxisLabel}</div>
          <div className="text-2xl font-bold" style={{ color }}>
            {data[data.length - 1]?.value.toFixed(1) || '0'}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
        <span>{maxPoints} data points</span>
        <span>Updates every {updateInterval}ms</span>
      </div>
    </div>
  )
}`
  },

  // 2. Donut Chart with Legend
  {
    id: 'donut-chart',
    name: 'Donut Chart',
    category: 'DataViz',
    description: 'Gráfico de dona interactivo con leyenda y tooltips',
    tags: ['chart', 'donut', 'pie', 'percentage', 'analytics'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState } from 'react'
import { PieChart } from 'lucide-react'

interface DataItem {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DataItem[]
  title?: string
  size?: number
  innerRadius?: number
  showLegend?: boolean
  showPercentages?: boolean
}

export default function DonutChart({
  data,
  title = 'Distribution',
  size = 200,
  innerRadius = 0.6,
  showLegend = true,
  showPercentages = true
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = size / 2
  const innerRadiusValue = radius * innerRadius

  let cumulativeAngle = 0
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = cumulativeAngle
    const endAngle = cumulativeAngle + angle
    cumulativeAngle = endAngle

    // Calculate path for donut segment
    const startRadians = (startAngle - 90) * (Math.PI / 180)
    const endRadians = (endAngle - 90) * (Math.PI / 180)

    const x1 = radius + radius * Math.cos(startRadians)
    const y1 = radius + radius * Math.sin(startRadians)
    const x2 = radius + radius * Math.cos(endRadians)
    const y2 = radius + radius * Math.sin(endRadians)

    const x3 = radius + innerRadiusValue * Math.cos(endRadians)
    const y3 = radius + innerRadiusValue * Math.sin(endRadians)
    const x4 = radius + innerRadiusValue * Math.cos(startRadians)
    const y4 = radius + innerRadiusValue * Math.sin(startRadians)

    const largeArcFlag = angle > 180 ? 1 : 0

    const path = \`
      M \${x1} \${y1}
      A \${radius} \${radius} 0 \${largeArcFlag} 1 \${x2} \${y2}
      L \${x3} \${y3}
      A \${innerRadiusValue} \${innerRadiusValue} 0 \${largeArcFlag} 0 \${x4} \${y4}
      Z
    \`

    return {
      ...item,
      path,
      percentage: percentage.toFixed(1),
      startAngle,
      endAngle
    }
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={\`0 0 \${size} \${size}\`}>
            {segments.map((segment, index) => (
              <g key={index}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  className="transition-all cursor-pointer"
                  style={{
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center'
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            ))}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900">
              {hoveredIndex !== null ? segments[hoveredIndex].percentage + '%' : '100%'}
            </div>
            <div className="text-sm text-gray-600">
              {hoveredIndex !== null ? segments[hoveredIndex].label : 'Total'}
            </div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex-1 space-y-2">
            {segments.map((segment, index) => (
              <div
                key={index}
                className={\`flex items-center justify-between p-2 rounded cursor-pointer transition \${
                  hoveredIndex === index ? 'bg-gray-100' : ''
                }\`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {segment.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {segment.value.toLocaleString()}
                  </span>
                  {showPercentages && (
                    <span className="text-sm font-semibold text-gray-900">
                      {segment.percentage}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}`
  },

  // 3. Heatmap Calendar
  {
    id: 'heatmap-calendar',
    name: 'Heatmap Calendar',
    category: 'DataViz',
    description: 'Calendario estilo GitHub con mapa de calor para visualizar actividad',
    tags: ['heatmap', 'calendar', 'activity', 'github', 'contribution'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'

interface HeatmapData {
  date: string // YYYY-MM-DD
  value: number
}

interface HeatmapCalendarProps {
  data: HeatmapData[]
  year?: number
  colors?: string[]
  showMonthLabels?: boolean
  showTooltip?: boolean
}

export default function HeatmapCalendar({
  data,
  year = new Date().getFullYear(),
  colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  showMonthLabels = true,
  showTooltip = true
}: HeatmapCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapData | null>(null)

  // Generate all days of the year
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)
  const weeks: Date[][] = []

  let currentWeek: Date[] = []
  let currentDate = new Date(startDate)

  // Pad start of first week
  const firstDayOfWeek = startDate.getDay()
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(new Date(0))
  }

  while (currentDate <= endDate) {
    currentWeek.push(new Date(currentDate))
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(new Date(0))
    }
    weeks.push(currentWeek)
  }

  // Create data map
  const dataMap = new Map<string, number>()
  data.forEach(d => dataMap.set(d.date, d.value))

  const maxValue = Math.max(...data.map(d => d.value), 1)

  const getColor = (value: number) => {
    if (value === 0) return colors[0]
    const percentage = value / maxValue
    if (percentage < 0.25) return colors[1]
    if (percentage < 0.5) return colors[2]
    if (percentage < 0.75) return colors[3]
    return colors[4]
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Activity in {year}</h3>
      </div>

      <div className="relative">
        {/* Month labels */}
        {showMonthLabels && (
          <div className="flex gap-1 mb-2 ml-8">
            {months.map((month, i) => (
              <div
                key={i}
                className="text-xs text-gray-600"
                style={{ width: '44px' }}
              >
                {month}
              </div>
            ))}
          </div>
        )}

        {/* Heatmap grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div
                key={i}
                className="text-xs text-gray-600 h-3 flex items-center"
                style={{ visibility: i % 2 === 0 ? 'visible' : 'hidden' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  if (date.getTime() === 0) {
                    return <div key={dayIndex} className="w-3 h-3" />
                  }

                  const dateStr = formatDate(date)
                  const value = dataMap.get(dateStr) || 0
                  const color = getColor(value)

                  return (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-gray-400"
                      style={{ backgroundColor: color }}
                      onMouseEnter={() => setHoveredDay({ date: dateStr, value })}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && hoveredDay && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap">
            <div className="font-semibold">{hoveredDay.value} contributions</div>
            <div className="text-gray-400">{hoveredDay.date}</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          {colors.map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}`
  },

  // 4. Sparkline Chart
  {
    id: 'sparkline-chart',
    name: 'Sparkline Chart',
    category: 'DataViz',
    description: 'Mini gráfico inline para mostrar tendencias en espacios pequeños',
    tags: ['sparkline', 'mini', 'trend', 'inline', 'compact'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface SparklineChartProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showTrend?: boolean
  showCurrentValue?: boolean
  fillArea?: boolean
  label?: string
}

export default function SparklineChart({
  data,
  width = 100,
  height = 30,
  color = '#3b82f6',
  showTrend = true,
  showCurrentValue = true,
  fillArea = false,
  label
}: SparklineChartProps) {
  if (data.length === 0) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return { x, y, value }
  })

  const pathD = points.map((p, i) =>
    \`\${i === 0 ? 'M' : 'L'} \${p.x} \${p.y}\`
  ).join(' ')

  const areaD = fillArea
    ? \`\${pathD} L \${width} \${height} L 0 \${height} Z\`
    : ''

  const firstValue = data[0]
  const lastValue = data[data.length - 1]
  const trend = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'neutral'
  const trendPercentage = firstValue !== 0
    ? (((lastValue - firstValue) / firstValue) * 100).toFixed(1)
    : '0'

  return (
    <div className="inline-flex items-center gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}

      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ display: 'block' }}
      >
        {fillArea && (
          <path
            d={areaD}
            fill={color}
            opacity="0.2"
          />
        )}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Current value dot */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="3"
          fill={color}
        />
      </svg>

      {showCurrentValue && (
        <span className="text-sm font-semibold text-gray-900">
          {lastValue.toFixed(1)}
        </span>
      )}

      {showTrend && trend !== 'neutral' && (
        <span className={\`flex items-center gap-1 text-xs font-medium \${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }\`}>
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trendPercentage}%
        </span>
      )}
    </div>
  )
}`
  }
]

export default dataVisualizationCapsules

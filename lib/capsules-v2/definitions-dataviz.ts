/**
 * Data Visualization Capsules V2 - Charts and Graphs
 * Browser-based using Canvas API (no external dependencies)
 */

import { CapsuleDefinition } from './types'

export const DATAVIZ_CAPSULES: CapsuleDefinition[] = [
  // ============================================
  // CHARTS
  // ============================================

  {
    id: 'line-chart',
    name: 'Line Chart',
    description: 'Interactive line chart with Canvas',
    category: 'feature',
    props: [
      { name: 'data', type: 'array', required: true, description: 'Array of {x, y} points' },
      { name: 'width', type: 'number', required: false, description: 'Chart width' },
      { name: 'height', type: 'number', required: false, description: 'Chart height' },
      { name: 'color', type: 'string', required: false, description: 'Line color' }
    ],
    code: `function LineChart({ data = [], width = 600, height = 400, color = '#3B82F6' }) {
  const canvasRef = React.useRef(null)
  const [tooltip, setTooltip] = React.useState(null)

  React.useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Find min/max values
    const xValues = data.map(d => d.x)
    const yValues = data.map(d => d.y)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    const xRange = maxX - minX || 1
    const yRange = maxY - minY || 1

    // Scale function
    const scaleX = (x) => ((x - minX) / xRange) * (width - 2 * padding) + padding
    const scaleY = (y) => height - padding - ((y - minY) / yRange) * (height - 2 * padding)

    // Draw grid
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - 2 * padding)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-axis labels
      const value = maxY - (i / 5) * yRange
      ctx.fillStyle = '#6B7280'
      ctx.font = '12px sans-serif'
      ctx.fillText(value.toFixed(1), 5, y + 4)
    }

    // Draw axes
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()

    data.forEach((point, i) => {
      const x = scaleX(point.x)
      const y = scaleY(point.y)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    ctx.fillStyle = color
    data.forEach(point => {
      const x = scaleX(point.x)
      const y = scaleY(point.y)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

  }, [data, width, height, color])

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find closest point
    const padding = 40
    let closest = null
    let minDist = Infinity

    const xValues = data.map(d => d.x)
    const yValues = data.map(d => d.y)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)
    const xRange = maxX - minX || 1
    const yRange = maxY - minY || 1

    const scaleX = (val) => ((val - minX) / xRange) * (width - 2 * padding) + padding
    const scaleY = (val) => height - padding - ((val - minY) / yRange) * (height - 2 * padding)

    data.forEach(point => {
      const px = scaleX(point.x)
      const py = scaleY(point.y)
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2)

      if (dist < minDist && dist < 20) {
        minDist = dist
        closest = { ...point, px, py }
      }
    })

    setTooltip(closest)
  }

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        className="border-2 border-gray-300 rounded-lg bg-white"
      />
      {tooltip && (
        <div
          className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
          style={{
            left: tooltip.px + 10,
            top: tooltip.py - 40
          }}
        >
          <div>x: {tooltip.x}</div>
          <div>y: {tooltip.y}</div>
        </div>
      )}
    </div>
  )
}`
  },

  {
    id: 'bar-chart',
    name: 'Bar Chart',
    description: 'Interactive bar chart with Canvas',
    category: 'feature',
    props: [
      { name: 'data', type: 'array', required: true, description: 'Array of {label, value} objects' },
      { name: 'width', type: 'number', required: false, description: 'Chart width' },
      { name: 'height', type: 'number', required: false, description: 'Chart height' },
      { name: 'color', type: 'string', required: false, description: 'Bar color' }
    ],
    code: `function BarChart({ data = [], width = 600, height = 400, color = '#10B981' }) {
  const canvasRef = React.useRef(null)
  const [hoveredBar, setHoveredBar] = React.useState(null)

  React.useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const padding = 60

    ctx.clearRect(0, 0, width, height)

    const maxValue = Math.max(...data.map(d => d.value))
    const barWidth = (width - 2 * padding) / data.length - 10
    const scale = (height - 2 * padding) / maxValue

    // Draw grid
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - 2 * padding)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-axis labels
      const value = maxValue - (i / 5) * maxValue
      ctx.fillStyle = '#6B7280'
      ctx.font = '12px sans-serif'
      ctx.fillText(Math.round(value), 5, y + 4)
    }

    // Draw axes
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw bars
    data.forEach((item, i) => {
      const x = padding + 10 + i * (barWidth + 10)
      const barHeight = item.value * scale
      const y = height - padding - barHeight

      // Bar
      ctx.fillStyle = hoveredBar === i ? '#059669' : color
      ctx.fillRect(x, y, barWidth, barHeight)

      // Border
      ctx.strokeStyle = '#059669'
      ctx.lineWidth = hoveredBar === i ? 2 : 0
      ctx.strokeRect(x, y, barWidth, barHeight)

      // Label
      ctx.fillStyle = '#374151'
      ctx.font = '11px sans-serif'
      ctx.save()
      ctx.translate(x + barWidth / 2, height - padding + 15)
      ctx.rotate(-Math.PI / 4)
      ctx.fillText(item.label, 0, 0)
      ctx.restore()
    })

  }, [data, width, height, color, hoveredBar])

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const padding = 60
    const barWidth = (width - 2 * padding) / data.length - 10
    const maxValue = Math.max(...data.map(d => d.value))
    const scale = (height - 2 * padding) / maxValue

    let found = null
    data.forEach((item, i) => {
      const barX = padding + 10 + i * (barWidth + 10)
      const barHeight = item.value * scale
      const barY = height - padding - barHeight

      if (x >= barX && x <= barX + barWidth && y >= barY && y <= height - padding) {
        found = i
      }
    })

    setHoveredBar(found)
  }

  return (
    <div className="inline-block">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredBar(null)}
        className="border-2 border-gray-300 rounded-lg bg-white cursor-pointer"
      />
      {hoveredBar !== null && (
        <div className="mt-2 text-center text-sm text-gray-700 font-semibold">
          {data[hoveredBar].label}: {data[hoveredBar].value}
        </div>
      )}
    </div>
  )
}`
  },

  {
    id: 'pie-chart',
    name: 'Pie Chart',
    description: 'Interactive pie/donut chart with Canvas',
    category: 'feature',
    props: [
      { name: 'data', type: 'array', required: true, description: 'Array of {label, value, color} objects' },
      { name: 'size', type: 'number', required: false, description: 'Chart size' },
      { name: 'donut', type: 'boolean', required: false, description: 'Donut style' }
    ],
    code: `function PieChart({ data = [], size = 400, donut = false }) {
  const canvasRef = React.useRef(null)
  const [hoveredSlice, setHoveredSlice] = React.useState(null)

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  React.useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 40

    ctx.clearRect(0, 0, size, size)

    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -Math.PI / 2

    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * Math.PI * 2
      const endAngle = currentAngle + sliceAngle

      // Draw slice
      ctx.fillStyle = item.color || colors[i % colors.length]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, endAngle)
      ctx.closePath()
      ctx.fill()

      // Highlight if hovered
      if (hoveredSlice === i) {
        ctx.strokeStyle = '#FFF'
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Label
      const labelAngle = currentAngle + sliceAngle / 2
      const labelRadius = radius + 20
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      ctx.fillStyle = '#374151'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(\`\${item.label}\`, labelX, labelY)

      const percentage = ((item.value / total) * 100).toFixed(1)
      ctx.fillText(\`\${percentage}%\`, labelX, labelY + 14)

      currentAngle = endAngle
    })

    // Donut hole
    if (donut) {
      ctx.fillStyle = '#FFF'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2)
      ctx.fill()

      // Total in center
      ctx.fillStyle = '#374151'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(total, centerX, centerY)
      ctx.font = '12px sans-serif'
      ctx.fillText('Total', centerX, centerY + 20)
    }

  }, [data, size, donut, hoveredSlice])

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = size / 2
    const centerY = size / 2
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const radius = size / 2 - 40

    if (distance > radius || (donut && distance < radius * 0.6)) {
      setHoveredSlice(null)
      return
    }

    let angle = Math.atan2(dy, dx)
    if (angle < -Math.PI / 2) angle += Math.PI * 2

    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -Math.PI / 2
    let found = null

    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * Math.PI * 2
      const endAngle = currentAngle + sliceAngle

      if (angle >= currentAngle && angle < endAngle) {
        found = i
      }

      currentAngle = endAngle
    })

    setHoveredSlice(found)
  }

  return (
    <div className="inline-block">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredSlice(null)}
        className="cursor-pointer"
      />
      {hoveredSlice !== null && (
        <div className="mt-2 text-center text-sm text-gray-700 font-semibold">
          {data[hoveredSlice].label}: {data[hoveredSlice].value}
        </div>
      )}
    </div>
  )
}`
  },

  {
    id: 'area-chart',
    name: 'Area Chart',
    description: 'Area chart with gradient fill',
    category: 'feature',
    props: [
      { name: 'data', type: 'array', required: true, description: 'Array of {x, y} points' },
      { name: 'width', type: 'number', required: false, description: 'Chart width' },
      { name: 'height', type: 'number', required: false, description: 'Chart height' },
      { name: 'color', type: 'string', required: false, description: 'Area color' }
    ],
    code: `function AreaChart({ data = [], width = 600, height = 400, color = '#8B5CF6' }) {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const padding = 40

    ctx.clearRect(0, 0, width, height)

    const xValues = data.map(d => d.x)
    const yValues = data.map(d => d.y)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)
    const xRange = maxX - minX || 1
    const yRange = maxY - minY || 1

    const scaleX = (x) => ((x - minX) / xRange) * (width - 2 * padding) + padding
    const scaleY = (y) => height - padding - ((y - minY) / yRange) * (height - 2 * padding)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, color + '88')
    gradient.addColorStop(1, color + '11')

    // Draw filled area
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(scaleX(data[0].x), height - padding)

    data.forEach((point, i) => {
      if (i === 0) {
        ctx.lineTo(scaleX(point.x), scaleY(point.y))
      } else {
        ctx.lineTo(scaleX(point.x), scaleY(point.y))
      }
    })

    ctx.lineTo(scaleX(data[data.length - 1].x), height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, i) => {
      const x = scaleX(point.x)
      const y = scaleY(point.y)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw axes
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Grid
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - 2 * padding)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      const value = maxY - (i / 5) * yRange
      ctx.fillStyle = '#6B7280'
      ctx.font = '12px sans-serif'
      ctx.fillText(value.toFixed(1), 5, y + 4)
    }

  }, [data, width, height, color])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-gray-300 rounded-lg bg-white"
    />
  )
}`
  },

  // ============================================
  // DASHBOARD COMPONENTS
  // ============================================

  {
    id: 'metric-card',
    name: 'Metric Card',
    description: 'Display key metrics with trend indicators',
    category: 'ui',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Metric title' },
      { name: 'value', type: 'string', required: true, description: 'Metric value' },
      { name: 'change', type: 'number', required: false, description: 'Percentage change' },
      { name: 'icon', type: 'string', required: false, description: 'Icon emoji' }
    ],
    code: `function MetricCard({ title, value, change, icon = '📊' }) {
  const isPositive = change >= 0
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
  const arrow = isPositive ? '↑' : '↓'

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        {change !== undefined && (
          <span className={\`text-sm font-semibold \${changeColor}\`}>
            {arrow} {Math.abs(change)}%
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}`
  },

  {
    id: 'sparkline',
    name: 'Sparkline',
    description: 'Mini line chart for trends',
    category: 'feature',
    props: [
      { name: 'data', type: 'array', required: true, description: 'Array of numbers' },
      { name: 'width', type: 'number', required: false, description: 'Chart width' },
      { name: 'height', type: 'number', required: false, description: 'Chart height' },
      { name: 'color', type: 'string', required: false, description: 'Line color' }
    ],
    code: `function Sparkline({ data = [], width = 200, height = 60, color = '#3B82F6' }) {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, width, height)

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const stepX = width / (data.length - 1)
    const scaleY = (val) => height - ((val - min) / range) * height

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((value, i) => {
      const x = i * stepX
      const y = scaleY(value)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Fill area
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color + '44')
    gradient.addColorStop(1, color + '00')
    ctx.fillStyle = gradient
    ctx.fill()

  }, [data, width, height, color])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded"
    />
  )
}`
  },

  {
    id: 'progress-ring',
    name: 'Progress Ring',
    description: 'Circular progress indicator',
    category: 'ui',
    props: [
      { name: 'progress', type: 'number', required: true, description: 'Progress percentage (0-100)' },
      { name: 'size', type: 'number', required: false, description: 'Ring size' },
      { name: 'color', type: 'string', required: false, description: 'Ring color' },
      { name: 'label', type: 'string', required: false, description: 'Center label' }
    ],
    code: `function ProgressRing({ progress = 0, size = 120, color = '#10B981', label }) {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10
    const lineWidth = 8

    ctx.clearRect(0, 0, size, size)

    // Background circle
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Progress arc
    const progressAngle = (progress / 100) * Math.PI * 2
    ctx.strokeStyle = color
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + progressAngle)
    ctx.stroke()

    // Center text
    ctx.fillStyle = '#374151'
    ctx.font = \`bold \${size / 4}px sans-serif\`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(\`\${Math.round(progress)}%\`, centerX, centerY)

    if (label) {
      ctx.font = \`\${size / 10}px sans-serif\`
      ctx.fillText(label, centerX, centerY + size / 6)
    }

  }, [progress, size, color, label])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
    />
  )
}`
  },

  {
    id: 'heatmap',
    name: 'Heatmap',
    description: 'Data heatmap visualization',
    category: 'feature',
    props: [
      { name: 'data', type: 'array', required: true, description: '2D array of values' },
      { name: 'labels', type: 'object', required: false, description: '{x: [], y: []} labels' },
      { name: 'colorScheme', type: 'string', required: false, description: 'Color scheme' }
    ],
    code: `function Heatmap({ data = [[]], labels = {}, colorScheme = 'blue' }) {
  const canvasRef = React.useRef(null)
  const [tooltip, setTooltip] = React.useState(null)

  const colorSchemes = {
    blue: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'],
    green: ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D'],
    red: ['#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C']
  }

  const colors = colorSchemes[colorScheme] || colorSchemes.blue

  React.useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rows = data.length
    const cols = data[0].length
    const cellWidth = 40
    const cellHeight = 40
    const labelOffset = 60

    const width = cols * cellWidth + labelOffset
    const height = rows * cellHeight + labelOffset

    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)

    // Find min/max
    let min = Infinity
    let max = -Infinity
    data.forEach(row => {
      row.forEach(val => {
        if (val < min) min = val
        if (val > max) max = val
      })
    })

    const range = max - min || 1

    // Draw cells
    data.forEach((row, i) => {
      row.forEach((value, j) => {
        const x = j * cellWidth + labelOffset
        const y = i * cellHeight + labelOffset

        // Color based on value
        const normalized = (value - min) / range
        const colorIndex = Math.floor(normalized * (colors.length - 1))
        ctx.fillStyle = colors[colorIndex]
        ctx.fillRect(x, y, cellWidth, cellHeight)

        // Border
        ctx.strokeStyle = '#FFF'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, cellWidth, cellHeight)

        // Value
        ctx.fillStyle = normalized > 0.5 ? '#FFF' : '#374151'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(value, x + cellWidth / 2, y + cellHeight / 2)
      })
    })

    // Labels
    ctx.fillStyle = '#374151'
    ctx.font = '11px sans-serif'

    // X labels
    if (labels.x) {
      labels.x.forEach((label, i) => {
        ctx.save()
        ctx.translate(i * cellWidth + labelOffset + cellWidth / 2, labelOffset - 10)
        ctx.rotate(-Math.PI / 4)
        ctx.textAlign = 'right'
        ctx.fillText(label, 0, 0)
        ctx.restore()
      })
    }

    // Y labels
    if (labels.y) {
      labels.y.forEach((label, i) => {
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, labelOffset - 10, i * cellHeight + labelOffset + cellHeight / 2)
      })
    }

  }, [data, labels, colorScheme])

  return (
    <div className="inline-block overflow-auto">
      <canvas
        ref={canvasRef}
        className="bg-white border-2 border-gray-300 rounded-lg"
      />
    </div>
  )
}`
  }
]

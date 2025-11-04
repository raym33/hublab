/**
 * Chart Component
 * Simple chart visualization without external dependencies
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface ChartProps {
  data: ChartData[]
  type?: 'bar' | 'line' | 'pie'
  title?: string
  height?: number
  showValues?: boolean
  className?: string
}

const Chart = ({
  data,
  type = 'bar',
  title,
  height = 300,
  showValues = true,
  className
}: ChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value))
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  if (type === 'pie') {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    let currentAngle = 0

    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-lg p-6', className)}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h3>
        )}
        <div className="flex items-center justify-center gap-8">
          <svg width={height} height={height} viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle
              currentAngle = endAngle

              const startRad = (startAngle - 90) * (Math.PI / 180)
              const endRad = (endAngle - 90) * (Math.PI / 180)

              const x1 = 50 + 40 * Math.cos(startRad)
              const y1 = 50 + 40 * Math.sin(startRad)
              const x2 = 50 + 40 * Math.cos(endRad)
              const y2 = 50 + 40 * Math.sin(endRad)

              const largeArc = angle > 180 ? 1 : 0
              const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`

              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color || colors[index % colors.length]}
                />
              )
            })}
          </svg>

          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color || colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'line') {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (item.value / maxValue) * 80
      return `${x},${y}`
    }).join(' ')

    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-lg p-6', className)}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h3>
        )}
        <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (item.value / maxValue) * 80
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="#3b82f6"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-500 dark:text-gray-400">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Bar chart (default)
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg p-6', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <div className="flex items-end justify-between gap-4" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end flex-1">
                {showValues && (
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {item.value}
                  </span>
                )}
                <div
                  className="w-full rounded-t-lg transition-all hover:opacity-80"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: item.color || colors[index % colors.length]
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Chart

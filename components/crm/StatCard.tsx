import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}

export default function StatCard({
  label,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-500',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

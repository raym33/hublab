import { Mail, Calendar, Users, Activity, CheckCircle } from 'lucide-react'

interface EventCardProps {
  type: 'email' | 'meeting' | 'slack' | 'other'
  source: string
  title: string
  timestamp: string
  processed: boolean
  confidence?: number
  onClick?: () => void
}

export default function EventCard({
  type,
  source,
  title,
  timestamp,
  processed,
  confidence,
  onClick,
}: EventCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return Mail
      case 'meeting':
        return Calendar
      case 'slack':
        return Users
      default:
        return Activity
    }
  }

  const Icon = getIcon()

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-medium text-slate-900 text-sm">{title}</h3>
          {processed && (
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-slate-600 mb-2">{source}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{timestamp}</span>
          {confidence && (
            <span className="text-xs text-slate-600">
              {Math.round(confidence * 100)}% confidence
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

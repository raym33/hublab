import { CheckCircle } from 'lucide-react'

interface ActionCardProps {
  type: string
  status: 'pending' | 'approved' | 'executed' | 'failed'
  resource: string
  timestamp: string
  confidence: number
  onClick?: () => void
}

export default function ActionCard({
  type,
  status,
  resource,
  timestamp,
  confidence,
  onClick,
}: ActionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      case 'approved':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatActionType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-green-300 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-medium text-slate-900 text-sm">
              {formatActionType(type)}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">{resource}</p>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500">{timestamp}</span>
          <span className="text-xs text-slate-600">
            {Math.round(confidence * 100)}% confidence
          </span>
        </div>
      </div>
    </div>
  )
}

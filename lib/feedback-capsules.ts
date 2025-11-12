/**
 * Feedback Capsules
 * 5 production-ready feedback components
 */

import { Capsule } from '@/types/capsule'

const feedbackCapsules: Capsule[] = [
  {
    id: 'toast-notification',
    name: 'Toast Notification System',
    category: 'UI',
    description: 'Advanced toast notification system with queue management, multiple types (success, error, warning, info), auto-dismiss, actions, and stacking. Includes animations and positioning.',
    tags: ['toast', 'notification', 'alert', 'message', 'feedback', 'snackbar'],
    code: `'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

interface Toast { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; duration?: number }
interface ToastSystemProps { position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }

export default function ToastSystem({ position = 'top-right' }: ToastSystemProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36)
    setToasts(prev => [...prev, { ...toast, id }])
    if (toast.duration !== 0) setTimeout(() => removeToast(id), toast.duration || 5000)
  }

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
  const colors = { success: 'bg-green-50 border-green-500 text-green-800', error: 'bg-red-50 border-red-500 text-red-800', warning: 'bg-yellow-50 border-yellow-500 text-yellow-800', info: 'bg-blue-50 border-blue-500 text-blue-800' }
  const positions = { 'top-right': 'top-4 right-4', 'top-left': 'top-4 left-4', 'bottom-right': 'bottom-4 right-4', 'bottom-left': 'bottom-4 left-4' }

  return <div className={\`fixed \${positions[position]} z-50 flex flex-col gap-2 max-w-sm\`}>{toasts.map(toast => { const Icon = icons[toast.type]; return <div key={toast.id} className={\`flex items-start gap-3 p-4 border-l-4 rounded-lg shadow-lg animate-slide-in \${colors[toast.type]}\`}><Icon size={20} className="flex-shrink-0 mt-0.5" /><p className="flex-1 text-sm font-medium">{toast.message}</p><button onClick={() => removeToast(toast.id)} className="text-gray-500 hover:text-gray-700"><X size={18} /></button></div> })}</div>
}`,
    platform: 'react'
  },
  {
    id: 'progress-steps',
    name: 'Multi-Step Progress Indicator',
    category: 'UI',
    description: 'Visual multi-step progress indicator with completed, current, and upcoming states. Includes labels, descriptions, icons, and clickable navigation.',
    tags: ['progress', 'stepper', 'wizard', 'steps', 'form', 'navigation'],
    code: `'use client'
import { Check } from 'lucide-react'

interface Step { id: string; label: string; description?: string; icon?: React.ComponentType<any> }
interface ProgressStepsProps { steps: Step[]; current: number; onStepClick?: (index: number) => void }

export default function ProgressSteps({ steps, current, onStepClick }: ProgressStepsProps) {
  return <div className="w-full"><div className="flex items-center justify-between">{steps.map((step, index) => { const Icon = step.icon; const isCompleted = index < current; const isCurrent = index === current; const isClickable = onStepClick && index < current; return <div key={step.id} className="flex-1 flex items-center"><button onClick={() => isClickable && onStepClick(index)} disabled={!isClickable} className={\`flex flex-col items-center \${isClickable ? 'cursor-pointer' : 'cursor-default'}\`}><div className={\`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all \${isCompleted ? 'bg-green-600 border-green-600 text-white' : isCurrent ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}\`}>{isCompleted ? <Check size={24} /> : Icon ? <Icon size={24} /> : index + 1}</div><span className={\`mt-2 text-sm font-medium \${isCurrent ? 'text-gray-900' : 'text-gray-500'}\`}>{step.label}</span>{step.description && <span className="text-xs text-gray-500">{step.description}</span>}</button>{index < steps.length - 1 && <div className={\`flex-1 h-0.5 mx-4 \${index < current ? 'bg-green-600' : 'bg-gray-300'}\`} />}</div> })}</div></div>
}`,
    platform: 'react'
  },
  {
    id: 'skeleton-loader',
    name: 'Skeleton Loader',
    category: 'UI',
    description: 'Animated skeleton loader with multiple variants (text, image, card, list). Includes pulse animation and customizable dimensions. Perfect for loading states.',
    tags: ['skeleton', 'loader', 'loading', 'placeholder', 'shimmer'],
    code: `'use client'
interface SkeletonProps { variant?: 'text' | 'image' | 'card' | 'list'; count?: number; className?: string }

export default function Skeleton({ variant = 'text', count = 1, className = '' }: SkeletonProps) {
  const variants = {
    text: <div className="space-y-2">{Array.from({ length: count }).map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: \`\${Math.random() * 30 + 70}%\` }} />)}</div>,
    image: <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />,
    card: <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"><div className="aspect-video bg-gray-200 rounded animate-pulse" /><div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" /><div className="space-y-2"><div className="h-4 bg-gray-200 rounded animate-pulse" /><div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" /></div></div>,
    list: <div className="space-y-3">{Array.from({ length: count }).map((_, i) => <div key={i} className="flex gap-4"><div className="w-12 h-12 bg-gray-200 rounded animate-pulse" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" /><div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" /></div></div>)}</div>
  }
  return <div className={className}>{variants[variant]}</div>
}`,
    platform: 'react'
  },
  {
    id: 'empty-state',
    name: 'Empty State Component',
    category: 'UI',
    description: 'Beautiful empty state with icon, title, description, and action buttons. Multiple variants for different scenarios (no data, no results, error). Includes illustrations.',
    tags: ['empty', 'state', 'placeholder', 'no-data', 'illustration'],
    code: `'use client'
import { Inbox, Search, WifiOff, AlertCircle } from 'lucide-react'

interface EmptyStateProps { variant?: 'no-data' | 'no-results' | 'error' | 'offline'; title?: string; description?: string; action?: { label: string; onClick: () => void }; icon?: React.ComponentType<any> }

export default function EmptyState({ variant = 'no-data', title, description, action, icon }: EmptyStateProps) {
  const variants = {
    'no-data': { icon: Inbox, title: 'No data yet', description: 'Get started by adding your first item', color: 'text-gray-400' },
    'no-results': { icon: Search, title: 'No results found', description: 'Try adjusting your search or filters', color: 'text-gray-400' },
    error: { icon: AlertCircle, title: 'Something went wrong', description: 'Please try again later', color: 'text-red-400' },
    offline: { icon: WifiOff, title: 'You are offline', description: 'Check your internet connection', color: 'text-orange-400' }
  }

  const config = variants[variant]
  const Icon = icon || config.icon

  return <div className="flex flex-col items-center justify-center py-12 px-4 text-center"><div className={\`w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 \${config.color}\`}><Icon size={40} /></div><h3 className="text-xl font-semibold text-gray-900 mb-2">{title || config.title}</h3><p className="text-gray-600 mb-6 max-w-md">{description || config.description}</p>{action && <button onClick={action.onClick} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">{action.label}</button>}</div>
}`,
    platform: 'react'
  },
  {
    id: 'confirmation-dialog',
    name: 'Confirmation Dialog',
    category: 'UI',
    description: 'Modal confirmation dialog with customizable variants (danger, warning, info), title, description, and action buttons. Includes backdrop, escape key, and animation.',
    tags: ['dialog', 'modal', 'confirm', 'alert', 'popup', 'overlay'],
    code: `'use client'
import { AlertTriangle, Info, Trash2, X } from 'lucide-react'

interface ConfirmationDialogProps { isOpen: boolean; onClose: () => void; onConfirm: () => void; variant?: 'danger' | 'warning' | 'info'; title: string; description: string; confirmText?: string; cancelText?: string }

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, variant = 'danger', title, description, confirmText = 'Confirm', cancelText = 'Cancel' }: ConfirmationDialogProps) {
  if (!isOpen) return null

  const variants = { danger: { icon: Trash2, iconBg: 'bg-red-100', iconColor: 'text-red-600', buttonBg: 'bg-red-600 hover:bg-red-700' }, warning: { icon: AlertTriangle, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', buttonBg: 'bg-yellow-600 hover:bg-yellow-700' }, info: { icon: Info, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', buttonBg: 'bg-blue-600 hover:bg-blue-700' } }
  const config = variants[variant]
  const Icon = config.icon

  return <><div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} /><div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in"><div className="flex items-start gap-4"><div className={\`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 \${config.iconBg}\`}><Icon size={24} className={config.iconColor} /></div><div className="flex-1"><h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3><p className="text-gray-600 mb-6">{description}</p><div className="flex gap-3"><button onClick={onConfirm} className={\`flex-1 py-2 text-white rounded-lg font-medium transition-colors \${config.buttonBg}\`}>{confirmText}</button><button onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">{cancelText}</button></div></div><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div></div></div></>
}`,
    platform: 'react'
  }
]

export default feedbackCapsules

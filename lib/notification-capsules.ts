/**
 * Notification & Feedback Capsules
 *
 * Cápsulas para notificaciones, alerts, toasts, y feedback de usuario
 */

import { Capsule } from '@/types/capsule'

export const notificationCapsules: Capsule[] = [
  // 1. Toast Notification System
  {
    id: 'toast-notification',
    name: 'Toast Notification',
    category: 'UI',
    description: 'Sistema de notificaciones toast con animaciones y auto-dismiss',
    tags: ['toast', 'notification', 'alert', 'feedback'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

// Singleton store para toasts
class ToastStore {
  private listeners: Array<(toasts: Toast[]) => void> = []
  private toasts: Toast[] = []

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notify() {
    this.listeners.forEach(listener => listener(this.toasts))
  }

  add(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9)
    this.toasts.push({ ...toast, id })
    this.notify()

    if (toast.duration !== 0) {
      setTimeout(() => this.remove(id), toast.duration || 3000)
    }
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id)
    this.notify()
  }
}

export const toastStore = new ToastStore()

// Helper functions
export const toast = {
  success: (message: string, duration?: number) =>
    toastStore.add({ type: 'success', message, duration }),
  error: (message: string, duration?: number) =>
    toastStore.add({ type: 'error', message, duration }),
  info: (message: string, duration?: number) =>
    toastStore.add({ type: 'info', message, duration }),
  warning: (message: string, duration?: number) =>
    toastStore.add({ type: 'warning', message, duration })
}

export default function ToastNotification({ position = 'top-right' }: ToastNotificationProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toastStore.subscribe(setToasts)
  }, [])

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  const typeConfig = {
    success: {
      icon: CheckCircle,
      colors: 'bg-green-50 border-green-200 text-green-800'
    },
    error: {
      icon: AlertCircle,
      colors: 'bg-red-50 border-red-200 text-red-800'
    },
    info: {
      icon: Info,
      colors: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    warning: {
      icon: AlertTriangle,
      colors: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
  }

  return (
    <div className={\`fixed \${positionClasses[position]} z-50 space-y-2 min-w-[300px] max-w-md\`}>
      {toasts.map(toast => {
        const config = typeConfig[toast.type]
        const Icon = config.icon
        return (
          <div
            key={toast.id}
            className={\`\${config.colors} border rounded-lg p-4 shadow-lg animate-slide-in flex items-start gap-3\`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => toastStore.remove(toast.id)}
              className="flex-shrink-0 hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}`
  },

  // 2. Progress Bar
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    category: 'UI',
    description: 'Barra de progreso animada con múltiples variantes y sizes',
    tags: ['progress', 'loading', 'bar', 'percentage'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient'
  showLabel?: boolean
  animated?: boolean
  striped?: boolean
}

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = false,
  striped = false
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso</span>
          <span className="text-sm font-medium text-gray-700">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={\`w-full bg-gray-200 rounded-full overflow-hidden \${sizeClasses[size]}\`}>
        <div
          className={\`\${sizeClasses[size]} \${variantClasses[variant]} rounded-full transition-all duration-300 \${
            animated ? 'animate-pulse' : ''
          } \${striped ? 'bg-striped' : ''}\`}
          style={{ width: \`\${percentage}%\` }}
        />
      </div>
    </div>
  )
}`
  },

  // 3. Skeleton Loader Avanzado
  {
    id: 'advanced-skeleton',
    name: 'Advanced Skeleton Loader',
    category: 'UI',
    description: 'Skeleton loader para diferentes tipos de contenido (cards, lists, text)',
    tags: ['skeleton', 'loading', 'placeholder', 'shimmer'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

interface SkeletonProps {
  type?: 'text' | 'card' | 'list' | 'avatar' | 'custom'
  count?: number
  className?: string
  animated?: boolean
}

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
)

export default function AdvancedSkeleton({
  type = 'text',
  count = 1,
  className = '',
  animated = true
}: SkeletonProps) {
  const baseClass = \`bg-gray-200 rounded \${animated ? 'relative overflow-hidden' : ''}\`

  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={\`space-y-2 \${className}\`}>
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className={\`\${baseClass} h-4 w-full\`}>
                {animated && <Shimmer />}
              </div>
            ))}
          </div>
        )

      case 'card':
        return (
          <div className={\`grid gap-4 \${className}\`}>
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className={\`\${baseClass} h-48 w-full mb-4\`}>
                  {animated && <Shimmer />}
                </div>
                <div className={\`\${baseClass} h-6 w-3/4 mb-2\`}>
                  {animated && <Shimmer />}
                </div>
                <div className={\`\${baseClass} h-4 w-full mb-2\`}>
                  {animated && <Shimmer />}
                </div>
                <div className={\`\${baseClass} h-4 w-5/6\`}>
                  {animated && <Shimmer />}
                </div>
              </div>
            ))}
          </div>
        )

      case 'list':
        return (
          <div className={\`space-y-3 \${className}\`}>
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={\`\${baseClass} h-12 w-12 rounded-full flex-shrink-0\`}>
                  {animated && <Shimmer />}
                </div>
                <div className="flex-1 space-y-2">
                  <div className={\`\${baseClass} h-4 w-3/4\`}>
                    {animated && <Shimmer />}
                  </div>
                  <div className={\`\${baseClass} h-3 w-1/2\`}>
                    {animated && <Shimmer />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'avatar':
        return (
          <div className="flex gap-2">
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className={\`\${baseClass} h-12 w-12 rounded-full\`}>
                {animated && <Shimmer />}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className={\`\${baseClass} \${className}\`}>
            {animated && <Shimmer />}
          </div>
        )
    }
  }

  return renderSkeleton()
}`
  },

  // 4. Badge System
  {
    id: 'badge-system',
    name: 'Badge System',
    category: 'UI',
    description: 'Sistema de badges con múltiples variantes, tamaños y estilos',
    tags: ['badge', 'label', 'tag', 'chip'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { X } from 'lucide-react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  removable?: boolean
  onRemove?: () => void
  icon?: React.ReactNode
  pulse?: boolean
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  removable = false,
  onRemove,
  icon,
  pulse = false
}: BadgeProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-purple-100 text-purple-800 border-purple-200',
    outline: 'bg-white text-gray-700 border-gray-300'
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }

  return (
    <span
      className={\`inline-flex items-center gap-1.5 font-medium border \${variants[variant]} \${sizes[size]} \${
        rounded ? 'rounded-full' : 'rounded'
      } \${pulse ? 'animate-pulse' : ''}\`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 hover:opacity-70 ml-1"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}`
  },

  // 5. Alert Banner
  {
    id: 'alert-banner',
    name: 'Alert Banner',
    category: 'UI',
    description: 'Banner de alerta con iconos, acciones y dismissible',
    tags: ['alert', 'banner', 'notification', 'warning'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface AlertBannerProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export default function AlertBanner({
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
  action
}: AlertBannerProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  const config = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      button: 'text-green-600 hover:text-green-700'
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      button: 'text-red-600 hover:text-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      button: 'text-yellow-600 hover:text-yellow-700'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      button: 'text-blue-600 hover:text-blue-700'
    }
  }

  const { icon: Icon, bg, border, text, button } = config[type]

  return (
    <div className={\`\${bg} \${border} border rounded-lg p-4\`}>
      <div className="flex items-start gap-3">
        <Icon className={\`w-5 h-5 \${text} flex-shrink-0 mt-0.5\`} />
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={\`\${text} font-semibold mb-1\`}>{title}</h3>
          )}
          <p className={\`\${text} text-sm\`}>{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className={\`\${button} text-sm font-medium mt-2 hover:underline\`}
            >
              {action.label}
            </button>
          )}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={\`\${button} flex-shrink-0\`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}`
  }
]

export default notificationCapsules

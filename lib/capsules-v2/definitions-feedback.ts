import { CapsuleDefinition } from './types'

/**
 * Feedback Capsules
 * User feedback and notification components
 */

export const FEEDBACK_CAPSULES: CapsuleDefinition[] = [
  // Toast Notification
  {
    id: 'toast',
    name: 'Toast Notification',
    description: 'Toast notification message',
    category: 'feedback',
    props: [
      { name: 'message', type: 'string', required: true, default: 'Success!', description: 'Notification message' },
      { name: 'type', type: 'string', required: false, default: 'success', description: 'Type: success, error, warning, info' },
      { name: 'duration', type: 'number', required: false, default: 3000, description: 'Duration in ms' }
    ],
    dependencies: [],
    code: `
function Toast({ message = 'Success!', type = 'success', duration = 3000 }) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  const types = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white'
  }

  return (
    <div className={\`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg \${types[type]} z-50 animate-slide-in\`}>
      {message}
    </div>
  )
}`
  },

  // Alert Box
  {
    id: 'alert-box',
    name: 'Alert Box',
    description: 'Dismissible alert box',
    category: 'feedback',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Alert', description: 'Alert title' },
      { name: 'message', type: 'string', required: true, default: 'This is an alert message', description: 'Alert message' },
      { name: 'type', type: 'string', required: false, default: 'info', description: 'Type: success, error, warning, info' }
    ],
    dependencies: [],
    code: `
function AlertBox({ title = 'Alert', message = 'This is an alert message', type = 'info' }) {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  const types = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  return (
    <div className={\`border-l-4 p-4 \${types[type]}\`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xl font-bold ml-4 hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  )
}`
  },

  // Loading Spinner
  {
    id: 'loading-spinner',
    name: 'Loading Spinner',
    description: 'Animated loading spinner',
    category: 'feedback',
    props: [
      { name: 'size', type: 'string', required: false, default: 'md', description: 'Size: sm, md, lg' },
      { name: 'text', type: 'string', required: false, default: '', description: 'Loading text' }
    ],
    dependencies: [],
    code: `
function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={\`\${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin\`} />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  )
}`
  },

  // Skeleton Loader
  {
    id: 'skeleton-loader',
    name: 'Skeleton Loader',
    description: 'Content skeleton placeholder',
    category: 'feedback',
    props: [
      { name: 'lines', type: 'number', required: false, default: 3, description: 'Number of lines' },
      { name: 'avatar', type: 'boolean', required: false, default: false, description: 'Show avatar' }
    ],
    dependencies: [],
    code: `
function SkeletonLoader({ lines = 3, avatar = false }) {
  return (
    <div className="animate-pulse">
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        {[...Array(lines)].map((_, idx) => (
          <div key={idx} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  )
}`
  },

  // Confirmation Dialog
  {
    id: 'confirm-dialog',
    name: 'Confirmation Dialog',
    description: 'Confirmation modal dialog',
    category: 'feedback',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Confirm Action', description: 'Dialog title' },
      { name: 'message', type: 'string', required: true, default: 'Are you sure?', description: 'Dialog message' }
    ],
    dependencies: [],
    code: `
function ConfirmDialog({ title = 'Confirm Action', message = 'Are you sure?' }) {
  const [isOpen, setIsOpen] = React.useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}`
  },

  // Tooltip
  {
    id: 'tooltip',
    name: 'Tooltip',
    description: 'Hover tooltip',
    category: 'feedback',
    props: [
      { name: 'text', type: 'string', required: true, default: 'Tooltip text', description: 'Tooltip content' },
      { name: 'children', type: 'node', required: true, default: 'Hover me', description: 'Trigger element' }
    ],
    dependencies: [],
    code: `
function Tooltip({ text = 'Tooltip text', children = 'Hover me' }) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  )
}`
  },

  // Progress Steps
  {
    id: 'progress-steps',
    name: 'Progress Steps',
    description: 'Step-by-step progress indicator',
    category: 'feedback',
    props: [
      { name: 'currentStep', type: 'number', required: true, default: 2, description: 'Current step (1-indexed)' },
      { name: 'totalSteps', type: 'number', required: true, default: 4, description: 'Total steps' }
    ],
    dependencies: [],
    code: `
function ProgressSteps({ currentStep = 2, totalSteps = 4 }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: \`\${(currentStep / totalSteps) * 100}%\` }}
        />
      </div>
    </div>
  )
}`
  },

  // Rating Stars
  {
    id: 'rating-stars',
    name: 'Rating Stars',
    description: 'Star rating component',
    category: 'feedback',
    props: [
      { name: 'rating', type: 'number', required: true, default: 4, description: 'Rating value (0-5)' },
      { name: 'readonly', type: 'boolean', required: false, default: false, description: 'Read-only mode' }
    ],
    dependencies: [],
    code: `
function RatingStars({ rating = 4, readonly = false }) {
  const [currentRating, setCurrentRating] = React.useState(rating)
  const [hover, setHover] = React.useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && setCurrentRating(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={\`text-2xl transition-colors \${
            star <= (hover || currentRating) ? 'text-yellow-400' : 'text-gray-300'
          } \${!readonly && 'cursor-pointer hover:scale-110'}\`}
          disabled={readonly}
        >
          ★
        </button>
      ))}
    </div>
  )
}`
  }
]

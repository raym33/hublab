/**
 * Cápsulas Extra V2 - Más componentes útiles
 * Incluye: Notifications, Media, Navigation, Feedback
 */

import { CapsuleDefinition } from './types'

// NOTIFICATION CAPSULES (5 cápsulas)
export const NOTIFICATION_CAPSULES: CapsuleDefinition[] = [
  // Toast Notification
  {
    id: 'toast',
    name: 'Toast Notification',
    description: 'Temporary notification toast',
    category: 'ui',
    props: [
      { name: 'message', type: 'string', required: true, default: 'Notification message', description: 'Toast message' },
      { name: 'type', type: 'string', required: false, default: 'info', description: 'Type: info, success, warning, error' },
      { name: 'duration', type: 'number', required: false, default: 3000, description: 'Duration in ms' }
    ],
    dependencies: [],
    code: `
function Toast({ message = 'Notification message', type = 'info', duration = 3000 }) {
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  const types = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={\`\${types[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]\`}>
        <span className="text-2xl">{icons[type]}</span>
        <span className="flex-1">{message}</span>
        <button onClick={() => setVisible(false)} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  )
}`
  },

  // Notification Badge
  {
    id: 'notification-badge',
    name: 'Notification Badge',
    description: 'Badge with notification count',
    category: 'ui',
    props: [
      { name: 'count', type: 'number', required: true, default: 5, description: 'Notification count' },
      { name: 'max', type: 'number', required: false, default: 99, description: 'Max count to display' },
      { name: 'icon', type: 'string', required: false, default: '🔔', description: 'Icon' }
    ],
    dependencies: [],
    code: `
function NotificationBadge({ count = 5, max = 99, icon = '🔔' }) {
  const displayCount = count > max ? \`\${max}+\` : count

  return (
    <div className="relative inline-block">
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <span className="text-2xl">{icon}</span>
      </button>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
          {displayCount}
        </span>
      )}
    </div>
  )
}`
  },

  // Notification Center
  {
    id: 'notification-center',
    name: 'Notification Center',
    description: 'Notification list panel',
    category: 'ui',
    props: [
      { name: 'notifications', type: 'array', required: true, default: [
        { id: 1, title: 'New message', text: 'You have a new message', time: '2m ago', unread: true },
        { id: 2, title: 'Update available', text: 'New version is ready', time: '1h ago', unread: false }
      ], description: 'Notifications' }
    ],
    dependencies: [],
    code: `
function NotificationCenter({ notifications = [{ id: 1, title: 'Notification', text: 'Text', time: 'Now', unread: true }] }) {
  const [items, setItems] = React.useState(notifications)

  const markAsRead = (id) => {
    setItems(items.map(item => item.id === id ? {...item, unread: false} : item))
  }

  const remove = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-96 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 font-bold text-gray-900">
        Notifications ({items.filter(n => n.unread).length})
      </div>
      <div className="divide-y divide-gray-200">
        {items.map(notification => (
          <div
            key={notification.id}
            className={\`p-4 hover:bg-gray-50 cursor-pointer \${notification.unread ? 'bg-blue-50' : ''}\`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-gray-900">{notification.title}</h4>
              <button onClick={(e) => { e.stopPropagation(); remove(notification.id) }} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-1">{notification.text}</p>
            <span className="text-xs text-gray-400">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}`
  }
]

// MEDIA CAPSULES (5 cápsulas)
export const MEDIA_CAPSULES: CapsuleDefinition[] = [
  // Image Gallery
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    description: 'Grid image gallery',
    category: 'ui',
    props: [
      { name: 'images', type: 'array', required: true, default: [
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300'
      ], description: 'Image URLs' },
      { name: 'columns', type: 'number', required: false, default: 3, description: 'Grid columns' }
    ],
    dependencies: [],
    code: `
function ImageGallery({ images = ['https://via.placeholder.com/400x300'], columns = 3 }) {
  const [selectedImage, setSelectedImage] = React.useState(null)

  return (
    <>
      <div className={\`grid grid-cols-\${columns} gap-4\`}>
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(img)}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img src={img} alt={\`Image \${index + 1}\`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Selected" className="max-w-full max-h-full p-4" />
        </div>
      )}
    </>
  )
}`
  },

  // Avatar Group
  {
    id: 'avatar-group',
    name: 'Avatar Group',
    description: 'Group of overlapping avatars',
    category: 'ui',
    props: [
      { name: 'users', type: 'array', required: true, default: [
        { name: 'John Doe', image: '' },
        { name: 'Jane Smith', image: '' },
        { name: 'Bob Johnson', image: '' }
      ], description: 'User list' },
      { name: 'max', type: 'number', required: false, default: 4, description: 'Max avatars to show' }
    ],
    dependencies: [],
    code: `
function AvatarGroup({ users = [{ name: 'User' }], max = 4 }) {
  const displayUsers = users.slice(0, max)
  const remaining = users.length - max

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="flex -space-x-3">
      {displayUsers.map((user, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center font-bold text-white text-sm border-2 border-white"
          title={user.name}
        >
          {user.image ? (
            <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700 text-sm border-2 border-white">
          +{remaining}
        </div>
      )}
    </div>
  )
}`
  },

  // Video Player
  {
    id: 'video-player',
    name: 'Video Player',
    description: 'Simple video player',
    category: 'ui',
    props: [
      { name: 'src', type: 'string', required: true, default: 'https://example.com/video.mp4', description: 'Video URL' },
      { name: 'poster', type: 'string', required: false, default: '', description: 'Poster image URL' }
    ],
    dependencies: [],
    code: `
function VideoPlayer({ src = 'https://example.com/video.mp4', poster = '' }) {
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <video
        src={src}
        poster={poster}
        controls
        className="w-full"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}`
  },

  // Icon
  {
    id: 'icon',
    name: 'Icon',
    description: 'Icon component with size variants',
    category: 'ui',
    props: [
      { name: 'icon', type: 'string', required: true, default: '⭐', description: 'Icon emoji or character' },
      { name: 'size', type: 'string', required: false, default: 'md', description: 'Size: sm, md, lg, xl' },
      { name: 'color', type: 'string', required: false, default: '', description: 'Color class' }
    ],
    dependencies: [],
    code: `
function Icon({ icon = '⭐', size = 'md', color = '' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  }

  return (
    <span className={\`\${sizes[size]} \${color}\`}>
      {icon}
    </span>
  )
}`
  },

  // File Upload
  {
    id: 'file-upload',
    name: 'File Upload',
    description: 'Drag and drop file upload',
    category: 'ui',
    props: [
      { name: 'accept', type: 'string', required: false, default: '*', description: 'Accepted file types' },
      { name: 'maxSize', type: 'number', required: false, default: 5, description: 'Max file size in MB' }
    ],
    dependencies: [],
    code: `
function FileUpload({ accept = '*', maxSize = 5 }) {
  const [files, setFiles] = React.useState([])
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles([...files, ...droppedFiles])
  }

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles([...files, ...selectedFiles])
  }

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={\`border-2 border-dashed rounded-lg p-8 text-center transition-colors \${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}\`}
      >
        <div className="text-4xl mb-3">📁</div>
        <p className="text-gray-700 font-medium mb-2">Drag & drop files here</p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 inline-block">
          Choose Files
          <input type="file" accept={accept} multiple onChange={handleFileInput} className="hidden" />
        </label>
        <p className="text-xs text-gray-400 mt-3">Max size: {maxSize}MB</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`
  }
]

// NAVIGATION CAPSULES (3 cápsulas)
export const NAVIGATION_CAPSULES: CapsuleDefinition[] = [
  // Sidebar
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Collapsible sidebar navigation',
    category: 'layout',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        { label: 'Dashboard', icon: '📊' },
        { label: 'Users', icon: '👥' },
        { label: 'Settings', icon: '⚙️' }
      ], description: 'Menu items' }
    ],
    dependencies: [],
    code: `
function Sidebar({ items = [{ label: 'Item', icon: '📄' }] }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const [selected, setSelected] = React.useState(0)

  return (
    <div className={\`bg-gray-900 text-white h-screen transition-all duration-300 \${isOpen ? 'w-64' : 'w-16'}\`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        {isOpen && <h2 className="text-xl font-bold">Menu</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className="hover:bg-gray-800 p-2 rounded">
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="p-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={\`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors \${selected === index ? 'bg-blue-600' : 'hover:bg-gray-800'}\`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  )
}`
  },

  // Bottom Navigation
  {
    id: 'bottom-nav',
    name: 'Bottom Navigation',
    description: 'Mobile bottom navigation bar',
    category: 'layout',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        { label: 'Home', icon: '🏠' },
        { label: 'Search', icon: '🔍' },
        { label: 'Profile', icon: '👤' }
      ], description: 'Navigation items' }
    ],
    dependencies: [],
    code: `
function BottomNav({ items = [{ label: 'Item', icon: '📄' }] }) {
  const [selected, setSelected] = React.useState(0)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={\`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors \${selected === index ? 'text-blue-600' : 'text-gray-600'}\`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}`
  },

  // Steps
  {
    id: 'steps',
    name: 'Steps',
    description: 'Step progress indicator',
    category: 'ui',
    props: [
      { name: 'steps', type: 'array', required: true, default: ['Step 1', 'Step 2', 'Step 3'], description: 'Step labels' },
      { name: 'current', type: 'number', required: true, default: 1, description: 'Current step (1-based)' }
    ],
    dependencies: [],
    code: `
function Steps({ steps = ['Step 1', 'Step 2', 'Step 3'], current = 1 }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const stepNum = index + 1
        const isCompleted = stepNum < current
        const isCurrent = stepNum === current

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors \${
                isCompleted ? 'bg-green-500 text-white' :
                isCurrent ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-600'
              }\`}>
                {isCompleted ? '✓' : stepNum}
              </div>
              <span className={\`text-sm mt-2 \${isCurrent ? 'text-blue-600 font-semibold' : 'text-gray-600'}\`}>
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className={\`flex-1 h-1 mx-2 rounded \${stepNum < current ? 'bg-green-500' : 'bg-gray-200'}\`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}`
  }
]

// FEEDBACK CAPSULES (4 cápsulas)
export const FEEDBACK_CAPSULES: CapsuleDefinition[] = [
  // Empty State
  {
    id: 'empty-state',
    name: 'Empty State',
    description: 'Empty state placeholder',
    category: 'ui',
    props: [
      { name: 'title', type: 'string', required: true, default: 'No items found', description: 'Title' },
      { name: 'message', type: 'string', required: true, default: 'Try adjusting your search', description: 'Message' },
      { name: 'icon', type: 'string', required: false, default: '📭', description: 'Icon' },
      { name: 'actionText', type: 'string', required: false, default: '', description: 'Button text' }
    ],
    dependencies: [],
    code: `
function EmptyState({ title = 'No items found', message = 'Try adjusting your search', icon = '📭', actionText = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {actionText && (
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
          {actionText}
        </button>
      )}
    </div>
  )
}`
  },

  // Skeleton Loader
  {
    id: 'skeleton',
    name: 'Skeleton Loader',
    description: 'Loading skeleton placeholder',
    category: 'ui',
    props: [
      { name: 'type', type: 'string', required: false, default: 'text', description: 'Type: text, card, avatar, image' },
      { name: 'lines', type: 'number', required: false, default: 3, description: 'Number of lines (for text type)' }
    ],
    dependencies: [],
    code: `
function Skeleton({ type = 'text', lines = 3 }) {
  if (type === 'text') {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(lines)].map((_, i) => (
          <div key={i} className={\`h-4 bg-gray-200 rounded \${i === lines - 1 ? 'w-3/4' : 'w-full'}\`} />
        ))}
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (type === 'avatar') {
    return <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
  }

  if (type === 'image') {
    return <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
  }

  return null
}`
  },

  // Loading Overlay
  {
    id: 'loading-overlay',
    name: 'Loading Overlay',
    description: 'Full-screen loading overlay',
    category: 'ui',
    props: [
      { name: 'text', type: 'string', required: false, default: 'Loading...', description: 'Loading text' }
    ],
    dependencies: [],
    code: `
function LoadingOverlay({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  )
}`
  },

  // Error Boundary
  {
    id: 'error-message',
    name: 'Error Message',
    description: 'Error message display',
    category: 'ui',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Something went wrong', description: 'Error title' },
      { name: 'message', type: 'string', required: true, default: 'Please try again later', description: 'Error message' },
      { name: 'retry', type: 'boolean', required: false, default: true, description: 'Show retry button' }
    ],
    dependencies: [],
    code: `
function ErrorMessage({ title = 'Something went wrong', message = 'Please try again later', retry = true }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-start gap-3">
        <span className="text-3xl">❌</span>
        <div className="flex-1">
          <h3 className="font-bold text-red-900 mb-1">{title}</h3>
          <p className="text-red-700 text-sm mb-4">{message}</p>
          {retry && (
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm">
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}`
  }
]

// Exportar todas las cápsulas extra
export const EXTRA_CAPSULES = [
  ...NOTIFICATION_CAPSULES,
  ...MEDIA_CAPSULES,
  ...NAVIGATION_CAPSULES,
  ...FEEDBACK_CAPSULES
]

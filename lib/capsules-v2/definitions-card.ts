import { CapsuleDefinition } from './types'

/**
 * Card & Container Capsules
 * Various card layouts and container components
 */

export const CARD_CAPSULES: CapsuleDefinition[] = [
  // Product Card
  {
    id: 'product-card',
    name: 'Product Card',
    description: 'E-commerce product card with image and details',
    category: 'card',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Product Name', description: 'Product title' },
      { name: 'price', type: 'string', required: true, default: '$99.99', description: 'Product price' },
      { name: 'image', type: 'string', required: false, default: 'https://via.placeholder.com/300', description: 'Product image' },
      { name: 'rating', type: 'number', required: false, default: 4.5, description: 'Product rating (0-5)' }
    ],
    dependencies: [],
    code: `
function ProductCard({ title = 'Product Name', price = '\\$99.99', image = 'https://via.placeholder.com/300', rating = 4.5 }) {
  const stars = Math.round(rating)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover hover:scale-110 transition-transform" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={\`text-lg \${i < stars ? 'text-yellow-400' : 'text-gray-300'}\`}>★</span>
          ))}
          <span className="text-sm text-gray-600 ml-2">({rating})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">{price}</span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}`
  },

  // Info Card
  {
    id: 'info-card',
    name: 'Info Card',
    description: 'Informational card with icon',
    category: 'card',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Information', description: 'Card title' },
      { name: 'description', type: 'string', required: true, default: 'Card description text', description: 'Card description' },
      { name: 'icon', type: 'string', required: false, default: 'ℹ️', description: 'Card icon' }
    ],
    dependencies: [],
    code: `
function InfoCard({ title = 'Information', description = 'Card description text', icon = 'ℹ️' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}`
  },

  // Profile Card
  {
    id: 'profile-card',
    name: 'Profile Card',
    description: 'User profile card with avatar',
    category: 'card',
    props: [
      { name: 'name', type: 'string', required: true, default: 'John Doe', description: 'User name' },
      { name: 'title', type: 'string', required: false, default: 'Software Engineer', description: 'User title' },
      { name: 'bio', type: 'string', required: false, default: 'Passionate developer', description: 'User bio' },
      { name: 'avatar', type: 'string', required: false, default: '', description: 'Avatar URL' }
    ],
    dependencies: [],
    code: `
function ProfileCard({ name = 'John Doe', title = 'Software Engineer', bio = 'Passionate developer', avatar = '' }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          name.split(' ').map(n => n[0]).join('')
        )}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
      <p className="text-blue-600 font-medium mb-3">{title}</p>
      <p className="text-gray-600 text-sm mb-4">{bio}</p>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Connect
      </button>
    </div>
  )
}`
  },

  // Notification Card
  {
    id: 'notification-card',
    name: 'Notification Card',
    description: 'Notification message card',
    category: 'card',
    props: [
      { name: 'message', type: 'string', required: true, default: 'You have a new notification', description: 'Notification message' },
      { name: 'time', type: 'string', required: false, default: '5 min ago', description: 'Time stamp' },
      { name: 'read', type: 'boolean', required: false, default: false, description: 'Read status' }
    ],
    dependencies: [],
    code: `
function NotificationCard({ message = 'You have a new notification', time = '5 min ago', read = false }) {
  return (
    <div className={\`p-4 border-l-4 \${read ? 'border-gray-300 bg-white' : 'border-blue-600 bg-blue-50'} rounded-r-lg shadow-sm\`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={\`text-sm \${read ? 'text-gray-600' : 'text-gray-900 font-medium'}\`}>
            {message}
          </p>
          <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
        {!read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
        )}
      </div>
    </div>
  )
}`
  },

  // Event Card
  {
    id: 'event-card',
    name: 'Event Card',
    description: 'Event information card',
    category: 'card',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Event Title', description: 'Event title' },
      { name: 'date', type: 'string', required: true, default: 'Jan 1, 2024', description: 'Event date' },
      { name: 'location', type: 'string', required: false, default: 'Online', description: 'Event location' },
      { name: 'attendees', type: 'number', required: false, default: 0, description: 'Number of attendees' }
    ],
    dependencies: [],
    code: `
function EventCard({ title = 'Event Title', date = 'Jan 1, 2024', location = 'Online', attendees = 0 }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-blue-100 text-sm">{date}</p>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <span>📍</span>
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <span>👥</span>
          <span className="text-sm">{attendees} attending</span>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Register Now
        </button>
      </div>
    </div>
  )
}`
  },

  // Weather Card
  {
    id: 'weather-card',
    name: 'Weather Card',
    description: 'Weather information card',
    category: 'card',
    props: [
      { name: 'city', type: 'string', required: true, default: 'San Francisco', description: 'City name' },
      { name: 'temperature', type: 'number', required: true, default: 72, description: 'Temperature' },
      { name: 'condition', type: 'string', required: false, default: 'Sunny', description: 'Weather condition' },
      { name: 'icon', type: 'string', required: false, default: '☀️', description: 'Weather icon' }
    ],
    dependencies: [],
    code: `
function WeatherCard({ city = 'San Francisco', temperature = 72, condition = 'Sunny', icon = '☀️' }) {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <h3 className="text-2xl font-bold mb-4">{city}</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-6xl font-bold">{temperature}°</div>
          <div className="text-blue-100 mt-2">{condition}</div>
        </div>
        <div className="text-7xl">{icon}</div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-300 flex justify-between text-sm">
        <span>H: {temperature + 5}°</span>
        <span>L: {temperature - 5}°</span>
      </div>
    </div>
  )
}`
  },

  // Dashboard Widget
  {
    id: 'dashboard-widget',
    name: 'Dashboard Widget',
    description: 'Dashboard metric widget',
    category: 'card',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Active Users', description: 'Widget title' },
      { name: 'value', type: 'string', required: true, default: '1,234', description: 'Metric value' },
      { name: 'trend', type: 'number', required: false, default: 12.5, description: 'Trend percentage' },
      { name: 'icon', type: 'string', required: false, default: '👥', description: 'Widget icon' }
    ],
    dependencies: [],
    code: `
function DashboardWidget({ title = 'Active Users', value = '1,234', trend = 12.5, icon = '👥' }) {
  const isPositive = trend >= 0

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className={\`flex items-center gap-1 text-sm \${isPositive ? 'text-green-600' : 'text-red-600'}\`}>
        <span>{isPositive ? '↗' : '↘'}</span>
        <span>{Math.abs(trend)}%</span>
        <span className="text-gray-500">vs last week</span>
      </div>
    </div>
  )
}`
  },

  // Expandable Card
  {
    id: 'expandable-card',
    name: 'Expandable Card',
    description: 'Card that expands to show more content',
    category: 'card',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Card Title', description: 'Card title' },
      { name: 'preview', type: 'string', required: true, default: 'Preview text...', description: 'Preview text' },
      { name: 'fullContent', type: 'string', required: true, default: 'Full content text...', description: 'Full content' }
    ],
    dependencies: [],
    code: `
function ExpandableCard({ title = 'Card Title', preview = 'Preview text...', fullContent = 'Full content text...' }) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">
          {isExpanded ? fullContent : preview}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 font-medium text-sm hover:text-blue-700"
        >
          {isExpanded ? 'Show Less' : 'Read More'} →
        </button>
      </div>
    </div>
  )
}`
  }
]

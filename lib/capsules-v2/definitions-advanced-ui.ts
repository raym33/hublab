/**
 * Cápsulas UI Avanzadas V2
 * Componentes UI complejos para aplicaciones profesionales
 */

import { CapsuleDefinition } from './types'

export const ADVANCED_UI_CAPSULES: CapsuleDefinition[] = [
  // Multi-Step Form
  {
    id: 'multi-step-form',
    name: 'Multi-Step Form',
    description: 'Wizard-style multi-step form with validation',
    category: 'feature',
    props: [
      { name: 'steps', type: 'array', required: true, default: [
        { title: 'Personal Info', fields: ['name', 'email'] },
        { title: 'Address', fields: ['street', 'city'] },
        { title: 'Review', fields: [] }
      ], description: 'Form steps configuration' }
    ],
    dependencies: [],
    code: `
function MultiStepForm({ steps = [
  { title: 'Personal Info', fields: ['name', 'email'] },
  { title: 'Address', fields: ['street', 'city'] },
  { title: 'Review', fields: [] }
] }) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState({})

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={\`flex-1 text-center text-sm font-medium \${
                idx <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }\`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
            style={{ width: \`\${((currentStep + 1) / steps.length) * 100}%\` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[200px]">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {steps[currentStep].title}
        </h2>

        {currentStep === steps.length - 1 ? (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Review Your Information</h3>
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600 capitalize">{key}:</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {steps[currentStep].fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  value={formData[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={\`Enter \${field}\`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={nextStep}
          className={\`px-6 py-2 rounded-lg text-white font-semibold \${
            isLastStep
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }\`}
        >
          {isLastStep ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  )
}`
  },

  // Advanced Data Table
  {
    id: 'advanced-table',
    name: 'Advanced Data Table',
    description: 'Feature-rich table with sorting, filtering, and pagination',
    category: 'ui',
    props: [
      { name: 'data', type: 'array', required: true, default: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
      ], description: 'Table data' },
      { name: 'pageSize', type: 'number', required: false, default: 5, description: 'Rows per page' }
    ],
    dependencies: [],
    code: `
function AdvancedTable({ data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
], pageSize = 5 }) {
  const [sortKey, setSortKey] = React.useState('id')
  const [sortOrder, setSortOrder] = React.useState('asc')
  const [filter, setFilter] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  // Filter data
  const filtered = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(filter.toLowerCase())
    )
  )

  // Sort data
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    const order = sortOrder === 'asc' ? 1 : -1
    return aVal > bVal ? order : -order
  })

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const paginated = sorted.slice(startIdx, startIdx + pageSize)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    {col}
                    {sortKey === col && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col === 'status' ? (
                      <span className={\`px-2 py-1 text-xs font-semibold rounded-full \${
                        row[col] === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }\`}>
                        {row[col]}
                      </span>
                    ) : (
                      row[col]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIdx + 1} to {Math.min(startIdx + pageSize, sorted.length)} of {sorted.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}`
  },

  // Dashboard Layout
  {
    id: 'dashboard-layout',
    name: 'Dashboard Layout',
    description: 'Complete dashboard layout with sidebar and header',
    category: 'layout',
    props: [
      { name: 'title', type: 'string', required: false, default: 'Dashboard', description: 'Dashboard title' }
    ],
    dependencies: [],
    code: `
function DashboardLayout({ title = 'Dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const menuItems = [
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '📈', label: 'Analytics', active: false },
    { icon: '👥', label: 'Users', active: false },
    { icon: '⚙️', label: 'Settings', active: false }
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={\`bg-gray-900 text-white transition-all duration-300 \${sidebarOpen ? 'w-64' : 'w-20'}\`}>
        <div className="p-4 flex items-center justify-between">
          <h1 className={\`font-bold text-xl \${!sidebarOpen && 'hidden'}\`}>{title}</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-gray-800 p-2 rounded"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className={\`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer \${
                item.active ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }\`}
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">🔔</button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Users', value: '1,234', change: '+12%', color: 'blue' },
              { label: 'Revenue', value: '$45.2K', change: '+8%', color: 'green' },
              { label: 'Orders', value: '456', change: '-2%', color: 'purple' },
              { label: 'Growth', value: '23%', change: '+5%', color: 'pink' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className={\`text-sm font-medium \${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}\`}>
                  {stat.change} from last month
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {['New user registered', 'Order #1234 completed', 'Payment received'].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">{activity}</span>
                  <span className="ml-auto text-sm text-gray-500">{idx + 1}h ago</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}`
  },

  // Image Cropper
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Image cropping tool with zoom and rotate',
    category: 'ui',
    props: [
      { name: 'aspectRatio', type: 'string', required: false, default: '1:1', description: 'Crop aspect ratio' }
    ],
    dependencies: [],
    code: `
function ImageCropper({ aspectRatio = '1:1' }) {
  const [image, setImage] = React.useState(null)
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      {!image ? (
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 cursor-pointer">
          <div className="text-6xl mb-4">📷</div>
          <div className="text-gray-600 mb-2">Click to upload image</div>
          <div className="text-sm text-gray-500">or drag and drop</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div>
          <div className="relative overflow-hidden bg-gray-100 rounded-lg mb-4" style={{ height: '400px' }}>
            <img
              src={image}
              alt="Crop preview"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
              style={{
                transform: \`translate(-50%, -50%) scale(\${zoom}) rotate(\${rotation}deg)\`
              }}
            />
            <div className="absolute inset-0 border-2 border-white shadow-lg" style={{
              width: '80%',
              height: aspectRatio === '1:1' ? '80%' : '60%',
              margin: 'auto'
            }}></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom: {zoom.toFixed(1)}x
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation: {rotation}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setImage(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`
  },

  // Chat Interface
  {
    id: 'chat-interface',
    name: 'Chat Interface',
    description: 'Real-time chat interface with messages',
    category: 'feature',
    props: [
      { name: 'username', type: 'string', required: false, default: 'User', description: 'Current user name' }
    ],
    dependencies: [],
    code: `
function ChatInterface({ username = 'User' }) {
  const [messages, setMessages] = React.useState([
    { id: 1, user: 'Alice', text: 'Hey! How are you?', time: '10:30 AM', me: false },
    { id: 2, user: username, text: 'I\\'m good, thanks!', time: '10:31 AM', me: true },
    { id: 3, user: 'Alice', text: 'Great! Working on anything interesting?', time: '10:32 AM', me: false }
  ])
  const [input, setInput] = React.useState('')
  const messagesEndRef = React.useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(scrollToBottom, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        user: username,
        text: input,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        me: true
      }])
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          👥
        </div>
        <div>
          <div className="font-semibold">Chat Room</div>
          <div className="text-xs text-blue-100">3 members online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={\`flex \${msg.me ? 'justify-end' : 'justify-start'}\`}
          >
            <div className={\`max-w-[70%] \${msg.me ? 'order-2' : 'order-1'}\`}>
              {!msg.me && (
                <div className="text-xs text-gray-500 mb-1">{msg.user}</div>
              )}
              <div className={\`rounded-lg px-4 py-2 \${
                msg.me
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }\`}>
                {msg.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}`
  },

  // Calendar
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Interactive calendar with events',
    category: 'ui',
    props: [
      { name: 'events', type: 'array', required: false, default: [
        { date: 15, title: 'Meeting', color: 'blue' },
        { date: 20, title: 'Deadline', color: 'red' }
      ], description: 'Calendar events' }
    ],
    dependencies: [],
    code: `
function Calendar({ events = [
  { date: 15, title: 'Meeting', color: 'blue' },
  { date: 20, title: 'Deadline', color: 'red' }
] }) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState(null)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const hasEvent = (day) => events.find(e => e.date === day)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          →
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(firstDay)].map((_, idx) => (
          <div key={\`empty-\${idx}\`} />
        ))}
        {[...Array(daysInMonth)].map((_, idx) => {
          const day = idx + 1
          const event = hasEvent(day)
          const isToday = day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              className={\`aspect-square p-2 rounded-lg text-sm transition-colors \${
                isToday
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold'
                  : selectedDate === day
                  ? 'bg-blue-100 text-blue-900 font-semibold'
                  : 'hover:bg-gray-100 text-gray-900'
              }\`}
            >
              <div>{day}</div>
              {event && (
                <div className={\`w-1 h-1 rounded-full mx-auto mt-1 \${
                  isToday ? 'bg-white' : 'bg-' + event.color + '-500'
                }\`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            {monthNames[currentDate.getMonth()]} {selectedDate}
          </h3>
          {events.filter(e => e.date === selectedDate).length > 0 ? (
            events.filter(e => e.date === selectedDate).map((event, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1">
                <div className={\`w-2 h-2 rounded-full bg-\${event.color}-500\`} />
                <span className="text-sm text-gray-700">{event.title}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No events</p>
          )}
        </div>
      )}
    </div>
  )
}`
  }
]

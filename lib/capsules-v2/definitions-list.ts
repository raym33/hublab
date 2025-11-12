import { CapsuleDefinition } from './types'

/**
 * List & Grid Capsules
 * List layouts and grid arrangements
 */

export const LIST_CAPSULES: CapsuleDefinition[] = [
  // Contact List
  {
    id: 'contact-list',
    name: 'Contact List',
    description: 'List of contacts with avatars',
    category: 'list',
    props: [
      { name: 'contacts', type: 'array', required: true, default: [
        { name: 'John Doe', email: 'john@example.com', role: 'Developer' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' }
      ], description: 'Contact list' }
    ],
    dependencies: [],
    code: `
function ContactList({ contacts = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
      {contacts.map((contact, idx) => (
        <div key={idx} className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {contact.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{contact.name}</div>
            <div className="text-sm text-gray-600">{contact.email}</div>
          </div>
          <div className="text-sm text-gray-500">{contact.role}</div>
        </div>
      ))}
    </div>
  )
}`
  },

  // Todo List
  {
    id: 'todo-list',
    name: 'Todo List',
    description: 'Interactive todo list',
    category: 'list',
    props: [
      { name: 'title', type: 'string', required: false, default: 'My Tasks', description: 'List title' }
    ],
    dependencies: [],
    code: `
function TodoList({ title = 'My Tasks' }) {
  const [todos, setTodos] = React.useState([
    { text: 'Complete project', done: false },
    { text: 'Review code', done: true },
    { text: 'Update documentation', done: false }
  ])
  const [input, setInput] = React.useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { text: input.trim(), done: false }])
      setInput('')
    }
  }

  const toggleTodo = (idx) => {
    setTodos(todos.map((todo, i) =>
      i === idx ? { ...todo, done: !todo.done } : todo
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {todos.map((todo, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(idx)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className={\`flex-1 \${todo.done ? 'line-through text-gray-400' : 'text-gray-900'}\`}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // Icon List
  {
    id: 'icon-list',
    name: 'Icon List',
    description: 'List with icons',
    category: 'list',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        { icon: '✓', text: 'Feature 1', description: 'Description 1' },
        { icon: '✓', text: 'Feature 2', description: 'Description 2' }
      ], description: 'List items' }
    ],
    dependencies: [],
    code: `
function IconList({ items = [] }) {
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            {item.icon}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{item.text}</div>
            {item.description && (
              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}`
  },

  // Image Grid
  {
    id: 'image-grid',
    name: 'Image Grid',
    description: 'Responsive image grid',
    category: 'list',
    props: [
      { name: 'images', type: 'array', required: true, default: [
        'https://via.placeholder.com/300',
        'https://via.placeholder.com/300',
        'https://via.placeholder.com/300',
        'https://via.placeholder.com/300'
      ], description: 'Image URLs' },
      { name: 'columns', type: 'number', required: false, default: 3, description: 'Number of columns' }
    ],
    dependencies: [],
    code: `
function ImageGrid({ images = [], columns = 3 }) {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  return (
    <div className={\`grid \${gridClass[columns] || gridClass[3]} gap-4\`}>
      {images.map((image, idx) => (
        <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={\`Image \${idx + 1}\`}
            className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
          />
        </div>
      ))}
    </div>
  )
}`
  },

  // Menu List
  {
    id: 'menu-list',
    name: 'Menu List',
    description: 'Navigation menu list',
    category: 'list',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        { label: 'Home', href: '/', badge: null },
        { label: 'Messages', href: '/messages', badge: '5' },
        { label: 'Settings', href: '/settings', badge: null }
      ], description: 'Menu items' }
    ],
    dependencies: [],
    code: `
function MenuList({ items = [] }) {
  const [activeItem, setActiveItem] = React.useState(0)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => setActiveItem(idx)}
          className={\`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 \${
            activeItem === idx ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'
          }\`}
        >
          <span className={\`font-medium \${activeItem === idx ? 'text-blue-600' : 'text-gray-900'}\`}>
            {item.label}
          </span>
          {item.badge && (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}`
  },

  // Comment List
  {
    id: 'comment-list',
    name: 'Comment List',
    description: 'Threaded comment list',
    category: 'list',
    props: [
      { name: 'comments', type: 'array', required: true, default: [
        { author: 'John Doe', text: 'Great article!', time: '2 hours ago' },
        { author: 'Jane Smith', text: 'Thanks for sharing', time: '1 hour ago' }
      ], description: 'Comment list' }
    ],
    dependencies: [],
    code: `
function CommentList({ comments = [] }) {
  return (
    <div className="space-y-4">
      {comments.map((comment, idx) => (
        <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              {comment.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{comment.author}</div>
              <div className="text-xs text-gray-500">{comment.time}</div>
            </div>
          </div>
          <p className="text-gray-700">{comment.text}</p>
        </div>
      ))}
    </div>
  )
}`
  },

  // Activity Feed
  {
    id: 'activity-feed',
    name: 'Activity Feed',
    description: 'Timeline activity feed',
    category: 'list',
    props: [
      { name: 'activities', type: 'array', required: true, default: [
        { user: 'John', action: 'uploaded a photo', time: '5m ago' },
        { user: 'Jane', action: 'commented on your post', time: '1h ago' }
      ], description: 'Activity list' }
    ],
    dependencies: [],
    code: `
function ActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Feed</h3>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{activity.user}</span>
                {' '}{activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // File List
  {
    id: 'file-list',
    name: 'File List',
    description: 'List of files with details',
    category: 'list',
    props: [
      { name: 'files', type: 'array', required: true, default: [
        { name: 'document.pdf', size: '2.4 MB', type: 'PDF' },
        { name: 'image.png', size: '1.1 MB', type: 'Image' }
      ], description: 'File list' }
    ],
    dependencies: [],
    code: `
function FileList({ files = [] }) {
  const getIcon = (type) => {
    const icons = {
      'PDF': '📄',
      'Image': '🖼️',
      'Video': '🎥',
      'Document': '📝'
    }
    return icons[type] || '📎'
  }

  return (
    <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
      {files.map((file, idx) => (
        <div key={idx} className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4">
          <div className="text-3xl">{getIcon(file.type)}</div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{file.name}</div>
            <div className="text-sm text-gray-500">{file.type} • {file.size}</div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">⋯</button>
        </div>
      ))}
    </div>
  )
}`
  }
]

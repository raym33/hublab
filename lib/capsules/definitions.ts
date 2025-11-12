/**
 * Definiciones de las 10 Cápsulas Básicas
 * Cada una con su código React completo embebido
 */

import { CapsuleDefinition } from './types'

export const CAPSULE_DEFINITIONS: CapsuleDefinition[] = [
  // 1. BUTTON
  {
    id: 'button',
    name: 'Button',
    description: 'Interactive button with multiple styles',
    category: 'ui',
    props: [
      { name: 'text', type: 'string', required: true, default: 'Click me', description: 'Button text' },
      { name: 'variant', type: 'string', required: false, default: 'primary', description: 'Button style: primary, secondary, danger' },
      { name: 'onClick', type: 'string', required: false, description: 'Action on click' }
    ],
    dependencies: [],
    code: `
function Button({ text = 'Click me', variant = 'primary', onClick }) {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }

  return (
    <button
      onClick={onClick}
      className={\`px-6 py-3 rounded-lg font-semibold transition-colors \${styles[variant]}\`}
    >
      {text}
    </button>
  )
}`
  },

  // 2. INPUT
  {
    id: 'input',
    name: 'Input',
    description: 'Text input field with label',
    category: 'ui',
    props: [
      { name: 'label', type: 'string', required: false, default: '', description: 'Input label' },
      { name: 'placeholder', type: 'string', required: false, default: 'Enter text...', description: 'Placeholder text' },
      { name: 'type', type: 'string', required: false, default: 'text', description: 'Input type' }
    ],
    dependencies: [],
    code: `
function Input({ label = '', placeholder = 'Enter text...', type = 'text' }) {
  const [value, setValue] = React.useState('')

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}`
  },

  // 3. CARD
  {
    id: 'card',
    name: 'Card',
    description: 'Content card with title and body',
    category: 'layout',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Card Title', description: 'Card title' },
      { name: 'content', type: 'string', required: true, default: 'Card content goes here', description: 'Card content' }
    ],
    dependencies: [],
    code: `
function Card({ title = 'Card Title', content = 'Card content goes here' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  )
}`
  },

  // 4. LIST
  {
    id: 'list',
    name: 'List',
    description: 'Dynamic list of items',
    category: 'ui',
    props: [
      { name: 'items', type: 'array', required: true, default: ['Item 1', 'Item 2', 'Item 3'], description: 'List items' },
      { name: 'title', type: 'string', required: false, default: '', description: 'List title' }
    ],
    dependencies: [],
    code: `
function List({ items = ['Item 1', 'Item 2', 'Item 3'], title = '' }) {
  return (
    <div className="space-y-3">
      {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span className="text-gray-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}`
  },

  // 5. FORM
  {
    id: 'form',
    name: 'Form',
    description: 'Complete form with fields and submit',
    category: 'feature',
    props: [
      { name: 'title', type: 'string', required: false, default: 'Contact Form', description: 'Form title' },
      { name: 'fields', type: 'array', required: true, default: [{ name: 'name', label: 'Name', type: 'text' }], description: 'Form fields' }
    ],
    dependencies: [],
    code: `
function Form({ title = 'Contact Form', fields = [{ name: 'name', label: 'Name', type: 'text' }] }) {
  const [formData, setFormData] = React.useState({})
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">{field.label}</label>
            <input
              type={field.type || 'text'}
              name={field.name}
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Submit
        </button>
        {submitted && (
          <div className="p-3 bg-green-100 text-green-800 rounded-lg">
            Form submitted successfully!
          </div>
        )}
      </form>
    </div>
  )
}`
  },

  // 6. COUNTER
  {
    id: 'counter',
    name: 'Counter',
    description: 'Simple counter with increment/decrement',
    category: 'logic',
    props: [
      { name: 'initial', type: 'number', required: false, default: 0, description: 'Initial count value' },
      { name: 'title', type: 'string', required: false, default: 'Counter', description: 'Counter title' }
    ],
    dependencies: [],
    code: `
function Counter({ initial = 0, title = 'Counter' }) {
  const [count, setCount] = React.useState(initial)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <div className="text-6xl font-bold text-blue-600">{count}</div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setCount(count - 1)}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
        >
          -
        </button>
        <button
          onClick={() => setCount(initial)}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
        >
          +
        </button>
      </div>
    </div>
  )
}`
  },

  // 7. TIMER
  {
    id: 'timer',
    name: 'Timer',
    description: 'Countdown timer',
    category: 'logic',
    props: [
      { name: 'seconds', type: 'number', required: false, default: 60, description: 'Timer duration in seconds' },
      { name: 'title', type: 'string', required: false, default: 'Timer', description: 'Timer title' }
    ],
    dependencies: [],
    code: `
function Timer({ seconds = 60, title = 'Timer' }) {
  const [timeLeft, setTimeLeft] = React.useState(seconds)
  const [isRunning, setIsRunning] = React.useState(false)

  React.useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const toggle = () => setIsRunning(!isRunning)
  const reset = () => {
    setTimeLeft(seconds)
    setIsRunning(false)
  }

  const minutes = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <div className="text-6xl font-bold text-blue-600">
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={toggle}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
        >
          Reset
        </button>
      </div>
      {timeLeft === 0 && (
        <div className="text-green-600 font-bold">Time's up!</div>
      )}
    </div>
  )
}`
  },

  // 8. TABS
  {
    id: 'tabs',
    name: 'Tabs',
    description: 'Tabbed navigation interface',
    category: 'ui',
    props: [
      { name: 'tabs', type: 'array', required: true, default: [
        { label: 'Tab 1', content: 'Content 1' },
        { label: 'Tab 2', content: 'Content 2' }
      ], description: 'Tab configurations' }
    ],
    dependencies: [],
    code: `
function Tabs({ tabs = [{ label: 'Tab 1', content: 'Content 1' }] }) {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={\`flex-1 px-6 py-3 font-semibold transition-colors \${
              activeTab === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }\`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        <p className="text-gray-800">{tabs[activeTab]?.content}</p>
      </div>
    </div>
  )
}`
  },

  // 9. MODAL
  {
    id: 'modal',
    name: 'Modal',
    description: 'Modal dialog window',
    category: 'ui',
    props: [
      { name: 'title', type: 'string', required: false, default: 'Modal Title', description: 'Modal title' },
      { name: 'content', type: 'string', required: false, default: 'Modal content', description: 'Modal content' }
    ],
    dependencies: [],
    code: `
function Modal({ title = 'Modal Title', content = 'Modal content' }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-6">{content}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}`
  },

  // 10. TODO LIST
  {
    id: 'todolist',
    name: 'TodoList',
    description: 'Complete todo list with add/remove/toggle',
    category: 'feature',
    props: [
      { name: 'title', type: 'string', required: false, default: 'My Tasks', description: 'Todo list title' }
    ],
    dependencies: [],
    code: `
function TodoList({ title = 'My Tasks' }) {
  const [todos, setTodos] = React.useState([
    { id: 1, text: 'Sample task 1', done: false },
    { id: 2, text: 'Sample task 2', done: true }
  ])
  const [input, setInput] = React.useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }])
      setInput('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? {...t, done: !t.done} : t))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5 text-blue-600"
            />
            <span className={\`flex-1 \${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}\`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {todos.filter(t => !t.done).length} tasks remaining
      </div>
    </div>
  )
}`
  }
]

// Helper para buscar cápsulas
export function getCapsuleById(id: string): CapsuleDefinition | undefined {
  return CAPSULE_DEFINITIONS.find(c => c.id === id)
}

export function getAllCapsules(): CapsuleDefinition[] {
  return CAPSULE_DEFINITIONS
}

export function getCapsulesByCategory(category: string): CapsuleDefinition[] {
  return CAPSULE_DEFINITIONS.filter(c => c.category === category)
}

import { CapsuleDefinition } from './types'

/**
 * Input & Search Capsules
 * Advanced input components and search functionality
 */

export const INPUT_CAPSULES: CapsuleDefinition[] = [
  // Search Bar
  {
    id: 'search-bar',
    name: 'Search Bar',
    description: 'Search input with icon',
    category: 'input',
    props: [
      { name: 'placeholder', type: 'string', required: false, default: 'Search...', description: 'Placeholder text' },
      { name: 'size', type: 'string', required: false, default: 'md', description: 'Size: sm, md, lg' }
    ],
    dependencies: [],
    code: `
function SearchBar({ placeholder = 'Search...', size = 'md' }) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </div>
      <input
        type="search"
        placeholder={placeholder}
        className={\`w-full \${sizes[size]} pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500\`}
      />
    </div>
  )
}`
  },

  // Auto-complete Input
  {
    id: 'autocomplete',
    name: 'Autocomplete',
    description: 'Input with autocomplete suggestions',
    category: 'input',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Search', description: 'Input label' },
      { name: 'suggestions', type: 'array', required: true, default: ['Apple', 'Banana', 'Cherry', 'Date'], description: 'Suggestion list' }
    ],
    dependencies: [],
    code: `
function Autocomplete({ label = 'Search', suggestions = ['Apple', 'Banana', 'Cherry', 'Date'] }) {
  const [value, setValue] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {filtered.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                setValue(suggestion)
                setShowSuggestions(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}`
  },

  // Tag Input
  {
    id: 'tag-input',
    name: 'Tag Input',
    description: 'Input for adding multiple tags',
    category: 'input',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Tags', description: 'Input label' },
      { name: 'placeholder', type: 'string', required: false, default: 'Add tag...', description: 'Placeholder text' }
    ],
    dependencies: [],
    code: `
function TagInput({ label = 'Tags', placeholder = 'Add tag...' }) {
  const [tags, setTags] = React.useState([])
  const [input, setInput] = React.useState('')

  const addTag = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      setTags([...tags, input.trim()])
      setInput('')
    }
  }

  const removeTag = (idx) => {
    setTags(tags.filter((_, i) => i !== idx))
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {tag}
            <button onClick={() => removeTag(idx)} className="hover:text-blue-900">✕</button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={addTag}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] outline-none px-2 py-1"
        />
      </div>
    </div>
  )
}`
  },

  // Password Input
  {
    id: 'password-input',
    name: 'Password Input',
    description: 'Password input with show/hide toggle',
    category: 'input',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Password', description: 'Input label' },
      { name: 'showStrength', type: 'boolean', required: false, default: true, description: 'Show strength meter' }
    ],
    dependencies: [],
    code: `
function PasswordInput({ label = 'Password', showStrength = true }) {
  const [value, setValue] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const strength = value.length === 0 ? 0 :
    value.length < 6 ? 1 :
    value.length < 10 ? 2 : 3

  const strengthColors = ['bg-gray-200', 'bg-red-500', 'bg-yellow-500', 'bg-green-500']
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong']

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={\`h-1 flex-1 rounded \${i <= strength ? strengthColors[strength] : 'bg-gray-200'}\`} />
            ))}
          </div>
          <p className="text-xs text-gray-600">{strengthLabels[strength]}</p>
        </div>
      )}
    </div>
  )
}`
  },

  // Number Stepper
  {
    id: 'number-stepper',
    name: 'Number Stepper',
    description: 'Number input with increment/decrement buttons',
    category: 'input',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Quantity', description: 'Input label' },
      { name: 'min', type: 'number', required: false, default: 0, description: 'Minimum value' },
      { name: 'max', type: 'number', required: false, default: 100, description: 'Maximum value' }
    ],
    dependencies: [],
    code: `
function NumberStepper({ label = 'Quantity', min = 0, max = 100 }) {
  const [value, setValue] = React.useState(min)

  const increment = () => setValue(Math.min(max, value + 1))
  const decrement = () => setValue(Math.max(min, value - 1))

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          disabled={value <= min}
          className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Math.min(max, Math.max(min, Number(e.target.value))))}
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={increment}
          disabled={value >= max}
          className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  )
}`
  },

  // Color Picker
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Color selection input',
    category: 'input',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Color', description: 'Input label' },
      { name: 'defaultColor', type: 'string', required: false, default: '#3B82F6', description: 'Default color' }
    ],
    dependencies: [],
    code: `
function ColorPicker({ label = 'Color', defaultColor = '#3B82F6' }) {
  const [color, setColor] = React.useState(defaultColor)

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
          className="w-12 h-12 rounded-lg border border-gray-300"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}`
  },

  // Date Picker
  {
    id: 'date-picker',
    name: 'Date Picker',
    description: 'Date selection input',
    category: 'input',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Date', description: 'Input label' }
    ],
    dependencies: [],
    code: `
function DatePicker({ label = 'Date' }) {
  const [date, setDate] = React.useState('')

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}`
  },

  // Time Picker
  {
    id: 'time-picker',
    name: 'Time Picker',
    description: 'Time selection input',
    category: 'input',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Time', description: 'Input label' }
    ],
    dependencies: [],
    code: `
function TimePicker({ label = 'Time' }) {
  const [time, setTime] = React.useState('')

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}`
  }
]

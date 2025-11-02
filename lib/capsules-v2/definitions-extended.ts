/**
 * Cápsulas Extendidas V2 - Migradas del sistema anterior
 * Incluye las 21 cápsulas UI + cápsulas adicionales útiles
 */

import { CapsuleDefinition } from './types'
import { CAPSULE_DEFINITIONS } from './definitions'
import { ADVANCED_CAPSULES } from './definitions-advanced'
import { EXTRA_CAPSULES } from './definitions-extra'
import { INTERACTION_CAPSULES } from './definitions-interaction'
import { ADVANCED_UI_CAPSULES } from './definitions-advanced-ui'
import { AI_ML_CAPSULES } from './definitions-ai-ml'
import { MEDIA_CAPSULES } from './definitions-media'
import { DATAVIZ_CAPSULES } from './definitions-dataviz'
import { FORMS_CAPSULES } from './definitions-forms'
import { UTILITIES_CAPSULES } from './definitions-utilities'
import { LAYOUT_CAPSULES } from './definitions-layout'
import { ANIMATION_CAPSULES } from './definitions-animation'
import { SOCIAL_CAPSULES } from './definitions-social'
import { ECOMMERCE_CAPSULES } from './definitions-ecommerce'
import { FORM_CAPSULES } from './definitions-form'
import { NAVIGATION_CAPSULES } from './definitions-navigation'
import { DATA_CAPSULES } from './definitions-data'
import { FEEDBACK_CAPSULES } from './definitions-feedback'
import { CONTENT_CAPSULES } from './definitions-content'
import { MODAL_CAPSULES } from './definitions-modal'
import { CARD_CAPSULES } from './definitions-card'
import { INPUT_CAPSULES } from './definitions-input'
import { CHART_CAPSULES } from './definitions-chart'
import { LIST_CAPSULES } from './definitions-list'

// CÁPSULAS UI ADICIONALES (21 cápsulas del sistema anterior)
const UI_CAPSULES_EXTENDED: CapsuleDefinition[] = [
  // Dropdown Menu
  {
    id: 'dropdown',
    name: 'Dropdown Menu',
    description: 'Dropdown menu with options',
    category: 'ui',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Menu', description: 'Button label' },
      { name: 'options', type: 'array', required: true, default: ['Option 1', 'Option 2', 'Option 3'], description: 'Menu options' }
    ],
    dependencies: [],
    code: `
function Dropdown({ label = 'Menu', options = ['Option 1', 'Option 2', 'Option 3'] }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(null)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        {selected || label}
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] z-50">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setSelected(option)
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}`
  },

  // Tooltip
  {
    id: 'tooltip',
    name: 'Tooltip',
    description: 'Hover tooltip component',
    category: 'ui',
    props: [
      { name: 'text', type: 'string', required: true, default: 'Hover me', description: 'Button text' },
      { name: 'tooltip', type: 'string', required: true, default: 'Tooltip content', description: 'Tooltip content' }
    ],
    dependencies: [],
    code: `
function Tooltip({ text = 'Hover me', tooltip = 'Tooltip content' }) {
  const [show, setShow] = React.useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        {text}
      </button>

      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}`
  },

  // Badge
  {
    id: 'badge',
    name: 'Badge',
    description: 'Small badge for labels and counts',
    category: 'ui',
    props: [
      { name: 'text', type: 'string', required: true, default: 'New', description: 'Badge text' },
      { name: 'variant', type: 'string', required: false, default: 'default', description: 'Badge variant: default, success, warning, error' }
    ],
    dependencies: [],
    code: `
function Badge({ text = 'New', variant = 'default' }) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }

  return (
    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${variants[variant]}\`}>
      {text}
    </span>
  )
}`
  },

  // Avatar
  {
    id: 'avatar',
    name: 'Avatar',
    description: 'User avatar with initials fallback',
    category: 'ui',
    props: [
      { name: 'name', type: 'string', required: true, default: 'John Doe', description: 'User name' },
      { name: 'image', type: 'string', required: false, default: '', description: 'Image URL' },
      { name: 'size', type: 'string', required: false, default: 'md', description: 'Size: sm, md, lg' }
    ],
    dependencies: [],
    code: `
function Avatar({ name = 'John Doe', image = '', size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className={\`rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center font-bold text-white \${sizes[size]}\`}>
      {image ? (
        <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}`
  },

  // Progress Bar
  {
    id: 'progress',
    name: 'Progress Bar',
    description: 'Progress indicator',
    category: 'ui',
    props: [
      { name: 'value', type: 'number', required: true, default: 50, description: 'Progress value (0-100)' },
      { name: 'label', type: 'string', required: false, default: '', description: 'Label text' }
    ],
    dependencies: [],
    code: `
function Progress({ value = 50, label = '' }) {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  return (
    <div className="w-full">
      {label && <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: \`\${clampedValue}%\` }}
        />
      </div>
      <div className="text-xs text-gray-600 mt-1 text-right">{clampedValue}%</div>
    </div>
  )
}`
  },

  // Spinner/Loader
  {
    id: 'spinner',
    name: 'Spinner',
    description: 'Loading spinner',
    category: 'ui',
    props: [
      { name: 'size', type: 'string', required: false, default: 'md', description: 'Size: sm, md, lg' },
      { name: 'text', type: 'string', required: false, default: '', description: 'Loading text' }
    ],
    dependencies: [],
    code: `
function Spinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={\`border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin \${sizes[size]}\`}></div>
      {text && <div className="text-gray-600 text-sm">{text}</div>}
    </div>
  )
}`
  },

  // Alert
  {
    id: 'alert',
    name: 'Alert',
    description: 'Alert message component',
    category: 'ui',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Alert', description: 'Alert title' },
      { name: 'message', type: 'string', required: true, default: 'This is an alert message', description: 'Alert message' },
      { name: 'variant', type: 'string', required: false, default: 'info', description: 'Variant: info, success, warning, error' }
    ],
    dependencies: [],
    code: `
function Alert({ title = 'Alert', message = 'This is an alert message', variant = 'info' }) {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }

  return (
    <div className={\`border-l-4 p-4 rounded \${variants[variant]}\`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[variant]}</span>
        <div>
          <h4 className="font-bold mb-1">{title}</h4>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  )
}`
  },

  // Accordion
  {
    id: 'accordion',
    name: 'Accordion',
    description: 'Collapsible accordion',
    category: 'ui',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        { title: 'Section 1', content: 'Content 1' },
        { title: 'Section 2', content: 'Content 2' }
      ], description: 'Accordion items' }
    ],
    dependencies: [],
    code: `
function Accordion({ items = [{ title: 'Section 1', content: 'Content 1' }] }) {
  const [openIndex, setOpenIndex] = React.useState(null)

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left flex justify-between items-center font-semibold"
          >
            {item.title}
            <span className="text-gray-400">{openIndex === index ? '−' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="px-4 py-3 bg-white">
              <p className="text-gray-700">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}`
  },

  // Breadcrumb
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    description: 'Breadcrumb navigation',
    category: 'ui',
    props: [
      { name: 'items', type: 'array', required: true, default: ['Home', 'Products', 'Category'], description: 'Breadcrumb items' }
    ],
    dependencies: [],
    code: `
function Breadcrumb({ items = ['Home', 'Products', 'Category'] }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            <span className={\`\${index === items.length - 1 ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}\`}>
              {item}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}`
  },

  // Pagination
  {
    id: 'pagination',
    name: 'Pagination',
    description: 'Page navigation component',
    category: 'ui',
    props: [
      { name: 'currentPage', type: 'number', required: true, default: 1, description: 'Current page' },
      { name: 'totalPages', type: 'number', required: true, default: 10, description: 'Total pages' }
    ],
    dependencies: [],
    code: `
function Pagination({ currentPage = 1, totalPages = 10 }) {
  const [page, setPage] = React.useState(currentPage)

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      <div className="flex items-center gap-1">
        {[...Array(Math.min(totalPages, 7))].map((_, i) => {
          const pageNum = i + 1
          return (
            <button
              key={i}
              onClick={() => goToPage(pageNum)}
              className={\`px-3 py-1 border rounded \${page === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}\`}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>

      <span className="text-sm text-gray-600 ml-2">
        Page {page} of {totalPages}
      </span>
    </div>
  )
}`
  },

  // Checkbox
  {
    id: 'checkbox',
    name: 'Checkbox',
    description: 'Checkbox input',
    category: 'ui',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Accept terms', description: 'Checkbox label' },
      { name: 'checked', type: 'boolean', required: false, default: false, description: 'Initial checked state' }
    ],
    dependencies: [],
    code: `
function Checkbox({ label = 'Accept terms', checked = false }) {
  const [isChecked, setIsChecked] = React.useState(checked)

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  )
}`
  },

  // Radio Group
  {
    id: 'radio',
    name: 'Radio Group',
    description: 'Radio button group',
    category: 'ui',
    props: [
      { name: 'options', type: 'array', required: true, default: ['Option 1', 'Option 2', 'Option 3'], description: 'Radio options' },
      { name: 'name', type: 'string', required: true, default: 'radio-group', description: 'Group name' }
    ],
    dependencies: [],
    code: `
function Radio({ options = ['Option 1', 'Option 2', 'Option 3'], name = 'radio-group' }) {
  const [selected, setSelected] = React.useState(options[0])

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <label key={index} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option}
            checked={selected === option}
            onChange={(e) => setSelected(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  )
}`
  },

  // Switch/Toggle
  {
    id: 'switch',
    name: 'Switch',
    description: 'Toggle switch',
    category: 'ui',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Enable feature', description: 'Switch label' },
      { name: 'checked', type: 'boolean', required: false, default: false, description: 'Initial state' }
    ],
    dependencies: [],
    code: `
function Switch({ label = 'Enable feature', checked = false }) {
  const [isOn, setIsOn] = React.useState(checked)

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => setIsOn(!isOn)}
        className={\`relative w-14 h-7 rounded-full transition-colors \${isOn ? 'bg-blue-600' : 'bg-gray-300'}\`}
      >
        <div className={\`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform \${isOn ? 'transform translate-x-7' : ''}\`} />
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  )
}`
  },

  // Slider
  {
    id: 'slider',
    name: 'Slider',
    description: 'Range slider input',
    category: 'ui',
    props: [
      { name: 'min', type: 'number', required: false, default: 0, description: 'Minimum value' },
      { name: 'max', type: 'number', required: false, default: 100, description: 'Maximum value' },
      { name: 'initial', type: 'number', required: false, default: 50, description: 'Initial value' },
      { name: 'label', type: 'string', required: false, default: 'Value', description: 'Label' }
    ],
    dependencies: [],
    code: `
function Slider({ min = 0, max = 100, initial = 50, label = 'Value' }) {
  const [value, setValue] = React.useState(initial)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-blue-600">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}`
  },

  // Select Dropdown
  {
    id: 'select',
    name: 'Select',
    description: 'Select dropdown input',
    category: 'ui',
    props: [
      { name: 'label', type: 'string', required: false, default: 'Select option', description: 'Label' },
      { name: 'options', type: 'array', required: true, default: ['Option 1', 'Option 2', 'Option 3'], description: 'Options' }
    ],
    dependencies: [],
    code: `
function Select({ label = 'Select option', options = ['Option 1', 'Option 2', 'Option 3'] }) {
  const [selected, setSelected] = React.useState(options[0])

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold text-gray-700">{label}</label>}
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}`
  }
]

// Exportar todas las cápsulas (originales + extendidas + avanzadas + extra + interaction + advanced-ui + ai-ml + media + dataviz + forms + utilities)
export const ALL_CAPSULES = [
  ...CAPSULE_DEFINITIONS,
  ...UI_CAPSULES_EXTENDED,
  ...ADVANCED_CAPSULES,
  ...EXTRA_CAPSULES,
  ...INTERACTION_CAPSULES,
  ...ADVANCED_UI_CAPSULES,
  ...AI_ML_CAPSULES,
  ...MEDIA_CAPSULES,
  ...DATAVIZ_CAPSULES,
  ...FORMS_CAPSULES,
  ...UTILITIES_CAPSULES,
  ...LAYOUT_CAPSULES,
  ...ANIMATION_CAPSULES,
  ...SOCIAL_CAPSULES,
  ...ECOMMERCE_CAPSULES,
  ...FORM_CAPSULES,
  ...NAVIGATION_CAPSULES,
  ...DATA_CAPSULES,
  ...FEEDBACK_CAPSULES,
  ...CONTENT_CAPSULES,
  ...MODAL_CAPSULES,
  ...CARD_CAPSULES,
  ...INPUT_CAPSULES,
  ...CHART_CAPSULES,
  ...LIST_CAPSULES
]

export function getAllCapsulesExtended() {
  return ALL_CAPSULES
}

export function getCapsuleByIdExtended(id: string) {
  return ALL_CAPSULES.find(c => c.id === id)
}

export function getCapsulesByCategory(category: string) {
  return ALL_CAPSULES.filter(c => c.category === category)
}

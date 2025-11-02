import { CapsuleDefinition } from './types'

/**
 * Navigation Capsules
 * Navigation components for app structure
 */

export const NAVIGATION_CAPSULES: CapsuleDefinition[] = [
  // Breadcrumb
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    description: 'Breadcrumb navigation trail',
    category: 'navigation',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Details', href: '/products/1' }
      ], description: 'Breadcrumb items' }
    ],
    dependencies: [],
    code: `
function Breadcrumb({ items = [{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-gray-400">/</span>}
          <a
            href={item.href}
            className={\`\${idx === items.length - 1 ? 'text-gray-900 font-medium' : 'text-blue-600 hover:text-blue-700'}\`}
          >
            {item.label}
          </a>
        </React.Fragment>
      ))}
    </nav>
  )
}`
  },

  // Tabs
  {
    id: 'tabs',
    name: 'Tabs',
    description: 'Tabbed navigation component',
    category: 'navigation',
    props: [
      { name: 'tabs', type: 'array', required: true, default: ['Tab 1', 'Tab 2', 'Tab 3'], description: 'Tab labels' }
    ],
    dependencies: [],
    code: `
function Tabs({ tabs = ['Tab 1', 'Tab 2', 'Tab 3'] }) {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={\`py-4 px-1 border-b-2 font-medium text-sm \${
                activeTab === idx
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }\`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        <p className="text-gray-600">Content for {tabs[activeTab]}</p>
      </div>
    </div>
  )
}`
  },

  // Pagination
  {
    id: 'pagination',
    name: 'Pagination',
    description: 'Pagination controls',
    category: 'navigation',
    props: [
      { name: 'totalPages', type: 'number', required: true, default: 10, description: 'Total number of pages' },
      { name: 'currentPage', type: 'number', required: false, default: 1, description: 'Current page' }
    ],
    dependencies: [],
    code: `
function Pagination({ totalPages = 10, currentPage = 1 }) {
  const [page, setPage] = React.useState(currentPage)

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
        const pageNum = idx + 1
        return (
          <button
            key={idx}
            onClick={() => setPage(pageNum)}
            className={\`px-3 py-2 border rounded-lg \${
              page === pageNum
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }\`}
          >
            {pageNum}
          </button>
        )
      })}

      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}`
  },

  // Sidebar Menu
  {
    id: 'sidebar-menu',
    name: 'Sidebar Menu',
    description: 'Vertical sidebar navigation menu',
    category: 'navigation',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        { label: 'Dashboard', icon: '📊', href: '/dashboard' },
        { label: 'Users', icon: '👥', href: '/users' },
        { label: 'Settings', icon: '⚙️', href: '/settings' }
      ], description: 'Menu items' }
    ],
    dependencies: [],
    code: `
function SidebarMenu({ items = [] }) {
  const [activeItem, setActiveItem] = React.useState(0)

  return (
    <nav className="w-64 bg-gray-800 text-white p-4 space-y-2">
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          onClick={(e) => {
            e.preventDefault()
            setActiveItem(idx)
          }}
          className={\`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors \${
            activeItem === idx
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }\`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </a>
      ))}
    </nav>
  )
}`
  },

  // Dropdown Menu
  {
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    description: 'Dropdown menu with options',
    category: 'navigation',
    props: [
      { name: 'label', type: 'string', required: true, default: 'Menu', description: 'Menu button label' },
      { name: 'items', type: 'array', required: true, default: ['Option 1', 'Option 2', 'Option 3'], description: 'Menu items' }
    ],
    dependencies: [],
    code: `
function DropdownMenu({ label = 'Menu', items = ['Option 1', 'Option 2', 'Option 3'] }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
      >
        <span>{label}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}`
  },

  // Stepper
  {
    id: 'stepper',
    name: 'Stepper',
    description: 'Multi-step progress indicator',
    category: 'navigation',
    props: [
      { name: 'steps', type: 'array', required: true, default: ['Step 1', 'Step 2', 'Step 3'], description: 'Step labels' },
      { name: 'currentStep', type: 'number', required: false, default: 1, description: 'Current step (1-indexed)' }
    ],
    dependencies: [],
    code: `
function Stepper({ steps = ['Step 1', 'Step 2', 'Step 3'], currentStep = 1 }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => {
        const stepNum = idx + 1
        const isComplete = stepNum < currentStep
        const isCurrent = stepNum === currentStep

        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div
                className={\`w-10 h-10 rounded-full flex items-center justify-center font-semibold \${
                  isComplete
                    ? 'bg-green-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }\`}
              >
                {isComplete ? '✓' : stepNum}
              </div>
              <div className="mt-2 text-xs text-gray-600">{step}</div>
            </div>

            {idx < steps.length - 1 && (
              <div className={\`flex-1 h-1 mx-4 \${stepNum < currentStep ? 'bg-green-600' : 'bg-gray-200'}\`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}`
  }
]

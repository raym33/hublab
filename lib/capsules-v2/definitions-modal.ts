import { CapsuleDefinition } from './types'

/**
 * Modal & Overlay Capsules
 * Modal dialogs, overlays, and popups
 */

export const MODAL_CAPSULES: CapsuleDefinition[] = [
  // Basic Modal
  {
    id: 'basic-modal',
    name: 'Basic Modal',
    description: 'Centered modal dialog with backdrop',
    category: 'modal',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Modal Title', description: 'Modal title' },
      { name: 'content', type: 'string', required: true, default: 'Modal content goes here', description: 'Modal content' },
      { name: 'showClose', type: 'boolean', required: false, default: true, description: 'Show close button' }
    ],
    dependencies: [],
    code: `
function BasicModal({ title = 'Modal Title', content = 'Modal content goes here', showClose = true }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                {showClose && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-gray-600">{content}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}`
  },

  // Side Drawer
  {
    id: 'side-drawer',
    name: 'Side Drawer',
    description: 'Slide-in drawer from side',
    category: 'modal',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Drawer', description: 'Drawer title' },
      { name: 'position', type: 'string', required: false, default: 'right', description: 'Position: left, right' }
    ],
    dependencies: [],
    code: `
function SideDrawer({ title = 'Drawer', position = 'right' }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const positionClasses = {
    left: 'left-0',
    right: 'right-0'
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Open Drawer
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={\`fixed top-0 \${positionClasses[position]} h-full w-80 bg-white shadow-xl z-50 p-6\`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="text-gray-600">
              Drawer content goes here
            </div>
          </div>
        </>
      )}
    </>
  )
}`
  },

  // Bottom Sheet
  {
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    description: 'Slide-up bottom sheet (mobile-friendly)',
    category: 'modal',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Bottom Sheet', description: 'Sheet title' },
      { name: 'height', type: 'string', required: false, default: 'auto', description: 'Sheet height' }
    ],
    dependencies: [],
    code: `
function BottomSheet({ title = 'Bottom Sheet', height = 'auto' }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Open Sheet
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 p-6" style={{ height }}>
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="text-gray-600">
              Bottom sheet content goes here
            </div>
          </div>
        </>
      )}
    </>
  )
}`
  },

  // Popover
  {
    id: 'popover',
    name: 'Popover',
    description: 'Small overlay popover',
    category: 'modal',
    props: [
      { name: 'content', type: 'string', required: true, default: 'Popover content', description: 'Popover content' },
      { name: 'position', type: 'string', required: false, default: 'top', description: 'Position: top, bottom, left, right' }
    ],
    dependencies: [],
    code: `
function Popover({ content = 'Popover content', position = 'top' }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const positions = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Toggle Popover
      </button>

      {isOpen && (
        <div className={\`absolute \${positions[position]} bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-50\`}>
          <div className="text-sm text-gray-600">{content}</div>
        </div>
      )}
    </div>
  )
}`
  },

  // Lightbox
  {
    id: 'lightbox',
    name: 'Lightbox',
    description: 'Image lightbox viewer',
    category: 'modal',
    props: [
      { name: 'image', type: 'string', required: true, default: 'https://via.placeholder.com/800', description: 'Image URL' },
      { name: 'thumbnail', type: 'string', required: false, default: 'https://via.placeholder.com/200', description: 'Thumbnail URL' }
    ],
    dependencies: [],
    code: `
function Lightbox({ image = 'https://via.placeholder.com/800', thumbnail = 'https://via.placeholder.com/200' }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <img
        src={thumbnail}
        alt="Thumbnail"
        onClick={() => setIsOpen(true)}
        className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
      />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <img
            src={image}
            alt="Full size"
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}`
  },

  // Context Menu
  {
    id: 'context-menu',
    name: 'Context Menu',
    description: 'Right-click context menu',
    category: 'modal',
    props: [
      { name: 'options', type: 'array', required: true, default: ['Copy', 'Paste', 'Delete'], description: 'Menu options' }
    ],
    dependencies: [],
    code: `
function ContextMenu({ options = ['Copy', 'Paste', 'Delete'] }) {
  const [menuPosition, setMenuPosition] = React.useState(null)

  const handleContextMenu = (e) => {
    e.preventDefault()
    setMenuPosition({ x: e.clientX, y: e.clientY })
  }

  const handleClick = () => {
    setMenuPosition(null)
  }

  React.useEffect(() => {
    if (menuPosition) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [menuPosition])

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className="w-64 h-64 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-600"
      >
        Right-click me
      </div>

      {menuPosition && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          {options.map((option, idx) => (
            <button
              key={idx}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              onClick={() => console.log(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </>
  )
}`
  }
]

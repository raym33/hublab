/**
 * Cápsulas de Interacción V2
 * Componentes interactivos avanzados para mejorar la experiencia del usuario
 */

import { CapsuleDefinition } from './types'

export const INTERACTION_CAPSULES: CapsuleDefinition[] = [
  // Drag and Drop
  {
    id: 'drag-drop',
    name: 'Drag & Drop',
    description: 'Draggable items with drop zones',
    category: 'ui',
    props: [
      { name: 'items', type: 'array', required: true, default: ['Item 1', 'Item 2', 'Item 3'], description: 'Items to drag' }
    ],
    dependencies: [],
    code: `
function DragDrop({ items = ['Item 1', 'Item 2', 'Item 3'] }) {
  const [draggedItem, setDraggedItem] = React.useState(null)
  const [list1, setList1] = React.useState(items.slice(0, Math.ceil(items.length / 2)))
  const [list2, setList2] = React.useState(items.slice(Math.ceil(items.length / 2)))

  const handleDragStart = (item, sourceList) => {
    setDraggedItem({ item, sourceList })
  }

  const handleDrop = (targetList) => {
    if (!draggedItem) return

    if (draggedItem.sourceList === 'list1') {
      setList1(list1.filter(i => i !== draggedItem.item))
      if (targetList === 'list2') setList2([...list2, draggedItem.item])
      else setList1(list1)
    } else {
      setList2(list2.filter(i => i !== draggedItem.item))
      if (targetList === 'list1') setList1([...list1, draggedItem.item])
      else setList2(list2)
    }

    setDraggedItem(null)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop('list1')}
        className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 min-h-[200px]"
      >
        <h3 className="font-bold text-gray-900 mb-3">List 1</h3>
        {list1.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(item, 'list1')}
            className="bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
          >
            {item}
          </div>
        ))}
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop('list2')}
        className="bg-purple-50 border-2 border-dashed border-purple-300 rounded-lg p-4 min-h-[200px]"
      >
        <h3 className="font-bold text-gray-900 mb-3">List 2</h3>
        {list2.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(item, 'list2')}
            className="bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // Context Menu
  {
    id: 'context-menu',
    name: 'Context Menu',
    description: 'Right-click context menu',
    category: 'ui',
    props: [
      { name: 'options', type: 'array', required: true, default: ['Copy', 'Paste', 'Delete'], description: 'Menu options' }
    ],
    dependencies: [],
    code: `
function ContextMenu({ options = ['Copy', 'Paste', 'Delete'] }) {
  const [menuVisible, setMenuVisible] = React.useState(false)
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 })
  const [selected, setSelected] = React.useState(null)

  const handleContextMenu = (e) => {
    e.preventDefault()
    setMenuPosition({ x: e.clientX, y: e.clientY })
    setMenuVisible(true)
  }

  const handleClick = () => {
    setMenuVisible(false)
  }

  const handleOptionClick = (option) => {
    setSelected(option)
    setMenuVisible(false)
  }

  React.useEffect(() => {
    if (menuVisible) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [menuVisible])

  return (
    <div>
      <div
        onContextMenu={handleContextMenu}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
      >
        <p className="text-gray-700 font-medium">Right-click here to open menu</p>
        {selected && (
          <p className="mt-2 text-sm text-gray-600">Last action: <strong>{selected}</strong></p>
        )}
      </div>

      {menuVisible && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
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

  // Timeline
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Vertical timeline component',
    category: 'ui',
    props: [
      { name: 'events', type: 'array', required: true, default: [
        { date: '2024-01', title: 'Project Started', description: 'Initial setup' },
        { date: '2024-03', title: 'Alpha Release', description: 'First version' },
        { date: '2024-06', title: 'Beta Release', description: 'Testing phase' }
      ], description: 'Timeline events' }
    ],
    dependencies: [],
    code: `
function Timeline({ events = [
  { date: '2024-01', title: 'Project Started', description: 'Initial setup' },
  { date: '2024-03', title: 'Alpha Release', description: 'First version' },
  { date: '2024-06', title: 'Beta Release', description: 'Testing phase' }
] }) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-8">
        {events.map((event, idx) => (
          <div key={idx} className="relative flex items-start gap-4 pl-0">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold z-10">
              {idx + 1}
            </div>
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{event.date}</div>
              <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // Tree View
  {
    id: 'tree-view',
    name: 'Tree View',
    description: 'Expandable tree structure',
    category: 'ui',
    props: [
      { name: 'data', type: 'object', required: true, default: {
        name: 'Root',
        children: [
          { name: 'Folder 1', children: [{ name: 'File 1.1' }, { name: 'File 1.2' }] },
          { name: 'Folder 2', children: [{ name: 'File 2.1' }] }
        ]
      }, description: 'Tree data structure' }
    ],
    dependencies: [],
    code: `
function TreeView({ data = {
  name: 'Root',
  children: [
    { name: 'Folder 1', children: [{ name: 'File 1.1' }, { name: 'File 1.2' }] },
    { name: 'Folder 2', children: [{ name: 'File 2.1' }] }
  ]
} }) {
  const TreeNode = ({ node, level = 0 }) => {
    const [expanded, setExpanded] = React.useState(true)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div style={{ marginLeft: level * 20 }}>
        <div
          onClick={() => hasChildren && setExpanded(!expanded)}
          className={\`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer \${hasChildren ? 'font-medium' : ''}\`}
        >
          {hasChildren && (
            <span className="text-gray-400">{expanded ? '▼' : '▶'}</span>
          )}
          {hasChildren ? '📁' : '📄'}
          <span className="text-gray-900">{node.name}</span>
        </div>

        {hasChildren && expanded && (
          <div>
            {node.children.map((child, idx) => (
              <TreeNode key={idx} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <TreeNode node={data} />
    </div>
  )
}`
  },

  // Carousel
  {
    id: 'carousel',
    name: 'Carousel',
    description: 'Image/content carousel slider',
    category: 'ui',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        'Slide 1 Content',
        'Slide 2 Content',
        'Slide 3 Content'
      ], description: 'Carousel items' },
      { name: 'autoplay', type: 'boolean', required: false, default: false, description: 'Auto advance slides' }
    ],
    dependencies: [],
    code: `
function Carousel({ items = ['Slide 1 Content', 'Slide 2 Content', 'Slide 3 Content'], autoplay = false }) {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (autoplay) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % items.length)
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [autoplay, items.length])

  const next = () => setCurrent((current + 1) % items.length)
  const prev = () => setCurrent((current - 1 + items.length) % items.length)

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="aspect-video bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{items[current]}</div>
          <div className="text-gray-600">Slide {current + 1} of {items.length}</div>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 font-bold"
      >
        ←
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 font-bold"
      >
        →
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={\`w-2 h-2 rounded-full transition-all \${current === idx ? 'bg-white w-8' : 'bg-white/50'}\`}
          />
        ))}
      </div>
    </div>
  )
}`
  },

  // Rating
  {
    id: 'rating',
    name: 'Rating',
    description: 'Star rating component',
    category: 'ui',
    props: [
      { name: 'max', type: 'number', required: false, default: 5, description: 'Maximum rating' },
      { name: 'initial', type: 'number', required: false, default: 0, description: 'Initial rating' }
    ],
    dependencies: [],
    code: `
function Rating({ max = 5, initial = 0 }) {
  const [rating, setRating] = React.useState(initial)
  const [hover, setHover] = React.useState(0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
      <div className="flex justify-center gap-2 mb-4">
        {[...Array(max)].map((_, idx) => {
          const starValue = idx + 1
          return (
            <button
              key={idx}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              className="text-4xl transition-all hover:scale-110"
            >
              {starValue <= (hover || rating) ? '⭐' : '☆'}
            </button>
          )
        })}
      </div>
      <div className="text-gray-600">
        {rating > 0 ? \`You rated \${rating}/\${max} stars\` : 'Click to rate'}
      </div>
    </div>
  )
}`
  },

  // Color Picker
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Color selection component',
    category: 'ui',
    props: [
      { name: 'colors', type: 'array', required: true, default: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'], description: 'Available colors' }
    ],
    dependencies: [],
    code: `
function ColorPicker({ colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'] }) {
  const [selected, setSelected] = React.useState(colors[0])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div
        className="w-full h-32 rounded-lg mb-4 border-2 border-gray-200 transition-colors"
        style={{ backgroundColor: selected }}
      ></div>

      <div className="grid grid-cols-6 gap-2 mb-4">
        {colors.map((color, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(color)}
            className={\`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 \${
              selected === color ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900' : 'border-gray-200'
            }\`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="text-center">
        <code className="text-sm bg-gray-100 px-3 py-1 rounded text-gray-900">{selected}</code>
      </div>
    </div>
  )
}`
  },

  // Code Editor
  {
    id: 'code-editor',
    name: 'Code Editor',
    description: 'Simple code editor with syntax highlighting',
    category: 'ui',
    props: [
      { name: 'language', type: 'string', required: false, default: 'javascript', description: 'Programming language' },
      { name: 'initialCode', type: 'string', required: false, default: 'function hello() {\n  console.log("Hello!");\n}', description: 'Initial code' }
    ],
    dependencies: [],
    code: `
function CodeEditor({ language = 'javascript', initialCode = 'function hello() {\\n  console.log("Hello!");\\n}' }) {
  const [code, setCode] = React.useState(initialCode)
  const [lineCount, setLineCount] = React.useState(initialCode.split('\\n').length)

  React.useEffect(() => {
    setLineCount(code.split('\\n').length)
  }, [code])

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-400">{language}</div>
      </div>

      <div className="flex">
        <div className="bg-gray-800 text-gray-500 text-right px-4 py-4 text-sm font-mono select-none">
          {[...Array(lineCount)].map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-gray-900 text-gray-100 p-4 text-sm font-mono resize-none focus:outline-none"
          rows={10}
          spellCheck={false}
        />
      </div>

      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
        <div>Lines: {lineCount}</div>
        <div>Characters: {code.length}</div>
      </div>
    </div>
  )
}`
  },

  // Search with Highlight
  {
    id: 'search-highlight',
    name: 'Search with Highlight',
    description: 'Search box with text highlighting',
    category: 'ui',
    props: [
      { name: 'items', type: 'array', required: true, default: [
        'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'
      ], description: 'Items to search' }
    ],
    dependencies: [],
    code: `
function SearchHighlight({ items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'] }) {
  const [search, setSearch] = React.useState('')

  const filtered = items.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  )

  const highlightText = (text) => {
    if (!search) return text

    const parts = text.split(new RegExp(\`(\${search})\`, 'gi'))
    return parts.map((part, idx) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={idx} className="bg-yellow-300 text-gray-900 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search items..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              {highlightText(item)}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No results found for "{search}"
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        {filtered.length} of {items.length} items
      </div>
    </div>
  )
}`
  },

  // Kanban Board
  {
    id: 'kanban',
    name: 'Kanban Board',
    description: 'Simple kanban board with columns',
    category: 'feature',
    props: [
      { name: 'columns', type: 'array', required: true, default: [
        { title: 'To Do', items: ['Task 1', 'Task 2'] },
        { title: 'In Progress', items: ['Task 3'] },
        { title: 'Done', items: ['Task 4'] }
      ], description: 'Kanban columns' }
    ],
    dependencies: [],
    code: `
function Kanban({ columns = [
  { title: 'To Do', items: ['Task 1', 'Task 2'] },
  { title: 'In Progress', items: ['Task 3'] },
  { title: 'Done', items: ['Task 4'] }
] }) {
  const [cols, setCols] = React.useState(columns)

  return (
    <div className="grid grid-cols-3 gap-4">
      {cols.map((col, colIdx) => (
        <div key={colIdx} className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
            {col.title}
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              {col.items.length}
            </span>
          </h3>

          <div className="space-y-2">
            {col.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-move"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}`
  }
]

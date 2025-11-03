/**
 * MODERN UI CAPSULES
 *
 * Advanced UI components for modern web applications:
 * - Animated components with Framer Motion
 * - Interactive data visualizations
 * - Advanced form components
 * - Modern layout patterns
 * - Micro-interactions
 */

export interface ModernUICapsule {
  id: string
  name: string
  category: string
  icon: string
  description: string
  props?: Array<{
    name: string
    type: string
    required?: boolean
    description?: string
    default?: any
  }>
  code?: string
}

export const MODERN_UI_CAPSULES: ModernUICapsule[] = [
  // ANIMATED CARDS
  {
    id: 'animated-card',
    name: 'Animated Card',
    category: 'ui',
    icon: '🎴',
    description: 'Card component with hover animations and 3D transforms',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Card title' },
      { name: 'description', type: 'string', required: true, description: 'Card description' },
      { name: 'image', type: 'string', required: false, description: 'Card image URL' },
      { name: 'animationType', type: 'string', required: false, description: 'Animation type', default: 'scale' }
    ],
    code: `
'use client'
import { motion } from 'framer-motion'

export default function AnimatedCard({ title, description, image, animationType = 'scale' }) {
  const animations = {
    scale: { scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    tilt: { rotateY: 5, scale: 1.02 },
    lift: { y: -10, boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.15)' }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
      whileHover={animations[animationType]}
      transition={{ duration: 0.3 }}
    >
      {image && (
        <div className="h-48 overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}`
  },

  // GRADIENT BACKGROUND
  {
    id: 'gradient-background',
    name: 'Gradient Background',
    category: 'layout',
    icon: '🌈',
    description: 'Animated gradient background with customizable colors',
    props: [
      { name: 'colors', type: 'array', required: true, description: 'Array of hex colors', default: ['#667eea', '#764ba2', '#f093fb'] },
      { name: 'animate', type: 'boolean', required: false, description: 'Enable animation', default: true },
      { name: 'blur', type: 'boolean', required: false, description: 'Add blur effect', default: true }
    ],
    code: `
'use client'
import { motion } from 'framer-motion'

export default function GradientBackground({ colors, animate = true, blur = true, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        className={\`absolute inset-0 \${blur ? 'blur-3xl' : ''}\`}
        animate={animate ? {
          background: [
            \`linear-gradient(45deg, \${colors[0]}, \${colors[1]})\`,
            \`linear-gradient(135deg, \${colors[1]}, \${colors[2]})\`,
            \`linear-gradient(225deg, \${colors[2]}, \${colors[0]})\`,
          ]
        } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{
          background: \`linear-gradient(45deg, \${colors[0]}, \${colors[1]})\`
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}`
  },

  // COMMAND PALETTE
  {
    id: 'command-palette',
    name: 'Command Palette',
    category: 'interaction',
    icon: '⌘',
    description: 'Keyboard-accessible command palette for quick actions',
    props: [
      { name: 'commands', type: 'array', required: true, description: 'Array of command objects' },
      { name: 'placeholder', type: 'string', required: false, description: 'Search placeholder', default: 'Type a command...' }
    ],
    code: `
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommandPalette({ commands, placeholder = 'Type a command...' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-32 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full px-6 py-4 text-lg border-b border-gray-200 focus:outline-none"
              autoFocus
            />
            <div className="max-h-96 overflow-y-auto">
              {filtered.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    cmd.action()
                    setIsOpen(false)
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <span className="text-2xl">{cmd.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{cmd.label}</div>
                    <div className="text-sm text-gray-500">{cmd.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}`
  },

  // TOAST NOTIFICATIONS
  {
    id: 'toast-system',
    name: 'Toast System',
    category: 'feedback',
    icon: '🔔',
    description: 'Modern toast notification system with animations',
    props: [
      { name: 'position', type: 'string', required: false, description: 'Toast position', default: 'top-right' },
      { name: 'duration', type: 'number', required: false, description: 'Auto-dismiss duration (ms)', default: 3000 }
    ],
    code: `
'use client'
import { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext()

export function ToastProvider({ children, position = 'top-right', duration = 3000 }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), duration)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={\`fixed \${positions[position]} z-50 space-y-2\`}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
              className={\`\${colors[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3\`}
            >
              <span className="text-2xl">{icons[toast.type]}</span>
              <span className="font-medium">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 hover:opacity-75"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
`
  },

  // SKELETON LOADER
  {
    id: 'skeleton-loader',
    name: 'Skeleton Loader',
    category: 'feedback',
    icon: '💀',
    description: 'Animated skeleton loader for content placeholders',
    props: [
      { name: 'variant', type: 'string', required: false, description: 'Loader variant', default: 'card' },
      { name: 'count', type: 'number', required: false, description: 'Number of skeletons', default: 1 }
    ],
    code: `
'use client'

export default function SkeletonLoader({ variant = 'card', count = 1 }) {
  const variants = {
    card: (
      <div className="bg-white rounded-xl shadow p-6 space-y-4 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    ),
    list: (
      <div className="bg-white rounded-xl shadow p-4 space-y-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    ),
    text: (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{variants[variant]}</div>
      ))}
    </div>
  )
}`
  },

  // PROGRESS STEPPER
  {
    id: 'progress-stepper',
    name: 'Progress Stepper',
    category: 'navigation',
    icon: '📊',
    description: 'Multi-step progress indicator with animations',
    props: [
      { name: 'steps', type: 'array', required: true, description: 'Array of step objects' },
      { name: 'currentStep', type: 'number', required: true, description: 'Current active step index' }
    ],
    code: `
'use client'
import { motion } from 'framer-motion'

export default function ProgressStepper({ steps, currentStep }) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                className={\`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors \${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }\`}
                animate={{ scale: index === currentStep ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                {index < currentStep ? '✓' : index + 1}
              </motion.div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">{step.label}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 relative">
                <div className="absolute inset-0 bg-gray-200 rounded"></div>
                <motion.div
                  className="absolute inset-0 bg-blue-600 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: index < currentStep ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  // INFINITE SCROLL
  {
    id: 'infinite-scroll',
    name: 'Infinite Scroll',
    category: 'interaction',
    icon: '♾️',
    description: 'Infinite scroll component with intersection observer',
    props: [
      { name: 'loadMore', type: 'function', required: true, description: 'Function to load more items' },
      { name: 'hasMore', type: 'boolean', required: true, description: 'Whether more items exist' },
      { name: 'loader', type: 'node', required: false, description: 'Loading component' }
    ],
    code: `
'use client'
import { useEffect, useRef } from 'react'

export default function InfiniteScroll({ children, loadMore, hasMore, loader }) {
  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loadMore])

  return (
    <div>
      {children}
      <div ref={observerTarget} className="py-4 flex justify-center">
        {hasMore && (loader || (
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        ))}
      </div>
    </div>
  )
}`
  },

  // TABS COMPONENT
  {
    id: 'animated-tabs',
    name: 'Animated Tabs',
    category: 'navigation',
    icon: '📑',
    description: 'Animated tabs with smooth transitions',
    props: [
      { name: 'tabs', type: 'array', required: true, description: 'Array of tab objects with label and content' },
      { name: 'defaultTab', type: 'number', required: false, description: 'Default active tab index', default: 0 }
    ],
    code: `
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AnimatedTabs({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={\`px-6 py-3 font-medium relative transition-colors \${
              activeTab === index
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }\`}
          >
            {tab.label}
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs[activeTab].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}`
  }
]

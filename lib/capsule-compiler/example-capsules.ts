/**
 * Example Capsules Library
 * Demo capsules showing the universal capsule format
 */

import type { UniversalCapsule } from './types'

export const EXAMPLE_CAPSULES: UniversalCapsule[] = [
  // ===== UI COMPONENTS =====

  {
    id: 'button-primary',
    name: 'Primary Button',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['button', 'primary', 'cta', 'interactive'],
    aiDescription: 'A primary call-to-action button with customizable label and click handler',
    platforms: {
      web: {
        engine: 'react',
        code: `export const ButtonPrimary = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  )
}`
      },
      ios: {
        engine: 'react-native',
        code: `import { TouchableOpacity, Text, StyleSheet } from 'react-native'

export const ButtonPrimary = ({ label, onClick, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
})`
      },
      android: {
        engine: 'react-native',
        code: `// Same as iOS`
      },
      'ai-os': {
        engine: 'intent',
        code: JSON.stringify({
          intent: 'render-interactive-element',
          semantics: {
            element: 'button',
            priority: 'primary',
            action: 'execute-callback'
          }
        })
      }
    },
    inputs: [
      {
        name: 'label',
        type: 'string',
        required: true,
        aiDescription: 'The text displayed on the button'
      },
      {
        name: 'onClick',
        type: 'function',
        required: true,
        aiDescription: 'Function called when button is clicked'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        aiDescription: 'Whether the button is disabled'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered button component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add a submit button',
        'Create a primary CTA button',
        'Add a save button'
      ],
      relatedCapsules: ['button-secondary', 'button-outline', 'icon-button'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1500000
  },

  {
    id: 'input-text',
    name: 'Text Input',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['input', 'text', 'form', 'field'],
    aiDescription: 'A text input field with validation and change handling',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const InputText = ({ placeholder, value, onChange, type = 'text' }) => {
  const [internalValue, setInternalValue] = useState(value || '')

  const handleChange = (e) => {
    setInternalValue(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <input
      type={type}
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  )
}`
      },
      ios: {
        engine: 'react-native',
        code: `import { TextInput, StyleSheet } from 'react-native'
import { useState } from 'react'

export const InputText = ({ placeholder, value, onChange, type }) => {
  const [internalValue, setInternalValue] = useState(value || '')

  const handleChange = (text) => {
    setInternalValue(text)
    onChange?.(text)
  }

  return (
    <TextInput
      value={internalValue}
      onChangeText={handleChange}
      placeholder={placeholder}
      secureTextEntry={type === 'password'}
      style={styles.input}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 16
  }
})`
      },
      'ai-os': {
        engine: 'intent',
        code: JSON.stringify({
          intent: 'collect-text-input',
          semantics: {
            input: 'text',
            validation: 'optional'
          }
        })
      }
    },
    inputs: [
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        aiDescription: 'Placeholder text shown when empty'
      },
      {
        name: 'value',
        type: 'string',
        required: false,
        aiDescription: 'Current value of the input'
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        aiDescription: 'Function called when value changes'
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        default: 'text',
        aiDescription: 'Input type (text, password, email, etc.)'
      }
    ],
    outputs: [
      {
        name: 'value',
        type: 'string',
        aiDescription: 'Current input value'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add a text input field',
        'Create an email input',
        'Add a password field'
      ],
      relatedCapsules: ['input-email', 'input-password', 'textarea'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2000000
  },

  {
    id: 'list-view',
    name: 'List View',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['list', 'view', 'collection', 'items'],
    aiDescription: 'Renders a list of items with customizable item component',
    platforms: {
      web: {
        engine: 'react',
        code: `export const ListView = ({ items, renderItem, keyExtractor }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}`
      },
      ios: {
        engine: 'react-native',
        code: `import { FlatList } from 'react-native'

export const ListView = ({ items, renderItem, keyExtractor }) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={keyExtractor}
    />
  )
}`
      },
      'ai-os': {
        engine: 'intent',
        code: JSON.stringify({
          intent: 'display-collection',
          semantics: {
            collection: 'list',
            itemRenderer: 'custom'
          }
        })
      }
    },
    inputs: [
      {
        name: 'items',
        type: 'array',
        required: true,
        aiDescription: 'Array of items to display'
      },
      {
        name: 'renderItem',
        type: 'function',
        required: true,
        aiDescription: 'Function to render each item'
      },
      {
        name: 'keyExtractor',
        type: 'function',
        required: false,
        aiDescription: 'Function to extract unique key from item'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered list'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Display a list of todos',
        'Show search results',
        'Render product list'
      ],
      relatedCapsules: ['grid-view', 'table-view', 'list-item'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1200000
  },

  // ===== DATA CAPSULES =====

  {
    id: 'database-local',
    name: 'Local Database',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'data',
    type: 'data',
    tags: ['database', 'local', 'storage', 'crud'],
    aiDescription: 'Local database with CRUD operations using IndexedDB/AsyncStorage',
    platforms: {
      web: {
        engine: 'vanilla',
        code: `class LocalDatabase {
  constructor(dbName) {
    this.dbName = dbName
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      request.onupgradeneeded = (e) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'id', autoIncrement: true })
        }
      }
    })
  }

  async insert(data) {
    const tx = this.db.transaction(['items'], 'readwrite')
    const store = tx.objectStore('items')
    return new Promise((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAll() {
    const tx = this.db.transaction(['items'], 'readonly')
    const store = tx.objectStore('items')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async update(id, data) {
    const tx = this.db.transaction(['items'], 'readwrite')
    const store = tx.objectStore('items')
    return new Promise((resolve, reject) => {
      const request = store.put({ ...data, id })
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(id) {
    const tx = this.db.transaction(['items'], 'readwrite')
    const store = tx.objectStore('items')
    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export default LocalDatabase`
      },
      ios: {
        engine: 'react-native',
        code: `import AsyncStorage from '@react-native-async-storage/async-storage'

class LocalDatabase {
  constructor(dbName) {
    this.dbName = dbName
    this.prefix = \`@\${dbName}:\`
  }

  async insert(data) {
    const id = Date.now().toString()
    const key = this.prefix + id
    await AsyncStorage.setItem(key, JSON.stringify({ ...data, id }))
    return id
  }

  async getAll() {
    const keys = await AsyncStorage.getAllKeys()
    const itemKeys = keys.filter(k => k.startsWith(this.prefix))
    const items = await AsyncStorage.multiGet(itemKeys)
    return items.map(([_, value]) => JSON.parse(value))
  }

  async update(id, data) {
    const key = this.prefix + id
    await AsyncStorage.setItem(key, JSON.stringify({ ...data, id }))
  }

  async delete(id) {
    const key = this.prefix + id
    await AsyncStorage.removeItem(key)
  }
}

export default LocalDatabase`
      },
      'ai-os': {
        engine: 'intent',
        code: JSON.stringify({
          intent: 'manage-local-data',
          semantics: {
            storage: 'local',
            operations: ['create', 'read', 'update', 'delete']
          }
        })
      }
    },
    inputs: [
      {
        name: 'dbName',
        type: 'string',
        required: true,
        aiDescription: 'Name of the database'
      }
    ],
    outputs: [
      {
        name: 'insert',
        type: 'function',
        aiDescription: 'Insert new item'
      },
      {
        name: 'getAll',
        type: 'function',
        aiDescription: 'Get all items'
      },
      {
        name: 'update',
        type: 'function',
        aiDescription: 'Update item by ID'
      },
      {
        name: 'delete',
        type: 'function',
        aiDescription: 'Delete item by ID'
      }
    ],
    dependencies: {
      npm: {
        '@react-native-async-storage/async-storage': '^1.19.0'
      }
    },
    aiMetadata: {
      usageExamples: [
        'Store todos locally',
        'Cache data offline',
        'Save user preferences'
      ],
      relatedCapsules: ['database-sqlite', 'storage-key-value', 'cache'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 800000
  },

  // ===== WORKFLOW CAPSULES =====

  {
    id: 'http-fetch',
    name: 'HTTP Fetch',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'workflow',
    type: 'workflow',
    tags: ['http', 'api', 'fetch', 'request'],
    aiDescription: 'Make HTTP requests with automatic error handling and retries',
    platforms: {
      web: {
        engine: 'vanilla',
        code: `export async function httpFetch({ url, method = 'GET', body, headers = {} }) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}`
      },
      ios: {
        engine: 'react-native',
        code: `// Same implementation works on React Native`
      },
      'ai-os': {
        engine: 'intent',
        code: JSON.stringify({
          intent: 'fetch-external-data',
          semantics: {
            method: 'http',
            errorHandling: 'automatic'
          }
        })
      }
    },
    inputs: [
      {
        name: 'url',
        type: 'string',
        required: true,
        aiDescription: 'URL to fetch'
      },
      {
        name: 'method',
        type: 'string',
        required: false,
        default: 'GET',
        aiDescription: 'HTTP method (GET, POST, PUT, DELETE)'
      },
      {
        name: 'body',
        type: 'object',
        required: false,
        aiDescription: 'Request body for POST/PUT'
      },
      {
        name: 'headers',
        type: 'object',
        required: false,
        aiDescription: 'Custom headers'
      }
    ],
    outputs: [
      {
        name: 'response',
        type: 'object',
        aiDescription: 'Response with success flag and data/error'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Fetch data from API',
        'Submit form to server',
        'Call REST endpoint'
      ],
      relatedCapsules: ['graphql-query', 'websocket-connect', 'api-client'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3000000
  },

  // ===== CONTAINER CAPSULES =====

  {
    id: 'app-container',
    name: 'App Container',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'layout',
    type: 'ui-component',
    tags: ['container', 'app', 'root', 'layout'],
    aiDescription: 'Root container component for the entire app',
    platforms: {
      web: {
        engine: 'react',
        code: `export const AppContainer = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}`
      },
      ios: {
        engine: 'react-native',
        code: `import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native'

export const AppContainer = ({ children, title }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView style={styles.main}>
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  },
  main: {
    flex: 1,
    padding: 16
  }
})`
      },
      'ai-os': {
        engine: 'intent',
        code: JSON.stringify({
          intent: 'app-root',
          semantics: {
            layout: 'full-screen',
            navigation: 'included'
          }
        })
      }
    },
    inputs: [
      {
        name: 'title',
        type: 'string',
        required: true,
        aiDescription: 'App title shown in header'
      },
      {
        name: 'children',
        type: 'component',
        required: true,
        aiDescription: 'Child components to render'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered app container'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Root container for app',
        'Main app wrapper',
        'App layout with header'
      ],
      relatedCapsules: ['page-container', 'section-container', 'card-container'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 5000000
  },

  // ===== NEW CAPSULES =====

  {
    id: 'card',
    name: 'Card Container',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['card', 'container', 'box', 'panel'],
    aiDescription: 'A card container with shadow and rounded corners for grouping content',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Card = ({ children, title }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'children',
        type: 'component',
        required: true,
        aiDescription: 'Content to display inside the card'
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        aiDescription: 'Optional title shown at the top of the card'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered card'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Wrap content in a card',
        'Create a settings panel',
        'Display information in a box'
      ],
      relatedCapsules: ['app-container', 'modal', 'panel'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3500000
  },

  {
    id: 'checkbox',
    name: 'Checkbox',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['checkbox', 'input', 'toggle', 'boolean'],
    aiDescription: 'A checkbox input for boolean selections',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Checkbox = ({ label, checked, onChange }: any) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
      {label && <span className="text-gray-700">{label}</span>}
    </label>
  )
}`
      }
    },
    inputs: [
      {
        name: 'label',
        type: 'string',
        required: false,
        aiDescription: 'Label text next to checkbox'
      },
      {
        name: 'checked',
        type: 'boolean',
        required: false,
        default: false,
        aiDescription: 'Whether checkbox is checked'
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        aiDescription: 'Function called when checkbox state changes'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered checkbox'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add a checkbox to a form',
        'Create a todo item with completion checkbox',
        'Add agree to terms checkbox'
      ],
      relatedCapsules: ['input-text', 'button-primary', 'radio-button'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2800000
  },

  {
    id: 'text-display',
    name: 'Text Display',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['text', 'paragraph', 'heading', 'display'],
    aiDescription: 'Displays text with different styles (heading, paragraph, label)',
    platforms: {
      web: {
        engine: 'react',
        code: `export const TextDisplay = ({ text, variant = 'paragraph', className = '' }: any) => {
  const variants = {
    heading: 'text-2xl font-bold text-gray-900',
    subheading: 'text-xl font-semibold text-gray-800',
    paragraph: 'text-base text-gray-700',
    label: 'text-sm font-medium text-gray-600',
    caption: 'text-xs text-gray-500'
  }

  return (
    <div className={\`\${variants[variant]} \${className}\`}>
      {text}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'text',
        type: 'string',
        required: true,
        aiDescription: 'Text content to display'
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'paragraph',
        aiDescription: 'Text style variant (heading, subheading, paragraph, label, caption)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered text'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Display a heading',
        'Show descriptive text',
        'Add a label to a form'
      ],
      relatedCapsules: ['input-text', 'card'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 4200000
  },

  {
    id: 'loading-spinner',
    name: 'Loading Spinner',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['loading', 'spinner', 'loader', 'progress'],
    aiDescription: 'Animated loading spinner to indicate loading states',
    platforms: {
      web: {
        engine: 'react',
        code: `export const LoadingSpinner = ({ size = 'medium', message }: any) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={\`\${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin\`} />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'medium',
        aiDescription: 'Size of spinner (small, medium, large)'
      },
      {
        name: 'message',
        type: 'string',
        required: false,
        aiDescription: 'Optional loading message'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered spinner'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show loading state',
        'Display while fetching data',
        'Indicate processing'
      ],
      relatedCapsules: ['button-primary', 'http-fetch'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3100000
  },

  {
    id: 'modal',
    name: 'Modal Dialog',
    version: '1.0.0',
    author: 'hublab@hublab.dev',
    registry: 'hublab.dev/capsules',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['modal', 'dialog', 'popup', 'overlay'],
    aiDescription: 'Modal dialog overlay for displaying content above the main page',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'isOpen',
        type: 'boolean',
        required: true,
        aiDescription: 'Whether modal is open'
      },
      {
        name: 'onClose',
        type: 'function',
        required: true,
        aiDescription: 'Function called when modal should close'
      },
      {
        name: 'title',
        type: 'string',
        required: true,
        aiDescription: 'Modal title'
      },
      {
        name: 'children',
        type: 'component',
        required: true,
        aiDescription: 'Modal content'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered modal'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show confirmation dialog',
        'Display form in popup',
        'Create settings modal'
      ],
      relatedCapsules: ['card', 'button-primary'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2500000
  }
]

/**
 * Get capsule by ID
 */
export function getCapsule(id: string): UniversalCapsule | undefined {
  return EXAMPLE_CAPSULES.find(c => c.id === id)
}

/**
 * Search capsules
 */
export function searchCapsules(query: string): UniversalCapsule[] {
  const lowerQuery = query.toLowerCase()
  return EXAMPLE_CAPSULES.filter(
    c =>
      c.id.toLowerCase().includes(lowerQuery) ||
      c.name.toLowerCase().includes(lowerQuery) ||
      c.aiDescription.toLowerCase().includes(lowerQuery) ||
      c.tags.some(t => t.toLowerCase().includes(lowerQuery))
  )
}

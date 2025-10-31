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
  },

  // Form with Validation
  {
    id: 'form-validated',
    name: 'Form with Validation',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['form', 'validation', 'input', 'submit'],
    aiDescription: 'A complete form component with built-in validation, error messages, and submit handling',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const FormValidated = ({
  fields,
  onSubmit,
  submitLabel = 'Submit'
}: any) => {
  const [values, setValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (field: any, value: any) => {
    if (field.required && !value) {
      return \`\${field.label} is required\`
    }
    if (field.pattern && !new RegExp(field.pattern).test(value)) {
      return field.patternMessage || \`\${field.label} is invalid\`
    }
    if (field.minLength && value.length < field.minLength) {
      return \`\${field.label} must be at least \${field.minLength} characters\`
    }
    if (field.maxLength && value.length > field.maxLength) {
      return \`\${field.label} must be at most \${field.maxLength} characters\`
    }
    return ''
  }

  const handleChange = (name: string, value: any, field: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: string, field: any) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(field, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: Record<string, string> = {}
    let hasErrors = false

    fields.forEach((field: any) => {
      const error = validateField(field, values[field.name])
      if (error) {
        newErrors[field.name] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setTouched(
      fields.reduce((acc: any, f: any) => ({ ...acc, [f.name]: true }), {})
    )

    if (!hasErrors && onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field: any) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value, field)}
              onBlur={() => handleBlur(field.name, field)}
              placeholder={field.placeholder}
              className={\`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent \${
                errors[field.name] && touched[field.name]
                  ? 'border-red-500'
                  : 'border-gray-300'
              }\`}
              rows={field.rows || 4}
            />
          ) : (
            <input
              type={field.type || 'text'}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value, field)}
              onBlur={() => handleBlur(field.name, field)}
              placeholder={field.placeholder}
              className={\`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent \${
                errors[field.name] && touched[field.name]
                  ? 'border-red-500'
                  : 'border-gray-300'
              }\`}
            />
          )}

          {errors[field.name] && touched[field.name] && (
            <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
          )}

          {field.helperText && !errors[field.name] && (
            <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {submitLabel}
      </button>
    </form>
  )
}`
      }
    },
    inputs: [
      {
        name: 'fields',
        type: 'array',
        required: true,
        aiDescription: 'Array of field objects with name, label, type, validation rules'
      },
      {
        name: 'onSubmit',
        type: 'function',
        required: true,
        aiDescription: 'Function called with form values on valid submit'
      },
      {
        name: 'submitLabel',
        type: 'string',
        required: false,
        aiDescription: 'Label for submit button'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Form element with validation'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Create contact form with validation',
        'Build signup form with email validation',
        'Add feedback form with required fields'
      ],
      relatedCapsules: ['input-text', 'button-primary'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1800000
  },

  // Tabs Component
  {
    id: 'tabs',
    name: 'Tabs Navigation',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['tabs', 'navigation', 'accordion', 'panels'],
    aiDescription: 'Tabbed navigation component for organizing content into separate panels',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const Tabs = ({ tabs, defaultTab = 0 }: any) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8" aria-label="Tabs">
          {tabs.map((tab: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={\`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                \${activeTab === index
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              \`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {tabs.map((tab: any, index: number) => (
          <div
            key={index}
            className={activeTab === index ? 'block' : 'hidden'}
            role="tabpanel"
          >
            {typeof tab.content === 'function' ? tab.content() : tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'tabs',
        type: 'array',
        required: true,
        aiDescription: 'Array of tab objects with label and content'
      },
      {
        name: 'defaultTab',
        type: 'number',
        required: false,
        aiDescription: 'Index of initially active tab'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Tabs navigation component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Create settings page with tabs',
        'Build dashboard with multiple views',
        'Organize product information in tabs'
      ],
      relatedCapsules: ['card', 'accordion'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2200000
  },

  // Dropdown/Select Component
  {
    id: 'dropdown-select',
    name: 'Dropdown Select',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['dropdown', 'select', 'input', 'menu'],
    aiDescription: 'Dropdown select component with search and custom options',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const DropdownSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  multiple = false
}: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedValues, setSelectedValues] = useState<any[]>(
    multiple ? (Array.isArray(value) ? value : []) : []
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = searchable
    ? options.filter((opt: any) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  const handleSelect = (option: any) => {
    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value]
      setSelectedValues(newValues)
      onChange?.(newValues)
    } else {
      onChange?.(option.value)
      setIsOpen(false)
    }
  }

  const getDisplayValue = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder
      return \`\${selectedValues.length} selected\`
    }
    const selected = options.find((opt: any) => opt.value === value)
    return selected?.label || placeholder
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
      >
        <span className="block truncate">{getDisplayValue()}</span>
        <svg
          className={\`w-5 h-5 transition-transform \${isOpen ? 'transform rotate-180' : ''}\`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No options found</div>
            ) : (
              filteredOptions.map((option: any, index: number) => {
                const isSelected = multiple
                  ? selectedValues.includes(option.value)
                  : value === option.value

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={\`w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center justify-between \${
                      isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }\`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'options',
        type: 'array',
        required: true,
        aiDescription: 'Array of options with value and label'
      },
      {
        name: 'value',
        type: 'string',
        required: false,
        aiDescription: 'Currently selected value'
      },
      {
        name: 'onChange',
        type: 'function',
        required: true,
        aiDescription: 'Function called when selection changes'
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        aiDescription: 'Placeholder text when no selection'
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        aiDescription: 'Enable search functionality'
      },
      {
        name: 'multiple',
        type: 'boolean',
        required: false,
        aiDescription: 'Allow multiple selections'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Dropdown select component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Create country selector',
        'Build category filter dropdown',
        'Add multi-select for tags'
      ],
      relatedCapsules: ['input-text', 'checkbox'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3100000
  },

  // Date Picker Component
  {
    id: 'date-picker',
    name: 'Date Picker',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['date', 'picker', 'calendar', 'input'],
    aiDescription: 'Date picker component with calendar interface',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const DatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date'
}: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const datePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    onChange?.(selectedDate)
    setIsOpen(false)
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (minDate && date < new Date(minDate)) return true
    if (maxDate && date > new Date(maxDate)) return true
    return false
  }

  const isSelectedDate = (day: number) => {
    if (!value) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const valueDate = new Date(value)
    return date.toDateString() === valueDate.toDateString()
  }

  const renderCalendar = () => {
    const days = []
    const totalDays = daysInMonth(currentMonth)
    const startDay = firstDayOfMonth(currentMonth)

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={\`empty-\${i}\`} className="p-2" />)
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const disabled = isDateDisabled(day)
      const selected = isSelectedDate(day)

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !disabled && handleDateSelect(day)}
          disabled={disabled}
          className={\`
            p-2 rounded-lg text-sm font-medium
            \${selected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
            \${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900'}
          \`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className="relative w-full" ref={datePickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value ? formatDate(new Date(value)) : placeholder}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={previousMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'value',
        type: 'string',
        required: false,
        aiDescription: 'Selected date value'
      },
      {
        name: 'onChange',
        type: 'function',
        required: true,
        aiDescription: 'Function called when date is selected'
      },
      {
        name: 'minDate',
        type: 'string',
        required: false,
        aiDescription: 'Minimum selectable date'
      },
      {
        name: 'maxDate',
        type: 'string',
        required: false,
        aiDescription: 'Maximum selectable date'
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        aiDescription: 'Placeholder text when no date selected'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Date picker component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add booking date selector',
        'Create event date picker',
        'Build birthday input field'
      ],
      relatedCapsules: ['input-text', 'dropdown-select'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1900000
  },

  // File Upload Component
  {
    id: 'file-upload',
    name: 'File Upload',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['file', 'upload', 'input', 'drag-drop'],
    aiDescription: 'File upload component with drag-and-drop support and file preview',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef } from 'react'

export const FileUpload = ({
  onUpload,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5
}: any) => {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File) => {
    if (maxSize && file.size > maxSize) {
      return \`File \${file.name} exceeds maximum size of \${(maxSize / 1024 / 1024).toFixed(1)}MB\`
    }
    if (accept) {
      const acceptedTypes = accept.split(',').map((t: string) => t.trim())
      const fileType = file.type
      const fileExt = '.' + file.name.split('.').pop()

      const isAccepted = acceptedTypes.some((type: string) => {
        if (type.startsWith('.')) {
          return fileExt === type
        }
        return fileType.match(new RegExp(type.replace('*', '.*')))
      })

      if (!isAccepted) {
        return \`File \${file.name} type not accepted\`
      }
    }
    return null
  }

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles)

    if (!multiple && fileArray.length > 1) {
      setError('Only one file allowed')
      return
    }

    if (files.length + fileArray.length > maxFiles) {
      setError(\`Maximum \${maxFiles} files allowed\`)
      return
    }

    // Validate all files
    for (const file of fileArray) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setError('')
    const updatedFiles = multiple ? [...files, ...fileArray] : fileArray
    setFiles(updatedFiles)
    onUpload?.(updatedFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onUpload?.(updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={\`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          \${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
        \`}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {accept ? \`Accepted: \${accept}\` : 'Any file type'}
            {maxSize && \` (max \${(maxSize / 1024 / 1024).toFixed(0)}MB)\`}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFiles(e.target.files)}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="ml-3 text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'onUpload',
        type: 'function',
        required: true,
        aiDescription: 'Function called when files are selected'
      },
      {
        name: 'accept',
        type: 'string',
        required: false,
        aiDescription: 'Accepted file types (e.g., "image/*,.pdf")'
      },
      {
        name: 'multiple',
        type: 'boolean',
        required: false,
        aiDescription: 'Allow multiple file uploads'
      },
      {
        name: 'maxSize',
        type: 'number',
        required: false,
        aiDescription: 'Maximum file size in bytes'
      },
      {
        name: 'maxFiles',
        type: 'number',
        required: false,
        aiDescription: 'Maximum number of files'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'File upload component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add profile picture upload',
        'Create document upload form',
        'Build image gallery uploader'
      ],
      relatedCapsules: ['button-primary', 'loading-spinner'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2400000
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

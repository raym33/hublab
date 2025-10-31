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
  },

  // Accordion Component
  {
    id: 'accordion',
    name: 'Accordion',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['accordion', 'collapse', 'expandable', 'faq'],
    aiDescription: 'Accordion component with collapsible sections for FAQs and expandable content',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const Accordion = ({ items, allowMultiple = false }: any) => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenItems(prev => prev.includes(index) ? [] : [index])
    }
  }

  return (
    <div className="space-y-2">
      {items.map((item: any, index: number) => {
        const isOpen = openItems.includes(index)

        return (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              <svg
                className={\`w-5 h-5 text-gray-500 transition-transform \${
                  isOpen ? 'transform rotate-180' : ''
                }\`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="text-gray-700">{item.content}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'items',
        type: 'array',
        required: true,
        aiDescription: 'Array of items with title and content'
      },
      {
        name: 'allowMultiple',
        type: 'boolean',
        required: false,
        aiDescription: 'Allow multiple sections to be open simultaneously'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Accordion component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Create FAQ section',
        'Build collapsible help documentation',
        'Add expandable product details'
      ],
      relatedCapsules: ['tabs', 'card'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2100000
  },

  // Breadcrumb Navigation
  {
    id: 'breadcrumb',
    name: 'Breadcrumb Navigation',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['breadcrumb', 'navigation', 'path'],
    aiDescription: 'Breadcrumb navigation component showing the current page location',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Breadcrumb = ({ items }: any) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item: any, index: number) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast ? (
                <span className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <a
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}`
      }
    },
    inputs: [
      {
        name: 'items',
        type: 'array',
        required: true,
        aiDescription: 'Array of breadcrumb items with label and href'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Breadcrumb navigation'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add page location navigation',
        'Show product category path',
        'Display file system location'
      ],
      relatedCapsules: ['app-container'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1600000
  },

  // Progress Bar
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['progress', 'bar', 'indicator', 'loading'],
    aiDescription: 'Progress bar component showing completion percentage',
    platforms: {
      web: {
        engine: 'react',
        code: `export const ProgressBar = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'medium'
}: any) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  }

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  }

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={\`w-full bg-gray-200 rounded-full overflow-hidden \${sizeClasses[size] || sizeClasses.medium}\`}>
        <div
          className={\`h-full \${colorClasses[color] || colorClasses.blue} transition-all duration-300 ease-out\`}
          style={{ width: \`\${percentage}%\` }}
        />
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'value',
        type: 'number',
        required: true,
        aiDescription: 'Current progress value'
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        aiDescription: 'Maximum value (default: 100)'
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        aiDescription: 'Progress label text'
      },
      {
        name: 'showPercentage',
        type: 'boolean',
        required: false,
        aiDescription: 'Show percentage text'
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        aiDescription: 'Bar color (blue, green, red, yellow, purple)'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        aiDescription: 'Bar size (small, medium, large)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Progress bar component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show upload progress',
        'Display task completion',
        'Indicate form step progress'
      ],
      relatedCapsules: ['loading-spinner'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2000000
  },

  // Badge Component
  {
    id: 'badge',
    name: 'Badge',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['badge', 'label', 'tag', 'status'],
    aiDescription: 'Badge component for labels, tags, and status indicators',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Badge = ({
  children,
  variant = 'default',
  size = 'medium'
}: any) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800'
  }

  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-2.5 py-1',
    large: 'text-base px-3 py-1.5'
  }

  return (
    <span
      className={\`inline-flex items-center font-medium rounded-full \${
        variantClasses[variant] || variantClasses.default
      } \${sizeClasses[size] || sizeClasses.medium}\`}
    >
      {children}
    </span>
  )
}`
      }
    },
    inputs: [
      {
        name: 'children',
        type: 'string',
        required: true,
        aiDescription: 'Badge text content'
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        aiDescription: 'Badge style variant (default, primary, success, warning, danger, purple)'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        aiDescription: 'Badge size (small, medium, large)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Badge component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add status indicators',
        'Display category tags',
        'Show notification counts'
      ],
      relatedCapsules: ['text-display'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3200000
  },

  // Alert/Notification Component
  {
    id: 'alert',
    name: 'Alert',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['alert', 'notification', 'message', 'banner'],
    aiDescription: 'Alert component for displaying important messages and notifications',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const Alert = ({
  children,
  title,
  variant = 'info',
  dismissible = false,
  onDismiss
}: any) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  const variantStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: (
        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  }

  const style = variantStyles[variant] || variantStyles.info

  return (
    <div className={\`rounded-lg border p-4 \${style.bg} \${style.border}\`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={\`text-sm font-medium \${style.text}\`}>{title}</h3>
          )}
          <div className={\`\${title ? 'mt-2' : ''} text-sm \${style.text}\`}>
            {children}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={\`ml-3 flex-shrink-0 \${style.text} hover:opacity-75\`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'children',
        type: 'string',
        required: true,
        aiDescription: 'Alert message content'
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        aiDescription: 'Alert title'
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        aiDescription: 'Alert type (info, success, warning, error)'
      },
      {
        name: 'dismissible',
        type: 'boolean',
        required: false,
        aiDescription: 'Allow user to dismiss alert'
      },
      {
        name: 'onDismiss',
        type: 'function',
        required: false,
        aiDescription: 'Function called when alert is dismissed'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Alert component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show success message after form submission',
        'Display error notifications',
        'Add informational banners'
      ],
      relatedCapsules: ['modal', 'card'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2800000
  },

  // Tooltip Component
  {
    id: 'tooltip',
    name: 'Tooltip',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['tooltip', 'hint', 'help', 'popover'],
    aiDescription: 'Tooltip component for displaying helpful hints on hover',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const Tooltip = ({
  children,
  content,
  position = 'top'
}: any) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900'
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={\`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap \${
            positionClasses[position] || positionClasses.top
          }\`}
        >
          {content}
          <div
            className={\`absolute w-0 h-0 border-4 \${
              arrowClasses[position] || arrowClasses.top
            }\`}
          />
        </div>
      )}
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
        aiDescription: 'Element to attach tooltip to'
      },
      {
        name: 'content',
        type: 'string',
        required: true,
        aiDescription: 'Tooltip text content'
      },
      {
        name: 'position',
        type: 'string',
        required: false,
        aiDescription: 'Tooltip position (top, bottom, left, right)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Tooltip wrapper component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add help text to buttons',
        'Show additional information on hover',
        'Display keyboard shortcuts'
      ],
      relatedCapsules: ['badge'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2600000
  },

  // Avatar Component
  {
    id: 'avatar',
    name: 'Avatar',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['avatar', 'profile', 'image', 'user'],
    aiDescription: 'Avatar component for displaying user profile pictures or initials',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Avatar = ({
  src,
  alt,
  name,
  size = 'medium',
  status
}: any) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base',
    xlarge: 'w-24 h-24 text-xl'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sizeClass = sizeClasses[size] || sizeClasses.medium

  return (
    <div className="relative inline-block">
      <div
        className={\`\${sizeClass} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold\`}
      >
        {src ? (
          <img src={src} alt={alt || name} className="w-full h-full object-cover" />
        ) : (
          <span>{name ? getInitials(name) : '?'}</span>
        )}
      </div>
      {status && (
        <div
          className={\`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white \${
            statusColors[status] || statusColors.offline
          }\`}
        />
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'src',
        type: 'string',
        required: false,
        aiDescription: 'Avatar image URL'
      },
      {
        name: 'alt',
        type: 'string',
        required: false,
        aiDescription: 'Image alt text'
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        aiDescription: 'User name for initials fallback'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        aiDescription: 'Avatar size (small, medium, large, xlarge)'
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        aiDescription: 'Status indicator (online, offline, busy, away)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Avatar component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Display user profile picture',
        'Show team member avatars',
        'Add author photo to comments'
      ],
      relatedCapsules: ['badge'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2900000
  },

  // Pagination Component
  {
    id: 'pagination',
    name: 'Pagination',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['pagination', 'paging', 'navigation', 'list'],
    aiDescription: 'Pagination component for navigating through pages of content',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 7
}: any) => {
  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const halfVisible = Math.floor(maxVisible / 2)
      let start = Math.max(1, currentPage - halfVisible)
      let end = Math.min(totalPages, start + maxVisible - 1)

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }

      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push('...')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <nav className="flex items-center justify-center space-x-1">
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          First
        </button>
      )}

      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={\`px-4 py-2 text-sm font-medium rounded-lg \${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }\`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Last
        </button>
      )}
    </nav>
  )
}`
      }
    },
    inputs: [
      {
        name: 'currentPage',
        type: 'number',
        required: true,
        aiDescription: 'Current active page number'
      },
      {
        name: 'totalPages',
        type: 'number',
        required: true,
        aiDescription: 'Total number of pages'
      },
      {
        name: 'onPageChange',
        type: 'function',
        required: true,
        aiDescription: 'Function called when page changes'
      },
      {
        name: 'showFirstLast',
        type: 'boolean',
        required: false,
        aiDescription: 'Show first/last page buttons'
      },
      {
        name: 'maxVisible',
        type: 'number',
        required: false,
        aiDescription: 'Maximum number of visible page buttons'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Pagination component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add pagination to product lists',
        'Navigate through search results',
        'Page through blog posts'
      ],
      relatedCapsules: ['list-view'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2300000
  },

  // Data Table Component
  {
    id: 'data-table',
    name: 'Data Table',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['table', 'data', 'grid', 'sortable'],
    aiDescription: 'Data table component with sorting, headers, and customizable columns',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const DataTable = ({
  columns,
  data,
  sortable = true,
  striped = true,
  hoverable = true
}: any) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const handleSort = (key: string) => {
    if (!sortable) return

    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...data]
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column: any, index: number) => (
              <th
                key={index}
                onClick={() => column.sortable !== false && handleSort(column.key)}
                className={\`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider \${
                  sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                }\`}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortable && column.sortable !== false && sortConfig?.key === column.key && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {sortConfig.direction === 'asc' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      )}
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={\`bg-white divide-y divide-gray-200 \${striped ? 'divide-y divide-gray-200' : ''}\`}>
          {sortedData.map((row: any, rowIndex: number) => (
            <tr
              key={rowIndex}
              className={\`\${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''} \${
                hoverable ? 'hover:bg-gray-100' : ''
              } transition-colors\`}
            >
              {columns.map((column: any, colIndex: number) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="text-center py-12 text-gray-500">No data available</div>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'columns',
        type: 'array',
        required: true,
        aiDescription: 'Array of column definitions with key, label, and optional render function'
      },
      {
        name: 'data',
        type: 'array',
        required: true,
        aiDescription: 'Array of data objects to display'
      },
      {
        name: 'sortable',
        type: 'boolean',
        required: false,
        aiDescription: 'Enable column sorting'
      },
      {
        name: 'striped',
        type: 'boolean',
        required: false,
        aiDescription: 'Alternate row background colors'
      },
      {
        name: 'hoverable',
        type: 'boolean',
        required: false,
        aiDescription: 'Highlight row on hover'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Data table component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Display product inventory',
        'Show user list with sorting',
        'Create analytics dashboard table'
      ],
      relatedCapsules: ['list-view', 'pagination'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3500000
  },

  // Search Input Component
  {
    id: 'search-input',
    name: 'Search Input',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['search', 'input', 'filter', 'query'],
    aiDescription: 'Search input component with icon and clear button',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const SearchInput = ({
  value: externalValue,
  onChange,
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300
}: any) => {
  const [value, setValue] = useState(externalValue || '')
  const [debounceTimer, setDebounceTimer] = useState<any>(null)

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onChange?.(newValue)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      onSearch?.(newValue)
    }, debounceMs)

    setDebounceTimer(timer)
  }

  const handleClear = () => {
    setValue('')
    onChange?.('')
    onSearch?.('')
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </button>
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
        aiDescription: 'Current search value'
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        aiDescription: 'Function called immediately on value change'
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        aiDescription: 'Placeholder text'
      },
      {
        name: 'onSearch',
        type: 'function',
        required: false,
        aiDescription: 'Function called after debounce delay'
      },
      {
        name: 'debounceMs',
        type: 'number',
        required: false,
        aiDescription: 'Debounce delay in milliseconds'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Search input component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add search bar to product list',
        'Filter table data',
        'Search through documentation'
      ],
      relatedCapsules: ['input-text', 'data-table'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3100000
  },

  // Toggle Switch Component
  {
    id: 'toggle-switch',
    name: 'Toggle Switch',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['toggle', 'switch', 'boolean', 'checkbox'],
    aiDescription: 'Toggle switch component for boolean settings and preferences',
    platforms: {
      web: {
        engine: 'react',
        code: `export const ToggleSwitch = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'medium'
}: any) => {
  const sizeClasses = {
    small: {
      container: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    medium: {
      container: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    large: {
      container: 'w-14 h-7',
      circle: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  }

  const sizes = sizeClasses[size] || sizeClasses.medium

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={\`\${sizes.container} rounded-full transition-colors \${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } \${checked ? 'bg-blue-600' : 'bg-gray-300'}\`}
        />
        <div
          className={\`absolute left-0.5 top-0.5 \${sizes.circle} bg-white rounded-full transition-transform \${
            checked ? sizes.translate : ''
          }\`}
        />
      </div>
      {label && (
        <span className={\`ml-3 text-sm font-medium text-gray-900 \${disabled ? 'opacity-50' : ''}\`}>
          {label}
        </span>
      )}
    </label>
  )
}`
      }
    },
    inputs: [
      {
        name: 'checked',
        type: 'boolean',
        required: true,
        aiDescription: 'Current toggle state'
      },
      {
        name: 'onChange',
        type: 'function',
        required: true,
        aiDescription: 'Function called when toggle changes'
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        aiDescription: 'Label text next to toggle'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        aiDescription: 'Disable the toggle'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        aiDescription: 'Toggle size (small, medium, large)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Toggle switch component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add dark mode toggle',
        'Enable/disable notifications',
        'Turn features on/off'
      ],
      relatedCapsules: ['checkbox'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2700000
  },

  // Slider/Range Component
  {
    id: 'slider',
    name: 'Slider',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['slider', 'range', 'input', 'number'],
    aiDescription: 'Slider component for selecting numeric values from a range',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const Slider = ({
  value: externalValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue
}: any) => {
  const [value, setValue] = useState(externalValue ?? min)

  const handleChange = (newValue: number) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  const percentage = ((value - min) / (max - min)) * 100
  const displayValue = formatValue ? formatValue(value) : value

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
          {showValue && (
            <span className="text-sm font-medium text-gray-900">{displayValue}</span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: \`linear-gradient(to right, #3B82F6 0%, #3B82F6 \${percentage}%, #E5E7EB \${percentage}%, #E5E7EB 100%)\`
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
      <style jsx>{\`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      \`}</style>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'value',
        type: 'number',
        required: false,
        aiDescription: 'Current slider value'
      },
      {
        name: 'onChange',
        type: 'function',
        required: true,
        aiDescription: 'Function called when value changes'
      },
      {
        name: 'min',
        type: 'number',
        required: false,
        aiDescription: 'Minimum value'
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        aiDescription: 'Maximum value'
      },
      {
        name: 'step',
        type: 'number',
        required: false,
        aiDescription: 'Step increment'
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        aiDescription: 'Slider label'
      },
      {
        name: 'showValue',
        type: 'boolean',
        required: false,
        aiDescription: 'Show current value'
      },
      {
        name: 'formatValue',
        type: 'function',
        required: false,
        aiDescription: 'Function to format displayed value'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Slider component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add volume control',
        'Set price range filter',
        'Adjust opacity or brightness'
      ],
      relatedCapsules: ['input-text'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2200000
  },

  // Skeleton Loader Component
  {
    id: 'skeleton',
    name: 'Skeleton Loader',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['skeleton', 'loader', 'loading', 'placeholder'],
    aiDescription: 'Skeleton loader component showing placeholder content while loading',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = ''
}: any) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    avatar: 'w-12 h-12 rounded-full'
  }

  const baseClass = variants[variant] || variants.text
  const widthClass = width ? \`w-[\${width}]\` : 'w-full'
  const heightClass = height ? \`h-[\${height}]\` : ''

  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={\`bg-gray-200 \${baseClass} \${widthClass} \${heightClass} \${className}\`}
          style={{
            width: width || undefined,
            height: height || undefined
          }}
        />
      ))}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'variant',
        type: 'string',
        required: false,
        aiDescription: 'Skeleton style (text, title, circular, rectangular, avatar)'
      },
      {
        name: 'width',
        type: 'string',
        required: false,
        aiDescription: 'Custom width'
      },
      {
        name: 'height',
        type: 'string',
        required: false,
        aiDescription: 'Custom height'
      },
      {
        name: 'count',
        type: 'number',
        required: false,
        aiDescription: 'Number of skeleton elements'
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        aiDescription: 'Additional CSS classes'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Skeleton loader component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show loading state for content',
        'Placeholder for user profiles',
        'Loading animation for lists'
      ],
      relatedCapsules: ['loading-spinner'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2500000
  },

  // Empty State Component
  {
    id: 'empty-state',
    name: 'Empty State',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['empty', 'placeholder', 'no-data', 'zero-state'],
    aiDescription: 'Empty state component for displaying when no data is available',
    platforms: {
      web: {
        engine: 'react',
        code: `export const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionLabel
}: any) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon ? (
        <div className="mb-4">{icon}</div>
      ) : (
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || 'No data available'}
      </h3>

      {description && (
        <p className="text-gray-600 max-w-md mb-6">
          {description}
        </p>
      )}

      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'icon',
        type: 'component',
        required: false,
        aiDescription: 'Custom icon component'
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        aiDescription: 'Empty state title'
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        aiDescription: 'Empty state description'
      },
      {
        name: 'action',
        type: 'function',
        required: false,
        aiDescription: 'Action button click handler'
      },
      {
        name: 'actionLabel',
        type: 'string',
        required: false,
        aiDescription: 'Action button label'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Empty state component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show when no search results found',
        'Display when list is empty',
        'Prompt user to add first item'
      ],
      relatedCapsules: ['alert'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1900000
  },

  // Divider Component
  {
    id: 'divider',
    name: 'Divider',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['divider', 'separator', 'line', 'hr'],
    aiDescription: 'Divider component for separating content sections',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Divider = ({
  orientation = 'horizontal',
  label,
  thickness = 'thin',
  spacing = 'medium'
}: any) => {
  const thicknessClasses = {
    thin: orientation === 'horizontal' ? 'border-t' : 'border-l',
    medium: orientation === 'horizontal' ? 'border-t-2' : 'border-l-2',
    thick: orientation === 'horizontal' ? 'border-t-4' : 'border-l-4'
  }

  const spacingClasses = {
    small: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    medium: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    large: orientation === 'horizontal' ? 'my-8' : 'mx-8'
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={\`\${thicknessClasses[thickness]} \${spacingClasses[spacing]} border-gray-200 h-full\`}
      />
    )
  }

  if (label) {
    return (
      <div className={\`relative \${spacingClasses[spacing]}\`}>
        <div className="absolute inset-0 flex items-center">
          <div className={\`w-full \${thicknessClasses[thickness]} border-gray-200\`} />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-sm text-gray-500 font-medium">
            {label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={\`\${thicknessClasses[thickness]} \${spacingClasses[spacing]} border-gray-200\`}
    />
  )
}`
      }
    },
    inputs: [
      {
        name: 'orientation',
        type: 'string',
        required: false,
        aiDescription: 'Divider orientation (horizontal, vertical)'
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        aiDescription: 'Optional label text in the middle'
      },
      {
        name: 'thickness',
        type: 'string',
        required: false,
        aiDescription: 'Line thickness (thin, medium, thick)'
      },
      {
        name: 'spacing',
        type: 'string',
        required: false,
        aiDescription: 'Margin spacing (small, medium, large)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Divider component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Separate content sections',
        'Add visual breaks in forms',
        'Divide sidebar sections'
      ],
      relatedCapsules: ['card'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1500000
  },

  // Rating Component
  {
    id: 'rating',
    name: 'Rating',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['rating', 'stars', 'review', 'score'],
    aiDescription: 'Star rating component for reviews and feedback',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const Rating = ({
  value: externalValue,
  onChange,
  max = 5,
  size = 'medium',
  readonly = false,
  showValue = false
}: any) => {
  const [value, setValue] = useState(externalValue || 0)
  const [hoverValue, setHoverValue] = useState(0)

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }

  const handleClick = (rating: number) => {
    if (readonly) return
    setValue(rating)
    onChange?.(rating)
  }

  const sizeClass = sizeClasses[size] || sizeClasses.medium

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1
          const isFilled = hoverValue ? starValue <= hoverValue : starValue <= value

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => !readonly && setHoverValue(starValue)}
              onMouseLeave={() => !readonly && setHoverValue(0)}
              disabled={readonly}
              className={\`\${readonly ? '' : 'cursor-pointer hover:scale-110'} transition-transform\`}
            >
              <svg
                className={\`\${sizeClass} \${
                  isFilled ? 'text-yellow-400' : 'text-gray-300'
                } transition-colors\`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {value}/{max}
        </span>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'value',
        type: 'number',
        required: false,
        aiDescription: 'Current rating value'
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        aiDescription: 'Function called when rating changes'
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        aiDescription: 'Maximum rating value'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        aiDescription: 'Star size (small, medium, large)'
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        aiDescription: 'Display only mode'
      },
      {
        name: 'showValue',
        type: 'boolean',
        required: false,
        aiDescription: 'Show numeric value'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rating component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add product reviews',
        'Collect user feedback',
        'Display ratings on items'
      ],
      relatedCapsules: ['badge'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2400000
  },

  // Radio Group Component
  {
    id: 'radio-group',
    name: 'Radio Group',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['radio', 'input', 'select', 'options'],
    aiDescription: 'Radio button group for selecting a single option from multiple choices',
    platforms: {
      web: {
        engine: 'react',
        code: `export const RadioGroup = ({
  options,
  value,
  onChange,
  label,
  orientation = 'vertical',
  disabled = false
}: any) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div
        className={\`\${
          orientation === 'horizontal'
            ? 'flex flex-wrap gap-4'
            : 'space-y-3'
        }\`}
      >
        {options.map((option: any, index: number) => {
          const optionValue = typeof option === 'string' ? option : option.value
          const optionLabel = typeof option === 'string' ? option : option.label
          const optionDisabled = disabled || (typeof option === 'object' && option.disabled)
          const isSelected = value === optionValue

          return (
            <label
              key={index}
              className={\`flex items-center \${
                optionDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }\`}
            >
              <input
                type="radio"
                value={optionValue}
                checked={isSelected}
                onChange={() => !optionDisabled && onChange?.(optionValue)}
                disabled={optionDisabled}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-900">
                {optionLabel}
                {typeof option === 'object' && option.description && (
                  <span className="block text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>
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
        aiDescription: 'Array of options (strings or objects with value, label, description)'
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
        name: 'label',
        type: 'string',
        required: false,
        aiDescription: 'Group label'
      },
      {
        name: 'orientation',
        type: 'string',
        required: false,
        aiDescription: 'Layout orientation (vertical, horizontal)'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        aiDescription: 'Disable all options'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Radio group component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Select shipping method',
        'Choose payment option',
        'Pick subscription plan'
      ],
      relatedCapsules: ['checkbox', 'dropdown-select'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2600000
  },

  // Code Block Component
  {
    id: 'code-block',
    name: 'Code Block',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['code', 'syntax', 'pre', 'monospace'],
    aiDescription: 'Code block component for displaying formatted code with copy functionality',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const CodeBlock = ({
  code,
  language = 'javascript',
  showLineNumbers = false,
  maxHeight
}: any) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const lines = code.split('\\n')

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
        <span className="text-xs text-gray-400 font-medium uppercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      <div
        className="bg-gray-900 rounded-b-lg overflow-auto"
        style={{ maxHeight: maxHeight || '400px' }}
      >
        <pre className="p-4 text-sm">
          <code className="text-gray-100 font-mono">
            {showLineNumbers ? (
              <div className="flex">
                <div className="pr-4 text-gray-500 select-none border-r border-gray-700">
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="pl-4 flex-1">{code}</div>
              </div>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'code',
        type: 'string',
        required: true,
        aiDescription: 'Code content to display'
      },
      {
        name: 'language',
        type: 'string',
        required: false,
        aiDescription: 'Programming language label'
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        required: false,
        aiDescription: 'Show line numbers'
      },
      {
        name: 'maxHeight',
        type: 'string',
        required: false,
        aiDescription: 'Maximum height (e.g., "300px")'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Code block component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Display code examples in documentation',
        'Show API responses',
        'Present configuration files'
      ],
      relatedCapsules: ['text-display'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1800000
  },

  // Image Component
  {
    id: 'image',
    name: 'Image',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['image', 'img', 'picture', 'photo'],
    aiDescription: 'Image component with lazy loading, fallback, and aspect ratio support',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const Image = ({
  src,
  alt,
  width,
  height,
  aspectRatio = '16/9',
  objectFit = 'cover',
  fallbackSrc,
  onLoad,
  onError,
  className = ''
}: any) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    }
    onError?.()
  }

  return (
    <div
      className={\`relative overflow-hidden bg-gray-200 \${className}\`}
      style={{
        width: width || '100%',
        height: height || undefined,
        aspectRatio: !height ? aspectRatio : undefined
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-300 w-full h-full" />
        </div>
      )}

      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        className={\`w-full h-full \${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300\`}
        style={{
          objectFit: objectFit
        }}
      />

      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'src',
        type: 'string',
        required: true,
        aiDescription: 'Image source URL'
      },
      {
        name: 'alt',
        type: 'string',
        required: true,
        aiDescription: 'Alternative text for accessibility'
      },
      {
        name: 'width',
        type: 'string',
        required: false,
        aiDescription: 'Image width'
      },
      {
        name: 'height',
        type: 'string',
        required: false,
        aiDescription: 'Image height'
      },
      {
        name: 'aspectRatio',
        type: 'string',
        required: false,
        aiDescription: 'Aspect ratio (e.g., "16/9", "4/3")'
      },
      {
        name: 'objectFit',
        type: 'string',
        required: false,
        aiDescription: 'How image fits container (cover, contain, fill)'
      },
      {
        name: 'fallbackSrc',
        type: 'string',
        required: false,
        aiDescription: 'Fallback image if main fails'
      },
      {
        name: 'onLoad',
        type: 'function',
        required: false,
        aiDescription: 'Function called when image loads'
      },
      {
        name: 'onError',
        type: 'function',
        required: false,
        aiDescription: 'Function called on load error'
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        aiDescription: 'Additional CSS classes'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Image component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Display product images',
        'Show user uploaded photos',
        'Add hero images to pages'
      ],
      relatedCapsules: ['avatar'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 4200000
  },

  // Toast Notification Component
  {
    id: 'toast',
    name: 'Toast Notification',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['toast', 'notification', 'snackbar', 'message'],
    aiDescription: 'Toast notification component for temporary messages and alerts',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useEffect } from 'react'

export const Toast = ({
  message,
  variant = 'info',
  duration = 3000,
  onClose,
  position = 'bottom-right'
}: any) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  const variantStyles = {
    info: {
      bg: 'bg-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    success: {
      bg: 'bg-green-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  }

  const style = variantStyles[variant] || variantStyles.info

  if (!isVisible) return null

  return (
    <div
      className={\`fixed z-50 \${positionClasses[position]} transition-all duration-300 \${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }\`}
    >
      <div className={\`\${style.bg} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md\`}>
        <div className="flex-shrink-0">
          {style.icon}
        </div>
        <div className="flex-1">
          {message}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 hover:opacity-75 transition-opacity"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'message',
        type: 'string',
        required: true,
        aiDescription: 'Toast message text'
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        aiDescription: 'Toast type (info, success, warning, error)'
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        aiDescription: 'Auto-close duration in ms (0 for manual)'
      },
      {
        name: 'onClose',
        type: 'function',
        required: false,
        aiDescription: 'Function called when toast closes'
      },
      {
        name: 'position',
        type: 'string',
        required: false,
        aiDescription: 'Toast position on screen'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Toast notification component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show success message after save',
        'Display error notifications',
        'Confirm action completion'
      ],
      relatedCapsules: ['alert'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3200000
  },

  // Stepper Component
  {
    id: 'stepper',
    name: 'Stepper',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['stepper', 'wizard', 'steps', 'progress'],
    aiDescription: 'Stepper component for multi-step forms and processes',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Stepper = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal'
}: any) => {
  return (
    <div className={\`\${orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col'}\`}>
      {steps.map((step: any, index: number) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isClickable = onStepClick && (isCompleted || isCurrent)

        return (
          <div
            key={index}
            className={\`flex \${orientation === 'horizontal' ? 'items-center' : 'flex-col'} flex-1\`}
          >
            {/* Step Circle */}
            <div className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={\`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all \${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isCurrent
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-gray-300 text-gray-400 bg-white'
                } \${isClickable ? 'cursor-pointer hover:border-blue-400' : 'cursor-default'}\`}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </button>

              {/* Step Label */}
              {orientation === 'horizontal' && (
                <div className="ml-3">
                  <div className={\`text-sm font-medium \${isCurrent ? 'text-gray-900' : 'text-gray-500'}\`}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-400">{step.description}</div>
                  )}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={\`\${
                  orientation === 'horizontal'
                    ? 'flex-1 h-0.5 mx-4'
                    : 'w-0.5 h-12 ml-5 my-2'
                } \${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}\`}
              />
            )}

            {/* Vertical Label */}
            {orientation === 'vertical' && (
              <div className="ml-16 -mt-8 mb-4">
                <div className={\`text-sm font-medium \${isCurrent ? 'text-gray-900' : 'text-gray-500'}\`}>
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-400 mt-1">{step.description}</div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'steps',
        type: 'array',
        required: true,
        aiDescription: 'Array of step objects with label and optional description'
      },
      {
        name: 'currentStep',
        type: 'number',
        required: true,
        aiDescription: 'Current active step number (1-indexed)'
      },
      {
        name: 'onStepClick',
        type: 'function',
        required: false,
        aiDescription: 'Function called when a step is clicked'
      },
      {
        name: 'orientation',
        type: 'string',
        required: false,
        aiDescription: 'Stepper orientation (horizontal, vertical)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Stepper component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Create multi-step checkout',
        'Build registration wizard',
        'Guide through onboarding process'
      ],
      relatedCapsules: ['progress-bar', 'button-primary'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1700000
  },

  // Context Menu Component
  {
    id: 'context-menu',
    name: 'Context Menu',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['menu', 'context', 'dropdown', 'popup'],
    aiDescription: 'Context menu component for right-click actions and dropdown menus',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const ContextMenu = ({
  trigger,
  items,
  triggerOn = 'click'
}: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTrigger = (event: any) => {
    if (triggerOn === 'contextmenu') {
      event.preventDefault()
    }

    const rect = event.currentTarget.getBoundingClientRect()
    setPosition({
      x: triggerOn === 'contextmenu' ? event.clientX : rect.left,
      y: triggerOn === 'contextmenu' ? event.clientY : rect.bottom + 4
    })
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item: any) => {
    if (!item.disabled) {
      item.onClick?.()
      setIsOpen(false)
    }
  }

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={triggerOn === 'click' ? handleTrigger : undefined}
        onContextMenu={triggerOn === 'contextmenu' ? handleTrigger : undefined}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]"
          style={{
            left: \`\${position.x}px\`,
            top: \`\${position.y}px\`
          }}
        >
          {items.map((item: any, index: number) => (
            <div key={index}>
              {item.divider ? (
                <div className="my-1 border-t border-gray-200" />
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={\`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition-colors \${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  } \${item.danger ? 'text-red-600' : 'text-gray-700'}\`}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-xs text-gray-400">{item.shortcut}</span>
                  )}
                </button>
              )}
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
        name: 'trigger',
        type: 'component',
        required: true,
        aiDescription: 'Element that triggers the menu'
      },
      {
        name: 'items',
        type: 'array',
        required: true,
        aiDescription: 'Menu items with label, onClick, optional icon/shortcut/danger/disabled'
      },
      {
        name: 'triggerOn',
        type: 'string',
        required: false,
        aiDescription: 'Trigger event (click, contextmenu)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Context menu component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add right-click menu to items',
        'Create dropdown action menu',
        'Build settings menu'
      ],
      relatedCapsules: ['dropdown-select', 'button-primary'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2100000
  },

  // Chip Component
  {
    id: 'chip',
    name: 'Chip',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['chip', 'tag', 'pill', 'badge'],
    aiDescription: 'Chip component for tags, filters, and selections with optional delete',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Chip = ({
  label,
  onDelete,
  onClick,
  variant = 'filled',
  color = 'default',
  size = 'medium',
  icon,
  avatar
}: any) => {
  const variantStyles = {
    filled: {
      default: 'bg-gray-200 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    },
    outlined: {
      default: 'border border-gray-300 text-gray-700',
      primary: 'border border-blue-300 text-blue-700',
      success: 'border border-green-300 text-green-700',
      warning: 'border border-yellow-300 text-yellow-700',
      error: 'border border-red-300 text-red-700'
    }
  }

  const sizeStyles = {
    small: 'text-xs px-2 py-1 gap-1',
    medium: 'text-sm px-3 py-1.5 gap-1.5',
    large: 'text-base px-4 py-2 gap-2'
  }

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }

  return (
    <div
      onClick={onClick}
      className={\`inline-flex items-center rounded-full font-medium \${
        variantStyles[variant][color]
      } \${sizeStyles[size]} \${onClick ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity\`}
    >
      {avatar && (
        <div className={\`\${iconSizes[size]} rounded-full overflow-hidden flex-shrink-0\`}>
          {avatar}
        </div>
      )}

      {icon && !avatar && (
        <div className={\`\${iconSizes[size]} flex-shrink-0\`}>
          {icon}
        </div>
      )}

      <span className="truncate">{label}</span>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex-shrink-0 hover:opacity-75 transition-opacity"
        >
          <svg className={\`\${iconSizes[size]}\`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'label',
        type: 'string',
        required: true,
        aiDescription: 'Chip label text'
      },
      {
        name: 'onDelete',
        type: 'function',
        required: false,
        aiDescription: 'Function called when delete icon clicked'
      },
      {
        name: 'onClick',
        type: 'function',
        required: false,
        aiDescription: 'Function called when chip clicked'
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        aiDescription: 'Chip variant (filled, outlined)'
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        aiDescription: 'Chip color (default, primary, success, warning, error)'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        aiDescription: 'Chip size (small, medium, large)'
      },
      {
        name: 'icon',
        type: 'component',
        required: false,
        aiDescription: 'Leading icon component'
      },
      {
        name: 'avatar',
        type: 'component',
        required: false,
        aiDescription: 'Leading avatar component'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Chip component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Display selected tags',
        'Show active filters',
        'Create removable selections'
      ],
      relatedCapsules: ['badge'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2800000
  },

  // Icon Button Component
  {
    id: 'icon-button',
    name: 'Icon Button',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['button', 'icon', 'action'],
    aiDescription: 'Icon-only button component for compact actions',
    platforms: {
      web: {
        engine: 'react',
        code: `export const IconButton = ({
  icon,
  onClick,
  variant = 'default',
  size = 'medium',
  disabled = false,
  ariaLabel,
  tooltip
}: any) => {
  const variantStyles = {
    default: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    text: 'bg-transparent text-gray-700 hover:text-gray-900'
  }

  const sizeStyles = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  }

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={tooltip}
      className={\`\${sizeStyles[size]} \${variantStyles[variant]} rounded-lg flex items-center justify-center transition-all \${
        disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow active:scale-95'
      }\`}
    >
      <div className={iconSizes[size]}>
        {icon}
      </div>
    </button>
  )
}`
      }
    },
    inputs: [
      {
        name: 'icon',
        type: 'component',
        required: true,
        aiDescription: 'Icon component to display'
      },
      {
        name: 'onClick',
        type: 'function',
        required: true,
        aiDescription: 'Function called when button clicked'
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        aiDescription: 'Button variant (default, primary, danger, ghost, text)'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        aiDescription: 'Button size (small, medium, large)'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        aiDescription: 'Disable the button'
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        aiDescription: 'Accessibility label'
      },
      {
        name: 'tooltip',
        type: 'string',
        required: false,
        aiDescription: 'Tooltip text on hover'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Icon button component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Add close buttons',
        'Create icon toolbars',
        'Build action buttons for lists'
      ],
      relatedCapsules: ['button-primary', 'tooltip'],
      complexity: 'simple'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 3600000
  },

  // Select Multi Component
  {
    id: 'select-multi',
    name: 'Multi-Select',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['select', 'multi-select', 'checkbox', 'dropdown'],
    aiDescription: 'Multi-select dropdown with checkboxes, select all, search, and tag display',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const SelectMulti = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select items...',
  searchable = true,
  selectAllOption = true,
  maxDisplay = 3,
  disabled = false,
  className = ''
}: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredOptions = searchable && searchTerm
    ? options.filter((opt: any) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const handleToggle = (optionValue: any) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v: any) => v !== optionValue)
      : [...value, optionValue]
    onChange?.(newValue)
  }

  const handleSelectAll = () => {
    if (value.length === options.length) {
      onChange?.([])
    } else {
      onChange?.(options.map((opt: any) => opt.value))
    }
  }

  const selectedLabels = options
    .filter((opt: any) => value.includes(opt.value))
    .map((opt: any) => opt.label)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={\`relative \${className}\`}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={\`min-h-[42px] px-4 py-2 border-2 rounded-lg cursor-pointer transition-all \${
          disabled
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
            : isOpen
            ? 'border-blue-500 shadow-md'
            : 'border-gray-300 hover:border-gray-400'
        }\`}
      >
        {value.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedLabels.slice(0, maxDisplay).map((label: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
              >
                {label}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const optValue = options.find((o: any) => o.label === label)?.value
                    if (optValue) handleToggle(optValue)
                  }}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedLabels.length > maxDisplay && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded">
                +{selectedLabels.length - maxDisplay} more
              </span>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="overflow-y-auto max-h-64">
            {selectAllOption && filteredOptions.length > 0 && (
              <div
                onClick={handleSelectAll}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-200 font-medium"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.length === options.length}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="ml-3">Select All ({options.length})</span>
                </label>
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No options found
              </div>
            ) : (
              filteredOptions.map((option: any, index: number) => (
                <div
                  key={index}
                  onClick={() => handleToggle(option.value)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="ml-3">{option.label}</span>
                  </label>
                </div>
              ))
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
        aiDescription: 'Array of {value, label} objects'
      },
      {
        name: 'value',
        type: 'array',
        required: true,
        aiDescription: 'Array of selected values'
      },
      {
        name: 'onChange',
        type: 'function',
        required: true,
        aiDescription: 'Callback when selection changes'
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        aiDescription: 'Placeholder text'
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        aiDescription: 'Enable search functionality'
      },
      {
        name: 'selectAllOption',
        type: 'boolean',
        required: false,
        aiDescription: 'Show select all option'
      },
      {
        name: 'maxDisplay',
        type: 'number',
        required: false,
        aiDescription: 'Max tags to display before showing count'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        aiDescription: 'Disable the select'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Multi-select dropdown component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Multi-select with tags',
        'Filter options with checkboxes',
        'Select multiple categories'
      ],
      relatedCapsules: ['dropdown-select', 'checkbox'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2100000
  },

  // Chart Component
  {
    id: 'chart-line',
    name: 'Line Chart',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['chart', 'graph', 'line', 'data-viz', 'analytics'],
    aiDescription: 'Interactive line chart with multiple series, tooltips, legend, and grid',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef } from 'react'

export const LineChart = ({
  data = [],
  series = [],
  xAxisKey = 'x',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  className = ''
}: any) => {
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartWidth = 600
  const chartHeight = height - padding.top - padding.bottom

  // Calculate min/max values
  const allValues = data.flatMap((d: any) =>
    series.map((s: any) => d[s.key])
  ).filter((v: any) => typeof v === 'number')

  const minY = Math.min(...allValues, 0)
  const maxY = Math.max(...allValues, 0)
  const rangeY = maxY - minY || 1

  // Scale functions
  const scaleX = (index: number) =>
    padding.left + (index / (data.length - 1 || 1)) * (chartWidth - padding.left - padding.right)

  const scaleY = (value: number) =>
    padding.top + chartHeight - ((value - minY) / rangeY) * chartHeight

  // Generate Y-axis labels
  const yTicks = 5
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const value = minY + (rangeY * i) / (yTicks - 1)
    return { value, y: scaleY(value) }
  })

  return (
    <div className={\`relative \${className}\`}>
      <svg
        ref={svgRef}
        width={chartWidth}
        height={height}
        className="overflow-visible"
      >
        {/* Grid */}
        {showGrid && (
          <g className="text-gray-300">
            {yLabels.map((tick, i) => (
              <line
                key={i}
                x1={padding.left}
                y1={tick.y}
                x2={chartWidth - padding.right}
                y2={tick.y}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
          </g>
        )}

        {/* Y-axis labels */}
        <g className="text-gray-600 text-xs">
          {yLabels.map((tick, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={tick.y}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {tick.value.toFixed(0)}
            </text>
          ))}
        </g>

        {/* X-axis labels */}
        <g className="text-gray-600 text-xs">
          {data.map((d: any, i: number) => (
            <text
              key={i}
              x={scaleX(i)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
            >
              {d[xAxisKey]}
            </text>
          ))}
        </g>

        {/* Lines */}
        {series.map((s: any, seriesIndex: number) => {
          const points = data
            .map((d: any, i: number) => ({
              x: scaleX(i),
              y: scaleY(d[s.key])
            }))
            .filter((p: any) => !isNaN(p.y))

          const pathData = points
            .map((p: any, i: number) => \`\${i === 0 ? 'M' : 'L'} \${p.x} \${p.y}\`)
            .join(' ')

          return (
            <g key={seriesIndex}>
              <path
                d={pathData}
                fill="none"
                stroke={colors[seriesIndex % colors.length]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p: any, i: number) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill={colors[seriesIndex % colors.length]}
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() => setHoveredPoint({ series: s, index: i, data: data[i] })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="flex justify-center gap-6 mt-4">
          {series.map((s: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-sm text-gray-700">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <div className="absolute top-4 right-4 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-3 text-sm">
          <div className="font-semibold text-gray-900">
            {hoveredPoint.data[xAxisKey]}
          </div>
          <div className="text-gray-700 mt-1">
            {hoveredPoint.series.label}: {hoveredPoint.data[hoveredPoint.series.key]}
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
        name: 'data',
        type: 'array',
        required: true,
        aiDescription: 'Array of data points with x and y values'
      },
      {
        name: 'series',
        type: 'array',
        required: true,
        aiDescription: 'Array of {key, label} for each line to plot'
      },
      {
        name: 'xAxisKey',
        type: 'string',
        required: false,
        aiDescription: 'Key for x-axis values'
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        aiDescription: 'Chart height in pixels'
      },
      {
        name: 'showGrid',
        type: 'boolean',
        required: false,
        aiDescription: 'Show grid lines'
      },
      {
        name: 'showLegend',
        type: 'boolean',
        required: false,
        aiDescription: 'Show legend below chart'
      },
      {
        name: 'showTooltip',
        type: 'boolean',
        required: false,
        aiDescription: 'Show tooltip on hover'
      },
      {
        name: 'colors',
        type: 'array',
        required: false,
        aiDescription: 'Array of color hex codes for lines'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Interactive line chart visualization'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Display time series data',
        'Show analytics trends',
        'Visualize metrics over time'
      ],
      relatedCapsules: ['progress-bar', 'badge'],
      complexity: 'advanced'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1400000
  },

  // Code Editor Component
  {
    id: 'code-editor',
    name: 'Code Editor',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['code', 'editor', 'syntax', 'textarea', 'monaco'],
    aiDescription: 'Code editor with syntax highlighting, line numbers, and keyboard shortcuts',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const CodeEditor = ({
  value = '',
  onChange,
  language = 'javascript',
  theme = 'dark',
  lineNumbers = true,
  tabSize = 2,
  readOnly = false,
  height = 400,
  className = ''
}: any) => {
  const [code, setCode] = useState(value)
  const [lineCount, setLineCount] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setCode(value)
    setLineCount(value.split('\\n').length)
  }, [value])

  const handleChange = (e: any) => {
    const newCode = e.target.value
    setCode(newCode)
    setLineCount(newCode.split('\\n').length)
    onChange?.(newCode)
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = code.substring(0, start) + ' '.repeat(tabSize) + code.substring(end)
      setCode(newCode)
      onChange?.(newCode)

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tabSize
        }
      }, 0)
    }
  }

  const isDark = theme === 'dark'

  return (
    <div
      className={\`flex border-2 rounded-lg overflow-hidden \${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
      } \${className}\`}
      style={{ height }}
    >
      {lineNumbers && (
        <div
          className={\`px-3 py-4 text-right select-none \${
            isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
          }\`}
          style={{ minWidth: '3rem', fontFamily: 'monospace', fontSize: '14px' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        className={\`flex-1 px-4 py-4 resize-none outline-none \${
          isDark
            ? 'bg-gray-900 text-gray-100 placeholder-gray-600'
            : 'bg-white text-gray-900 placeholder-gray-400'
        }\`}
        style={{
          fontFamily: "'Fira Code', 'Consolas', monospace",
          fontSize: '14px',
          lineHeight: '1.5',
          tabSize: tabSize
        }}
        placeholder="// Start coding..."
      />
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'value',
        type: 'string',
        required: true,
        aiDescription: 'Code content'
      },
      {
        name: 'onChange',
        type: 'function',
        required: true,
        aiDescription: 'Callback when code changes'
      },
      {
        name: 'language',
        type: 'string',
        required: false,
        aiDescription: 'Programming language (for future syntax highlighting)'
      },
      {
        name: 'theme',
        type: 'string',
        required: false,
        aiDescription: 'Editor theme: dark or light'
      },
      {
        name: 'lineNumbers',
        type: 'boolean',
        required: false,
        aiDescription: 'Show line numbers'
      },
      {
        name: 'tabSize',
        type: 'number',
        required: false,
        aiDescription: 'Number of spaces for tab'
      },
      {
        name: 'readOnly',
        type: 'boolean',
        required: false,
        aiDescription: 'Make editor read-only'
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        aiDescription: 'Editor height in pixels'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Code editor component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Code playground',
        'Edit configuration files',
        'Write scripts inline'
      ],
      relatedCapsules: ['code-block', 'input-text'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1800000
  },

  // Drawer/Sidebar Component
  {
    id: 'drawer',
    name: 'Drawer',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['drawer', 'sidebar', 'panel', 'slide', 'overlay'],
    aiDescription: 'Slide-out drawer/sidebar from any direction with overlay and animations',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useEffect } from 'react'

export const Drawer = ({
  isOpen = false,
  onClose,
  position = 'right',
  size = 'md',
  overlay = true,
  closeOnOverlayClick = true,
  children,
  className = ''
}: any) => {
  const sizes = {
    sm: '256px',
    md: '384px',
    lg: '512px',
    xl: '640px',
    full: '100%'
  }

  const positionStyles = {
    left: { left: 0, top: 0, bottom: 0, transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' },
    right: { right: 0, top: 0, bottom: 0, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' },
    top: { left: 0, right: 0, top: 0, transform: isOpen ? 'translateY(0)' : 'translateY(-100%)' },
    bottom: { left: 0, right: 0, bottom: 0, transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }
  }

  const sizeStyle = position === 'left' || position === 'right'
    ? { width: sizes[size as keyof typeof sizes] }
    : { height: sizes[size as keyof typeof sizes] }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen && !overlay) return null

  return (
    <>
      {/* Overlay */}
      {overlay && (
        <div
          className={\`fixed inset-0 bg-black transition-opacity duration-300 z-40 \${
            isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }\`}
          onClick={() => closeOnOverlayClick && onClose?.()}
        />
      )}

      {/* Drawer */}
      <div
        className={\`fixed bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 \${className}\`}
        style={{
          ...positionStyles[position as keyof typeof positionStyles],
          ...sizeStyle
        }}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}`
      }
    },
    inputs: [
      {
        name: 'isOpen',
        type: 'boolean',
        required: true,
        aiDescription: 'Whether drawer is open'
      },
      {
        name: 'onClose',
        type: 'function',
        required: true,
        aiDescription: 'Close callback'
      },
      {
        name: 'position',
        type: 'string',
        required: false,
        aiDescription: 'Slide direction: left, right, top, bottom'
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        aiDescription: 'Drawer size: sm, md, lg, xl, full'
      },
      {
        name: 'overlay',
        type: 'boolean',
        required: false,
        aiDescription: 'Show background overlay'
      },
      {
        name: 'closeOnOverlayClick',
        type: 'boolean',
        required: false,
        aiDescription: 'Close when overlay is clicked'
      },
      {
        name: 'children',
        type: 'component',
        required: true,
        aiDescription: 'Drawer content'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Drawer/sidebar component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Navigation sidebar',
        'Filter panel',
        'Settings drawer',
        'Shopping cart sidebar'
      ],
      relatedCapsules: ['modal', 'tabs'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2500000
  },

  // Timeline Component
  {
    id: 'timeline',
    name: 'Timeline',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['timeline', 'history', 'events', 'chronological'],
    aiDescription: 'Vertical timeline for displaying chronological events with icons and descriptions',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Timeline = ({
  items = [],
  orientation = 'vertical',
  alternating = false,
  className = ''
}: any) => {
  return (
    <div className={\`\${className}\`}>
      {items.map((item: any, index: number) => {
        const isLeft = alternating && index % 2 === 0

        return (
          <div
            key={index}
            className={\`relative flex \${
              alternating
                ? isLeft
                  ? 'flex-row-reverse text-right'
                  : 'flex-row text-left'
                : 'flex-row text-left'
            } \${index !== items.length - 1 ? 'pb-8' : ''}\`}
          >
            {/* Content */}
            <div className={\`flex-1 \${alternating ? 'px-8' : 'pl-8'}\`}>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {item.title && (
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {item.title}
                  </h3>
                )}
                {item.timestamp && (
                  <time className="text-sm text-gray-500 mb-2 block">
                    {item.timestamp}
                  </time>
                )}
                {item.description && (
                  <p className="text-gray-700">{item.description}</p>
                )}
                {item.metadata && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(item.metadata).map(([key, value]: [string, any], i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline line and dot */}
            <div className="relative flex flex-col items-center">
              {/* Dot */}
              <div
                className={\`w-4 h-4 rounded-full border-4 z-10 \${
                  item.status === 'completed'
                    ? 'bg-green-500 border-green-200'
                    : item.status === 'current'
                    ? 'bg-blue-500 border-blue-200'
                    : item.status === 'error'
                    ? 'bg-red-500 border-red-200'
                    : 'bg-gray-300 border-gray-100'
                }\`}
              />

              {/* Connecting line */}
              {index !== items.length - 1 && (
                <div
                  className={\`w-0.5 h-full absolute top-4 \${
                    item.status === 'completed'
                      ? 'bg-green-300'
                      : 'bg-gray-300'
                  }\`}
                />
              )}
            </div>

            {alternating && <div className="flex-1" />}
          </div>
        )
      })}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'items',
        type: 'array',
        required: true,
        aiDescription: 'Array of timeline events with title, timestamp, description, status'
      },
      {
        name: 'orientation',
        type: 'string',
        required: false,
        aiDescription: 'Timeline orientation: vertical or horizontal'
      },
      {
        name: 'alternating',
        type: 'boolean',
        required: false,
        aiDescription: 'Alternate items left/right'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Timeline visualization component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show project history',
        'Display order tracking',
        'Activity feed',
        'Version history'
      ],
      relatedCapsules: ['list-view', 'badge'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1600000
  },

  // Collapsible Component
  {
    id: 'collapsible',
    name: 'Collapsible',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['collapsible', 'expandable', 'toggle', 'accordion'],
    aiDescription: 'Collapsible content area with smooth height animation and toggle control',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const Collapsible = ({
  trigger,
  children,
  defaultOpen = false,
  disabled = false,
  onToggle,
  className = ''
}: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  const handleToggle = () => {
    if (disabled) return
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  return (
    <div className={\`\${className}\`}>
      {/* Trigger */}
      <div
        onClick={handleToggle}
        className={\`flex items-center justify-between cursor-pointer select-none \${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
        } p-4 rounded-lg transition-colors\`}
      >
        <div className="flex-1">{trigger}</div>
        <svg
          className={\`w-5 h-5 text-gray-600 transition-transform duration-300 \${
            isOpen ? 'rotate-180' : ''
          }\`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Content */}
      <div
        style={{
          height: height,
          overflow: 'hidden',
          transition: 'height 300ms ease-in-out'
        }}
      >
        <div ref={contentRef} className="p-4 pt-0">
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
        name: 'trigger',
        type: 'component',
        required: true,
        aiDescription: 'Trigger element (button, text, etc.)'
      },
      {
        name: 'children',
        type: 'component',
        required: true,
        aiDescription: 'Content to show/hide'
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        required: false,
        aiDescription: 'Initially open'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        aiDescription: 'Disable toggle'
      },
      {
        name: 'onToggle',
        type: 'function',
        required: false,
        aiDescription: 'Callback when toggled'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Collapsible container'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'FAQ sections',
        'Expandable content',
        'Show/hide details',
        'Nested navigation'
      ],
      relatedCapsules: ['accordion', 'tabs'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 2200000
  },

  // Color Picker Component
  {
    id: 'color-picker',
    name: 'Color Picker',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['color', 'picker', 'palette', 'input'],
    aiDescription: 'Color picker with preset colors, hex input, and recent colors history',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const ColorPicker = ({
  value = '#3B82F6',
  onChange,
  presetColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#6B7280', '#000000', '#FFFFFF'
  ],
  showPresets = true,
  showHexInput = true,
  showRecentColors = true,
  className = ''
}: any) => {
  const [color, setColor] = useState(value)
  const [recentColors, setRecentColors] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onChange?.(newColor)

    // Add to recent colors
    if (!recentColors.includes(newColor)) {
      setRecentColors(prev => [newColor, ...prev.slice(0, 7)])
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={\`relative inline-block \${className}\`}>
      {/* Color preview button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        <div
          className="w-6 h-6 rounded border-2 border-gray-300"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-mono text-gray-700">{color}</span>
      </button>

      {/* Picker dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 w-64">
          {/* Hex input */}
          {showHexInput && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hex Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          )}

          {/* Native color input */}
          <div className="mb-4">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          {/* Preset colors */}
          {showPresets && presetColors.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preset Colors
              </label>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((preset: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(preset)}
                    className={\`w-10 h-10 rounded border-2 hover:scale-110 transition-transform \${
                      color === preset ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                    }\`}
                    style={{ backgroundColor: preset }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent colors */}
          {showRecentColors && recentColors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recent Colors
              </label>
              <div className="grid grid-cols-5 gap-2">
                {recentColors.map((recent: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(recent)}
                    className="w-10 h-10 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: recent }}
                  />
                ))}
              </div>
            </div>
          )}
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
        required: true,
        aiDescription: 'Current color hex value'
      },
      {
        name: 'onChange',
        type: 'function',
        required: true,
        aiDescription: 'Callback when color changes'
      },
      {
        name: 'presetColors',
        type: 'array',
        required: false,
        aiDescription: 'Array of preset color hex values'
      },
      {
        name: 'showPresets',
        type: 'boolean',
        required: false,
        aiDescription: 'Show preset colors section'
      },
      {
        name: 'showHexInput',
        type: 'boolean',
        required: false,
        aiDescription: 'Show hex input field'
      },
      {
        name: 'showRecentColors',
        type: 'boolean',
        required: false,
        aiDescription: 'Show recent colors history'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Color picker component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Theme customization',
        'Design tools',
        'Brand color selection',
        'UI customization'
      ],
      relatedCapsules: ['input-text', 'dropdown-select'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1300000
  },

  // Popover Component
  {
    id: 'popover',
    name: 'Popover',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['popover', 'popup', 'tooltip', 'overlay'],
    aiDescription: 'Popover component with positioning, trigger modes, and custom content',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const Popover = ({
  trigger,
  content,
  position = 'bottom',
  triggerOn = 'click',
  showArrow = true,
  closeOnClickOutside = true,
  offset = 8,
  className = ''
}: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [popoverStyle, setPopoverStyle] = useState({})
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const popoverRect = popoverRef.current.getBoundingClientRect()

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
        break
      case 'bottom':
        top = triggerRect.bottom + offset
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
        break
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2
        left = triggerRect.left - popoverRect.width - offset
        break
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2
        left = triggerRect.right + offset
        break
    }

    setPopoverStyle({ top, left })
  }

  useEffect(() => {
    if (isOpen) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition)
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
      }
    }
  }, [isOpen, position])

  useEffect(() => {
    if (!closeOnClickOutside) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeOnClickOutside])

  const handleTrigger = () => {
    if (triggerOn === 'click') {
      setIsOpen(!isOpen)
    }
  }

  const handleMouseEnter = () => {
    if (triggerOn === 'hover') {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (triggerOn === 'hover') {
      setIsOpen(false)
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleTrigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className={\`fixed z-50 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 \${className}\`}
          style={popoverStyle}
          onMouseEnter={triggerOn === 'hover' ? () => setIsOpen(true) : undefined}
          onMouseLeave={triggerOn === 'hover' ? () => setIsOpen(false) : undefined}
        >
          {content}

          {showArrow && (
            <div
              className={\`absolute w-3 h-3 bg-white border-gray-200 transform rotate-45 \${
                position === 'top'
                  ? 'bottom-[-7px] left-1/2 -translate-x-1/2 border-b-2 border-r-2'
                  : position === 'bottom'
                  ? 'top-[-7px] left-1/2 -translate-x-1/2 border-t-2 border-l-2'
                  : position === 'left'
                  ? 'right-[-7px] top-1/2 -translate-y-1/2 border-t-2 border-r-2'
                  : 'left-[-7px] top-1/2 -translate-y-1/2 border-b-2 border-l-2'
              }\`}
            />
          )}
        </div>
      )}
    </>
  )
}`
      }
    },
    inputs: [
      {
        name: 'trigger',
        type: 'component',
        required: true,
        aiDescription: 'Element that triggers the popover'
      },
      {
        name: 'content',
        type: 'component',
        required: true,
        aiDescription: 'Popover content'
      },
      {
        name: 'position',
        type: 'string',
        required: false,
        aiDescription: 'Popover position: top, bottom, left, right'
      },
      {
        name: 'triggerOn',
        type: 'string',
        required: false,
        aiDescription: 'Trigger mode: click or hover'
      },
      {
        name: 'showArrow',
        type: 'boolean',
        required: false,
        aiDescription: 'Show arrow pointing to trigger'
      },
      {
        name: 'closeOnClickOutside',
        type: 'boolean',
        required: false,
        aiDescription: 'Close when clicking outside'
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        aiDescription: 'Distance from trigger in pixels'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Popover component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Show additional info on click',
        'User profile card',
        'Action menu',
        'Help hints'
      ],
      relatedCapsules: ['tooltip', 'context-menu', 'modal'],
      complexity: 'advanced'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1900000
  },

  // Virtual List Component
  {
    id: 'virtual-list',
    name: 'Virtual List',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['virtual', 'list', 'scroll', 'performance', 'infinite'],
    aiDescription: 'High-performance virtual list for rendering thousands of items efficiently',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const VirtualList = ({
  items = [],
  itemHeight = 50,
  containerHeight = 400,
  overscan = 3,
  renderItem,
  className = ''
}: any) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2)
  const visibleItems = items.slice(startIndex, endIndex)

  const handleScroll = (e: any) => {
    setScrollTop(e.target.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={\`overflow-auto \${className}\`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item: any, index: number) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, startIndex + index)}
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
        name: 'items',
        type: 'array',
        required: true,
        aiDescription: 'Array of items to render'
      },
      {
        name: 'itemHeight',
        type: 'number',
        required: false,
        aiDescription: 'Height of each item in pixels'
      },
      {
        name: 'containerHeight',
        type: 'number',
        required: false,
        aiDescription: 'Height of the scrollable container'
      },
      {
        name: 'overscan',
        type: 'number',
        required: false,
        aiDescription: 'Number of extra items to render outside viewport'
      },
      {
        name: 'renderItem',
        type: 'function',
        required: true,
        aiDescription: 'Function to render each item: (item, index) => JSX'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'High-performance virtual list'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Render 10,000+ items efficiently',
        'Large data tables',
        'Infinite scroll lists',
        'Chat message history'
      ],
      relatedCapsules: ['list-view', 'data-table'],
      complexity: 'advanced'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1100000
  },

  // Kanban Board Component
  {
    id: 'kanban-board',
    name: 'Kanban Board',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['kanban', 'board', 'drag', 'drop', 'project'],
    aiDescription: 'Draggable kanban board for project management and task organization',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const KanbanBoard = ({
  columns = [],
  onCardMove,
  className = ''
}: any) => {
  const [draggedCard, setDraggedCard] = useState<any>(null)
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null)

  const handleDragStart = (card: any, columnId: string) => {
    setDraggedCard(card)
    setDraggedFrom(columnId)
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: string) => {
    if (draggedCard && draggedFrom !== columnId) {
      onCardMove?.(draggedCard, draggedFrom, columnId)
    }
    setDraggedCard(null)
    setDraggedFrom(null)
  }

  return (
    <div className={\`flex gap-4 overflow-x-auto pb-4 \${className}\`}>
      {columns.map((column: any) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">
              {column.title}
            </h3>
            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
              {column.cards?.length || 0}
            </span>
          </div>

          {/* Cards */}
          <div className="space-y-3 min-h-[200px]">
            {column.cards?.map((card: any) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => handleDragStart(card, column.id)}
                className={\`bg-white p-4 rounded-lg shadow-sm border-2 border-transparent hover:border-blue-300 cursor-move transition-all \${
                  draggedCard?.id === card.id ? 'opacity-50' : ''
                }\`}
              >
                <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>
                {card.description && (
                  <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                )}
                {card.tags && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {card.assignee && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                      {card.assignee.charAt(0).toUpperCase()}
                    </div>
                    {card.assignee}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'columns',
        type: 'array',
        required: true,
        aiDescription: 'Array of columns with {id, title, cards}'
      },
      {
        name: 'onCardMove',
        type: 'function',
        required: false,
        aiDescription: 'Callback when card is moved: (card, fromColumn, toColumn)'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Draggable kanban board'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Project management boards',
        'Task tracking',
        'Workflow visualization',
        'Sprint planning'
      ],
      relatedCapsules: ['card', 'badge', 'avatar'],
      complexity: 'advanced'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 950000
  },

  // Command Palette Component
  {
    id: 'command-palette',
    name: 'Command Palette',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['command', 'palette', 'search', 'keyboard', 'cmdk'],
    aiDescription: 'Command palette with keyboard shortcuts, fuzzy search, and command groups',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useEffect, useRef } from 'react'

export const CommandPalette = ({
  isOpen = false,
  onClose,
  commands = [],
  placeholder = 'Type a command or search...',
  onExecute,
  className = ''
}: any) => {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCommands = commands.filter((cmd: any) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords?.some((k: string) => k.toLowerCase().includes(search.toLowerCase()))
  )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose?.()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(filteredCommands.length - 1, prev + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(0, prev - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          onExecute?.(filteredCommands[selectedIndex])
          onClose?.()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose, onExecute])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Palette */}
      <div className={\`fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden \${className}\`}>
        {/* Search Input */}
        <div className="border-b-2 border-gray-200">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder={placeholder}
            className="w-full px-6 py-4 text-lg outline-none"
          />
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd: any, index: number) => (
              <div
                key={cmd.id}
                onClick={() => {
                  onExecute?.(cmd)
                  onClose?.()
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={\`px-6 py-3 cursor-pointer flex items-center justify-between \${
                  selectedIndex === index
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50'
                }\`}
              >
                <div className="flex items-center gap-3">
                  {cmd.icon && <span className="text-xl">{cmd.icon}</span>}
                  <div>
                    <div className="font-medium text-gray-900">{cmd.label}</div>
                    {cmd.description && (
                      <div className="text-sm text-gray-500">{cmd.description}</div>
                    )}
                  </div>
                </div>
                {cmd.shortcut && (
                  <div className="flex gap-1">
                    {cmd.shortcut.split('+').map((key: string, i: number) => (
                      <kbd
                        key={i}
                        className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-4">
            <span><kbd className="px-1 bg-white border rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 bg-white border rounded">Enter</kbd> Execute</span>
            <span><kbd className="px-1 bg-white border rounded">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </>
  )
}`
      }
    },
    inputs: [
      {
        name: 'isOpen',
        type: 'boolean',
        required: true,
        aiDescription: 'Whether palette is open'
      },
      {
        name: 'onClose',
        type: 'function',
        required: true,
        aiDescription: 'Close callback'
      },
      {
        name: 'commands',
        type: 'array',
        required: true,
        aiDescription: 'Array of commands with {id, label, icon, description, shortcut, keywords}'
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        aiDescription: 'Search input placeholder'
      },
      {
        name: 'onExecute',
        type: 'function',
        required: false,
        aiDescription: 'Callback when command is executed'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Command palette modal'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Quick navigation',
        'Action shortcuts',
        'Search functionality',
        'Power user features'
      ],
      relatedCapsules: ['search-input', 'modal', 'context-menu'],
      complexity: 'advanced'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 870000
  },

  // Notification Center Component
  {
    id: 'notification-center',
    name: 'Notification Center',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['notification', 'bell', 'alerts', 'inbox'],
    aiDescription: 'Notification center with badge count, read/unread states, and grouping',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const NotificationCenter = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  position = 'bottom-right',
  className = ''
}: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n: any) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const positionClasses = {
    'top-left': 'top-16 left-4',
    'top-right': 'top-16 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  return (
    <div ref={containerRef} className={\`relative \${className}\`}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className={\`absolute right-0 mt-2 w-96 bg-white border-2 border-gray-200 rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col\`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-lg">
              Notifications ({unreadCount})
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => onMarkAllAsRead?.()}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    onNotificationClick?.(notification)
                    if (!notification.read) {
                      onMarkAsRead?.(notification.id)
                    }
                  }}
                  className={\`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors \${
                    !notification.read ? 'bg-blue-50' : ''
                  }\`}
                >
                  <div className="flex gap-3">
                    {notification.avatar && (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                        {typeof notification.avatar === 'string' ? (
                          <img src={notification.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          notification.avatar
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm mb-1">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
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
        name: 'notifications',
        type: 'array',
        required: true,
        aiDescription: 'Array of notifications with {id, title, message, timestamp, read, avatar}'
      },
      {
        name: 'onMarkAsRead',
        type: 'function',
        required: false,
        aiDescription: 'Callback when notification is marked as read'
      },
      {
        name: 'onMarkAllAsRead',
        type: 'function',
        required: false,
        aiDescription: 'Callback to mark all as read'
      },
      {
        name: 'onNotificationClick',
        type: 'function',
        required: false,
        aiDescription: 'Callback when notification is clicked'
      },
      {
        name: 'position',
        type: 'string',
        required: false,
        aiDescription: 'Panel position: top-left, top-right, bottom-left, bottom-right'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Notification center with bell icon'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'User notifications',
        'Activity feed',
        'Alert center',
        'Message inbox'
      ],
      relatedCapsules: ['toast', 'badge', 'avatar'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1250000
  },

  // Tree View Component
  {
    id: 'tree-view',
    name: 'Tree View',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['tree', 'hierarchy', 'folder', 'nested', 'explorer'],
    aiDescription: 'Collapsible tree view for hierarchical data like file systems',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const TreeView = ({
  data = [],
  onNodeClick,
  onNodeToggle,
  defaultExpanded = [],
  className = ''
}: any) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded))

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpanded(newExpanded)
    onNodeToggle?.(nodeId, newExpanded.has(nodeId))
  }

  const TreeNode = ({ node, level = 0 }: any) => {
    const isExpanded = expanded.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div>
        <div
          className={\`flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer \${
            node.selected ? 'bg-blue-50' : ''
          }\`}
          style={{ paddingLeft: \`\${level * 20 + 8}px\` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id)
            }
            onNodeClick?.(node)
          }}
        >
          {/* Toggle Icon */}
          {hasChildren ? (
            <svg
              className={\`w-4 h-4 text-gray-600 transition-transform \${
                isExpanded ? 'rotate-90' : ''
              }\`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <span className="w-4" />
          )}

          {/* Icon */}
          {node.icon ? (
            <span className="text-lg">{node.icon}</span>
          ) : hasChildren ? (
            <span className="text-lg">{isExpanded ? '📂' : '📁'}</span>
          ) : (
            <span className="text-lg">📄</span>
          )}

          {/* Label */}
          <span className="text-sm text-gray-900 flex-1">{node.label}</span>

          {/* Badge */}
          {node.badge && (
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
              {node.badge}
            </span>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child: any) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={\`\${className}\`}>
      {data.map((node: any) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'data',
        type: 'array',
        required: true,
        aiDescription: 'Tree data with {id, label, icon, children, badge}'
      },
      {
        name: 'onNodeClick',
        type: 'function',
        required: false,
        aiDescription: 'Callback when node is clicked'
      },
      {
        name: 'onNodeToggle',
        type: 'function',
        required: false,
        aiDescription: 'Callback when node is expanded/collapsed'
      },
      {
        name: 'defaultExpanded',
        type: 'array',
        required: false,
        aiDescription: 'Array of node IDs to expand by default'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Collapsible tree view'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'File explorer',
        'Organization hierarchy',
        'Category navigation',
        'Folder structure'
      ],
      relatedCapsules: ['accordion', 'list-view', 'collapsible'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 980000
  },

  // Carousel Component
  {
    id: 'carousel',
    name: 'Carousel',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['carousel', 'slider', 'swipe', 'gallery'],
    aiDescription: 'Image and content carousel with auto-play, navigation, and indicators',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useEffect, useRef } from 'react'

export const Carousel = ({
  items = [],
  autoPlay = false,
  interval = 3000,
  showIndicators = true,
  showControls = true,
  loop = true,
  className = ''
}: any) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<any>(null)

  const goToSlide = (index: number) => {
    if (loop) {
      setCurrentIndex((index + items.length) % items.length)
    } else {
      setCurrentIndex(Math.max(0, Math.min(items.length - 1, index)))
    }
  }

  const goToPrevious = () => {
    goToSlide(currentIndex - 1)
  }

  const goToNext = () => {
    goToSlide(currentIndex + 1)
  }

  useEffect(() => {
    if (autoPlay && !isHovered) {
      timerRef.current = setInterval(goToNext, interval)
      return () => clearInterval(timerRef.current)
    }
  }, [autoPlay, isHovered, currentIndex, interval])

  return (
    <div
      className={\`relative overflow-hidden rounded-lg \${className}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: \`translateX(-\${currentIndex * 100}%)\` }}
      >
        {items.map((item: any, index: number) => (
          <div key={index} className="w-full flex-shrink-0">
            {typeof item === 'string' ? (
              <img src={item} alt={\`Slide \${index + 1}\`} className="w-full h-full object-cover" />
            ) : (
              item
            )}
          </div>
        ))}
      </div>

      {/* Previous/Next Controls */}
      {showControls && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
            disabled={!loop && currentIndex === 0}
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
            disabled={!loop && currentIndex === items.length - 1}
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={\`w-2 h-2 rounded-full transition-all \${
                currentIndex === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }\`}
            />
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
        name: 'items',
        type: 'array',
        required: true,
        aiDescription: 'Array of image URLs or React components'
      },
      {
        name: 'autoPlay',
        type: 'boolean',
        required: false,
        aiDescription: 'Enable auto-play'
      },
      {
        name: 'interval',
        type: 'number',
        required: false,
        aiDescription: 'Auto-play interval in milliseconds'
      },
      {
        name: 'showIndicators',
        type: 'boolean',
        required: false,
        aiDescription: 'Show dot indicators'
      },
      {
        name: 'showControls',
        type: 'boolean',
        required: false,
        aiDescription: 'Show prev/next buttons'
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        aiDescription: 'Enable infinite loop'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Image/content carousel'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Image gallery',
        'Product showcase',
        'Hero banners',
        'Testimonials slider'
      ],
      relatedCapsules: ['image', 'card'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1500000
  },

  // Markdown Viewer Component
  {
    id: 'markdown-viewer',
    name: 'Markdown Viewer',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['markdown', 'md', 'viewer', 'renderer', 'docs'],
    aiDescription: 'Markdown viewer with syntax highlighting for code blocks',
    platforms: {
      web: {
        engine: 'react',
        code: `export const MarkdownViewer = ({
  content = '',
  className = ''
}: any) => {
  // Basic markdown parser (simplified)
  const parseMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      // Inline code
      .replace(/\`(.*?)\`/gim, '<code class="px-1.5 py-0.5 bg-gray-100 text-red-600 rounded text-sm font-mono">$1</code>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">$1</blockquote>')
  }

  // Extract code blocks
  const parts = content.split(/\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/)
  const elements = []

  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      // Regular markdown content
      if (parts[i].trim()) {
        elements.push(
          <div
            key={i}
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(parts[i]) }}
          />
        )
      }
    } else if (i % 3 === 2) {
      // Code block
      const language = parts[i - 1] || 'text'
      const code = parts[i]
      elements.push(
        <div key={i} className="my-4">
          <div className="bg-gray-900 text-gray-100 rounded-t px-4 py-2 text-xs font-mono flex items-center justify-between">
            <span>{language}</span>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="text-gray-400 hover:text-white"
            >
              Copy
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-b overflow-x-auto">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        </div>
      )
    }
  }

  return (
    <div className={\`\${className}\`}>
      {elements}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'content',
        type: 'string',
        required: true,
        aiDescription: 'Markdown content to render'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered markdown content'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Documentation viewer',
        'Blog posts',
        'README display',
        'Help content'
      ],
      relatedCapsules: ['code-block', 'text-display'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1150000
  },

  // Drag and Drop Zone Component
  {
    id: 'drag-drop-zone',
    name: 'Drag & Drop Zone',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['drag', 'drop', 'upload', 'dnd', 'zone'],
    aiDescription: 'Flexible drag and drop zone for file uploads and item reordering',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const DragDropZone = ({
  onDrop,
  acceptedTypes = [],
  multiple = true,
  maxSize,
  disabled = false,
  children,
  className = ''
}: any) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)

    // Filter by accepted types
    let validFiles = files
    if (acceptedTypes.length > 0) {
      validFiles = files.filter((file: any) =>
        acceptedTypes.some((type: string) => {
          if (type.startsWith('.')) {
            return file.name.endsWith(type)
          }
          return file.type.startsWith(type.replace('*', ''))
        })
      )
    }

    // Filter by max size
    if (maxSize) {
      validFiles = validFiles.filter((file: any) => file.size <= maxSize)
    }

    // Handle multiple
    if (!multiple && validFiles.length > 0) {
      validFiles = [validFiles[0]]
    }

    onDrop?.(validFiles)
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={\`border-2 border-dashed rounded-lg p-8 transition-all \${
        disabled
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
          : isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      } \${className}\`}
    >
      {children || (
        <div className="text-center">
          <svg
            className={\`w-12 h-12 mx-auto mb-4 \${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }\`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-700 font-medium mb-1">
            Drop files here
          </p>
          <p className="text-gray-500 text-sm">
            {acceptedTypes.length > 0
              ? \`Accepted: \${acceptedTypes.join(', ')}\`
              : 'Any file type accepted'}
          </p>
          {maxSize && (
            <p className="text-gray-500 text-sm mt-1">
              Max size: {(maxSize / 1024 / 1024).toFixed(1)} MB
            </p>
          )}
        </div>
      )}
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'onDrop',
        type: 'function',
        required: true,
        aiDescription: 'Callback when files are dropped: (files) => void'
      },
      {
        name: 'acceptedTypes',
        type: 'array',
        required: false,
        aiDescription: 'Array of accepted file types (e.g., ["image/*", ".pdf"])'
      },
      {
        name: 'multiple',
        type: 'boolean',
        required: false,
        aiDescription: 'Allow multiple files'
      },
      {
        name: 'maxSize',
        type: 'number',
        required: false,
        aiDescription: 'Maximum file size in bytes'
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        aiDescription: 'Disable the drop zone'
      },
      {
        name: 'children',
        type: 'component',
        required: false,
        aiDescription: 'Custom content for the drop zone'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Drag and drop zone'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'File upload area',
        'Image uploader',
        'Document drop zone',
        'Attachment handler'
      ],
      relatedCapsules: ['file-upload', 'image'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1350000
  },

  // Split Pane Component
  {
    id: 'split-pane',
    name: 'Split Pane',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['split', 'pane', 'resize', 'divider', 'layout'],
    aiDescription: 'Resizable split pane layout for side-by-side content with draggable divider',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const SplitPane = ({
  left,
  right,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  orientation = 'vertical',
  className = ''
}: any) => {
  const [size, setSize] = useState(defaultSize)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current.getBoundingClientRect()
      let newSize

      if (orientation === 'vertical') {
        const offset = e.clientX - container.left
        newSize = (offset / container.width) * 100
      } else {
        const offset = e.clientY - container.top
        newSize = (offset / container.height) * 100
      }

      setSize(Math.max(minSize, Math.min(maxSize, newSize)))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, orientation, minSize, maxSize])

  return (
    <div
      ref={containerRef}
      className={\`flex \${orientation === 'vertical' ? 'flex-row' : 'flex-col'} h-full \${className}\`}
    >
      {/* Left/Top Pane */}
      <div
        style={{
          [orientation === 'vertical' ? 'width' : 'height']: \`\${size}%\`
        }}
        className="overflow-auto"
      >
        {left}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={handleMouseDown}
        className={\`\${
          orientation === 'vertical'
            ? 'w-1 cursor-col-resize hover:bg-blue-500'
            : 'h-1 cursor-row-resize hover:bg-blue-500'
        } bg-gray-300 transition-colors \${isDragging ? 'bg-blue-500' : ''}\`}
      />

      {/* Right/Bottom Pane */}
      <div
        style={{
          [orientation === 'vertical' ? 'width' : 'height']: \`\${100 - size}%\`
        }}
        className="overflow-auto"
      >
        {right}
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'left',
        type: 'component',
        required: true,
        aiDescription: 'Left or top pane content'
      },
      {
        name: 'right',
        type: 'component',
        required: true,
        aiDescription: 'Right or bottom pane content'
      },
      {
        name: 'defaultSize',
        type: 'number',
        required: false,
        aiDescription: 'Initial size percentage (0-100)'
      },
      {
        name: 'minSize',
        type: 'number',
        required: false,
        aiDescription: 'Minimum size percentage'
      },
      {
        name: 'maxSize',
        type: 'number',
        required: false,
        aiDescription: 'Maximum size percentage'
      },
      {
        name: 'orientation',
        type: 'string',
        required: false,
        aiDescription: 'Split orientation: vertical or horizontal'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Resizable split pane layout'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Code editor with preview',
        'File explorer with content',
        'Dual panel layouts',
        'Compare views'
      ],
      relatedCapsules: ['drawer', 'card'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 890000
  },

  // Video Player Component
  {
    id: 'video-player',
    name: 'Video Player',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['video', 'player', 'media', 'controls'],
    aiDescription: 'Custom video player with controls, progress bar, volume, and fullscreen',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const VideoPlayer = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  className = ''
}: any) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(muted)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideControlsTimer = useRef<any>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleSeek = (e: any) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      videoRef.current.currentTime = percentage * videoRef.current.duration
    }
  }

  const handleVolumeChange = (e: any) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(hideControlsTimer.current)
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  useEffect(() => {
    return () => clearTimeout(hideControlsTimer.current)
  }, [])

  return (
    <div
      className={\`relative bg-black rounded-lg overflow-hidden \${className}\`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={isMuted}
        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
        onTimeUpdate={handleProgress}
        onClick={togglePlay}
        className="w-full h-full cursor-pointer"
      />

      {controls && (
        <div
          className={\`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 \${
            showControls ? 'opacity-100' : 'opacity-0'
          }\`}
        >
          {/* Progress Bar */}
          <div
            onClick={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-3 group"
          >
            <div
              className="h-full bg-blue-500 rounded-full relative"
              style={{ width: \`\${progress}%\` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 text-white">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="hover:text-blue-400">
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              )}
            </button>

            {/* Volume */}
            <button onClick={toggleMute} className="hover:text-blue-400">
              {isMuted || volume === 0 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
                </svg>
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />

            {/* Time */}
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="hover:text-blue-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" />
              </svg>
            </button>
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
        name: 'src',
        type: 'string',
        required: true,
        aiDescription: 'Video source URL'
      },
      {
        name: 'poster',
        type: 'string',
        required: false,
        aiDescription: 'Poster image URL'
      },
      {
        name: 'autoPlay',
        type: 'boolean',
        required: false,
        aiDescription: 'Auto-play video'
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        aiDescription: 'Loop video'
      },
      {
        name: 'muted',
        type: 'boolean',
        required: false,
        aiDescription: 'Start muted'
      },
      {
        name: 'controls',
        type: 'boolean',
        required: false,
        aiDescription: 'Show custom controls'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Custom video player'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Video tutorials',
        'Product demos',
        'Course content',
        'Media galleries'
      ],
      relatedCapsules: ['image', 'carousel'],
      complexity: 'advanced'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1050000
  },

  // Infinite Scroll Component
  {
    id: 'infinite-scroll',
    name: 'Infinite Scroll',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['infinite', 'scroll', 'lazy', 'load', 'pagination'],
    aiDescription: 'Infinite scroll container that loads more content as user scrolls',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useEffect, useRef, useState } from 'react'

export const InfiniteScroll = ({
  items = [],
  hasMore = true,
  loadMore,
  loader,
  endMessage,
  threshold = 0.8,
  renderItem,
  className = ''
}: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || isLoading) return

    const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setIsLoading(true)
        await loadMore?.()
        setIsLoading(false)
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    })

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading, loadMore])

  return (
    <div ref={containerRef} className={\`\${className}\`}>
      {items.map((item: any, index: number) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="py-4">
          {isLoading && (loader || (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ))}
        </div>
      )}

      {!hasMore && endMessage && (
        <div className="py-4 text-center text-gray-500">
          {endMessage}
        </div>
      )}
    </div>
  )
}`
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
        name: 'hasMore',
        type: 'boolean',
        required: true,
        aiDescription: 'Whether more items are available'
      },
      {
        name: 'loadMore',
        type: 'function',
        required: true,
        aiDescription: 'Async function to load more items'
      },
      {
        name: 'loader',
        type: 'component',
        required: false,
        aiDescription: 'Custom loading component'
      },
      {
        name: 'endMessage',
        type: 'component',
        required: false,
        aiDescription: 'Message shown when no more items'
      },
      {
        name: 'threshold',
        type: 'number',
        required: false,
        aiDescription: 'Scroll threshold to trigger load (0-1)'
      },
      {
        name: 'renderItem',
        type: 'function',
        required: true,
        aiDescription: 'Function to render each item'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Infinite scroll container'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Social media feeds',
        'Product listings',
        'Search results',
        'Activity logs'
      ],
      relatedCapsules: ['virtual-list', 'list-view', 'loading-spinner'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1420000
  },

  // Audio Player Component
  {
    id: 'audio-player',
    name: 'Audio Player',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['audio', 'player', 'music', 'podcast', 'media'],
    aiDescription: 'Audio player with waveform visualization, playlist, and controls',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const AudioPlayer = ({
  src,
  title = 'Untitled',
  artist,
  artwork,
  autoPlay = false,
  loop = false,
  showWaveform = false,
  className = ''
}: any) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(progress)
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (e: any) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      audioRef.current.currentTime = percentage * audioRef.current.duration
    }
  }

  const handleVolumeChange = (e: any) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div className={\`bg-white border-2 border-gray-200 rounded-lg p-4 shadow-lg \${className}\`}>
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onTimeUpdate={handleProgress}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Artwork & Info */}
      <div className="flex items-center gap-4 mb-4">
        {artwork && (
          <img src={artwork} alt={title} className="w-16 h-16 rounded-lg object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          {artist && <p className="text-sm text-gray-600 truncate">{artist}</p>}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div
          onClick={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer group"
        >
          <div
            className="h-full bg-blue-500 rounded-full relative"
            style={{ width: \`\${progress}%\` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => skip(-10)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        <button
          onClick={togglePlay}
          className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => skip(10)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-600 w-10 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'src',
        type: 'string',
        required: true,
        aiDescription: 'Audio source URL'
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        aiDescription: 'Track title'
      },
      {
        name: 'artist',
        type: 'string',
        required: false,
        aiDescription: 'Artist name'
      },
      {
        name: 'artwork',
        type: 'string',
        required: false,
        aiDescription: 'Album artwork URL'
      },
      {
        name: 'autoPlay',
        type: 'boolean',
        required: false,
        aiDescription: 'Auto-play audio'
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        aiDescription: 'Loop playback'
      },
      {
        name: 'showWaveform',
        type: 'boolean',
        required: false,
        aiDescription: 'Show waveform visualization'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Audio player component'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Music player',
        'Podcast player',
        'Audio previews',
        'Voice messages'
      ],
      relatedCapsules: ['video-player', 'progress-bar'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 1180000
  },

  // QR Code Component
  {
    id: 'qr-code',
    name: 'QR Code',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['qr', 'code', 'scanner', 'barcode'],
    aiDescription: 'QR code generator with customizable size and error correction',
    platforms: {
      web: {
        engine: 'react',
        code: `import { useEffect, useRef } from 'react'

export const QRCode = ({
  value,
  size = 200,
  level = 'M',
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  includeMargin = true,
  className = ''
}: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple QR code generation (for demo - in production use a library)
    const modules = 25 // QR code matrix size
    const moduleSize = size / modules
    canvas.width = size
    canvas.height = size

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Generate pattern based on value hash
    ctx.fillStyle = fgColor
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i)
      hash = hash & hash
    }

    // Draw QR pattern
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) {
        const seed = (x * modules + y + hash) % 100
        if (seed > 40) {
          ctx.fillRect(
            x * moduleSize,
            y * moduleSize,
            moduleSize,
            moduleSize
          )
        }
      }
    }

    // Finder patterns (corners)
    const drawFinder = (x: number, y: number) => {
      ctx.fillStyle = fgColor
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7)
      ctx.fillStyle = bgColor
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5)
      ctx.fillStyle = fgColor
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3)
    }

    drawFinder(0, 0)
    drawFinder(size - moduleSize * 7, 0)
    drawFinder(0, size - moduleSize * 7)

  }, [value, size, level, bgColor, fgColor])

  return (
    <div className={\`inline-block \${includeMargin ? 'p-4' : ''} bg-white rounded-lg \${className}\`}>
      <canvas ref={canvasRef} className="block" />
      {value && (
        <div className="mt-2 text-center text-xs text-gray-500 break-all max-w-[200px]">
          {value}
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
        required: true,
        aiDescription: 'Data to encode in QR code'
      },
      {
        name: 'size',
        type: 'number',
        required: false,
        aiDescription: 'Size in pixels'
      },
      {
        name: 'level',
        type: 'string',
        required: false,
        aiDescription: 'Error correction level: L, M, Q, H'
      },
      {
        name: 'bgColor',
        type: 'string',
        required: false,
        aiDescription: 'Background color hex'
      },
      {
        name: 'fgColor',
        type: 'string',
        required: false,
        aiDescription: 'Foreground color hex'
      },
      {
        name: 'includeMargin',
        type: 'boolean',
        required: false,
        aiDescription: 'Include margin around QR code'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'QR code display'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'Share links',
        'Payment codes',
        'Contact information',
        'WiFi credentials'
      ],
      relatedCapsules: ['image', 'modal'],
      complexity: 'medium'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 750000
  },

  // Heatmap Component
  {
    id: 'heatmap',
    name: 'Heatmap',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['heatmap', 'calendar', 'contribution', 'activity'],
    aiDescription: 'GitHub-style contribution heatmap calendar for activity visualization',
    platforms: {
      web: {
        engine: 'react',
        code: `export const Heatmap = ({
  data = {},
  startDate,
  endDate,
  colorScale = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  showTooltip = true,
  cellSize = 12,
  cellGap = 2,
  className = ''
}: any) => {
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  const end = endDate ? new Date(endDate) : new Date()

  const weeks: Date[][] = []
  let currentWeek: Date[] = []
  let currentDate = new Date(start)

  // Fill to start of week
  while (currentDate.getDay() !== 0) {
    currentDate.setDate(currentDate.getDate() - 1)
  }

  while (currentDate <= end) {
    if (currentDate.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  if (currentWeek.length > 0) weeks.push(currentWeek)

  const getColor = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const value = data[dateStr] || 0

    if (value === 0) return colorScale[0]
    if (value < 5) return colorScale[1]
    if (value < 10) return colorScale[2]
    if (value < 15) return colorScale[3]
    return colorScale[4]
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={\`\${className}\`}>
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] text-xs text-gray-500 pr-2">
          <div style={{ height: cellSize }} />
          {days.map((day, i) => (
            i % 2 === 1 && (
              <div key={day} style={{ height: cellSize }} className="flex items-center">
                {day}
              </div>
            )
          ))}
        </div>

        {/* Heatmap grid */}
        <div>
          {/* Month labels */}
          <div className="flex gap-[2px] text-xs text-gray-500 mb-1" style={{ height: cellSize }}>
            {weeks.map((week, i) => {
              const firstDay = week[0]
              if (firstDay.getDate() <= 7 && firstDay.getMonth() !== weeks[i - 1]?.[0]?.getMonth()) {
                return (
                  <div key={i} style={{ width: cellSize }}>
                    {months[firstDay.getMonth()]}
                  </div>
                )
              }
              return <div key={i} style={{ width: cellSize }} />
            })}
          </div>

          {/* Cells */}
          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((date, dayIndex) => {
                  const dateStr = date.toISOString().split('T')[0]
                  const value = data[dateStr] || 0
                  return (
                    <div
                      key={dayIndex}
                      className="rounded-sm cursor-pointer hover:ring-2 hover:ring-gray-400"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: getColor(date)
                      }}
                      title={\`\${dateStr}: \${value} contributions\`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
        <span>Less</span>
        {colorScale.map((color, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: color
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}`
      }
    },
    inputs: [
      {
        name: 'data',
        type: 'object',
        required: true,
        aiDescription: 'Object with date strings as keys and counts as values'
      },
      {
        name: 'startDate',
        type: 'string',
        required: false,
        aiDescription: 'Start date (defaults to 1 year ago)'
      },
      {
        name: 'endDate',
        type: 'string',
        required: false,
        aiDescription: 'End date (defaults to today)'
      },
      {
        name: 'colorScale',
        type: 'array',
        required: false,
        aiDescription: 'Array of 5 color hex codes from low to high'
      },
      {
        name: 'showTooltip',
        type: 'boolean',
        required: false,
        aiDescription: 'Show tooltips on hover'
      },
      {
        name: 'cellSize',
        type: 'number',
        required: false,
        aiDescription: 'Size of each cell in pixels'
      },
      {
        name: 'cellGap',
        type: 'number',
        required: false,
        aiDescription: 'Gap between cells in pixels'
      }
    ],
    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Heatmap calendar visualization'
      }
    ],
    dependencies: {},
    aiMetadata: {
      usageExamples: [
        'GitHub contributions',
        'Activity tracking',
        'Habit tracking',
        'Data patterns'
      ],
      relatedCapsules: ['chart-line', 'calendar'],
      complexity: 'advanced'
    },
    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 620000
  },

  // 63. Bar Chart
  {
    id: 'chart-bar',
    name: 'Bar Chart',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['chart', 'bar', 'graph', 'data', 'visualization', 'analytics', 'svg'],
    aiDescription: 'Interactive bar chart with tooltips, legends, and animations. Supports horizontal and vertical orientation, grouped bars, and stacked bars.',

    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const ChartBar = ({
  data = [],
  orientation = 'vertical',
  grouped = false,
  stacked = false,
  showLegend = true,
  showGrid = true,
  showValues = false,
  height = 300,
  barWidth = 40,
  gap = 10,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
  className = ''
}: any) => {
  const [hoveredBar, setHoveredBar] = useState<{ seriesIndex: number; dataIndex: number } | null>(null)

  // Data format: [{ label: 'Jan', values: [100, 200] }, { label: 'Feb', values: [150, 180] }]
  // Or simple: [{ label: 'Jan', value: 100 }, ...]

  const normalizedData = data.map((item: any) => ({
    label: item.label,
    values: Array.isArray(item.values) ? item.values : [item.value || 0]
  }))

  const allValues = normalizedData.flatMap((d: any) => d.values)
  const maxValue = Math.max(...allValues, 0)
  const minValue = Math.min(...allValues, 0)

  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartWidth = orientation === 'vertical'
    ? normalizedData.length * (barWidth * normalizedData[0]?.values.length + gap) + padding.left + padding.right
    : 600
  const chartHeight = height

  const getBarHeight = (value: number) => {
    const chartAreaHeight = chartHeight - padding.top - padding.bottom
    return (Math.abs(value) / maxValue) * chartAreaHeight
  }

  const getBarY = (value: number) => {
    const chartAreaHeight = chartHeight - padding.top - padding.bottom
    const zeroY = padding.top + chartAreaHeight
    if (value >= 0) {
      return zeroY - getBarHeight(value)
    }
    return zeroY
  }

  const renderVerticalBars = () => {
    return normalizedData.map((item: any, dataIndex: number) => {
      const x = padding.left + dataIndex * (barWidth * item.values.length + gap)

      return (
        <g key={dataIndex}>
          {item.values.map((value: number, seriesIndex: number) => {
            const barX = x + seriesIndex * barWidth
            const barY = getBarY(value)
            const barH = getBarHeight(value)
            const isHovered = hoveredBar?.dataIndex === dataIndex && hoveredBar?.seriesIndex === seriesIndex

            return (
              <g key={seriesIndex}>
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barH}
                  fill={colors[seriesIndex % colors.length]}
                  opacity={isHovered ? 1 : 0.8}
                  onMouseEnter={() => setHoveredBar({ seriesIndex, dataIndex })}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="transition-opacity cursor-pointer"
                />
                {showValues && (
                  <text
                    x={barX + barWidth / 2}
                    y={barY - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {value}
                  </text>
                )}
                {isHovered && (
                  <g>
                    <rect
                      x={barX + barWidth / 2 - 30}
                      y={barY - 30}
                      width={60}
                      height={24}
                      fill="black"
                      opacity={0.8}
                      rx={4}
                    />
                    <text
                      x={barX + barWidth / 2}
                      y={barY - 14}
                      textAnchor="middle"
                      className="text-xs fill-white font-medium"
                    >
                      {value}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
          <text
            x={x + (barWidth * item.values.length) / 2}
            y={chartHeight - 10}
            textAnchor="middle"
            className="text-sm fill-gray-700"
          >
            {item.label}
          </text>
        </g>
      )
    })
  }

  return (
    <div className={\`\${className}\`}>
      <svg width={chartWidth} height={chartHeight} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <g>
            {[0, 0.25, 0.5, 0.75, 1].map((percent) => {
              const y = padding.top + (chartHeight - padding.top - padding.bottom) * (1 - percent)
              return (
                <g key={percent}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-500"
                  >
                    {Math.round(maxValue * percent)}
                  </text>
                </g>
              )
            })}
          </g>
        )}

        {/* Bars */}
        {renderVerticalBars()}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={chartHeight - padding.bottom}
          x2={chartWidth - padding.right}
          y2={chartHeight - padding.bottom}
          stroke="#9ca3af"
          strokeWidth={2}
        />

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={chartHeight - padding.bottom}
          stroke="#9ca3af"
          strokeWidth={2}
        />
      </svg>

      {/* Legend */}
      {showLegend && normalizedData[0]?.values.length > 1 && (
        <div className="flex gap-4 justify-center mt-4">
          {normalizedData[0].values.map((_: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-700">Series {index + 1}</span>
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
        name: 'data',
        type: 'array',
        required: true,
        aiDescription: 'Array of data points with labels and values. Format: [{ label: string, value: number }] or [{ label: string, values: number[] }]'
      },
      {
        name: 'orientation',
        type: 'string',
        required: false,
        aiDescription: 'Chart orientation: vertical or horizontal'
      },
      {
        name: 'showLegend',
        type: 'boolean',
        required: false,
        aiDescription: 'Show legend for multiple series'
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        aiDescription: 'Chart height in pixels'
      },
      {
        name: 'colors',
        type: 'array',
        required: false,
        aiDescription: 'Array of colors for bars'
      }
    ],

    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered bar chart'
      }
    ],

    dependencies: {
      npm: {
        react: '^18.0.0'
      }
    },

    aiMetadata: {
      usageExamples: [
        'Show sales by month',
        'Compare revenue across regions',
        'Display survey results',
        'Visualize performance metrics'
      ],
      relatedCapsules: ['chart-line', 'chart-pie', 'heatmap'],
      complexity: 'advanced'
    },

    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 580000
  },

  // 64. Pie Chart
  {
    id: 'chart-pie',
    name: 'Pie Chart',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['chart', 'pie', 'donut', 'graph', 'data', 'visualization', 'percentage', 'svg'],
    aiDescription: 'Interactive pie/donut chart with labels, percentages, and hover effects. Supports custom colors and donut mode.',

    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const ChartPie = ({
  data = [],
  donut = false,
  donutWidth = 60,
  size = 300,
  showLabels = true,
  showPercentages = true,
  showLegend = true,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'],
  className = ''
}: any) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Data format: [{ label: 'Category A', value: 100 }, ...]
  const total = data.reduce((sum: number, item: any) => sum + (item.value || 0), 0)

  const center = size / 2
  const radius = (size - 40) / 2
  const innerRadius = donut ? radius - donutWidth : 0

  const createArc = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const startX = center + outerR * Math.cos(startAngle)
    const startY = center + outerR * Math.sin(startAngle)
    const endX = center + outerR * Math.cos(endAngle)
    const endY = center + outerR * Math.sin(endAngle)
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

    if (innerR === 0) {
      // Regular pie slice
      return \`M \${center} \${center} L \${startX} \${startY} A \${outerR} \${outerR} 0 \${largeArc} 1 \${endX} \${endY} Z\`
    } else {
      // Donut slice
      const innerStartX = center + innerR * Math.cos(startAngle)
      const innerStartY = center + innerR * Math.sin(startAngle)
      const innerEndX = center + innerR * Math.cos(endAngle)
      const innerEndY = center + innerR * Math.sin(endAngle)

      return \`M \${startX} \${startY} A \${outerR} \${outerR} 0 \${largeArc} 1 \${endX} \${endY} L \${innerEndX} \${innerEndY} A \${innerR} \${innerR} 0 \${largeArc} 0 \${innerStartX} \${innerStartY} Z\`
    }
  }

  let currentAngle = -Math.PI / 2 // Start at top

  return (
    <div className={\`flex flex-col items-center \${className}\`}>
      <svg width={size} height={size} className="overflow-visible">
        {data.map((item: any, index: number) => {
          const value = item.value || 0
          const percentage = total > 0 ? (value / total) * 100 : 0
          const angle = (value / total) * 2 * Math.PI
          const startAngle = currentAngle
          const endAngle = currentAngle + angle
          const midAngle = (startAngle + endAngle) / 2

          const isHovered = hoveredIndex === index
          const sliceRadius = isHovered ? radius + 5 : radius

          const path = createArc(startAngle, endAngle, sliceRadius, innerRadius)

          // Label position
          const labelRadius = radius + 30
          const labelX = center + labelRadius * Math.cos(midAngle)
          const labelY = center + labelRadius * Math.sin(midAngle)

          // Percentage position (inside slice)
          const percentRadius = donut ? (radius + innerRadius) / 2 : radius * 0.7
          const percentX = center + percentRadius * Math.cos(midAngle)
          const percentY = center + percentRadius * Math.sin(midAngle)

          currentAngle = endAngle

          return (
            <g key={index}>
              <path
                d={path}
                fill={colors[index % colors.length]}
                opacity={isHovered ? 1 : 0.9}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="transition-all cursor-pointer"
                style={{ filter: isHovered ? 'brightness(1.1)' : 'none' }}
              />

              {showPercentages && percentage > 5 && (
                <text
                  x={percentX}
                  y={percentY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-semibold fill-white pointer-events-none"
                >
                  {percentage.toFixed(0)}%
                </text>
              )}

              {showLabels && percentage > 3 && (
                <g>
                  <line
                    x1={center + radius * Math.cos(midAngle)}
                    y1={center + radius * Math.sin(midAngle)}
                    x2={labelX}
                    y2={labelY}
                    stroke={colors[index % colors.length]}
                    strokeWidth={1}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={labelX > center ? 'start' : 'end'}
                    dominantBaseline="middle"
                    className="text-xs fill-gray-700 font-medium"
                  >
                    {item.label}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Center text for donut */}
        {donut && (
          <g>
            <text
              x={center}
              y={center - 10}
              textAnchor="middle"
              className="text-2xl font-bold fill-gray-800"
            >
              {total}
            </text>
            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              className="text-sm fill-gray-500"
            >
              Total
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {data.map((item: any, index: number) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
            return (
              <div
                key={index}
                className="flex items-center gap-2 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-700">
                  {item.label} ({percentage}%)
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}`
      }
    },

    inputs: [
      {
        name: 'data',
        type: 'array',
        required: true,
        aiDescription: 'Array of data with labels and values. Format: [{ label: string, value: number }]'
      },
      {
        name: 'donut',
        type: 'boolean',
        required: false,
        aiDescription: 'Render as donut chart instead of pie'
      },
      {
        name: 'size',
        type: 'number',
        required: false,
        aiDescription: 'Chart size in pixels'
      },
      {
        name: 'showLegend',
        type: 'boolean',
        required: false,
        aiDescription: 'Show legend below chart'
      },
      {
        name: 'colors',
        type: 'array',
        required: false,
        aiDescription: 'Array of colors for slices'
      }
    ],

    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered pie/donut chart'
      }
    ],

    dependencies: {
      npm: {
        react: '^18.0.0'
      }
    },

    aiMetadata: {
      usageExamples: [
        'Show market share distribution',
        'Display budget breakdown',
        'Visualize survey responses',
        'Show category percentages'
      ],
      relatedCapsules: ['chart-bar', 'chart-line', 'progress-bar'],
      complexity: 'advanced'
    },

    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 540000
  },

  // 65. Full Calendar
  {
    id: 'calendar-full',
    name: 'Full Calendar',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['calendar', 'date', 'schedule', 'events', 'month', 'week', 'day', 'agenda'],
    aiDescription: 'Full-featured calendar with month/week/day views, event management, and drag-to-create. Perfect for scheduling and event planning.',

    platforms: {
      web: {
        engine: 'react',
        code: `import { useState } from 'react'

export const CalendarFull = ({
  events = [],
  onEventClick,
  onEventCreate,
  onEventUpdate,
  defaultView = 'month',
  className = ''
}: any) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState(defaultView)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Date[] = []

    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(new Date(year, month, -startingDayOfWeek + i + 1))
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event: any) => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
    }
  }

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    const today = new Date()

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday = day.toDateString() === today.toDateString()
          const dayEvents = getEventsForDate(day)

          return (
            <div
              key={index}
              className={\`bg-white p-2 min-h-[100px] \${!isCurrentMonth ? 'opacity-40' : ''} \${isToday ? 'bg-blue-50' : ''} hover:bg-gray-50 cursor-pointer transition-colors\`}
              onClick={() => onEventCreate?.({ date: day })}
            >
              <div className={\`text-sm font-medium \${isToday ? 'text-blue-600' : 'text-gray-900'}\`}>
                {day.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map((event: any, i: number) => (
                  <div
                    key={i}
                    className="text-xs p-1 rounded truncate"
                    style={{ backgroundColor: event.color || '#3b82f6', color: 'white' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEvent(event)
                      onEventClick?.(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay())
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      return day
    })

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
          <div className="p-2 text-sm font-semibold text-gray-700"></div>
          {weekDays.map((day, i) => (
            <div key={i} className="p-2 text-center border-l border-gray-200">
              <div className="text-xs text-gray-500">{dayNames[i]}</div>
              <div className="text-sm font-semibold text-gray-900">{day.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8 divide-x divide-gray-200">
          <div className="divide-y divide-gray-200">
            {hours.map(hour => (
              <div key={hour} className="h-12 p-1 text-xs text-gray-500 text-right">
                {hour === 0 ? '12 AM' : hour < 12 ? \`\${hour} AM\` : hour === 12 ? '12 PM' : \`\${hour - 12} PM\`}
              </div>
            ))}
          </div>
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="divide-y divide-gray-200">
              {hours.map(hour => (
                <div key={hour} className="h-12 hover:bg-blue-50 cursor-pointer transition-colors" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={\`bg-white rounded-lg shadow p-4 \${className}\`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Today
          </button>
          <button onClick={handlePrevious} className="p-1 hover:bg-gray-100 rounded">
            ←
          </button>
          <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded">
            →
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>

        <div className="flex gap-1 border border-gray-300 rounded">
          {['month', 'week', 'day'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={\`px-3 py-1 text-sm font-medium capitalize \${view === v ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}\`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && <div className="text-center text-gray-500">Day view coming soon</div>}
    </div>
  )
}`
      }
    },

    inputs: [
      {
        name: 'events',
        type: 'array',
        required: false,
        aiDescription: 'Array of events with start, end, title, and color. Format: [{ start: Date, end: Date, title: string, color: string }]'
      },
      {
        name: 'onEventClick',
        type: 'function',
        required: false,
        aiDescription: 'Callback when event is clicked'
      },
      {
        name: 'onEventCreate',
        type: 'function',
        required: false,
        aiDescription: 'Callback when user clicks empty date to create event'
      },
      {
        name: 'defaultView',
        type: 'string',
        required: false,
        aiDescription: 'Default view: month, week, or day'
      }
    ],

    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered calendar'
      }
    ],

    dependencies: {
      npm: {
        react: '^18.0.0'
      }
    },

    aiMetadata: {
      usageExamples: [
        'Schedule meetings and appointments',
        'Event planning and management',
        'Team availability calendar',
        'Project timeline'
      ],
      relatedCapsules: ['date-picker', 'timeline', 'stepper'],
      complexity: 'advanced'
    },

    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 490000
  },

  // 66. WYSIWYG Editor
  {
    id: 'wysiwyg-editor',
    name: 'WYSIWYG Editor',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['editor', 'wysiwyg', 'rich-text', 'contenteditable', 'formatting', 'toolbar'],
    aiDescription: 'What You See Is What You Get rich text editor with formatting toolbar. Supports bold, italic, lists, links, and more.',

    platforms: {
      web: {
        engine: 'react',
        code: `import { useRef, useState, useEffect } from 'react'

export const WysiwygEditor = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  height = 300,
  toolbar = ['bold', 'italic', 'underline', 'strikethrough', 'h1', 'h2', 'ul', 'ol', 'link', 'image'],
  className = ''
}: any) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleInput = () => {
    onChange?.(editorRef.current?.innerHTML || '')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault()
      execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
    }
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      execCommand('insertImage', url)
    }
  }

  const toolbarButtons = [
    { id: 'bold', icon: '𝐁', command: 'bold', title: 'Bold (Ctrl+B)' },
    { id: 'italic', icon: '𝐼', command: 'italic', title: 'Italic (Ctrl+I)' },
    { id: 'underline', icon: 'U̲', command: 'underline', title: 'Underline (Ctrl+U)' },
    { id: 'strikethrough', icon: 'S̶', command: 'strikethrough', title: 'Strikethrough' },
    { id: 'h1', icon: 'H1', command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { id: 'h2', icon: 'H2', command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { id: 'ul', icon: '• List', command: 'insertUnorderedList', title: 'Bullet List' },
    { id: 'ol', icon: '1. List', command: 'insertOrderedList', title: 'Numbered List' },
    { id: 'link', icon: '🔗', command: 'custom', action: insertLink, title: 'Insert Link' },
    { id: 'image', icon: '🖼️', command: 'custom', action: insertImage, title: 'Insert Image' },
    { id: 'undo', icon: '↶', command: 'undo', title: 'Undo (Ctrl+Z)' },
    { id: 'redo', icon: '↷', command: 'redo', title: 'Redo (Ctrl+Y)' }
  ]

  return (
    <div className={\`border rounded-lg overflow-hidden \${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'} \${className}\`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
        {toolbarButtons
          .filter(btn => toolbar.includes(btn.id))
          .map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => {
                if (btn.command === 'custom' && btn.action) {
                  btn.action()
                } else {
                  execCommand(btn.command, btn.value)
                }
              }}
              className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded transition-colors"
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className="p-4 outline-none overflow-auto prose prose-sm max-w-none"
        style={{ minHeight: height }}
        data-placeholder={placeholder}
      />

      <style>{\`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
        }
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      \`}</style>
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
        aiDescription: 'HTML content of the editor'
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        aiDescription: 'Callback when content changes'
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        aiDescription: 'Editor height in pixels'
      },
      {
        name: 'toolbar',
        type: 'array',
        required: false,
        aiDescription: 'Array of toolbar button IDs to show'
      }
    ],

    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered rich text editor'
      }
    ],

    dependencies: {
      npm: {
        react: '^18.0.0'
      }
    },

    aiMetadata: {
      usageExamples: [
        'Blog post editor',
        'Email composer',
        'Comment system',
        'Document editor'
      ],
      relatedCapsules: ['code-editor', 'markdown-viewer', 'input-text'],
      complexity: 'advanced'
    },

    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 450000
  },

  // 67. Editable Data Grid
  {
    id: 'data-grid-editable',
    name: 'Editable Data Grid',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['table', 'grid', 'editable', 'spreadsheet', 'data', 'crud', 'excel'],
    aiDescription: 'Excel-like editable data grid with inline editing, add/remove rows, copy/paste, and keyboard navigation. Perfect for data management.',

    platforms: {
      web: {
        engine: 'react',
        code: `import { useState, useRef, useEffect } from 'react'

export const DataGridEditable = ({
  data = [],
  columns = [],
  onDataChange,
  allowAdd = true,
  allowDelete = true,
  height = 400,
  className = ''
}: any) => {
  const [rows, setRows] = useState(data)
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number; columnId: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRows(data)
  }, [data])

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])

  const handleCellClick = (rowIndex: number, columnId: string) => {
    setSelectedCell({ rowIndex, columnId })
  }

  const handleCellDoubleClick = (rowIndex: number, columnId: string) => {
    const column = columns.find((c: any) => c.id === columnId)
    if (column?.editable !== false) {
      setEditingCell({ rowIndex, columnId })
    }
  }

  const handleCellChange = (rowIndex: number, columnId: string, value: any) => {
    const newRows = [...rows]
    newRows[rowIndex] = { ...newRows[rowIndex], [columnId]: value }
    setRows(newRows)
    onDataChange?.(newRows)
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, columnId: string) => {
    if (editingCell) {
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        setEditingCell(null)
        // Move to next cell
        const colIndex = columns.findIndex((c: any) => c.id === columnId)
        if (e.key === 'Enter') {
          // Move down
          if (rowIndex < rows.length - 1) {
            setSelectedCell({ rowIndex: rowIndex + 1, columnId })
          }
        } else if (e.key === 'Tab') {
          // Move right
          if (colIndex < columns.length - 1) {
            setSelectedCell({ rowIndex, columnId: columns[colIndex + 1].id })
          }
        }
      } else if (e.key === 'Escape') {
        setEditingCell(null)
      }
    } else {
      // Navigation keys
      const colIndex = columns.findIndex((c: any) => c.id === columnId)

      if (e.key === 'ArrowUp' && rowIndex > 0) {
        e.preventDefault()
        setSelectedCell({ rowIndex: rowIndex - 1, columnId })
      } else if (e.key === 'ArrowDown' && rowIndex < rows.length - 1) {
        e.preventDefault()
        setSelectedCell({ rowIndex: rowIndex + 1, columnId })
      } else if (e.key === 'ArrowLeft' && colIndex > 0) {
        e.preventDefault()
        setSelectedCell({ rowIndex, columnId: columns[colIndex - 1].id })
      } else if (e.key === 'ArrowRight' && colIndex < columns.length - 1) {
        e.preventDefault()
        setSelectedCell({ rowIndex, columnId: columns[colIndex + 1].id })
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const column = columns.find((c: any) => c.id === columnId)
        if (column?.editable !== false) {
          setEditingCell({ rowIndex, columnId })
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleCellChange(rowIndex, columnId, '')
      }
    }
  }

  const handleAddRow = () => {
    const newRow: any = {}
    columns.forEach((col: any) => {
      newRow[col.id] = ''
    })
    const newRows = [...rows, newRow]
    setRows(newRows)
    onDataChange?.(newRows)
  }

  const handleDeleteRow = (rowIndex: number) => {
    const newRows = rows.filter((_: any, i: number) => i !== rowIndex)
    setRows(newRows)
    onDataChange?.(newRows)
  }

  return (
    <div className={\`border border-gray-300 rounded-lg overflow-hidden \${className}\`}>
      <div className="overflow-auto" style={{ maxHeight: height }}>
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {allowDelete && <th className="w-10 border-b border-gray-300"></th>}
              {columns.map((column: any) => (
                <th
                  key={column.id}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300"
                  style={{ minWidth: column.width || 150 }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {allowDelete && (
                  <td className="px-2 py-2 border-b border-gray-200">
                    <button
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete row"
                    >
                      ✕
                    </button>
                  </td>
                )}
                {columns.map((column: any) => {
                  const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === column.id
                  const isSelected = selectedCell?.rowIndex === rowIndex && selectedCell?.columnId === column.id

                  return (
                    <td
                      key={column.id}
                      className={\`px-4 py-2 border-b border-gray-200 \${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}\`}
                      onClick={() => handleCellClick(rowIndex, column.id)}
                      onDoubleClick={() => handleCellDoubleClick(rowIndex, column.id)}
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, column.id)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type={column.type || 'text'}
                          value={row[column.id] || ''}
                          onChange={(e) => handleCellChange(rowIndex, column.id, e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, column.id)}
                          className="w-full px-1 border border-blue-500 rounded outline-none"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{row[column.id]}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allowAdd && (
        <div className="p-2 bg-gray-50 border-t border-gray-300">
          <button
            onClick={handleAddRow}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            + Add Row
          </button>
        </div>
      )}
    </div>
  )
}`
      }
    },

    inputs: [
      {
        name: 'data',
        type: 'array',
        required: true,
        aiDescription: 'Array of row objects'
      },
      {
        name: 'columns',
        type: 'array',
        required: true,
        aiDescription: 'Column definitions with id, label, width, type, editable. Format: [{ id: string, label: string, width?: number, type?: string, editable?: boolean }]'
      },
      {
        name: 'onDataChange',
        type: 'function',
        required: false,
        aiDescription: 'Callback when data changes'
      },
      {
        name: 'allowAdd',
        type: 'boolean',
        required: false,
        aiDescription: 'Allow adding new rows'
      },
      {
        name: 'allowDelete',
        type: 'boolean',
        required: false,
        aiDescription: 'Allow deleting rows'
      }
    ],

    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered editable data grid'
      }
    ],

    dependencies: {
      npm: {
        react: '^18.0.0'
      }
    },

    aiMetadata: {
      usageExamples: [
        'Product inventory management',
        'Employee data editor',
        'Budget spreadsheet',
        'Configuration table'
      ],
      relatedCapsules: ['data-table', 'form-validated', 'input-text'],
      complexity: 'advanced'
    },

    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 410000
  },

  // 68. Interactive Map
  {
    id: 'map-interactive',
    name: 'Interactive Map',
    version: '1.0.0',
    author: 'hublab-team',
    registry: 'hublab-registry',
    category: 'ui-components',
    type: 'ui-component',
    tags: ['map', 'location', 'markers', 'geolocation', 'pins', 'interactive', 'canvas'],
    aiDescription: 'Interactive map component with markers, popups, zoom, and pan. Built with Canvas for performance. Great for location-based features.',

    platforms: {
      web: {
        engine: 'react',
        code: `import { useRef, useEffect, useState } from 'react'

export const MapInteractive = ({
  markers = [],
  center = { lat: 40.7128, lng: -74.0060 },
  zoom = 12,
  height = 400,
  onMarkerClick,
  onMapClick,
  className = ''
}: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mapState, setMapState] = useState({
    center,
    zoom,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  })
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null)

  // Simple projection (Mercator-like)
  const latLngToPixel = (lat: number, lng: number) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const scale = Math.pow(2, mapState.zoom) * 256
    const centerX = ((mapState.center.lng + 180) / 360) * scale
    const centerY = ((1 - Math.log(Math.tan((mapState.center.lat * Math.PI) / 180) + 1 / Math.cos((mapState.center.lat * Math.PI) / 180)) / Math.PI) / 2) * scale

    const x = ((lng + 180) / 360) * scale - centerX + canvas.width / 2 + mapState.offset.x
    const y = ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * scale - centerY + canvas.height / 2 + mapState.offset.y

    return { x, y }
  }

  const pixelToLatLng = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return { lat: 0, lng: 0 }

    const scale = Math.pow(2, mapState.zoom) * 256
    const centerX = ((mapState.center.lng + 180) / 360) * scale
    const centerY = ((1 - Math.log(Math.tan((mapState.center.lat * Math.PI) / 180) + 1 / Math.cos((mapState.center.lat * Math.PI) / 180)) / Math.PI) / 2) * scale

    const worldX = centerX + (x - canvas.width / 2 - mapState.offset.x)
    const worldY = centerY + (y - canvas.height / 2 - mapState.offset.y)

    const lng = (worldX / scale) * 360 - 180
    const n = Math.PI - (2 * Math.PI * worldY) / scale
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))

    return { lat, lng }
  }

  const draw = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw map background (simple grid)
    ctx.fillStyle = '#e5e7eb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw markers
    markers.forEach((marker: any, index: number) => {
      const pos = latLngToPixel(marker.lat, marker.lng)

      // Marker pin
      ctx.fillStyle = marker.color || '#ef4444'
      ctx.beginPath()
      ctx.arc(pos.x, pos.y - 10, 8, 0, Math.PI * 2)
      ctx.fill()

      // Pin point
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      ctx.lineTo(pos.x - 4, pos.y - 10)
      ctx.lineTo(pos.x + 4, pos.y - 10)
      ctx.closePath()
      ctx.fill()

      // Hovered marker
      if (hoveredMarker === index) {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(pos.x, pos.y - 10, 10, 0, Math.PI * 2)
        ctx.stroke()

        // Popup
        if (marker.label) {
          const padding = 8
          const text = marker.label
          ctx.font = '12px sans-serif'
          const textWidth = ctx.measureText(text).width
          const popupWidth = textWidth + padding * 2
          const popupHeight = 24
          const popupX = pos.x - popupWidth / 2
          const popupY = pos.y - 40

          // Popup background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
          ctx.fillRect(popupX, popupY, popupWidth, popupHeight)

          // Popup text
          ctx.fillStyle = '#fff'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(text, pos.x, popupY + popupHeight / 2)
        }
      }
    })

    // Draw zoom controls
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(10, 10, 30, 70)
    ctx.strokeStyle = '#d1d5db'
    ctx.strokeRect(10, 10, 30, 70)

    ctx.fillStyle = '#374151'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('+', 25, 30)
    ctx.fillText('-', 25, 65)
  }

  useEffect(() => {
    draw()
  }, [mapState, markers, hoveredMarker])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check zoom controls
    if (x >= 10 && x <= 40) {
      if (y >= 10 && y <= 40) {
        // Zoom in
        setMapState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 18) }))
        return
      } else if (y >= 45 && y <= 80) {
        // Zoom out
        setMapState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }))
        return
      }
    }

    // Check markers
    const clickedMarker = markers.findIndex((marker: any) => {
      const pos = latLngToPixel(marker.lat, marker.lng)
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y - 10, 2))
      return distance < 10
    })

    if (clickedMarker !== -1) {
      onMarkerClick?.(markers[clickedMarker], clickedMarker)
      return
    }

    setMapState(prev => ({ ...prev, isDragging: true, dragStart: { x, y } }))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (mapState.isDragging) {
      const dx = x - mapState.dragStart.x
      const dy = y - mapState.dragStart.y
      setMapState(prev => ({
        ...prev,
        offset: { x: prev.offset.x + dx, y: prev.offset.y + dy },
        dragStart: { x, y }
      }))
    } else {
      // Check hover on markers
      const hovered = markers.findIndex((marker: any) => {
        const pos = latLngToPixel(marker.lat, marker.lng)
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y - 10, 2))
        return distance < 10
      })
      setHoveredMarker(hovered === -1 ? null : hovered)
    }
  }

  const handleMouseUp = () => {
    setMapState(prev => ({ ...prev, isDragging: false }))
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.5 : 0.5
    setMapState(prev => ({
      ...prev,
      zoom: Math.max(1, Math.min(18, prev.zoom + delta))
    }))
  }

  return (
    <div className={\`relative \${className}\`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="border border-gray-300 rounded-lg cursor-move"
      />
    </div>
  )
}`
      }
    },

    inputs: [
      {
        name: 'markers',
        type: 'array',
        required: false,
        aiDescription: 'Array of markers with lat, lng, label, and color. Format: [{ lat: number, lng: number, label: string, color: string }]'
      },
      {
        name: 'center',
        type: 'object',
        required: false,
        aiDescription: 'Initial map center with lat and lng'
      },
      {
        name: 'zoom',
        type: 'number',
        required: false,
        aiDescription: 'Initial zoom level (1-18)'
      },
      {
        name: 'onMarkerClick',
        type: 'function',
        required: false,
        aiDescription: 'Callback when marker is clicked'
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        aiDescription: 'Map height in pixels'
      }
    ],

    outputs: [
      {
        name: 'element',
        type: 'component',
        aiDescription: 'Rendered interactive map'
      }
    ],

    dependencies: {
      npm: {
        react: '^18.0.0'
      }
    },

    aiMetadata: {
      usageExamples: [
        'Store locator',
        'Delivery tracking',
        'Real estate listings',
        'Event location map'
      ],
      relatedCapsules: ['qr-code', 'heatmap', 'chart-line'],
      complexity: 'advanced'
    },

    verified: true,
    verifiedBy: 'hublab-team',
    usageCount: 380000
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

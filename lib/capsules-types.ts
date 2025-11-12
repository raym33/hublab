// Data types that can flow between capsules
export type DataType =
  | 'any'           // Accepts anything
  | 'string'        // Text data
  | 'number'        // Numeric data
  | 'boolean'       // True/false
  | 'object'        // JSON object
  | 'array'         // Array of items
  | 'user'          // User profile object
  | 'email'         // Email data
  | 'http-response' // HTTP response
  | 'database-row'  // Database row/rows
  | 'file'          // File buffer/URL
  | 'token'         // Auth token
  | 'payment'       // Payment intent
  | 'error'         // Error object

export interface OutputPort {
  id: string
  name: string
  type: DataType
  description: string
}

export interface InputPort {
  id: string
  name: string
  type: DataType[]  // Can accept multiple types
  required: boolean
  description: string
}

// Check if types are compatible for connection
export function areTypesCompatible(sourceType: DataType, targetTypes: DataType[]): boolean {
  // 'any' can connect to anything
  if (sourceType === 'any' || targetTypes.includes('any')) {
    return true
  }

  // Direct match
  if (targetTypes.includes(sourceType)) {
    return true
  }

  // Compatible conversions
  const compatibilityMap: Record<DataType, DataType[]> = {
    'string': ['any', 'string'],
    'number': ['any', 'number', 'string'],
    'boolean': ['any', 'boolean', 'string'],
    'object': ['any', 'object', 'string'],
    'array': ['any', 'array', 'string'],
    'user': ['any', 'object', 'user'],
    'email': ['any', 'object', 'email'],
    'http-response': ['any', 'object', 'http-response', 'string'],
    'database-row': ['any', 'object', 'array', 'database-row'],
    'file': ['any', 'file', 'string'],
    'token': ['any', 'token', 'string'],
    'payment': ['any', 'object', 'payment'],
    'error': ['any', 'object', 'error'],
    'any': ['any']
  }

  const compatibleTypes = compatibilityMap[sourceType] || ['any']
  return targetTypes.some(t => compatibleTypes.includes(t))
}

// Get color for data type
export function getTypeColor(type: DataType): string {
  const colors: Record<DataType, string> = {
    'any': '#64748B',
    'string': '#3B82F6',
    'number': '#10B981',
    'boolean': '#8B5CF6',
    'object': '#F59E0B',
    'array': '#EC4899',
    'user': '#06B6D4',
    'email': '#EF4444',
    'http-response': '#14B8A6',
    'database-row': '#10B981',
    'file': '#6366F1',
    'token': '#3B82F6',
    'payment': '#EC4899',
    'error': '#DC2626'
  }
  return colors[type] || '#64748B'
}

// Suggest next capsules based on output type
export function suggestNextCapsules(outputType: DataType): string[] {
  const suggestions: Record<DataType, string[]> = {
    'user': ['database', 'email', 'logger', 'validator'],
    'email': ['email', 'logger', 'validator'],
    'http-response': ['transformer', 'validator', 'cache', 'logger'],
    'database-row': ['transformer', 'email', 'logger', 'cache'],
    'token': ['http', 'validator', 'logger'],
    'payment': ['sms', 'email', 'database', 'logger'],
    'object': ['transformer', 'validator', 'database', 'logger'],
    'array': ['transformer', 'validator', 'logger'],
    'string': ['transformer', 'validator', 'logger'],
    'file': ['email', 'storage', 'logger'],
    'error': ['logger', 'email', 'sms'],
    'any': ['transformer', 'logger'],
    'number': ['transformer', 'validator', 'logger'],
    'boolean': ['router', 'transformer', 'logger']
  }

  return suggestions[outputType] || ['logger']
}

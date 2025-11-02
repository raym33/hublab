// ============================================
// INTEGRATION TYPES
// ============================================

export type IntegrationType =
  | 'supabase'
  | 'firebase'
  | 'rest-api'
  | 'graphql'
  | 'stripe'
  | 'nextauth'
  | 'zustand'
  | 'swr'
  | 'resend'
  | 'twilio'
  | 'aws-s3'
  | 'vercel-kv'
  | 'cloudinary'

export type IntegrationConfig = {
  id: IntegrationType
  name: string
  description: string
  icon: string
  category: 'database' | 'auth' | 'payment' | 'state' | 'api' | 'email' | 'communications' | 'storage' | 'cache' | 'media'
  difficulty: 'easy' | 'medium' | 'advanced'
  setupTime: string
  requiredEnvVars: string[]
  optionalEnvVars?: string[]
  dependencies: string[]
  documentation: string
  quickStart: string
  examples: IntegrationExample[]
}

export type IntegrationExample = {
  title: string
  description: string
  code: string
  language: 'typescript' | 'javascript'
}

export type DataFetchConfig = {
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  queryParams?: Record<string, string>
}

export type AuthConfig = {
  provider: 'email' | 'google' | 'github' | 'custom'
  redirectUrl?: string
  scopes?: string[]
}

export type PaymentConfig = {
  amount: number
  currency: string
  description?: string
  metadata?: Record<string, any>
}

/**
 * GraphQL API Endpoint for HubLab AI Integration
 *
 * Provides efficient GraphQL queries for AI assistants
 * Supports batch operations, advanced filtering, and semantic search
 *
 * Example queries available at: /public/ai/graphql-schema.graphql
 */

import { createYoga } from 'graphql-yoga'
import { createSchema } from 'graphql-yoga'
import { typeDefs } from '@/lib/graphql/schema'
import { resolvers } from '@/lib/graphql/resolvers'

// CORS configuration
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

const ALLOWED_ORIGINS = [
  'https://hublab.dev',
  'https://www.hublab.dev',
  'https://hublab.app',
  'https://api.hublab.dev',
  // Development origins
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
]

// Origin validation function
function validateOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false
  // In development, allow localhost origins plus the allowed list
  if (IS_DEVELOPMENT) {
    return ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')
  }
  return ALLOWED_ORIGINS.includes(origin)
}

// Create GraphQL schema
const schema = createSchema({
  typeDefs,
  resolvers
})

// Create Yoga instance
const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',

  // Enable GraphiQL playground in development
  graphiql: process.env.NODE_ENV === 'development',

  // CORS configuration for AI access - strict origin validation in all environments
  cors: {
    origin: (origin) => {
      // Runtime safeguard: NEVER allow wildcard in production
      if (!IS_DEVELOPMENT && origin === '*') {
        console.error('SECURITY ERROR: Wildcard CORS origin blocked in production')
        return false
      }
      return validateOrigin(origin)
    },
    credentials: true, // Safe with origin validation
    methods: ['GET', 'POST', 'OPTIONS']
  },

  // Logging
  logging: {
    debug: (...args) => console.debug('[GraphQL Debug]', ...args),
    info: (...args) => console.info('[GraphQL Info]', ...args),
    warn: (...args) => console.warn('[GraphQL Warn]', ...args),
    error: (...args) => console.error('[GraphQL Error]', ...args)
  }
})

// Export as Next.js route handlers
// Wrap yoga handlers to match Next.js API route signature
export const GET = yoga.handle
export const POST = yoga.handle
export const OPTIONS = yoga.handle

// Use Edge Runtime for better performance
export const runtime = 'edge'

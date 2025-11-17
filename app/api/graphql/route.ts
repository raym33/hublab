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
]

// Origin validation function
function validateOrigin(origin: string | null | undefined): boolean {
  if (IS_DEVELOPMENT) return true // Allow all in development
  if (!origin) return false
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

  // CORS configuration for AI access - restrictive in production
  cors: IS_DEVELOPMENT
    ? {
        origin: '*',
        credentials: false, // Never use credentials with origin: *
        methods: ['GET', 'POST', 'OPTIONS']
      }
    : {
        origin: (origin) => validateOrigin(origin),
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
export {
  yoga as GET,
  yoga as POST,
  yoga as OPTIONS
}

// Use Edge Runtime for better performance
export const runtime = 'edge'

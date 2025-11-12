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

  // CORS configuration for AI access
  cors: {
    origin: '*',
    credentials: true,
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

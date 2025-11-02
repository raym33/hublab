// ============================================
// HUBLAB INTEGRATIONS HUB
// Export all integration helpers
// ============================================

// Types
export * from './types'

// Supabase (already in /lib/supabase.ts)
export { supabase, getCurrentUser } from '../supabase'

// Firebase
export * from './firebase'

// REST API
export * from './rest-api'

// GraphQL
export * from './graphql'

// Stripe
export * from './stripe'

// NextAuth
export * from './nextauth'

// Integration metadata for documentation
export const INTEGRATIONS = {
  supabase: {
    name: 'Supabase',
    category: 'database',
    description: 'PostgreSQL database with real-time subscriptions, authentication, and storage',
    difficulty: 'easy',
    setupTime: '5-10 minutes',
    docs: 'https://supabase.com/docs',
    envVars: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    features: ['Database', 'Authentication', 'Storage', 'Real-time', 'Edge Functions'],
  },
  firebase: {
    name: 'Firebase',
    category: 'database',
    description: 'Google\'s platform for building web and mobile applications',
    difficulty: 'easy',
    setupTime: '10-15 minutes',
    docs: 'https://firebase.google.com/docs',
    envVars: [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
    ],
    features: ['Firestore', 'Authentication', 'Storage', 'Real-time Database', 'Cloud Functions'],
  },
  restApi: {
    name: 'REST API',
    category: 'api',
    description: 'Generic REST API client with timeout, retries, and error handling',
    difficulty: 'easy',
    setupTime: '2-5 minutes',
    docs: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
    envVars: [],
    features: ['GET/POST/PUT/PATCH/DELETE', 'Query Parameters', 'Custom Headers', 'Timeout', 'SWR Integration'],
  },
  graphql: {
    name: 'GraphQL',
    category: 'api',
    description: 'Query language for APIs with efficient data fetching',
    difficulty: 'medium',
    setupTime: '5-10 minutes',
    docs: 'https://graphql.org/learn/',
    envVars: [],
    features: ['Queries', 'Mutations', 'Subscriptions', 'Query Builder', 'Apollo/URQL Integration'],
  },
  stripe: {
    name: 'Stripe',
    category: 'payment',
    description: 'Payment processing platform for online businesses',
    difficulty: 'medium',
    setupTime: '15-20 minutes',
    docs: 'https://stripe.com/docs',
    envVars: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'],
    features: ['Checkout Sessions', 'Payment Intents', 'Subscriptions', 'Webhooks', 'Customer Management'],
  },
  nextAuth: {
    name: 'NextAuth.js',
    category: 'auth',
    description: 'Authentication solution for Next.js applications',
    difficulty: 'easy',
    setupTime: '10-15 minutes',
    docs: 'https://next-auth.js.org/',
    envVars: ['NEXTAUTH_SECRET', 'NEXTAUTH_URL'],
    features: ['Google OAuth', 'GitHub OAuth', 'Email/Password', 'JWT Sessions', 'Database Adapter'],
  },
} as const

export type IntegrationKey = keyof typeof INTEGRATIONS

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

// Resend
export * from './resend'

// Twilio
export * from './twilio'

// AWS S3
export * from './aws-s3'

// Vercel KV
export * from './vercel-kv'

// Cloudinary
export * from './cloudinary'

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
  resend: {
    name: 'Resend',
    category: 'email',
    description: 'Developer-friendly transactional email API',
    difficulty: 'easy',
    setupTime: '5-10 minutes',
    docs: 'https://resend.com/docs',
    envVars: ['RESEND_API_KEY'],
    features: ['Transactional Emails', 'HTML Templates', 'React Email Support', 'Email Tracking', 'Bulk Sending'],
  },
  twilio: {
    name: 'Twilio',
    category: 'communications',
    description: 'SMS, WhatsApp, voice calls, and 2FA verification',
    difficulty: 'medium',
    setupTime: '10-15 minutes',
    docs: 'https://www.twilio.com/docs',
    envVars: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'],
    features: ['SMS Messaging', 'WhatsApp Messages', 'Voice Calls', '2FA/OTP', 'Bulk Messaging'],
  },
  awsS3: {
    name: 'AWS S3',
    category: 'storage',
    description: 'Scalable cloud file storage',
    difficulty: 'medium',
    setupTime: '10-15 minutes',
    docs: 'https://docs.aws.amazon.com/s3/',
    envVars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET'],
    features: ['File Upload/Download', 'Signed URLs', 'Folder Operations', 'Metadata Support', 'Public/Private Access'],
  },
  vercelKV: {
    name: 'Vercel KV',
    category: 'cache',
    description: 'Redis-compatible key-value storage',
    difficulty: 'easy',
    setupTime: '5 minutes',
    docs: 'https://vercel.com/docs/storage/vercel-kv',
    envVars: ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
    features: ['Session Storage', 'Rate Limiting', 'Caching', 'Counters', 'Leaderboards'],
  },
  cloudinary: {
    name: 'Cloudinary',
    category: 'media',
    description: 'Image and video optimization and transformation',
    difficulty: 'easy',
    setupTime: '5-10 minutes',
    docs: 'https://cloudinary.com/documentation',
    envVars: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
    features: ['Image Upload', 'Auto Optimization', 'Transformations', 'Video Support', 'CDN Delivery'],
  },
} as const

export type IntegrationKey = keyof typeof INTEGRATIONS

'use client'

import Link from 'next/link'
import { Database, Zap, CreditCard, Lock, Code2, GitBranch, ArrowRight, CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const integrations = [
  {
    id: 'supabase',
    name: 'Supabase',
    icon: Database,
    category: 'Database & Auth',
    description: 'PostgreSQL database with real-time subscriptions, authentication, and storage',
    difficulty: 'Easy',
    setupTime: '5-10 min',
    color: 'from-green-500 to-teal-500',
    features: ['PostgreSQL Database', 'Real-time Subscriptions', 'Authentication', 'File Storage', 'Edge Functions'],
    envVars: [
      { key: 'NEXT_PUBLIC_SUPABASE_URL', description: 'Your Supabase project URL' },
      { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', description: 'Your Supabase anon/public key' },
    ],
    codeExample: `import { supabase } from '@/lib/integrations'

// Fetch data
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('active', true)

// Real-time subscription
supabase
  .channel('users')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'users'
  }, (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()`,
    docsUrl: 'https://supabase.com/docs',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: Zap,
    category: 'Database & Auth',
    description: 'Google\'s platform for building web and mobile applications with Firestore and Authentication',
    difficulty: 'Easy',
    setupTime: '10-15 min',
    color: 'from-yellow-500 to-orange-500',
    features: ['Firestore Database', 'Authentication', 'Cloud Storage', 'Real-time Updates', 'Cloud Functions'],
    envVars: [
      { key: 'NEXT_PUBLIC_FIREBASE_API_KEY', description: 'Firebase API key' },
      { key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', description: 'Firebase auth domain' },
      { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', description: 'Firebase project ID' },
      { key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', description: 'Firebase storage bucket' },
      { key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', description: 'Firebase messaging sender ID' },
      { key: 'NEXT_PUBLIC_FIREBASE_APP_ID', description: 'Firebase app ID' },
    ],
    codeExample: `import { firestoreGetCollection, firebaseSignIn } from '@/lib/integrations'

// Authenticate user
const user = await firebaseSignIn('user@example.com', 'password')

// Query Firestore
const posts = await firestoreGetCollection('posts', {
  where: [{ field: 'published', operator: '==', value: true }],
  orderBy: { field: 'createdAt', direction: 'desc' },
  limit: 10
})`,
    docsUrl: 'https://firebase.google.com/docs',
  },
  {
    id: 'rest-api',
    name: 'REST API',
    icon: Code2,
    category: 'API',
    description: 'Type-safe REST API client with timeout, error handling, and SWR integration',
    difficulty: 'Easy',
    setupTime: '2-5 min',
    color: 'from-blue-500 to-cyan-500',
    features: ['GET/POST/PUT/DELETE', 'Query Parameters', 'Custom Headers', 'Timeout Handling', 'SWR Integration'],
    envVars: [],
    codeExample: `import { APIClient, apiGet } from '@/lib/integrations'

// Simple request
const { data, error } = await apiGet('https://api.example.com/users')

// With authentication
const client = new APIClient('https://api.example.com', {
  'Authorization': 'Bearer YOUR_TOKEN'
})

const users = await client.get('/users')
const newPost = await client.post('/posts', {
  title: 'Hello',
  content: 'World'
})`,
    docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: GitBranch,
    category: 'API',
    description: 'GraphQL client with query builder, mutations, and Apollo/URQL integration',
    difficulty: 'Medium',
    setupTime: '5-10 min',
    color: 'from-pink-500 to-rose-500',
    features: ['Queries & Mutations', 'Query Builder', 'Variables Support', 'Apollo Integration', 'URQL Integration'],
    envVars: [],
    codeExample: `import { graphqlQuery, GraphQLClient } from '@/lib/integrations'

// Simple query
const { data, errors } = await graphqlQuery(
  'https://api.example.com/graphql',
  \`query { users { id name email } }\`
)

// With variables
const response = await graphqlQuery(
  'https://api.example.com/graphql',
  \`query GetUser($id: ID!) {
    user(id: $id) { id name }
  }\`,
  { id: '123' },
  { 'Authorization': 'Bearer TOKEN' }
)`,
    docsUrl: 'https://graphql.org/learn/',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: CreditCard,
    category: 'Payments',
    description: 'Complete payment processing with checkout, subscriptions, and webhooks',
    difficulty: 'Medium',
    setupTime: '15-20 min',
    color: 'from-purple-500 to-indigo-500',
    features: ['Checkout Sessions', 'Payment Intents', 'Subscriptions', 'Webhooks', 'Customer Management'],
    envVars: [
      { key: 'STRIPE_SECRET_KEY', description: 'Stripe secret key (server-side)' },
      { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', description: 'Stripe publishable key (client-side)' },
      { key: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhook signing secret' },
    ],
    codeExample: `import { createCheckoutSession, createPaymentIntent } from '@/lib/integrations'

// Create checkout session
const session = await createCheckoutSession({
  lineItems: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'Pro Plan' },
      unit_amount: 2999, // $29.99
    },
    quantity: 1,
  }],
  mode: 'payment',
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
})`,
    docsUrl: 'https://stripe.com/docs',
  },
  {
    id: 'nextauth',
    name: 'NextAuth.js',
    icon: Lock,
    category: 'Authentication',
    description: 'Complete authentication solution with OAuth providers and session management',
    difficulty: 'Easy',
    setupTime: '10-15 min',
    color: 'from-teal-500 to-green-500',
    features: ['Google OAuth', 'GitHub OAuth', 'Email/Password', 'JWT Sessions', 'Database Adapter'],
    envVars: [
      { key: 'NEXTAUTH_SECRET', description: 'Random secret for JWT encryption' },
      { key: 'NEXTAUTH_URL', description: 'Your app URL (e.g., https://yoursite.com)' },
      { key: 'GOOGLE_CLIENT_ID', description: 'Google OAuth client ID (optional)' },
      { key: 'GOOGLE_CLIENT_SECRET', description: 'Google OAuth client secret (optional)' },
      { key: 'GITHUB_CLIENT_ID', description: 'GitHub OAuth client ID (optional)' },
      { key: 'GITHUB_CLIENT_SECRET', description: 'GitHub OAuth client secret (optional)' },
    ],
    codeExample: `import { createGoogleAuthConfig } from '@/lib/integrations'
import NextAuth from 'next-auth'

// app/api/auth/[...nextauth]/route.ts
const authOptions = createGoogleAuthConfig(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!
)

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// In your components
import { useSession } from 'next-auth/react'
const { data: session } = useSession()`,
    docsUrl: 'https://next-auth.js.org/',
  },
]

export default function IntegrationsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Integrations</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Production-ready integration helpers for building full-stack applications.
            Copy-paste code examples, environment variables, and complete documentation.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8">
          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <div
                key={integration.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{integration.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{integration.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Difficulty</div>
                        <div className="text-sm font-semibold text-gray-900">{integration.difficulty}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Setup Time</div>
                        <div className="text-sm font-semibold text-gray-900">{integration.setupTime}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4">{integration.description}</p>
                </div>

                {/* Features */}
                <div className="p-8 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {integration.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Environment Variables */}
                {integration.envVars.length > 0 && (
                  <div className="p-8 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Environment Variables</h3>
                    <div className="space-y-3">
                      {integration.envVars.map((envVar) => (
                        <div key={envVar.key} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono text-blue-600">{envVar.key}</code>
                            <button
                              onClick={() => copyToClipboard(envVar.key, `env-${integration.id}-${envVar.key}`)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedCode === `env-${integration.id}-${envVar.key}` ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-600">{envVar.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Example */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Code Example</h3>
                    <button
                      onClick={() => copyToClipboard(integration.codeExample, `code-${integration.id}`)}
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      {copiedCode === `code-${integration.id}` ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                    <pre className="text-sm text-gray-100 font-mono whitespace-pre">
                      {integration.codeExample}
                    </pre>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Import path: <code className="text-blue-600 font-mono">@/lib/integrations</code>
                  </div>
                  <a
                    href={integration.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Official Docs
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start using these integrations in your HubLab projects. All helpers are production-ready and type-safe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studio-v2"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
            >
              Launch Studio
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/for-ai-assistants"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-blue-500/30 transition-all"
            >
              View Documentation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

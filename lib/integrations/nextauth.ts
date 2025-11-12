// ============================================
// NEXTAUTH INTEGRATION HELPERS
// ============================================

import { NextAuthOptions, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'

// ============================================
// AUTH OPTIONS TEMPLATES
// ============================================

export type NextAuthConfigOptions = {
  supabaseUrl?: string
  supabaseServiceKey?: string
  googleClientId?: string
  googleClientSecret?: string
  githubClientId?: string
  githubClientSecret?: string
  secret: string
  callbacks?: {
    onSignIn?: (user: User) => Promise<void>
    onSignOut?: (session: Session) => Promise<void>
    onSessionUpdate?: (session: Session) => Promise<Session>
  }
}

// ============================================
// DEFAULT NEXTAUTH CONFIG
// ============================================

export function createNextAuthConfig(options?: Partial<NextAuthConfigOptions>): NextAuthOptions {
  const config: NextAuthOptions = {
    providers: [],
    secret: options?.secret || process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/login',
      signOut: '/logout',
      error: '/error',
    },
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id
          token.email = user.email
        }
        if (account) {
          token.accessToken = account.access_token
        }
        return token
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user.id = token.id as string
          session.user.email = token.email as string
        }
        return session
      },
    },
  }

  // Add Google Provider if configured
  if (options?.googleClientId && options?.googleClientSecret) {
    config.providers.push(
      GoogleProvider({
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
      })
    )
  }

  // Add GitHub Provider if configured
  if (options?.githubClientId && options?.githubClientSecret) {
    config.providers.push(
      GitHubProvider({
        clientId: options.githubClientId,
        clientSecret: options.githubClientSecret,
      })
    )
  }

  // Add Supabase Adapter if configured
  if (options?.supabaseUrl && options?.supabaseServiceKey) {
    config.adapter = SupabaseAdapter({
      url: options.supabaseUrl,
      secret: options.supabaseServiceKey,
    })
  }

  return config
}

// ============================================
// GOOGLE AUTH CONFIG
// ============================================

export function createGoogleAuthConfig(
  clientId: string,
  clientSecret: string,
  extraOptions?: Partial<NextAuthOptions>
): NextAuthOptions {
  return {
    providers: [
      GoogleProvider({
        clientId,
        clientSecret,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    ...extraOptions,
  }
}

// ============================================
// GITHUB AUTH CONFIG
// ============================================

export function createGitHubAuthConfig(
  clientId: string,
  clientSecret: string,
  extraOptions?: Partial<NextAuthOptions>
): NextAuthOptions {
  return {
    providers: [
      GitHubProvider({
        clientId,
        clientSecret,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    ...extraOptions,
  }
}

// ============================================
// CREDENTIALS AUTH CONFIG
// ============================================

export function createCredentialsAuthConfig(
  authorize: (credentials: { email: string; password: string }) => Promise<User | null>,
  extraOptions?: Partial<NextAuthOptions>
): NextAuthOptions {
  return {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }
          return authorize(credentials)
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    ...extraOptions,
  }
}

// ============================================
// MULTI-PROVIDER AUTH CONFIG
// ============================================

export function createMultiProviderAuthConfig(
  providers: {
    google?: { clientId: string; clientSecret: string }
    github?: { clientId: string; clientSecret: string }
    credentials?: (credentials: { email: string; password: string }) => Promise<User | null>
  },
  extraOptions?: Partial<NextAuthOptions>
): NextAuthOptions {
  const authProviders: any[] = []

  if (providers.google) {
    authProviders.push(
      GoogleProvider({
        clientId: providers.google.clientId,
        clientSecret: providers.google.clientSecret,
      })
    )
  }

  if (providers.github) {
    authProviders.push(
      GitHubProvider({
        clientId: providers.github.clientId,
        clientSecret: providers.github.clientSecret,
      })
    )
  }

  if (providers.credentials) {
    authProviders.push(
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }
          return providers.credentials!(credentials)
        },
      })
    )
  }

  return {
    providers: authProviders,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    ...extraOptions,
  }
}

// ============================================
// SESSION HELPERS
// ============================================

export type ExtendedSession = Session & {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

export function extendSession(session: Session): ExtendedSession {
  return session as ExtendedSession
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Basic NextAuth Config with Google
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { createGoogleAuthConfig } from '@/lib/integrations/nextauth'

const authOptions = createGoogleAuthConfig(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!
)

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// Example 2: Multi-Provider Auth
import { createMultiProviderAuthConfig } from '@/lib/integrations/nextauth'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcrypt'

const authOptions = createMultiProviderAuthConfig({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
  credentials: async (credentials) => {
    // Verify credentials against your database
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .single()

    if (!user || !await bcrypt.compare(credentials.password, user.password_hash)) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  },
})

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// Example 3: Custom NextAuth Config
import { createNextAuthConfig } from '@/lib/integrations/nextauth'

const authOptions = createNextAuthConfig({
  secret: process.env.NEXTAUTH_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
})

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// Example 4: Using in Server Components
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { extendSession } from '@/lib/integrations/nextauth'

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const extendedSession = extendSession(session)

  return (
    <div>
      <h1>Welcome, {extendedSession.user.name}</h1>
      <p>User ID: {extendedSession.user.id}</p>
    </div>
  )
}

// Example 5: Using in Client Components
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function LoginButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
    </div>
  )
}

// Example 6: Protected API Route
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Access user ID from session
  const userId = session.user.id

  return NextResponse.json({ message: 'Protected data', userId })
}
*/

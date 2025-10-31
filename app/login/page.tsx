'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          },
        })

        if (error) throw error
        setError('Check your email to confirm your account')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        router.push('/studio')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Google authentication error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="inline-block mb-12">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded" />
              <span className="text-xl font-light">HubLab</span>
            </div>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-gray-500 font-light">
              {isSignUp ? 'Start building amazing prototypes' : 'Continue to your dashboard'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded mb-6 text-sm ${
              error.includes('Check')
                ? 'bg-gray-50 text-gray-700 border border-gray-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-light">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 outline-none transition-colors bg-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 font-light">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 outline-none transition-colors bg-transparent"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-light py-3 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center group"
            >
              <span>{loading ? 'Processing...' : isSignUp ? 'Create account' : 'Sign in'}</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-light">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-light py-3 rounded-md transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>{loading ? 'Processing...' : 'Google'}</span>
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-8 text-center text-sm text-gray-600 font-light">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-gray-900 hover:underline underline-offset-4"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-gray-900 hover:underline underline-offset-4"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-50" />

        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Content */}
        <div className="relative h-full flex items-center justify-center p-16">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gray-900 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded" />
              </div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Build prototypes
                <br />
                <span className="text-gray-500">faster than ever</span>
              </h2>
              <p className="text-gray-600 font-light leading-relaxed">
                Join thousands of developers using AI to create, share, and monetize amazing prototypes.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-300">
              <div>
                <div className="text-2xl font-light text-gray-900">10k+</div>
                <div className="text-sm text-gray-500 font-light">Developers</div>
              </div>
              <div>
                <div className="text-2xl font-light text-gray-900">50k+</div>
                <div className="text-sm text-gray-500 font-light">Prototypes</div>
              </div>
              <div>
                <div className="text-2xl font-light text-gray-900">$2M+</div>
                <div className="text-sm text-gray-500 font-light">Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

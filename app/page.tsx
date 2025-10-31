'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Code, Workflow, Database, Mail, CreditCard, Bot, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">

      {/* Hero Section - Ultra Simple */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            Build Apps<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Visually
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Connect 32 pre-built modules. No code required.<br />
            Deploy production apps in minutes.
          </p>

          {/* CTA - Google Sign In */}
          <div className="flex flex-col items-center gap-6 mb-20">
            <Link
              href="/api/auth/google"
              className="group px-12 py-6 bg-black text-white rounded-2xl text-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Start Building with Google
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-500">Free • No credit card required • 2 minutes setup</p>
          </div>

          {/* Video/Demo Preview */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-900 max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center p-8">
                <Workflow className="w-24 h-24 mx-auto mb-4 opacity-80" />
                <p className="text-2xl font-semibold">Visual Builder Demo</p>
                <p className="text-lg opacity-80 mt-2">Drag. Connect. Deploy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get - Ultra Simple Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            32 production-ready modules. Connect them visually. Deploy anywhere.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Database</h3>
              <p className="text-gray-600 text-sm">PostgreSQL, MySQL, MongoDB, SQLite</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Chat</h3>
              <p className="text-gray-600 text-sm">OpenAI, Claude, Llama</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email & SMS</h3>
              <p className="text-gray-600 text-sm">SendGrid, Twilio, Resend</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Payments</h3>
              <p className="text-gray-600 text-sm">Stripe, PayPal, Square</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/api/auth/google" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
              + 28 more modules →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Simple Steps */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            3 Steps to Production
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Sign In</h3>
              <p className="text-gray-600 text-lg">
                Use your Google account. No password needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">Build</h3>
              <p className="text-gray-600 text-lg">
                Drag modules. Connect ports. Configure settings.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">Deploy</h3>
              <p className="text-gray-600 text-lg">
                One click to Vercel, Railway, or your own server.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Quick Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">32</div>
              <div className="text-gray-600">Modules</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">3.0</div>
              <div className="text-gray-600">Version</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">MIT</div>
              <div className="text-gray-600">License</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">Free</div>
              <div className="text-gray-600">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Ready to Build?
          </h2>
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of developers building apps visually.
          </p>
          <Link
            href="/api/auth/google"
            className="inline-flex items-center gap-3 px-12 py-6 bg-black text-white rounded-2xl text-xl font-semibold hover:bg-gray-800 transition-all shadow-2xl hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Start Building Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

    </div>
  )
}

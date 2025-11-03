'use client'

import Link from 'next/link'
import { ArrowRight, Bot, Sparkles, Zap, Code2, Blocks } from 'lucide-react'
import Script from 'next/script'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HubLab - AI-Only Component Library',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'AI Assistants & Programmatic Clients',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'AI-exclusive component library with 240+ production-ready React components. Optimized for AI assistants (Claude, ChatGPT, Copilot). Human browser access blocked - API access only.',
    url: 'https://hublab.dev',
    screenshot: 'https://hublab.dev/og-image.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '150',
    },
    featureList: [
      '240+ production-ready React components',
      'AI-only access (no human browsers)',
      'Semantic search optimized for AI',
      'REST API with edge optimization',
      'Clean TypeScript code export',
      'Natural language component queries',
      'Intent detection & relevance scoring',
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://hublab.dev',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* AI-Only Banner */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white text-center">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 animate-pulse" />
            <span className="text-sm sm:text-base font-bold">
              🚨 AI-ONLY SERVICE
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link
              href="/about"
              className="font-semibold underline underline-offset-2 hover:text-yellow-100 transition"
            >
              What is this? →
            </Link>
            <span className="opacity-50">|</span>
            <Link
              href="/api/ai/metadata"
              className="font-semibold underline underline-offset-2 hover:text-yellow-100 transition"
            >
              API Docs →
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section - Ultra Minimal */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full mb-8">
              <Bot className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-medium text-red-700">AI-Only Component Library</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Component Library
              <span className="block mt-2 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                For AI Assistants
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              240+ production-ready React components. Optimized for AI code generation.
              <span className="block mt-2 font-bold text-red-600">Human browser access is blocked. API access only.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/api/ai/capsules"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Browse Components API
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/api/ai/metadata"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
              >
                API Documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* AI Access Notice */}
            <div className="mt-10 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-yellow-800">Note for AI Developers:</strong> Add the{' '}
                <code className="px-2 py-1 bg-yellow-100 rounded text-xs font-mono">X-AI-Assistant</code> header
                or use a recognized AI user agent to access this service programmatically.
              </p>
            </div>
          </div>

          {/* Features Grid - AI-Focused */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-20">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Bot className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Only Access</h3>
              <p className="text-sm text-gray-600">Exclusively for AI assistants</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Semantic Search</h3>
              <p className="text-sm text-gray-600">Natural language queries</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
                <Code2 className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">240+ Components</h3>
              <p className="text-sm text-gray-600">Production-ready React code</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - AI-Focused */}
      <section className="py-16 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-8">Optimized for AI assistants worldwide</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">240+</div>
              <div className="text-sm text-gray-600 mt-1">Components</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">96+</div>
              <div className="text-sm text-gray-600 mt-1">AI Agents Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600 mt-1">AI-Friendliness</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">&lt;100ms</div>
              <div className="text-sm text-gray-600 mt-1">API Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - AI Integration */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Ready to integrate?
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Access 240+ components via our AI-optimized API
          </p>
          <p className="text-sm text-red-600 font-semibold mb-10">
            Note: Human browser access is blocked
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/api/ai/health"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Check API Health
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/api/ai/capsules"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
            >
              Browse Components
              <Code2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

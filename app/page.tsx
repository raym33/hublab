'use client'

import Link from 'next/link'
import { ArrowRight, Bot, Sparkles, Zap, Code2, Blocks } from 'lucide-react'
import Script from 'next/script'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HubLab',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Build production-ready web applications instantly with 180+ AI-powered React components. Export clean TypeScript code. Perfect for developers using ChatGPT, Claude, or any AI assistant.',
    url: 'https://hublab.dev',
    screenshot: 'https://hublab.dev/og-image.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    featureList: [
      '180+ production-ready React components',
      'Clean TypeScript code export',
      'AI-powered component generation',
      'Next.js and React templates',
      '30-minute build time',
      'GitHub integration',
      'Instant deployment',
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
      {/* AI Assistants Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-white text-center">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            AI Assistant?
          </span>
          <Link
            href="/for-ai-assistants"
            className="text-xs sm:text-sm font-semibold underline underline-offset-2 hover:text-blue-100 transition"
          >
            Quick Reference →
          </Link>
        </div>
      </div>

      {/* Hero Section - Ultra Minimal */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-8">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Build React Apps Instantly</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Build with
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Capsules
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              180+ production-ready components. Export clean React code.
              <span className="block mt-1 font-semibold text-gray-900">30 minutes from idea to deployed app.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio-v2"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start Building
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/for-ai-assistants"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
              >
                How it Works
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Features Grid - Minimal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-20">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Build in minutes, not days</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Code2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clean Code</h3>
              <p className="text-sm text-gray-600">Production-ready TypeScript</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mb-4">
                <Blocks className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">180+ Components</h3>
              <p className="text-sm text-gray-600">Everything you need to build</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Minimal */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-8">Trusted by developers worldwide</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">180+</div>
              <div className="text-sm text-gray-600 mt-1">Components</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">30min</div>
              <div className="text-sm text-gray-600 mt-1">Avg Build Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">7</div>
              <div className="text-sm text-gray-600 mt-1">Data Templates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600 mt-1">Code Ownership</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Minimal */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Ready to build?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Start creating production-ready apps today
          </p>
          <Link
            href="/studio-v2"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Launch Studio V2
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

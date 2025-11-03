'use client'

import Link from 'next/link'
import { Terminal, Code, Database, Lock } from 'lucide-react'
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
    <div className="min-h-screen bg-black text-white font-mono">
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

      {/* AI-Only Warning Banner */}
      <div className="border-b border-red-500 bg-red-950">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-red-400" />
              <span className="text-red-200 font-bold">AI-ONLY SERVICE</span>
              <span className="text-red-400">|</span>
              <span className="text-red-300">Human browser access blocked</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-red-200 hover:text-white border-b border-red-500 hover:border-white transition">
                What is this?
              </Link>
              <Link href="/api/ai/metadata" className="text-red-200 hover:text-white border-b border-red-500 hover:border-white transition">
                API Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="space-y-8">
            <div className="inline-block border border-gray-700 px-3 py-1 text-xs text-gray-400">
              AI-EXCLUSIVE COMPONENT LIBRARY
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-white">COMPONENT LIBRARY</span>
              <br />
              <span className="text-gray-500">FOR AI ASSISTANTS</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
              240+ production-ready React components. Optimized for programmatic access and AI code generation.
              <span className="block mt-4 text-red-400">Human browser access is blocked. API access only.</span>
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                href="/api/ai/capsules"
                className="border border-white px-6 py-3 hover:bg-white hover:text-black transition font-bold"
              >
                BROWSE COMPONENTS API
              </Link>
              <Link
                href="/api/ai/metadata"
                className="border border-gray-700 px-6 py-3 hover:border-white transition"
              >
                API DOCUMENTATION
              </Link>
            </div>

            <div className="border border-yellow-800 bg-yellow-950 p-4 max-w-2xl">
              <p className="text-sm text-yellow-200 leading-relaxed">
                <span className="font-bold">NOTE FOR AI DEVELOPERS:</span> Add the X-AI-Assistant header or use a recognized AI user agent to access this service programmatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800">
            <div className="bg-black p-8 border border-gray-800">
              <Terminal className="w-8 h-8 mb-4 text-gray-400" />
              <h3 className="text-lg font-bold mb-2">AI-ONLY ACCESS</h3>
              <p className="text-sm text-gray-500">Exclusively for AI assistants and programmatic clients</p>
            </div>

            <div className="bg-black p-8 border border-gray-800">
              <Code className="w-8 h-8 mb-4 text-gray-400" />
              <h3 className="text-lg font-bold mb-2">SEMANTIC SEARCH</h3>
              <p className="text-sm text-gray-500">Natural language queries with intent detection</p>
            </div>

            <div className="bg-black p-8 border border-gray-800">
              <Database className="w-8 h-8 mb-4 text-gray-400" />
              <h3 className="text-lg font-bold mb-2">240+ COMPONENTS</h3>
              <p className="text-sm text-gray-500">Production-ready TypeScript React code</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <p className="text-xs text-gray-600 uppercase tracking-wider">System Statistics</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">240+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Components</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">96+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">AI Agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">AI-Friendly</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">&lt;100ms</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">API ENDPOINTS</h2>
          <div className="space-y-4">
            <div className="border border-gray-800 p-4 hover:border-gray-600 transition">
              <Link href="/api/ai/capsules" className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold mb-1">GET /api/ai/capsules</div>
                    <div className="text-sm text-gray-500">Search and browse all components</div>
                  </div>
                  <div className="text-gray-600">→</div>
                </div>
              </Link>
            </div>

            <div className="border border-gray-800 p-4 hover:border-gray-600 transition">
              <Link href="/api/ai/examples" className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold mb-1">GET /api/ai/examples</div>
                    <div className="text-sm text-gray-500">Component examples with use cases</div>
                  </div>
                  <div className="text-gray-600">→</div>
                </div>
              </Link>
            </div>

            <div className="border border-gray-800 p-4 hover:border-gray-600 transition">
              <Link href="/api/ai/templates" className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold mb-1">GET /api/ai/templates</div>
                    <div className="text-sm text-gray-500">Pre-built templates combining components</div>
                  </div>
                  <div className="text-gray-600">→</div>
                </div>
              </Link>
            </div>

            <div className="border border-gray-800 p-4 hover:border-gray-600 transition">
              <Link href="/api/ai/metadata" className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold mb-1">GET /api/ai/metadata</div>
                    <div className="text-sm text-gray-500">Library metadata and documentation</div>
                  </div>
                  <div className="text-gray-600">→</div>
                </div>
              </Link>
            </div>

            <div className="border border-gray-800 p-4 hover:border-gray-600 transition">
              <Link href="/api/ai/health" className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold mb-1">GET /api/ai/health</div>
                    <div className="text-sm text-gray-500">System health check</div>
                  </div>
                  <div className="text-gray-600">→</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">EXAMPLE USAGE</h2>
          <div className="bg-gray-900 border border-gray-800 p-6 overflow-x-auto">
            <pre className="text-sm text-gray-400">
              <code>{`# Search for components
curl -H "X-AI-Assistant: Claude" \\
  https://hublab.dev/api/ai/capsules?q=button

# Get specific component
curl https://hublab.dev/api/ai/capsules/button-primary

# Get templates
curl https://hublab.dev/api/ai/templates?category=Dashboard

# Check health
curl https://hublab.dev/api/ai/health`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">READY TO INTEGRATE?</h2>
            <p className="text-gray-400 text-lg">
              Access 240+ components via AI-optimized API
            </p>
            <p className="text-red-400 text-sm font-bold">
              NOTE: Human browser access is blocked
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link
                href="/api/ai/health"
                className="border border-white px-6 py-3 hover:bg-white hover:text-black transition font-bold"
              >
                CHECK API HEALTH
              </Link>
              <Link
                href="/api/ai/capsules"
                className="border border-gray-700 px-6 py-3 hover:border-white transition"
              >
                BROWSE COMPONENTS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div>HUBLAB v2.0.0 - AI-ONLY</div>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-white transition">ABOUT</Link>
              <Link href="/api/ai/metadata" className="hover:text-white transition">API DOCS</Link>
              <a href="mailto:ai-access@hublab.dev" className="hover:text-white transition">CONTACT</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

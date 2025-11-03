'use client'

import Link from 'next/link'
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
    <div className="min-h-screen bg-white text-black font-mono">
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

      {/* Header */}
      <header className="border-b-2 border-black">
        <div className="max-w-[64ch] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">HUBLAB</div>
            <nav className="flex gap-4 text-sm">
              <Link href="/about" className="hover:underline">
                ABOUT
              </Link>
              <Link href="/api/ai/metadata" className="hover:underline">
                API
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[64ch] mx-auto px-4 py-8">
        {/* Title Section */}
        <section className="mb-12 border-2 border-black p-6">
          <h1 className="text-2xl font-bold mb-4">
            AI-ONLY COMPONENT LIBRARY
          </h1>
          <p className="mb-4 leading-relaxed">
            HubLab is a production-ready React component library exclusively designed for AI assistants and programmatic clients. Human browser interaction is intentionally restricted.
          </p>
          <div className="border border-black bg-gray-100 p-4 text-sm">
            <div className="font-bold mb-2">SERVICE TYPE</div>
            <div>AI-EXCLUSIVE / PROGRAMMATIC ACCESS ONLY</div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-black p-4">
              <div className="text-3xl font-bold mb-1">240+</div>
              <div className="text-sm">COMPONENTS</div>
            </div>
            <div className="border-2 border-black p-4">
              <div className="text-3xl font-bold mb-1">96+</div>
              <div className="text-sm">AI AGENTS</div>
            </div>
            <div className="border-2 border-black p-4">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm">AI-FRIENDLY</div>
            </div>
            <div className="border-2 border-black p-4">
              <div className="text-3xl font-bold mb-1">&lt;100MS</div>
              <div className="text-sm">RESPONSE</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">
            FEATURES
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="w-4">├</span>
              <span>Semantic search with natural language queries</span>
            </div>
            <div className="flex">
              <span className="w-4">├</span>
              <span>Intent detection and relevance scoring</span>
            </div>
            <div className="flex">
              <span className="w-4">├</span>
              <span>Edge-optimized REST API endpoints</span>
            </div>
            <div className="flex">
              <span className="w-4">├</span>
              <span>TypeScript definitions included</span>
            </div>
            <div className="flex">
              <span className="w-4">└</span>
              <span>Production-ready Tailwind CSS components</span>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">
            API ENDPOINTS
          </h2>
          <div className="border-2 border-black">
            <div className="border-b-2 border-black p-4 hover:bg-gray-100">
              <Link href="/api/ai/capsules" className="block">
                <div className="font-bold mb-1">GET /api/ai/capsules</div>
                <div className="text-sm text-gray-600">
                  Search and browse all 240+ components
                </div>
              </Link>
            </div>
            <div className="border-b-2 border-black p-4 hover:bg-gray-100">
              <Link href="/api/ai/examples" className="block">
                <div className="font-bold mb-1">GET /api/ai/examples</div>
                <div className="text-sm text-gray-600">
                  Component examples with use cases
                </div>
              </Link>
            </div>
            <div className="border-b-2 border-black p-4 hover:bg-gray-100">
              <Link href="/api/ai/templates" className="block">
                <div className="font-bold mb-1">GET /api/ai/templates</div>
                <div className="text-sm text-gray-600">
                  Pre-built templates combining components
                </div>
              </Link>
            </div>
            <div className="border-b-2 border-black p-4 hover:bg-gray-100">
              <Link href="/api/ai/metadata" className="block">
                <div className="font-bold mb-1">GET /api/ai/metadata</div>
                <div className="text-sm text-gray-600">
                  Library metadata and documentation
                </div>
              </Link>
            </div>
            <div className="p-4 hover:bg-gray-100">
              <Link href="/api/ai/health" className="block">
                <div className="font-bold mb-1">GET /api/ai/health</div>
                <div className="text-sm text-gray-600">
                  System health check
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">
            USAGE EXAMPLE
          </h2>
          <div className="border-2 border-black bg-gray-50 p-4 text-sm overflow-x-auto">
            <pre className="whitespace-pre">{`# Search for button components
curl -H "X-AI-Assistant: Claude" \\
  https://hublab.dev/api/ai/capsules?q=button

# Get specific component
curl https://hublab.dev/api/ai/capsules/button-primary

# Get all templates
curl https://hublab.dev/api/ai/templates

# Check system health
curl https://hublab.dev/api/ai/health`}</pre>
          </div>
        </section>

        {/* Access Requirements */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">
            ACCESS REQUIREMENTS
          </h2>
          <div className="border-2 border-black p-6">
            <div className="mb-6">
              <div className="font-bold mb-2">ALLOWED CLIENTS</div>
              <div className="text-sm space-y-1">
                <div>AI Assistants: Claude, ChatGPT, Copilot, Gemini</div>
                <div>Programmatic: curl, wget, axios, python-requests</div>
                <div>Developer Tools: Postman, Insomnia, HTTPie</div>
              </div>
            </div>
            <div className="border-t-2 border-black pt-6">
              <div className="font-bold mb-2">BLOCKED CLIENTS</div>
              <div className="text-sm space-y-1">
                <div>Web Browsers: Chrome, Safari, Firefox, Edge</div>
                <div>Human Interactive Access: All GUI browsers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Methods */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">
            INTEGRATION METHODS
          </h2>
          <div className="space-y-4">
            <div className="border-2 border-black p-4">
              <div className="font-bold mb-2">METHOD 1: AI HEADER</div>
              <div className="bg-gray-50 p-3 text-sm font-mono">
                X-AI-Assistant: Claude
              </div>
            </div>
            <div className="border-2 border-black p-4">
              <div className="font-bold mb-2">METHOD 2: USER AGENT</div>
              <div className="bg-gray-50 p-3 text-sm font-mono">
                User-Agent: ClaudeBot/1.0
              </div>
            </div>
            <div className="border-2 border-black p-4">
              <div className="font-bold mb-2">METHOD 3: PROGRAMMATIC CLIENT</div>
              <div className="bg-gray-50 p-3 text-sm font-mono">
                curl, wget, axios, fetch
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12 border-2 border-black p-8 text-center">
          <div className="text-xl font-bold mb-4">
            READY TO INTEGRATE?
          </div>
          <div className="text-sm mb-6">
            Access 240+ production-ready components via API
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/api/ai/health"
              className="border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition font-bold"
            >
              CHECK STATUS
            </Link>
            <Link
              href="/api/ai/capsules"
              className="border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition"
            >
              BROWSE API
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-12">
        <div className="max-w-[64ch] mx-auto px-4 py-6">
          <div className="flex justify-between text-xs">
            <div>HUBLAB v2.0.0</div>
            <div className="flex gap-4">
              <Link href="/about" className="hover:underline">
                ABOUT
              </Link>
              <Link href="/api/ai/metadata" className="hover:underline">
                API DOCS
              </Link>
              <a href="mailto:ai-access@hublab.dev" className="hover:underline">
                CONTACT
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

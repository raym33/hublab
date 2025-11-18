'use client'

import Script from 'next/script'
import Link from 'next/link'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HubLab - Universal Capsule Compiler',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web, AI Assistants, API',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform AI prompts into production-ready applications. 8,150+ React components accessible via visual builder, AI compiler, and programmatic API. Build dashboards, forms, charts, and full-stack apps in 30 minutes.',
    url: 'https://hublab.dev',
    screenshot: 'https://hublab.dev/og-image.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '150',
    },
    featureList: [
      'Visual builder (Studio V2) for drag-and-drop UI',
      'AI compiler for natural language app generation',
      '8,150+ production-ready React components',
      'Programmatic API for AI assistants',
      'Clean TypeScript/Next.js code export',
      '65+ categories: dashboards, forms, charts, AI, IoT, e-commerce',
      'Deploy to Vercel/Netlify in one command',
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
        <div className="max-w-[64ch] mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-bold">HUBLAB</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/docs" className="hover:text-terminal-green transition-colors">
              DOCS
            </Link>
            <Link href="/components" className="hover:text-terminal-green transition-colors">
              COMPONENTS
            </Link>
            <Link href="/getting-started" className="hover:text-terminal-green transition-colors">
              START
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[64ch] mx-auto px-4 py-8">
        {/* Title Section */}
        <section className="mb-12 border-2 border-black p-6 sacred-card scanline">
          <h1 className="text-2xl font-bold mb-4 glitch-hover">
            UNIVERSAL CAPSULE COMPILER<span className="terminal-cursor"></span>
          </h1>
          <p className="mb-4 leading-relaxed">
            Transform AI prompts into production-ready applications. HubLab provides 8,150+ React components accessible through visual builders, AI assistants, and programmatic APIs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/studio-v2" className="border-2 border-blue-600 bg-blue-50 p-4 hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="font-bold mb-2 text-blue-600">👥 VISUAL BUILDER</div>
              <div className="text-sm">Build apps visually in Studio V2</div>
            </Link>
            <Link href="/compiler" className="border-2 border-green-600 bg-green-50 p-4 hover:bg-green-100 transition-colors cursor-pointer">
              <div className="font-bold mb-2 text-green-600">🤖 AI COMPILER</div>
              <div className="text-sm">Describe your app in plain English</div>
            </Link>
            <a href="#api" className="border-2 border-purple-600 bg-purple-50 p-4 hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="font-bold mb-2 text-purple-600">⚡ API ACCESS</div>
              <div className="text-sm">Programmatic component library</div>
            </a>
          </div>
        </section>

        {/* Quick Start for Humans */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-blue-600">
            🚀 QUICK START FOR DEVELOPERS
          </h2>
          <div className="space-y-4">
            <div className="border-2 border-black p-4 sacred-hover">
              <div className="flex items-start gap-3">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="flex-1">
                  <div className="font-bold mb-2">Build Your UI Visually</div>
                  <div className="text-sm text-gray-600 mb-3">
                    Open Studio V2, drag components, configure props, apply themes. No code required.
                  </div>
                  <Link href="/studio-v2" className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                    OPEN STUDIO V2 →
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover">
              <div className="flex items-start gap-3">
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="flex-1">
                  <div className="font-bold mb-2">Or Use AI Compiler</div>
                  <div className="text-sm text-gray-600 mb-3">
                    Describe your app in plain English. AI generates the code using HubLab components.
                  </div>
                  <Link href="/compiler" className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors">
                    TRY AI COMPILER →
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover">
              <div className="flex items-start gap-3">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="flex-1">
                  <div className="font-bold mb-2">Export & Deploy</div>
                  <div className="text-sm text-gray-600 mb-3">
                    Download production-ready Next.js code. Deploy to Vercel/Netlify in one command.
                  </div>
                  <Link href="/getting-started" className="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors">
                    VIEW GUIDE →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-black p-4 sacred-hover cursor-pointer">
              <div className="text-3xl font-bold mb-1 text-terminal-green">8,150+</div>
              <div className="text-sm">COMPONENTS</div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover cursor-pointer">
              <div className="text-3xl font-bold mb-1 text-terminal-green">65+</div>
              <div className="text-sm">CATEGORIES</div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover cursor-pointer">
              <div className="text-3xl font-bold mb-1 text-terminal-green">100%</div>
              <div className="text-sm">CODE OWNERSHIP</div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover cursor-pointer">
              <div className="text-3xl font-bold mb-1 text-terminal-green">30MIN</div>
              <div className="text-sm">TO DEPLOYMENT</div>
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
        <section id="api" className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-terminal-green">
            ⚡ API ENDPOINTS FOR AI ASSISTANTS
          </h2>
          <div className="border-2 border-black sacred-card">
            <div className="border-b-2 border-black p-4 sacred-transition hover:bg-gray-50">
              <div className="font-bold mb-1 text-terminal-green">GET /api/ai/capsules</div>
              <div className="text-sm text-gray-600">
                Search and browse all 8,150+ components
              </div>
            </div>
            <div className="border-b-2 border-black p-4 sacred-transition hover:bg-gray-50">
              <div className="font-bold mb-1 text-terminal-green">GET /api/ai/examples</div>
              <div className="text-sm text-gray-600">
                Component examples with use cases
              </div>
            </div>
            <div className="border-b-2 border-black p-4 sacred-transition hover:bg-gray-50">
              <div className="font-bold mb-1 text-terminal-green">GET /api/ai/templates</div>
              <div className="text-sm text-gray-600">
                Pre-built templates combining components
              </div>
            </div>
            <div className="border-b-2 border-black p-4 sacred-transition hover:bg-gray-50">
              <div className="font-bold mb-1 text-terminal-green">GET /api/ai/metadata</div>
              <div className="text-sm text-gray-600">
                Library metadata and documentation
              </div>
            </div>
            <div className="p-4 sacred-transition hover:bg-gray-50">
              <div className="font-bold mb-1 text-terminal-green">GET /api/ai/health</div>
              <div className="text-sm text-gray-600">
                System health check
              </div>
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

        {/* Integration Methods */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-terminal-green">
            INTEGRATION METHODS
          </h2>
          <div className="space-y-4">
            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">METHOD 1: AI HEADER</div>
              <div className="bg-gray-50 p-3 text-sm font-mono">
                X-AI-Assistant: Claude
              </div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">METHOD 2: USER AGENT</div>
              <div className="bg-gray-50 p-3 text-sm font-mono">
                User-Agent: ClaudeBot/1.0
              </div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">METHOD 3: PROGRAMMATIC CLIENT</div>
              <div className="bg-gray-50 p-3 text-sm font-mono">
                curl, wget, axios, fetch
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-terminal-green">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="space-y-6">
            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">What is HubLab?</div>
              <div className="text-sm leading-relaxed">
                HubLab is a comprehensive library of 8,150+ production-ready React components specifically optimized for AI code generation. Unlike traditional component libraries designed for human developers, HubLab is built from the ground up to be consumed by AI assistants like Grok, Claude, ChatGPT, and GitHub Copilot.
              </div>
            </div>

            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">Why is it AI-only?</div>
              <div className="text-sm leading-relaxed">
                HubLab is designed exclusively for AI consumption to provide the best possible experience for AI-driven code generation. The API structure, search algorithms, and component metadata are all optimized for machine reading and processing. This ensures components are used in their intended AI-assisted workflows and API performance remains optimal for AI queries.
              </div>
            </div>

            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">How does it work?</div>
              <div className="text-sm leading-relaxed">
                When you ask an AI assistant (Grok, Claude, ChatGPT, Copilot) to build a feature, the AI can query HubLab's API to search and retrieve the perfect components using semantic search. The AI then generates higher-quality code using HubLab's production-ready components as building blocks. Grok can use real-time search to find the latest components.
              </div>
            </div>

            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">Who can use HubLab?</div>
              <div className="text-sm leading-relaxed">
                AI assistants (Grok, Claude, ChatGPT, Copilot, Gemini), programmatic clients (curl, wget, axios, fetch, python-requests), and developer tools (Postman, Insomnia, HTTPie) can access the full API. Human developers can access the homepage for information and use AI assistants to interact with the library.
              </div>
            </div>

            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">How do I access the components?</div>
              <div className="text-sm leading-relaxed">
                Ask your AI assistant to search HubLab for components. The AI will query the API and retrieve the code for you. Alternatively, use programmatic clients like curl with the X-AI-Assistant header or standard HTTP libraries.
              </div>
            </div>

            <div className="border-2 border-black p-4 sacred-hover">
              <div className="font-bold mb-2 text-terminal-green">Is HubLab free?</div>
              <div className="text-sm leading-relaxed">
                Yes, HubLab is completely free for AI assistants and programmatic access. There are no rate limits for legitimate AI use.
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="mb-12 border-2 border-black p-6 sacred-card pulse-green">
          <div className="font-bold mb-3 text-terminal-green">OPEN SOURCE</div>
          <div className="text-sm leading-relaxed mb-3">
            HubLab is free and open source. All components, API endpoints, and infrastructure code are available under the MIT license.
          </div>
          <div className="text-sm space-y-1">
            <div>├ MIT License</div>
            <div>├ 8,150+ Components</div>
            <div>├ Full API Source</div>
            <div>└ Community Contributions Welcome</div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12 border-2 border-black p-8 text-center sacred-hover">
          <div className="text-xl font-bold mb-4 text-terminal-green">
            CONTACT
          </div>
          <div className="text-sm mb-2">
            For questions, integration support, or feedback
          </div>
          <div className="font-bold">
            info@hublab.dev
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-12">
        <div className="max-w-[64ch] mx-auto px-4 py-6">
          <div className="flex justify-between items-center text-xs">
            <div className="text-terminal-green font-bold">HUBLAB v2.0.0</div>
            <div className="flex gap-4">
              <a
                href="https://github.com/raym33/hublab"
                target="_blank"
                rel="noopener noreferrer"
                className="sacred-link font-bold"
              >
                GITHUB
              </a>
              <a
                href="https://x.com/hublabdev"
                target="_blank"
                rel="noopener noreferrer"
                className="sacred-link font-bold"
              >
                TWITTER
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

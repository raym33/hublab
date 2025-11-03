'use client'

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
          <div className="font-bold">HUBLAB</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[64ch] mx-auto px-4 py-8">
        {/* Title Section */}
        <section className="mb-12 border-2 border-black p-6 sacred-card scanline">
          <h1 className="text-2xl font-bold mb-4 glitch-hover">
            AI-ONLY COMPONENT LIBRARY<span className="terminal-cursor"></span>
          </h1>
          <p className="mb-4 leading-relaxed">
            HubLab is a production-ready React component library exclusively designed for AI assistants and programmatic clients. Human browser interaction beyond this homepage is intentionally restricted.
          </p>
          <div className="border border-black bg-gray-100 p-4 text-sm">
            <div className="font-bold mb-2">SERVICE TYPE</div>
            <div>AI-EXCLUSIVE / PROGRAMMATIC ACCESS ONLY</div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-black p-4 sacred-hover cursor-pointer">
              <div className="text-3xl font-bold mb-1 text-terminal-green">240+</div>
              <div className="text-sm">COMPONENTS</div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover cursor-pointer">
              <div className="text-3xl font-bold mb-1 text-terminal-green">6</div>
              <div className="text-sm">AI MODELS</div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover cursor-pointer">
              <div className="text-3xl font-bold mb-1 text-terminal-green">100%</div>
              <div className="text-sm">AI-FRIENDLY</div>
            </div>
            <div className="border-2 border-black p-4 sacred-hover cursor-pointer">
              <div className="text-3xl font-bold mb-1 text-terminal-green">&lt;100MS</div>
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
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-terminal-green">
            API ENDPOINTS
          </h2>
          <div className="border-2 border-black sacred-card">
            <div className="border-b-2 border-black p-4 sacred-transition hover:bg-gray-50">
              <div className="font-bold mb-1 text-terminal-green">GET /api/ai/capsules</div>
              <div className="text-sm text-gray-600">
                Search and browse all 240+ components
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

        {/* Access Requirements */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-black">
            ACCESS REQUIREMENTS
          </h2>
          <div className="border-2 border-black p-6">
            <div className="mb-6">
              <div className="font-bold mb-2">ALLOWED CLIENTS</div>
              <div className="text-sm space-y-1">
                <div>AI Assistants: Grok, Claude, ChatGPT, Copilot, Gemini</div>
                <div>Programmatic: curl, wget, axios, python-requests</div>
                <div>Developer Tools: Postman, Insomnia, HTTPie</div>
              </div>
            </div>
            <div className="border-t-2 border-black pt-6">
              <div className="font-bold mb-2">BLOCKED CLIENTS</div>
              <div className="text-sm space-y-1">
                <div>Web Browsers: Chrome, Safari, Firefox, Edge</div>
                <div>Human Interactive Access: All GUI browsers (except this homepage)</div>
              </div>
            </div>
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
                HubLab is a comprehensive library of 240+ production-ready React components specifically optimized for AI code generation. Unlike traditional component libraries designed for human developers, HubLab is built from the ground up to be consumed by AI assistants like Grok, Claude, ChatGPT, and GitHub Copilot.
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
            <div>├ 240+ Components</div>
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

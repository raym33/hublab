'use client'

import Link from 'next/link'
import { Bot, Code2, Sparkles, ArrowRight, BookOpen, Zap, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 border border-blue-200 rounded-full mb-6">
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">About HubLab</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Component Library
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                For AI Assistants
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              HubLab is an AI-exclusive component library designed to help AI assistants like Claude, ChatGPT, and GitHub Copilot generate better React code faster.
            </p>
          </div>
        </div>
      </section>

      {/* What is HubLab Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What is HubLab?</h2>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              HubLab is a comprehensive library of <strong>240+ production-ready React components</strong> specifically optimized for AI code generation. Unlike traditional component libraries designed for human developers, HubLab is built from the ground up to be consumed by AI assistants.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              When you ask Claude, ChatGPT, or GitHub Copilot to build a feature, they can query HubLab's API to find and retrieve the perfect components, resulting in higher-quality code generation and faster development.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Code2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">240+ Components</h3>
              <p className="text-gray-600">
                Comprehensive library covering UI, forms, data visualization, animations, and more. All components are production-ready with TypeScript support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Semantic Search</h3>
              <p className="text-gray-600">
                AI-powered search with natural language queries, intent detection, and relevance scoring. Find the perfect component in milliseconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Edge-Optimized API</h3>
              <p className="text-gray-600">
                Sub-100ms response times with global edge deployment. Semantic search, filtering, and real-time component retrieval.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Only Access</h3>
              <p className="text-gray-600">
                Intelligent detection system ensures only AI assistants and programmatic clients can access the library, preventing human misuse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">You Ask Your AI Assistant</h3>
                <p className="text-gray-600">
                  "Build me a dashboard with user analytics" or "Create a contact form with validation"
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Queries HubLab API</h3>
                <p className="text-gray-600">
                  Your AI assistant searches HubLab's component library using semantic search to find the best matches
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Components Retrieved</h3>
                <p className="text-gray-600">
                  HubLab returns production-ready components with clean TypeScript code, ready to use
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Code Generated</h3>
                <p className="text-gray-600">
                  Your AI assistant generates higher-quality code using HubLab's components as building blocks
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI-Only */}
      <section className="py-16 px-4 bg-yellow-50 border-y-2 border-yellow-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <Bot className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why AI-Only Access?</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                HubLab is designed exclusively for AI consumption to provide the best possible experience for AI-driven code generation. The API structure, search algorithms, and component metadata are all optimized for machine reading and processing.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By restricting access to AI assistants and programmatic clients, we ensure that:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Components are used in their intended AI-assisted workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>API performance remains optimal for AI queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>The library evolves based on AI usage patterns</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Supported AI Assistants */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Supported AI Assistants</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl mb-2">🤖</div>
              <div className="font-semibold text-gray-900">Claude</div>
              <div className="text-sm text-gray-600">Anthropic</div>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">💬</div>
              <div className="font-semibold text-gray-900">ChatGPT</div>
              <div className="text-sm text-gray-600">OpenAI</div>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">👨‍💻</div>
              <div className="font-semibold text-gray-900">Copilot</div>
              <div className="text-sm text-gray-600">GitHub</div>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🔮</div>
              <div className="font-semibold text-gray-900">Gemini</div>
              <div className="text-sm text-gray-600">Google</div>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-8">
            + 96 other AI assistants and programmatic clients
          </p>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            For AI developers looking to integrate HubLab into their assistant or tool, check out our comprehensive API documentation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/api/ai/metadata"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View API Docs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/api/ai/health"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
            >
              Check API Health
              <Zap className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">240+</div>
              <div className="text-sm text-gray-600">React Components</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">96+</div>
              <div className="text-sm text-gray-600">AI Agents Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-sm text-gray-600">AI-Friendliness Score</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">&lt;100ms</div>
              <div className="text-sm text-gray-600">API Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Note */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Learn more about HubLab and how it works
          </p>
          <Link
            href="/for-ai-assistants"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            AI Assistants Guide
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

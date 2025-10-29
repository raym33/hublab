'use client'

import Link from 'next/link'
import { ArrowRight, ShoppingBag, Workflow, Code, Zap, TrendingUp, Clock, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Development<br />Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Build faster with vibe-coded prototypes and visual workflow automation.
              Ship production-ready applications in hours, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Browse Marketplace
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/builder"
                className="px-8 py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Explore Builder
                <Workflow className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Prototypes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">29</div>
              <div className="text-gray-600 font-medium">Capsules</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">80+</div>
              <div className="text-gray-600 font-medium">Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">10k+</div>
              <div className="text-gray-600 font-medium">Developers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">Marketplace</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Vibe-Coded Prototypes
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Browse production-ready applications built with AI tools like Cursor, v0, and Claude.
                Buy complete codebases and deploy instantly, or sell your own prototypes.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Production-Ready Code</div>
                    <div className="text-gray-600">Clean, well-structured, modern stack</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Instant Deployment</div>
                    <div className="text-gray-600">Deploy to production in minutes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Full Source Code</div>
                    <div className="text-gray-600">Customize and extend as needed</div>
                  </div>
                </div>
              </div>

              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Browse Prototypes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-gray-200">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
                      <div>
                        <div className="font-bold text-gray-900">SaaS Dashboard</div>
                        <div className="text-sm text-gray-600">Next.js + Supabase</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">$299</div>
                      <div className="text-sm text-gray-600">★ 4.9 (127)</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg"></div>
                      <div>
                        <div className="font-bold text-gray-900">AI Chat App</div>
                        <div className="text-sm text-gray-600">React + OpenAI</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">$199</div>
                      <div className="text-sm text-gray-600">★ 5.0 (89)</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg"></div>
                      <div>
                        <div className="font-bold text-gray-900">E-commerce Store</div>
                        <div className="text-sm text-gray-600">Next.js + Stripe</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">$349</div>
                      <div className="text-sm text-gray-600">★ 4.8 (156)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Builder Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="bg-black rounded-2xl p-8 border-2 border-gray-800 font-mono">
                <div className="flex items-center gap-2 mb-6 text-sm text-green-400">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-bold">SYSTEM ONLINE</span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="text-gray-400"># Workflow: CRM Automation</div>
                  <div className="text-white">
                    <span className="text-purple-400">watch</span>
                    <span className="text-white">(</span>
                    <span className="text-yellow-300">"gmail"</span>
                    <span className="text-white">)</span>
                  </div>
                  <div className="text-white pl-4">
                    <span className="text-purple-400">.normalize</span>
                    <span className="text-white">()</span>
                  </div>
                  <div className="text-white pl-4">
                    <span className="text-purple-400">.classify</span>
                    <span className="text-white">(</span>
                    <span className="text-yellow-300">"intent"</span>
                    <span className="text-white">)</span>
                  </div>
                  <div className="text-white pl-4">
                    <span className="text-purple-400">.reason</span>
                    <span className="text-white">(</span>
                    <span className="text-yellow-300">"confidence"</span>
                    <span className="text-white">)</span>
                  </div>
                  <div className="text-white pl-4">
                    <span className="text-purple-400">.execute</span>
                    <span className="text-white">(</span>
                    <span className="text-yellow-300">"hubspot"</span>
                    <span className="text-white">)</span>
                  </div>
                  <div className="text-white pl-4">
                    <span className="text-purple-400">.audit</span>
                    <span className="text-white">()</span>
                  </div>

                  <div className="text-gray-400 mt-6"># Result:</div>
                  <div className="text-green-400">✓ 47 contacts synced</div>
                  <div className="text-green-400">✓ 12 deals created</div>
                  <div className="text-green-400">✓ 100% approval rate</div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-6">
                <Workflow className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-semibold">Visual Builder</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Capsulas Framework
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Build complex workflows visually with drag-and-drop simplicity.
                Automate CRMs, email pipelines, data processing, and more with 29 pre-built capsules.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">29 Pre-Built Capsules</div>
                    <div className="text-gray-600">CRM, Email, Calendar, Slack, and more</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">80+ Provider Integrations</div>
                    <div className="text-gray-600">Connect with HubSpot, Salesforce, Gmail, etc.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">TypeScript-First</div>
                    <div className="text-gray-600">Type-safe, production-ready workflows</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Explore Builder
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/builder#demo"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black text-black rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  See CRM Demo
                  <Code className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why HubLab Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why HubLab?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're pioneering vibe coding - the practice of building production-ready applications
              with AI tools at unprecedented speed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">10x Faster</h3>
              <p className="text-gray-600 leading-relaxed">
                Ship products in hours, not months. AI-powered development accelerates every step
                of your workflow.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Production-Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                Clean, maintainable code that scales. Not just prototypes - real applications
                ready for production use.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Save Time & Money</h3>
              <p className="text-gray-600 leading-relaxed">
                Stop reinventing the wheel. Buy proven solutions or automate repetitive tasks
                with visual workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Build Faster?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers using HubLab to ship production-ready applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Browse Marketplace
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/builder"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              Try Builder Free
              <Workflow className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

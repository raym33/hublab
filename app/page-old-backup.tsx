'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockPrototypes, type Prototype } from '@/lib/mockData'
import {
  ArrowRight, ShoppingBag, Workflow, Code, Zap, TrendingUp, Clock, Check, Search, Star
} from 'lucide-react'

const CATEGORIES = ['All', 'Web App', 'Dashboard', 'Landing Page', 'Tool']

export default function HomePage() {
  const [prototypes] = useState<Prototype[]>(mockPrototypes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPrototypes = prototypes.filter(proto => {
    const matchSearch = proto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proto.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'All' || proto.category === selectedCategory
    return matchSearch && matchCategory
  }).slice(0, 6) // Show only first 6 for landing page

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
              <a
                href="#marketplace"
                className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Browse Marketplace
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#builder"
                className="px-8 py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Explore Builder
                <Workflow className="w-5 h-5" />
              </a>
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

      {/* Marketplace Section - EXPANDED */}
      <section id="marketplace" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold">Marketplace</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Vibe-Coded Prototypes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse production-ready applications built with AI tools like Cursor, v0, and Claude.
              Buy complete codebases and deploy instantly, or sell your own prototypes.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search prototypes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none font-medium"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none font-medium bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Prototypes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPrototypes.map((prototype) => (
              <Link
                key={prototype.id}
                href={`/prototype/${prototype.id}`}
                className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-black transition-all hover:shadow-xl"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                  {prototype.preview_image_url ? (
                    <img
                      src={prototype.preview_image_url}
                      alt={prototype.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900">
                      {prototype.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-black">
                      {prototype.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                      <span className="font-semibold">{prototype.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {prototype.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ${prototype.price}
                    </div>
                    <div className="text-sm text-gray-600">
                      {prototype.tech_stack?.slice(0, 2).join(' · ')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Production-Ready Code</h3>
              <p className="text-gray-600">Clean, well-structured, modern stack ready to deploy</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Deployment</h3>
              <p className="text-gray-600">Deploy to production in minutes with full documentation</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Full Source Code</h3>
              <p className="text-gray-600">Complete access to customize and extend as needed</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Join Waitlist to Sell Your Prototypes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Builder Section - EXPANDED */}
      <section id="builder" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-6">
              <Workflow className="w-5 h-5 text-purple-600" />
              <span className="text-purple-600 font-semibold">Visual Builder</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Capsulas Framework
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Build complex workflows visually with drag-and-drop simplicity.
              Automate CRMs, email pipelines, data processing, and more with 29 pre-built capsules.
            </p>
          </div>

          {/* CRM Demo */}
          <div className="mb-20">
            <div className="bg-white rounded-2xl border-2 border-black p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 border border-purple-300 rounded-full mb-4">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="font-mono text-xs font-bold text-purple-700">LIVE DEMO</span>
                  </div>

                  <h3 className="text-3xl font-mono font-bold mb-4">
                    CRM AGENT AUTOMATION
                  </h3>

                  <p className="font-mono text-gray-700 mb-6 leading-relaxed">
                    Automated CRM agent that watches your Gmail, Slack, and Calendar, then automatically
                    syncs contacts, creates deals, and updates your HubSpot/Salesforce CRM.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-mono font-bold text-sm">Event Watchers</div>
                        <div className="font-mono text-xs text-gray-600">Gmail, Calendar, Slack capsules</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-mono font-bold text-sm">AI Intent Classification</div>
                        <div className="font-mono text-xs text-gray-600">Reason-LLM + Intent Classifier</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-mono font-bold text-sm">CRM Integration</div>
                        <div className="font-mono text-xs text-gray-600">HubSpot, Salesforce capsules</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/crm/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-mono text-sm font-bold hover:bg-gray-800 transition-colors"
                  >
                    ❯ TRY LIVE DEMO
                  </Link>
                </div>

                <div>
                  <div className="bg-gray-900 rounded-lg p-6 font-mono text-xs border-2 border-black">
                    <div className="text-green-400 mb-3 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      WORKFLOW ACTIVE
                    </div>
                    <div className="space-y-2 text-gray-400">
                      <div className="text-purple-400"># capsulas.ts</div>
                      <div>
                        <span className="text-purple-400">watch</span>
                        <span className="text-white">(</span>
                        <span className="text-yellow-300">&quot;gmail&quot;</span>
                        <span className="text-white">)</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">.normalize</span>
                        <span className="text-white">()</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">.classify</span>
                        <span className="text-white">()</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">.reason</span>
                        <span className="text-white">()</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">.execute</span>
                        <span className="text-white">(</span>
                        <span className="text-yellow-300">&quot;hubspot&quot;</span>
                        <span className="text-white">)</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">.audit</span>
                        <span className="text-white">()</span>
                      </div>
                      <div className="mt-4 text-gray-500"># Result:</div>
                      <div className="text-green-400">✓ 47 contacts synced</div>
                      <div className="text-green-400">✓ 12 deals created</div>
                      <div className="text-green-400">✓ 100% approval rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capsules Grid */}
          <div className="mb-12">
            <h3 className="text-3xl font-mono font-bold mb-8 text-center">
              [29 PRE-BUILT CAPSULES]
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'AUTHENTICATION', desc: 'JWT · Sessions · OAuth 2.0 · API Keys' },
                { title: 'DATABASES', desc: 'PostgreSQL · MySQL · MongoDB · Redis' },
                { title: 'PAYMENTS', desc: 'Stripe · PayPal · Square · Braintree' },
                { title: 'EMAIL', desc: 'SendGrid · Mailgun · AWS SES · Postmark' },
                { title: 'SMS', desc: 'Twilio · AWS SNS · Vonage · MessageBird' },
                { title: 'PUSH NOTIFICATIONS', desc: 'Firebase · APNS · OneSignal' },
                { title: 'PDF GENERATOR', desc: 'Puppeteer · PDFKit · jsPDF' },
                { title: 'SEARCH', desc: 'Algolia · Elasticsearch · Meilisearch' },
                { title: 'CACHE', desc: 'Redis · Memcached · In-Memory' },
              ].map((capsule) => (
                <div
                  key={capsule.title}
                  className="border-2 border-black bg-white p-6 hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-mono font-bold text-sm mb-3">{capsule.title}</h4>
                  <p className="font-mono text-xs text-gray-600 leading-relaxed">{capsule.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Framework Stats */}
          <div className="bg-black text-white rounded-2xl p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-mono font-bold mb-2">29</div>
                <div className="text-sm font-mono text-gray-400 uppercase">Capsules</div>
              </div>
              <div>
                <div className="text-4xl font-mono font-bold mb-2">80+</div>
                <div className="text-sm font-mono text-gray-400 uppercase">Providers</div>
              </div>
              <div>
                <div className="text-4xl font-mono font-bold mb-2">70%</div>
                <div className="text-sm font-mono text-gray-400 uppercase">Time Saved</div>
              </div>
              <div>
                <div className="text-4xl font-mono font-bold mb-2">10K+</div>
                <div className="text-sm font-mono text-gray-400 uppercase">Lines of Code</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="https://github.com/hublabdev/capsulas-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg font-mono text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              ❯ VIEW FRAMEWORK ON GITHUB
            </a>
          </div>
        </div>
      </section>

      {/* Why HubLab Section */}
      <section className="py-20 px-6 bg-white">
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

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Build Faster?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers using HubLab to ship production-ready applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#marketplace"
              className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Browse Prototypes
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#builder"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              Explore Builder
              <Workflow className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

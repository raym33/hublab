'use client'

import Link from 'next/link'
import { Download, ExternalLink, Code2, Eye, Clock, Zap, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const examples = [
  {
    id: 'landing-page-saas',
    title: 'SaaS Landing Page',
    description: 'Complete landing page with hero, features, pricing, and CTA sections. Fully responsive with smooth animations.',
    category: 'Landing Page',
    buildTime: '5-10 min',
    lines: '350+',
    features: ['Responsive Navigation', 'Hero Section', 'Feature Cards', 'Pricing Tables', 'Contact Form', 'Footer'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
    demoUrl: '/examples/demo/landing-page-saas',
    codeUrl: '/examples/landing-page-saas.tsx',
    downloadUrl: '/examples/landing-page-saas.tsx',
    image: '/examples/preview-landing.png',
  },
  {
    id: 'dashboard-analytics',
    title: 'Analytics Dashboard',
    description: 'Professional admin dashboard with stats cards, charts, and data tables. Ready for Supabase/Firebase integration.',
    category: 'Dashboard',
    buildTime: '15-20 min',
    lines: '450+',
    features: ['KPI Cards', 'Data Visualization', 'Data Tables', 'Filters', 'Real-time Updates', 'Export Data'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    demoUrl: '/examples/demo/dashboard-analytics',
    codeUrl: '/examples/dashboard-analytics.tsx',
    downloadUrl: '/examples/dashboard-analytics.tsx',
    image: '/examples/preview-dashboard.png',
  },
  {
    id: 'ecommerce-store',
    title: 'E-commerce Store',
    description: 'Full-featured online store with product catalog, cart, checkout, and order management.',
    category: 'E-commerce',
    buildTime: '20-25 min',
    lines: '600+',
    features: ['Product Grid', 'Shopping Cart', 'Checkout Flow', 'Order Tracking', 'Search & Filters', 'Payment Integration'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Stripe'],
    demoUrl: '/examples/demo/ecommerce-store',
    codeUrl: '/examples/ecommerce-store.tsx',
    downloadUrl: '/examples/ecommerce-store.tsx',
    image: '/examples/preview-ecommerce.png',
  },
]

const stats = [
  { label: 'Total Examples', value: '10+' },
  { label: 'Lines of Code', value: '5,000+' },
  { label: 'Avg Build Time', value: '15 min' },
  { label: 'Production Ready', value: '100%' },
]

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Landing Page', 'Dashboard', 'E-commerce', 'Admin Panel', 'Portfolio']

  const filteredExamples = selectedCategory === 'All'
    ? examples
    : examples.filter(ex => ex.category === selectedCategory)

  const handleDownload = (url: string, filename: string) => {
    // Create download link
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Code Examples</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Real production code exported from HubLab. Download, customize, and deploy in minutes.
            All examples are fully functional and include complete source code.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Examples Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {filteredExamples.length === 0 ? (
          <div className="text-center py-16">
            <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No examples found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredExamples.map((example) => (
              <div
                key={example.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Preview Image */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-48 flex items-center justify-center border-b border-gray-200">
                  <div className="text-center">
                    <Code2 className="w-16 h-16 text-blue-600 mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-gray-600">Preview coming soon</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{example.title}</h3>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {example.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{example.description}</p>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{example.buildTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      <span>{example.lines} lines</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {example.features.slice(0, 4).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {example.features.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{example.features.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {example.techStack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={example.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      <Code2 className="w-4 h-4" />
                      View Code
                    </a>
                    <button
                      onClick={() => handleDownload(example.downloadUrl, `${example.id}.tsx`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* More Coming Soon */}
        <div className="mt-16 text-center bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
          <Zap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">More Examples Coming Soon</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're constantly adding new production-ready examples. Sign up to get notified when new examples are available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/studio-v2"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Start Building
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/integrations"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              View Integrations
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

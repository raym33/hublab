'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockPrototypes, getPrototypesByCategory, searchPrototypes, type Prototype } from '@/lib/mockData'
import {
  Search, ArrowRight, Code, Zap, Shield,
  TrendingUp, Users, Clock, Check, ChevronDown,
  ArrowUpRight, Minus, Plus, Star
} from 'lucide-react'
import DitherEffect from '@/components/DitherEffect'

const CATEGORIES = [
  'All',
  'Web App',
  'Dashboard',
  'Landing Page',
  'Tool',
]

export default function Home() {
  const [prototypes] = useState<Prototype[]>(mockPrototypes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFAQ, setShowFAQ] = useState<number | null>(null)

  const filteredPrototypes = prototypes.filter(proto => {
    const matchSearch = proto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proto.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'All' || proto.category === selectedCategory
    return matchSearch && matchCategory
  })

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Fast Development',
      description: 'Ship products in hours, not months. AI-powered development.'
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: 'Clean Code',
      description: 'Production-ready, well-structured, modern codebase.'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Secure Payments',
      description: 'Enterprise-grade security with Stripe integration.'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Scalable',
      description: 'Built to grow. From MVP to enterprise scale.'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Community',
      description: 'Join thousands of developers building the future.'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Save Time',
      description: 'Stop reinventing. Start building what matters.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Founder, TechStart',
      content: 'We launched our MVP in 2 days with a prototype from HubLab. Incredible value.',
    },
    {
      name: 'Michael Torres',
      role: 'Developer',
      content: 'I\'ve sold 5 prototypes and generated $2,500 in passive income. Game changer.',
    },
    {
      name: 'Alex Kumar',
      role: 'CTO, ScaleUp',
      content: 'The code quality is excellent. We saved 3 months of development time.',
    }
  ]

  const faqs = [
    {
      question: 'What is a vibe-coded prototype?',
      answer: 'Applications built rapidly using AI tools like Cursor, v0, and Claude. Production-ready code you can customize and deploy.'
    },
    {
      question: 'How does purchasing work?',
      answer: 'Select a prototype, pay securely via Stripe, and download the complete source code immediately. Includes documentation and commercial license.'
    },
    {
      question: 'Can I sell my own prototypes?',
      answer: 'Yes. Create an account, upload your code with preview, set your price, and start earning. We take a 15% commission per sale.'
    },
    {
      question: 'What\'s included with each prototype?',
      answer: 'Complete source code, documentation, setup instructions, and commercial use license. Everything you need to customize and launch.'
    },
    {
      question: 'Is there support after purchase?',
      answer: 'Sellers may offer optional support. All code comes well-documented for self-service or team implementation.'
    },
    {
      question: 'How much can I earn selling?',
      answer: 'It depends on your portfolio. Some sellers earn $500/month with 2-3 prototypes. Top sellers reach $5,000+/month.'
    }
  ]

  const sampleCode = `const createPrototype = async () => {
  const prototype = await ai.generate({
    prompt: "Build a dashboard",
    stack: ["Next.js", "Tailwind", "Supabase"]
  })

  const features = await prototype.addFeatures([
    "authentication",
    "payments",
    "analytics"
  ])

  await deploy(prototype)

  return {
    url: prototype.url,
    status: "deployed",
    features: features.count
  }
}`

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <h1 className="text-6xl md:text-8xl font-light tracking-tight text-gray-900 mb-8">
                Build better.
                <br />
                <span className="text-gray-400">Build faster.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl font-light">
                The marketplace for AI-generated prototypes.
                From concept to production in hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#marketplace"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-none transition-colors duration-200"
                >
                  Browse Prototypes
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="/waitlist"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-900 bg-white border border-gray-900 hover:bg-gray-50 rounded-none transition-colors duration-200"
                >
                  Start Selling (soon)
                </Link>
              </div>
            </div>

            {/* Dithered Code Animation */}
            <div className="hidden md:block">
              <div className="border-2 border-gray-900 bg-black shadow-2xl h-96">
                <DitherEffect
                  code={sampleCode}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Minimal stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-24 border-t border-gray-200">
            <div>
              <div className="text-3xl font-light text-gray-900">500+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">Prototypes</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900">2K+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">Developers</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900">$50K+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">Sales</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900">24h</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">Avg. Build Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Minimal */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600 font-light">Simple. Transparent. Effective.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-8">For Buyers</h3>
              <div className="space-y-8">
                {['Search', 'Purchase', 'Download', 'Deploy'].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{step}</h4>
                      <p className="text-gray-600 text-sm">
                        {i === 0 && 'Find the perfect prototype for your needs'}
                        {i === 1 && 'Secure payment through Stripe'}
                        {i === 2 && 'Get complete source code instantly'}
                        {i === 3 && 'Customize and launch your product'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-8">For Sellers</h3>
              <div className="space-y-8">
                {['Create', 'Upload', 'Price', 'Earn'].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{step}</h4>
                      <p className="text-gray-600 text-sm">
                        {i === 0 && 'Build with AI tools rapidly'}
                        {i === 1 && 'Package your code and documentation'}
                        {i === 2 && 'Set your own pricing'}
                        {i === 3 && 'Keep 85% of every sale'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Grid Minimal */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Why HubLab</h2>
            <p className="text-xl text-gray-600 font-light">Built for the AI development era.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1 border border-gray-200">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-12 border-r border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="text-gray-900 mb-6">{feature.icon}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section - Minimal */}
      <section id="marketplace" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Featured Prototypes</h2>
            <p className="text-xl text-gray-600 font-light">Ready to customize and deploy.</p>
          </div>

          {/* Search */}
          <div className="mb-12">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prototypes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-8 mb-12">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Prototypes Grid */}
          {filteredPrototypes.length === 0 ? (
            <div className="text-center py-24 bg-white border border-gray-200">
              <p className="text-gray-900 text-lg mb-2">No prototypes found</p>
              <p className="text-gray-600">Try different filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 border border-gray-200">
                {filteredPrototypes.map(proto => (
                  <Link
                    key={proto.id}
                    href={`/prototype/${proto.id}`}
                    className="group bg-white hover:bg-gray-50 transition-colors duration-200 border-r border-b border-gray-200"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {proto.preview_image_url ? (
                        <Image
                          src={proto.preview_image_url}
                          alt={proto.title}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Code className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 text-xs font-light">
                        {proto.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                          <span className="text-sm font-light">{proto.rating}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500 font-light">{proto.downloads} downloads</span>
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
                        {proto.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light">
                        {proto.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {proto.tech_stack.slice(0, 3).map(tech => (
                          <span key={tech} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 font-light">
                            {tech}
                          </span>
                        ))}
                        {proto.tech_stack.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 font-light">
                            +{proto.tech_stack.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-2xl font-light text-gray-900">
                          ${proto.price}
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors duration-200" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-16">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center text-gray-900 hover:text-gray-600 font-medium transition-colors duration-200"
                >
                  View all prototypes
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials - Minimal */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Testimonials</h2>
            <p className="text-xl text-gray-600 font-light">From our community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="border-l border-gray-200 pl-8">
                <p className="text-gray-600 mb-8 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Minimal */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-xl text-gray-600 font-light">No hidden fees. No subscriptions.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-1 max-w-4xl border border-gray-200">
            <div className="p-12 bg-white">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">For Buyers</h3>
              <div className="text-5xl font-light text-gray-900 mb-4">$0</div>
              <p className="text-gray-600 mb-8">No additional costs</p>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Full marketplace access</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Instant downloads</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Complete source code</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Commercial license</span>
                </li>
              </ul>
            </div>

            <div className="p-12 bg-white border-l border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">For Sellers</h3>
              <div className="text-5xl font-light text-gray-900 mb-4">15%</div>
              <p className="text-gray-600 mb-8">Commission per sale</p>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Keep 85% of revenue</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">No setup costs</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Direct payments via Stripe</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Sales analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Minimal */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">FAQ</h2>
            <p className="text-xl text-gray-600 font-light">Everything you need to know.</p>
          </div>

          <div className="space-y-1 border-t border-gray-200">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200">
                <button
                  onClick={() => setShowFAQ(showFAQ === i ? null : i)}
                  className="w-full py-8 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 px-2"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {showFAQ === i ? (
                    <Minus className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showFAQ === i && (
                  <div className="pb-8 px-2">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8">
            Ready to start?
          </h2>
          <p className="text-xl text-gray-400 mb-12 font-light">
            Join the AI development revolution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#marketplace"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Marketplace
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-transparent border border-white hover:bg-white hover:text-gray-900 transition-colors duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
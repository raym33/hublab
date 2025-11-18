'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Code, Palette, Rocket, CheckCircle, Play, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">HubLab</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">Docs</Link>
              <Link href="/examples" className="text-gray-600 hover:text-gray-900 transition-colors">Examples</Link>
              <Link href="/components" className="text-gray-600 hover:text-gray-900 transition-colors">Components</Link>
              <Link href="/studio-v2" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                12-16x faster than traditional coding
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Build Production Apps in{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  30 Minutes
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform ideas into deployed applications using visual builders, AI compilation, or programmatic APIs.
                Choose your workflow—we handle the complexity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/studio-v2"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/examples"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-gray-200"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  No credit card
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  100% open source
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  2,500+ developers
                </div>
              </div>
            </div>

            {/* Right Column - Interactive Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-white rounded-lg text-xs text-gray-600">
                      studio-v2.hublab.dev
                    </div>
                  </div>
                </div>

                {/* Demo Content */}
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg animate-pulse">
                    <div className="w-24 h-4 bg-blue-200 rounded"></div>
                    <div className="w-16 h-8 bg-blue-300 rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg">
                        <div className="w-full h-16 bg-gray-200 rounded mb-2"></div>
                        <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="w-32 h-4 bg-green-200 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-green-100 rounded"></div>
                      <div className="w-5/6 h-3 bg-green-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-6 py-4 border border-gray-200">
                <div className="text-sm text-gray-600">Build time</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ~30min
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Ways to Build
            </h2>
            <p className="text-xl text-gray-600">
              Choose the workflow that fits your style
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Visual Builder */}
            <Link href="/studio-v2" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all border-2 border-blue-200 hover:border-blue-400">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Visual Builder
                </h3>
                <p className="text-gray-600 mb-6">
                  Drag, drop, and configure components visually. No code required. Perfect for designers and rapid prototyping.
                </p>
                <div className="text-blue-600 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                  Try Studio V2
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* AI Compiler */}
            <Link href="/compiler" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all border-2 border-green-200 hover:border-green-400">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI Compiler
                </h3>
                <p className="text-gray-600 mb-6">
                  Describe your app in plain English. AI generates production-ready code using our component library.
                </p>
                <div className="text-green-600 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                  Try AI Compiler
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* API Access */}
            <Link href="/docs" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Programmatic API
                </h3>
                <p className="text-gray-600 mb-6">
                  Integrate HubLab into your workflow via REST API. Perfect for automation and custom tooling.
                </p>
                <div className="text-purple-600 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                  View API Docs
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">8,150+</div>
              <div className="text-blue-100">Ready Components</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">65+</div>
              <div className="text-blue-100">Categories</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">30min</div>
              <div className="text-blue-100">To Deployment</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Code Ownership</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Ship Fast
            </h2>
            <p className="text-xl text-gray-600">
              Production-ready features out of the box
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Rocket className="w-6 h-6" />,
                title: 'One-Command Deploy',
                desc: 'Export to Vercel or Netlify with a single command. No configuration needed.'
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: 'Theme System',
                desc: '6 pre-built themes. Customize colors, fonts, and spacing globally.'
              },
              {
                icon: <Code className="w-6 h-6" />,
                title: 'Clean Code Export',
                desc: 'TypeScript + React + Tailwind CSS. No proprietary lock-in.'
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Production Ready',
                desc: 'Error handling, loading states, accessibility, and responsive design included.'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Real-time Preview',
                desc: 'See your changes instantly. What you see is what you get.'
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Built for Teams',
                desc: 'Export and share components. Collaborate with your team seamlessly.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Build 12x Faster?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join 2,500+ developers shipping apps in record time
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/studio-v2"
              className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl"
            >
              Start Building Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>

            <Link
              href="/getting-started"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-gray-200"
            >
              View Getting Started Guide
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            No credit card required • 100% free and open source • Deploy anywhere
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">HubLab</span>
              </div>
              <p className="text-gray-400 text-sm">
                Build production apps in 30 minutes. Visual builder, AI compiler, and programmatic API.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="/studio-v2" className="block text-gray-400 hover:text-white transition-colors">Studio V2</Link>
                <Link href="/compiler" className="block text-gray-400 hover:text-white transition-colors">AI Compiler</Link>
                <Link href="/components" className="block text-gray-400 hover:text-white transition-colors">Components</Link>
                <Link href="/templates" className="block text-gray-400 hover:text-white transition-colors">Templates</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link href="/docs" className="block text-gray-400 hover:text-white transition-colors">Documentation</Link>
                <Link href="/getting-started" className="block text-gray-400 hover:text-white transition-colors">Getting Started</Link>
                <Link href="/examples" className="block text-gray-400 hover:text-white transition-colors">Examples</Link>
                <Link href="/faq" className="block text-gray-400 hover:text-white transition-colors">FAQ</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-sm">
                <a href="https://github.com/raym33/hublab" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">GitHub</a>
                <a href="https://x.com/hublabdev" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">Twitter</a>
                <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 HubLab. Open source under MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

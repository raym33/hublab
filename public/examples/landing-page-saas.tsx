// ============================================
// SAAS LANDING PAGE - EXPORTED FROM HUBLAB
// Complete, production-ready Next.js component
// Built in: 5-10 minutes with HubLab
// ============================================

'use client'

import { useState } from 'react'
import { Check, X, Menu, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react'

export default function SaaSLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add your form submission logic here
    console.log('Email submitted:', email)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              YourSaaS
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">New: AI-Powered Features</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Build Amazing Products
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              10x Faster
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            The all-in-one platform that helps teams collaborate, build, and ship products faster than ever before.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-lg hover:border-gray-900 transition font-semibold text-lg">
              Watch Demo
            </button>
          </div>

          <p className="text-sm text-gray-500">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help your team work smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized for speed and performance. Your users will love the experience.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Enterprise-grade security with end-to-end encryption and compliance.',
              },
              {
                icon: Sparkles,
                title: 'AI-Powered',
                description: 'Smart automation that learns from your workflow and saves time.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '29',
                features: ['Up to 5 users', '10 GB storage', 'Basic support', 'Core features'],
              },
              {
                name: 'Pro',
                price: '99',
                features: ['Up to 50 users', '100 GB storage', 'Priority support', 'Advanced features', 'API access'],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: '299',
                features: ['Unlimited users', 'Unlimited storage', '24/7 support', 'Custom features', 'Dedicated account manager'],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular ? 'border-2 border-blue-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using our platform
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Start Free Trial
            </button>
          </form>
          <p className="text-sm text-blue-100 mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 YourSaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

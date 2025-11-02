'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">AI-Powered Development</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Build React Apps with
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Capsules
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Transform your ideas into production-ready React applications in seconds.
          </p>

          {/* CTA Button */}
          <Link
            href="/studio-v2"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start Building
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">© 2024 HubLab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight, Zap, Code2, Rocket, Wand2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-white">AI-Powered App Generation</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Describe your app.<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              AI builds it.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Write in natural language what you need. Our AI compiler generates complete React code,
            with live preview, ready to download.
          </p>

          {/* CTA */}
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            Join the Waitlist
            <ArrowRight className="w-6 h-6" />
          </Link>

          {/* Example */}
          <p className="text-sm text-gray-500 mt-6">
            Example: "Create a todo app with drag & drop, categories and dark mode"
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              This simple
            </h2>
            <p className="text-xl text-gray-400">
              From idea to functional app in 30 seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Wand2 className="w-7 h-7 text-white" />
              </div>
              <div className="text-6xl font-bold text-white/10 mb-4">01</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Describe your app
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Write in natural language what you want to create. Be specific:
                features, design, behavior.
              </p>
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 font-mono">
                  "A dashboard with real-time charts, exportable data table, and dynamic filters"
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-6xl font-bold text-white/10 mb-4">02</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                AI generates code
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Our AI compiler analyzes your prompt, selects the necessary components,
                and generates production-ready React code.
              </p>
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-purple-400 font-mono">
                  ✓ React + TypeScript<br />
                  ✓ Tailwind CSS<br />
                  ✓ Optimized components
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div className="text-6xl font-bold text-white/10 mb-4">03</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Preview & download
              </h3>
              <p className="text-gray-400 leading-relaxed">
                See the result live, iterate with AI to improve it,
                and download the complete code ready to deploy.
              </p>
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-green-400 font-mono">
                  ✓ Real-time preview<br />
                  ✓ AI chat for improvements<br />
                  ✓ Complete .zip download
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              More than just code generation
            </h2>
            <p className="text-xl text-gray-400">
              A complete compiler with professional tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Monaco Editor (VS Code)</h3>
              </div>
              <p className="text-gray-300">
                Integrated professional code editor. Syntax highlighting, autocomplete,
                and all VS Code features in the browser.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Live Preview</h3>
              </div>
              <p className="text-gray-300">
                See your app running in real-time. Secure sandbox with iframe,
                console output, and responsive design testing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Iterative AI Chat</h3>
              </div>
              <p className="text-gray-300">
                Improve your app by chatting with AI. "Make it responsive", "Add dark mode",
                "Improve the colors" - all without writing code.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Professional Templates</h3>
              </div>
              <p className="text-gray-300">
                Start with pre-made templates: dashboards, landing pages, e-commerce,
                SaaS apps. Customize them with AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What you can create
            </h2>
            <p className="text-xl text-gray-400">
              From MVPs to complex prototypes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-lg font-bold text-white mb-2">Todo Apps</h4>
              <p className="text-sm text-gray-400">
                With drag & drop, categories, filters, localStorage, dark mode
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-lg font-bold text-white mb-2">Dashboards</h4>
              <p className="text-sm text-gray-400">
                With interactive charts, data tables, CSV export
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">🛍️</div>
              <h4 className="text-lg font-bold text-white mb-2">E-commerce</h4>
              <p className="text-sm text-gray-400">
                Product catalogs, shopping cart, checkout flows
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-lg font-bold text-white mb-2">Landing Pages</h4>
              <p className="text-sm text-gray-400">
                With hero sections, features, pricing, testimonials, CTAs
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">🔐</div>
              <h4 className="text-lg font-bold text-white mb-2">Auth Flows</h4>
              <p className="text-sm text-gray-400">
                Login, signup, password reset, social auth, protected routes
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-lg font-bold text-white mb-2">Chat Apps</h4>
              <p className="text-sm text-gray-400">
                Real-time messaging, groups, notifications, typing indicators
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to create?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Generate your first app in less than a minute
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            Join Early Access
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-gray-500 mt-8">
            Be the first to try • Early access benefits • Limited spots
          </p>
        </div>
      </section>
    </div>
  )
}

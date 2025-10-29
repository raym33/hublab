'use client'

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div id="hero" className="relative pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-black p-8 mb-8">
            <div className="flex items-center gap-2 mb-4 text-sm font-mono font-bold">
              <span className="inline-block w-2 h-2 bg-green-500"></span>
              <span>SYSTEM ONLINE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-mono font-bold mb-6 leading-tight">
              VISUAL WORKFLOW<br />BUILDER
            </h1>

            <p className="text-lg sm:text-xl font-mono font-semibold text-gray-700 leading-relaxed max-w-2xl mb-8">
              Production-ready applications with drag & drop simplicity.
              29 capsules. 80+ providers. TypeScript-first.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/hublabdev/capsulas-framework"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-black text-white font-mono text-sm font-bold hover:bg-gray-800 transition-colors border-2 border-black text-center"
              >
                ❯ VIEW FRAMEWORK
              </a>
              <a
                href="https://github.com/hublabdev/capsulas-framework"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-black font-mono text-sm font-bold hover:bg-gray-50 transition-colors text-center"
              >
                DOCUMENTATION
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-xs font-mono font-bold text-gray-600">
              <span>⭢ NO CREDIT CARD</span>
              <span>⭢ FREE FOREVER</span>
              <span>⭢ OPEN SOURCE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-20 px-6 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-mono font-bold mb-4">
              [CAPSULES]
            </h2>
            <p className="font-mono font-semibold text-gray-700">
              29 production-ready modules across 5 categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'AUTHENTICATION', desc: 'JWT · Sessions · OAuth 2.0 · API Keys · SAML' },
              { title: 'DATABASES', desc: 'PostgreSQL · MySQL · MongoDB · SQLite · Redis' },
              { title: 'PAYMENTS', desc: 'Stripe · PayPal · Square · Braintree' },
              { title: 'EMAIL', desc: 'SendGrid · Mailgun · AWS SES · Postmark' },
              { title: 'SMS', desc: 'Twilio · AWS SNS · Vonage · MessageBird' },
              { title: 'PUSH NOTIFICATIONS', desc: 'Firebase · APNS · OneSignal · Expo' },
              { title: 'PDF GENERATOR', desc: 'Puppeteer · PDFKit · jsPDF · html-pdf' },
              { title: 'SEARCH', desc: 'Algolia · Elasticsearch · Meilisearch' },
              { title: 'CACHE', desc: 'Redis · Memcached · In-Memory' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="border-2 border-black p-6 bg-white hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-mono font-bold text-sm mb-3">{feature.title}</h3>
                <p className="font-mono text-xs font-semibold text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="py-20 px-6 bg-black text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-mono font-bold mb-12">
            [METRICS]
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'CAPSULES', value: '29' },
              { label: 'PROVIDERS', value: '80+' },
              { label: 'TIME SAVED', value: '70%' },
              { label: 'LINES OF CODE', value: '10K+' }
            ].map((stat) => (
              <div key={stat.label} className="border-2 border-white p-6">
                <div className="font-mono font-bold text-xs mb-2">{stat.label}</div>
                <div className="font-mono text-4xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-mono font-bold mb-4">
            [TECHNOLOGIES]
          </h2>
          <p className="font-mono font-semibold text-gray-700 mb-12">
            Built on top of industry-standard tools and services
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              'TypeScript', 'Node.js', 'React', 'PostgreSQL', 'MongoDB',
              'Redis', 'Stripe', 'AWS', 'Firebase', 'Twilio',
              'SendGrid', 'Vercel', 'Netlify', 'Docker', 'GitHub'
            ].map((tech) => (
              <div key={tech} className="border-2 border-black p-4 bg-white text-center font-mono text-sm font-bold hover:bg-black hover:text-white transition-colors">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div id="use-cases" className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-mono font-bold mb-12">
            [USE CASES]
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'RAPID PROTOTYPING',
                desc: 'Build and test MVPs in hours, not weeks. Perfect for startups validating ideas quickly.'
              },
              {
                title: 'ENTERPRISE APPS',
                desc: 'Production-grade code with full type safety. Scale from prototype to millions of users.'
              },
              {
                title: 'LEARNING & TEACHING',
                desc: 'Visual workflows make it easy to understand complex architectures. Great for education.'
              },
              {
                title: 'INTERNAL TOOLS',
                desc: 'Build custom dashboards, admin panels, and automation tools for your team.'
              }
            ].map((useCase) => (
              <div key={useCase.title} className="border-2 border-black p-8 bg-white hover:bg-gray-50 transition-colors">
                <h3 className="text-xl font-mono font-bold mb-4">{useCase.title}</h3>
                <p className="font-mono text-sm font-semibold text-gray-700 leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 bg-black text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl sm:text-5xl font-mono font-bold mb-6">
            READY TO BUILD?
          </h2>
          <p className="text-xl font-mono font-semibold mb-10 text-gray-300">
            Join developers building faster with visual workflows.<br />
            Start free. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/hublabdev/capsulas-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black font-mono text-sm font-bold hover:bg-gray-100 transition-colors text-center"
            >
              ❯ VIEW FRAMEWORK
            </a>
            <a
              href="https://github.com/hublabdev/capsulas-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white font-mono text-sm font-bold hover:bg-white hover:text-black transition-colors text-center"
            >
              VIEW ON GITHUB
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 font-mono text-xs font-bold text-gray-500">
            <span>✓ FREE FOREVER</span>
            <span>✓ NO CREDIT CARD</span>
            <span>✓ OPEN SOURCE</span>
            <span>✓ EXPORT CODE</span>
          </div>
        </div>
      </div>
    </div>
  )
}

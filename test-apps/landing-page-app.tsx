'use client'

import React from 'react'
import Card from '@/components/capsules/Card'
import Button from '@/components/capsules/Button'
import Badge from '@/components/capsules/Badge'
import Tooltip from '@/components/capsules/Tooltip'
import Accordion from '@/components/capsules/Accordion'

/**
 * Test App 5: Landing Page
 * Tests: Marketing components, presentation UI, user engagement
 * Components: 5
 * Expected: Engaging landing page with interactive elements
 */

export default function LandingPageApp() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <Badge text="New Feature" variant="success" />
          <h1 className="text-6xl font-bold mt-6 mb-6">
            Build Amazing Apps
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              With AI Capsules
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create production-ready React applications in seconds using our intelligent component system
          </p>
          <div className="flex gap-4 justify-center">
            <Button text="Get Started" variant="primary" size="lg" />
            <Button text="Learn More" variant="secondary" size="lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge text="Features" variant="default" />
            <h2 className="text-4xl font-bold mt-4">Everything You Need</h2>
            <p className="text-gray-600 mt-4">Powerful features to build your dream application</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card
              title="125+ Components"
              content="Choose from a massive library of pre-built, customizable React components"
            />
            <Card
              title="AI-Powered"
              content="Intelligent suggestions and automatic code generation to speed up development"
            />
            <Card
              title="Production Ready"
              content="Export clean, optimized code that's ready to deploy to production"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Tooltip text="Learn More" tooltip="Click to discover TypeScript support" />
              <Card
                title="TypeScript"
                content="Full TypeScript support with type safety"
              />
            </div>
            <div className="text-center">
              <Tooltip text="Learn More" tooltip="Real-time visual feedback as you build" />
              <Card
                title="Live Preview"
                content="See your components in action before exporting"
              />
            </div>
            <div className="text-center">
              <Tooltip text="Learn More" tooltip="Works perfectly on all devices" />
              <Card
                title="Responsive"
                content="Mobile-first design that works everywhere"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge text="FAQ" variant="warning" />
            <h2 className="text-4xl font-bold mt-4">Frequently Asked Questions</h2>
          </div>

          <Accordion items={[
            {
              title: 'What is HubLab Studio?',
              content: 'HubLab Studio is a visual development platform that lets you build React applications using pre-built components called capsules. Simply drag, drop, and export production-ready code.'
            },
            {
              title: 'Do I need coding experience?',
              content: 'Not at all! HubLab Studio is designed for both beginners and experienced developers. The visual interface makes it easy to build apps without writing code, but you can also customize the generated code if needed.'
            },
            {
              title: 'What can I build with HubLab?',
              content: 'You can build dashboards, landing pages, admin panels, chat interfaces, forms, and much more. With 125+ components across categories like UI, charts, forms, AI/ML, and media, the possibilities are endless.'
            },
            {
              title: 'Can I use the exported code commercially?',
              content: 'Yes! The code you export from HubLab Studio is yours to use however you like, including in commercial projects.'
            },
            {
              title: 'Is it mobile-friendly?',
              content: 'Absolutely! HubLab Studio and all generated code are fully responsive and optimized for mobile devices.'
            }
          ]} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of developers creating amazing apps with HubLab Studio
          </p>
          <div className="flex gap-4 justify-center">
            <Button text="Start Free Trial" variant="secondary" size="lg" />
            <Button text="View Pricing" variant="outline" size="lg" />
          </div>
        </div>
      </section>
    </div>
  )
}

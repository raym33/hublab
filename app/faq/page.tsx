'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export default function FAQPage() {
  const [showFAQ, setShowFAQ] = useState<number | null>(null)

  const generalFaqs = [
    {
      question: 'What is a vibe-coded prototype?',
      answer: 'Applications built rapidly using AI tools like Cursor, v0, and Claude. Production-ready code you can customize and deploy immediately.'
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

  const vibeCodingFaqs = [
    {
      question: 'What is Vibe Coding and how does HubLab contribute to it?',
      answer: 'Vibe coding is the practice of rapidly building applications using AI tools (Cursor, v0, Lovable, Claude). HubLab contributes by providing a monetization pipeline, component marketplace, and living documentation for production-ready vibe coding patterns. We solve the "what next?" problem after you build a prototype with AI.'
    },
    {
      question: 'What makes HubLab different from traditional code marketplaces?',
      answer: 'HubLab is both a marketplace for AI-generated prototypes AND a showcase of advanced vibe coding (our Ambient Agent CRM). Unlike npm or GitHub, we focus on outcome reuse via blocks + agentic patterns. Our Blocks System acts as a Prompt Library 2.0 - instead of prompting "create a pricing table" you install a pre-built block in 2 minutes vs 15 minutes of prompting and debugging.'
    },
    {
      question: 'How does HubLab accelerate vibe coding development?',
      answer: 'Through our Blocks System: pre-built React components with JSON schemas optimized for AI consumption. Instead of pure prompting, you browse marketplace → install blocks → chain them like LEGO. This composability is faster than prompting from scratch while maintaining AI-friendly architecture that LLMs can easily understand and modify.'
    },
    {
      question: 'What is the Ambient Agent CRM and why is it significant?',
      answer: 'Our Ambient Agent CRM is proof-of-concept for agentic apps built with vibe coding. It watches Gmail, Calendar, and Slack, uses LLM reasoning to extract entities, and auto-updates HubSpot/Salesforce with human-in-the-loop approval. It demonstrates AI agents as first-class citizens in app architecture - not just "AI wrote the code" but AI runs parts of the system at runtime. Features include OAuth flows, LLM integration, event processing, and Model Context Protocol (MCP).'
    },
    {
      question: 'How does HubLab create network effects for vibe coders?',
      answer: 'The feedback loop works like this: Vibe Coder builds prototype with Cursor → Lists on HubLab → Earns revenue → Buys components from others → Ships faster → Repeats. More vibers create more prototypes and reusable blocks. Best practices emerge organically via ratings, and the "vibe coding stack" converges (Next.js + Supabase + Tailwind dominates).'
    },
    {
      question: 'Can vibe-coded projects be production-ready and enterprise-grade?',
      answer: 'Absolutely. HubLab demonstrates this with features like Row Level Security (multi-tenant from day 1), OAuth integrations for enterprise CRM connections, audit logs for compliance (GDPR, SOC2), Stripe payments for real business models, and deployment guides for Vercel/Netlify. Our message: "You can vibe code AND ship serious products."'
    },
    {
      question: 'What is the Capsules Framework?',
      answer: 'The Capsules Framework is our modular approach to building AI-native apps. It includes modular agents (watcher-gmail, normalizer, intent-classifier), composability with MCP (Model Context Protocol), schema-driven everything, and human guardrails where needed. It\'s a framework for building apps with AI as runtime components, not just using AI to build traditional apps.'
    },
    {
      question: 'How do vibe coders actually use HubLab?',
      answer: 'Three main scenarios: 1) Weekend Launcher: Browse HubLab → Install blocks (hero, pricing, testimonials) → Configure props → Connect Stripe → Deploy (Friday to Monday launch). 2) Block Creator: Build excellent component → List for $19 → Sell 50 copies = $950 passive → Buy other blocks → Ship client projects 3x faster. 3) Agency: Subscribe to Agency Bundle ($149/mo) → Access 200+ premium blocks → Mix & match for clients → 10x throughput vs pure prompting.'
    },
    {
      question: 'What impact could HubLab have on the vibe coding movement?',
      answer: 'We\'re accelerating maturity (from toy to tool), enabling specialization (block creators focus on craft, integrators compose full apps), and creating economic sustainability (passive income for creators, time savings for buyers). Short term (6-12 months): more vibe marketplaces emerge, stack standardizes, AI IDEs integrate marketplace browsing. Medium term (1-2 years): agentic apps become normal, frameworks mature. Long term (3-5 years): traditional coding vs vibe coding blurs, all apps have AI agents inside.'
    },
    {
      question: 'What makes HubLab\'s approach "meta-vibe"?',
      answer: 'HubLab is vibe coding infrastructure built with vibe coding: the marketplace itself was vibe-coded, it sells vibe-coded prototypes, and docs are AI-polished but human-curated. It\'s recursively self-improving - as better blocks emerge, HubLab gets rebuilt with them. We\'re proving that vibe-coded projects can be production-ready, monetizable, and sophisticated (OAuth, RLS, audit logs, LLM orchestration).'
    },
    {
      question: 'What are the main challenges for vibe coding marketplaces?',
      answer: 'Three key challenges: 1) Will vibers actually buy blocks? (Our bet: senior devs will pay $19 to save 30 minutes). 2) Quality control: ensuring uploaded blocks are robust despite "ship fast" ethos. 3) The "Good Enough" Paradox: tension between vibe ethos (iterate later) and production quality needs for marketplace components.'
    },
    {
      question: 'What\'s the ultimate vision for vibe coding?',
      answer: 'The ultimate vibe: Describe business logic → LLM executes it at runtime. Not just "AI writes code" but "AI is a component in the runtime system." HubLab aims to be npm for the AI era - providing economic model (marketplace), acceleration (reusable blocks), maturity (production patterns), and direction (agentic apps as evolution). We\'re the counter-narrative to "vibe coding = toys."'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about HubLab, vibe coding, and building with AI.
          </p>
        </div>
      </section>

      {/* General FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">General Questions</h2>
          <p className="text-lg text-gray-600 mb-12">Basic information about the platform.</p>

          <div className="space-y-1 border-t border-gray-200">
            {generalFaqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200">
                <button
                  onClick={() => setShowFAQ(showFAQ === i ? null : i)}
                  className="w-full py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 px-4"
                >
                  <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                  {showFAQ === i ? (
                    <Minus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {showFAQ === i && (
                  <div className="pb-6 px-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe Coding FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vibe Coding & AI Development</h2>
          <p className="text-lg text-gray-600 mb-12">Deep dive into HubLab's contribution to the vibe coding movement.</p>

          <div className="space-y-1 border-t border-gray-200 bg-white">
            {vibeCodingFaqs.map((faq, i) => {
              const faqIndex = i + generalFaqs.length
              return (
                <div key={faqIndex} className="border-b border-gray-200">
                  <button
                    onClick={() => setShowFAQ(showFAQ === faqIndex ? null : faqIndex)}
                    className="w-full py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 px-4"
                  >
                    <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                    {showFAQ === faqIndex ? (
                      <Minus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {showFAQ === faqIndex && (
                    <div className="pb-6 px-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community or reach out to our team.
          </p>
          <a
            href="mailto:hublab@outlook.es"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}

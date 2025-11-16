'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function DocsPage() {
  useEffect(() => {
    // Add JSON-LD structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "HubLab Documentation - AI Component Library for React and TypeScript",
      "description": "Complete documentation for HubLab, the AI-powered React component library with 8,150+ components including UI, e-commerce, dashboard, and marketing components. Learn how to integrate with Grok, Claude, ChatGPT, and GitHub Copilot.",
      "author": {
        "@type": "Organization",
        "name": "HubLab"
      },
      "publisher": {
        "@type": "Organization",
        "name": "HubLab",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hublab.sacred.computer/logo.png"
        }
      },
      "datePublished": "2025-01-01",
      "dateModified": "2025-11-03",
      "keywords": "AI component library, React components for AI, TypeScript components, Next.js components, Tailwind CSS components, AI integration, component library, React UI library, dashboard components, e-commerce components"
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <head>
        <title>HubLab Documentation - AI Component Library for React & TypeScript</title>
        <meta name="description" content="Complete documentation for HubLab AI component library. 8,150+ React and TypeScript components for UI, e-commerce, dashboards, and marketing. Integrate with Grok, Claude, ChatGPT, and Copilot." />
        <meta name="keywords" content="AI component library, React components, TypeScript components, Next.js components, Tailwind CSS, UI components, dashboard components, e-commerce components, marketing components, AI integration, Grok AI, Claude AI, ChatGPT, GitHub Copilot, component documentation, React library, component API, AI development tools" />
        <meta property="og:title" content="HubLab Documentation - AI Component Library" />
        <meta property="og:description" content="8,150+ React components optimized for AI assistants. Complete documentation and integration guides." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HubLab Documentation - AI Component Library" />
        <meta name="twitter:description" content="Complete documentation for 8,150+ React components optimized for AI integration" />
      </head>

      <div className="min-h-screen bg-white font-mono">
        {/* Header */}
        <header className="border-b-2 border-black bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold sacred-hover">
                ← Back to HubLab
              </Link>
              <nav className="flex gap-6">
                <Link href="/components" className="sacred-hover text-terminal-green">
                  Components
                </Link>
                <Link href="/getting-started" className="sacred-hover text-terminal-green">
                  Getting Started
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <section className="mb-16">
            <h1 className="text-5xl font-bold mb-6 text-black">
              HubLab Documentation
            </h1>
            <p className="text-2xl text-terminal-green mb-8">
              The Complete AI Component Library for React and TypeScript Developers
            </p>
            <div className="border-2 border-black p-8 bg-gray-50">
              <p className="text-lg leading-relaxed mb-4">
                Welcome to the official HubLab documentation. HubLab is a revolutionary AI-powered component library
                designed specifically for modern React and TypeScript development. With over 290 carefully crafted
                components, HubLab provides everything you need to build professional web applications quickly and
                efficiently using AI assistants like Grok, Claude, ChatGPT, and GitHub Copilot.
              </p>
              <p className="text-lg leading-relaxed">
                This documentation covers everything from basic installation to advanced integration techniques,
                API endpoints, component usage, and best practices for leveraging AI assistants in your development workflow.
              </p>
            </div>
          </section>

          {/* Quick Overview */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-black p-6 sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">What is HubLab?</h3>
                <p className="text-lg leading-relaxed mb-4">
                  HubLab is an innovative React component library that bridges the gap between traditional
                  component libraries and AI-assisted development. Unlike conventional libraries, HubLab is
                  specifically optimized for AI assistants, making it the perfect choice for developers who
                  want to leverage the power of AI in their workflow.
                </p>
                <p className="text-lg leading-relaxed">
                  Each component is documented with AI-friendly descriptions, usage patterns, and integration
                  examples that help AI assistants understand exactly how to implement and customize components
                  for your specific needs.
                </p>
              </div>
              <div className="border-2 border-black p-6 sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Key Features</h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3">▸</span>
                    <span>8,150+ production-ready React components</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3">▸</span>
                    <span>Full TypeScript support with comprehensive type definitions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3">▸</span>
                    <span>Tailwind CSS styling for easy customization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3">▸</span>
                    <span>AI-optimized documentation and examples</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3">▸</span>
                    <span>Mobile-responsive and accessible designs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3">▸</span>
                    <span>Next.js 14 App Router compatible</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Component Categories */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Component Categories
            </h2>
            <p className="text-lg mb-8 leading-relaxed">
              HubLab organizes its 8,150+ components into four primary categories, each designed to address
              specific development needs. Whether you're building a user interface, an e-commerce platform,
              a data dashboard, or a marketing website, HubLab has the components you need.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* UI Components */}
              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">
                  UI Components (53 Components)
                </h3>
                <p className="text-lg mb-4 leading-relaxed">
                  The foundation of any great application starts with solid UI components. HubLab's UI
                  category includes 53 essential components that cover all your basic interface needs.
                </p>
                <ul className="space-y-2 text-base mb-4">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Buttons, Forms, and Input Elements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Navigation Menus and Breadcrumbs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Modals, Dialogs, and Tooltips</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Cards, Badges, and Avatars</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Alerts, Notifications, and Toasts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Progress Bars and Loading Spinners</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Tabs, Accordions, and Dropdowns</span>
                  </li>
                </ul>
                <Link href="/components#ui" className="text-terminal-green underline sacred-hover">
                  View All UI Components →
                </Link>
              </div>

              {/* E-commerce Components */}
              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">
                  E-commerce Components (25 Components)
                </h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Build complete online stores with HubLab's e-commerce component collection. These 25
                  specialized components handle everything from product displays to checkout flows.
                </p>
                <ul className="space-y-2 text-base mb-4">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Product Cards and Grids</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Shopping Cart and Wishlist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Checkout Forms and Payment Integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Product Filters and Search</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Review and Rating Systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Pricing Tables and Discount Badges</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Order Tracking and Confirmation</span>
                  </li>
                </ul>
                <Link href="/components#ecommerce" className="text-terminal-green underline sacred-hover">
                  View All E-commerce Components →
                </Link>
              </div>

              {/* Dashboard Components */}
              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">
                  Dashboard Components (25 Components)
                </h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Create powerful data visualization and admin interfaces with HubLab's dashboard components.
                  Perfect for analytics platforms, admin panels, and business intelligence tools.
                </p>
                <ul className="space-y-2 text-base mb-4">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Charts and Graphs (Line, Bar, Pie, Area)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Data Tables with Sorting and Filtering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Statistics Cards and KPI Widgets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Activity Feeds and Timeline Views</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>User Management Interfaces</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Settings Panels and Configuration Forms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Real-time Data Visualization</span>
                  </li>
                </ul>
                <Link href="/components#dashboard" className="text-terminal-green underline sacred-hover">
                  View All Dashboard Components →
                </Link>
              </div>

              {/* Marketing Components */}
              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">
                  Marketing Components (25 Components)
                </h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Build conversion-focused landing pages and marketing websites with components designed
                  specifically for driving engagement and capturing leads.
                </p>
                <ul className="space-y-2 text-base mb-4">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Hero Sections and CTAs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Feature Showcases and Testimonials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Pricing Tables and Comparison Charts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Newsletter Signup Forms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Team Sections and About Pages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>FAQ Sections and Contact Forms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Social Proof and Trust Badges</span>
                  </li>
                </ul>
                <Link href="/components#marketing" className="text-terminal-green underline sacred-hover">
                  View All Marketing Components →
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Quick Start Guide
            </h2>
            <p className="text-lg mb-8 leading-relaxed">
              Getting started with HubLab is incredibly simple. Unlike traditional component libraries that
              require complex installation processes, HubLab is designed to work seamlessly with AI assistants,
              allowing you to start building immediately.
            </p>

            <div className="border-2 border-black p-8 bg-gray-50 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-terminal-green">Prerequisites</h3>
              <p className="text-lg mb-4">Before you begin, make sure you have:</p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">1.</span>
                  <span>Node.js 18.0 or higher installed on your system</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">2.</span>
                  <span>A React or Next.js project (Next.js 14+ recommended)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">3.</span>
                  <span>Tailwind CSS configured in your project</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">4.</span>
                  <span>An AI assistant account (Grok, Claude, ChatGPT, or Copilot)</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-black p-8 bg-white mb-8">
              <h3 className="text-2xl font-bold mb-6 text-terminal-green">Step 1: Access HubLab</h3>
              <p className="text-lg mb-4 leading-relaxed">
                HubLab is a web-based component library accessible through your browser. Simply navigate to
                the HubLab website and explore the component catalog. No installation required!
              </p>
              <div className="bg-gray-50 border-2 border-black p-4 font-mono text-sm">
                <code>https://hublab.sacred.computer</code>
              </div>
            </div>

            <div className="border-2 border-black p-8 bg-white mb-8">
              <h3 className="text-2xl font-bold mb-6 text-terminal-green">Step 2: Choose Your AI Assistant</h3>
              <p className="text-lg mb-4 leading-relaxed">
                HubLab works with all major AI coding assistants. Each assistant has its own strengths:
              </p>
              <ul className="space-y-4">
                <li className="border-2 border-black p-4">
                  <strong className="text-terminal-green">Grok (Recommended):</strong> Best for rapid prototyping
                  and creative component customization. Excellent at understanding context and generating unique variations.
                </li>
                <li className="border-2 border-black p-4">
                  <strong className="text-terminal-green">Claude:</strong> Superior code quality and best practices.
                  Ideal for production-ready implementations and complex integrations.
                </li>
                <li className="border-2 border-black p-4">
                  <strong className="text-terminal-green">ChatGPT:</strong> Great for beginners, provides detailed
                  explanations and helps you learn while building.
                </li>
                <li className="border-2 border-black p-4">
                  <strong className="text-terminal-green">GitHub Copilot:</strong> Perfect for inline suggestions
                  and quick component insertions directly in your IDE.
                </li>
              </ul>
            </div>

            <div className="border-2 border-black p-8 bg-white">
              <h3 className="text-2xl font-bold mb-6 text-terminal-green">Step 3: Start Building</h3>
              <p className="text-lg mb-4 leading-relaxed">
                Once you've selected a component, simply ask your AI assistant to implement it. The AI will
                understand the component structure and generate the code for you.
              </p>
              <Link href="/getting-started" className="text-lg text-terminal-green underline sacred-hover">
                View Complete Getting Started Guide →
              </Link>
            </div>
          </section>

          {/* API Endpoints - Continued in next section */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              API Endpoints
            </h2>
            <p className="text-lg mb-8 leading-relaxed">
              HubLab provides a comprehensive REST API that allows you to programmatically access component data,
              search for components, and integrate HubLab into your development tools and workflows. The API is
              designed to be simple, fast, and developer-friendly.
            </p>

            <div className="space-y-6">
              {/* Search Components Endpoint */}
              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">GET /api/components/search</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Search for components by keyword, category, or functionality. This endpoint powers the HubLab
                  search interface and can be used to build custom search experiences.
                </p>
                <div className="bg-gray-50 border-2 border-black p-4 mb-4">
                  <h4 className="font-bold mb-2">Request Parameters:</h4>
                  <pre className="font-mono text-sm overflow-x-auto">
{`{
  "q": "button",           // Search query (required)
  "category": "ui",        // Filter by category (optional)
  "limit": 10,             // Results per page (optional, default: 20)
  "offset": 0              // Pagination offset (optional, default: 0)
}`}
                  </pre>
                </div>
                <div className="bg-gray-50 border-2 border-black p-4">
                  <h4 className="font-bold mb-2">Response:</h4>
                  <pre className="font-mono text-sm overflow-x-auto">
{`{
  "results": [
    {
      "id": "primary-button",
      "name": "Primary Button",
      "category": "ui",
      "description": "A customizable primary action button",
      "tags": ["button", "cta", "interactive"],
      "complexity": "simple"
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}`}
                  </pre>
                </div>
              </div>

              {/* Get Component Details Endpoint */}
              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">GET /api/components/:id</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Retrieve detailed information about a specific component, including full documentation,
                  code examples, props, and usage guidelines.
                </p>
                <div className="bg-gray-50 border-2 border-black p-4 mb-4">
                  <h4 className="font-bold mb-2">Example Request:</h4>
                  <pre className="font-mono text-sm">
{`GET /api/components/primary-button`}
                  </pre>
                </div>
                <div className="bg-gray-50 border-2 border-black p-4">
                  <h4 className="font-bold mb-2">Response:</h4>
                  <pre className="font-mono text-sm overflow-x-auto">
{`{
  "id": "primary-button",
  "name": "Primary Button",
  "category": "ui",
  "description": "A customizable primary action button...",
  "code": "export default function PrimaryButton()...",
  "props": {
    "variant": "string",
    "size": "string",
    "disabled": "boolean"
  },
  "examples": [...],
  "relatedComponents": [...]
}`}
                  </pre>
                </div>
              </div>

              {/* Categories Endpoint */}
              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">GET /api/categories</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  List all available component categories with component counts and descriptions.
                </p>
                <div className="bg-gray-50 border-2 border-black p-4">
                  <h4 className="font-bold mb-2">Response:</h4>
                  <pre className="font-mono text-sm overflow-x-auto">
{`{
  "categories": [
    {
      "id": "ui",
      "name": "UI Components",
      "count": 53,
      "description": "Essential user interface components"
    },
    {
      "id": "ecommerce",
      "name": "E-commerce",
      "count": 25,
      "description": "Components for online stores"
    },
    {
      "id": "dashboard",
      "name": "Dashboard",
      "count": 25,
      "description": "Data visualization components"
    },
    {
      "id": "marketing",
      "name": "Marketing",
      "count": 25,
      "description": "Landing page components"
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* AI Integration Guide */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              AI Integration Guide
            </h2>
            <p className="text-lg mb-8 leading-relaxed">
              HubLab is specifically designed to work seamlessly with AI coding assistants. This guide will help
              you get the most out of each AI platform when working with HubLab components.
            </p>

            {/* Grok Integration */}
            <div className="border-2 border-black p-8 bg-white mb-8">
              <h3 className="text-3xl font-bold mb-6 text-terminal-green">Integrating with Grok</h3>
              <p className="text-lg mb-6 leading-relaxed">
                Grok is X's AI assistant, known for its creative approach and real-time information access.
                When using Grok with HubLab, you get fast, innovative component implementations with unique
                customization options.
              </p>

              <h4 className="text-xl font-bold mb-4">Best Practices for Grok:</h4>
              <ul className="space-y-3 mb-6 text-lg">
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Be specific about your requirements and desired styling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Ask Grok to explain its implementation choices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Request alternative variations to explore different approaches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Leverage Grok's creativity for unique component customizations</span>
                </li>
              </ul>

              <h4 className="text-xl font-bold mb-4">Example Grok Prompts:</h4>
              <div className="space-y-4">
                <div className="bg-gray-50 border-2 border-black p-4">
                  <p className="font-mono text-sm mb-2 text-terminal-green">Prompt:</p>
                  <p className="font-mono text-sm mb-4">
                    "Using HubLab's product card component, create a card with hover animations,
                    add-to-cart functionality, and a wishlist button. Style it with a modern gradient effect."
                  </p>
                  <p className="text-sm">
                    Grok will generate a customized product card with creative hover effects and smooth animations.
                  </p>
                </div>
                <div className="bg-gray-50 border-2 border-black p-4">
                  <p className="font-mono text-sm mb-2 text-terminal-green">Prompt:</p>
                  <p className="font-mono text-sm mb-4">
                    "Create a dashboard layout using HubLab components with a sidebar navigation,
                    stats cards, and a data table. Use a dark theme."
                  </p>
                  <p className="text-sm">
                    Grok excels at combining multiple components into cohesive layouts with consistent theming.
                  </p>
                </div>
              </div>
            </div>

            {/* Claude Integration */}
            <div className="border-2 border-black p-8 bg-white mb-8">
              <h3 className="text-3xl font-bold mb-6 text-terminal-green">Integrating with Claude</h3>
              <p className="text-lg mb-6 leading-relaxed">
                Claude by Anthropic is renowned for producing high-quality, well-structured code that follows
                best practices. When using Claude with HubLab, you can expect production-ready implementations
                with excellent error handling and accessibility features.
              </p>

              <h4 className="text-xl font-bold mb-4">Best Practices for Claude:</h4>
              <ul className="space-y-3 mb-6 text-lg">
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Provide context about your project structure and requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Ask for TypeScript implementations with full type safety</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Request accessibility considerations and ARIA labels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Leverage Claude's attention to detail for complex components</span>
                </li>
              </ul>

              <h4 className="text-xl font-bold mb-4">Example Claude Prompts:</h4>
              <div className="space-y-4">
                <div className="bg-gray-50 border-2 border-black p-4">
                  <p className="font-mono text-sm mb-2 text-terminal-green">Prompt:</p>
                  <p className="font-mono text-sm mb-4">
                    "Implement HubLab's data table component with TypeScript, including sorting, filtering,
                    pagination, and full accessibility support. Ensure proper ARIA labels and keyboard navigation."
                  </p>
                  <p className="text-sm">
                    Claude will deliver a robust, accessible implementation with comprehensive error handling.
                  </p>
                </div>
              </div>
            </div>

            {/* ChatGPT Integration */}
            <div className="border-2 border-black p-8 bg-white mb-8">
              <h3 className="text-3xl font-bold mb-6 text-terminal-green">Integrating with ChatGPT</h3>
              <p className="text-lg mb-6 leading-relaxed">
                ChatGPT is excellent for learning and understanding component implementation. It provides detailed
                explanations and is great for developers who want to understand the "why" behind each implementation choice.
              </p>

              <h4 className="text-xl font-bold mb-4">Best Practices for ChatGPT:</h4>
              <ul className="space-y-3 mb-6 text-lg">
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Ask for step-by-step explanations of component implementations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Request clarification on best practices and design patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Use ChatGPT to learn about component customization options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Get help troubleshooting integration issues</span>
                </li>
              </ul>
            </div>

            {/* GitHub Copilot Integration */}
            <div className="border-2 border-black p-8 bg-white">
              <h3 className="text-3xl font-bold mb-6 text-terminal-green">Integrating with GitHub Copilot</h3>
              <p className="text-lg mb-6 leading-relaxed">
                GitHub Copilot integrates directly into your IDE, providing inline suggestions as you type.
                This makes it perfect for quick component insertions and rapid development workflows.
              </p>

              <h4 className="text-xl font-bold mb-4">Best Practices for Copilot:</h4>
              <ul className="space-y-3 mb-6 text-lg">
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Write descriptive comments to guide Copilot's suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Use HubLab component names in comments for accurate suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Review and customize generated code to match your project style</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Combine Copilot with HubLab's visual examples for best results</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Support and Resources */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Support and Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-black p-6 sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Documentation</h3>
                <p className="text-lg mb-4">
                  Comprehensive guides, API references, and examples for all components and features.
                </p>
                <Link href="/docs" className="text-terminal-green underline">
                  Browse Documentation →
                </Link>
              </div>
              <div className="border-2 border-black p-6 sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Component Gallery</h3>
                <p className="text-lg mb-4">
                  Explore all 8,150+ components with live previews and interactive examples.
                </p>
                <Link href="/components" className="text-terminal-green underline">
                  View Components →
                </Link>
              </div>
              <div className="border-2 border-black p-6 sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Getting Started</h3>
                <p className="text-lg mb-4">
                  Step-by-step tutorials for integrating HubLab with your favorite AI assistant.
                </p>
                <Link href="/getting-started" className="text-terminal-green underline">
                  Get Started →
                </Link>
              </div>
              <div className="border-2 border-black p-6 sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Updates</h3>
                <p className="text-lg mb-4">
                  Stay up to date with new components, features, and improvements to HubLab.
                </p>
                <Link href="/" className="text-terminal-green underline">
                  View Changelog →
                </Link>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="border-2 border-black p-12 bg-terminal-green text-white text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Build with HubLab?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Start building beautiful React applications with AI-powered component library.
              8,150+ components ready to use with your favorite AI assistant.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/getting-started"
                className="bg-white text-black px-8 py-4 border-2 border-black sacred-hover font-bold"
              >
                Get Started
              </Link>
              <Link
                href="/components"
                className="bg-black text-white px-8 py-4 border-2 border-white sacred-hover font-bold"
              >
                Browse Components
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-black bg-gray-50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4 text-lg">HubLab</h3>
                <p className="text-sm leading-relaxed">
                  AI-powered React component library with 8,150+ components for modern web development.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">Documentation</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/docs" className="sacred-hover">Overview</Link></li>
                  <li><Link href="/getting-started" className="sacred-hover">Getting Started</Link></li>
                  <li><Link href="/components" className="sacred-hover">Components</Link></li>
                  <li><Link href="/docs#api" className="sacred-hover">API Reference</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">Components</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/components#ui" className="sacred-hover">UI Components</Link></li>
                  <li><Link href="/components#ecommerce" className="sacred-hover">E-commerce</Link></li>
                  <li><Link href="/components#dashboard" className="sacred-hover">Dashboard</Link></li>
                  <li><Link href="/components#marketing" className="sacred-hover">Marketing</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">AI Integration</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/docs#grok" className="sacred-hover">Grok</Link></li>
                  <li><Link href="/docs#claude" className="sacred-hover">Claude</Link></li>
                  <li><Link href="/docs#chatgpt" className="sacred-hover">ChatGPT</Link></li>
                  <li><Link href="/docs#copilot" className="sacred-hover">Copilot</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t-2 border-black mt-8 pt-8 text-center text-sm">
              <p>HubLab - AI Component Library for React Developers</p>
              <p className="mt-2 text-terminal-green">Built with Sacred.computer aesthetic</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

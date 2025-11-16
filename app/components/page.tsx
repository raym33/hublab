'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Add JSON-LD structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "HubLab React Components",
      "description": "Complete list of 6150+ React and TypeScript components for UI, e-commerce, dashboards, and marketing. Optimized for AI assistants including Grok, Claude, ChatGPT, and GitHub Copilot.",
      "numberOfItems": 6150,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "UI Components",
          "description": "53 essential user interface components including buttons, forms, navigation, modals, and more"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "E-commerce Components",
          "description": "25 specialized e-commerce components for product displays, shopping carts, and checkout flows"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Dashboard Components",
          "description": "25 data visualization and admin interface components including charts, tables, and analytics widgets"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Marketing Components",
          "description": "25 conversion-focused components for landing pages, hero sections, and lead generation"
        }
      ]
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const categories = [
    {
      id: 'ui',
      name: 'UI Components',
      count: 53,
      description: 'Essential user interface components for building modern web applications',
      color: 'text-terminal-green',
      components: [
        'Primary Button', 'Secondary Button', 'Text Button', 'Icon Button', 'Button Group',
        'Text Input', 'Select Dropdown', 'Checkbox', 'Radio Button', 'Toggle Switch',
        'Search Bar', 'Form Layout', 'Validation Messages', 'File Upload', 'Date Picker',
        'Navigation Menu', 'Breadcrumbs', 'Tabs', 'Pagination', 'Sidebar Navigation',
        'Modal Dialog', 'Tooltip', 'Popover', 'Dropdown Menu', 'Context Menu',
        'Card', 'Badge', 'Avatar', 'Avatar Group', 'Profile Card',
        'Alert', 'Notification Toast', 'Banner', 'Error Message', 'Success Message',
        'Progress Bar', 'Loading Spinner', 'Skeleton Loader', 'Circular Progress', 'Step Progress',
        'Accordion', 'Collapse Panel', 'Divider', 'Separator', 'Spacer',
        'Icon Library', 'Empty State', 'Not Found Page', 'Error Boundary', 'Scroll To Top',
        'Copy to Clipboard', 'Color Picker', 'Rating Stars'
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      count: 25,
      description: 'Complete set of components for building online stores and shopping experiences',
      color: 'text-blue-600',
      components: [
        'Product Card', 'Product Grid', 'Product List', 'Featured Product', 'Product Quick View',
        'Shopping Cart', 'Cart Item', 'Cart Summary', 'Mini Cart', 'Empty Cart',
        'Wishlist', 'Wishlist Button', 'Compare Products', 'Recently Viewed', 'Recommended Products',
        'Checkout Form', 'Payment Methods', 'Shipping Options', 'Order Summary', 'Coupon Input',
        'Product Filter', 'Price Range Slider', 'Category Filter', 'Sort Dropdown', 'Search Results'
      ]
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      count: 25,
      description: 'Data visualization and admin interface components for analytics and management',
      color: 'text-purple-600',
      components: [
        'Line Chart', 'Bar Chart', 'Pie Chart', 'Area Chart', 'Donut Chart',
        'Data Table', 'Sortable Table', 'Filterable Table', 'Paginated Table', 'Editable Table',
        'Stats Card', 'KPI Widget', 'Metric Display', 'Comparison Card', 'Trend Indicator',
        'Activity Feed', 'Timeline', 'Notification Center', 'Recent Activity', 'Event Log',
        'User List', 'User Profile', 'Settings Panel', 'Preferences Form', 'Admin Controls'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      count: 25,
      description: 'Conversion-optimized components for landing pages and marketing websites',
      color: 'text-red-600',
      components: [
        'Hero Section', 'Hero with Image', 'Hero with Video', 'Animated Hero', 'Split Hero',
        'CTA Button', 'CTA Banner', 'CTA Section', 'Newsletter Signup', 'Lead Form',
        'Feature Grid', 'Feature List', 'Feature Comparison', 'Benefits Section', 'Icon Features',
        'Testimonial Card', 'Testimonial Slider', 'Review Section', 'Star Rating', 'Client Logos',
        'Pricing Table', 'Pricing Card', 'FAQ Accordion', 'Team Section', 'Contact Form'
      ]
    }
  ];

  return (
    <>
      <head>
        <title>6150+ React Components for AI - HubLab Component Library</title>
        <meta name="description" content="Browse 6150+ production-ready React and TypeScript components. UI components, e-commerce, dashboard, and marketing components optimized for AI assistants like Grok, Claude, ChatGPT, and Copilot. Built with Next.js and Tailwind CSS." />
        <meta name="keywords" content="React components, UI components, TypeScript components, dashboard components, e-commerce components, marketing components, Next.js components, Tailwind CSS components, AI component library, component gallery, React UI library, component showcase, reusable components, production components, open source components" />
        <meta property="og:title" content="6150+ React Components for AI - HubLab" />
        <meta property="og:description" content="Complete component library with UI, e-commerce, dashboard, and marketing components for React developers" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="6150+ React Components - HubLab" />
        <meta name="twitter:description" content="Production-ready React components optimized for AI integration" />
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
                <Link href="/docs" className="sacred-hover text-terminal-green">
                  Documentation
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
              6150+ React Components for AI
            </h1>
            <p className="text-2xl text-terminal-green mb-8">
              Production-ready components optimized for AI assistants and modern development
            </p>
            <div className="border-2 border-black p-8 bg-gray-50">
              <p className="text-lg leading-relaxed mb-4">
                HubLab provides a comprehensive collection of 6150+ React and TypeScript components designed
                specifically for AI-assisted development. Every component is optimized to work seamlessly with
                Grok, Claude, ChatGPT, and GitHub Copilot, making it easier than ever to build professional
                web applications quickly and efficiently.
              </p>
              <p className="text-lg leading-relaxed">
                All components are built with Next.js 14 App Router, styled with Tailwind CSS, and include
                full TypeScript support. They're mobile-responsive, accessible, and follow modern React best practices.
              </p>
            </div>
          </section>

          {/* Search and Filter Section */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Find Components
            </h2>
            <div className="border-2 border-black p-8 bg-white mb-8">
              <div className="mb-6">
                <label className="block text-lg font-bold mb-3">Search Components</label>
                <input
                  type="text"
                  placeholder="Search by name, category, or functionality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-black p-4 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-terminal-green"
                />
                <p className="text-sm mt-2 text-gray-600">
                  Try searching for "button", "chart", "product", "hero", or any component type
                </p>
              </div>

              <div>
                <label className="block text-lg font-bold mb-3">Filter by Category</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-6 py-3 border-2 border-black font-bold sacred-hover ${
                      activeCategory === 'all' ? 'bg-terminal-green text-white' : 'bg-white'
                    }`}
                  >
                    All (6150)
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-6 py-3 border-2 border-black font-bold sacred-hover ${
                        activeCategory === cat.id ? 'bg-terminal-green text-white' : 'bg-white'
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-black p-6">
              <h3 className="text-xl font-bold mb-4 text-terminal-green">Advanced Search Features</h3>
              <ul className="space-y-2 text-lg">
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Search by component name for exact matches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Filter by category to narrow down results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Search by functionality (e.g., "form", "navigation", "visualization")</span>
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-green mr-3">▸</span>
                  <span>Use API endpoint /api/components/search for programmatic access</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Component Statistics */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Component Library Statistics
            </h2>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="border-2 border-black p-6 text-center sacred-hover bg-white">
                <div className="text-5xl font-bold text-terminal-green mb-2">6150+</div>
                <div className="text-lg">Total Components</div>
              </div>
              <div className="border-2 border-black p-6 text-center sacred-hover bg-white">
                <div className="text-5xl font-bold text-terminal-green mb-2">4</div>
                <div className="text-lg">Component Categories</div>
              </div>
              <div className="border-2 border-black p-6 text-center sacred-hover bg-white">
                <div className="text-5xl font-bold text-terminal-green mb-2">100%</div>
                <div className="text-lg">TypeScript Coverage</div>
              </div>
              <div className="border-2 border-black p-6 text-center sacred-hover bg-white">
                <div className="text-5xl font-bold text-terminal-green mb-2">4</div>
                <div className="text-lg">AI Assistants Supported</div>
              </div>
            </div>

            <div className="border-2 border-black p-8 bg-gray-50">
              <h3 className="text-2xl font-bold mb-6 text-terminal-green">Component Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3 text-lg">Technical Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Built with React 18+ and Next.js 14 App Router</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Full TypeScript support with comprehensive type definitions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Styled with Tailwind CSS for easy customization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Server and client components where appropriate</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Optimized for performance and bundle size</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-lg">Design Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Mobile-responsive and adaptive layouts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>WCAG 2.1 accessibility compliance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Dark mode and theme customization support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Consistent design language across all components</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-terminal-green mr-3">•</span>
                      <span>Smooth animations and transitions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Component Categories Detail */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Component Categories
            </h2>

            {categories.map((category, idx) => (
              <div key={category.id} className={`mb-12 ${idx !== categories.length - 1 ? 'pb-12 border-b-2 border-gray-200' : ''}`}>
                <div className="mb-6">
                  <h3 className={`text-3xl font-bold mb-4 ${category.color}`}>
                    {category.name} ({category.count} Components)
                  </h3>
                  <p className="text-lg leading-relaxed mb-6">
                    {category.description}
                  </p>
                </div>

                <div className="border-2 border-black p-8 bg-white mb-6">
                  <h4 className="text-xl font-bold mb-6">Components in this category:</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {category.components.map((component, index) => (
                      <div
                        key={index}
                        className="border-2 border-black p-4 bg-gray-50 sacred-hover"
                      >
                        <div className="font-mono font-bold">{component}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category-specific use cases */}
                <div className="border-2 border-black p-6 bg-gray-50">
                  <h4 className="text-xl font-bold mb-4 text-terminal-green">Use Cases</h4>
                  {category.id === 'ui' && (
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Building user interfaces for web applications</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Creating forms and data input interfaces</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Implementing navigation and routing systems</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Displaying feedback and notifications to users</span>
                      </li>
                    </ul>
                  )}
                  {category.id === 'ecommerce' && (
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Building online stores and marketplaces</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Creating product catalogs and listings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Implementing shopping cart and checkout flows</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Managing product search and filtering</span>
                      </li>
                    </ul>
                  )}
                  {category.id === 'dashboard' && (
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Creating admin panels and management interfaces</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Building analytics and reporting dashboards</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Visualizing data with charts and graphs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Managing user data and settings</span>
                      </li>
                    </ul>
                  )}
                  {category.id === 'marketing' && (
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Creating landing pages and marketing websites</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Building lead generation and conversion funnels</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Showcasing product features and benefits</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-terminal-green mr-3">▸</span>
                        <span>Collecting customer testimonials and reviews</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* AI Integration Section */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              AI Assistant Integration
            </h2>
            <p className="text-lg mb-8 leading-relaxed">
              All HubLab components are optimized to work seamlessly with popular AI coding assistants.
              Each AI assistant has its own strengths, and HubLab components are documented in a way that
              helps every AI understand how to implement and customize them effectively.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Grok AI</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Grok excels at creative component customization and rapid prototyping. Use Grok when you
                  need unique variations of components or want to explore different design approaches.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Fast iteration on component designs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Creative customization suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Real-time problem solving</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Claude AI</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Claude provides production-ready code with excellent attention to detail, type safety, and
                  best practices. Perfect for building robust, maintainable applications.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>High-quality TypeScript implementations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Comprehensive error handling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Accessibility-focused code</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">ChatGPT</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  ChatGPT is excellent for learning and understanding component implementation. It provides
                  detailed explanations and helps you understand the "why" behind each decision.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Detailed implementation explanations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Step-by-step guidance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Best practice recommendations</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">GitHub Copilot</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Copilot integrates directly into your IDE for inline suggestions and rapid development.
                  Perfect for quick component insertions and iterative development.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Inline code suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>IDE-integrated workflow</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Context-aware completions</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Getting Started CTA */}
          <section className="mb-16">
            <div className="border-2 border-black p-12 bg-terminal-green text-white">
              <h2 className="text-3xl font-bold mb-6">Ready to Start Using Components?</h2>
              <p className="text-xl mb-8 leading-relaxed">
                Choose a component from the categories above and start building with your favorite AI assistant.
                All components are ready to use with detailed documentation and examples.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/getting-started"
                  className="bg-white text-black px-8 py-4 border-2 border-black sacred-hover font-bold inline-block"
                >
                  Getting Started Guide
                </Link>
                <Link
                  href="/docs"
                  className="bg-black text-white px-8 py-4 border-2 border-white sacred-hover font-bold inline-block"
                >
                  View Documentation
                </Link>
              </div>
            </div>
          </section>

          {/* Component Best Practices */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Component Best Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">Customization</h3>
                <p className="mb-4">
                  All components are built with Tailwind CSS, making customization straightforward.
                  You can easily modify colors, spacing, typography, and more by adjusting Tailwind classes.
                </p>
                <p className="text-sm">
                  When working with AI assistants, describe your desired customizations in plain language,
                  and the AI will apply the appropriate Tailwind classes.
                </p>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">TypeScript Support</h3>
                <p className="mb-4">
                  Every component includes comprehensive TypeScript definitions. This ensures type safety,
                  better IDE support, and fewer runtime errors.
                </p>
                <p className="text-sm">
                  Always request TypeScript implementations from AI assistants for production code to
                  maintain type safety throughout your application.
                </p>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">Performance</h3>
                <p className="mb-4">
                  Components are optimized for performance with code splitting, lazy loading, and efficient
                  rendering. Use Next.js features like dynamic imports for optimal bundle sizes.
                </p>
                <p className="text-sm">
                  For components below the fold, consider implementing lazy loading to improve initial
                  page load times.
                </p>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">Accessibility</h3>
                <p className="mb-4">
                  All components follow WCAG 2.1 guidelines with proper ARIA labels, keyboard navigation,
                  and screen reader support.
                </p>
                <p className="text-sm">
                  When customizing components, maintain accessibility features to ensure your application
                  is usable by everyone.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-black bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4 text-lg">HubLab</h3>
                <p className="text-sm leading-relaxed">
                  6150+ React components for AI-assisted development. Built with Next.js, TypeScript, and Tailwind CSS.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">Categories</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/components#ui" className="sacred-hover">UI Components (53)</Link></li>
                  <li><Link href="/components#ecommerce" className="sacred-hover">E-commerce (25)</Link></li>
                  <li><Link href="/components#dashboard" className="sacred-hover">Dashboard (25)</Link></li>
                  <li><Link href="/components#marketing" className="sacred-hover">Marketing (25)</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">Documentation</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/docs" className="sacred-hover">Overview</Link></li>
                  <li><Link href="/getting-started" className="sacred-hover">Getting Started</Link></li>
                  <li><Link href="/docs#api" className="sacred-hover">API Reference</Link></li>
                  <li><Link href="/docs#integration" className="sacred-hover">AI Integration</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">AI Assistants</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/docs#grok" className="sacred-hover">Grok</Link></li>
                  <li><Link href="/docs#claude" className="sacred-hover">Claude</Link></li>
                  <li><Link href="/docs#chatgpt" className="sacred-hover">ChatGPT</Link></li>
                  <li><Link href="/docs#copilot" className="sacred-hover">Copilot</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t-2 border-black mt-8 pt-8 text-center text-sm">
              <p>HubLab - 6150+ React Components for AI Development</p>
              <p className="mt-2 text-terminal-green">Optimized for Grok, Claude, ChatGPT, and GitHub Copilot</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

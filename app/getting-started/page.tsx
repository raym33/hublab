'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GettingStartedPage() {
  const [selectedAI, setSelectedAI] = useState<'grok' | 'claude' | 'chatgpt' | 'copilot'>('grok');

  useEffect(() => {
    // Add JSON-LD structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Getting Started with HubLab - AI Component Library Integration Guide",
      "description": "Complete step-by-step guide to using HubLab React component library with AI assistants including Grok, Claude, ChatGPT, and GitHub Copilot. Learn how to integrate 290+ components into your projects.",
      "totalTime": "PT15M",
      "tool": [
        {
          "@type": "HowToTool",
          "name": "Grok AI"
        },
        {
          "@type": "HowToTool",
          "name": "Claude AI"
        },
        {
          "@type": "HowToTool",
          "name": "ChatGPT"
        },
        {
          "@type": "HowToTool",
          "name": "GitHub Copilot"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Set up your development environment",
          "text": "Install Node.js 18+, create a Next.js project, and configure Tailwind CSS"
        },
        {
          "@type": "HowToStep",
          "name": "Choose your AI assistant",
          "text": "Select from Grok, Claude, ChatGPT, or GitHub Copilot based on your needs"
        },
        {
          "@type": "HowToStep",
          "name": "Browse HubLab components",
          "text": "Explore 290+ components across UI, e-commerce, dashboard, and marketing categories"
        },
        {
          "@type": "HowToStep",
          "name": "Implement components with AI",
          "text": "Use your AI assistant to generate and customize HubLab components"
        },
        {
          "@type": "HowToStep",
          "name": "Customize and deploy",
          "text": "Customize components with Tailwind CSS and deploy your application"
        }
      ]
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const aiAssistants = {
    grok: {
      name: 'Grok',
      description: 'X\'s creative AI assistant, perfect for rapid prototyping and unique customizations',
      color: 'text-terminal-green',
      bgColor: 'bg-terminal-green'
    },
    claude: {
      name: 'Claude',
      description: 'Anthropic\'s AI with superior code quality and attention to best practices',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600'
    },
    chatgpt: {
      name: 'ChatGPT',
      description: 'OpenAI\'s assistant, excellent for learning and detailed explanations',
      color: 'text-purple-600',
      bgColor: 'bg-purple-600'
    },
    copilot: {
      name: 'GitHub Copilot',
      description: 'Microsoft\'s IDE-integrated assistant for inline suggestions',
      color: 'text-red-600',
      bgColor: 'bg-red-600'
    }
  };

  return (
    <>
      <head>
        <title>Getting Started with HubLab - Quick Start Guide for AI Component Integration</title>
        <meta name="description" content="Complete getting started guide for HubLab AI component library. Learn how to integrate 290+ React components with Grok, Claude, ChatGPT, and GitHub Copilot. Step-by-step tutorials, code examples, and troubleshooting tips." />
        <meta name="keywords" content="HubLab tutorial, AI component integration, React AI development, component library tutorial, Grok tutorial, Claude tutorial, ChatGPT tutorial, GitHub Copilot tutorial, Next.js tutorial, React getting started, TypeScript tutorial, AI coding assistant, component implementation guide" />
        <meta property="og:title" content="Getting Started with HubLab - Quick Start Guide" />
        <meta property="og:description" content="Step-by-step guide to using HubLab with AI assistants. 290+ React components ready to use." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Getting Started with HubLab" />
        <meta name="twitter:description" content="Complete tutorial for integrating HubLab components with AI assistants" />
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
                <Link href="/components" className="sacred-hover text-terminal-green">
                  Components
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
              Getting Started with HubLab
            </h1>
            <p className="text-2xl text-terminal-green mb-8">
              Your complete guide to building with AI-powered React components
            </p>
            <div className="border-2 border-black p-8 bg-gray-50">
              <p className="text-lg leading-relaxed mb-4">
                Welcome to HubLab! This guide will walk you through everything you need to know to start
                building amazing React applications using HubLab's 290+ components with AI assistants.
                Whether you're a beginner or an experienced developer, this tutorial will help you get
                up and running quickly.
              </p>
              <p className="text-lg leading-relaxed">
                By the end of this guide, you'll know how to browse components, use AI assistants to
                implement them, customize them for your needs, and deploy production-ready applications.
                Let's get started!
              </p>
            </div>
          </section>

          {/* Time Estimate */}
          <section className="mb-16">
            <div className="border-2 border-black p-6 bg-terminal-green text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Time to Complete</h3>
                  <p className="text-lg">Approximately 15-30 minutes</p>
                </div>
                <div className="text-5xl font-bold">⏱️</div>
              </div>
            </div>
          </section>

          {/* Prerequisites */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Prerequisites
            </h2>
            <p className="text-lg mb-8 leading-relaxed">
              Before you begin, make sure you have the following tools and accounts set up. Don't worry
              if you're missing something - we'll guide you through each requirement.
            </p>

            <div className="space-y-6">
              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">1. Node.js and npm</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Node.js is the JavaScript runtime that powers React and Next.js. You'll need version 18.0
                  or higher installed on your computer.
                </p>
                <div className="bg-gray-50 border-2 border-black p-4 mb-4">
                  <h4 className="font-bold mb-2">Check if you have Node.js installed:</h4>
                  <pre className="font-mono text-sm">
{`node --version
npm --version`}
                  </pre>
                </div>
                <p className="text-sm">
                  If you don't have Node.js installed, download it from{' '}
                  <a href="https://nodejs.org" className="text-terminal-green underline" target="_blank" rel="noopener noreferrer">
                    nodejs.org
                  </a>
                </p>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">2. Next.js Project</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  HubLab components work best with Next.js 14 or higher. If you don't have a project yet,
                  create one using the following command:
                </p>
                <div className="bg-gray-50 border-2 border-black p-4 mb-4">
                  <h4 className="font-bold mb-2">Create a new Next.js project:</h4>
                  <pre className="font-mono text-sm overflow-x-auto">
{`npx create-next-app@latest my-hublab-project
cd my-hublab-project`}
                  </pre>
                </div>
                <p className="text-sm">
                  When prompted, select: Yes for TypeScript, Yes for ESLint, Yes for Tailwind CSS,
                  No for src/ directory, Yes for App Router, and No for import alias customization.
                </p>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">3. Tailwind CSS</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  All HubLab components are styled with Tailwind CSS. If you created your project with
                  create-next-app and selected Tailwind CSS, you're all set! Otherwise, follow the Tailwind
                  installation guide for Next.js.
                </p>
                <div className="bg-gray-50 border-2 border-black p-4">
                  <h4 className="font-bold mb-2">Verify Tailwind is installed:</h4>
                  <pre className="font-mono text-sm">
{`# Check if tailwind.config.js exists
ls tailwind.config.js`}
                  </pre>
                </div>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">4. AI Assistant Account</h3>
                <p className="text-lg mb-4 leading-relaxed">
                  Choose at least one AI assistant to work with. Each has its own strengths:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3 font-bold">Grok:</span>
                    <span>Best for creative customizations and rapid prototyping (requires X Premium+)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3 font-bold">Claude:</span>
                    <span>Ideal for production code with best practices (free and paid tiers available)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3 font-bold">ChatGPT:</span>
                    <span>Great for learning and detailed explanations (free and paid tiers available)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-3 font-bold">Copilot:</span>
                    <span>Perfect for IDE integration and inline suggestions (subscription required)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step-by-Step Guide */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Step-by-Step Tutorial
            </h2>

            {/* Step 1 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-terminal-green text-white flex items-center justify-center text-2xl font-bold border-2 border-black mr-4">
                  1
                </div>
                <h3 className="text-3xl font-bold">Explore the Component Library</h3>
              </div>
              <div className="border-2 border-black p-8 bg-white">
                <p className="text-lg mb-6 leading-relaxed">
                  Start by exploring HubLab's component library to find the components you need. You can
                  browse by category or use the search function to find specific components.
                </p>
                <div className="bg-gray-50 border-2 border-black p-6 mb-6">
                  <h4 className="text-xl font-bold mb-4 text-terminal-green">Component Categories:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border-2 border-black p-4 bg-white">
                      <strong>UI Components (53)</strong>
                      <p className="text-sm mt-2">Buttons, forms, navigation, modals, cards, alerts, and more</p>
                    </div>
                    <div className="border-2 border-black p-4 bg-white">
                      <strong>E-commerce (25)</strong>
                      <p className="text-sm mt-2">Product cards, shopping carts, checkout flows, filters</p>
                    </div>
                    <div className="border-2 border-black p-4 bg-white">
                      <strong>Dashboard (25)</strong>
                      <p className="text-sm mt-2">Charts, data tables, stats cards, analytics widgets</p>
                    </div>
                    <div className="border-2 border-black p-4 bg-white">
                      <strong>Marketing (25)</strong>
                      <p className="text-sm mt-2">Hero sections, CTAs, testimonials, pricing tables</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/components"
                  className="inline-block bg-terminal-green text-white px-6 py-3 border-2 border-black sacred-hover font-bold"
                >
                  Browse All Components →
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-terminal-green text-white flex items-center justify-center text-2xl font-bold border-2 border-black mr-4">
                  2
                </div>
                <h3 className="text-3xl font-bold">Choose Your AI Assistant</h3>
              </div>
              <div className="border-2 border-black p-8 bg-white">
                <p className="text-lg mb-6 leading-relaxed">
                  Select the AI assistant you want to work with. Each assistant has unique strengths,
                  so choose based on your needs and preferences.
                </p>
                <div className="flex gap-3 mb-6 flex-wrap">
                  {Object.entries(aiAssistants).map(([key, ai]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedAI(key as keyof typeof aiAssistants)}
                      className={`px-6 py-3 border-2 border-black font-bold sacred-hover ${
                        selectedAI === key ? `${ai.bgColor} text-white` : 'bg-white'
                      }`}
                    >
                      {ai.name}
                    </button>
                  ))}
                </div>
                <div className="bg-gray-50 border-2 border-black p-6">
                  <h4 className={`text-2xl font-bold mb-4 ${aiAssistants[selectedAI].color}`}>
                    {aiAssistants[selectedAI].name}
                  </h4>
                  <p className="text-lg mb-4">{aiAssistants[selectedAI].description}</p>
                  {selectedAI === 'grok' && (
                    <div>
                      <h5 className="font-bold mb-2">Best For:</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Creative component variations and unique designs</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Rapid prototyping and quick iterations</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Real-time information and current trends</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  {selectedAI === 'claude' && (
                    <div>
                      <h5 className="font-bold mb-2">Best For:</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Production-ready code with comprehensive error handling</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>TypeScript implementations with full type safety</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Accessibility-focused implementations</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  {selectedAI === 'chatgpt' && (
                    <div>
                      <h5 className="font-bold mb-2">Best For:</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Learning component implementation patterns</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Detailed explanations of code and best practices</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Step-by-step guidance through complex tasks</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  {selectedAI === 'copilot' && (
                    <div>
                      <h5 className="font-bold mb-2">Best For:</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Inline code suggestions while you type</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>IDE-integrated workflow without context switching</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-terminal-green mr-2">•</span>
                          <span>Quick component insertions and autocompletions</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-terminal-green text-white flex items-center justify-center text-2xl font-bold border-2 border-black mr-4">
                  3
                </div>
                <h3 className="text-3xl font-bold">Implement Your First Component</h3>
              </div>
              <div className="border-2 border-black p-8 bg-white">
                <p className="text-lg mb-6 leading-relaxed">
                  Now it's time to implement your first HubLab component! Let's start with a simple example:
                  adding a primary button to your application. Follow the AI-specific instructions below.
                </p>

                {/* Grok Instructions */}
                {selectedAI === 'grok' && (
                  <div className="bg-gray-50 border-2 border-black p-6">
                    <h4 className="text-2xl font-bold mb-4 text-terminal-green">Using Grok</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold mb-2">1. Access Grok on X</h5>
                        <p className="text-sm mb-2">
                          Go to X (formerly Twitter) and click on the Grok button. Make sure you have X Premium+.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">2. Describe What You Want</h5>
                        <div className="bg-white border-2 border-black p-4 mb-2">
                          <p className="font-mono text-sm mb-2 font-bold">Example Prompt:</p>
                          <p className="font-mono text-sm">
                            "Create a primary button component in React with TypeScript using Tailwind CSS.
                            The button should have hover effects, support different sizes (small, medium, large),
                            and include loading and disabled states. Style it with a green background that matches
                            the terminal-green color (#00ff00)."
                          </p>
                        </div>
                        <p className="text-sm">
                          Grok will generate a complete button component with creative enhancements.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">3. Copy and Paste the Code</h5>
                        <p className="text-sm mb-2">
                          Copy the generated code and create a new file in your project at{' '}
                          <code className="bg-white px-2 py-1 border border-black">components/Button.tsx</code>
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">4. Import and Use</h5>
                        <div className="bg-white border-2 border-black p-4">
                          <pre className="font-mono text-sm overflow-x-auto">
{`import Button from '@/components/Button';

export default function Page() {
  return (
    <Button size="medium" onClick={() => alert('Clicked!')}>
      Click Me
    </Button>
  );
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Claude Instructions */}
                {selectedAI === 'claude' && (
                  <div className="bg-gray-50 border-2 border-black p-6">
                    <h4 className="text-2xl font-bold mb-4 text-blue-600">Using Claude</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold mb-2">1. Access Claude</h5>
                        <p className="text-sm mb-2">
                          Go to claude.ai and start a new conversation. You can use the free tier or Claude Pro.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">2. Provide Context and Requirements</h5>
                        <div className="bg-white border-2 border-black p-4 mb-2">
                          <p className="font-mono text-sm mb-2 font-bold">Example Prompt:</p>
                          <p className="font-mono text-sm">
                            "I'm building a Next.js 14 application with TypeScript and Tailwind CSS. I need a
                            production-ready button component with the following requirements:
                            - TypeScript with full type safety
                            - Support for variants: primary, secondary, outline
                            - Size options: sm, md, lg
                            - Loading and disabled states
                            - Proper accessibility with ARIA labels
                            - Hover and focus states
                            Please include comprehensive props interface and JSDoc comments."
                          </p>
                        </div>
                        <p className="text-sm">
                          Claude will provide a well-structured, production-ready component with detailed comments.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">3. Review and Implement</h5>
                        <p className="text-sm mb-2">
                          Claude's code will include error handling and best practices. Review the implementation
                          and create the component file in your project.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">4. Test the Component</h5>
                        <div className="bg-white border-2 border-black p-4">
                          <pre className="font-mono text-sm overflow-x-auto">
{`import { Button } from '@/components/Button';

export default function TestPage() {
  return (
    <div className="space-y-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary" size="lg">Large Secondary</Button>
      <Button variant="outline" disabled>Disabled</Button>
      <Button isLoading>Loading...</Button>
    </div>
  );
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ChatGPT Instructions */}
                {selectedAI === 'chatgpt' && (
                  <div className="bg-gray-50 border-2 border-black p-6">
                    <h4 className="text-2xl font-bold mb-4 text-purple-600">Using ChatGPT</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold mb-2">1. Access ChatGPT</h5>
                        <p className="text-sm mb-2">
                          Visit chat.openai.com or use the ChatGPT app. Free tier works great for getting started.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">2. Ask for Step-by-Step Guidance</h5>
                        <div className="bg-white border-2 border-black p-4 mb-2">
                          <p className="font-mono text-sm mb-2 font-bold">Example Prompt:</p>
                          <p className="font-mono text-sm">
                            "I'm learning React and Next.js. Can you help me create a button component?
                            I need it to work with TypeScript and Tailwind CSS. Please explain each part
                            of the code as you write it, including why we make certain decisions and what
                            best practices we're following. I want to understand how to make reusable components."
                          </p>
                        </div>
                        <p className="text-sm">
                          ChatGPT will provide detailed explanations along with the code.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">3. Ask Follow-up Questions</h5>
                        <p className="text-sm mb-2">
                          Don't hesitate to ask ChatGPT to explain anything you don't understand. For example:
                          "Why did we use forwardRef here?" or "How does the className prop merging work?"
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">4. Implement and Experiment</h5>
                        <div className="bg-white border-2 border-black p-4">
                          <pre className="font-mono text-sm overflow-x-auto">
{`// ChatGPT will explain that this imports the Button
import Button from '@/components/Button';

// And that this creates a functional component
export default function HomePage() {
  // With event handlers for interactivity
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <Button onClick={handleClick}>Click Me</Button>;
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Copilot Instructions */}
                {selectedAI === 'copilot' && (
                  <div className="bg-gray-50 border-2 border-black p-6">
                    <h4 className="text-2xl font-bold mb-4 text-red-600">Using GitHub Copilot</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold mb-2">1. Install GitHub Copilot</h5>
                        <p className="text-sm mb-2">
                          Install the GitHub Copilot extension in VS Code, JetBrains IDEs, or your preferred editor.
                          You'll need an active GitHub Copilot subscription.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">2. Create Component File</h5>
                        <p className="text-sm mb-2">
                          Create a new file: <code className="bg-white px-2 py-1 border border-black">components/Button.tsx</code>
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">3. Write Descriptive Comments</h5>
                        <div className="bg-white border-2 border-black p-4 mb-2">
                          <pre className="font-mono text-sm overflow-x-auto">
{`// HubLab Primary Button Component
// Supports multiple sizes, variants, loading states, and full TypeScript
// Styled with Tailwind CSS and terminal-green theme

interface ButtonProps {`}
                          </pre>
                        </div>
                        <p className="text-sm">
                          As you type comments, Copilot will suggest implementations. Press Tab to accept suggestions.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">4. Let Copilot Autocomplete</h5>
                        <p className="text-sm mb-2">
                          Copilot will suggest prop types, component logic, and styling as you type. Review
                          suggestions carefully and customize as needed.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">5. Use in Your Pages</h5>
                        <div className="bg-white border-2 border-black p-4">
                          <pre className="font-mono text-sm overflow-x-auto">
{`// Type "import Button" and Copilot will suggest the import
// Then start typing your JSX and Copilot will suggest usage

<Button>Copilot will suggest props here</Button>`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 4 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-terminal-green text-white flex items-center justify-center text-2xl font-bold border-2 border-black mr-4">
                  4
                </div>
                <h3 className="text-3xl font-bold">Customize Components</h3>
              </div>
              <div className="border-2 border-black p-8 bg-white">
                <p className="text-lg mb-6 leading-relaxed">
                  All HubLab components are built with Tailwind CSS, making customization straightforward.
                  You can easily modify colors, spacing, typography, and behavior to match your brand.
                </p>
                <div className="space-y-6">
                  <div className="bg-gray-50 border-2 border-black p-6">
                    <h4 className="text-xl font-bold mb-4 text-terminal-green">Customization Approaches</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold mb-2">1. Modify Tailwind Classes</h5>
                        <p className="text-sm mb-2">
                          The simplest way to customize is to change the Tailwind classes in the component.
                        </p>
                        <div className="bg-white border-2 border-black p-4">
                          <pre className="font-mono text-sm">
{`// Change background from green to blue
className="bg-blue-600 hover:bg-blue-700"

// Adjust padding and border radius
className="px-8 py-4 rounded-xl"`}
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">2. Use Component Props</h5>
                        <p className="text-sm mb-2">
                          Many components accept className props for easy customization without editing the source.
                        </p>
                        <div className="bg-white border-2 border-black p-4">
                          <pre className="font-mono text-sm">
{`<Button
  className="bg-purple-600 text-lg shadow-xl"
  size="lg"
>
  Custom Button
</Button>`}
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2">3. Extend with CSS Variables</h5>
                        <p className="text-sm mb-2">
                          For theme-wide changes, use CSS variables in your global stylesheet.
                        </p>
                        <div className="bg-white border-2 border-black p-4">
                          <pre className="font-mono text-sm">
{`:root {
  --color-primary: #00ff00;
  --color-secondary: #0000ff;
  --border-radius: 0.5rem;
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-terminal-green text-white flex items-center justify-center text-2xl font-bold border-2 border-black mr-4">
                  5
                </div>
                <h3 className="text-3xl font-bold">Build More Complex Features</h3>
              </div>
              <div className="border-2 border-black p-8 bg-white">
                <p className="text-lg mb-6 leading-relaxed">
                  Once you're comfortable with basic components, it's time to combine multiple components
                  to build complete features and pages.
                </p>
                <div className="bg-gray-50 border-2 border-black p-6 mb-6">
                  <h4 className="text-xl font-bold mb-4 text-terminal-green">Example: Building a Product Page</h4>
                  <p className="mb-4">
                    Ask your AI assistant to help you combine multiple components:
                  </p>
                  <div className="bg-white border-2 border-black p-4 mb-4">
                    <p className="font-mono text-sm mb-2 font-bold">Prompt Example:</p>
                    <p className="font-mono text-sm">
                      "Using HubLab components, create a product detail page with: a navigation bar,
                      product image gallery, product title and description, price display, add to cart button,
                      reviews section, and related products grid. Use TypeScript and make it mobile-responsive."
                    </p>
                  </div>
                  <p className="text-sm">
                    Your AI assistant will combine multiple components into a cohesive page layout.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-2 border-black p-4 bg-white">
                    <h5 className="font-bold mb-2 text-terminal-green">E-commerce Features</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• Product listings with filters</li>
                      <li>• Shopping cart functionality</li>
                      <li>• Checkout flow with payment</li>
                      <li>• Order tracking dashboard</li>
                    </ul>
                  </div>
                  <div className="border-2 border-black p-4 bg-white">
                    <h5 className="font-bold mb-2 text-terminal-green">Dashboard Features</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• Analytics charts and graphs</li>
                      <li>• Data tables with filtering</li>
                      <li>• User management interface</li>
                      <li>• Settings and configuration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Workflows */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Common Workflows
            </h2>
            <div className="space-y-6">
              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Building a Landing Page</h3>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-bold mr-3">1.</span>
                    <span>Start with a Hero component for your main message</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">2.</span>
                    <span>Add a Features section to showcase benefits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">3.</span>
                    <span>Include Testimonials for social proof</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">4.</span>
                    <span>Add a Pricing Table to display plans</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">5.</span>
                    <span>End with a CTA Section and Contact Form</span>
                  </li>
                </ol>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Creating an Admin Dashboard</h3>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-bold mr-3">1.</span>
                    <span>Implement a Sidebar Navigation for main menu</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">2.</span>
                    <span>Add Stats Cards to display key metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">3.</span>
                    <span>Include Charts for data visualization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">4.</span>
                    <span>Add Data Tables for managing records</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">5.</span>
                    <span>Include Activity Feed for recent events</span>
                  </li>
                </ol>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-2xl font-bold mb-4 text-terminal-green">Building an Online Store</h3>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-bold mr-3">1.</span>
                    <span>Create a Product Grid to display items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">2.</span>
                    <span>Add Product Filters for easy searching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">3.</span>
                    <span>Implement Shopping Cart with item management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">4.</span>
                    <span>Build Checkout Flow with forms and validation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">5.</span>
                    <span>Add Order Confirmation and tracking pages</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Troubleshooting Common Issues
            </h2>
            <div className="space-y-6">
              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">
                  Issue: Tailwind Classes Not Working
                </h3>
                <p className="mb-4">
                  <strong>Symptoms:</strong> Components appear unstyled or missing CSS.
                </p>
                <p className="mb-4">
                  <strong>Solution:</strong> Make sure Tailwind CSS is properly configured:
                </p>
                <div className="bg-gray-50 border-2 border-black p-4">
                  <pre className="font-mono text-sm overflow-x-auto">
{`// Check tailwind.config.js includes your component paths
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
}`}
                  </pre>
                </div>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">
                  Issue: TypeScript Errors
                </h3>
                <p className="mb-4">
                  <strong>Symptoms:</strong> Red squiggly lines, type errors, "cannot find module" errors.
                </p>
                <p className="mb-4">
                  <strong>Solution:</strong> Make sure all imports are correct and types are defined:
                </p>
                <div className="bg-gray-50 border-2 border-black p-4">
                  <pre className="font-mono text-sm overflow-x-auto">
{`// Install missing type definitions
npm install --save-dev @types/react @types/node

// Restart your TypeScript server in VS Code
// Cmd+Shift+P > "TypeScript: Restart TS Server"`}
                  </pre>
                </div>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">
                  Issue: Component Not Rendering
                </h3>
                <p className="mb-4">
                  <strong>Symptoms:</strong> Component doesn't appear on the page, no errors.
                </p>
                <p className="mb-4">
                  <strong>Solution:</strong> Check for common mistakes:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Ensure you're using 'use client' directive for client components</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Check that component is properly exported (export default)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Verify import path is correct</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Look for JavaScript errors in browser console</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-black p-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">
                  Issue: AI Assistant Misunderstands Requirements
                </h3>
                <p className="mb-4">
                  <strong>Symptoms:</strong> Generated code doesn't match what you wanted.
                </p>
                <p className="mb-4">
                  <strong>Solution:</strong> Improve your prompts:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Be more specific about requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Mention "HubLab components" explicitly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Provide examples of what you want</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-terminal-green mr-2">•</span>
                    <span>Ask the AI to clarify if it's unsure</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-black border-b-2 border-black pb-4">
              Next Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">Explore Components</h3>
                <p className="mb-4">
                  Browse all 290+ components to see what's available and get inspired for your next project.
                </p>
                <Link href="/components" className="text-terminal-green underline font-bold">
                  View Components →
                </Link>
              </div>
              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">Read Documentation</h3>
                <p className="mb-4">
                  Dive deeper into the API, learn about advanced features, and discover best practices.
                </p>
                <Link href="/docs" className="text-terminal-green underline font-bold">
                  Read Docs →
                </Link>
              </div>
              <div className="border-2 border-black p-6 bg-white sacred-hover">
                <h3 className="text-xl font-bold mb-4 text-terminal-green">Join Community</h3>
                <p className="mb-4">
                  Connect with other HubLab users, share your projects, and get help when you need it.
                </p>
                <Link href="/" className="text-terminal-green underline font-bold">
                  Join Now →
                </Link>
              </div>
            </div>
          </section>

          {/* Success CTA */}
          <section className="border-2 border-black p-12 bg-terminal-green text-white text-center">
            <h2 className="text-4xl font-bold mb-6">You're Ready to Build!</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Congratulations! You now know how to use HubLab components with AI assistants. Start building
              amazing applications with 290+ production-ready components.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/components"
                className="bg-white text-black px-8 py-4 border-2 border-black sacred-hover font-bold inline-block"
              >
                Browse Components
              </Link>
              <Link
                href="/docs"
                className="bg-black text-white px-8 py-4 border-2 border-white sacred-hover font-bold inline-block"
              >
                View Full Docs
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
                  AI-powered React component library. 290+ components for modern web development.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">Getting Started</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/getting-started#prerequisites" className="sacred-hover">Prerequisites</Link></li>
                  <li><Link href="/getting-started#tutorial" className="sacred-hover">Tutorial</Link></li>
                  <li><Link href="/getting-started#troubleshooting" className="sacred-hover">Troubleshooting</Link></li>
                  <li><Link href="/getting-started#next-steps" className="sacred-hover">Next Steps</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/docs" className="sacred-hover">Documentation</Link></li>
                  <li><Link href="/components" className="sacred-hover">Component Library</Link></li>
                  <li><Link href="/docs#api" className="sacred-hover">API Reference</Link></li>
                  <li><Link href="/docs#examples" className="sacred-hover">Examples</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-lg">AI Assistants</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/getting-started?ai=grok" className="sacred-hover">Grok Guide</Link></li>
                  <li><Link href="/getting-started?ai=claude" className="sacred-hover">Claude Guide</Link></li>
                  <li><Link href="/getting-started?ai=chatgpt" className="sacred-hover">ChatGPT Guide</Link></li>
                  <li><Link href="/getting-started?ai=copilot" className="sacred-hover">Copilot Guide</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t-2 border-black mt-8 pt-8 text-center text-sm">
              <p>HubLab - Get Started in Minutes, Build for Hours</p>
              <p className="mt-2 text-terminal-green">Powered by AI, Built for Developers</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

"use client";

import React, { useState } from 'react';
import { BlockRenderer, BlockInstance, getRegisteredBlocks } from '@/components/BlockRenderer';

// ============================================
// DEMO PAGE - Block System Showcase
// ============================================

export default function DemoBlocksPage() {
  // Sample page with blocks
  const [blocks] = useState<BlockInstance[]>([
    {
      id: '1',
      blockId: 'hero-1',
      type: 'hero-section',
      props: {
        title: '🚀 Welcome to HubLab Blocks',
        subtitle: 'Build beautiful websites with drag-and-drop blocks powered by AI',
        ctaText: 'Explore Blocks',
        ctaLink: '/blocks',
      },
    },
    {
      id: '2',
      blockId: 'features-1',
      type: 'features-grid',
      props: {
        title: 'Why Choose HubLab Blocks?',
        features: [
          {
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Build pages in minutes, not hours. Drag, drop, and configure blocks instantly.',
          },
          {
            icon: '🤖',
            title: 'AI-Powered',
            description: 'Use with Cursor, Lovable, or any AI IDE. Blocks are designed for vibe coding.',
          },
          {
            icon: '🎨',
            title: 'Beautiful by Default',
            description: 'Every block is professionally designed and fully responsive out of the box.',
          },
          {
            icon: '🔌',
            title: 'Extensible',
            description: 'Create your own blocks or buy them from the marketplace. Easy to customize.',
          },
          {
            icon: '💰',
            title: 'Monetize',
            description: 'Sell your custom blocks on HubLab marketplace and earn passive income.',
          },
          {
            icon: '🛡️',
            title: 'Secure',
            description: 'All blocks are reviewed and sandboxed for security. Your data is safe.',
          },
        ],
      },
    },
    {
      id: '3',
      blockId: 'testimonials-1',
      type: 'testimonials',
      props: {
        title: 'What Developers Are Saying',
        testimonials: [
          {
            name: 'Alex Chen',
            role: 'Indie Hacker',
            content: 'HubLab blocks saved me weeks of development time. I built my SaaS landing page in 2 hours!',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          },
          {
            name: 'Sarah Johnson',
            role: 'Frontend Developer',
            content: 'The AI integration with Cursor is mind-blowing. I just describe what I want and it builds it.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          },
          {
            name: 'Mike Rodriguez',
            role: 'Startup Founder',
            content: "Best marketplace for reusable components. I've made $5K selling my custom blocks here.",
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          },
        ],
      },
    },
    {
      id: '4',
      blockId: 'pricing-1',
      type: 'pricing-table',
      props: {
        title: 'Simple, Transparent Pricing',
        plans: [
          {
            name: 'Free',
            price: '$0',
            period: 'forever',
            features: [
              'Access to free blocks',
              'Basic page builder',
              'Community support',
              'Up to 3 pages',
            ],
            ctaText: 'Start Free',
            ctaLink: '/signup',
          },
          {
            name: 'Pro',
            price: '$29',
            period: 'month',
            features: [
              'Access to all blocks',
              'Advanced page builder',
              'Priority support',
              'Unlimited pages',
              'Custom domain',
              'Analytics dashboard',
            ],
            highlighted: true,
            ctaText: 'Start Pro Trial',
            ctaLink: '/signup?plan=pro',
          },
          {
            name: 'Enterprise',
            price: '$99',
            period: 'month',
            features: [
              'Everything in Pro',
              'Custom blocks',
              'White label',
              'Dedicated support',
              'SSO & Security',
              'Team collaboration',
            ],
            ctaText: 'Contact Sales',
            ctaLink: '/contact',
          },
        ],
      },
    },
    {
      id: '5',
      blockId: 'cta-1',
      type: 'cta-section',
      props: {
        title: 'Ready to Build Something Amazing?',
        description: 'Join thousands of developers already using HubLab Blocks',
        primaryText: 'Get Started Free',
        primaryLink: '/signup',
        secondaryText: 'View Marketplace',
        secondaryLink: '/blocks',
      },
    },
  ]);

  const [isEditorMode, setIsEditorMode] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const registeredBlocks = getRegisteredBlocks();

  return (
    <div className="min-h-screen bg-white">
      {/* Debug Toolbar */}
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🧱 HubLab Blocks Demo</h1>
            <p className="text-sm text-gray-400">
              This page is built entirely with reusable blocks from the marketplace
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-400">Blocks on page:</span>{' '}
              <span className="font-bold">{blocks.length}</span>
            </div>

            <button
              onClick={() => setIsEditorMode(!isEditorMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                isEditorMode
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isEditorMode ? '👁️ Preview Mode' : '✏️ Editor Mode'}
            </button>

            <a
              href="/"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Editor Info */}
      {isEditorMode && (
        <div className="bg-yellow-50 border-b-2 border-yellow-200 p-4">
          <div className="container mx-auto">
            <p className="text-yellow-800 font-medium">
              ✏️ <strong>Editor Mode Active</strong> - Click on any block to select it (in a real editor, you
              could configure props, reorder, or delete blocks)
            </p>
            {selectedBlockId && (
              <p className="text-sm text-yellow-700 mt-1">
                Selected block: <code className="bg-yellow-100 px-2 py-1 rounded">{selectedBlockId}</code>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content - Render Blocks */}
      <div className={isEditorMode ? 'ring-2 ring-blue-300 ring-offset-4' : ''}>
        <BlockRenderer
          blocks={blocks}
          isEditor={isEditorMode}
          onBlockSelect={(blockId) => {
            setSelectedBlockId(blockId);
            console.log('Selected block:', blockId);
          }}
        />
      </div>

      {/* Side Panel - Block Info (only in editor mode) */}
      {isEditorMode && (
        <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-2xl border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">📦 Available Blocks</h2>
            <p className="text-sm text-gray-600 mb-6">
              These are the {registeredBlocks.length} blocks currently registered in the system:
            </p>

            <div className="space-y-3">
              {registeredBlocks.map((block) => (
                <div
                  key={block.type}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                >
                  <div className="font-semibold text-sm">{block.schema.title}</div>
                  <div className="text-xs text-gray-500 mt-1">Type: {block.type}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">💡 Next Steps:</h3>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Add drag-and-drop editor</li>
                <li>• Create blocks marketplace</li>
                <li>• Implement block upload</li>
                <li>• Add visual prop editor</li>
                <li>• Enable save/load pages</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">🎨 How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-semibold mb-1">Browse Blocks</h4>
              <p className="text-sm text-gray-400">
                Explore the marketplace for UI components, integrations, and AI-powered blocks
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-semibold mb-1">Drag & Drop</h4>
              <p className="text-sm text-gray-400">
                Build your page visually by dragging blocks from the sidebar and configuring them
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-semibold mb-1">Deploy</h4>
              <p className="text-sm text-gray-400">
                Export to code or deploy instantly. Your page is production-ready in minutes
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Built with ❤️ by HubLab • Powered by Next.js, React, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

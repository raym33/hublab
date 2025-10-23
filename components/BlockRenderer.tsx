"use client";

import React, { Suspense, lazy, ComponentType } from 'react';
import { Block } from '@/lib/supabase';

// ============================================
// BLOCK RENDERER
// Renders blocks dynamically from JSON schema
// ============================================

export interface BlockInstance {
  id: string;              // Unique instance ID
  blockId: string;         // Reference to block in marketplace
  type: string;            // Block type (e.g., "hero-section")
  props: Record<string, any>; // User-configured props
  position?: {
    x?: number;
    y?: number;
    width?: string | number;
    height?: string | number;
    order?: number;
  };
  children?: BlockInstance[];
}

interface BlockRegistryEntry {
  component: ComponentType<any>;
  schema: any;
}

// Global block registry
// In production, this would be populated dynamically from marketplace
const blockRegistry: Record<string, BlockRegistryEntry> = {};

// ============================================
// CORE BLOCKS (Built-in)
// ============================================

// Hero Section Block
const HeroSection: React.FC<{
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}> = ({ title, subtitle, ctaText, ctaLink, backgroundImage }) => {
  return (
    <section
      className="relative py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' } : {}}
    >
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">{title || 'Welcome to Our Site'}</h1>
        <p className="text-xl mb-8 opacity-90">{subtitle || 'Build amazing things with blocks'}</p>
        {ctaText && (
          <a
            href={ctaLink || '#'}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
};

// Features Grid Block
const FeaturesGrid: React.FC<{
  title?: string;
  features?: Array<{ icon?: string; title: string; description: string }>;
}> = ({ title, features = [] }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              {feature.icon && <div className="text-4xl mb-4">{feature.icon}</div>}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Block
const CTASection: React.FC<{
  title?: string;
  description?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}> = ({ title, description, primaryText, primaryLink, secondaryText, secondaryLink }) => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-4xl font-bold mb-4">{title || 'Ready to get started?'}</h2>
        <p className="text-xl text-gray-600 mb-8">{description || 'Join thousands of users today'}</p>
        <div className="flex gap-4 justify-center">
          {primaryText && (
            <a
              href={primaryLink || '#'}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {primaryText}
            </a>
          )}
          {secondaryText && (
            <a
              href={secondaryLink || '#'}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              {secondaryText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

// Testimonials Block
const Testimonials: React.FC<{
  title?: string;
  testimonials?: Array<{ name: string; role: string; content: string; avatar?: string }>;
}> = ({ title, testimonials = [] }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {testimonial.avatar && (
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                )}
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Table Block
const PricingTable: React.FC<{
  title?: string;
  plans?: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
    ctaLink?: string;
  }>;
}> = ({ title, plans = [] }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-8 ${
                plan.highlighted
                  ? 'bg-blue-600 text-white shadow-2xl scale-105'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-lg opacity-75">/{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaLink || '#'}
                className={`block text-center py-3 rounded-lg font-semibold transition ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.ctaText || 'Get Started'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Register core blocks
blockRegistry['hero-section'] = {
  component: HeroSection,
  schema: {
    title: 'Hero Section',
    type: 'object',
    properties: {
      title: { type: 'string', default: 'Welcome to Our Site' },
      subtitle: { type: 'string', default: 'Build amazing things with blocks' },
      ctaText: { type: 'string', default: 'Get Started' },
      ctaLink: { type: 'string', default: '#' },
      backgroundImage: { type: 'string' },
    },
  },
};

blockRegistry['features-grid'] = {
  component: FeaturesGrid,
  schema: {
    title: 'Features Grid',
    type: 'object',
    properties: {
      title: { type: 'string' },
      features: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            icon: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    },
  },
};

blockRegistry['cta-section'] = {
  component: CTASection,
  schema: {
    title: 'CTA Section',
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      primaryText: { type: 'string' },
      primaryLink: { type: 'string' },
      secondaryText: { type: 'string' },
      secondaryLink: { type: 'string' },
    },
  },
};

blockRegistry['testimonials'] = {
  component: Testimonials,
  schema: {
    title: 'Testimonials',
    type: 'object',
    properties: {
      title: { type: 'string' },
      testimonials: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            role: { type: 'string' },
            content: { type: 'string' },
            avatar: { type: 'string' },
          },
        },
      },
    },
  },
};

blockRegistry['pricing-table'] = {
  component: PricingTable,
  schema: {
    title: 'Pricing Table',
    type: 'object',
    properties: {
      title: { type: 'string' },
      plans: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            price: { type: 'string' },
            period: { type: 'string' },
            features: { type: 'array', items: { type: 'string' } },
            highlighted: { type: 'boolean' },
            ctaText: { type: 'string' },
            ctaLink: { type: 'string' },
          },
        },
      },
    },
  },
};

// ============================================
// BLOCK RENDERER COMPONENT
// ============================================

interface BlockRendererProps {
  blocks: BlockInstance[];
  isEditor?: boolean;
  onBlockSelect?: (blockId: string) => void;
}

export function BlockRenderer({ blocks, isEditor = false, onBlockSelect }: BlockRendererProps) {
  return (
    <div className="block-renderer">
      {blocks.map((block) => (
        <BlockWrapper
          key={block.id}
          block={block}
          isEditor={isEditor}
          onSelect={onBlockSelect}
        />
      ))}
    </div>
  );
}

interface BlockWrapperProps {
  block: BlockInstance;
  isEditor?: boolean;
  onSelect?: (blockId: string) => void;
}

function BlockWrapper({ block, isEditor, onSelect }: BlockWrapperProps) {
  const entry = blockRegistry[block.type];

  if (!entry) {
    return (
      <div className="p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg my-2">
        <p className="text-red-600 font-medium">⚠️ Unknown block type: {block.type}</p>
        <p className="text-sm text-gray-600 mt-1">
          This block type is not registered. It may need to be installed from the marketplace.
        </p>
      </div>
    );
  }

  const Component = entry.component;

  const style: React.CSSProperties = {};
  if (block.position) {
    if (block.position.x !== undefined) style.left = block.position.x;
    if (block.position.y !== undefined) style.top = block.position.y;
    if (block.position.width) style.width = block.position.width;
    if (block.position.height) style.height = block.position.height;
    if (block.position.order !== undefined) style.order = block.position.order;
  }

  return (
    <div
      className={`block-wrapper ${isEditor ? 'cursor-pointer hover:ring-2 hover:ring-blue-500' : ''}`}
      style={style}
      onClick={() => isEditor && onSelect && onSelect(block.id)}
    >
      <Suspense fallback={<div className="p-8 text-center">Loading block...</div>}>
        <Component {...block.props} blockId={block.blockId} instanceId={block.id} />
      </Suspense>

      {block.children && block.children.length > 0 && (
        <BlockRenderer blocks={block.children} isEditor={isEditor} onSelect={onSelect} />
      )}
    </div>
  );
}

// ============================================
// HELPER: Register a new block dynamically
// ============================================

export function registerBlock(type: string, component: ComponentType<any>, schema: any) {
  blockRegistry[type] = { component, schema };
}

// ============================================
// HELPER: Get registered blocks
// ============================================

export function getRegisteredBlocks() {
  return Object.keys(blockRegistry).map((key) => ({
    type: key,
    schema: blockRegistry[key].schema,
  }));
}

// ============================================
// HELPER: Load block from marketplace
// ============================================

export async function loadMarketplaceBlock(blockKey: string, componentUrl: string) {
  try {
    // In production, this would dynamically import from marketplace
    // For now, return placeholder
    console.log('Loading block from marketplace:', blockKey, componentUrl);

    // Example: dynamic import
    // const module = await import(componentUrl);
    // registerBlock(blockKey, module.default, module.schema);

    return true;
  } catch (error) {
    console.error('Failed to load block:', error);
    return false;
  }
}

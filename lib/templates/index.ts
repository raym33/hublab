// ============================================
// HUBLAB TEMPLATES SYSTEM
// Starter templates for common use cases
// ============================================

export type TemplateCategory =
  | 'landing-page'
  | 'dashboard'
  | 'ecommerce'
  | 'admin-panel'
  | 'portfolio'
  | 'blog'

export type Template = {
  id: string
  name: string
  description: string
  category: TemplateCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  features: string[]
  integrations: string[]
  techStack: string[]
  preview: string
  thumbnail: string
  demoUrl?: string
  codeUrl?: string
}

export const TEMPLATES: Template[] = [
  {
    id: 'landing-page-saas',
    name: 'SaaS Landing Page',
    description: 'Modern landing page with hero, features, pricing, and CTA sections. Perfect for SaaS products.',
    category: 'landing-page',
    difficulty: 'beginner',
    estimatedTime: '5-10 min',
    features: [
      'Responsive navigation',
      'Hero section with CTA',
      'Feature showcase grid',
      'Pricing tables with tiers',
      'Contact form',
      'Footer with links',
    ],
    integrations: ['None required', 'Optional: Analytics', 'Optional: Email service'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
    preview: '/templates/previews/landing-saas.png',
    thumbnail: '/templates/thumbs/landing-saas.jpg',
    demoUrl: '/examples/demo/landing-page-saas',
    codeUrl: '/examples/landing-page-saas.tsx',
  },
  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'Professional admin dashboard with real-time stats, charts, and data tables.',
    category: 'dashboard',
    difficulty: 'intermediate',
    estimatedTime: '15-20 min',
    features: [
      'KPI stats cards',
      'Interactive charts',
      'Data tables with sorting',
      'Filters and date ranges',
      'Export functionality',
      'Real-time updates',
    ],
    integrations: ['Supabase', 'Firebase', 'REST API'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Supabase'],
    preview: '/templates/previews/dashboard-analytics.png',
    thumbnail: '/templates/thumbs/dashboard-analytics.jpg',
    demoUrl: '/examples/demo/dashboard-analytics',
    codeUrl: '/examples/dashboard-analytics.tsx',
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'Full-featured online store with product catalog, cart, and checkout.',
    category: 'ecommerce',
    difficulty: 'advanced',
    estimatedTime: '20-25 min',
    features: [
      'Product grid with filters',
      'Shopping cart',
      'Checkout flow',
      'Order management',
      'Search functionality',
      'Payment integration',
    ],
    integrations: ['Stripe', 'Supabase', 'Shopify API'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Supabase'],
    preview: '/templates/previews/ecommerce.png',
    thumbnail: '/templates/thumbs/ecommerce.jpg',
  },
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    description: 'Complete admin panel with CRUD operations, user management, and settings.',
    category: 'admin-panel',
    difficulty: 'intermediate',
    estimatedTime: '15-20 min',
    features: [
      'User management',
      'CRUD operations',
      'Role-based access',
      'Settings panel',
      'Activity logs',
      'Data export',
    ],
    integrations: ['Supabase', 'NextAuth', 'Firebase'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'NextAuth', 'Supabase'],
    preview: '/templates/previews/admin-panel.png',
    thumbnail: '/templates/thumbs/admin-panel.jpg',
  },
  {
    id: 'portfolio-personal',
    name: 'Personal Portfolio',
    description: 'Clean portfolio website to showcase your work and skills.',
    category: 'portfolio',
    difficulty: 'beginner',
    estimatedTime: '10-15 min',
    features: [
      'Hero with bio',
      'Project showcase',
      'Skills section',
      'Contact form',
      'Blog integration',
      'Dark mode',
    ],
    integrations: ['Optional: CMS', 'Optional: Analytics'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'MDX'],
    preview: '/templates/previews/portfolio.png',
    thumbnail: '/templates/thumbs/portfolio.jpg',
  },
  {
    id: 'blog-markdown',
    name: 'Blog with Markdown',
    description: 'Modern blog with markdown support, categories, and search.',
    category: 'blog',
    difficulty: 'intermediate',
    estimatedTime: '15-20 min',
    features: [
      'Markdown posts',
      'Categories and tags',
      'Search functionality',
      'RSS feed',
      'Comments',
      'SEO optimized',
    ],
    integrations: ['MDX', 'Contentful', 'Sanity'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'MDX', 'Contentful'],
    preview: '/templates/previews/blog.png',
    thumbnail: '/templates/thumbs/blog.jpg',
  },
]

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return TEMPLATES.filter(t => t.category === category)
}

export function getTemplatesByDifficulty(difficulty: Template['difficulty']): Template[] {
  return TEMPLATES.filter(t => t.difficulty === difficulty)
}

export const TEMPLATE_CATEGORIES = [
  { id: 'landing-page', name: 'Landing Pages', description: 'Marketing and product pages' },
  { id: 'dashboard', name: 'Dashboards', description: 'Analytics and admin dashboards' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Online stores and marketplaces' },
  { id: 'admin-panel', name: 'Admin Panels', description: 'Backend management interfaces' },
  { id: 'portfolio', name: 'Portfolios', description: 'Personal and agency portfolios' },
  { id: 'blog', name: 'Blogs', description: 'Content and publishing platforms' },
] as const

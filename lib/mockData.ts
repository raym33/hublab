export interface Prototype {
  id: string
  title: string
  description: string
  price: number
  category: string
  tech_stack: string[]
  preview_image_url: string | null
  creator_id: string
  published: boolean
  created_at: string
  downloads: number
  rating: number
}

export const mockPrototypes: Prototype[] = [
  {
    id: '1',
    title: 'Analytics Dashboard Pro',
    description: 'Complete analytics dashboard with real-time charts, user tracking, and revenue metrics. Built with Next.js 14 and Recharts.',
    price: 49,
    category: 'Dashboard',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind', 'Recharts', 'Supabase'],
    preview_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    creator_id: 'user1',
    published: true,
    created_at: '2024-01-15',
    downloads: 234,
    rating: 4.8
  },
  {
    id: '2',
    title: 'SaaS Starter Kit',
    description: 'Production-ready SaaS template with authentication, payments, team management, and admin panel. Stripe integration included.',
    price: 79,
    category: 'Web App',
    tech_stack: ['Next.js', 'Stripe', 'Supabase', 'Tailwind', 'TypeScript'],
    preview_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    creator_id: 'user2',
    published: true,
    created_at: '2024-01-18',
    downloads: 456,
    rating: 4.9
  },
  {
    id: '3',
    title: 'E-commerce Store',
    description: 'Modern e-commerce platform with shopping cart, product catalog, checkout flow, and order management. Fully responsive.',
    price: 89,
    category: 'Web App',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind'],
    preview_image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    creator_id: 'user3',
    published: true,
    created_at: '2024-01-20',
    downloads: 189,
    rating: 4.7
  },
  {
    id: '4',
    title: 'Task Manager App',
    description: 'Kanban-style task management with drag-drop, team collaboration, and real-time updates. Perfect for agile teams.',
    price: 39,
    category: 'Tool',
    tech_stack: ['React', 'Firebase', 'Tailwind', 'DnD Kit'],
    preview_image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
    creator_id: 'user1',
    published: true,
    created_at: '2024-01-22',
    downloads: 312,
    rating: 4.6
  },
  {
    id: '5',
    title: 'AI Chat Interface',
    description: 'Beautiful chat UI with streaming responses, markdown support, code highlighting, and conversation history. OpenAI ready.',
    price: 45,
    category: 'Web App',
    tech_stack: ['Next.js', 'OpenAI', 'Tailwind', 'TypeScript'],
    preview_image_url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    creator_id: 'user4',
    published: true,
    created_at: '2024-01-25',
    downloads: 567,
    rating: 4.9
  },
  {
    id: '6',
    title: 'Minimal Landing Page',
    description: 'High-converting landing page template with hero section, features, testimonials, pricing, and FAQ. Framer-style design.',
    price: 29,
    category: 'Landing Page',
    tech_stack: ['Next.js', 'Tailwind', 'Framer Motion'],
    preview_image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    creator_id: 'user2',
    published: true,
    created_at: '2024-01-28',
    downloads: 423,
    rating: 4.8
  },
  {
    id: '7',
    title: 'CRM Dashboard',
    description: 'Customer relationship management system with contact management, pipeline tracking, and sales analytics.',
    price: 69,
    category: 'Dashboard',
    tech_stack: ['Vue', 'Supabase', 'Tailwind', 'TypeScript'],
    preview_image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    creator_id: 'user5',
    published: true,
    created_at: '2024-02-01',
    downloads: 198,
    rating: 4.7
  },
  {
    id: '8',
    title: 'Social Media Dashboard',
    description: 'Multi-platform social media management tool with post scheduling, analytics, and engagement tracking.',
    price: 59,
    category: 'Dashboard',
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
    preview_image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
    creator_id: 'user3',
    published: true,
    created_at: '2024-02-03',
    downloads: 287,
    rating: 4.6
  },
  {
    id: '9',
    title: 'Invoice Generator',
    description: 'Professional invoice creation tool with PDF export, client management, and payment tracking. Perfect for freelancers.',
    price: 35,
    category: 'Tool',
    tech_stack: ['Next.js', 'React PDF', 'Tailwind', 'Supabase'],
    preview_image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    creator_id: 'user4',
    published: true,
    created_at: '2024-02-05',
    downloads: 341,
    rating: 4.8
  },
  {
    id: '10',
    title: 'Portfolio Template',
    description: 'Stunning developer portfolio with project showcase, blog, contact form, and dark mode. Fully customizable.',
    price: 25,
    category: 'Landing Page',
    tech_stack: ['Next.js', 'Tailwind', 'MDX', 'TypeScript'],
    preview_image_url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=600&fit=crop',
    creator_id: 'user1',
    published: true,
    created_at: '2024-02-08',
    downloads: 612,
    rating: 4.9
  },
  {
    id: '11',
    title: 'Booking System',
    description: 'Complete appointment booking system with calendar integration, email notifications, and payment processing.',
    price: 75,
    category: 'Web App',
    tech_stack: ['Next.js', 'Stripe', 'Google Calendar', 'Supabase', 'Tailwind'],
    preview_image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop',
    creator_id: 'user2',
    published: true,
    created_at: '2024-02-10',
    downloads: 156,
    rating: 4.7
  },
  {
    id: '12',
    title: 'Blog Platform',
    description: 'Modern blog platform with CMS, markdown editor, SEO optimization, and comment system. Built for speed.',
    price: 55,
    category: 'Web App',
    tech_stack: ['Next.js', 'MDX', 'Tailwind', 'Supabase', 'TypeScript'],
    preview_image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
    creator_id: 'user5',
    published: true,
    created_at: '2024-02-12',
    downloads: 289,
    rating: 4.8
  }
]

export const getPrototypeById = (id: string): Prototype | undefined => {
  return mockPrototypes.find(p => p.id === id)
}

export const getPrototypesByCategory = (category: string): Prototype[] => {
  if (category === 'All') return mockPrototypes
  return mockPrototypes.filter(p => p.category === category)
}

export const searchPrototypes = (query: string): Prototype[] => {
  const lowercaseQuery = query.toLowerCase()
  return mockPrototypes.filter(p =>
    p.title.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.tech_stack.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  )
}
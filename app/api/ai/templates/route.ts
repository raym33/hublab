/**
 * AI Templates Endpoint
 *
 * Pre-built templates combining multiple components
 * Shows AI assistants how to compose complex UIs from simple components
 */

import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Pre-built templates with multiple components
const TEMPLATES = [
  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'Complete analytics dashboard with charts, stats cards, and data table',
    category: 'Dashboard',
    difficulty: 'intermediate',
    components: [
      'card-stats',
      'chart-line',
      'chart-bar',
      'table-data',
      'button-filter',
      'date-range-picker'
    ],
    features: [
      'Real-time data visualization',
      'Filterable charts',
      'Export data functionality',
      'Responsive grid layout'
    ],
    useCases: ['Analytics', 'Business Intelligence', 'Admin Panels'],
    codeExample: `'use client'

import { StatsCard, LineChart, DataTable, FilterButton } from '@/components'

export default function AnalyticsDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value="12,345" change="+12%" />
        <StatsCard title="Revenue" value="$45,678" change="+8%" />
        <StatsCard title="Active Sessions" value="1,234" change="-3%" />
        <StatsCard title="Conversion Rate" value="3.2%" change="+0.5%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineChart
          title="User Growth"
          data={userGrowthData}
          height={300}
        />
        <BarChart
          title="Revenue by Product"
          data={revenueData}
          height={300}
        />
      </div>

      {/* Data Table */}
      <DataTable
        title="Recent Transactions"
        columns={columns}
        data={transactions}
        sortable
        filterable
        exportable
      />
    </div>
  )
}`
  },
  {
    id: 'landing-page-saas',
    name: 'SaaS Landing Page',
    description: 'Modern SaaS landing page with hero, features, pricing, and CTA',
    category: 'Marketing',
    difficulty: 'beginner',
    components: [
      'hero-section',
      'feature-card',
      'pricing-table',
      'testimonial-card',
      'button-primary',
      'footer-section'
    ],
    features: [
      'Responsive hero with animation',
      'Feature highlights',
      'Pricing comparison table',
      'Social proof section',
      'Call-to-action buttons'
    ],
    useCases: ['SaaS Products', 'Marketing Sites', 'Product Launches'],
    codeExample: `'use client'

import {
  HeroSection,
  FeatureCard,
  PricingTable,
  TestimonialCard,
  Button,
  Footer
} from '@/components'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection
        title="Build Better Products Faster"
        subtitle="The all-in-one platform for modern teams"
        cta={<Button size="lg">Start Free Trial</Button>}
        image="/hero-image.png"
      />

      {/* Features */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon="⚡"
            title="Lightning Fast"
            description="Optimized performance for speed"
          />
          <FeatureCard
            icon="🔒"
            title="Secure by Default"
            description="Enterprise-grade security"
          />
          <FeatureCard
            icon="📊"
            title="Powerful Analytics"
            description="Data-driven insights"
          />
        </div>
      </section>

      {/* Pricing */}
      <PricingTable
        plans={[
          { name: 'Starter', price: '$9', features: ['...'] },
          { name: 'Pro', price: '$29', features: ['...'] },
          { name: 'Enterprise', price: 'Custom', features: ['...'] }
        ]}
      />

      {/* Footer */}
      <Footer
        company="YourCompany"
        links={[...]}
        social={[...]}
      />
    </div>
  )
}`
  },
  {
    id: 'ecommerce-product-page',
    name: 'E-Commerce Product Page',
    description: 'Product detail page with gallery, reviews, and add to cart',
    category: 'E-Commerce',
    difficulty: 'intermediate',
    components: [
      'image-gallery',
      'product-details',
      'review-card',
      'rating-stars',
      'button-add-to-cart',
      'breadcrumb-navigation'
    ],
    features: [
      'Image zoom and gallery',
      'Variant selector',
      'Customer reviews',
      'Related products',
      'Add to cart functionality'
    ],
    useCases: ['Online Stores', 'Product Catalogs', 'Marketplaces'],
    codeExample: `'use client'

import {
  ImageGallery,
  ProductDetails,
  ReviewCard,
  RatingStars,
  AddToCartButton,
  Breadcrumbs
} from '@/components'

export default function ProductPage({ product }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name }
        ]}
      />

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        <ImageGallery images={product.images} zoomable />

        <div className="space-y-6">
          <ProductDetails
            name={product.name}
            price={product.price}
            description={product.description}
          />

          <RatingStars rating={product.rating} count={product.reviewCount} />

          <AddToCartButton
            productId={product.id}
            quantity={1}
            size="lg"
          />
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {product.reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  )
}`
  },
  {
    id: 'admin-panel-crud',
    name: 'Admin Panel with CRUD',
    description: 'Admin interface for managing data with create, read, update, delete operations',
    category: 'Admin',
    difficulty: 'advanced',
    components: [
      'sidebar-navigation',
      'data-table',
      'modal-form',
      'button-group',
      'search-input',
      'pagination',
      'toast-notification'
    ],
    features: [
      'Sidebar navigation',
      'Data table with actions',
      'Create/Edit forms in modal',
      'Inline editing',
      'Bulk operations',
      'Success/error notifications'
    ],
    useCases: ['Admin Panels', 'CMS', 'Back-office Tools'],
    codeExample: `'use client'

import {
  Sidebar,
  DataTable,
  Modal,
  Form,
  Button,
  SearchInput,
  Toast
} from '@/components'

export default function AdminPanel() {
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        items={[
          { label: 'Dashboard', icon: 'home', href: '/admin' },
          { label: 'Users', icon: 'users', href: '/admin/users' },
          { label: 'Products', icon: 'box', href: '/admin/products' },
          { label: 'Settings', icon: 'settings', href: '/admin/settings' }
        ]}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button onClick={() => setModalOpen(true)}>
            Add New User
          </Button>
        </div>

        {/* Search & Filters */}
        <SearchInput
          placeholder="Search users..."
          onChange={handleSearch}
        />

        {/* Data Table */}
        <DataTable
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Email', accessor: 'email' },
            { header: 'Role', accessor: 'role' },
            {
              header: 'Actions',
              cell: (row) => (
                <div className="space-x-2">
                  <Button size="sm" onClick={() => handleEdit(row)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(row)}>Delete</Button>
                </div>
              )
            }
          ]}
          data={users}
          sortable
          pagination
        />

        {/* Create/Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <Form
            initialValues={selectedItem}
            onSubmit={handleSubmit}
            fields={[
              { name: 'name', label: 'Name', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'role', label: 'Role', type: 'select', options: [...] }
            ]}
          />
        </Modal>

        {/* Toast Notifications */}
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      </main>
    </div>
  )
}`
  },
  {
    id: 'blog-post-layout',
    name: 'Blog Post Layout',
    description: 'Blog article layout with header, content, sidebar, and comments',
    category: 'Content',
    difficulty: 'beginner',
    components: [
      'article-header',
      'markdown-content',
      'author-card',
      'share-buttons',
      'comment-section',
      'related-posts'
    ],
    features: [
      'Responsive layout',
      'Reading progress bar',
      'Table of contents',
      'Social sharing',
      'Comment system',
      'Related content'
    ],
    useCases: ['Blogs', 'Documentation', 'News Sites'],
    codeExample: `'use client'

import {
  ArticleHeader,
  MarkdownContent,
  AuthorCard,
  ShareButtons,
  CommentSection,
  RelatedPosts,
  TableOfContents
} from '@/components'

export default function BlogPost({ post }) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <ArticleHeader
        title={post.title}
        subtitle={post.subtitle}
        publishedAt={post.publishedAt}
        readTime={post.readTime}
        coverImage={post.coverImage}
      />

      {/* Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <MarkdownContent content={post.content} />

          <div className="mt-12 border-t pt-8">
            <AuthorCard author={post.author} />
          </div>

          <div className="mt-8">
            <ShareButtons
              title={post.title}
              url={post.url}
            />
          </div>

          <CommentSection postId={post.id} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            <TableOfContents headings={post.headings} />
            <RelatedPosts posts={post.relatedPosts} />
          </div>
        </aside>
      </div>
    </article>
  )
}`
  },
  {
    id: 'auth-forms',
    name: 'Authentication Forms',
    description: 'Login, registration, and password reset forms with validation',
    category: 'Auth',
    difficulty: 'beginner',
    components: [
      'form-input',
      'button-submit',
      'social-login-buttons',
      'error-message',
      'success-message',
      'link-text'
    ],
    features: [
      'Form validation',
      'Error handling',
      'Social authentication',
      'Password strength indicator',
      'Remember me checkbox'
    ],
    useCases: ['User Authentication', 'Member Areas', 'SaaS Apps'],
    codeExample: `'use client'

import {
  FormInput,
  Button,
  SocialLoginButtons,
  ErrorMessage,
  Link
} from '@/components'

export default function LoginForm() {
  const [errors, setErrors] = useState({})

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
      <p className="text-gray-600 mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          type="email"
          name="email"
          required
          error={errors.email}
          placeholder="you@example.com"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          required
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" name="remember" />
            <span className="ml-2 text-sm">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm">
            Forgot password?
          </Link>
        </div>

        {errors.general && (
          <ErrorMessage message={errors.general} />
        )}

        <Button type="submit" fullWidth>
          Sign In
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <SocialLoginButtons
          providers={['google', 'github', 'twitter']}
          onSuccess={handleSocialLogin}
        />
      </div>

      <p className="mt-8 text-center text-sm">
        Don't have an account?{' '}
        <Link href="/register">Sign up</Link>
      </p>
    </div>
  )
}`
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const templateId = searchParams.get('id')
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')

  try {
    // Filter templates
    let templates = TEMPLATES

    if (templateId) {
      templates = templates.filter(t => t.id === templateId)
    }

    if (category) {
      templates = templates.filter(t =>
        t.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (difficulty) {
      templates = templates.filter(t =>
        t.difficulty.toLowerCase() === difficulty.toLowerCase()
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        templates,
        total: templates.length,
        categories: [...new Set(TEMPLATES.map(t => t.category))],
        difficulties: ['beginner', 'intermediate', 'advanced']
      },
      meta: {
        endpoint: '/api/ai/templates',
        description: 'Pre-built templates combining multiple components',
        parameters: {
          id: 'Filter by template ID',
          category: 'Filter by category (Dashboard, Marketing, etc.)',
          difficulty: 'Filter by difficulty (beginner, intermediate, advanced)'
        },
        usage: {
          listAll: 'GET /api/ai/templates',
          getSpecific: 'GET /api/ai/templates?id=dashboard-analytics',
          byCategory: 'GET /api/ai/templates?category=E-Commerce',
          byDifficulty: 'GET /api/ai/templates?difficulty=beginner'
        }
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
        'X-HubLab-Service': 'AI-Templates',
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch templates',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

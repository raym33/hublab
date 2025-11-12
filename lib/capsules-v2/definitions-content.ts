import { CapsuleDefinition } from './types'

/**
 * Content & Marketing Capsules
 * Content display and marketing components
 */

export const CONTENT_CAPSULES: CapsuleDefinition[] = [
  // Testimonial Card
  {
    id: 'testimonial-card',
    name: 'Testimonial Card',
    description: 'Customer testimonial with avatar',
    category: 'content',
    props: [
      { name: 'name', type: 'string', required: true, default: 'John Doe', description: 'Customer name' },
      { name: 'role', type: 'string', required: false, default: 'CEO, Company', description: 'Customer role' },
      { name: 'testimonial', type: 'string', required: true, default: 'Great product!', description: 'Testimonial text' },
      { name: 'avatar', type: 'string', required: false, default: '', description: 'Avatar URL' }
    ],
    dependencies: [],
    code: `
function TestimonialCard({ name = 'John Doe', role = 'CEO, Company', testimonial = 'Great product!', avatar = '' }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <p className="text-gray-600 mb-4 italic">"{testimonial}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            name.split(' ').map(n => n[0]).join('')
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  )
}`
  },

  // Feature Grid
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    description: 'Grid of features with icons',
    category: 'content',
    props: [
      { name: 'features', type: 'array', required: true, default: [
        { icon: '⚡', title: 'Fast', description: 'Lightning fast performance' },
        { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
        { icon: '📱', title: 'Mobile', description: 'Works on all devices' }
      ], description: 'Features array' }
    ],
    dependencies: [],
    code: `
function FeatureGrid({ features = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, idx) => (
        <div key={idx} className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-3">{feature.icon}</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}`
  },

  // Pricing Card
  {
    id: 'pricing-card',
    name: 'Pricing Card',
    description: 'Pricing plan card',
    category: 'content',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Pro Plan', description: 'Plan name' },
      { name: 'price', type: 'string', required: true, default: '$29', description: 'Price' },
      { name: 'period', type: 'string', required: false, default: '/month', description: 'Billing period' },
      { name: 'features', type: 'array', required: true, default: ['Feature 1', 'Feature 2', 'Feature 3'], description: 'Features list' },
      { name: 'highlighted', type: 'boolean', required: false, default: false, description: 'Highlight card' }
    ],
    dependencies: [],
    code: `
function PricingCard({ title = 'Pro Plan', price = '\\$29', period = '/month', features = [], highlighted = false }) {
  return (
    <div className={\`bg-white rounded-lg shadow-lg p-6 border-2 \${highlighted ? 'border-blue-600' : 'border-gray-200'}\`}>
      {highlighted && (
        <div className="text-center mb-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            POPULAR
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-600">{period}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={\`w-full py-3 rounded-lg font-semibold transition-colors \${
        highlighted
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }\`}>
        Get Started
      </button>
    </div>
  )
}`
  },

  // Blog Card
  {
    id: 'blog-card',
    name: 'Blog Card',
    description: 'Blog post card',
    category: 'content',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Blog Post Title', description: 'Post title' },
      { name: 'excerpt', type: 'string', required: true, default: 'Post excerpt...', description: 'Post excerpt' },
      { name: 'image', type: 'string', required: false, default: '', description: 'Featured image URL' },
      { name: 'author', type: 'string', required: false, default: 'Author', description: 'Author name' },
      { name: 'date', type: 'string', required: false, default: 'Jan 1, 2024', description: 'Publish date' }
    ],
    dependencies: [],
    code: `
function BlogCard({ title = 'Blog Post Title', excerpt = 'Post excerpt...', image = '', author = 'Author', date = 'Jan 1, 2024' }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {image && (
        <div className="h-48 bg-gray-200">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}`
  },

  // Call to Action
  {
    id: 'cta-banner',
    name: 'CTA Banner',
    description: 'Call to action banner',
    category: 'content',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Get Started Today', description: 'CTA title' },
      { name: 'description', type: 'string', required: false, default: 'Join thousands of satisfied customers', description: 'CTA description' },
      { name: 'buttonText', type: 'string', required: false, default: 'Sign Up Now', description: 'Button text' }
    ],
    dependencies: [],
    code: `
function CTABanner({ title = 'Get Started Today', description = 'Join thousands of satisfied customers', buttonText = 'Sign Up Now' }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
      <h2 className="text-3xl font-bold mb-3">{title}</h2>
      {description && (
        <p className="text-xl text-blue-100 mb-6">{description}</p>
      )}
      <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
        {buttonText}
      </button>
    </div>
  )
}`
  },

  // FAQ Accordion
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion',
    description: 'FAQ accordion component',
    category: 'content',
    props: [
      { name: 'faqs', type: 'array', required: true, default: [
        { question: 'Question 1?', answer: 'Answer 1' },
        { question: 'Question 2?', answer: 'Answer 2' }
      ], description: 'FAQ items' }
    ],
    dependencies: [],
    code: `
function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = React.useState(null)

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">{faq.question}</span>
            <span className="text-2xl text-gray-400">{openIndex === idx ? '−' : '+'}</span>
          </button>
          {openIndex === idx && (
            <div className="px-6 py-4 bg-gray-50 text-gray-600">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}`
  },

  // Team Member Card
  {
    id: 'team-member',
    name: 'Team Member Card',
    description: 'Team member profile card',
    category: 'content',
    props: [
      { name: 'name', type: 'string', required: true, default: 'Jane Doe', description: 'Member name' },
      { name: 'role', type: 'string', required: true, default: 'Lead Developer', description: 'Member role' },
      { name: 'bio', type: 'string', required: false, default: 'Passionate about code', description: 'Short bio' },
      { name: 'image', type: 'string', required: false, default: '', description: 'Profile image URL' }
    ],
    dependencies: [],
    code: `
function TeamMember({ name = 'Jane Doe', role = 'Lead Developer', bio = 'Passionate about code', image = '' }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
      <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-blue-600 font-medium mb-3">{role}</p>
        {bio && <p className="text-gray-600 text-sm">{bio}</p>}
      </div>
    </div>
  )
}`
  },

  // Logo Cloud
  {
    id: 'logo-cloud',
    name: 'Logo Cloud',
    description: 'Company logos grid',
    category: 'content',
    props: [
      { name: 'title', type: 'string', required: false, default: 'Trusted by', description: 'Section title' },
      { name: 'logos', type: 'array', required: true, default: ['🏢', '🏪', '🏭', '🏛️', '🏦', '🏨'], description: 'Logo array' }
    ],
    dependencies: [],
    code: `
function LogoCloud({ title = 'Trusted by', logos = [] }) {
  return (
    <div className="text-center py-12">
      {title && (
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
        {logos.map((logo, idx) => (
          <div key={idx} className="text-4xl opacity-50 hover:opacity-100 transition-opacity">
            {logo}
          </div>
        ))}
      </div>
    </div>
  )
}`
  }
]

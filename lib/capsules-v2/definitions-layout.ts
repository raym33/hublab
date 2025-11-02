import { CapsuleDefinition } from './types'

/**
 * Layout Capsules
 * Essential layout components for structuring applications
 */

export const LAYOUT_CAPSULES: CapsuleDefinition[] = [
  // Responsive Grid
  {
    id: 'responsive-grid',
    name: 'Responsive Grid',
    description: 'Responsive grid layout with customizable columns',
    category: 'layout',
    props: [
      { name: 'columns', type: 'number', required: false, default: 3, description: 'Number of columns on desktop' },
      { name: 'gap', type: 'string', required: false, default: '4', description: 'Gap between items (Tailwind spacing)' },
      { name: 'children', type: 'node', required: true, description: 'Grid items' }
    ],
    dependencies: [],
    code: `
function ResponsiveGrid({ columns = 3, gap = '4', children }) {
  return (
    <div
      className={\`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-\${columns} gap-\${gap}\`}
    >
      {children}
    </div>
  )
}`
  },

  // Container
  {
    id: 'container',
    name: 'Container',
    description: 'Centered container with max width',
    category: 'layout',
    props: [
      { name: 'size', type: 'string', required: false, default: 'lg', description: 'Container size: sm, md, lg, xl, 2xl, full' },
      { name: 'padding', type: 'boolean', required: false, default: true, description: 'Add horizontal padding' },
      { name: 'children', type: 'node', required: true, description: 'Container content' }
    ],
    dependencies: [],
    code: `
function Container({ size = 'lg', padding = true, children }) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  }

  return (
    <div className={\`\${sizes[size]} mx-auto \${padding ? 'px-4 sm:px-6 lg:px-8' : ''}\`}>
      {children}
    </div>
  )
}`
  },

  // Sidebar Layout
  {
    id: 'sidebar-layout',
    name: 'Sidebar Layout',
    description: 'Two-column layout with sidebar',
    category: 'layout',
    props: [
      { name: 'sidebarPosition', type: 'string', required: false, default: 'left', description: 'Sidebar position: left or right' },
      { name: 'sidebarWidth', type: 'string', required: false, default: '64', description: 'Sidebar width in Tailwind units' },
      { name: 'sidebar', type: 'node', required: true, description: 'Sidebar content' },
      { name: 'main', type: 'node', required: true, description: 'Main content' }
    ],
    dependencies: [],
    code: `
function SidebarLayout({ sidebarPosition = 'left', sidebarWidth = '64', sidebar, main }) {
  return (
    <div className="flex min-h-screen">
      {sidebarPosition === 'left' && (
        <aside className={\`w-\${sidebarWidth} bg-gray-800 text-white p-6 overflow-y-auto\`}>
          {sidebar}
        </aside>
      )}

      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        {main}
      </main>

      {sidebarPosition === 'right' && (
        <aside className={\`w-\${sidebarWidth} bg-gray-800 text-white p-6 overflow-y-auto\`}>
          {sidebar}
        </aside>
      )}
    </div>
  )
}`
  },

  // Navbar
  {
    id: 'navbar',
    name: 'Navbar',
    description: 'Navigation bar with logo and menu items',
    category: 'layout',
    props: [
      { name: 'logo', type: 'string', required: false, default: 'Logo', description: 'Logo text or image URL' },
      { name: 'items', type: 'array', required: false, default: [
        { label: 'Home', href: '#' },
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' }
      ], description: 'Navigation items' },
      { name: 'transparent', type: 'boolean', required: false, default: false, description: 'Transparent background' }
    ],
    dependencies: [],
    code: `
function Navbar({ logo = 'Logo', items = [], transparent = false }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <nav className={\`\${transparent ? 'bg-transparent' : 'bg-white shadow'} sticky top-0 z-50\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl">
            {logo}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {items.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 space-y-2">
            {items.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}`
  },

  // Footer
  {
    id: 'footer',
    name: 'Footer',
    description: 'Multi-column footer with links',
    category: 'layout',
    props: [
      { name: 'columns', type: 'array', required: false, default: [
        { title: 'Product', links: ['Features', 'Pricing', 'Demo'] },
        { title: 'Company', links: ['About', 'Blog', 'Careers'] },
        { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] }
      ], description: 'Footer columns' },
      { name: 'copyright', type: 'string', required: false, default: '© 2025 Company. All rights reserved.', description: 'Copyright text' }
    ],
    dependencies: [],
    code: `
function Footer({ columns = [], copyright = '© 2025 Company. All rights reserved.' }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {columns.map((col, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-lg mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          {copyright}
        </div>
      </div>
    </footer>
  )
}`
  },

  // Hero Section
  {
    id: 'hero-section',
    name: 'Hero Section',
    description: 'Hero section with title, subtitle, and CTA',
    category: 'layout',
    props: [
      { name: 'title', type: 'string', required: true, default: 'Welcome to Our App', description: 'Hero title' },
      { name: 'subtitle', type: 'string', required: false, default: 'Build amazing things', description: 'Hero subtitle' },
      { name: 'ctaText', type: 'string', required: false, default: 'Get Started', description: 'CTA button text' },
      { name: 'ctaLink', type: 'string', required: false, default: '#', description: 'CTA button link' },
      { name: 'backgroundImage', type: 'string', required: false, default: '', description: 'Background image URL' }
    ],
    dependencies: [],
    code: `
function HeroSection({
  title = 'Welcome to Our App',
  subtitle = 'Build amazing things',
  ctaText = 'Get Started',
  ctaLink = '#',
  backgroundImage = ''
}) {
  return (
    <section
      className="relative py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white"
      style={backgroundImage ? {
        backgroundImage: \`url(\${backgroundImage})\`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      )}

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {subtitle}
          </p>
        )}
        <a
          href={ctaLink}
          className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
        >
          {ctaText}
        </a>
      </div>
    </section>
  )
}`
  },

  // Section
  {
    id: 'section',
    name: 'Section',
    description: 'Content section with optional background',
    category: 'layout',
    props: [
      { name: 'title', type: 'string', required: false, default: '', description: 'Section title' },
      { name: 'subtitle', type: 'string', required: false, default: '', description: 'Section subtitle' },
      { name: 'background', type: 'string', required: false, default: 'white', description: 'Background color: white, gray, dark' },
      { name: 'padding', type: 'string', required: false, default: 'normal', description: 'Padding size: sm, normal, lg' },
      { name: 'children', type: 'node', required: true, description: 'Section content' }
    ],
    dependencies: [],
    code: `
function Section({
  title = '',
  subtitle = '',
  background = 'white',
  padding = 'normal',
  children
}) {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-gray-900 text-white'
  }

  const paddings = {
    sm: 'py-8',
    normal: 'py-16',
    lg: 'py-24'
  }

  return (
    <section className={\`\${backgrounds[background]} \${paddings[padding]} px-4\`}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl font-bold mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className={\`text-xl \${background === 'dark' ? 'text-gray-300' : 'text-gray-600'}\`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}`
  },

  // Two Column Layout
  {
    id: 'two-column',
    name: 'Two Column Layout',
    description: 'Two-column layout with customizable split',
    category: 'layout',
    props: [
      { name: 'leftContent', type: 'node', required: true, description: 'Left column content' },
      { name: 'rightContent', type: 'node', required: true, description: 'Right column content' },
      { name: 'split', type: 'string', required: false, default: '50-50', description: 'Column split: 50-50, 60-40, 40-60, 70-30, 30-70' },
      { name: 'reverse', type: 'boolean', required: false, default: false, description: 'Reverse order on mobile' }
    ],
    dependencies: [],
    code: `
function TwoColumn({ leftContent, rightContent, split = '50-50', reverse = false }) {
  const splits = {
    '50-50': 'lg:grid-cols-2',
    '60-40': 'lg:grid-cols-[60%_40%]',
    '40-60': 'lg:grid-cols-[40%_60%]',
    '70-30': 'lg:grid-cols-[70%_30%]',
    '30-70': 'lg:grid-cols-[30%_70%]'
  }

  return (
    <div className={\`grid grid-cols-1 \${splits[split]} gap-8 items-center\`}>
      <div className={reverse ? 'lg:order-2' : ''}>
        {leftContent}
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>
        {rightContent}
      </div>
    </div>
  )
}`
  }
]

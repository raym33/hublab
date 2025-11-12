// ============================================
// CAPSULE CATALOG
// Available capsules with their definitions
// ============================================

import type { CapsuleDefinition } from '@/types/api'

export const CAPSULE_CATALOG: Record<string, CapsuleDefinition> = {
  // ============================================
  // NAVIGATION
  // ============================================

  header: {
    id: 'header',
    type: 'header',
    name: 'Header',
    category: 'navigation',
    description: 'Top navigation bar with logo, menu items, and actions',
    icon: 'layout',
    props: [
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Header title or app name',
      },
      {
        name: 'showLogo',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Show logo in header',
      },
      {
        name: 'showNav',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Show navigation menu',
      },
      {
        name: 'showUserMenu',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Show user menu/avatar',
      },
    ],
    requiredIntegrations: [],
    examples: [
      {
        name: 'Basic Header',
        description: 'Simple header with title and navigation',
        code: `{
  "type": "header",
  "props": {
    "title": "My App",
    "showNav": true
  }
}`,
        props: {
          title: 'My App',
          showNav: true,
        },
      },
    ],
  },

  sidebar: {
    id: 'sidebar',
    type: 'sidebar',
    name: 'Sidebar',
    category: 'navigation',
    description: 'Vertical navigation sidebar with menu items',
    icon: 'sidebar',
    props: [
      {
        name: 'items',
        type: 'array',
        required: true,
        description: 'Navigation items',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Start in collapsed state',
      },
    ],
    requiredIntegrations: [],
    examples: [
      {
        name: 'Dashboard Sidebar',
        description: 'Sidebar for dashboard app',
        code: `{
  "type": "sidebar",
  "props": {
    "items": [
      { "label": "Dashboard", "icon": "home", "href": "/" },
      { "label": "Analytics", "icon": "chart", "href": "/analytics" }
    ]
  }
}`,
        props: {
          items: [
            { label: 'Dashboard', icon: 'home', href: '/' },
            { label: 'Analytics', icon: 'chart', href: '/analytics' },
          ],
        },
      },
    ],
  },

  // ============================================
  // LAYOUT
  // ============================================

  hero: {
    id: 'hero',
    type: 'hero',
    name: 'Hero Section',
    category: 'layout',
    description: 'Landing page hero section with title, subtitle, and CTA',
    icon: 'zap',
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Main headline',
      },
      {
        name: 'subtitle',
        type: 'string',
        required: false,
        description: 'Supporting text',
      },
      {
        name: 'ctaText',
        type: 'string',
        required: false,
        description: 'Call-to-action button text',
      },
      {
        name: 'ctaLink',
        type: 'string',
        required: false,
        description: 'CTA button link',
      },
    ],
    requiredIntegrations: [],
    examples: [
      {
        name: 'Product Hero',
        description: 'Hero section for product landing page',
        code: `{
  "type": "hero",
  "props": {
    "title": "Build Better Products",
    "subtitle": "Ship faster with our platform",
    "ctaText": "Get Started",
    "ctaLink": "/signup"
  }
}`,
        props: {
          title: 'Build Better Products',
          subtitle: 'Ship faster with our platform',
          ctaText: 'Get Started',
          ctaLink: '/signup',
        },
      },
    ],
  },

  'feature-grid': {
    id: 'feature-grid',
    type: 'feature-grid',
    name: 'Feature Grid',
    category: 'layout',
    description: 'Grid of features with icons and descriptions',
    icon: 'grid',
    props: [
      {
        name: 'columns',
        type: 'number',
        required: false,
        default: 3,
        description: 'Number of columns',
      },
      {
        name: 'features',
        type: 'array',
        required: true,
        description: 'Array of features',
      },
    ],
    requiredIntegrations: [],
    examples: [
      {
        name: '3-Column Features',
        description: 'Three-column feature grid',
        code: `{
  "type": "feature-grid",
  "props": {
    "columns": 3,
    "features": [
      { "title": "Fast", "icon": "zap", "description": "Lightning fast" },
      { "title": "Secure", "icon": "shield", "description": "Enterprise-grade security" }
    ]
  }
}`,
        props: {
          columns: 3,
          features: [
            { title: 'Fast', icon: 'zap', description: 'Lightning fast' },
            { title: 'Secure', icon: 'shield', description: 'Enterprise-grade security' },
          ],
        },
      },
    ],
  },

  // ============================================
  // DATA DISPLAY
  // ============================================

  'data-table': {
    id: 'data-table',
    type: 'data-table',
    name: 'Data Table',
    category: 'data-display',
    description: 'Table for displaying and managing data with sorting, filtering, and pagination',
    icon: 'table',
    props: [
      {
        name: 'columns',
        type: 'array',
        required: true,
        description: 'Table column definitions',
      },
      {
        name: 'showPagination',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable pagination',
      },
      {
        name: 'showSearch',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Enable search',
      },
    ],
    requiredIntegrations: ['supabase'],
    examples: [
      {
        name: 'User Table',
        description: 'Table displaying user data',
        code: `{
  "type": "data-table",
  "props": {
    "columns": [
      { "key": "name", "label": "Name" },
      { "key": "email", "label": "Email" }
    ],
    "showPagination": true
  },
  "dataSource": {
    "type": "supabase",
    "config": {
      "table": "users",
      "fields": ["name", "email"]
    }
  }
}`,
        props: {
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
          ],
          showPagination: true,
        },
      },
    ],
  },

  'stats-grid': {
    id: 'stats-grid',
    type: 'stats-grid',
    name: 'Stats Grid',
    category: 'data-display',
    description: 'Grid of statistics/KPIs with icons',
    icon: 'activity',
    props: [
      {
        name: 'columns',
        type: 'number',
        required: false,
        default: 4,
        description: 'Number of columns',
      },
      {
        name: 'stats',
        type: 'array',
        required: true,
        description: 'Array of stats',
      },
    ],
    requiredIntegrations: [],
    examples: [
      {
        name: 'Dashboard Stats',
        description: 'KPI grid for dashboard',
        code: `{
  "type": "stats-grid",
  "props": {
    "columns": 4,
    "stats": [
      { "label": "Users", "value": "1,234", "icon": "users" },
      { "label": "Revenue", "value": "$12.3k", "icon": "dollar" }
    ]
  }
}`,
        props: {
          columns: 4,
          stats: [
            { label: 'Users', value: '1,234', icon: 'users' },
            { label: 'Revenue', value: '$12.3k', icon: 'dollar' },
          ],
        },
      },
    ],
  },

  // ============================================
  // FORMS
  // ============================================

  form: {
    id: 'form',
    type: 'form',
    name: 'Form',
    category: 'forms',
    description: 'Generic form with customizable fields',
    icon: 'edit',
    props: [
      {
        name: 'fields',
        type: 'array',
        required: true,
        description: 'Form field definitions',
      },
      {
        name: 'submitText',
        type: 'string',
        required: false,
        default: 'Submit',
        description: 'Submit button text',
      },
      {
        name: 'action',
        type: 'string',
        required: false,
        description: 'Form action URL',
      },
    ],
    requiredIntegrations: [],
    examples: [
      {
        name: 'Contact Form',
        description: 'Simple contact form',
        code: `{
  "type": "form",
  "props": {
    "fields": [
      { "name": "name", "type": "text", "label": "Name", "required": true },
      { "name": "email", "type": "email", "label": "Email", "required": true },
      { "name": "message", "type": "textarea", "label": "Message" }
    ],
    "submitText": "Send Message"
  }
}`,
        props: {
          fields: [
            { name: 'name', type: 'text', label: 'Name', required: true },
            { name: 'email', type: 'email', label: 'Email', required: true },
            { name: 'message', type: 'textarea', label: 'Message' },
          ],
          submitText: 'Send Message',
        },
      },
    ],
  },

  // ============================================
  // CHARTS
  // ============================================

  'bar-chart': {
    id: 'bar-chart',
    type: 'bar-chart',
    name: 'Bar Chart',
    category: 'charts',
    description: 'Bar chart for visualizing data',
    icon: 'bar-chart',
    props: [
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Chart title',
      },
      {
        name: 'xAxis',
        type: 'string',
        required: true,
        description: 'X-axis field',
      },
      {
        name: 'yAxis',
        type: 'string',
        required: true,
        description: 'Y-axis field',
      },
    ],
    requiredIntegrations: ['supabase'],
    examples: [
      {
        name: 'Sales Chart',
        description: 'Monthly sales bar chart',
        code: `{
  "type": "bar-chart",
  "props": {
    "title": "Monthly Sales",
    "xAxis": "month",
    "yAxis": "sales"
  },
  "dataSource": {
    "type": "supabase",
    "config": {
      "table": "sales",
      "fields": ["month", "sales"]
    }
  }
}`,
        props: {
          title: 'Monthly Sales',
          xAxis: 'month',
          yAxis: 'sales',
        },
      },
    ],
  },

  // ============================================
  // E-COMMERCE
  // ============================================

  'product-grid': {
    id: 'product-grid',
    type: 'product-grid',
    name: 'Product Grid',
    category: 'ecommerce',
    description: 'Grid of products for e-commerce',
    icon: 'shopping-bag',
    props: [
      {
        name: 'columns',
        type: 'number',
        required: false,
        default: 4,
        description: 'Number of columns',
      },
      {
        name: 'showFilters',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Show filter sidebar',
      },
    ],
    requiredIntegrations: ['supabase', 'stripe'],
    examples: [
      {
        name: 'Store Products',
        description: 'Product grid for online store',
        code: `{
  "type": "product-grid",
  "props": {
    "columns": 4,
    "showFilters": true
  },
  "dataSource": {
    "type": "supabase",
    "config": {
      "table": "products",
      "fields": ["name", "price", "image"]
    }
  }
}`,
        props: {
          columns: 4,
          showFilters: true,
        },
      },
    ],
  },
}

// Export as array for easier iteration
export const CAPSULE_CATALOG_ARRAY = Object.values(CAPSULE_CATALOG)

// Group by category
export const CAPSULES_BY_CATEGORY = CAPSULE_CATALOG_ARRAY.reduce(
  (acc, capsule) => {
    if (!acc[capsule.category]) {
      acc[capsule.category] = []
    }
    acc[capsule.category].push(capsule)
    return acc
  },
  {} as Record<string, CapsuleDefinition[]>
)

/**
 * Professional App Templates
 * Ready-to-use compositions for common app types
 */

export interface AppTemplate {
  id: string
  name: string
  description: string
  category: 'productivity' | 'dashboard' | 'forms' | 'social' | 'ecommerce' | 'content'
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  features: string[]
  composition: any
}

export const APP_TEMPLATES: AppTemplate[] = [
  // ===== PRODUCTIVITY APPS =====
  {
    id: 'todo-basic',
    name: 'Simple Todo List',
    description: 'Clean and minimal task manager with local storage',
    category: 'productivity',
    icon: '✅',
    difficulty: 'beginner',
    features: ['Add/delete tasks', 'Mark as complete', 'Local storage', 'Clean UI'],
    composition: {
      name: 'Simple Todo App',
      version: '1.0.0',
      platform: 'web',
      description: 'A minimal todo list application',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'My Tasks', theme: 'light' }
        },
        {
          id: 'header',
          capsuleId: 'h1',
          inputs: { text: '✅ Todo List' }
        },
        {
          id: 'input',
          capsuleId: 'input-text',
          inputs: { placeholder: 'Add a new task...', size: 'large' }
        },
        {
          id: 'add-button',
          capsuleId: 'button-primary',
          inputs: { label: 'Add Task', icon: 'plus' }
        },
        {
          id: 'task-list',
          capsuleId: 'list-view',
          inputs: { items: [], selectable: true }
        }
      ],
      connections: []
    }
  },
  {
    id: 'todo-advanced',
    name: 'Advanced Task Manager',
    description: 'Full-featured todo app with categories, filters, and priorities',
    category: 'productivity',
    icon: '📋',
    difficulty: 'intermediate',
    features: ['Categories', 'Priority levels', 'Filters', 'Search', 'Statistics'],
    composition: {
      name: 'Advanced Task Manager',
      version: '1.0.0',
      platform: 'web',
      description: 'Full-featured task management application',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Task Manager Pro' }
        },
        {
          id: 'tabs',
          capsuleId: 'tabs',
          inputs: {
            tabs: [
              { id: 'all', label: 'All Tasks' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' }
            ]
          }
        },
        {
          id: 'search',
          capsuleId: 'search-input',
          inputs: { placeholder: 'Search tasks...', icon: 'search' }
        },
        {
          id: 'priority-filter',
          capsuleId: 'dropdown-select',
          inputs: {
            label: 'Priority',
            options: ['All', 'High', 'Medium', 'Low']
          }
        },
        {
          id: 'category-filter',
          capsuleId: 'select-multi',
          inputs: {
            label: 'Categories',
            options: ['Work', 'Personal', 'Shopping', 'Health']
          }
        },
        {
          id: 'task-input',
          capsuleId: 'textarea',
          inputs: { placeholder: 'Task description...', rows: 2 }
        },
        {
          id: 'priority-select',
          capsuleId: 'radio-group',
          inputs: {
            label: 'Priority',
            options: ['High', 'Medium', 'Low']
          }
        },
        {
          id: 'kanban',
          capsuleId: 'kanban-board',
          inputs: {
            columns: ['To Do', 'In Progress', 'Done']
          }
        },
        {
          id: 'stats',
          capsuleId: 'chart-pie',
          inputs: { title: 'Task Distribution' }
        }
      ],
      connections: []
    }
  },
  {
    id: 'notes-app',
    name: 'Note Taking App',
    description: 'Rich text editor with markdown support',
    category: 'productivity',
    icon: '📝',
    difficulty: 'intermediate',
    features: ['Markdown editor', 'Auto-save', 'Search', 'Tags', 'Export'],
    composition: {
      name: 'Notes App',
      version: '1.0.0',
      platform: 'web',
      description: 'Note taking application with markdown support',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'split-pane',
          inputs: { orientation: 'horizontal', sizes: [30, 70] }
        },
        {
          id: 'sidebar',
          capsuleId: 'app-container',
          inputs: { title: 'Notes' }
        },
        {
          id: 'search',
          capsuleId: 'search-input',
          inputs: { placeholder: 'Search notes...' }
        },
        {
          id: 'notes-list',
          capsuleId: 'list-view',
          inputs: { selectable: true }
        },
        {
          id: 'editor',
          capsuleId: 'wysiwyg-editor',
          inputs: { placeholder: 'Start writing...', mode: 'markdown' }
        },
        {
          id: 'preview',
          capsuleId: 'markdown-viewer',
          inputs: {}
        }
      ],
      connections: []
    }
  },

  // ===== DASHBOARDS =====
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Business metrics and charts visualization',
    category: 'dashboard',
    icon: '📊',
    difficulty: 'intermediate',
    features: ['Real-time charts', 'KPI cards', 'Date filters', 'Export data'],
    composition: {
      name: 'Analytics Dashboard',
      version: '1.0.0',
      platform: 'web',
      description: 'Analytics and metrics dashboard',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Analytics Dashboard' }
        },
        {
          id: 'date-filter',
          capsuleId: 'date-picker',
          inputs: { label: 'Date Range', mode: 'range' }
        },
        {
          id: 'revenue-card',
          capsuleId: 'badge',
          inputs: { label: 'Total Revenue', value: '$45,231', trend: '+12.5%' }
        },
        {
          id: 'users-card',
          capsuleId: 'badge',
          inputs: { label: 'Active Users', value: '8,282', trend: '+5.2%' }
        },
        {
          id: 'conversion-card',
          capsuleId: 'badge',
          inputs: { label: 'Conversion Rate', value: '3.24%', trend: '+0.5%' }
        },
        {
          id: 'revenue-chart',
          capsuleId: 'chart-line',
          inputs: { title: 'Revenue Over Time', height: 300 }
        },
        {
          id: 'category-chart',
          capsuleId: 'chart-bar',
          inputs: { title: 'Sales by Category', height: 300 }
        },
        {
          id: 'distribution-chart',
          capsuleId: 'chart-pie',
          inputs: { title: 'Traffic Sources', height: 300 }
        },
        {
          id: 'data-table',
          capsuleId: 'data-table',
          inputs: {
            columns: [
              { id: 'product', label: 'Product' },
              { id: 'sales', label: 'Sales' },
              { id: 'revenue', label: 'Revenue' }
            ]
          }
        }
      ],
      connections: []
    }
  },
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    description: 'Complete admin interface with user management',
    category: 'dashboard',
    icon: '⚙️',
    difficulty: 'advanced',
    features: ['User management', 'Role-based access', 'Activity logs', 'Settings'],
    composition: {
      name: 'Admin Panel',
      version: '1.0.0',
      platform: 'web',
      description: 'Administrative dashboard',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Admin Panel' }
        },
        {
          id: 'drawer',
          capsuleId: 'drawer',
          inputs: {
            position: 'left',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: 'home' },
              { id: 'users', label: 'Users', icon: 'users' },
              { id: 'settings', label: 'Settings', icon: 'settings' },
              { id: 'logs', label: 'Activity Logs', icon: 'file-text' }
            ]
          }
        },
        {
          id: 'breadcrumb',
          capsuleId: 'breadcrumb',
          inputs: { items: ['Home', 'Dashboard'] }
        },
        {
          id: 'users-table',
          capsuleId: 'data-grid-editable',
          inputs: {
            columns: [
              { id: 'name', label: 'Name', editable: true },
              { id: 'email', label: 'Email', editable: true },
              { id: 'role', label: 'Role', editable: true },
              { id: 'status', label: 'Status', editable: false }
            ]
          }
        },
        {
          id: 'activity-timeline',
          capsuleId: 'timeline',
          inputs: { items: [] }
        }
      ],
      connections: []
    }
  },

  // ===== FORMS =====
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Professional contact form with validation',
    category: 'forms',
    icon: '📬',
    difficulty: 'beginner',
    features: ['Field validation', 'Success message', 'Responsive', 'Clean design'],
    composition: {
      name: 'Contact Form',
      version: '1.0.0',
      platform: 'web',
      description: 'Contact form with validation',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Contact Us' }
        },
        {
          id: 'header',
          capsuleId: 'h1',
          inputs: { text: 'Get in Touch' }
        },
        {
          id: 'description',
          capsuleId: 'text-display',
          inputs: { text: 'Fill out the form below and we\'ll get back to you soon.' }
        },
        {
          id: 'form',
          capsuleId: 'form-validated',
          inputs: {}
        },
        {
          id: 'name-input',
          capsuleId: 'input-text',
          inputs: { label: 'Name', placeholder: 'Your name', required: true }
        },
        {
          id: 'email-input',
          capsuleId: 'input-text',
          inputs: { label: 'Email', placeholder: 'your@email.com', type: 'email', required: true }
        },
        {
          id: 'subject-input',
          capsuleId: 'input-text',
          inputs: { label: 'Subject', placeholder: 'What is this about?', required: true }
        },
        {
          id: 'message-input',
          capsuleId: 'textarea',
          inputs: { label: 'Message', placeholder: 'Your message...', rows: 5, required: true }
        },
        {
          id: 'submit-button',
          capsuleId: 'button-primary',
          inputs: { label: 'Send Message', size: 'large' }
        }
      ],
      connections: []
    }
  },
  {
    id: 'survey-form',
    name: 'Survey Form',
    description: 'Multi-step survey with progress indicator',
    category: 'forms',
    icon: '📋',
    difficulty: 'intermediate',
    features: ['Multi-step', 'Progress bar', 'Various input types', 'Results summary'],
    composition: {
      name: 'Survey Form',
      version: '1.0.0',
      platform: 'web',
      description: 'Multi-step survey form',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Customer Survey' }
        },
        {
          id: 'stepper',
          capsuleId: 'stepper',
          inputs: {
            steps: [
              { id: '1', label: 'Personal Info' },
              { id: '2', label: 'Preferences' },
              { id: '3', label: 'Feedback' },
              { id: '4', label: 'Review' }
            ]
          }
        },
        {
          id: 'progress',
          capsuleId: 'progress-bar',
          inputs: { value: 0, max: 100 }
        },
        {
          id: 'rating',
          capsuleId: 'rating',
          inputs: { label: 'How would you rate our service?', max: 5 }
        },
        {
          id: 'satisfaction',
          capsuleId: 'slider',
          inputs: { label: 'Satisfaction Level', min: 0, max: 10, step: 1 }
        },
        {
          id: 'checkboxes',
          capsuleId: 'checkbox',
          inputs: {
            label: 'What features do you use?',
            options: ['Feature A', 'Feature B', 'Feature C']
          }
        },
        {
          id: 'comments',
          capsuleId: 'textarea',
          inputs: { label: 'Additional Comments', rows: 4 }
        }
      ],
      connections: []
    }
  },

  // ===== SOCIAL/CHAT =====
  {
    id: 'chat-interface',
    name: 'Chat Interface',
    description: 'Real-time messaging interface',
    category: 'social',
    icon: '💬',
    difficulty: 'intermediate',
    features: ['Message bubbles', 'Emoji support', 'User avatars', 'Typing indicator'],
    composition: {
      name: 'Chat Interface',
      version: '1.0.0',
      platform: 'web',
      description: 'Messaging interface',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Messages' }
        },
        {
          id: 'layout',
          capsuleId: 'split-pane',
          inputs: { orientation: 'horizontal', sizes: [30, 70] }
        },
        {
          id: 'contacts-search',
          capsuleId: 'search-input',
          inputs: { placeholder: 'Search contacts...' }
        },
        {
          id: 'contacts-list',
          capsuleId: 'list-view',
          inputs: { selectable: true }
        },
        {
          id: 'chat-header',
          capsuleId: 'app-container',
          inputs: {}
        },
        {
          id: 'avatar',
          capsuleId: 'avatar',
          inputs: { name: 'John Doe', size: 'medium' }
        },
        {
          id: 'messages-container',
          capsuleId: 'virtual-list',
          inputs: { itemHeight: 60 }
        },
        {
          id: 'message-input',
          capsuleId: 'textarea',
          inputs: { placeholder: 'Type a message...', rows: 2 }
        },
        {
          id: 'send-button',
          capsuleId: 'icon-button',
          inputs: { icon: 'send', color: 'primary' }
        }
      ],
      connections: []
    }
  },
  {
    id: 'social-feed',
    name: 'Social Feed',
    description: 'Instagram-style social media feed',
    category: 'social',
    icon: '📱',
    difficulty: 'advanced',
    features: ['Infinite scroll', 'Like/comment', 'Image gallery', 'User profiles'],
    composition: {
      name: 'Social Feed',
      version: '1.0.0',
      platform: 'web',
      description: 'Social media feed',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Social Feed' }
        },
        {
          id: 'header-tabs',
          capsuleId: 'tabs',
          inputs: {
            tabs: [
              { id: 'feed', label: 'Feed' },
              { id: 'explore', label: 'Explore' },
              { id: 'profile', label: 'Profile' }
            ]
          }
        },
        {
          id: 'feed',
          capsuleId: 'infinite-scroll',
          inputs: {}
        },
        {
          id: 'post-card',
          capsuleId: 'app-container',
          inputs: {}
        },
        {
          id: 'user-avatar',
          capsuleId: 'avatar',
          inputs: { size: 'small' }
        },
        {
          id: 'post-image',
          capsuleId: 'image',
          inputs: { aspectRatio: '1:1' }
        },
        {
          id: 'like-button',
          capsuleId: 'icon-button',
          inputs: { icon: 'heart' }
        },
        {
          id: 'comment-input',
          capsuleId: 'input-text',
          inputs: { placeholder: 'Add a comment...' }
        }
      ],
      connections: []
    }
  },

  // ===== E-COMMERCE =====
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    description: 'E-commerce product listing with filters',
    category: 'ecommerce',
    icon: '🛍️',
    difficulty: 'intermediate',
    features: ['Product grid', 'Filters', 'Sort options', 'Shopping cart'],
    composition: {
      name: 'Product Catalog',
      version: '1.0.0',
      platform: 'web',
      description: 'E-commerce product catalog',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Shop' }
        },
        {
          id: 'layout',
          capsuleId: 'split-pane',
          inputs: { orientation: 'horizontal', sizes: [25, 75] }
        },
        {
          id: 'filters-header',
          capsuleId: 'h2',
          inputs: { text: 'Filters' }
        },
        {
          id: 'category-filter',
          capsuleId: 'checkbox',
          inputs: {
            label: 'Category',
            options: ['Electronics', 'Clothing', 'Home', 'Books']
          }
        },
        {
          id: 'price-range',
          capsuleId: 'slider',
          inputs: { label: 'Price Range', min: 0, max: 1000, step: 10 }
        },
        {
          id: 'rating-filter',
          capsuleId: 'rating',
          inputs: { label: 'Minimum Rating', max: 5 }
        },
        {
          id: 'search',
          capsuleId: 'search-input',
          inputs: { placeholder: 'Search products...' }
        },
        {
          id: 'sort',
          capsuleId: 'dropdown-select',
          inputs: {
            label: 'Sort by',
            options: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Rating']
          }
        },
        {
          id: 'products-grid',
          capsuleId: 'data-grid-editable',
          inputs: { columns: 3 }
        }
      ],
      connections: []
    }
  },

  // ===== CONTENT =====
  {
    id: 'blog-reader',
    name: 'Blog Reader',
    description: 'Clean blog reading interface',
    category: 'content',
    icon: '📰',
    difficulty: 'beginner',
    features: ['Article list', 'Reading view', 'Categories', 'Search'],
    composition: {
      name: 'Blog Reader',
      version: '1.0.0',
      platform: 'web',
      description: 'Blog reading interface',
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Blog' }
        },
        {
          id: 'header',
          capsuleId: 'h1',
          inputs: { text: 'Latest Articles' }
        },
        {
          id: 'categories',
          capsuleId: 'tabs',
          inputs: {
            tabs: [
              { id: 'all', label: 'All' },
              { id: 'tech', label: 'Technology' },
              { id: 'design', label: 'Design' },
              { id: 'business', label: 'Business' }
            ]
          }
        },
        {
          id: 'search',
          capsuleId: 'search-input',
          inputs: { placeholder: 'Search articles...' }
        },
        {
          id: 'articles-list',
          capsuleId: 'list-view',
          inputs: { selectable: true }
        },
        {
          id: 'article-content',
          capsuleId: 'markdown-viewer',
          inputs: {}
        },
        {
          id: 'tags',
          capsuleId: 'chip',
          inputs: { label: 'Tags' }
        }
      ],
      connections: []
    }
  }
]

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: '🎯' },
  { id: 'productivity', label: 'Productivity', icon: '✅' },
  { id: 'dashboard', label: 'Dashboards', icon: '📊' },
  { id: 'forms', label: 'Forms', icon: '📋' },
  { id: 'social', label: 'Social & Chat', icon: '💬' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
  { id: 'content', label: 'Content', icon: '📰' }
]

export function getTemplatesByCategory(category: string): AppTemplate[] {
  if (category === 'all') return APP_TEMPLATES
  return APP_TEMPLATES.filter(t => t.category === category)
}

export function getTemplateById(id: string): AppTemplate | undefined {
  return APP_TEMPLATES.find(t => t.id === id)
}

export function getPopularTemplates(limit: number = 6): AppTemplate[] {
  return APP_TEMPLATES.slice(0, limit)
}

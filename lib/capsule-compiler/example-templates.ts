import { CapsuleComposition } from './types'

/**
 * Pre-built app templates for quick start
 */

export const TODO_APP_TEMPLATE: CapsuleComposition = {
  name: 'Todo App',
  version: '1.0.0',
  platform: 'web',
  description: 'Simple todo list with local storage',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'My Tasks',
        showHeader: true
      }
    },
    {
      id: 'add-form',
      capsuleId: 'form-validated',
      inputs: {
        fields: [
          {
            name: 'task',
            type: 'text',
            label: 'New Task',
            placeholder: 'What needs to be done?',
            required: true
          }
        ],
        submitLabel: 'Add Task',
        onSubmit: '@addTask'
      }
    },
    {
      id: 'task-list',
      capsuleId: 'list-view',
      inputs: {
        items: '@tasks',
        renderItem: '@renderTaskItem',
        emptyMessage: 'No tasks yet. Add one above!'
      }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: {
        key: 'todos',
        initial: []
      }
    }
  ],

  connections: [
    { from: 'storage.data', to: 'task-list.items' },
    { from: 'add-form.onSubmit', to: 'storage.add' },
    { from: 'task-list.onItemDelete', to: 'storage.remove' }
  ],

  constraints: {
    maxCapsules: 10,
    performance: 'high',
    bundle: 'minimal'
  }
}

export const DASHBOARD_TEMPLATE: CapsuleComposition = {
  name: 'Analytics Dashboard',
  version: '1.0.0',
  platform: 'web',
  description: 'Dashboard with charts and data tables',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'Analytics Dashboard',
        showHeader: true
      }
    },
    {
      id: 'date-filter',
      capsuleId: 'dropdown-select',
      inputs: {
        options: [
          { label: 'Last 7 days', value: '7d' },
          { label: 'Last 30 days', value: '30d' },
          { label: 'Last 90 days', value: '90d' },
          { label: 'Year to date', value: 'ytd' }
        ],
        defaultValue: '30d',
        label: 'Time Range'
      }
    },
    {
      id: 'revenue-card',
      capsuleId: 'card',
      inputs: {
        title: 'Revenue',
        value: '@totalRevenue',
        trend: '+12%',
        trendDirection: 'up'
      }
    },
    {
      id: 'users-card',
      capsuleId: 'card',
      inputs: {
        title: 'Active Users',
        value: '@activeUsers',
        trend: '+5%',
        trendDirection: 'up'
      }
    },
    {
      id: 'conversion-card',
      capsuleId: 'card',
      inputs: {
        title: 'Conversion Rate',
        value: '@conversionRate',
        trend: '-2%',
        trendDirection: 'down'
      }
    },
    {
      id: 'revenue-chart',
      capsuleId: 'chart-line',
      inputs: {
        data: '@revenueData',
        title: 'Revenue Trend',
        height: 300,
        showLegend: true
      }
    },
    {
      id: 'category-chart',
      capsuleId: 'chart-pie',
      inputs: {
        data: '@categoryData',
        title: 'Sales by Category',
        donut: true,
        size: 300
      }
    },
    {
      id: 'recent-orders',
      capsuleId: 'data-table',
      inputs: {
        data: '@ordersData',
        columns: [
          { id: 'id', label: 'Order ID', sortable: true },
          { id: 'customer', label: 'Customer' },
          { id: 'amount', label: 'Amount', sortable: true },
          { id: 'status', label: 'Status' },
          { id: 'date', label: 'Date', sortable: true }
        ],
        title: 'Recent Orders',
        pageSize: 10
      }
    },
    {
      id: 'data-source',
      capsuleId: 'http-fetch',
      inputs: {
        url: 'https://api.example.com/analytics',
        method: 'GET',
        interval: 30000,  // Refresh every 30s
        params: { timeRange: '@selectedTimeRange' }
      }
    }
  ],

  connections: [
    { from: 'date-filter.value', to: 'data-source.params.timeRange' },
    { from: 'data-source.data.revenue', to: 'revenue-card.value' },
    { from: 'data-source.data.users', to: 'users-card.value' },
    { from: 'data-source.data.conversionRate', to: 'conversion-card.value' },
    { from: 'data-source.data.revenueTimeSeries', to: 'revenue-chart.data' },
    { from: 'data-source.data.categories', to: 'category-chart.data' },
    { from: 'data-source.data.recentOrders', to: 'recent-orders.data' }
  ],

  constraints: {
    maxCapsules: 20,
    performance: 'high',
    bundle: 'standard'
  }
}

export const ECOMMERCE_TEMPLATE: CapsuleComposition = {
  name: 'E-Commerce Store',
  version: '1.0.0',
  platform: 'web',
  description: 'Product catalog with shopping cart',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'My Store',
        showHeader: true,
        showCart: true
      }
    },
    {
      id: 'search-bar',
      capsuleId: 'search-input',
      inputs: {
        placeholder: 'Search products...',
        debounce: 300,
        onSearch: '@searchProducts'
      }
    },
    {
      id: 'category-filter',
      capsuleId: 'dropdown-select',
      inputs: {
        options: '@categories',
        label: 'Category',
        placeholder: 'All Categories'
      }
    },
    {
      id: 'price-slider',
      capsuleId: 'slider',
      inputs: {
        min: 0,
        max: 1000,
        label: 'Price Range',
        step: 10
      }
    },
    {
      id: 'product-grid',
      capsuleId: 'virtual-list',
      inputs: {
        items: '@filteredProducts',
        renderItem: '@renderProductCard',
        columns: 3,
        gap: 20
      }
    },
    {
      id: 'cart-drawer',
      capsuleId: 'drawer',
      inputs: {
        position: 'right',
        title: 'Shopping Cart',
        items: '@cartItems',
        total: '@cartTotal'
      }
    },
    {
      id: 'product-modal',
      capsuleId: 'modal',
      inputs: {
        open: '@selectedProduct !== null',
        title: '@selectedProduct.name',
        content: '@renderProductDetails'
      }
    },
    {
      id: 'checkout-form',
      capsuleId: 'form-validated',
      inputs: {
        fields: [
          { name: 'name', type: 'text', label: 'Full Name', required: true },
          { name: 'email', type: 'email', label: 'Email', required: true },
          { name: 'address', type: 'text', label: 'Address', required: true },
          { name: 'card', type: 'text', label: 'Card Number', required: true }
        ],
        submitLabel: 'Place Order'
      }
    },
    {
      id: 'products-api',
      capsuleId: 'http-fetch',
      inputs: {
        url: 'https://api.example.com/products',
        method: 'GET',
        cache: true
      }
    },
    {
      id: 'cart-storage',
      capsuleId: 'database-local',
      inputs: {
        key: 'shopping-cart',
        initial: []
      }
    }
  ],

  connections: [
    { from: 'products-api.data', to: 'product-grid.items' },
    { from: 'search-bar.value', to: 'products-api.params.search' },
    { from: 'category-filter.value', to: 'products-api.params.category' },
    { from: 'price-slider.value', to: 'products-api.params.maxPrice' },
    { from: 'product-grid.onItemClick', to: 'product-modal.open' },
    { from: 'cart-storage.data', to: 'cart-drawer.items' },
    { from: 'product-modal.onAddToCart', to: 'cart-storage.add' }
  ],

  constraints: {
    maxCapsules: 25,
    performance: 'balanced',
    bundle: 'standard'
  }
}

export const BLOG_TEMPLATE: CapsuleComposition = {
  name: 'Blog Platform',
  version: '1.0.0',
  platform: 'web',
  description: 'Blog with markdown editor and comments',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'My Blog',
        showHeader: true
      }
    },
    {
      id: 'post-list',
      capsuleId: 'list-view',
      inputs: {
        items: '@posts',
        renderItem: '@renderPostPreview'
      }
    },
    {
      id: 'markdown-editor',
      capsuleId: 'wysiwyg-editor',
      inputs: {
        value: '@currentPost',
        onChange: '@updatePost',
        placeholder: 'Write your post...',
        height: 400
      }
    },
    {
      id: 'markdown-viewer',
      capsuleId: 'markdown-viewer',
      inputs: {
        content: '@selectedPost.content',
        showToc: true
      }
    },
    {
      id: 'comment-section',
      capsuleId: 'accordion',
      inputs: {
        items: '@comments',
        title: 'Comments'
      }
    },
    {
      id: 'posts-api',
      capsuleId: 'http-fetch',
      inputs: {
        url: 'https://api.example.com/posts',
        method: 'GET'
      }
    }
  ],

  connections: [
    { from: 'posts-api.data', to: 'post-list.items' },
    { from: 'post-list.onItemClick', to: 'markdown-viewer.content' }
  ],

  constraints: {
    maxCapsules: 15,
    performance: 'balanced',
    bundle: 'standard'
  }
}

export const KANBAN_TEMPLATE: CapsuleComposition = {
  name: 'Kanban Board',
  version: '1.0.0',
  platform: 'web',
  description: 'Project management with drag-drop',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'Project Board',
        showHeader: true
      }
    },
    {
      id: 'board',
      capsuleId: 'kanban-board',
      inputs: {
        columns: [
          { id: 'todo', title: 'To Do', items: '@todoItems' },
          { id: 'inprogress', title: 'In Progress', items: '@inProgressItems' },
          { id: 'review', title: 'Review', items: '@reviewItems' },
          { id: 'done', title: 'Done', items: '@doneItems' }
        ],
        onCardMove: '@moveCard',
        onCardClick: '@openCard'
      }
    },
    {
      id: 'add-task-modal',
      capsuleId: 'modal',
      inputs: {
        title: 'New Task',
        open: '@showAddModal'
      }
    },
    {
      id: 'task-form',
      capsuleId: 'form-validated',
      inputs: {
        fields: [
          { name: 'title', type: 'text', label: 'Title', required: true },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'assignee', type: 'select', label: 'Assignee', options: '@teamMembers' },
          { name: 'priority', type: 'select', label: 'Priority', options: ['Low', 'Medium', 'High'] }
        ]
      }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: {
        key: 'kanban-tasks',
        initial: { todo: [], inprogress: [], review: [], done: [] }
      }
    }
  ],

  connections: [
    { from: 'storage.data.todo', to: 'board.columns.0.items' },
    { from: 'storage.data.inprogress', to: 'board.columns.1.items' },
    { from: 'storage.data.review', to: 'board.columns.2.items' },
    { from: 'storage.data.done', to: 'board.columns.3.items' },
    { from: 'board.onCardMove', to: 'storage.update' },
    { from: 'task-form.onSubmit', to: 'storage.add' }
  ],

  constraints: {
    maxCapsules: 15,
    performance: 'high',
    bundle: 'minimal'
  }
}

export const CALENDAR_TEMPLATE: CapsuleComposition = {
  name: 'Calendar App',
  version: '1.0.0',
  platform: 'web',
  description: 'Full calendar with event management',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'My Calendar',
        showHeader: true
      }
    },
    {
      id: 'calendar',
      capsuleId: 'calendar-full',
      inputs: {
        events: '@events',
        defaultView: 'month',
        onEventClick: '@openEvent',
        onEventCreate: '@createEvent'
      }
    },
    {
      id: 'event-modal',
      capsuleId: 'modal',
      inputs: {
        title: '@modalTitle',
        open: '@showModal'
      }
    },
    {
      id: 'event-form',
      capsuleId: 'form-validated',
      inputs: {
        fields: [
          { name: 'title', type: 'text', label: 'Event Title', required: true },
          { name: 'start', type: 'datetime', label: 'Start Time', required: true },
          { name: 'end', type: 'datetime', label: 'End Time', required: true },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'location', type: 'text', label: 'Location' },
          { name: 'color', type: 'select', label: 'Color', options: ['blue', 'green', 'red', 'purple'] }
        ]
      }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: {
        key: 'calendar-events',
        initial: []
      }
    }
  ],

  connections: [
    { from: 'storage.data', to: 'calendar.events' },
    { from: 'event-form.onSubmit', to: 'storage.add' },
    { from: 'calendar.onEventClick', to: 'event-modal.open' }
  ],

  constraints: {
    maxCapsules: 15,
    performance: 'balanced',
    bundle: 'standard'
  }
}

/**
 * Get all available templates
 */
export const APP_TEMPLATES = {
  todo: TODO_APP_TEMPLATE,
  dashboard: DASHBOARD_TEMPLATE,
  ecommerce: ECOMMERCE_TEMPLATE,
  blog: BLOG_TEMPLATE,
  kanban: KANBAN_TEMPLATE,
  calendar: CALENDAR_TEMPLATE
}

/**
 * Get template metadata for display
 */
export const TEMPLATE_METADATA = [
  {
    id: 'todo',
    name: 'Todo App',
    description: 'Simple task management with local storage',
    icon: '✅',
    complexity: 'simple',
    capsules: 4,
    category: 'Productivity'
  },
  {
    id: 'dashboard',
    name: 'Analytics Dashboard',
    description: 'Data visualization with charts and tables',
    icon: '📊',
    complexity: 'advanced',
    capsules: 9,
    category: 'Business'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Store',
    description: 'Product catalog with shopping cart',
    icon: '🛒',
    complexity: 'advanced',
    capsules: 10,
    category: 'E-Commerce'
  },
  {
    id: 'blog',
    name: 'Blog Platform',
    description: 'Markdown editor with post management',
    icon: '📝',
    complexity: 'medium',
    capsules: 6,
    category: 'Content'
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    description: 'Drag-and-drop project management',
    icon: '📋',
    complexity: 'medium',
    capsules: 5,
    category: 'Project Management'
  },
  {
    id: 'calendar',
    name: 'Calendar App',
    description: 'Event scheduling and management',
    icon: '📅',
    complexity: 'medium',
    capsules: 5,
    category: 'Productivity'
  }
]

/**
 * Get template by ID
 */
export function getTemplate(id: string): CapsuleComposition | null {
  return APP_TEMPLATES[id as keyof typeof APP_TEMPLATES] || null
}

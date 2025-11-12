import { CapsuleComposition } from './types'

/**
 * Pre-built app templates for quick start
 */

export const TODO_APP_TEMPLATE: CapsuleComposition = {
  name: 'Todo App',
  version: '1.0.0',
  platform: 'web',
  description: 'AI-powered todo list with voice input, smart categorization, and text-to-speech',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'AI Todo Assistant',
        showHeader: true
      }
    },
    {
      id: 'voice-input',
      capsuleId: 'stt-whisper-local',
      inputs: {
        model: 'base',
        language: 'auto',
        realtime: false
      }
    },
    {
      id: 'button-voice',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🎤',
        variant: 'secondary',
        size: 'medium',
        onClick: '@startVoiceInput'
      }
    },
    {
      id: 'input-task',
      capsuleId: 'input-text',
      inputs: {
        placeholder: 'Add a task or click mic to speak...',
        size: 'large',
        value: '@taskText'
      }
    },
    {
      id: 'button-add',
      capsuleId: 'button-primary',
      inputs: {
        label: 'Add Task',
        size: 'large',
        loading: '@isProcessing'
      }
    },
    {
      id: 'ai-categorizer',
      capsuleId: 'llm-groq',
      inputs: {
        model: 'llama-3.3-70b-versatile',
        systemPrompt: 'Categorize tasks into: Work, Personal, Shopping, Health, or Other. Return only the category name.',
        maxTokens: 10
      }
    },
    {
      id: 'task-cards',
      capsuleId: 'card-grid',
      inputs: {
        items: '@tasks',
        columns: 2,
        gap: 16
      }
    },
    {
      id: 'badge-category',
      capsuleId: 'badge',
      inputs: {
        variant: 'default',
        size: 'small'
      }
    },
    {
      id: 'tts-reader',
      capsuleId: 'tts-elevenlabs',
      inputs: {
        voice: 'Rachel',
        model: 'eleven_multilingual_v2',
        speed: 1.0
      }
    },
    {
      id: 'button-speak',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🔊',
        variant: 'ghost',
        size: 'small',
        onClick: '@speakTask'
      }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: {
        key: 'ai-todos',
        initial: []
      }
    }
  ],

  connections: [
    { from: 'voice-input.transcript', to: 'input-task.value' },
    { from: 'input-task.value', to: 'ai-categorizer.input' },
    { from: 'ai-categorizer.output', to: 'badge-category.text' },
    { from: 'button-add.onClick', to: 'storage.add' },
    { from: 'storage.data', to: 'task-cards.items' },
    { from: 'button-speak.onClick', to: 'tts-reader.text' }
  ],

  constraints: {
    maxCapsules: 20,
    performance: 'high',
    bundle: 'minimal'
  }
}

export const DASHBOARD_TEMPLATE: CapsuleComposition = {
  name: 'Analytics Dashboard',
  version: '1.0.0',
  platform: 'web',
  description: 'AI-powered analytics dashboard with voice commands, smart insights, and advanced visualizations',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'AI Analytics Dashboard',
        showHeader: true
      }
    },
    {
      id: 'voice-command',
      capsuleId: 'stt-openai-whisper',
      inputs: {
        model: 'whisper-1',
        language: 'en'
      }
    },
    {
      id: 'button-voice-cmd',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🎤',
        variant: 'outline',
        size: 'small',
        tooltip: 'Voice command: "Show last 7 days"'
      }
    },
    {
      id: 'ai-insights',
      capsuleId: 'llm-groq',
      inputs: {
        model: 'llama-3.3-70b-versatile',
        systemPrompt: 'Analyze this dashboard data and provide 3 key insights in bullet points.',
        maxTokens: 200
      }
    },
    {
      id: 'insights-card',
      capsuleId: 'card-gradient',
      inputs: {
        title: 'AI Insights',
        gradient: 'purple-to-pink',
        size: 'large'
      }
    },
    {
      id: 'date-filter',
      capsuleId: 'select',
      inputs: {
        options: [
          { label: 'Last 7 days', value: '7d' },
          { label: 'Last 30 days', value: '30d' },
          { label: 'Last 90 days', value: '90d' },
          { label: 'Year to date', value: 'ytd' }
        ],
        defaultValue: '30d',
        label: 'Time Range',
        size: 'medium'
      }
    },
    {
      id: 'stats-grid',
      capsuleId: 'grid',
      inputs: {
        columns: 3,
        gap: 16,
        responsive: true
      }
    },
    {
      id: 'revenue-card',
      capsuleId: 'card-stat',
      inputs: {
        title: 'Revenue',
        value: '@totalRevenue',
        trend: '+12%',
        trendDirection: 'up',
        icon: '💰'
      }
    },
    {
      id: 'users-card',
      capsuleId: 'card-stat',
      inputs: {
        title: 'Active Users',
        value: '@activeUsers',
        trend: '+5%',
        trendDirection: 'up',
        icon: '👥'
      }
    },
    {
      id: 'conversion-card',
      capsuleId: 'card-stat',
      inputs: {
        title: 'Conversion Rate',
        value: '@conversionRate',
        trend: '-2%',
        trendDirection: 'down',
        icon: '📈'
      }
    },
    {
      id: 'revenue-chart',
      capsuleId: 'chart-area',
      inputs: {
        data: '@revenueData',
        title: 'Revenue Trend',
        height: 300,
        showLegend: true,
        gradient: true
      }
    },
    {
      id: 'category-chart',
      capsuleId: 'chart-donut',
      inputs: {
        data: '@categoryData',
        title: 'Sales by Category',
        size: 300,
        showPercentage: true
      }
    },
    {
      id: 'heatmap',
      capsuleId: 'chart-heatmap',
      inputs: {
        data: '@activityData',
        title: 'User Activity Heatmap',
        colorScheme: 'blue'
      }
    },
    {
      id: 'recent-orders',
      capsuleId: 'table',
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
        pageSize: 10,
        searchable: true,
        striped: true
      }
    },
    {
      id: 'tts-summary',
      capsuleId: 'tts-google-cloud',
      inputs: {
        voice: 'en-US-Neural2-F',
        speed: 1.0
      }
    },
    {
      id: 'button-speak-insights',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🔊',
        variant: 'ghost',
        size: 'small',
        tooltip: 'Listen to insights'
      }
    },
    {
      id: 'data-source',
      capsuleId: 'http-fetch',
      inputs: {
        url: 'https://api.example.com/analytics',
        method: 'GET',
        interval: 30000,
        params: { timeRange: '@selectedTimeRange' }
      }
    }
  ],

  connections: [
    { from: 'voice-command.transcript', to: 'date-filter.value' },
    { from: 'date-filter.value', to: 'data-source.params.timeRange' },
    { from: 'data-source.data.revenue', to: 'revenue-card.value' },
    { from: 'data-source.data.users', to: 'users-card.value' },
    { from: 'data-source.data.conversionRate', to: 'conversion-card.value' },
    { from: 'data-source.data.revenueTimeSeries', to: 'revenue-chart.data' },
    { from: 'data-source.data.categories', to: 'category-chart.data' },
    { from: 'data-source.data.recentOrders', to: 'recent-orders.data' },
    { from: 'data-source.data', to: 'ai-insights.input' },
    { from: 'ai-insights.output', to: 'insights-card.content' },
    { from: 'ai-insights.output', to: 'tts-summary.text' }
  ],

  constraints: {
    maxCapsules: 30,
    performance: 'high',
    bundle: 'standard'
  }
}

export const ECOMMERCE_TEMPLATE: CapsuleComposition = {
  name: 'E-Commerce Store',
  version: '1.0.0',
  platform: 'web',
  description: 'AI-powered e-commerce with voice search, product image generation, image enhancement, and product descriptions',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'AI Shopping Store',
        showHeader: true,
        showCart: true
      }
    },
    {
      id: 'voice-search',
      capsuleId: 'stt-google-cloud',
      inputs: {
        model: 'latest_long',
        language: 'en-US',
        realtime: true
      }
    },
    {
      id: 'search-bar',
      capsuleId: 'input-search',
      inputs: {
        placeholder: 'Search products or speak...',
        size: 'large',
        icon: '🔍'
      }
    },
    {
      id: 'button-voice-search',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🎤',
        variant: 'secondary',
        size: 'medium'
      }
    },
    {
      id: 'category-filter',
      capsuleId: 'select',
      inputs: {
        options: '@categories',
        label: 'Category',
        placeholder: 'All Categories',
        size: 'medium'
      }
    },
    {
      id: 'price-slider',
      capsuleId: 'slider-range',
      inputs: {
        min: 0,
        max: 1000,
        label: 'Price Range',
        step: 10,
        showValue: true
      }
    },
    {
      id: 'product-grid',
      capsuleId: 'card-grid',
      inputs: {
        items: '@filteredProducts',
        columns: 3,
        gap: 20,
        hover: true
      }
    },
    {
      id: 'image-enhancer',
      capsuleId: 'img-upscale-esrgan',
      inputs: {
        scale: 2,
        model: 'ESRGAN_4x',
        denoise: 0.5
      }
    },
    {
      id: 'product-image-gen',
      capsuleId: 'img-gen-flux',
      inputs: {
        model: 'flux-1-dev',
        steps: 30,
        guidance: 7.5,
        aspectRatio: '1:1'
      }
    },
    {
      id: 'ai-product-description',
      capsuleId: 'llm-openai',
      inputs: {
        model: 'gpt-4',
        systemPrompt: 'Generate compelling product descriptions that highlight features, benefits, and unique selling points.',
        maxTokens: 150
      }
    },
    {
      id: 'product-tts',
      capsuleId: 'tts-elevenlabs',
      inputs: {
        voice: 'Rachel',
        model: 'eleven_multilingual_v2',
        speed: 1.0
      }
    },
    {
      id: 'button-listen',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🔊',
        variant: 'ghost',
        size: 'small',
        tooltip: 'Listen to description'
      }
    },
    {
      id: 'cart-drawer',
      capsuleId: 'drawer',
      inputs: {
        position: 'right',
        title: 'Shopping Cart',
        size: 'large'
      }
    },
    {
      id: 'cart-badge',
      capsuleId: 'badge',
      inputs: {
        variant: 'primary',
        size: 'small',
        value: '@cartCount'
      }
    },
    {
      id: 'product-modal',
      capsuleId: 'modal',
      inputs: {
        size: 'large',
        title: '@selectedProduct.name'
      }
    },
    {
      id: 'image-carousel',
      capsuleId: 'carousel',
      inputs: {
        images: '@productImages',
        autoplay: false,
        showThumbnails: true
      }
    },
    {
      id: 'checkout-form',
      capsuleId: 'form-multi-step',
      inputs: {
        steps: [
          {
            title: 'Contact',
            fields: [
              { name: 'name', type: 'text', label: 'Full Name', required: true },
              { name: 'email', type: 'email', label: 'Email', required: true }
            ]
          },
          {
            title: 'Shipping',
            fields: [
              { name: 'address', type: 'text', label: 'Address', required: true },
              { name: 'city', type: 'text', label: 'City', required: true },
              { name: 'zip', type: 'text', label: 'ZIP', required: true }
            ]
          },
          {
            title: 'Payment',
            fields: [
              { name: 'card', type: 'text', label: 'Card Number', required: true },
              { name: 'expiry', type: 'text', label: 'Expiry', required: true },
              { name: 'cvv', type: 'text', label: 'CVV', required: true }
            ]
          }
        ]
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
        key: 'ai-shopping-cart',
        initial: []
      }
    }
  ],

  connections: [
    { from: 'voice-search.transcript', to: 'search-bar.value' },
    { from: 'search-bar.value', to: 'products-api.params.search' },
    { from: 'category-filter.value', to: 'products-api.params.category' },
    { from: 'price-slider.value', to: 'products-api.params.maxPrice' },
    { from: 'products-api.data', to: 'product-grid.items' },
    { from: 'product-grid.onItemClick', to: 'product-modal.open' },
    { from: 'product-modal.selectedProduct', to: 'ai-product-description.input' },
    { from: 'ai-product-description.output', to: 'product-tts.text' },
    { from: 'product-modal.image', to: 'image-enhancer.input' },
    { from: 'cart-storage.data', to: 'cart-drawer.items' },
    { from: 'cart-storage.data.length', to: 'cart-badge.value' }
  ],

  constraints: {
    maxCapsules: 35,
    performance: 'balanced',
    bundle: 'standard'
  }
}

export const BLOG_TEMPLATE: CapsuleComposition = {
  name: 'Blog Platform',
  version: '1.0.0',
  platform: 'web',
  description: 'AI-powered blog with voice dictation, AI content generation, cover image creation, and audio versions',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'AI Blog Studio',
        showHeader: true
      }
    },
    {
      id: 'post-list',
      capsuleId: 'card-grid',
      inputs: {
        items: '@posts',
        columns: 2,
        gap: 24,
        hover: true
      }
    },
    {
      id: 'voice-dictation',
      capsuleId: 'stt-assemblyai',
      inputs: {
        model: 'best',
        language: 'en',
        realtime: true,
        punctuation: true
      }
    },
    {
      id: 'button-dictate',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🎤',
        variant: 'secondary',
        size: 'medium',
        tooltip: 'Voice dictation'
      }
    },
    {
      id: 'markdown-editor',
      capsuleId: 'textarea',
      inputs: {
        value: '@currentPost',
        placeholder: 'Write your post or use voice dictation...',
        rows: 20,
        size: 'large',
        monospace: true
      }
    },
    {
      id: 'ai-writer',
      capsuleId: 'llm-openai',
      inputs: {
        model: 'gpt-4',
        systemPrompt: 'You are a professional blog writer. Generate engaging, well-structured blog posts based on the topic provided.',
        maxTokens: 1000,
        temperature: 0.7
      }
    },
    {
      id: 'button-ai-generate',
      capsuleId: 'button-primary',
      inputs: {
        label: 'Generate with AI',
        icon: '✨',
        size: 'medium'
      }
    },
    {
      id: 'input-topic',
      capsuleId: 'input-text',
      inputs: {
        placeholder: 'Enter blog topic for AI generation...',
        size: 'large'
      }
    },
    {
      id: 'cover-image-gen',
      capsuleId: 'img-gen-stable-diffusion',
      inputs: {
        model: 'stable-diffusion-xl',
        steps: 40,
        guidance: 7.0,
        width: 1024,
        height: 576
      }
    },
    {
      id: 'button-generate-cover',
      capsuleId: 'button-secondary',
      inputs: {
        label: 'Generate Cover Image',
        icon: '🎨',
        size: 'small'
      }
    },
    {
      id: 'image-display',
      capsuleId: 'image',
      inputs: {
        src: '@coverImageUrl',
        alt: 'Blog cover',
        width: '100%',
        rounded: true
      }
    },
    {
      id: 'markdown-viewer',
      capsuleId: 'markdown',
      inputs: {
        content: '@selectedPost.content',
        showToc: true,
        theme: 'github'
      }
    },
    {
      id: 'tabs-view',
      capsuleId: 'tabs',
      inputs: {
        tabs: [
          { id: 'write', label: 'Write', icon: '✍️' },
          { id: 'preview', label: 'Preview', icon: '👁️' },
          { id: 'audio', label: 'Audio', icon: '🔊' }
        ],
        defaultTab: 'write'
      }
    },
    {
      id: 'post-tts',
      capsuleId: 'tts-openai',
      inputs: {
        model: 'tts-1-hd',
        voice: 'alloy',
        speed: 1.0
      }
    },
    {
      id: 'button-generate-audio',
      capsuleId: 'button-secondary',
      inputs: {
        label: 'Generate Audio Version',
        icon: '🎧',
        size: 'medium'
      }
    },
    {
      id: 'audio-player',
      capsuleId: 'audio-player',
      inputs: {
        src: '@audioUrl',
        controls: true,
        autoplay: false
      }
    },
    {
      id: 'comment-section',
      capsuleId: 'accordion',
      inputs: {
        title: 'Comments',
        items: '@comments'
      }
    },
    {
      id: 'ai-moderator',
      capsuleId: 'llm-groq',
      inputs: {
        model: 'llama-3.3-70b-versatile',
        systemPrompt: 'Analyze this comment for spam, toxicity, or inappropriate content. Return APPROVE or REJECT.',
        maxTokens: 10
      }
    },
    {
      id: 'posts-api',
      capsuleId: 'http-fetch',
      inputs: {
        url: 'https://api.example.com/posts',
        method: 'GET'
      }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: {
        key: 'blog-posts',
        initial: []
      }
    }
  ],

  connections: [
    { from: 'posts-api.data', to: 'post-list.items' },
    { from: 'post-list.onItemClick', to: 'markdown-viewer.content' },
    { from: 'voice-dictation.transcript', to: 'markdown-editor.value' },
    { from: 'input-topic.value', to: 'ai-writer.input' },
    { from: 'ai-writer.output', to: 'markdown-editor.value' },
    { from: 'input-topic.value', to: 'cover-image-gen.prompt' },
    { from: 'cover-image-gen.output', to: 'image-display.src' },
    { from: 'markdown-editor.value', to: 'post-tts.text' },
    { from: 'post-tts.output', to: 'audio-player.src' }
  ],

  constraints: {
    maxCapsules: 30,
    performance: 'balanced',
    bundle: 'standard'
  }
}

export const KANBAN_TEMPLATE: CapsuleComposition = {
  name: 'Kanban Board',
  version: '1.0.0',
  platform: 'web',
  description: 'AI-powered project management with voice task creation, smart prioritization, and automated task breakdown',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'AI Project Board',
        showHeader: true
      }
    },
    {
      id: 'voice-task-input',
      capsuleId: 'stt-vosk',
      inputs: {
        model: 'vosk-model-en-us-0.22',
        realtime: false
      }
    },
    {
      id: 'button-voice-task',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🎤',
        variant: 'primary',
        size: 'medium',
        tooltip: 'Create task with voice'
      }
    },
    {
      id: 'ai-task-breakdown',
      capsuleId: 'llm-groq',
      inputs: {
        model: 'llama-3.3-70b-versatile',
        systemPrompt: 'Break down this high-level task into 3-5 actionable subtasks. Return as a JSON array of tasks.',
        maxTokens: 300
      }
    },
    {
      id: 'ai-prioritizer',
      capsuleId: 'llm-openai',
      inputs: {
        model: 'gpt-4',
        systemPrompt: 'Analyze this task and assign priority (Low, Medium, High) and estimated hours. Consider urgency, impact, and complexity.',
        maxTokens: 50
      }
    },
    {
      id: 'board',
      capsuleId: 'grid',
      inputs: {
        columns: 4,
        gap: 16,
        responsive: true
      }
    },
    {
      id: 'column-todo',
      capsuleId: 'card',
      inputs: {
        title: 'To Do',
        variant: 'default',
        padding: 'medium'
      }
    },
    {
      id: 'column-progress',
      capsuleId: 'card',
      inputs: {
        title: 'In Progress',
        variant: 'default',
        padding: 'medium'
      }
    },
    {
      id: 'column-review',
      capsuleId: 'card',
      inputs: {
        title: 'Review',
        variant: 'default',
        padding: 'medium'
      }
    },
    {
      id: 'column-done',
      capsuleId: 'card',
      inputs: {
        title: 'Done',
        variant: 'default',
        padding: 'medium'
      }
    },
    {
      id: 'add-task-modal',
      capsuleId: 'modal',
      inputs: {
        title: 'New Task',
        size: 'large'
      }
    },
    {
      id: 'tabs-task',
      capsuleId: 'tabs',
      inputs: {
        tabs: [
          { id: 'manual', label: 'Manual', icon: '✍️' },
          { id: 'voice', label: 'Voice', icon: '🎤' },
          { id: 'ai', label: 'AI Generate', icon: '✨' }
        ],
        defaultTab: 'manual'
      }
    },
    {
      id: 'input-task-title',
      capsuleId: 'input-text',
      inputs: {
        label: 'Task Title',
        placeholder: 'Enter task title...',
        size: 'large',
        required: true
      }
    },
    {
      id: 'textarea-description',
      capsuleId: 'textarea',
      inputs: {
        label: 'Description',
        placeholder: 'Task description...',
        rows: 4,
        size: 'medium'
      }
    },
    {
      id: 'select-assignee',
      capsuleId: 'select',
      inputs: {
        label: 'Assignee',
        options: '@teamMembers',
        size: 'medium'
      }
    },
    {
      id: 'badge-priority',
      capsuleId: 'badge',
      inputs: {
        variant: 'default',
        size: 'small',
        text: '@taskPriority'
      }
    },
    {
      id: 'progress-bar',
      capsuleId: 'progress',
      inputs: {
        value: '@completionPercentage',
        max: 100,
        variant: 'primary',
        showLabel: true
      }
    },
    {
      id: 'button-ai-suggest',
      capsuleId: 'button-secondary',
      inputs: {
        label: 'AI Suggest Next Tasks',
        icon: '✨',
        size: 'medium'
      }
    },
    {
      id: 'ai-task-suggester',
      capsuleId: 'llm-together',
      inputs: {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        systemPrompt: 'Based on current project tasks, suggest 3 next logical tasks to add. Return as bullet points.',
        maxTokens: 200
      }
    },
    {
      id: 'alert-suggestions',
      capsuleId: 'alert',
      inputs: {
        variant: 'info',
        title: 'AI Suggestions',
        dismissible: true
      }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: {
        key: 'ai-kanban-tasks',
        initial: { todo: [], inprogress: [], review: [], done: [] }
      }
    }
  ],

  connections: [
    { from: 'voice-task-input.transcript', to: 'input-task-title.value' },
    { from: 'input-task-title.value', to: 'ai-prioritizer.input' },
    { from: 'input-task-title.value', to: 'ai-task-breakdown.input' },
    { from: 'ai-prioritizer.output', to: 'badge-priority.text' },
    { from: 'storage.data.todo', to: 'column-todo.content' },
    { from: 'storage.data.inprogress', to: 'column-progress.content' },
    { from: 'storage.data.review', to: 'column-review.content' },
    { from: 'storage.data.done', to: 'column-done.content' },
    { from: 'storage.data', to: 'ai-task-suggester.input' },
    { from: 'ai-task-suggester.output', to: 'alert-suggestions.description' }
  ],

  constraints: {
    maxCapsules: 35,
    performance: 'high',
    bundle: 'minimal'
  }
}

export const CALENDAR_TEMPLATE: CapsuleComposition = {
  name: 'Calendar App',
  version: '1.0.0',
  platform: 'web',
  description: 'AI-powered calendar with voice event creation, smart scheduling, and meeting summaries with TTS',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: {
        title: 'AI Smart Calendar',
        showHeader: true
      }
    },
    {
      id: 'voice-event-input',
      capsuleId: 'stt-azure-speech',
      inputs: {
        key: 'azure-key',
        region: 'eastus',
        language: 'en-US',
        realtime: false
      }
    },
    {
      id: 'button-voice-event',
      capsuleId: 'button-icon',
      inputs: {
        icon: '🎤',
        variant: 'primary',
        size: 'large',
        tooltip: 'Create event with voice: "Meeting with John tomorrow at 3pm"'
      }
    },
    {
      id: 'ai-event-parser',
      capsuleId: 'llm-groq',
      inputs: {
        model: 'llama-3.3-70b-versatile',
        systemPrompt: 'Parse natural language event description into structured JSON with title, startTime, endTime, description. Infer times intelligently.',
        maxTokens: 200
      }
    },
    {
      id: 'calendar-grid',
      capsuleId: 'grid',
      inputs: {
        columns: 7,
        gap: 4,
        responsive: false
      }
    },
    {
      id: 'date-picker',
      capsuleId: 'date-picker',
      inputs: {
        mode: 'single',
        showOutsideDays: true
      }
    },
    {
      id: 'event-list',
      capsuleId: 'card-grid',
      inputs: {
        items: '@todayEvents',
        columns: 1,
        gap: 12
      }
    },
    {
      id: 'event-modal',
      capsuleId: 'modal',
      inputs: {
        title: 'Event Details',
        size: 'large'
      }
    },
    {
      id: 'tabs-event',
      capsuleId: 'tabs',
      inputs: {
        tabs: [
          { id: 'details', label: 'Details', icon: '📋' },
          { id: 'voice', label: 'Voice Input', icon: '🎤' },
          { id: 'ai', label: 'AI Suggest', icon: '✨' }
        ],
        defaultTab: 'details'
      }
    },
    {
      id: 'input-title',
      capsuleId: 'input-text',
      inputs: {
        label: 'Event Title',
        placeholder: 'Team meeting...',
        size: 'large',
        required: true
      }
    },
    {
      id: 'datetime-start',
      capsuleId: 'datetime-picker',
      inputs: {
        label: 'Start Time',
        required: true
      }
    },
    {
      id: 'datetime-end',
      capsuleId: 'datetime-picker',
      inputs: {
        label: 'End Time',
        required: true
      }
    },
    {
      id: 'textarea-description',
      capsuleId: 'textarea',
      inputs: {
        label: 'Description',
        placeholder: 'Event details...',
        rows: 4,
        size: 'medium'
      }
    },
    {
      id: 'input-location',
      capsuleId: 'input-text',
      inputs: {
        label: 'Location',
        placeholder: 'Conference Room A',
        size: 'medium'
      }
    },
    {
      id: 'select-color',
      capsuleId: 'select',
      inputs: {
        label: 'Color',
        options: [
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
          { label: 'Red', value: 'red' },
          { label: 'Purple', value: 'purple' },
          { label: 'Orange', value: 'orange' }
        ],
        defaultValue: 'blue',
        size: 'small'
      }
    },
    {
      id: 'ai-scheduler',
      capsuleId: 'llm-openai',
      inputs: {
        model: 'gpt-4',
        systemPrompt: 'Analyze existing calendar events and suggest optimal times for new meetings. Consider work hours, breaks, and avoiding conflicts.',
        maxTokens: 150
      }
    },
    {
      id: 'alert-suggestion',
      capsuleId: 'alert',
      inputs: {
        variant: 'info',
        title: 'AI Scheduling Suggestion',
        dismissible: true
      }
    },
    {
      id: 'ai-meeting-summarizer',
      capsuleId: 'llm-groq',
      inputs: {
        model: 'llama-3.3-70b-versatile',
        systemPrompt: 'Create a brief summary of upcoming meetings for today. Include times, titles, and locations.',
        maxTokens: 250
      }
    },
    {
      id: 'tts-summary',
      capsuleId: 'tts-google-cloud',
      inputs: {
        voice: 'en-US-Neural2-F',
        speed: 1.1
      }
    },
    {
      id: 'button-listen-summary',
      capsuleId: 'button-secondary',
      inputs: {
        label: 'Listen to Today\'s Schedule',
        icon: '🔊',
        size: 'medium'
      }
    },
    {
      id: 'badge-event-count',
      capsuleId: 'badge',
      inputs: {
        variant: 'primary',
        size: 'medium',
        text: '@eventCount'
      }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: {
        key: 'ai-calendar-events',
        initial: []
      }
    }
  ],

  connections: [
    { from: 'voice-event-input.transcript', to: 'ai-event-parser.input' },
    { from: 'ai-event-parser.output', to: 'input-title.value' },
    { from: 'storage.data', to: 'event-list.items' },
    { from: 'storage.data', to: 'ai-scheduler.input' },
    { from: 'ai-scheduler.output', to: 'alert-suggestion.description' },
    { from: 'storage.data', to: 'ai-meeting-summarizer.input' },
    { from: 'ai-meeting-summarizer.output', to: 'tts-summary.text' },
    { from: 'storage.data.length', to: 'badge-event-count.text' }
  ],

  constraints: {
    maxCapsules: 35,
    performance: 'balanced',
    bundle: 'standard'
  }
}

export const AI_ASSISTANT_TEMPLATE: CapsuleComposition = {
  name: 'AI Personal Assistant',
  version: '1.0.0',
  platform: 'web',
  description: 'Full-featured AI assistant with voice conversation, image generation, and multimodal capabilities',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: { title: 'AI Personal Assistant', showHeader: true }
    },
    {
      id: 'voice-input',
      capsuleId: 'stt-realtime',
      inputs: { continuous: true, interimResults: true }
    },
    {
      id: 'ai-chat',
      capsuleId: 'llm-openai',
      inputs: {
        model: 'gpt-4',
        systemPrompt: 'You are a helpful AI assistant. Provide concise, accurate responses.',
        maxTokens: 500,
        temperature: 0.7
      }
    },
    {
      id: 'chat-messages',
      capsuleId: 'card-grid',
      inputs: { items: '@messages', columns: 1, gap: 12 }
    },
    {
      id: 'tts-response',
      capsuleId: 'tts-openai',
      inputs: { model: 'tts-1-hd', voice: 'nova', speed: 1.0 }
    },
    {
      id: 'image-generator',
      capsuleId: 'img-gen-dalle',
      inputs: { model: 'dall-e-3', quality: 'hd', size: '1024x1024' }
    },
    {
      id: 'image-display',
      capsuleId: 'image',
      inputs: { src: '@generatedImage', rounded: true, shadow: true }
    },
    {
      id: 'input-text',
      capsuleId: 'textarea',
      inputs: { placeholder: 'Ask me anything or use voice...', rows: 3, size: 'large' }
    },
    {
      id: 'button-send',
      capsuleId: 'button-primary',
      inputs: { label: 'Send', icon: '📤', size: 'large' }
    },
    {
      id: 'button-voice',
      capsuleId: 'button-icon',
      inputs: { icon: '🎤', variant: 'secondary', size: 'large', tooltip: 'Voice input' }
    },
    {
      id: 'tabs-mode',
      capsuleId: 'tabs',
      inputs: {
        tabs: [
          { id: 'chat', label: 'Chat', icon: '💬' },
          { id: 'image', label: 'Image Gen', icon: '🎨' },
          { id: 'voice', label: 'Voice', icon: '🎤' }
        ]
      }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: { key: 'ai-assistant-history', initial: [] }
    }
  ],

  connections: [
    { from: 'voice-input.transcript', to: 'input-text.value' },
    { from: 'input-text.value', to: 'ai-chat.input' },
    { from: 'ai-chat.output', to: 'chat-messages.items' },
    { from: 'ai-chat.output', to: 'tts-response.text' },
    { from: 'input-text.value', to: 'image-generator.prompt' },
    { from: 'image-generator.output', to: 'image-display.src' }
  ],

  constraints: { maxCapsules: 25, performance: 'high', bundle: 'standard' }
}

export const SOCIAL_MEDIA_TEMPLATE: CapsuleComposition = {
  name: 'AI Social Media Manager',
  version: '1.0.0',
  platform: 'web',
  description: 'Create, schedule, and optimize social media content with AI-generated captions, images, and hashtags',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: { title: 'AI Social Media Studio', showHeader: true }
    },
    {
      id: 'ai-caption-writer',
      capsuleId: 'llm-groq',
      inputs: {
        model: 'llama-3.3-70b-versatile',
        systemPrompt: 'Generate engaging social media captions with emojis and relevant hashtags.',
        maxTokens: 200
      }
    },
    {
      id: 'post-image-gen',
      capsuleId: 'img-gen-stable-diffusion',
      inputs: { model: 'stable-diffusion-xl', steps: 40, width: 1080, height: 1080 }
    },
    {
      id: 'image-upscaler',
      capsuleId: 'img-upscale-esrgan',
      inputs: { scale: 2, model: 'ESRGAN_4x' }
    },
    {
      id: 'image-filter',
      capsuleId: 'img-filter-instagram',
      inputs: { filter: 'clarendon', intensity: 0.8 }
    },
    {
      id: 'hashtag-generator',
      capsuleId: 'llm-openai',
      inputs: {
        model: 'gpt-4',
        systemPrompt: 'Generate 10-15 relevant hashtags for this social media post.',
        maxTokens: 100
      }
    },
    {
      id: 'input-topic',
      capsuleId: 'input-text',
      inputs: { label: 'Post Topic', placeholder: 'What is your post about?', size: 'large' }
    },
    {
      id: 'textarea-caption',
      capsuleId: 'textarea',
      inputs: { label: 'Caption', rows: 6, size: 'large' }
    },
    {
      id: 'image-carousel',
      capsuleId: 'carousel',
      inputs: { images: '@postImages', autoplay: false, showThumbnails: true }
    },
    {
      id: 'button-generate',
      capsuleId: 'button-primary',
      inputs: { label: 'Generate Post', icon: '✨', size: 'large' }
    },
    {
      id: 'card-preview',
      capsuleId: 'card-gradient',
      inputs: { title: 'Post Preview', gradient: 'blue-to-purple', size: 'large' }
    },
    {
      id: 'badge-hashtags',
      capsuleId: 'badge-group',
      inputs: { items: '@hashtags', variant: 'secondary', size: 'small' }
    },
    {
      id: 'calendar-scheduler',
      capsuleId: 'date-picker',
      inputs: { mode: 'single', showOutsideDays: false }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: { key: 'social-posts', initial: [] }
    }
  ],

  connections: [
    { from: 'input-topic.value', to: 'ai-caption-writer.input' },
    { from: 'ai-caption-writer.output', to: 'textarea-caption.value' },
    { from: 'input-topic.value', to: 'post-image-gen.prompt' },
    { from: 'post-image-gen.output', to: 'image-upscaler.input' },
    { from: 'image-upscaler.output', to: 'image-filter.input' },
    { from: 'textarea-caption.value', to: 'hashtag-generator.input' }
  ],

  constraints: { maxCapsules: 30, performance: 'balanced', bundle: 'standard' }
}

export const CONTENT_STUDIO_TEMPLATE: CapsuleComposition = {
  name: 'AI Content Studio',
  version: '1.0.0',
  platform: 'web',
  description: 'Complete content creation suite with video scripts, podcast notes, blog posts, and newsletter generation',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: { title: 'AI Content Studio', showHeader: true }
    },
    {
      id: 'tabs-content-type',
      capsuleId: 'tabs',
      inputs: {
        tabs: [
          { id: 'blog', label: 'Blog Post', icon: '📝' },
          { id: 'video', label: 'Video Script', icon: '🎥' },
          { id: 'podcast', label: 'Podcast', icon: '🎙️' },
          { id: 'newsletter', label: 'Newsletter', icon: '📧' }
        ]
      }
    },
    {
      id: 'voice-brainstorm',
      capsuleId: 'stt-assemblyai',
      inputs: { model: 'best', punctuation: true, realtime: true }
    },
    {
      id: 'ai-blog-writer',
      capsuleId: 'llm-openai',
      inputs: {
        model: 'gpt-4',
        systemPrompt: 'Write comprehensive, SEO-optimized blog posts with H2/H3 headings.',
        maxTokens: 2000
      }
    },
    {
      id: 'ai-script-writer',
      capsuleId: 'llm-groq',
      inputs: {
        model: 'llama-3.3-70b-versatile',
        systemPrompt: 'Write engaging video scripts with hook, main content, and CTA.',
        maxTokens: 1500
      }
    },
    {
      id: 'ai-podcast-notes',
      capsuleId: 'llm-together',
      inputs: {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        systemPrompt: 'Create podcast show notes with timestamps, key points, and guest info.',
        maxTokens: 1000
      }
    },
    {
      id: 'thumbnail-gen',
      capsuleId: 'img-gen-flux',
      inputs: { model: 'flux-1-dev', aspectRatio: '16:9', steps: 30 }
    },
    {
      id: 'tts-voiceover',
      capsuleId: 'tts-elevenlabs',
      inputs: { voice: 'Adam', model: 'eleven_multilingual_v2' }
    },
    {
      id: 'markdown-editor',
      capsuleId: 'textarea',
      inputs: { rows: 25, monospace: true, size: 'large' }
    },
    {
      id: 'markdown-preview',
      capsuleId: 'markdown',
      inputs: { showToc: true, theme: 'github' }
    },
    {
      id: 'button-generate',
      capsuleId: 'button-primary',
      inputs: { label: 'Generate Content', icon: '✨', size: 'large' }
    },
    {
      id: 'progress-generation',
      capsuleId: 'progress',
      inputs: { variant: 'primary', showLabel: true }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: { key: 'content-drafts', initial: [] }
    }
  ],

  connections: [
    { from: 'voice-brainstorm.transcript', to: 'ai-blog-writer.input' },
    { from: 'ai-blog-writer.output', to: 'markdown-editor.value' },
    { from: 'markdown-editor.value', to: 'markdown-preview.content' },
    { from: 'ai-script-writer.output', to: 'tts-voiceover.text' }
  ],

  constraints: { maxCapsules: 25, performance: 'balanced', bundle: 'large' }
}

export const IMAGE_STUDIO_TEMPLATE: CapsuleComposition = {
  name: 'AI Image Studio',
  version: '1.0.0',
  platform: 'web',
  description: 'Professional image generation and editing with multiple AI models, upscaling, filters, and effects',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: { title: 'AI Image Studio', showHeader: true }
    },
    {
      id: 'tabs-tool',
      capsuleId: 'tabs',
      inputs: {
        tabs: [
          { id: 'generate', label: 'Generate', icon: '✨' },
          { id: 'upscale', label: 'Upscale', icon: '🔍' },
          { id: 'edit', label: 'Edit', icon: '✏️' },
          { id: 'filters', label: 'Filters', icon: '🎨' }
        ]
      }
    },
    {
      id: 'gen-dalle',
      capsuleId: 'img-gen-dalle',
      inputs: { model: 'dall-e-3', quality: 'hd', size: '1024x1024' }
    },
    {
      id: 'gen-sd',
      capsuleId: 'img-gen-stable-diffusion',
      inputs: { model: 'stable-diffusion-xl', steps: 50 }
    },
    {
      id: 'gen-flux',
      capsuleId: 'img-gen-flux',
      inputs: { model: 'flux-1-pro', steps: 40 }
    },
    {
      id: 'gen-midjourney',
      capsuleId: 'img-gen-midjourney',
      inputs: { version: 6, quality: 1 }
    },
    {
      id: 'upscale-esrgan',
      capsuleId: 'img-upscale-esrgan',
      inputs: { scale: 4, model: 'ESRGAN_4x' }
    },
    {
      id: 'upscale-realesrgan',
      capsuleId: 'img-upscale-realesrgan',
      inputs: { scale: 4, model: 'RealESRGAN_x4plus' }
    },
    {
      id: 'filter-vintage',
      capsuleId: 'img-filter-vintage',
      inputs: { intensity: 0.8 }
    },
    {
      id: 'filter-hdr',
      capsuleId: 'img-filter-hdr',
      inputs: { strength: 0.5 }
    },
    {
      id: 'input-prompt',
      capsuleId: 'textarea',
      inputs: { label: 'Image Prompt', placeholder: 'Describe the image...', rows: 4, size: 'large' }
    },
    {
      id: 'select-model',
      capsuleId: 'select',
      inputs: {
        label: 'AI Model',
        options: [
          { label: 'DALL-E 3', value: 'dalle' },
          { label: 'Stable Diffusion XL', value: 'sd' },
          { label: 'Flux Pro', value: 'flux' },
          { label: 'Midjourney', value: 'mj' }
        ]
      }
    },
    {
      id: 'image-display',
      capsuleId: 'image',
      inputs: { src: '@generatedImage', rounded: true, shadow: true }
    },
    {
      id: 'image-grid',
      capsuleId: 'card-grid',
      inputs: { items: '@images', columns: 3, gap: 16 }
    },
    {
      id: 'button-generate',
      capsuleId: 'button-primary',
      inputs: { label: 'Generate', icon: '✨', size: 'large' }
    },
    {
      id: 'button-upscale',
      capsuleId: 'button-secondary',
      inputs: { label: 'Upscale 4x', icon: '🔍', size: 'medium' }
    },
    {
      id: 'slider-steps',
      capsuleId: 'slider-range',
      inputs: { label: 'Steps', min: 20, max: 100, step: 5, defaultValue: 50 }
    },
    {
      id: 'slider-guidance',
      capsuleId: 'slider-range',
      inputs: { label: 'Guidance', min: 1, max: 20, step: 0.5, defaultValue: 7.5 }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: { key: 'generated-images', initial: [] }
    }
  ],

  connections: [
    { from: 'input-prompt.value', to: 'gen-dalle.prompt' },
    { from: 'gen-dalle.output', to: 'image-display.src' },
    { from: 'image-display.src', to: 'upscale-esrgan.input' },
    { from: 'upscale-esrgan.output', to: 'filter-vintage.input' }
  ],

  constraints: { maxCapsules: 35, performance: 'balanced', bundle: 'large' }
}

export const VOICE_STUDIO_TEMPLATE: CapsuleComposition = {
  name: 'AI Voice Studio',
  version: '1.0.0',
  platform: 'web',
  description: 'Voice-powered apps with STT, TTS, voice cloning, translation, and audio processing',
  rootCapsule: 'root',

  capsules: [
    {
      id: 'root',
      capsuleId: 'app-container',
      inputs: { title: 'AI Voice Studio', showHeader: true }
    },
    {
      id: 'tabs-mode',
      capsuleId: 'tabs',
      inputs: {
        tabs: [
          { id: 'transcribe', label: 'Transcribe', icon: '🎤' },
          { id: 'synthesize', label: 'Text-to-Speech', icon: '🔊' },
          { id: 'translate', label: 'Translate', icon: '🌐' }
        ]
      }
    },
    {
      id: 'stt-whisper',
      capsuleId: 'stt-openai-whisper',
      inputs: { model: 'whisper-1', language: 'en' }
    },
    {
      id: 'stt-assemblyai',
      capsuleId: 'stt-assemblyai',
      inputs: { model: 'best', punctuation: true }
    },
    {
      id: 'stt-realtime',
      capsuleId: 'stt-realtime',
      inputs: { continuous: true, interimResults: true }
    },
    {
      id: 'tts-openai',
      capsuleId: 'tts-openai',
      inputs: { model: 'tts-1-hd', voice: 'alloy' }
    },
    {
      id: 'tts-elevenlabs',
      capsuleId: 'tts-elevenlabs',
      inputs: { voice: 'Rachel', model: 'eleven_multilingual_v2' }
    },
    {
      id: 'tts-google',
      capsuleId: 'tts-google-cloud',
      inputs: { voice: 'en-US-Neural2-F' }
    },
    {
      id: 'ai-translator',
      capsuleId: 'stt-translation',
      inputs: { targetLanguage: 'es' }
    },
    {
      id: 'textarea-input',
      capsuleId: 'textarea',
      inputs: { label: 'Text Input', rows: 10, size: 'large' }
    },
    {
      id: 'select-voice',
      capsuleId: 'select',
      inputs: {
        label: 'Voice',
        options: [
          { label: 'OpenAI Alloy', value: 'openai-alloy' },
          { label: 'ElevenLabs Rachel', value: 'eleven-rachel' },
          { label: 'Google Neural', value: 'google-neural' }
        ]
      }
    },
    {
      id: 'audio-player',
      capsuleId: 'audio-player',
      inputs: { controls: true, autoplay: false }
    },
    {
      id: 'button-record',
      capsuleId: 'button-icon',
      inputs: { icon: '🎤', variant: 'primary', size: 'large', tooltip: 'Start recording' }
    },
    {
      id: 'button-generate-audio',
      capsuleId: 'button-primary',
      inputs: { label: 'Generate Audio', icon: '🔊', size: 'large' }
    },
    {
      id: 'storage',
      capsuleId: 'database-local',
      inputs: { key: 'voice-projects', initial: [] }
    }
  ],

  connections: [
    { from: 'stt-whisper.transcript', to: 'textarea-input.value' },
    { from: 'textarea-input.value', to: 'tts-openai.text' },
    { from: 'tts-openai.output', to: 'audio-player.src' },
    { from: 'textarea-input.value', to: 'ai-translator.input' }
  ],

  constraints: { maxCapsules: 30, performance: 'high', bundle: 'standard' }
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
  calendar: CALENDAR_TEMPLATE,
  aiAssistant: AI_ASSISTANT_TEMPLATE,
  socialMedia: SOCIAL_MEDIA_TEMPLATE,
  contentStudio: CONTENT_STUDIO_TEMPLATE,
  imageStudio: IMAGE_STUDIO_TEMPLATE,
  voiceStudio: VOICE_STUDIO_TEMPLATE
}

/**
 * Get template metadata for display
 */
export const TEMPLATE_METADATA = [
  {
    id: 'todo',
    name: 'AI Todo Assistant',
    description: 'AI-powered task management with voice input and smart categorization',
    icon: '✅',
    complexity: 'simple',
    capsules: 11,
    category: 'Productivity'
  },
  {
    id: 'dashboard',
    name: 'AI Analytics Dashboard',
    description: 'AI-powered dashboard with voice commands and smart insights',
    icon: '📊',
    complexity: 'advanced',
    capsules: 17,
    category: 'Business'
  },
  {
    id: 'ecommerce',
    name: 'AI Shopping Store',
    description: 'E-commerce with AI product descriptions, image enhancement, and voice search',
    icon: '🛒',
    complexity: 'advanced',
    capsules: 19,
    category: 'E-Commerce'
  },
  {
    id: 'blog',
    name: 'AI Blog Studio',
    description: 'AI content generation with voice dictation, cover images, and audio versions',
    icon: '📝',
    complexity: 'advanced',
    capsules: 20,
    category: 'Content'
  },
  {
    id: 'kanban',
    name: 'AI Project Board',
    description: 'AI-powered kanban with voice tasks, smart prioritization, and task breakdown',
    icon: '📋',
    complexity: 'advanced',
    capsules: 21,
    category: 'Project Management'
  },
  {
    id: 'calendar',
    name: 'AI Smart Calendar',
    description: 'AI calendar with voice events, smart scheduling, and meeting summaries',
    icon: '📅',
    complexity: 'advanced',
    capsules: 22,
    category: 'Productivity'
  },
  {
    id: 'aiAssistant',
    name: 'AI Personal Assistant',
    description: 'Full-featured AI assistant with voice, chat, and image generation',
    icon: '🤖',
    complexity: 'advanced',
    capsules: 12,
    category: 'AI & ML'
  },
  {
    id: 'socialMedia',
    name: 'AI Social Media Manager',
    description: 'Create optimized social content with AI captions, images, and hashtags',
    icon: '📱',
    complexity: 'advanced',
    capsules: 14,
    category: 'Marketing'
  },
  {
    id: 'contentStudio',
    name: 'AI Content Studio',
    description: 'Complete content suite for blogs, videos, podcasts, and newsletters',
    icon: '🎬',
    complexity: 'advanced',
    capsules: 13,
    category: 'Content'
  },
  {
    id: 'imageStudio',
    name: 'AI Image Studio',
    description: 'Professional image generation and editing with multiple AI models',
    icon: '🎨',
    complexity: 'advanced',
    capsules: 19,
    category: 'Design'
  },
  {
    id: 'voiceStudio',
    name: 'AI Voice Studio',
    description: 'Voice-powered apps with STT, TTS, and audio processing',
    icon: '🎙️',
    complexity: 'advanced',
    capsules: 15,
    category: 'Audio'
  }
]

/**
 * Get template by ID
 */
export function getTemplate(id: string): CapsuleComposition | null {
  return APP_TEMPLATES[id as keyof typeof APP_TEMPLATES] || null
}

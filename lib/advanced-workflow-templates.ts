/**
 * Advanced Workflow Templates
 * 10 production-ready workflows using the full 8,500+ capsule library
 */

export interface AdvancedWorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  nodes: Array<{
    id: string
    type: 'capsule'
    capsuleId: string
    label: string
    x: number
    y: number
    inputs: Record<string, any>
  }>
  connections: Array<{
    id: string
    from: string
    to: string
    fromPort: string
    toPort: string
  }>
  estimatedTime?: string
  useCases?: string[]
}

export const ADVANCED_WORKFLOW_TEMPLATES: AdvancedWorkflowTemplate[] = [
  {
    id: 'ai-content-pipeline',
    name: 'AI Content Generation Pipeline',
    description: 'Complete AI-powered content creation workflow with GPT-4, image generation, and publishing',
    category: 'AI/ML',
    icon: '🤖',
    difficulty: 'advanced',
    estimatedTime: '30-45 min',
    useCases: ['Blog automation', 'Social media content', 'Marketing materials'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'input-text', label: 'Topic Input', x: 100, y: 150, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'ai-text-generation', label: 'GPT-4 Content', x: 400, y: 150, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'ai-image-generation', label: 'DALL-E Image', x: 400, y: 300, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'markdown-editor', label: 'Format Content', x: 700, y: 150, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'cms-publish', label: 'Publish to CMS', x: 1000, y: 150, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'social-share', label: 'Share Social', x: 1000, y: 300, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'analytics-track', label: 'Track Analytics', x: 1300, y: 225, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-1', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-3', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-4', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-4', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-5', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-8', from: 'node-6', to: 'node-7', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'ecommerce-full-stack',
    name: 'Full-Stack E-commerce Flow',
    description: 'Complete e-commerce workflow: product browse → cart → payment → fulfillment → analytics',
    category: 'E-commerce',
    icon: '🛒',
    difficulty: 'advanced',
    estimatedTime: '45-60 min',
    useCases: ['Online store', 'Marketplace', 'B2B commerce'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'product-grid', label: 'Product Catalog', x: 100, y: 200, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'search-filter', label: 'Search & Filter', x: 100, y: 50, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'shopping-cart', label: 'Shopping Cart', x: 400, y: 125, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'checkout-form', label: 'Checkout', x: 700, y: 125, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'payment-stripe', label: 'Stripe Payment', x: 1000, y: 125, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'order-confirmation', label: 'Order Confirmation', x: 1300, y: 50, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'email-receipt', label: 'Email Receipt', x: 1300, y: 200, inputs: {} },
      { id: 'node-8', type: 'capsule', capsuleId: 'inventory-update', label: 'Update Inventory', x: 1600, y: 125, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-2', to: 'node-1', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-1', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-3', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-4', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-5', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-5', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-5', to: 'node-8', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'real-time-analytics',
    name: 'Real-Time Analytics Dashboard',
    description: 'Live data pipeline with websockets, data processing, visualization, and alerting',
    category: 'Data & Analytics',
    icon: '📊',
    difficulty: 'advanced',
    estimatedTime: '40-50 min',
    useCases: ['IoT monitoring', 'Business metrics', 'System health'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'websocket-stream', label: 'WebSocket Stream', x: 100, y: 200, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'data-validator', label: 'Validate Data', x: 400, y: 200, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'data-transform', label: 'Transform', x: 700, y: 100, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'timeseries-db', label: 'TimescaleDB', x: 700, y: 300, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'chart-line', label: 'Line Chart', x: 1000, y: 50, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'chart-bar', label: 'Bar Chart', x: 1000, y: 200, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'kpi-card', label: 'KPI Cards', x: 1000, y: 350, inputs: {} },
      { id: 'node-8', type: 'capsule', capsuleId: 'alert-threshold', label: 'Alert Check', x: 1300, y: 200, inputs: {} },
      { id: 'node-9', type: 'capsule', capsuleId: 'notification-push', label: 'Send Alert', x: 1600, y: 200, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-2', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-3', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-3', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-3', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-3', to: 'node-8', fromPort: 'output', toPort: 'input' },
      { id: 'conn-8', from: 'node-8', to: 'node-9', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'video-streaming-platform',
    name: 'Video Streaming Platform',
    description: 'Complete video platform with upload, transcoding, CDN, player, and analytics',
    category: 'Media',
    icon: '🎬',
    difficulty: 'advanced',
    estimatedTime: '50-70 min',
    useCases: ['Video courses', 'Live streaming', 'Content platform'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'file-upload', label: 'Video Upload', x: 100, y: 200, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'video-transcode', label: 'FFmpeg Transcode', x: 400, y: 200, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'cdn-upload', label: 'CDN Upload', x: 700, y: 100, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'thumbnail-gen', label: 'Generate Thumbnail', x: 700, y: 300, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'video-player', label: 'Video Player', x: 1000, y: 100, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'subtitles-editor', label: 'Subtitles', x: 1000, y: 250, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'video-analytics', label: 'View Analytics', x: 1300, y: 175, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-2', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-3', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-4', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-5', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-5', to: 'node-7', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'ml-training-pipeline',
    name: 'ML Model Training Pipeline',
    description: 'End-to-end ML workflow: data prep → training → validation → deployment → monitoring',
    category: 'Machine Learning',
    icon: '🧠',
    difficulty: 'advanced',
    estimatedTime: '60-90 min',
    useCases: ['Predictive analytics', 'Image classification', 'NLP models'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'dataset-loader', label: 'Load Dataset', x: 100, y: 250, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'data-cleaning', label: 'Clean Data', x: 400, y: 250, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'feature-engineering', label: 'Feature Engineering', x: 700, y: 150, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'train-test-split', label: 'Split Data', x: 700, y: 350, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'model-training', label: 'Train Model', x: 1000, y: 150, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'model-validation', label: 'Validate Model', x: 1000, y: 350, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'model-deployment', label: 'Deploy Model', x: 1300, y: 250, inputs: {} },
      { id: 'node-8', type: 'capsule', capsuleId: 'model-monitoring', label: 'Monitor Performance', x: 1600, y: 250, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-2', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-3', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-4', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-5', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-6', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-8', from: 'node-7', to: 'node-8', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'devops-ci-cd',
    name: 'DevOps CI/CD Pipeline',
    description: 'Complete CI/CD workflow with testing, building, deployment, and monitoring',
    category: 'DevOps',
    icon: '⚙️',
    difficulty: 'advanced',
    estimatedTime: '40-60 min',
    useCases: ['Automated deployment', 'Continuous delivery', 'Release automation'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'git-webhook', label: 'Git Webhook', x: 100, y: 250, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'code-checkout', label: 'Checkout Code', x: 400, y: 250, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'run-tests', label: 'Run Tests', x: 700, y: 150, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'build-docker', label: 'Build Docker', x: 700, y: 350, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'push-registry', label: 'Push to Registry', x: 1000, y: 350, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'deploy-k8s', label: 'Deploy to K8s', x: 1300, y: 250, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'smoke-tests', label: 'Smoke Tests', x: 1600, y: 150, inputs: {} },
      { id: 'node-8', type: 'capsule', capsuleId: 'slack-notify', label: 'Notify Team', x: 1600, y: 350, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-2', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-4', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-3', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-5', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-6', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-8', from: 'node-6', to: 'node-8', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'blockchain-dapp',
    name: 'Blockchain DApp Workflow',
    description: 'Web3 decentralized app with wallet, smart contract, NFT, and crypto payments',
    category: 'Blockchain',
    icon: '⛓️',
    difficulty: 'advanced',
    estimatedTime: '45-60 min',
    useCases: ['NFT marketplace', 'DeFi protocol', 'DAO governance'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'wallet-connect', label: 'Connect Wallet', x: 100, y: 200, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'nft-gallery', label: 'NFT Gallery', x: 400, y: 100, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'smart-contract', label: 'Smart Contract', x: 400, y: 300, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'token-swap', label: 'Token Swap', x: 700, y: 200, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'transaction-sign', label: 'Sign Transaction', x: 1000, y: 200, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'blockchain-submit', label: 'Submit to Chain', x: 1300, y: 200, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'transaction-track', label: 'Track Status', x: 1600, y: 200, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-1', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-3', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-4', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-5', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-6', to: 'node-7', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'social-media-automation',
    name: 'Social Media Automation Hub',
    description: 'Multi-platform social media scheduler with content creation, posting, and analytics',
    category: 'Marketing',
    icon: '📱',
    difficulty: 'intermediate',
    estimatedTime: '30-40 min',
    useCases: ['Content scheduling', 'Multi-channel posting', 'Social analytics'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'content-calendar', label: 'Content Calendar', x: 100, y: 250, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'ai-caption-gen', label: 'AI Caption', x: 400, y: 150, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'image-editor', label: 'Edit Image', x: 400, y: 350, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'post-twitter', label: 'Post Twitter', x: 700, y: 100, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'post-instagram', label: 'Post Instagram', x: 700, y: 250, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'post-linkedin', label: 'Post LinkedIn', x: 700, y: 400, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'social-analytics', label: 'Track Engagement', x: 1000, y: 250, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-1', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-2', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-2', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-3', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-4', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-8', from: 'node-5', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-9', from: 'node-6', to: 'node-7', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'iot-smart-home',
    name: 'IoT Smart Home System',
    description: 'Smart home automation with sensors, devices, rules engine, and voice control',
    category: 'IoT',
    icon: '🏠',
    difficulty: 'intermediate',
    estimatedTime: '35-50 min',
    useCases: ['Home automation', 'Energy management', 'Security system'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'sensor-dashboard', label: 'Sensor Dashboard', x: 100, y: 250, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'temperature-sensor', label: 'Temperature', x: 400, y: 100, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'motion-sensor', label: 'Motion', x: 400, y: 250, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'door-sensor', label: 'Door/Window', x: 400, y: 400, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'automation-rules', label: 'Rules Engine', x: 700, y: 250, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'smart-light', label: 'Control Lights', x: 1000, y: 150, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'smart-thermostat', label: 'Control HVAC', x: 1000, y: 350, inputs: {} },
      { id: 'node-8', type: 'capsule', capsuleId: 'voice-control', label: 'Voice Assistant', x: 1300, y: 250, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-1', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-1', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-2', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-3', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-4', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-5', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-8', from: 'node-5', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-9', from: 'node-6', to: 'node-8', fromPort: 'output', toPort: 'input' },
      { id: 'conn-10', from: 'node-7', to: 'node-8', fromPort: 'output', toPort: 'input' }
    ]
  },
  {
    id: 'customer-support-ai',
    name: 'AI-Powered Support System',
    description: 'Intelligent customer support with chatbot, ticketing, knowledge base, and escalation',
    category: 'Customer Support',
    icon: '💬',
    difficulty: 'intermediate',
    estimatedTime: '30-45 min',
    useCases: ['Help desk', 'Live chat', 'Support automation'],
    nodes: [
      { id: 'node-1', type: 'capsule', capsuleId: 'chat-widget', label: 'Chat Widget', x: 100, y: 250, inputs: {} },
      { id: 'node-2', type: 'capsule', capsuleId: 'ai-chatbot', label: 'AI Chatbot', x: 400, y: 250, inputs: {} },
      { id: 'node-3', type: 'capsule', capsuleId: 'kb-search', label: 'Knowledge Base', x: 400, y: 100, inputs: {} },
      { id: 'node-4', type: 'capsule', capsuleId: 'sentiment-analysis', label: 'Sentiment Check', x: 700, y: 250, inputs: {} },
      { id: 'node-5', type: 'capsule', capsuleId: 'ticket-creation', label: 'Create Ticket', x: 1000, y: 150, inputs: {} },
      { id: 'node-6', type: 'capsule', capsuleId: 'agent-handoff', label: 'Agent Handoff', x: 1000, y: 350, inputs: {} },
      { id: 'node-7', type: 'capsule', capsuleId: 'feedback-survey', label: 'Collect Feedback', x: 1300, y: 250, inputs: {} }
    ],
    connections: [
      { id: 'conn-1', from: 'node-1', to: 'node-2', fromPort: 'output', toPort: 'input' },
      { id: 'conn-2', from: 'node-2', to: 'node-3', fromPort: 'output', toPort: 'input' },
      { id: 'conn-3', from: 'node-2', to: 'node-4', fromPort: 'output', toPort: 'input' },
      { id: 'conn-4', from: 'node-4', to: 'node-5', fromPort: 'output', toPort: 'input' },
      { id: 'conn-5', from: 'node-4', to: 'node-6', fromPort: 'output', toPort: 'input' },
      { id: 'conn-6', from: 'node-5', to: 'node-7', fromPort: 'output', toPort: 'input' },
      { id: 'conn-7', from: 'node-6', to: 'node-7', fromPort: 'output', toPort: 'input' }
    ]
  }
]

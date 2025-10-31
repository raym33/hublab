import type { CapsuleComposition } from './types'

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: 'starter' | 'ai' | 'api' | 'fullstack' | 'automation'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  composition: CapsuleComposition
  requiredEnvVars?: string[]
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    description: 'Simple starter workflow to get you familiar with the Studio',
    category: 'starter',
    difficulty: 'beginner',
    icon: '👋',
    composition: {
      id: 'hello-world-template',
      name: 'Hello World',
      version: '1.0.0',
      platform: 'web',
      nodes: [
        {
          id: 'node-1',
          capsuleId: 'input-text',
          version: '1.0.0',
          config: {
            placeholder: 'Enter your name'
          }
        },
        {
          id: 'node-2',
          capsuleId: 'button-primary',
          version: '1.0.0',
          config: {
            label: 'Say Hello'
          }
        },
        {
          id: 'node-3',
          capsuleId: 'logger',
          version: '1.0.0',
          config: {
            level: 'info'
          }
        }
      ],
      connections: [
        {
          from: 'node-1',
          to: 'node-2',
          outputKey: 'value',
          inputKey: 'data'
        },
        {
          from: 'node-2',
          to: 'node-3',
          outputKey: 'click',
          inputKey: 'message'
        }
      ],
      entrypoint: 'node-1'
    }
  },
  {
    id: 'todo-app',
    name: 'Todo App',
    description: 'Full-featured todo application with local storage',
    category: 'fullstack',
    difficulty: 'beginner',
    icon: '✅',
    composition: {
      id: 'todo-app-template',
      name: 'Todo App',
      version: '1.0.0',
      platform: 'web',
      nodes: [
        {
          id: 'node-1',
          capsuleId: 'app-container',
          version: '1.0.0',
          config: {
            title: 'My Todo App'
          }
        },
        {
          id: 'node-2',
          capsuleId: 'input-text',
          version: '1.0.0',
          config: {
            placeholder: 'Add a new todo...'
          }
        },
        {
          id: 'node-3',
          capsuleId: 'button-primary',
          version: '1.0.0',
          config: {
            label: 'Add'
          }
        },
        {
          id: 'node-4',
          capsuleId: 'list-view',
          version: '1.0.0',
          config: {}
        },
        {
          id: 'node-5',
          capsuleId: 'database-local',
          version: '1.0.0',
          config: {
            storeName: 'todos'
          }
        }
      ],
      connections: [
        {
          from: 'node-1',
          to: 'node-2',
          outputKey: 'render',
          inputKey: 'parent'
        },
        {
          from: 'node-2',
          to: 'node-3',
          outputKey: 'value',
          inputKey: 'data'
        },
        {
          from: 'node-3',
          to: 'node-5',
          outputKey: 'click',
          inputKey: 'data'
        },
        {
          from: 'node-5',
          to: 'node-4',
          outputKey: 'data',
          inputKey: 'items'
        }
      ],
      entrypoint: 'node-1'
    }
  },
  {
    id: 'ai-chat',
    name: 'AI Chat Interface',
    description: 'ChatGPT-style interface with message history',
    category: 'ai',
    difficulty: 'intermediate',
    icon: '💬',
    requiredEnvVars: ['OPENAI_API_KEY'],
    composition: {
      id: 'ai-chat-template',
      name: 'AI Chat',
      version: '1.0.0',
      platform: 'web',
      nodes: [
        {
          id: 'node-1',
          capsuleId: 'app-container',
          version: '1.0.0',
          config: {
            title: 'AI Chat'
          }
        },
        {
          id: 'node-2',
          capsuleId: 'chat-interface',
          version: '1.0.0',
          config: {}
        },
        {
          id: 'node-3',
          capsuleId: 'openai-chat',
          version: '1.0.0',
          config: {
            model: 'gpt-4',
            temperature: 0.7
          }
        },
        {
          id: 'node-4',
          capsuleId: 'database-local',
          version: '1.0.0',
          config: {
            storeName: 'chat-history'
          }
        }
      ],
      connections: [
        {
          from: 'node-1',
          to: 'node-2',
          outputKey: 'render',
          inputKey: 'parent'
        },
        {
          from: 'node-2',
          to: 'node-3',
          outputKey: 'message',
          inputKey: 'prompt'
        },
        {
          from: 'node-3',
          to: 'node-2',
          outputKey: 'response',
          inputKey: 'reply'
        },
        {
          from: 'node-2',
          to: 'node-4',
          outputKey: 'history',
          inputKey: 'data'
        }
      ],
      entrypoint: 'node-1'
    }
  },
  {
    id: 'api-dashboard',
    name: 'API Dashboard',
    description: 'Monitor and visualize API data in real-time',
    category: 'api',
    difficulty: 'intermediate',
    icon: '📊',
    composition: {
      id: 'api-dashboard-template',
      name: 'API Dashboard',
      version: '1.0.0',
      platform: 'web',
      nodes: [
        {
          id: 'node-1',
          capsuleId: 'app-container',
          version: '1.0.0',
          config: {
            title: 'API Dashboard'
          }
        },
        {
          id: 'node-2',
          capsuleId: 'http-request',
          version: '1.0.0',
          config: {
            method: 'GET',
            interval: 5000
          }
        },
        {
          id: 'node-3',
          capsuleId: 'transformer',
          version: '1.0.0',
          config: {}
        },
        {
          id: 'node-4',
          capsuleId: 'chart-line',
          version: '1.0.0',
          config: {}
        },
        {
          id: 'node-5',
          capsuleId: 'logger',
          version: '1.0.0',
          config: {
            level: 'info'
          }
        }
      ],
      connections: [
        {
          from: 'node-1',
          to: 'node-4',
          outputKey: 'render',
          inputKey: 'parent'
        },
        {
          from: 'node-2',
          to: 'node-3',
          outputKey: 'data',
          inputKey: 'input'
        },
        {
          from: 'node-3',
          to: 'node-4',
          outputKey: 'output',
          inputKey: 'data'
        },
        {
          from: 'node-2',
          to: 'node-5',
          outputKey: 'error',
          inputKey: 'message'
        }
      ],
      entrypoint: 'node-1'
    }
  },
  {
    id: 'email-automation',
    name: 'Email Automation',
    description: 'Automated email sending with validation and logging',
    category: 'automation',
    difficulty: 'intermediate',
    icon: '📧',
    requiredEnvVars: ['RESEND_API_KEY'],
    composition: {
      id: 'email-automation-template',
      name: 'Email Automation',
      version: '1.0.0',
      platform: 'web',
      nodes: [
        {
          id: 'node-1',
          capsuleId: 'webhook',
          version: '1.0.0',
          config: {
            path: '/send-email'
          }
        },
        {
          id: 'node-2',
          capsuleId: 'validator',
          version: '1.0.0',
          config: {
            schema: 'email'
          }
        },
        {
          id: 'node-3',
          capsuleId: 'resend',
          version: '1.0.0',
          config: {
            from: 'onboarding@resend.dev'
          }
        },
        {
          id: 'node-4',
          capsuleId: 'logger',
          version: '1.0.0',
          config: {
            level: 'info'
          }
        },
        {
          id: 'node-5',
          capsuleId: 'database-postgres',
          version: '1.0.0',
          config: {
            table: 'email_logs'
          }
        }
      ],
      connections: [
        {
          from: 'node-1',
          to: 'node-2',
          outputKey: 'data',
          inputKey: 'data'
        },
        {
          from: 'node-2',
          to: 'node-3',
          outputKey: 'valid',
          inputKey: 'data'
        },
        {
          from: 'node-3',
          to: 'node-4',
          outputKey: 'result',
          inputKey: 'message'
        },
        {
          from: 'node-3',
          to: 'node-5',
          outputKey: 'result',
          inputKey: 'data'
        }
      ],
      entrypoint: 'node-1'
    }
  },
  {
    id: 'payment-flow',
    name: 'Payment Processing',
    description: 'Secure payment flow with Stripe and notifications',
    category: 'fullstack',
    difficulty: 'advanced',
    icon: '💳',
    requiredEnvVars: ['STRIPE_SECRET_KEY', 'RESEND_API_KEY'],
    composition: {
      id: 'payment-flow-template',
      name: 'Payment Flow',
      version: '1.0.0',
      platform: 'web',
      nodes: [
        {
          id: 'node-1',
          capsuleId: 'webhook',
          version: '1.0.0',
          config: {
            path: '/payment'
          }
        },
        {
          id: 'node-2',
          capsuleId: 'validator',
          version: '1.0.0',
          config: {
            schema: 'payment'
          }
        },
        {
          id: 'node-3',
          capsuleId: 'stripe-payment',
          version: '1.0.0',
          config: {}
        },
        {
          id: 'node-4',
          capsuleId: 'router',
          version: '1.0.0',
          config: {
            routes: ['success', 'error']
          }
        },
        {
          id: 'node-5',
          capsuleId: 'resend',
          version: '1.0.0',
          config: {
            from: 'receipts@company.com'
          }
        },
        {
          id: 'node-6',
          capsuleId: 'database-postgres',
          version: '1.0.0',
          config: {
            table: 'transactions'
          }
        },
        {
          id: 'node-7',
          capsuleId: 'logger',
          version: '1.0.0',
          config: {
            level: 'error'
          }
        }
      ],
      connections: [
        {
          from: 'node-1',
          to: 'node-2',
          outputKey: 'data',
          inputKey: 'data'
        },
        {
          from: 'node-2',
          to: 'node-3',
          outputKey: 'valid',
          inputKey: 'payment'
        },
        {
          from: 'node-3',
          to: 'node-4',
          outputKey: 'result',
          inputKey: 'data'
        },
        {
          from: 'node-4',
          to: 'node-5',
          outputKey: 'success',
          inputKey: 'data'
        },
        {
          from: 'node-4',
          to: 'node-7',
          outputKey: 'error',
          inputKey: 'message'
        },
        {
          from: 'node-5',
          to: 'node-6',
          outputKey: 'result',
          inputKey: 'data'
        }
      ],
      entrypoint: 'node-1'
    }
  },
  {
    id: 'image-processor',
    name: 'Image Processing Pipeline',
    description: 'Upload, process, and optimize images automatically',
    category: 'automation',
    difficulty: 'advanced',
    icon: '🖼️',
    requiredEnvVars: ['CLOUDINARY_API_KEY', 'AWS_ACCESS_KEY'],
    composition: {
      id: 'image-processor-template',
      name: 'Image Processor',
      version: '1.0.0',
      platform: 'web',
      nodes: [
        {
          id: 'node-1',
          capsuleId: 'file-upload',
          version: '1.0.0',
          config: {
            accept: 'image/*',
            maxSize: 10485760
          }
        },
        {
          id: 'node-2',
          capsuleId: 'validator',
          version: '1.0.0',
          config: {
            schema: 'image'
          }
        },
        {
          id: 'node-3',
          capsuleId: 'image-optimizer',
          version: '1.0.0',
          config: {
            quality: 80,
            format: 'webp'
          }
        },
        {
          id: 'node-4',
          capsuleId: 'cloudinary',
          version: '1.0.0',
          config: {
            folder: 'uploads'
          }
        },
        {
          id: 'node-5',
          capsuleId: 's3-upload',
          version: '1.0.0',
          config: {
            bucket: 'images'
          }
        },
        {
          id: 'node-6',
          capsuleId: 'database-postgres',
          version: '1.0.0',
          config: {
            table: 'images'
          }
        }
      ],
      connections: [
        {
          from: 'node-1',
          to: 'node-2',
          outputKey: 'file',
          inputKey: 'data'
        },
        {
          from: 'node-2',
          to: 'node-3',
          outputKey: 'valid',
          inputKey: 'image'
        },
        {
          from: 'node-3',
          to: 'node-4',
          outputKey: 'optimized',
          inputKey: 'file'
        },
        {
          from: 'node-3',
          to: 'node-5',
          outputKey: 'optimized',
          inputKey: 'file'
        },
        {
          from: 'node-4',
          to: 'node-6',
          outputKey: 'url',
          inputKey: 'data'
        }
      ],
      entrypoint: 'node-1'
    }
  }
]

export function getTemplatesByCategory(category: WorkflowTemplate['category']) {
  return WORKFLOW_TEMPLATES.filter(t => t.category === category)
}

export function getTemplatesByDifficulty(difficulty: WorkflowTemplate['difficulty']) {
  return WORKFLOW_TEMPLATES.filter(t => t.difficulty === difficulty)
}

export function getTemplateById(id: string) {
  return WORKFLOW_TEMPLATES.find(t => t.id === id)
}

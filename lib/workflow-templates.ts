import { CLAUDE_SELF_IMPROVEMENT_WORKFLOWS } from './claude-self-improvement-workflow'
import { PRODUCTION_WORKFLOWS } from './production-workflows'

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  nodes: Array<{
    id: string
    capsuleId: string
    position: { x: number; y: number }
    config: Record<string, any>
  }>
  edges: Array<{
    source: string
    target: string
  }>
  envVars: string[]
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'email-automation',
    name: 'Email Automation',
    description: 'Receive webhook, validate data, send personalized email',
    category: 'communication',
    nodes: [
      {
        id: 'webhook-1',
        capsuleId: 'webhook',
        position: { x: 100, y: 100 },
        config: {
          method: 'POST',
          path: '/api/webhook/contact',
          authentication: 'none'
        }
      },
      {
        id: 'validator-1',
        capsuleId: 'validator',
        position: { x: 350, y: 100 },
        config: {
          schema: 'z.object({ email: z.string().email(), name: z.string() })',
          data: '{{ webhook-1.body }}'
        }
      },
      {
        id: 'email-1',
        capsuleId: 'email',
        position: { x: 600, y: 100 },
        config: {
          provider: 'resend',
          apiKey: '${RESEND_API_KEY}',
          from: 'noreply@yourapp.com',
          to: '{{ validator-1.data.email }}',
          subject: 'Welcome {{ validator-1.data.name }}!',
          body: '<h1>Welcome to our app!</h1><p>Hi {{ validator-1.data.name }}, thanks for signing up.</p>'
        }
      },
      {
        id: 'logger-1',
        capsuleId: 'logger',
        position: { x: 850, y: 100 },
        config: {
          level: 'info',
          message: 'Email sent successfully',
          metadata: '{{ email-1 }}'
        }
      }
    ],
    edges: [
      { source: 'webhook-1', target: 'validator-1' },
      { source: 'validator-1', target: 'email-1' },
      { source: 'email-1', target: 'logger-1' }
    ],
    envVars: ['RESEND_API_KEY']
  },
  {
    id: 'ai-content-pipeline',
    name: 'AI Content Pipeline',
    description: 'Generate AI content, convert to PDF, send via email',
    category: 'ai',
    nodes: [
      {
        id: 'webhook-1',
        capsuleId: 'webhook',
        position: { x: 100, y: 150 },
        config: {
          method: 'POST',
          path: '/api/generate-report',
          authentication: 'bearer'
        }
      },
      {
        id: 'ai-chat-1',
        capsuleId: 'ai-chat',
        position: { x: 350, y: 150 },
        config: {
          provider: 'openai',
          apiKey: '${OPENAI_API_KEY}',
          model: 'gpt-4',
          prompt: 'Generate a detailed report about: {{ webhook-1.body.topic }}',
          systemPrompt: 'You are a professional report writer.',
          temperature: 0.7,
          maxTokens: 2000
        }
      },
      {
        id: 'markdown-1',
        capsuleId: 'markdown',
        position: { x: 600, y: 150 },
        config: {
          markdown: '{{ ai-chat-1.response }}',
          sanitize: true
        }
      },
      {
        id: 'pdf-1',
        capsuleId: 'pdf',
        position: { x: 850, y: 150 },
        config: {
          html: '{{ markdown-1.html }}',
          filename: 'report-{{ Date.now() }}.pdf',
          format: 'A4'
        }
      },
      {
        id: 'email-1',
        capsuleId: 'email',
        position: { x: 1100, y: 150 },
        config: {
          provider: 'sendgrid',
          apiKey: '${SENDGRID_API_KEY}',
          from: 'reports@yourapp.com',
          to: '{{ webhook-1.body.email }}',
          subject: 'Your Report is Ready',
          body: '<p>Please find your report attached.</p>'
        }
      }
    ],
    edges: [
      { source: 'webhook-1', target: 'ai-chat-1' },
      { source: 'ai-chat-1', target: 'markdown-1' },
      { source: 'markdown-1', target: 'pdf-1' },
      { source: 'pdf-1', target: 'email-1' }
    ],
    envVars: ['OPENAI_API_KEY', 'SENDGRID_API_KEY']
  },
  {
    id: 'api-integration',
    name: 'API Integration & Cache',
    description: 'Fetch external API, cache results, transform data',
    category: 'workflow',
    nodes: [
      {
        id: 'webhook-1',
        capsuleId: 'webhook',
        position: { x: 100, y: 200 },
        config: {
          method: 'GET',
          path: '/api/users/:id',
          authentication: 'apikey'
        }
      },
      {
        id: 'cache-1',
        capsuleId: 'cache',
        position: { x: 350, y: 200 },
        config: {
          provider: 'redis',
          key: 'user-{{ webhook-1.params.id }}',
          operation: 'get',
          ttl: 3600
        }
      },
      {
        id: 'http-1',
        capsuleId: 'http',
        position: { x: 350, y: 350 },
        config: {
          method: 'GET',
          url: 'https://api.github.com/users/{{ webhook-1.params.id }}',
          headers: '{ "Authorization": "Bearer ${GITHUB_TOKEN}" }',
          timeout: 5000
        }
      },
      {
        id: 'transformer-1',
        capsuleId: 'transformer',
        position: { x: 600, y: 350 },
        config: {
          input: '{{ http-1.response }}',
          code: 'return { id: input.id, name: input.name, repos: input.public_repos, followers: input.followers }'
        }
      },
      {
        id: 'cache-2',
        capsuleId: 'cache',
        position: { x: 850, y: 350 },
        config: {
          provider: 'redis',
          key: 'user-{{ webhook-1.params.id }}',
          value: '{{ transformer-1.output }}',
          operation: 'set',
          ttl: 3600
        }
      }
    ],
    edges: [
      { source: 'webhook-1', target: 'cache-1' },
      { source: 'cache-1', target: 'http-1' },
      { source: 'http-1', target: 'transformer-1' },
      { source: 'transformer-1', target: 'cache-2' }
    ],
    envVars: ['GITHUB_TOKEN', 'REDIS_URL']
  },
  {
    id: 'payment-notification',
    name: 'Payment + Notification',
    description: 'Process payment, send SMS confirmation, log transaction',
    category: 'payments',
    nodes: [
      {
        id: 'webhook-1',
        capsuleId: 'webhook',
        position: { x: 100, y: 100 },
        config: {
          method: 'POST',
          path: '/api/checkout',
          authentication: 'bearer'
        }
      },
      {
        id: 'validator-1',
        capsuleId: 'validator',
        position: { x: 350, y: 100 },
        config: {
          schema: 'z.object({ amount: z.number().positive(), phone: z.string() })',
          data: '{{ webhook-1.body }}'
        }
      },
      {
        id: 'payments-1',
        capsuleId: 'payments',
        position: { x: 600, y: 100 },
        config: {
          provider: 'stripe',
          apiKey: '${STRIPE_SECRET_KEY}',
          amount: '{{ validator-1.data.amount }}',
          currency: 'usd',
          description: 'Order payment'
        }
      },
      {
        id: 'sms-1',
        capsuleId: 'sms',
        position: { x: 850, y: 100 },
        config: {
          accountSid: '${TWILIO_ACCOUNT_SID}',
          authToken: '${TWILIO_AUTH_TOKEN}',
          from: '+1234567890',
          to: '{{ validator-1.data.phone }}',
          message: 'Payment successful! Amount: {{ validator-1.data.amount }}'
        }
      },
      {
        id: 'database-1',
        capsuleId: 'database',
        position: { x: 1100, y: 100 },
        config: {
          provider: 'postgresql',
          connectionString: '${DATABASE_URL}',
          query: 'INSERT INTO transactions (payment_id, amount, status) VALUES ($1, $2, $3)',
          params: '[{{ payments-1.paymentIntent.id }}, {{ validator-1.data.amount }}, "completed"]'
        }
      }
    ],
    edges: [
      { source: 'webhook-1', target: 'validator-1' },
      { source: 'validator-1', target: 'payments-1' },
      { source: 'payments-1', target: 'sms-1' },
      { source: 'sms-1', target: 'database-1' }
    ],
    envVars: ['STRIPE_SECRET_KEY', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'DATABASE_URL']
  },
  {
    id: 'rate-limited-api',
    name: 'Rate Limited API',
    description: 'API endpoint with rate limiting and error handling',
    category: 'security',
    nodes: [
      {
        id: 'webhook-1',
        capsuleId: 'webhook',
        position: { x: 100, y: 150 },
        config: {
          method: 'POST',
          path: '/api/data',
          authentication: 'apikey'
        }
      },
      {
        id: 'rate-limiter-1',
        capsuleId: 'rate-limiter',
        position: { x: 350, y: 150 },
        config: {
          identifier: '{{ webhook-1.headers["x-api-key"] }}',
          maxRequests: 100,
          windowMs: 60000
        }
      },
      {
        id: 'validator-1',
        capsuleId: 'validator',
        position: { x: 600, y: 150 },
        config: {
          schema: 'z.object({ data: z.string() })',
          data: '{{ webhook-1.body }}'
        }
      },
      {
        id: 'database-1',
        capsuleId: 'database',
        position: { x: 850, y: 150 },
        config: {
          provider: 'postgresql',
          connectionString: '${DATABASE_URL}',
          query: 'INSERT INTO data (content) VALUES ($1) RETURNING *',
          params: '[{{ validator-1.data.data }}]'
        }
      },
      {
        id: 'logger-1',
        capsuleId: 'logger',
        position: { x: 1100, y: 150 },
        config: {
          level: 'info',
          message: 'Data inserted successfully',
          metadata: '{{ database-1 }}'
        }
      }
    ],
    edges: [
      { source: 'webhook-1', target: 'rate-limiter-1' },
      { source: 'rate-limiter-1', target: 'validator-1' },
      { source: 'validator-1', target: 'database-1' },
      { source: 'database-1', target: 'logger-1' }
    ],
    envVars: ['DATABASE_URL']
  },

  // 🤖 CLAUDE SELF-IMPROVEMENT WORKFLOWS
  ...CLAUDE_SELF_IMPROVEMENT_WORKFLOWS,

  // 🏭 PRODUCTION-GRADE WORKFLOWS
  ...PRODUCTION_WORKFLOWS
]

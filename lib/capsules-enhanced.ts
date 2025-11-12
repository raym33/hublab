import { DataType, InputPort, OutputPort } from './capsules-types'
import { CapsuleCategory, CapsuleField } from './capsules-config'

export interface EnhancedCapsule {
  id: string
  name: string
  category: CapsuleCategory
  icon: string
  color: string
  description: string
  configFields: CapsuleField[]
  inputPorts: InputPort[]
  outputPorts: OutputPort[]
  npmPackage?: string
  documentation?: string
  codeTemplate?: string  // Template for code generation
}

export const ENHANCED_CAPSULES: EnhancedCapsule[] = [
  // Workflow Entry Points
  {
    id: 'webhook',
    name: 'Webhook',
    category: 'workflow',
    icon: '🪝',
    color: '#6366F1',
    description: 'HTTP webhook trigger',
    configFields: [
      { name: 'method', type: 'select', required: true, description: 'HTTP method', options: ['GET', 'POST', 'PUT', 'DELETE'] },
      { name: 'path', type: 'string', required: true, description: 'Webhook path', placeholder: '/api/webhook' },
    ],
    inputPorts: [],  // Entry point, no inputs
    outputPorts: [
      { id: 'body', name: 'Body', type: 'object', description: 'Request body' },
      { id: 'headers', name: 'Headers', type: 'object', description: 'Request headers' },
      { id: 'query', name: 'Query', type: 'object', description: 'Query parameters' },
    ],
    codeTemplate: `// Webhook handler
app.post('{{config.path}}', async (req, res) => {
  const body = req.body
  const headers = req.headers
  const query = req.query

  // Next node gets: { body, headers, query }
})`
  },

  // Data Validation
  {
    id: 'validator',
    name: 'Validator',
    category: 'workflow',
    icon: '✅',
    color: '#6366F1',
    description: 'Validate data with schemas',
    configFields: [
      { name: 'schema', type: 'textarea', required: true, description: 'Zod schema', placeholder: 'z.object({ email: z.string().email() })' },
    ],
    inputPorts: [
      { id: 'data', name: 'Data', type: ['any', 'object'], required: true, description: 'Data to validate' },
    ],
    outputPorts: [
      { id: 'data', name: 'Valid Data', type: 'object', description: 'Validated data' },
      { id: 'valid', name: 'Is Valid', type: 'boolean', description: 'Validation result' },
      { id: 'errors', name: 'Errors', type: 'error', description: 'Validation errors if any' },
    ],
    npmPackage: 'zod',
    documentation: 'https://zod.dev/',
    codeTemplate: `const schema = {{config.schema}}
const result = schema.safeParse(prevOutput)
if (!result.success) {
  throw new Error(result.error.message)
}
const validData = result.data`
  },

  // HTTP Request
  {
    id: 'http',
    name: 'HTTP Request',
    category: 'workflow',
    icon: '🌐',
    color: '#6366F1',
    description: 'Make HTTP API calls',
    configFields: [
      { name: 'method', type: 'select', required: true, description: 'HTTP method', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
      { name: 'url', type: 'string', required: true, description: 'URL', placeholder: 'https://api.example.com/users' },
      { name: 'headers', type: 'textarea', required: false, description: 'Headers (JSON)', placeholder: '{ "Authorization": "Bearer xxx" }' },
      { name: 'body', type: 'textarea', required: false, description: 'Body (JSON)', placeholder: '{ "name": "John" }' },
    ],
    inputPorts: [
      { id: 'params', name: 'Params', type: ['object', 'any'], required: false, description: 'Request parameters' },
    ],
    outputPorts: [
      { id: 'response', name: 'Response', type: 'http-response', description: 'Response body' },
      { id: 'status', name: 'Status', type: 'number', description: 'HTTP status code' },
      { id: 'headers', name: 'Headers', type: 'object', description: 'Response headers' },
    ],
    npmPackage: 'axios',
    documentation: 'https://axios-http.com/',
    codeTemplate: `const response = await axios({
  method: '{{config.method}}',
  url: '{{config.url}}',
  headers: {{config.headers || '{}'}},
  data: {{config.body || 'prevOutput'}}
})
const data = response.data`
  },

  // AI Chat
  {
    id: 'ai-chat',
    name: 'AI Chat',
    category: 'ai',
    icon: '🤖',
    color: '#8B5CF6',
    description: 'Chat with AI models',
    configFields: [
      { name: 'provider', type: 'select', required: true, description: 'AI provider', options: ['openai', 'anthropic'] },
      { name: 'apiKey', type: 'string', required: true, description: 'API key', placeholder: 'sk-xxx or process.env.OPENAI_API_KEY' },
      { name: 'model', type: 'string', required: true, description: 'Model', placeholder: 'gpt-4, claude-3-opus' },
      { name: 'prompt', type: 'textarea', required: true, description: 'Prompt', placeholder: 'Explain {{prevOutput}}' },
      { name: 'temperature', type: 'number', required: false, description: 'Temperature', default: 0.7 },
    ],
    inputPorts: [
      { id: 'context', name: 'Context', type: ['string', 'object', 'any'], required: false, description: 'Additional context' },
    ],
    outputPorts: [
      { id: 'response', name: 'Response', type: 'string', description: 'AI response text' },
      { id: 'tokens', name: 'Tokens', type: 'number', description: 'Tokens used' },
      { id: 'cost', name: 'Cost', type: 'number', description: 'Estimated cost' },
    ],
    npmPackage: 'openai',
    documentation: 'https://platform.openai.com/docs',
    codeTemplate: `const openai = new OpenAI({ apiKey: '{{config.apiKey}}' })
const completion = await openai.chat.completions.create({
  model: '{{config.model}}',
  messages: [{ role: 'user', content: '{{config.prompt}}' }],
  temperature: {{config.temperature || 0.7}}
})
const aiResponse = completion.choices[0].message.content`
  },

  // Database
  {
    id: 'database',
    name: 'Database',
    category: 'data',
    icon: '🗄️',
    color: '#10B981',
    description: 'Execute database queries',
    configFields: [
      { name: 'provider', type: 'select', required: true, description: 'Database', options: ['postgresql', 'mysql', 'mongodb'] },
      { name: 'connectionString', type: 'string', required: true, description: 'Connection string', placeholder: 'postgresql://...' },
      { name: 'query', type: 'textarea', required: true, description: 'Query', placeholder: 'SELECT * FROM users WHERE id = $1' },
      { name: 'params', type: 'array', required: false, description: 'Parameters', placeholder: '[{{prevOutput.id}}]' },
    ],
    inputPorts: [
      { id: 'params', name: 'Query Params', type: ['array', 'object'], required: false, description: 'Query parameters' },
    ],
    outputPorts: [
      { id: 'rows', name: 'Rows', type: 'database-row', description: 'Query results' },
      { id: 'count', name: 'Count', type: 'number', description: 'Number of rows' },
    ],
    npmPackage: 'pg',
    documentation: 'https://node-postgres.com/',
    codeTemplate: `const { Pool } = require('pg')
const pool = new Pool({ connectionString: '{{config.connectionString}}' })
const result = await pool.query('{{config.query}}', {{config.params || '[]'}})
const rows = result.rows`
  },

  // Email
  {
    id: 'email',
    name: 'Email',
    category: 'communication',
    icon: '📧',
    color: '#F59E0B',
    description: 'Send emails',
    configFields: [
      { name: 'provider', type: 'select', required: true, description: 'Provider', options: ['resend', 'sendgrid'] },
      { name: 'apiKey', type: 'string', required: true, description: 'API key', placeholder: 're_xxx or process.env.RESEND_API_KEY' },
      { name: 'from', type: 'string', required: true, description: 'From', placeholder: 'noreply@yourapp.com' },
      { name: 'to', type: 'string', required: true, description: 'To', placeholder: '{{prevOutput.email}}' },
      { name: 'subject', type: 'string', required: true, description: 'Subject', placeholder: 'Welcome!' },
      { name: 'body', type: 'textarea', required: true, description: 'Body HTML', placeholder: '<h1>Hello {{prevOutput.name}}</h1>' },
    ],
    inputPorts: [
      { id: 'recipient', name: 'Recipient', type: ['email', 'object', 'string'], required: false, description: 'Email recipient data' },
    ],
    outputPorts: [
      { id: 'messageId', name: 'Message ID', type: 'string', description: 'Email message ID' },
      { id: 'success', name: 'Success', type: 'boolean', description: 'Send success' },
    ],
    npmPackage: 'resend',
    documentation: 'https://resend.com/docs',
    codeTemplate: `const { Resend } = require('resend')
const resend = new Resend('{{config.apiKey}}')
const { data } = await resend.emails.send({
  from: '{{config.from}}',
  to: '{{config.to}}',
  subject: '{{config.subject}}',
  html: '{{config.body}}'
})
const messageId = data.id`
  },

  // Transformer
  {
    id: 'transformer',
    name: 'Transformer',
    category: 'workflow',
    icon: '🔄',
    color: '#6366F1',
    description: 'Transform data with JavaScript',
    configFields: [
      { name: 'code', type: 'textarea', required: true, description: 'JS code', placeholder: 'return { fullName: input.firstName + " " + input.lastName }' },
    ],
    inputPorts: [
      { id: 'input', name: 'Input', type: ['any'], required: true, description: 'Data to transform' },
    ],
    outputPorts: [
      { id: 'output', name: 'Output', type: 'any', description: 'Transformed data' },
    ],
    documentation: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    codeTemplate: `const transform = (input) => {
  {{config.code}}
}
const transformedData = transform(prevOutput)`
  },

  // Logger
  {
    id: 'logger',
    name: 'Logger',
    category: 'monitoring',
    icon: '📊',
    color: '#64748B',
    description: 'Log events and data',
    configFields: [
      { name: 'level', type: 'select', required: true, description: 'Level', options: ['info', 'warn', 'error', 'debug'] },
      { name: 'message', type: 'string', required: true, description: 'Message', placeholder: 'Processing complete' },
    ],
    inputPorts: [
      { id: 'data', name: 'Data', type: ['any'], required: false, description: 'Data to log' },
    ],
    outputPorts: [
      { id: 'logged', name: 'Logged', type: 'boolean', description: 'Log success' },
      { id: 'timestamp', name: 'Timestamp', type: 'string', description: 'Log timestamp' },
    ],
    npmPackage: 'winston',
    documentation: 'https://github.com/winstonjs/winston',
    codeTemplate: `logger.{{config.level}}('{{config.message}}', prevOutput)
const timestamp = new Date().toISOString()`
  },

  // Cache
  {
    id: 'cache',
    name: 'Cache',
    category: 'data',
    icon: '⚡',
    color: '#10B981',
    description: 'Cache data in Redis',
    configFields: [
      { name: 'operation', type: 'select', required: true, description: 'Operation', options: ['get', 'set', 'delete'] },
      { name: 'key', type: 'string', required: true, description: 'Cache key', placeholder: 'user:{{prevOutput.id}}' },
      { name: 'ttl', type: 'number', required: false, description: 'TTL (seconds)', default: 3600 },
    ],
    inputPorts: [
      { id: 'value', name: 'Value', type: ['any'], required: false, description: 'Value to cache (for set)' },
    ],
    outputPorts: [
      { id: 'value', name: 'Value', type: 'any', description: 'Cached value' },
      { id: 'success', name: 'Success', type: 'boolean', description: 'Operation success' },
    ],
    npmPackage: 'redis',
    documentation: 'https://redis.io/docs/',
    codeTemplate: `const redis = createClient({ url: process.env.REDIS_URL })
await redis.connect()
if ('{{config.operation}}' === 'get') {
  const cachedValue = await redis.get('{{config.key}}')
} else if ('{{config.operation}}' === 'set') {
  await redis.set('{{config.key}}', JSON.stringify(prevOutput), { EX: {{config.ttl || 3600}} })
}`
  },

  // Payments
  {
    id: 'payments',
    name: 'Stripe Payment',
    category: 'payments',
    icon: '💳',
    color: '#EC4899',
    description: 'Process payments with Stripe',
    configFields: [
      { name: 'apiKey', type: 'string', required: true, description: 'Stripe secret key', placeholder: 'sk_test_xxx' },
      { name: 'amount', type: 'number', required: true, description: 'Amount (cents)', placeholder: '2000' },
      { name: 'currency', type: 'string', required: false, description: 'Currency', default: 'usd' },
    ],
    inputPorts: [
      { id: 'customer', name: 'Customer', type: ['object', 'string'], required: false, description: 'Customer data' },
    ],
    outputPorts: [
      { id: 'payment', name: 'Payment', type: 'payment', description: 'Payment intent' },
      { id: 'clientSecret', name: 'Client Secret', type: 'string', description: 'Client secret for frontend' },
    ],
    npmPackage: 'stripe',
    documentation: 'https://stripe.com/docs/api',
    codeTemplate: `const stripe = require('stripe')('{{config.apiKey}}')
const paymentIntent = await stripe.paymentIntents.create({
  amount: {{config.amount}},
  currency: '{{config.currency || "usd"}}',
  automatic_payment_methods: { enabled: true }
})
const clientSecret = paymentIntent.client_secret`
  },
]

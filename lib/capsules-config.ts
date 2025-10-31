export type CapsuleCategory =
  | 'auth'
  | 'data'
  | 'ai'
  | 'communication'
  | 'payments'
  | 'workflow'
  | 'content'
  | 'search'
  | 'forms'
  | 'monitoring'
  | 'security'
  | 'integration'

export interface CapsuleField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'array'
  required: boolean
  description: string
  default?: any
  options?: string[] // for select type
  placeholder?: string
}

export interface CapsuleDefinition {
  id: string
  name: string
  category: CapsuleCategory
  icon: string
  color: string
  description: string
  inputs: CapsuleField[]
  outputs: string[]
  npmPackage?: string
  documentation?: string
}

export const CAPSULES_DEFINITIONS: CapsuleDefinition[] = [
  // Authentication
  {
    id: 'auth-jwt',
    name: 'JWT Auth',
    category: 'auth',
    icon: '🔐',
    color: '#3B82F6',
    description: 'Generate and verify JWT tokens',
    inputs: [
      { name: 'secret', type: 'string', required: true, description: 'JWT secret key', placeholder: 'your-secret-key' },
      { name: 'expiresIn', type: 'string', required: false, description: 'Token expiration', default: '1h', placeholder: '1h, 7d, etc' },
      { name: 'payload', type: 'textarea', required: true, description: 'JWT payload (JSON)', placeholder: '{ "userId": "123" }' },
    ],
    outputs: ['token', 'error'],
    npmPackage: 'jsonwebtoken',
    documentation: 'https://github.com/auth0/node-jsonwebtoken'
  },
  {
    id: 'auth-oauth-google',
    name: 'Google OAuth',
    category: 'auth',
    icon: '🔑',
    color: '#3B82F6',
    description: 'Google OAuth 2.0 authentication',
    inputs: [
      { name: 'clientId', type: 'string', required: true, description: 'Google Client ID', placeholder: 'xxx.apps.googleusercontent.com' },
      { name: 'clientSecret', type: 'string', required: true, description: 'Google Client Secret', placeholder: 'GOCSPX-xxx' },
      { name: 'redirectUri', type: 'string', required: true, description: 'Redirect URI', placeholder: 'https://yourapp.com/callback' },
      { name: 'scopes', type: 'array', required: false, description: 'OAuth scopes', default: ['email', 'profile'] },
    ],
    outputs: ['user', 'tokens', 'error'],
    npmPackage: 'capsulas-framework',
    documentation: 'https://developers.google.com/identity/protocols/oauth2'
  },

  // Data & Storage
  {
    id: 'database',
    name: 'Database',
    category: 'data',
    icon: '🗄️',
    color: '#10B981',
    description: 'Execute database queries',
    inputs: [
      { name: 'provider', type: 'select', required: true, description: 'Database type', options: ['postgresql', 'mysql', 'mongodb', 'sqlite'] },
      { name: 'connectionString', type: 'string', required: true, description: 'Connection string', placeholder: 'postgresql://user:pass@host:5432/db' },
      { name: 'query', type: 'textarea', required: true, description: 'SQL/Query', placeholder: 'SELECT * FROM users WHERE id = $1' },
      { name: 'params', type: 'array', required: false, description: 'Query parameters', placeholder: '[1, "john"]' },
    ],
    outputs: ['rows', 'count', 'error'],
    npmPackage: 'pg',
    documentation: 'https://node-postgres.com/'
  },
  {
    id: 'cache',
    name: 'Cache',
    category: 'data',
    icon: '⚡',
    color: '#10B981',
    description: 'Cache data in Redis or memory',
    inputs: [
      { name: 'provider', type: 'select', required: true, description: 'Cache provider', options: ['redis', 'memory'] },
      { name: 'key', type: 'string', required: true, description: 'Cache key', placeholder: 'user:123' },
      { name: 'value', type: 'textarea', required: false, description: 'Value to cache (if setting)', placeholder: '{ "name": "John" }' },
      { name: 'ttl', type: 'number', required: false, description: 'TTL in seconds', default: 3600 },
      { name: 'operation', type: 'select', required: true, description: 'Operation', options: ['get', 'set', 'delete'] },
    ],
    outputs: ['value', 'success', 'error'],
    npmPackage: 'redis',
    documentation: 'https://redis.io/docs/'
  },

  // AI
  {
    id: 'ai-chat',
    name: 'AI Chat',
    category: 'ai',
    icon: '🤖',
    color: '#8B5CF6',
    description: 'Chat with AI models (GPT, Claude)',
    inputs: [
      { name: 'provider', type: 'select', required: true, description: 'AI provider', options: ['openai', 'anthropic', 'cohere'] },
      { name: 'apiKey', type: 'string', required: true, description: 'API key', placeholder: 'sk-xxx' },
      { name: 'model', type: 'string', required: true, description: 'Model name', placeholder: 'gpt-4, claude-3-opus' },
      { name: 'prompt', type: 'textarea', required: true, description: 'User prompt', placeholder: 'Explain quantum computing' },
      { name: 'systemPrompt', type: 'textarea', required: false, description: 'System prompt', placeholder: 'You are a helpful assistant' },
      { name: 'temperature', type: 'number', required: false, description: 'Temperature (0-2)', default: 0.7 },
      { name: 'maxTokens', type: 'number', required: false, description: 'Max tokens', default: 1000 },
    ],
    outputs: ['response', 'tokens', 'cost', 'error'],
    npmPackage: 'openai',
    documentation: 'https://platform.openai.com/docs'
  },

  // Communication
  {
    id: 'email',
    name: 'Email',
    category: 'communication',
    icon: '📧',
    color: '#F59E0B',
    description: 'Send emails via SendGrid, Resend, etc.',
    inputs: [
      { name: 'provider', type: 'select', required: true, description: 'Email provider', options: ['sendgrid', 'resend', 'nodemailer'] },
      { name: 'apiKey', type: 'string', required: true, description: 'API key', placeholder: 'SG.xxx or re_xxx' },
      { name: 'from', type: 'string', required: true, description: 'From email', placeholder: 'noreply@yourapp.com' },
      { name: 'to', type: 'string', required: true, description: 'To email', placeholder: 'user@example.com' },
      { name: 'subject', type: 'string', required: true, description: 'Email subject', placeholder: 'Welcome to our app' },
      { name: 'body', type: 'textarea', required: true, description: 'Email body (HTML or text)', placeholder: '<h1>Welcome!</h1>' },
    ],
    outputs: ['messageId', 'success', 'error'],
    npmPackage: 'resend',
    documentation: 'https://resend.com/docs'
  },
  {
    id: 'sms',
    name: 'SMS',
    category: 'communication',
    icon: '💬',
    color: '#F59E0B',
    description: 'Send SMS via Twilio',
    inputs: [
      { name: 'accountSid', type: 'string', required: true, description: 'Twilio Account SID', placeholder: 'ACxxx' },
      { name: 'authToken', type: 'string', required: true, description: 'Twilio Auth Token', placeholder: 'xxx' },
      { name: 'from', type: 'string', required: true, description: 'From phone number', placeholder: '+1234567890' },
      { name: 'to', type: 'string', required: true, description: 'To phone number', placeholder: '+0987654321' },
      { name: 'message', type: 'textarea', required: true, description: 'SMS message', placeholder: 'Your code is: 123456' },
    ],
    outputs: ['sid', 'success', 'error'],
    npmPackage: 'twilio',
    documentation: 'https://www.twilio.com/docs/sms'
  },

  // Payments
  {
    id: 'payments',
    name: 'Payments',
    category: 'payments',
    icon: '💳',
    color: '#EC4899',
    description: 'Process payments with Stripe',
    inputs: [
      { name: 'provider', type: 'select', required: true, description: 'Payment provider', options: ['stripe', 'paypal'] },
      { name: 'apiKey', type: 'string', required: true, description: 'API key', placeholder: 'sk_test_xxx' },
      { name: 'amount', type: 'number', required: true, description: 'Amount in cents', placeholder: '2000' },
      { name: 'currency', type: 'string', required: true, description: 'Currency', default: 'usd', placeholder: 'usd, eur' },
      { name: 'description', type: 'string', required: false, description: 'Payment description', placeholder: 'Pro subscription' },
    ],
    outputs: ['paymentIntent', 'clientSecret', 'error'],
    npmPackage: 'stripe',
    documentation: 'https://stripe.com/docs/api'
  },

  // Workflow
  {
    id: 'webhook',
    name: 'Webhook',
    category: 'workflow',
    icon: '🪝',
    color: '#6366F1',
    description: 'Trigger workflow from HTTP webhook',
    inputs: [
      { name: 'method', type: 'select', required: true, description: 'HTTP method', options: ['GET', 'POST', 'PUT', 'DELETE'] },
      { name: 'path', type: 'string', required: true, description: 'Webhook path', placeholder: '/api/webhook/contact' },
      { name: 'authentication', type: 'select', required: false, description: 'Auth type', options: ['none', 'bearer', 'apikey'] },
    ],
    outputs: ['body', 'headers', 'query'],
    documentation: 'https://en.wikipedia.org/wiki/Webhook'
  },
  {
    id: 'http',
    name: 'HTTP Request',
    category: 'workflow',
    icon: '🌐',
    color: '#6366F1',
    description: 'Make HTTP requests to external APIs',
    inputs: [
      { name: 'method', type: 'select', required: true, description: 'HTTP method', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
      { name: 'url', type: 'string', required: true, description: 'Request URL', placeholder: 'https://api.example.com/users' },
      { name: 'headers', type: 'textarea', required: false, description: 'Headers (JSON)', placeholder: '{ "Authorization": "Bearer xxx" }' },
      { name: 'body', type: 'textarea', required: false, description: 'Request body (JSON)', placeholder: '{ "name": "John" }' },
      { name: 'timeout', type: 'number', required: false, description: 'Timeout (ms)', default: 5000 },
    ],
    outputs: ['response', 'status', 'headers', 'error'],
    npmPackage: 'axios',
    documentation: 'https://axios-http.com/docs/intro'
  },
  {
    id: 'validator',
    name: 'Validator',
    category: 'workflow',
    icon: '✅',
    color: '#6366F1',
    description: 'Validate data with schemas',
    inputs: [
      { name: 'schema', type: 'textarea', required: true, description: 'Validation schema (Zod)', placeholder: 'z.object({ email: z.string().email() })' },
      { name: 'data', type: 'textarea', required: true, description: 'Data to validate (JSON)', placeholder: '{ "email": "user@example.com" }' },
    ],
    outputs: ['valid', 'errors', 'data'],
    npmPackage: 'zod',
    documentation: 'https://zod.dev/'
  },
  {
    id: 'transformer',
    name: 'Transformer',
    category: 'workflow',
    icon: '🔄',
    color: '#6366F1',
    description: 'Transform data with JavaScript',
    inputs: [
      { name: 'input', type: 'textarea', required: true, description: 'Input data (JSON)', placeholder: '{ "firstName": "John", "lastName": "Doe" }' },
      { name: 'code', type: 'textarea', required: true, description: 'Transform code (JS)', placeholder: 'return { fullName: input.firstName + " " + input.lastName }' },
    ],
    outputs: ['output', 'error'],
    documentation: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },

  // Content
  {
    id: 'markdown',
    name: 'Markdown',
    category: 'content',
    icon: '📝',
    color: '#14B8A6',
    description: 'Parse and render Markdown',
    inputs: [
      { name: 'markdown', type: 'textarea', required: true, description: 'Markdown content', placeholder: '# Hello World\n\nThis is **bold**' },
      { name: 'sanitize', type: 'boolean', required: false, description: 'Sanitize HTML', default: true },
    ],
    outputs: ['html', 'text', 'error'],
    npmPackage: 'marked',
    documentation: 'https://marked.js.org/'
  },
  {
    id: 'pdf',
    name: 'PDF Generator',
    category: 'content',
    icon: '📄',
    color: '#14B8A6',
    description: 'Generate PDF from HTML',
    inputs: [
      { name: 'html', type: 'textarea', required: true, description: 'HTML content', placeholder: '<h1>Invoice</h1><p>Total: $100</p>' },
      { name: 'filename', type: 'string', required: true, description: 'Output filename', placeholder: 'invoice.pdf' },
      { name: 'format', type: 'select', required: false, description: 'Page format', options: ['A4', 'Letter'], default: 'A4' },
    ],
    outputs: ['buffer', 'url', 'error'],
    npmPackage: 'puppeteer',
    documentation: 'https://pptr.dev/'
  },

  // Monitoring
  {
    id: 'logger',
    name: 'Logger',
    category: 'monitoring',
    icon: '📊',
    color: '#64748B',
    description: 'Log events and data',
    inputs: [
      { name: 'level', type: 'select', required: true, description: 'Log level', options: ['info', 'warn', 'error', 'debug'] },
      { name: 'message', type: 'string', required: true, description: 'Log message', placeholder: 'User created successfully' },
      { name: 'metadata', type: 'textarea', required: false, description: 'Additional data (JSON)', placeholder: '{ "userId": "123" }' },
    ],
    outputs: ['logged', 'timestamp'],
    npmPackage: 'winston',
    documentation: 'https://github.com/winstonjs/winston'
  },

  // Security
  {
    id: 'rate-limiter',
    name: 'Rate Limiter',
    category: 'security',
    icon: '🛡️',
    color: '#DC2626',
    description: 'Rate limit API requests',
    inputs: [
      { name: 'identifier', type: 'string', required: true, description: 'Rate limit identifier', placeholder: 'user-123 or ip-1.2.3.4' },
      { name: 'maxRequests', type: 'number', required: true, description: 'Max requests', placeholder: '100' },
      { name: 'windowMs', type: 'number', required: true, description: 'Time window (ms)', placeholder: '60000' },
    ],
    outputs: ['allowed', 'remaining', 'resetAt'],
    npmPackage: 'express-rate-limit',
    documentation: 'https://github.com/express-rate-limit/express-rate-limit'
  },
]

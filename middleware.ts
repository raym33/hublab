/**
 * AI-Only Access Middleware for HubLab v2.0
 *
 * Enhanced Features:
 * - BLOCKS ALL HUMAN BROWSER ACCESS
 * - Intelligent AI detection with scoring system
 * - Request logging and analytics
 * - Security headers
 * - Rate limiting preparation
 * - Bypass tokens for development
 *
 * HubLab is exclusively for AI consumption - no human UI access permitted
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Environment-based configuration
 */
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const BYPASS_TOKEN = process.env.AI_BYPASS_TOKEN || 'dev-bypass-token-123'

/**
 * Known AI user agents and bot identifiers (expanded list)
 */
const AI_USER_AGENTS = [
  // AI Assistants
  'claudebot',
  'claude-web',
  'claude',
  'anthropic',
  'gptbot',
  'chatgpt',
  'chatgpt-user',
  'openai',
  'openai-crawler',
  'cohere',
  'cohere-ai',
  'gemini',
  'bard',
  'palm',
  'perplexity',
  'perplexitybot',
  'you.com',

  // Meta/Facebook AI
  'meta-externalagent',
  'facebookbot',

  // Developer Tools & IDEs
  'copilot',
  'github-copilot',
  'cursor',
  'windsurf',
  'replit',
  'sourcegraph',
  'cody',
  'tabnine',

  // Programmatic Clients
  'curl',
  'wget',
  'python-requests',
  'python-urllib',
  'python-httpx',
  'python',
  'node-fetch',
  'node',
  'axios',
  'got',
  'superagent',
  'request',
  'fetch',
  'httpie',
  'postman',
  'insomnia',
  'paw',
  'advanced rest client',

  // Search/Crawl Bots (for indexing)
  'googlebot',
  'bingbot',
  'slackbot',
  'discordbot',
  'twitterbot',
  'linkedinbot',
  'telegrambot',

  // Development/Testing
  'jest',
  'playwright',
  'puppeteer',
  'selenium',
  'cypress',
]

/**
 * Blocked browser signatures
 */
const BROWSER_SIGNATURES = [
  'chrome',
  'safari',
  'firefox',
  'edge',
  'opera',
  'brave',
  'vivaldi',
  'samsung',
]

/**
 * Detection result with confidence score
 */
interface DetectionResult {
  isAI: boolean
  confidence: number
  reason: string
  clientType: string
}

/**
 * Intelligent AI detection with confidence scoring
 * Returns detection result with confidence level (0-100)
 */
function detectAIClient(request: NextRequest): DetectionResult {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  let score = 0
  const reasons: string[] = []

  // HIGHEST CONFIDENCE: AI-specific headers (+50 points)
  if (request.headers.has('x-ai-assistant')) {
    score += 50
    reasons.push(`AI header: ${request.headers.get('x-ai-assistant')}`)
  }

  if (request.headers.has('x-api-key') || request.headers.has('authorization')) {
    score += 30
    reasons.push('API authentication present')
  }

  // HIGH CONFIDENCE: Known AI user agents (+40 points)
  const matchedAgent = AI_USER_AGENTS.find(agent =>
    userAgent.includes(agent.toLowerCase())
  )

  if (matchedAgent) {
    score += 40
    reasons.push(`AI user agent: ${matchedAgent}`)
  }

  // MEDIUM CONFIDENCE: Programmatic client indicators (+20 points each)
  if (userAgent.includes('bot') && !userAgent.includes('robot')) {
    score += 20
    reasons.push('Bot identifier')
  }

  if (userAgent.includes('headless')) {
    score += 15
    reasons.push('Headless browser')
  }

  // Check for programmatic HTTP libraries
  const httpLibraries = ['requests', 'urllib', 'httpx', 'axios', 'got', 'fetch', 'http-client']
  const hasHttpLibrary = httpLibraries.some(lib => userAgent.includes(lib))
  if (hasHttpLibrary) {
    score += 25
    reasons.push('HTTP library detected')
  }

  // NEGATIVE INDICATORS: Browser signatures (-30 points each)
  const hasMozilla = userAgent.includes('mozilla')
  const browserMatch = BROWSER_SIGNATURES.find(browser =>
    userAgent.includes(browser)
  )

  if (hasMozilla && browserMatch && !userAgent.includes('bot') && !userAgent.includes('headless')) {
    score -= 30
    reasons.push(`Browser detected: ${browserMatch}`)

    // Extra penalty for common browser patterns
    if (userAgent.includes('applewebkit') || userAgent.includes('gecko')) {
      score -= 20
      reasons.push('Browser rendering engine detected')
    }
  }

  // Check Accept header (browsers typically ask for HTML)
  const accept = request.headers.get('accept')?.toLowerCase() || ''
  if (accept.includes('text/html') && !accept.includes('application/json')) {
    score -= 15
    reasons.push('HTML-first Accept header')
  }

  // Programmatic clients often have simple Accept headers or prioritize JSON
  if (accept.includes('application/json') || accept === '*/*' || accept === '') {
    score += 15
    reasons.push('API-friendly Accept header')
  }

  // Development bypass token
  if (request.headers.get('x-bypass-token') === BYPASS_TOKEN) {
    score = 100
    reasons.push('Development bypass token')
  }

  // Determine result based on score
  const isAI = score >= 20 // Threshold for allowing access

  // Determine client type
  let clientType = 'Unknown'
  if (score >= 50) clientType = 'AI Assistant'
  else if (score >= 20) clientType = 'Programmatic Client'
  else if (score < 0) clientType = 'Web Browser'
  else clientType = 'Ambiguous'

  return {
    isAI,
    confidence: Math.max(0, Math.min(100, score)),
    reason: reasons.join(', ') || 'No clear indicators',
    clientType
  }
}

/**
 * Log access attempt (for analytics)
 */
function logAccess(request: NextRequest, detection: DetectionResult, allowed: boolean) {
  if (IS_DEVELOPMENT) {
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    console.log(`[HubLab Access] ${allowed ? '✅ ALLOWED' : '❌ BLOCKED'}`)
    console.log(`  Path: ${request.nextUrl.pathname}`)
    console.log(`  Client: ${detection.clientType}`)
    console.log(`  Confidence: ${detection.confidence}%`)
    console.log(`  Reason: ${detection.reason}`)
    console.log(`  UA: ${userAgent.substring(0, 80)}`)
  }

  // In production, you could send this to analytics service
  // e.g., await fetch('your-analytics-endpoint', { method: 'POST', body: JSON.stringify(...) })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Always allow Next.js internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }

  // Detect client type with confidence scoring
  const detection = detectAIClient(request)

  // Log the access attempt
  logAccess(request, detection, detection.isAI)

  // Block human browsers
  if (!detection.isAI) {
    // BLOCK HUMAN BROWSER ACCESS
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HubLab - AI-Only Service</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      max-width: 600px;
      padding: 40px;
      text-align: center;
    }
    .icon {
      font-size: 80px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 36px;
      margin: 0 0 20px 0;
    }
    p {
      font-size: 18px;
      line-height: 1.6;
      opacity: 0.9;
      margin: 15px 0;
    }
    .code-block {
      background: rgba(0,0,0,0.3);
      padding: 20px;
      border-radius: 8px;
      text-align: left;
      margin: 30px 0;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      overflow-x: auto;
    }
    .highlight {
      color: #ffd700;
      font-weight: bold;
    }
    a {
      color: #ffd700;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🤖</div>
    <h1>AI-Only Service</h1>
    <p><strong>HubLab is exclusively for AI assistants.</strong></p>
    <p>Human browser access is not permitted. This service provides a component library API optimized for AI code generation tools.</p>

    <div class="code-block">
      <div># Method 1: Add AI header</div>
      <div>curl -H "X-AI-Assistant: Claude" \\</div>
      <div>&nbsp;&nbsp;https://hublab.dev/api/ai/capsules</div>
      <br>
      <div># Method 2: Use AI user agent</div>
      <div>curl -A "ClaudeBot" \\</div>
      <div>&nbsp;&nbsp;https://hublab.dev/api/ai/metadata</div>
      <br>
      <div># Method 3: Development bypass</div>
      <div>curl -H "X-Bypass-Token: YOUR_TOKEN" \\</div>
      <div>&nbsp;&nbsp;https://hublab.dev/</div>
    </div>

    <p><strong>Detection Details:</strong></p>
    <p style="font-size: 14px; opacity: 0.8;">
      Client Type: <span class="highlight">${detection.clientType}</span><br>
      Confidence Score: <span class="highlight">${detection.confidence}%</span><br>
      Reason: ${detection.reason}
    </p>

    <p><strong>For AI Developers:</strong></p>
    <p>Add the <span class="highlight">X-AI-Assistant</span> header, use a recognized AI user agent, or obtain a bypass token for development.</p>

    <p>
      <a href="https://hublab.dev/api/ai/metadata">📚 API Documentation</a> ·
      <a href="https://hublab.dev/api/ai/health">💚 Health Check</a> ·
      <a href="mailto:ai-access@hublab.dev">✉️ Contact Support</a>
    </p>
  </div>
</body>
</html>`,
      {
        status: 403,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'X-HubLab-Access': 'AI-Only',
        }
      }
    )
  }

  // Allow AI/programmatic access with enhanced headers
  const response = NextResponse.next()

  // Set security and informational headers
  response.headers.set('X-HubLab-Access', 'AI-Approved')
  response.headers.set('X-HubLab-Client-Type', detection.clientType)
  response.headers.set('X-HubLab-Confidence', detection.confidence.toString())
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // CORS headers for AI clients
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-AI-Assistant, X-API-Key, Authorization')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
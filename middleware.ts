/**
 * AI-Only Access Middleware for HubLab
 *
 * BLOCKS ALL HUMAN BROWSER ACCESS
 * Only allows API access from AI assistants and programmatic clients
 *
 * HubLab is exclusively for AI consumption - no human UI access permitted
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Known AI user agents and bot identifiers
 */
const AI_USER_AGENTS = [
  // AI Assistants
  'claudebot',
  'claude-web',
  'anthropic',
  'gptbot',
  'chatgpt',
  'openai',
  'cohere',
  'gemini',
  'bard',
  'perplexity',

  // Developer Tools
  'copilot',
  'cursor',
  'windsurf',
  'replit',

  // Programmatic Clients
  'curl',
  'wget',
  'python-requests',
  'python',
  'node',
  'axios',
  'fetch',
  'httpie',
  'postman',
  'insomnia',

  // Search/Crawl Bots (for indexing API docs)
  'googlebot',
  'bingbot',
  'slackbot',
  'discordbot',
]

/**
 * Check if request is from an AI or programmatic client
 */
function isAIOrProgrammaticRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''

  // Check for AI-specific headers (strongest signal)
  if (
    request.headers.has('x-ai-assistant') ||
    request.headers.has('x-api-key') ||
    request.headers.has('authorization')
  ) {
    return true
  }

  // Check user agent for AI/bot signatures
  const hasAIUserAgent = AI_USER_AGENTS.some(agent =>
    userAgent.includes(agent.toLowerCase())
  )

  if (hasAIUserAgent) {
    return true
  }

  // Check if it's NOT a typical browser
  // Browsers typically have 'Mozilla' and specific patterns
  const isBrowser =
    userAgent.includes('mozilla') &&
    (userAgent.includes('chrome') ||
      userAgent.includes('safari') ||
      userAgent.includes('firefox') ||
      userAgent.includes('edge')) &&
    !userAgent.includes('bot') &&
    !userAgent.includes('headless')

  // If it's a browser, block it
  if (isBrowser) {
    return false
  }

  // Allow all other non-browser requests
  return true
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

  // Check if request is from AI/programmatic client
  if (!isAIOrProgrammaticRequest(request)) {
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
      <div># Access via API:</div>
      <div>curl -H "X-AI-Assistant: Claude" \\</div>
      <div>&nbsp;&nbsp;https://hublab.dev/api/ai/capsules</div>
      <br>
      <div># Get metadata:</div>
      <div>curl https://hublab.dev/api/ai/metadata</div>
    </div>

    <p><strong>For AI Developers:</strong></p>
    <p>Add the <span class="highlight">X-AI-Assistant</span> header or use a recognized AI user agent to access HubLab programmatically.</p>

    <p>Documentation: <a href="https://hublab.dev/api/ai/metadata">API Docs</a></p>
    <p>Questions? Contact: <a href="mailto:ai-access@hublab.dev">ai-access@hublab.dev</a></p>
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

  // Allow AI/programmatic access
  const response = NextResponse.next()
  response.headers.set('X-HubLab-Access', 'AI-Approved')
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
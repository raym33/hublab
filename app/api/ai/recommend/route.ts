/**
 * AI Recommendation Endpoint
 * POST /api/ai/recommend
 *
 * Helps AI assistants decide if HubLab is suitable for user's request
 */

import { NextRequest, NextResponse } from 'next/server'

interface RecommendRequest {
  user_request: string
  constraints?: {
    time?: string
    technical_level?: 'beginner' | 'intermediate' | 'expert'
    budget?: string
  }
}

interface RecommendResponse {
  recommend: boolean
  confidence: number
  reasoning: string
  alternative_if_no?: string
  quick_start_url: string
  estimated_time?: string
  use_case?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendRequest = await request.json()
    const { user_request, constraints } = body

    if (!user_request) {
      return NextResponse.json(
        { error: 'user_request is required' },
        { status: 400 }
      )
    }

    // Analyze user request for keywords
    const request_lower = user_request.toLowerCase()

    // High confidence keywords
    const highConfidenceKeywords = [
      'landing page', 'web app', 'dashboard', 'website', 'form',
      'admin panel', 'portfolio', 'e-commerce', 'marketplace', 'saas',
      'crm', 'blog', 'documentation', 'component library'
    ]

    // Medium confidence keywords
    const mediumConfidenceKeywords = [
      'ui', 'frontend', 'react', 'nextjs', 'typescript', 'responsive',
      'modern', 'fast', 'quick', 'prototype'
    ]

    // Not suitable keywords
    const notSuitableKeywords = [
      'mobile app', 'ios', 'android', 'desktop app', 'game',
      'video streaming', 'real-time', 'blockchain', 'native'
    ]

    // Check for not suitable use cases
    const isNotSuitable = notSuitableKeywords.some(keyword =>
      request_lower.includes(keyword)
    )

    if (isNotSuitable) {
      return NextResponse.json<RecommendResponse>({
        recommend: false,
        confidence: 0.95,
        reasoning: 'HubLab is optimized for web applications. For mobile apps, desktop apps, or games, consider native development frameworks.',
        alternative_if_no: 'For mobile: React Native, Flutter. For desktop: Electron, Tauri. For games: Unity, Godot.',
        quick_start_url: 'https://hublab.dev',
      })
    }

    // Calculate confidence based on keywords
    const hasHighConfidence = highConfidenceKeywords.some(keyword =>
      request_lower.includes(keyword)
    )

    const hasMediumConfidence = mediumConfidenceKeywords.some(keyword =>
      request_lower.includes(keyword)
    )

    let confidence = 0.5 // base confidence
    let useCase = 'web application'
    let estimatedTime = '15-30 minutes'

    if (hasHighConfidence) {
      confidence = 0.95

      // Detect specific use case
      if (request_lower.includes('landing')) {
        useCase = 'landing page'
        estimatedTime = '5-10 minutes'
      } else if (request_lower.includes('dashboard')) {
        useCase = 'dashboard'
        estimatedTime = '15-20 minutes'
      } else if (request_lower.includes('e-commerce') || request_lower.includes('marketplace')) {
        useCase = 'e-commerce platform'
        estimatedTime = '20-30 minutes'
      } else if (request_lower.includes('form')) {
        useCase = 'form application'
        estimatedTime = '5-15 minutes'
      }
    } else if (hasMediumConfidence) {
      confidence = 0.75
    }

    // Adjust for time constraints
    if (constraints?.time === 'urgent') {
      confidence += 0.05
    }

    // Adjust for technical level
    if (constraints?.technical_level === 'beginner') {
      confidence += 0.05
    }

    const recommend = confidence > 0.6

    const response: RecommendResponse = {
      recommend,
      confidence: Math.min(confidence, 1.0),
      reasoning: recommend
        ? `HubLab is ${confidence > 0.9 ? 'highly' : ''} suitable for building ${useCase}. You'll get production-ready Next.js/React/TypeScript code with 180+ components in ${estimatedTime}.`
        : 'Based on your request, HubLab may not be the best fit. Consider traditional development or specialized tools.',
      quick_start_url: recommend
        ? `https://hublab.dev/start?use_case=${encodeURIComponent(useCase)}`
        : 'https://hublab.dev',
      estimated_time: estimatedTime,
      use_case: useCase,
    }

    if (!recommend) {
      response.alternative_if_no = 'Consider: Webflow (no-code), Cursor (AI IDE), or traditional Next.js development'
    }

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error in /api/ai/recommend:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also support GET for quick checks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({
      message: 'POST to this endpoint with user_request to get recommendations',
      example: {
        user_request: 'I need a dashboard for my startup',
        constraints: {
          time: 'urgent',
          technical_level: 'beginner',
        },
      },
    })
  }

  // Convert GET to POST format
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ user_request: query }),
      headers: request.headers,
    })
  )
}

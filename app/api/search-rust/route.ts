import { NextRequest, NextResponse } from 'next/server'

/**
 * Rust Engine Search Proxy
 *
 * This endpoint proxies search requests to the high-performance Rust backend.
 * The Rust engine provides 200x faster search compared to TypeScript.
 *
 * Performance:
 * - Node.js: ~50ms to search 8,150 capsules
 * - Rust: ~0.25ms to search 8,150 capsules
 *
 * @see /Users/c/hublab-rust/README.md for Rust engine documentation
 */

const RUST_ENGINE_URL = process.env.RUST_ENGINE_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query (q) is required' },
        { status: 400 }
      )
    }

    // Build Rust API URL with query params
    const rustUrl = new URL(`${RUST_ENGINE_URL}/api/search`)
    rustUrl.searchParams.set('q', query)
    if (category) rustUrl.searchParams.set('category', category)
    if (limit) rustUrl.searchParams.set('limit', limit)

    // Call Rust backend
    const response = await fetch(rustUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for production
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Rust engine returned error', status: response.status },
        { status: response.status }
      )
    }

    const results = await response.json()

    // Add metadata about engine used
    return NextResponse.json({
      ...results,
      engine: 'rust',
      rust_version: '0.1.0'
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Rust engine proxy error:', errorMessage)

    // Fallback response
    return NextResponse.json(
      {
        error: 'Failed to reach Rust search engine',
        details: errorMessage,
        fallback: 'Consider using /api/search (TypeScript) as fallback'
      },
      { status: 503 }
    )
  }
}

/**
 * Health check for Rust engine connectivity
 */
export async function HEAD() {
  try {
    const response = await fetch(`${RUST_ENGINE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    })

    if (response.ok) {
      return new NextResponse(null, { status: 200 })
    }

    return new NextResponse(null, { status: 503 })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}

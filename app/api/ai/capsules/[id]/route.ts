/**
 * AI-Friendly Capsules API - Individual Capsule
 *
 * Get specific capsule by ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { allCapsules } from '@/lib/all-capsules'

export const runtime = 'edge'

/**
 * GET /api/ai/capsules/[id]
 *
 * Returns a specific capsule by ID with full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Find capsule by ID
    const capsule = allCapsules.find(c => c.id === id)

    if (!capsule) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Capsule not found',
          id
        }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        capsule,
        metadata: {
          codeLength: capsule.code.length,
          tagCount: capsule.tags.length,
          hasDependencies: !!(capsule.dependencies && capsule.dependencies.length > 0)
        }
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

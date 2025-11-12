/**
 * Health Check Endpoint for AI Clients
 *
 * Returns system status and service information
 */

import { NextResponse } from 'next/server'
import { allCapsules } from '@/lib/all-capsules'

export const runtime = 'edge'

export async function GET() {
  const uptime = process.uptime?.() || 0

  return NextResponse.json({
    status: 'healthy',
    service: 'HubLab AI-Only API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    data: {
      totalCapsules: allCapsules.length,
      categories: [...new Set(allCapsules.map(c => c.category))].length,
      aiScore: 100
    },
    endpoints: {
      capsules: '/api/ai/capsules',
      metadata: '/api/ai/metadata',
      health: '/api/ai/health'
    },
    access: {
      type: 'AI-Only',
      methods: [
        'Add X-AI-Assistant header',
        'Use AI user agent',
        'Use programmatic client'
      ]
    }
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60',
      'X-HubLab-Service': 'AI-Only',
      'X-HubLab-Version': '2.0.0'
    }
  })
}

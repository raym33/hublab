/**
 * HubLab Ambient Agent CRM - Recent Events API
 *
 * GET /api/crm/events/recent - Get recent events
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getRecentEvents } from '@/lib/crm-database'
import { formatRelativeTime } from '@/lib/utils/format'

/**
 * GET /api/crm/events/recent
 * Get recent events for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    // Fetch events from database
    const events = await getRecentEvents(user.id, limit)

    // Transform to frontend format
    const transformedEvents = events.map(event => {
      // Extract title from normalized data or generate default
      let title = 'Event detected'
      if (event.normalized_data?.metadata) {
        const meta = event.normalized_data.metadata as any
        // Try to get email subject or meeting title
        if (meta.subject) {
          title = meta.subject
        } else if (meta.title) {
          title = meta.title
        } else if (meta.summary) {
          title = meta.summary
        }
      }

      // Map source to friendly name
      const sourceMap: Record<string, string> = {
        gmail: 'Gmail',
        outlook: 'Outlook',
        gcal: 'Google Calendar',
        zoom: 'Zoom',
        slack: 'Slack',
        teams: 'Microsoft Teams',
      }

      return {
        id: event.id,
        type: event.event_type,
        source: sourceMap[event.source] || event.source,
        title,
        timestamp: formatRelativeTime(event.created_at),
        processed: event.processed,
        confidence: (event.normalized_data?.metadata as any)?.confidence,
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedEvents,
    })
  } catch (error) {
    console.error('Error fetching recent events:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

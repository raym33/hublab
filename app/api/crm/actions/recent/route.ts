/**
 * HubLab Ambient Agent CRM - Recent Actions API
 *
 * GET /api/crm/actions/recent - Get recent CRM actions
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getRecentActions } from '@/lib/crm-database'
import { formatRelativeTime } from '@/lib/utils/format'

/**
 * GET /api/crm/actions/recent
 * Get recent CRM actions for the current user
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

    // Fetch actions from database
    const actions = await getRecentActions(user.id, limit)

    // Transform to frontend format
    const transformedActions = actions.map(action => {
      // Generate a friendly resource name from payload or use resource_id
      let resourceName = action.resource_id || 'Unknown'

      if (action.payload) {
        // Try to extract meaningful names from payload
        if (action.payload.email) {
          resourceName = action.payload.email
        } else if (action.payload.name) {
          resourceName = action.payload.name
        } else if (action.payload.title) {
          resourceName = action.payload.title
        } else if (action.payload.subject) {
          resourceName = action.payload.subject
        } else if (action.payload.deal_name) {
          resourceName = action.payload.deal_name
        } else if (action.payload.company_name) {
          resourceName = action.payload.company_name
        }
      }

      return {
        id: action.id,
        type: action.action_type,
        status: action.status,
        resource: resourceName,
        timestamp: formatRelativeTime(action.created_at),
        confidence: action.confidence,
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedActions,
    })
  } catch (error) {
    console.error('Error fetching recent actions:', error)
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

/**
 * HubLab Ambient Agent CRM - Stats API
 *
 * GET /api/crm/stats - Get dashboard statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getDashboardStats } from '@/lib/crm-database'

/**
 * GET /api/crm/stats
 * Get dashboard statistics for the current user
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

    // Fetch stats from database
    const stats = await getDashboardStats(user.id)

    // TODO: BACKEND - Add pipeline_value calculation
    // For now, we'll return 0 until deal tracking is implemented
    // This should query all open deals and sum their values
    const pipeline_value = 0

    return NextResponse.json({
      success: true,
      data: {
        events_today: stats.events_processed_today,
        crm_updates: stats.crm_updates_today,
        pending_approvals: stats.pending_approvals,
        pipeline_value,
        auto_approval_rate: stats.auto_approval_rate,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
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

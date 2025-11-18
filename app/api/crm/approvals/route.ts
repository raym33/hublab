/**
 * HubLab Ambient Agent CRM - Approvals API
 * Version: 1.0.0
 *
 * GET /api/crm/approvals - Get pending approvals
 * POST /api/crm/approvals - Approve or reject an action
 * PATCH /api/crm/approvals/[id] - Update action status
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  getActionsRequiringApproval,
  getPendingActions,
  updateActionStatus,
  getActionById,
  createAuditLog,
  getCRMConnectionByType,
} from '@/lib/crm-database'
import { CRMAction, UpdateActionStatusInput } from '@/lib/types/crm'
import { withCsrfProtection } from '@/lib/csrf'

/**
 * GET /api/crm/approvals
 * Get pending approvals for the current user
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
    const requiresApprovalOnly = searchParams.get('requires_approval') === 'true'

    // Fetch actions
    const actions = requiresApprovalOnly
      ? await getActionsRequiringApproval(user.id)
      : await getPendingActions(user.id)

    // Calculate stats
    const stats = {
      total: actions.length,
      high_risk: actions.filter(a => a.confidence < 0.7).length,
      medium_risk: actions.filter(a => a.confidence >= 0.7 && a.confidence < 0.9).length,
      low_risk: actions.filter(a => a.confidence >= 0.9).length,
      avg_confidence: actions.length > 0
        ? actions.reduce((sum, a) => sum + a.confidence, 0) / actions.length
        : 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        actions,
        stats,
      },
    })
  } catch (error) {
    console.error('Error fetching approvals:', error)
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

/**
 * POST /api/crm/approvals
 * Approve or reject a specific action
 * SECURITY: Protected with CSRF
 */
export const POST = withCsrfProtection(async (request: NextRequest) => {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { action_id, decision } = body

    if (!action_id || !decision) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: action_id, decision',
        },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(decision)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid decision. Must be "approve" or "reject"',
        },
        { status: 400 }
      )
    }

    // Get the action
    const action = await getActionById(action_id)

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Action not found',
        },
        { status: 404 }
      )
    }

    // Verify ownership
    if (action.user_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: You do not own this action',
        },
        { status: 403 }
      )
    }

    // Process decision
    if (decision === 'approve') {
      // Update status to approved
      const updatedAction = await updateActionStatus(action_id, {
        status: 'approved',
        approved_by: user.id,
      })

      // TODO: Execute the action against the CRM
      // For now, we just mark it as approved
      // In production, this would trigger the CRM connector

      return NextResponse.json({
        success: true,
        message: 'Action approved successfully',
        data: updatedAction,
      })
    } else {
      // Reject
      const updatedAction = await updateActionStatus(action_id, {
        status: 'failed',
        approved_by: user.id,
        error_message: 'Rejected by user',
      })

      return NextResponse.json({
        success: true,
        message: 'Action rejected',
        data: updatedAction,
      })
    }
  } catch (error) {
    console.error('Error processing approval:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
})

/**
 * PATCH /api/crm/approvals
 * Batch approve or reject multiple actions
 * SECURITY: Protected with CSRF
 */
export const PATCH = withCsrfProtection(async (request: NextRequest) => {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { action_ids, decision } = body

    if (!action_ids || !Array.isArray(action_ids) || action_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid action_ids array',
        },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(decision)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid decision. Must be "approve" or "reject"',
        },
        { status: 400 }
      )
    }

    // Process each action
    const results = []
    const errors = []

    for (const action_id of action_ids) {
      try {
        const action = await getActionById(action_id)

        if (!action) {
          errors.push({ action_id, error: 'Action not found' })
          continue
        }

        if (action.user_id !== user.id) {
          errors.push({ action_id, error: 'Forbidden: Not your action' })
          continue
        }

        const statusUpdate: UpdateActionStatusInput = decision === 'approve'
          ? { status: 'approved', approved_by: user.id }
          : { status: 'failed', approved_by: user.id, error_message: 'Rejected by user' }

        const updatedAction = await updateActionStatus(action_id, statusUpdate)
        results.push(updatedAction)
      } catch (error) {
        errors.push({
          action_id,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      message: `${results.length} actions ${decision}d successfully`,
      data: {
        processed: results,
        errors,
      },
    })
  } catch (error) {
    console.error('Error batch processing approvals:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
})

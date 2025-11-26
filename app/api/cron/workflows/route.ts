/**
 * Cron Workflow Runner
 * This endpoint is called by a cron service (e.g., Vercel Cron, Upstash)
 * to execute scheduled workflows
 *
 * Recommended: Call every minute
 * Vercel cron: Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/workflows",
 *     "schedule": "* * * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { executeWorkflowById } from '../../../../lib/workflow-engine'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Secret key to authorize cron requests
const CRON_SECRET = process.env.CRON_SECRET || 'default-cron-secret'

interface ScheduleRecord {
  id: string
  workflow_id: string
  user_id: string
  schedule_type: string
  cron_expression: string | null
  interval_seconds: number | null
  timezone: string
}

function calculateNextRun(
  scheduleType: string,
  cronExpression: string | null,
  intervalSeconds: number | null
): Date {
  const now = new Date()

  if (scheduleType === 'once') {
    // One-time schedules don't have a next run
    return new Date(0)
  }

  if (scheduleType === 'interval' && intervalSeconds) {
    return new Date(now.getTime() + intervalSeconds * 1000)
  }

  if (scheduleType === 'cron' && cronExpression) {
    // Simplified cron parsing - in production use cron-parser library
    const parts = cronExpression.split(' ')
    const [minute, hour] = parts

    const nextRun = new Date(now)
    nextRun.setSeconds(0)
    nextRun.setMilliseconds(0)

    if (minute !== '*') {
      if (minute.startsWith('*/')) {
        const interval = parseInt(minute.substring(2))
        const currentMinute = now.getMinutes()
        const nextMinute = Math.ceil((currentMinute + 1) / interval) * interval
        if (nextMinute >= 60) {
          nextRun.setHours(nextRun.getHours() + 1)
          nextRun.setMinutes(nextMinute - 60)
        } else {
          nextRun.setMinutes(nextMinute)
        }
      } else {
        const targetMinute = parseInt(minute)
        nextRun.setMinutes(targetMinute)
        if (targetMinute <= now.getMinutes()) {
          nextRun.setHours(nextRun.getHours() + 1)
        }
      }
    } else {
      nextRun.setMinutes(nextRun.getMinutes() + 1)
    }

    if (hour !== '*') {
      if (!hour.startsWith('*/')) {
        const targetHour = parseInt(hour)
        nextRun.setHours(targetHour)
        if (targetHour < now.getHours() || (targetHour === now.getHours() && nextRun <= now)) {
          nextRun.setDate(nextRun.getDate() + 1)
        }
      }
    }

    return nextRun
  }

  // Default: 1 hour from now
  return new Date(now.getTime() + 3600000)
}

export async function GET(request: NextRequest) {
  return runScheduledWorkflows(request)
}

export async function POST(request: NextRequest) {
  return runScheduledWorkflows(request)
}

async function runScheduledWorkflows(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronHeader = request.headers.get('x-cron-secret')

    const providedSecret = authHeader?.replace('Bearer ', '') || cronHeader

    if (providedSecret !== CRON_SECRET) {
      // Also allow Vercel's cron verification
      const vercelCronHeader = request.headers.get('x-vercel-cron')
      if (!vercelCronHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get schedules that are due
    const { data: schedules, error } = await supabase
      .from('workflow_schedules')
      .select(`
        id,
        workflow_id,
        user_id,
        schedule_type,
        cron_expression,
        interval_seconds,
        timezone
      `)
      .eq('is_active', true)
      .is('auto_disabled_at', null)
      .lte('next_run_at', new Date().toISOString())
      .limit(50) // Process up to 50 per invocation

    if (error) {
      console.error('Error fetching due schedules:', error)
      return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
    }

    if (!schedules || schedules.length === 0) {
      return NextResponse.json({
        message: 'No schedules due',
        processed: 0
      })
    }

    const results: Array<{
      scheduleId: string
      workflowId: string
      success: boolean
      executionId?: string
      error?: string
    }> = []

    // Process each schedule
    for (const schedule of schedules as ScheduleRecord[]) {
      try {
        // Execute the workflow
        const result = await executeWorkflowById(
          schedule.workflow_id,
          schedule.user_id,
          {},
          {
            triggeredBy: 'schedule',
            triggerMetadata: {
              schedule_id: schedule.id,
              schedule_type: schedule.schedule_type,
              cron_expression: schedule.cron_expression
            }
          }
        )

        const success = result.status === 'completed'

        // Calculate next run time
        const nextRunAt = schedule.schedule_type === 'once'
          ? null
          : calculateNextRun(
            schedule.schedule_type,
            schedule.cron_expression,
            schedule.interval_seconds
          )

        // Update schedule
        const updateData: Record<string, unknown> = {
          last_run_at: new Date().toISOString(),
          run_count: supabase.rpc('increment', { row_id: schedule.id, column_name: 'run_count' }),
          consecutive_failures: success ? 0 : undefined,
          updated_at: new Date().toISOString()
        }

        if (nextRunAt) {
          updateData.next_run_at = nextRunAt.toISOString()
        } else if (schedule.schedule_type === 'once') {
          updateData.is_active = false
        }

        // Use raw SQL update for atomic operations
        await supabase.rpc('update_schedule_after_run', {
          p_schedule_id: schedule.id,
          p_success: success,
          p_next_run_at: nextRunAt?.toISOString() || null
        })

        results.push({
          scheduleId: schedule.id,
          workflowId: schedule.workflow_id,
          success,
          executionId: result.executionId
        })
      } catch (err) {
        console.error(`Error executing schedule ${schedule.id}:`, err)

        // Update failure count
        await supabase.rpc('update_schedule_after_run', {
          p_schedule_id: schedule.id,
          p_success: false,
          p_next_run_at: calculateNextRun(
            schedule.schedule_type,
            schedule.cron_expression,
            schedule.interval_seconds
          ).toISOString()
        })

        results.push({
          scheduleId: schedule.id,
          workflowId: schedule.workflow_id,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      message: `Processed ${results.length} schedules`,
      processed: results.length,
      successful,
      failed,
      results
    })
  } catch (error) {
    console.error('Cron workflow runner error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

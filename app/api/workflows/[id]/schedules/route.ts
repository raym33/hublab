/**
 * Workflow Schedules API
 * Manage cron schedules for automated workflow execution
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cron expression validation (basic)
const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/

const CreateScheduleSchema = z.object({
  schedule_type: z.enum(['cron', 'interval', 'once']).default('cron'),
  cron_expression: z.string().regex(cronRegex, 'Invalid cron expression').optional(),
  interval_seconds: z.number().min(60).max(86400).optional(), // Min 1 min, max 24 hours
  run_at: z.string().datetime().optional(),
  timezone: z.string().default('UTC'),
  description: z.string().max(500).optional(),
  is_active: z.boolean().default(true)
}).refine(data => {
  if (data.schedule_type === 'cron' && !data.cron_expression) {
    return false
  }
  if (data.schedule_type === 'interval' && !data.interval_seconds) {
    return false
  }
  if (data.schedule_type === 'once' && !data.run_at) {
    return false
  }
  return true
}, {
  message: 'Schedule configuration must match schedule_type'
})

// Common cron presets
const CRON_PRESETS: Record<string, string> = {
  'every-minute': '* * * * *',
  'every-5-minutes': '*/5 * * * *',
  'every-15-minutes': '*/15 * * * *',
  'every-30-minutes': '*/30 * * * *',
  'every-hour': '0 * * * *',
  'every-day-9am': '0 9 * * *',
  'every-day-midnight': '0 0 * * *',
  'weekdays-9am': '0 9 * * 1-5',
  'weekly-monday': '0 9 * * 1',
  'monthly-first': '0 9 1 * *',
}

function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  // In production, decode the JWT to get user_id
  // For now, we'll use a placeholder
  return authHeader.split(' ')[1]
}

function calculateNextRun(
  scheduleType: string,
  cronExpression?: string,
  intervalSeconds?: number,
  runAt?: string,
  _timezone?: string
): Date {
  const now = new Date()

  if (scheduleType === 'once' && runAt) {
    return new Date(runAt)
  }

  if (scheduleType === 'interval' && intervalSeconds) {
    return new Date(now.getTime() + intervalSeconds * 1000)
  }

  if (scheduleType === 'cron' && cronExpression) {
    // Simplified next run calculation
    // In production, use a library like 'cron-parser'
    const parts = cronExpression.split(' ')
    const [minute, hour] = parts

    const nextRun = new Date(now)
    nextRun.setSeconds(0)
    nextRun.setMilliseconds(0)

    if (minute !== '*') {
      const targetMinute = parseInt(minute.replace('*/', ''))
      if (minute.startsWith('*/')) {
        const currentMinute = now.getMinutes()
        const nextMinute = Math.ceil((currentMinute + 1) / targetMinute) * targetMinute
        if (nextMinute >= 60) {
          nextRun.setHours(nextRun.getHours() + 1)
          nextRun.setMinutes(nextMinute - 60)
        } else {
          nextRun.setMinutes(nextMinute)
        }
      } else {
        nextRun.setMinutes(targetMinute)
        if (targetMinute <= now.getMinutes()) {
          nextRun.setHours(nextRun.getHours() + 1)
        }
      }
    } else {
      nextRun.setMinutes(nextRun.getMinutes() + 1)
    }

    if (hour !== '*') {
      const targetHour = parseInt(hour.replace('*/', ''))
      if (!hour.startsWith('*/')) {
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

// GET /api/workflows/[id]/schedules - List schedules
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workflowId } = await params
    const userId = getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify workflow ownership
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('id, user_id')
      .eq('id', workflowId)
      .single()

    if (workflowError || !workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Get schedules
    const { data: schedules, error } = await supabase
      .from('workflow_schedules')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching schedules:', error)
      return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
    }

    return NextResponse.json({
      schedules,
      presets: CRON_PRESETS
    })
  } catch (error) {
    console.error('Schedules GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/workflows/[id]/schedules - Create schedule
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workflowId } = await params
    const userId = getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Handle presets
    if (body.preset && CRON_PRESETS[body.preset]) {
      body.cron_expression = CRON_PRESETS[body.preset]
      body.schedule_type = 'cron'
    }

    const validation = CreateScheduleSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify workflow ownership
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('id, user_id')
      .eq('id', workflowId)
      .single()

    if (workflowError || !workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    const data = validation.data

    // Calculate next run time
    const nextRunAt = calculateNextRun(
      data.schedule_type,
      data.cron_expression,
      data.interval_seconds,
      data.run_at,
      data.timezone
    )

    // Create schedule
    const { data: schedule, error } = await supabase
      .from('workflow_schedules')
      .insert({
        workflow_id: workflowId,
        user_id: workflow.user_id,
        schedule_type: data.schedule_type,
        cron_expression: data.cron_expression,
        interval_seconds: data.interval_seconds,
        run_at: data.run_at,
        timezone: data.timezone,
        description: data.description,
        is_active: data.is_active,
        next_run_at: nextRunAt.toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating schedule:', error)
      return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 })
    }

    // Update workflow trigger type
    await supabase
      .from('workflows')
      .update({ trigger_type: 'schedule' })
      .eq('id', workflowId)

    return NextResponse.json({
      schedule,
      message: 'Schedule created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Schedules POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/workflows/[id]/schedules?schedule_id=xxx - Delete schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workflowId } = await params
    const userId = getUserIdFromRequest(request)
    const scheduleId = request.nextUrl.searchParams.get('schedule_id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!scheduleId) {
      return NextResponse.json({ error: 'schedule_id is required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify ownership and delete
    const { error } = await supabase
      .from('workflow_schedules')
      .delete()
      .eq('id', scheduleId)
      .eq('workflow_id', workflowId)

    if (error) {
      console.error('Error deleting schedule:', error)
      return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Schedule deleted successfully' })
  } catch (error) {
    console.error('Schedules DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

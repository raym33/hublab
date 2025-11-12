import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { escapeHtml, sanitizeEmail, sanitizeName } from '@/lib/sanitize'
import { logger } from '@/lib/logger'
import { rateLimiter, getClientIp } from '@/lib/rate-limit'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // Rate limiting: 3 requests per minute per IP
  const clientIp = getClientIp(request)
  const isAllowed = rateLimiter.check(clientIp, 3, 60000)

  if (!isAllowed) {
    logger.warn('Waitlist: Rate limit exceeded', { ip: clientIp })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const { email, name } = await request.json()

    // Validate input
    if (!email || !name) {
      logger.warn('Waitlist: Missing required fields')
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    let sanitizedEmail: string
    let sanitizedName: string

    try {
      sanitizedEmail = sanitizeEmail(email)
      sanitizedName = sanitizeName(name)
    } catch (error) {
      logger.warn('Waitlist: Invalid input format', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid input format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingEntry, error: checkError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', sanitizedEmail)
      .single()

    if (existingEntry) {
      logger.info('Waitlist: Duplicate email attempt', { email: sanitizedEmail })
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      )
    }

    // Insert into waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: sanitizedEmail,
          name: sanitizedName,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      logger.error('Waitlist: Supabase insert failed', error)
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      )
    }

    // Send email notification to hublab@outlook.es
    try {
      if (resend) {
        await resend.emails.send({
        from: 'HubLab Waitlist <onboarding@resend.dev>',
        to: 'hublab@outlook.es',
        subject: `New Waitlist Signup: ${sanitizedName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827;">New Waitlist Registration</h2>
            <p>Someone just joined the HubLab waitlist!</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${sanitizedName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${sanitizedEmail}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}</p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              View all waitlist entries in your Supabase dashboard.
            </p>
          </div>
        `,
        })
      }
    } catch (emailError) {
      logger.error('Waitlist: Failed to send notification email', emailError)
      // Don't fail the request if email fails - user is already in waitlist
    }

    logger.info('Waitlist: New signup', {
      email: sanitizedEmail,
      duration: Date.now() - startTime
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined the waitlist',
        data
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Waitlist API error', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint can be used to get waitlist count or admin purposes
    const { searchParams } = new URL(request.url)
    const count = searchParams.get('count')

    if (count === 'true') {
      const { count: waitlistCount, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch waitlist count' },
          { status: 500 }
        )
      }

      return NextResponse.json({ count: waitlistCount })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

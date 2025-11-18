import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// SECURITY FIX: Validate environment variables instead of using non-null assertion
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

// Initialize supabase client only if both URL and key are available
const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Log warning if not configured (only in development)
if (!supabase && process.env.NODE_ENV === 'development') {
  console.warn('⚠️  Waitlist API: Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY.')
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Waitlist service is not configured' },
        { status: 503 }
      )
    }

    // Parse and validate JSON body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { email, name } = body

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingEntry, error: checkError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingEntry) {
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
          email: email.toLowerCase(),
          name: name.trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
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
        subject: `New Waitlist Signup: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827;">New Waitlist Registration</h2>
            <p>Someone just joined the HubLab waitlist!</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
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
      console.error('Email sending error:', emailError)
      // Don't fail the request if email fails - user is already in waitlist
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined the waitlist',
        data
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Waitlist service is not configured' },
        { status: 503 }
      )
    }

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

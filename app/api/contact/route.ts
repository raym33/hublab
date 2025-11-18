import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
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

    const { email, name, message } = body

    // Validate required fields
    if (!email || !name || !message) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Send email notification to hublab@outlook.es
    try {
      if (!resend) {
        return NextResponse.json(
          { error: 'Email service is not configured' },
          { status: 503 }
        )
      }

      await resend.emails.send({
        from: 'HubLab Contact <onboarding@resend.dev>',
        to: 'hublab@outlook.es',
        replyTo: email,
        subject: `New Contact Message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827;">New Contact Form Submission</h2>
            <p>You have received a new message from the HubLab contact form.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}</p>
            </div>

            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
              <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              You can reply directly to this email to respond to ${name}.
            </p>
          </div>
        `,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Message sent successfully'
        },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

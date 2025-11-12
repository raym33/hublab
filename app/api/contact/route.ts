import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { escapeHtml, sanitizeEmail, sanitizeName } from '@/lib/sanitize'
import { logger } from '@/lib/logger'
import { rateLimiter, getClientIp } from '@/lib/rate-limit'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // Rate limiting: 5 requests per minute per IP
  const clientIp = getClientIp(request)
  const isAllowed = rateLimiter.check(clientIp, 5, 60000)

  if (!isAllowed) {
    logger.warn('Contact form: Rate limit exceeded', { ip: clientIp })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const { email, name, message } = await request.json()

    // Validate required fields
    if (!email || !name || !message) {
      logger.warn('Contact form: Missing required fields')
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.trim().length < 10) {
      logger.warn('Contact form: Message too short')
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
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
      logger.warn('Contact form: Invalid input format', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid input format' },
        { status: 400 }
      )
    }

    // Sanitize message for HTML display
    const sanitizedMessage = escapeHtml(message.trim())

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
        replyTo: sanitizedEmail,
        subject: `New Contact Message from ${sanitizedName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827;">New Contact Form Submission</h2>
            <p>You have received a new message from the HubLab contact form.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${sanitizedName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${sanitizedEmail}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}</p>
            </div>

            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
              <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              You can reply directly to this email to respond to ${sanitizedName}.
            </p>
          </div>
        `,
      })

      logger.info('Contact form submitted successfully', {
        from: sanitizedEmail,
        duration: Date.now() - startTime
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Message sent successfully'
        },
        { status: 200 }
      )
    } catch (emailError) {
      logger.error('Failed to send contact email', emailError)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    logger.error('Contact API error', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

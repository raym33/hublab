import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema, validateRequest } from '@/lib/validation-schemas'
import { standardLimiter, getClientIdentifier } from '@/lib/rate-limiter'

// Simple HTML escape function for email content (server-side safe)
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - prevent spam (using distributed Redis if available)
    const clientId = getClientIdentifier(request)
    const isAllowed = await standardLimiter.allowRequest(clientId)
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
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

    // Validate with Zod schema
    const validation = validateRequest(contactSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { email, name, message } = validation.data

    // Send email notification to hublab@outlook.es
    try {
      if (!resend) {
        return NextResponse.json(
          { error: 'Email service is not configured' },
          { status: 503 }
        )
      }

      // Escape all user inputs before embedding in HTML email
      const sanitizedName = escapeHtml(name)
      const sanitizedEmail = escapeHtml(email)
      const sanitizedMessage = escapeHtml(message)

      await resend.emails.send({
        from: 'HubLab Contact <onboarding@resend.dev>',
        to: 'hublab@outlook.es',
        replyTo: email,
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

// ============================================
// RESEND EMAIL INTEGRATION HELPERS
// Simple, developer-friendly transactional email API
// ============================================

import { Resend as ResendClient } from 'resend'

export type ResendConfig = {
  apiKey: string
}

export type EmailConfig = {
  from: string
  to: string | string[]
  subject: string
  html?: string
  text?: string
  react?: React.ReactElement
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string | string[]
  tags?: Array<{ name: string; value: string }>
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

export type BulkEmailConfig = {
  emails: EmailConfig[]
}

// ============================================
// RESEND CLIENT
// ============================================

let resendClient: ResendClient | null = null

export function getResendClient(apiKey?: string): ResendClient {
  if (!resendClient) {
    const key = apiKey || process.env.RESEND_API_KEY
    if (!key) {
      throw new Error('Resend API key is required')
    }
    resendClient = new ResendClient(key)
  }
  return resendClient
}

// ============================================
// SEND EMAIL
// ============================================

export async function sendEmail(config: EmailConfig) {
  const resend = getResendClient()

  const result = await resend.emails.send({
    from: config.from,
    to: Array.isArray(config.to) ? config.to : [config.to],
    subject: config.subject,
    html: config.html,
    text: config.text,
    react: config.react,
    cc: config.cc,
    bcc: config.bcc,
    reply_to: config.replyTo,
    tags: config.tags,
    attachments: config.attachments,
  })

  return result
}

// ============================================
// SEND BULK EMAILS
// ============================================

export async function sendBulkEmails(configs: EmailConfig[]) {
  const resend = getResendClient()

  const result = await resend.batch.send(
    configs.map((config) => ({
      from: config.from,
      to: Array.isArray(config.to) ? config.to : [config.to],
      subject: config.subject,
      html: config.html,
      text: config.text,
      react: config.react,
      cc: config.cc,
      bcc: config.bcc,
      reply_to: config.replyTo,
      tags: config.tags,
      attachments: config.attachments,
    }))
  )

  return result
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export const emailTemplates = {
  welcome: (name: string, verifyUrl: string) => ({
    subject: 'Welcome to Our Platform!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Welcome to Our Platform!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hi ${name},
                      </p>
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Thank you for joining us! We're excited to have you on board.
                      </p>
                      <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                        To get started, please verify your email address by clicking the button below:
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="${verifyUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        If you didn't create this account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                      <p style="margin: 0; color: #666666; font-size: 12px;">
                        © 2025 Your Company. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  resetPassword: (name: string, resetUrl: string) => ({
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #dc3545; padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff;">Password Reset Request</h1>
            </div>
            <div style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">Hi ${name},</p>
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; background-color: #dc3545; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p style="margin: 0; color: #666666; font-size: 14px;">
                This link will expire in 1 hour. If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  notification: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px;">
            <h2 style="margin: 0 0 20px; color: #333333;">${title}</h2>
            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">${message}</p>
            ${
              actionUrl && actionText
                ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px;">
                  ${actionText}
                </a>
              </div>
            `
                : ''
            }
          </div>
        </body>
      </html>
    `,
  }),
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function sendWelcomeEmail(
  to: string,
  name: string,
  verifyUrl: string,
  from: string = 'onboarding@example.com'
) {
  const template = emailTemplates.welcome(name, verifyUrl)
  return sendEmail({
    from,
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string,
  from: string = 'security@example.com'
) {
  const template = emailTemplates.resetPassword(name, resetUrl)
  return sendEmail({
    from,
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendNotificationEmail(
  to: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string,
  from: string = 'notifications@example.com'
) {
  const template = emailTemplates.notification(title, message, actionUrl, actionText)
  return sendEmail({
    from,
    to,
    subject: template.subject,
    html: template.html,
  })
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Send Simple Email
import { sendEmail } from '@/lib/integrations/resend'

await sendEmail({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Hello from Resend',
  html: '<p>This is a test email</p>',
})

// Example 2: Send Welcome Email
import { sendWelcomeEmail } from '@/lib/integrations/resend'

await sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  'https://yourapp.com/verify?token=abc123',
  'onboarding@yourapp.com'
)

// Example 3: Send Password Reset Email
import { sendPasswordResetEmail } from '@/lib/integrations/resend'

await sendPasswordResetEmail(
  'user@example.com',
  'John Doe',
  'https://yourapp.com/reset?token=xyz789',
  'security@yourapp.com'
)

// Example 4: Send with Attachments
await sendEmail({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Invoice #12345',
  html: '<p>Please find your invoice attached</p>',
  attachments: [
    {
      filename: 'invoice.pdf',
      content: pdfBuffer,
      contentType: 'application/pdf',
    },
  ],
})

// Example 5: Send Bulk Emails
import { sendBulkEmails } from '@/lib/integrations/resend'

await sendBulkEmails([
  {
    from: 'newsletter@example.com',
    to: 'user1@example.com',
    subject: 'Weekly Newsletter',
    html: '<p>Newsletter content</p>',
  },
  {
    from: 'newsletter@example.com',
    to: 'user2@example.com',
    subject: 'Weekly Newsletter',
    html: '<p>Newsletter content</p>',
  },
])

// Example 6: Send with React Component (using @react-email/components)
import { sendEmail } from '@/lib/integrations/resend'
import { EmailTemplate } from '@/components/emails/template'

await sendEmail({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  react: <EmailTemplate name="John" />,
})

// Example 7: API Route Handler
import { sendEmail } from '@/lib/integrations/resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { to, subject, message } = await request.json()

  try {
    const result = await sendEmail({
      from: 'notifications@example.com',
      to,
      subject,
      html: `<p>${message}</p>`,
    })

    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
*/

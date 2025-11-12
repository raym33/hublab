// ============================================
// SENDGRID INTEGRATION HELPERS
// Email marketing, newsletters, and transactional emails
// ============================================

import sgMail from '@sendgrid/mail'

export type SendGridConfig = {
  apiKey: string
}

export type EmailMessage = {
  to: string | string[]
  from: string
  subject: string
  text?: string
  html?: string
  templateId?: string
  dynamicTemplateData?: Record<string, any>
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string
  attachments?: Array<{
    content: string
    filename: string
    type?: string
    disposition?: 'attachment' | 'inline'
  }>
  categories?: string[]
  customArgs?: Record<string, string>
}

export type BulkEmailMessage = EmailMessage[]

// ============================================
// SENDGRID CLIENT
// ============================================

let isConfigured = false

export function configureSendGrid(apiKey?: string) {
  if (!isConfigured) {
    const key = apiKey || process.env.SENDGRID_API_KEY
    if (!key) {
      throw new Error('SendGrid API key is required')
    }
    sgMail.setApiKey(key)
    isConfigured = true
  }
  return sgMail
}

// ============================================
// SEND EMAIL
// ============================================

export async function sendEmail(message: EmailMessage) {
  const sg = configureSendGrid()

  try {
    const response = await sg.send(message)
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
      statusCode: response[0].statusCode,
    }
  } catch (error: any) {
    console.error('SendGrid error:', error.response?.body)
    throw error
  }
}

// ============================================
// SEND BULK EMAILS
// ============================================

export async function sendBulkEmails(messages: BulkEmailMessage) {
  const sg = configureSendGrid()

  try {
    const response = await sg.send(messages)
    return {
      success: true,
      count: messages.length,
      responses: response,
    }
  } catch (error: any) {
    console.error('SendGrid bulk error:', error.response?.body)
    throw error
  }
}

// ============================================
// SEND WITH TEMPLATE
// ============================================

export async function sendTemplateEmail(
  to: string | string[],
  templateId: string,
  dynamicData: Record<string, any>,
  from: string
) {
  return sendEmail({
    to,
    from,
    templateId,
    dynamicTemplateData: dynamicData,
  })
}

// ============================================
// LISTS & CONTACTS
// ============================================

export async function addContactToList(
  email: string,
  listId: string,
  customFields?: Record<string, any>
) {
  const sg = configureSendGrid()

  const data = {
    list_ids: [listId],
    contacts: [
      {
        email,
        ...customFields,
      },
    ],
  }

  try {
    const response = await sg.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: data,
    })

    return {
      success: true,
      jobId: response[1].job_id,
    }
  } catch (error: any) {
    console.error('SendGrid add contact error:', error.response?.body)
    throw error
  }
}

export async function removeContactFromList(email: string, listId: string) {
  const sg = configureSendGrid()

  try {
    // First, search for the contact
    const searchResponse = await sg.request({
      method: 'POST',
      url: '/v3/marketing/contacts/search',
      body: {
        query: `email='${email}'`,
      },
    })

    const contactId = searchResponse[1].result?.[0]?.id

    if (!contactId) {
      throw new Error('Contact not found')
    }

    // Remove from list
    await sg.request({
      method: 'DELETE',
      url: `/v3/marketing/lists/${listId}/contacts`,
      qs: { contact_ids: contactId },
    })

    return { success: true }
  } catch (error: any) {
    console.error('SendGrid remove contact error:', error.response?.body)
    throw error
  }
}

// ============================================
// MARKETING CAMPAIGNS
// ============================================

export async function createSingleSend(config: {
  name: string
  subject: string
  htmlContent: string
  plainContent?: string
  senderId: number
  listIds: string[]
  suppression_group_id?: number
  categories?: string[]
}) {
  const sg = configureSendGrid()

  const data = {
    name: config.name,
    send_to: {
      list_ids: config.listIds,
    },
    email_config: {
      subject: config.subject,
      html_content: config.htmlContent,
      plain_content: config.plainContent || '',
      sender_id: config.senderId,
      suppression_group_id: config.suppression_group_id,
    },
    categories: config.categories,
  }

  try {
    const response = await sg.request({
      method: 'POST',
      url: '/v3/marketing/singlesends',
      body: data,
    })

    return {
      success: true,
      id: response[1].id,
    }
  } catch (error: any) {
    console.error('SendGrid create single send error:', error.response?.body)
    throw error
  }
}

export async function scheduleSingleSend(singleSendId: string, sendAt: Date) {
  const sg = configureSendGrid()

  try {
    await sg.request({
      method: 'PUT',
      url: `/v3/marketing/singlesends/${singleSendId}/schedule`,
      body: {
        send_at: sendAt.toISOString(),
      },
    })

    return { success: true, scheduledAt: sendAt }
  } catch (error: any) {
    console.error('SendGrid schedule error:', error.response?.body)
    throw error
  }
}

// ============================================
// STATS & ANALYTICS
// ============================================

export async function getEmailStats(startDate: string, endDate?: string) {
  const sg = configureSendGrid()

  const params: any = { start_date: startDate }
  if (endDate) params.end_date = endDate

  try {
    const response = await sg.request({
      method: 'GET',
      url: '/v3/stats',
      qs: params,
    })

    return response[1]
  } catch (error: any) {
    console.error('SendGrid stats error:', error.response?.body)
    throw error
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function sendMarketingEmail(
  to: string[],
  subject: string,
  html: string,
  from: string,
  categories?: string[]
) {
  return sendEmail({
    to,
    from,
    subject,
    html,
    categories,
  })
}

export async function sendNewsletterEmail(
  listId: string,
  subject: string,
  htmlContent: string,
  senderId: number,
  scheduledAt?: Date
) {
  const singleSend = await createSingleSend({
    name: `Newsletter - ${new Date().toISOString()}`,
    subject,
    htmlContent,
    senderId,
    listIds: [listId],
    categories: ['newsletter'],
  })

  if (scheduledAt) {
    await scheduleSingleSend(singleSend.id, scheduledAt)
  }

  return singleSend
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export const emailTemplates = {
  welcomeEmail: (name: string, verifyUrl: string) => ({
    subject: 'Welcome to Our Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome, ${name}!</h1>
        <p>Thank you for joining us. We're excited to have you on board!</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Verify Your Email
        </a>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    `,
  }),

  newsletterTemplate: (title: string, content: string, unsubscribeUrl: string) => ({
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${title}</h1>
        <div style="line-height: 1.6; color: #555;">
          ${content}
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; color: #999; font-size: 12px;">
          <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
        </p>
      </div>
    `,
  }),

  promotionalEmail: (productName: string, discount: string, ctaUrl: string) => ({
    subject: `Special Offer: ${discount} off ${productName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <h1 style="color: #333;">Limited Time Offer!</h1>
        <h2 style="color: #007bff; font-size: 36px;">${discount} OFF</h2>
        <p style="font-size: 18px; color: #555;">${productName}</p>
        <a href="${ctaUrl}" style="display: inline-block; padding: 16px 32px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; font-size: 18px; margin: 20px 0;">
          Shop Now
        </a>
        <p style="color: #666; font-size: 14px;">Offer expires soon!</p>
      </div>
    `,
  }),
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Send Simple Email
import { sendEmail } from '@/lib/integrations/sendgrid'

await sendEmail({
  to: 'user@example.com',
  from: 'hello@yourcompany.com',
  subject: 'Welcome!',
  html: '<p>Thanks for signing up!</p>',
})

// Example 2: Send with Template
import { sendTemplateEmail } from '@/lib/integrations/sendgrid'

await sendTemplateEmail(
  'user@example.com',
  'd-1234567890abcdef', // SendGrid template ID
  {
    name: 'John Doe',
    verification_link: 'https://yourapp.com/verify?token=abc',
  },
  'hello@yourcompany.com'
)

// Example 3: Send Bulk Emails
import { sendBulkEmails } from '@/lib/integrations/sendgrid'

await sendBulkEmails([
  {
    to: 'user1@example.com',
    from: 'newsletter@yourcompany.com',
    subject: 'Newsletter #1',
    html: '<p>Newsletter content</p>',
  },
  {
    to: 'user2@example.com',
    from: 'newsletter@yourcompany.com',
    subject: 'Newsletter #1',
    html: '<p>Newsletter content</p>',
  },
])

// Example 4: Add Contact to List
import { addContactToList } from '@/lib/integrations/sendgrid'

await addContactToList('user@example.com', 'list-id-123', {
  first_name: 'John',
  last_name: 'Doe',
  city: 'New York',
})

// Example 5: Send Newsletter
import { sendNewsletterEmail } from '@/lib/integrations/sendgrid'

const sendAt = new Date()
sendAt.setDate(sendAt.getDate() + 1) // Schedule for tomorrow

await sendNewsletterEmail(
  'list-id-123',
  'Weekly Newsletter',
  '<h1>This Week in Tech</h1><p>Content here...</p>',
  12345, // sender ID
  sendAt
)

// Example 6: Get Email Stats
import { getEmailStats } from '@/lib/integrations/sendgrid'

const stats = await getEmailStats('2025-01-01', '2025-01-31')
console.log('Opens:', stats[0].stats[0].metrics.opens)
console.log('Clicks:', stats[0].stats[0].metrics.clicks)

// Example 7: Marketing Email with Categories
import { sendMarketingEmail } from '@/lib/integrations/sendgrid'

await sendMarketingEmail(
  ['user1@example.com', 'user2@example.com'],
  'New Product Launch',
  '<h1>Introducing Product X</h1>',
  'marketing@yourcompany.com',
  ['product-launch', 'marketing']
)

// Example 8: API Route for Newsletter Signup
import { addContactToList } from '@/lib/integrations/sendgrid'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, name } = await request.json()

  try {
    await addContactToList(email, process.env.SENDGRID_LIST_ID!, {
      first_name: name,
      signed_up_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
*/

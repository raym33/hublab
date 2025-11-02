// ============================================
// TWILIO INTEGRATION HELPERS
// SMS, WhatsApp, Voice, and Video communications
// ============================================

import twilio from 'twilio'

export type TwilioConfig = {
  accountSid: string
  authToken: string
  phoneNumber: string
}

export type SMSConfig = {
  to: string
  body: string
  from?: string
  mediaUrl?: string[]
  statusCallback?: string
}

export type WhatsAppConfig = {
  to: string
  body: string
  from?: string
  mediaUrl?: string[]
}

export type VoiceCallConfig = {
  to: string
  from?: string
  url: string // TwiML URL
  statusCallback?: string
}

// ============================================
// TWILIO CLIENT
// ============================================

let twilioClient: ReturnType<typeof twilio> | null = null
let twilioConfig: TwilioConfig | null = null

export function getTwilioClient(config?: TwilioConfig) {
  if (!twilioClient) {
    const accountSid = config?.accountSid || process.env.TWILIO_ACCOUNT_SID
    const authToken = config?.authToken || process.env.TWILIO_AUTH_TOKEN
    const phoneNumber = config?.phoneNumber || process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !phoneNumber) {
      throw new Error('Twilio credentials are required')
    }

    twilioConfig = { accountSid, authToken, phoneNumber }
    twilioClient = twilio(accountSid, authToken)
  }

  return { client: twilioClient, config: twilioConfig! }
}

// ============================================
// SMS MESSAGING
// ============================================

export async function sendSMS(config: SMSConfig) {
  const { client, config: twilioConf } = getTwilioClient()

  const message = await client.messages.create({
    to: config.to,
    from: config.from || twilioConf.phoneNumber,
    body: config.body,
    mediaUrl: config.mediaUrl,
    statusCallback: config.statusCallback,
  })

  return message
}

export async function sendBulkSMS(recipients: string[], body: string) {
  const { client, config: twilioConf } = getTwilioClient()

  const results = await Promise.allSettled(
    recipients.map((to) =>
      client.messages.create({
        to,
        from: twilioConf.phoneNumber,
        body,
      })
    )
  )

  return results
}

// ============================================
// WHATSAPP MESSAGING
// ============================================

export async function sendWhatsApp(config: WhatsAppConfig) {
  const { client, config: twilioConf } = getTwilioClient()

  // WhatsApp numbers must be prefixed with 'whatsapp:'
  const to = config.to.startsWith('whatsapp:') ? config.to : `whatsapp:${config.to}`
  const from = config.from
    ? config.from.startsWith('whatsapp:')
      ? config.from
      : `whatsapp:${config.from}`
    : `whatsapp:${twilioConf.phoneNumber}`

  const message = await client.messages.create({
    to,
    from,
    body: config.body,
    mediaUrl: config.mediaUrl,
  })

  return message
}

// ============================================
// VOICE CALLS
// ============================================

export async function makeCall(config: VoiceCallConfig) {
  const { client, config: twilioConf } = getTwilioClient()

  const call = await client.calls.create({
    to: config.to,
    from: config.from || twilioConf.phoneNumber,
    url: config.url,
    statusCallback: config.statusCallback,
  })

  return call
}

// ============================================
// VERIFICATION (2FA)
// ============================================

export async function sendVerificationCode(to: string, channel: 'sms' | 'call' | 'whatsapp' = 'sms') {
  const { client } = getTwilioClient()
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID

  if (!serviceSid) {
    throw new Error('Twilio Verify Service SID is required')
  }

  const verification = await client.verify.v2
    .services(serviceSid)
    .verifications.create({ to, channel })

  return verification
}

export async function verifyCode(to: string, code: string) {
  const { client } = getTwilioClient()
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID

  if (!serviceSid) {
    throw new Error('Twilio Verify Service SID is required')
  }

  const verificationCheck = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to, code })

  return verificationCheck.status === 'approved'
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function sendOTP(phoneNumber: string, channel: 'sms' | 'whatsapp' = 'sms') {
  return sendVerificationCode(phoneNumber, channel)
}

export async function verifyOTP(phoneNumber: string, code: string) {
  return verifyCode(phoneNumber, code)
}

export async function sendNotificationSMS(to: string, message: string) {
  return sendSMS({
    to,
    body: message,
  })
}

export async function sendNotificationWhatsApp(to: string, message: string) {
  return sendWhatsApp({
    to,
    body: message,
  })
}

// ============================================
// MESSAGE TEMPLATES
// ============================================

export const messageTemplates = {
  welcome: (name: string) => `Hi ${name}! Welcome to our platform. We're excited to have you on board!`,

  orderConfirmation: (orderNumber: string, total: string) =>
    `Your order #${orderNumber} has been confirmed! Total: ${total}. Thank you for your purchase!`,

  deliveryUpdate: (orderNumber: string, status: string) =>
    `Update on order #${orderNumber}: ${status}. Track your delivery at https://yourapp.com/track`,

  appointmentReminder: (date: string, time: string, location: string) =>
    `Reminder: You have an appointment on ${date} at ${time}. Location: ${location}`,

  passwordReset: (code: string) =>
    `Your password reset code is: ${code}. This code expires in 10 minutes. If you didn't request this, please ignore.`,

  accountAlert: (action: string) =>
    `Security Alert: ${action} was detected on your account. If this wasn't you, please contact support immediately.`,
}

// ============================================
// TWIML HELPERS (for voice calls)
// ============================================

export function createTwiML(actions: Array<{ type: 'say' | 'play' | 'gather'; content: string }>) {
  const twiml = new twilio.twiml.VoiceResponse()

  actions.forEach((action) => {
    switch (action.type) {
      case 'say':
        twiml.say(action.content)
        break
      case 'play':
        twiml.play(action.content)
        break
      case 'gather':
        twiml.gather({ input: ['dtmf'] }).say(action.content)
        break
    }
  })

  return twiml.toString()
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Send Simple SMS
import { sendSMS } from '@/lib/integrations/twilio'

await sendSMS({
  to: '+1234567890',
  body: 'Hello from Twilio!',
})

// Example 2: Send WhatsApp Message
import { sendWhatsApp } from '@/lib/integrations/twilio'

await sendWhatsApp({
  to: '+1234567890',
  body: 'Hello via WhatsApp!',
})

// Example 3: Send WhatsApp with Image
await sendWhatsApp({
  to: '+1234567890',
  body: 'Check out this image!',
  mediaUrl: ['https://example.com/image.jpg'],
})

// Example 4: Send OTP for 2FA
import { sendOTP, verifyOTP } from '@/lib/integrations/twilio'

// Send OTP
await sendOTP('+1234567890', 'sms')

// Verify OTP
const isValid = await verifyOTP('+1234567890', '123456')
if (isValid) {
  console.log('Code verified!')
}

// Example 5: Send Bulk SMS
import { sendBulkSMS } from '@/lib/integrations/twilio'

await sendBulkSMS(
  ['+1234567890', '+0987654321'],
  'Important announcement: Our service will be down for maintenance tonight.'
)

// Example 6: Send Order Confirmation
import { sendSMS, messageTemplates } from '@/lib/integrations/twilio'

await sendSMS({
  to: '+1234567890',
  body: messageTemplates.orderConfirmation('12345', '$99.99'),
})

// Example 7: Make Voice Call with TwiML
import { makeCall, createTwiML } from '@/lib/integrations/twilio'

// Create TwiML
const twiml = createTwiML([
  { type: 'say', content: 'Hello! This is a reminder about your appointment tomorrow.' },
  { type: 'say', content: 'Press 1 to confirm, or 2 to reschedule.' },
])

// Make call
await makeCall({
  to: '+1234567890',
  url: 'https://yourapp.com/api/twiml', // Endpoint that serves the TwiML
})

// Example 8: API Route for Sending SMS
import { sendSMS } from '@/lib/integrations/twilio'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { to, message } = await request.json()

  try {
    const result = await sendSMS({
      to,
      body: message,
    })

    return NextResponse.json({ success: true, sid: result.sid })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
  }
}

// Example 9: API Route for OTP Verification Flow
import { sendOTP, verifyOTP } from '@/lib/integrations/twilio'
import { NextResponse } from 'next/server'

// Send OTP
export async function POST(request: Request) {
  const { phoneNumber } = await request.json()

  try {
    await sendOTP(phoneNumber, 'sms')
    return NextResponse.json({ success: true, message: 'OTP sent' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

// Verify OTP (in a different route)
export async function POST(request: Request) {
  const { phoneNumber, code } = await request.json()

  try {
    const isValid = await verifyOTP(phoneNumber, code)
    if (isValid) {
      return NextResponse.json({ success: true, message: 'OTP verified' })
    } else {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}

// Example 10: TwiML Endpoint for Voice Calls
import { createTwiML } from '@/lib/integrations/twilio'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const twiml = createTwiML([
    { type: 'say', content: 'Thank you for calling. Your call is important to us.' },
    { type: 'gather', content: 'Press 1 for sales, 2 for support, or 3 for billing.' },
  ])

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}
*/

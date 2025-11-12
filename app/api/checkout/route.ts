import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { prototypeId, prototypeTitle, price } = await request.json()

    if (!prototypeId || !price) {
      logger.warn('Checkout: Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get and validate authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      logger.warn('Checkout: Missing authorization header')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Extract token from Bearer header
    const token = authHeader.replace('Bearer ', '')

    // Verify user with token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      logger.warn('Checkout: Invalid authentication', { error: authError?.message })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    logger.info('Checkout: Creating session', {
      userId: user.id,
      prototypeId
    })

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: prototypeTitle,
              description: `HubLab Prototype`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/prototype/${prototypeId}`,
      metadata: {
        prototypeId,
      },
    })

    // Create purchase record
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert([
        {
          buyer_id: user.id,
          prototype_id: prototypeId,
          stripe_checkout_id: session.id,
          amount: price,
          status: 'pending',
        },
      ])

    if (purchaseError) {
      logger.error('Checkout: Failed to create purchase record', purchaseError)
      // Continue anyway since Stripe session is created
    }

    logger.info('Checkout: Session created successfully', {
      userId: user.id,
      sessionId: session.id,
      duration: Date.now() - startTime
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    logger.error('Checkout error', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

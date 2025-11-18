import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

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

    const { prototypeId } = body

    if (!prototypeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // SECURITY FIX: Fetch price from database instead of trusting client
    const { data: prototype, error: prototypeError } = await supabase
      .from('prototypes')
      .select('id, title, price, published')
      .eq('id', prototypeId)
      .single()

    if (prototypeError || !prototype) {
      return NextResponse.json(
        { error: 'Prototype not found' },
        { status: 404 }
      )
    }

    // Validate prototype is published and has valid price
    if (!prototype.published) {
      return NextResponse.json(
        { error: 'Prototype not available' },
        { status: 400 }
      )
    }

    if (!prototype.price || prototype.price <= 0) {
      return NextResponse.json(
        { error: 'Invalid prototype price' },
        { status: 400 }
      )
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create Stripe session with database price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: prototype.title,
              description: `HubLab Prototype`,
            },
            // Use price from database, not client
            unit_amount: Math.round(prototype.price * 100),
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
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('purchases')
        .insert([
          {
            buyer_id: user.id,
            prototype_id: prototypeId,
            stripe_checkout_id: session.id,
            amount: prototype.price, // Use database price
            status: 'pending',
          },
        ])
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    // Log error securely (don't expose details to client)
    console.error('Checkout error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    })

    // Return generic error to client
    return NextResponse.json(
      { error: 'An unexpected error occurred during checkout' },
      { status: 500 }
    )
  }
}

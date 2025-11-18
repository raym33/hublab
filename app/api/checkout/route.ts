import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { checkoutSchema } from '@/lib/validation/schemas'

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

    // ✅ SECURITY: Validate input with Zod schema
    const validation = checkoutSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }

    const { prototypeId } = validation.data

    // ✅ SECURITY FIX: Fetch price from database - NEVER trust client
    const { data: prototype, error: prototypeError } = await supabase
      .from('prototypes')
      .select('id, title, price')
      .eq('id', prototypeId)
      .single()

    if (prototypeError || !prototype) {
      return NextResponse.json(
        { error: 'Prototype not found' },
        { status: 404 }
      )
    }

    // Validate price from database
    const numericPrice = parseFloat(prototype.price)
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { error: 'Invalid prototype price configuration' },
        { status: 500 }
      )
    }

    const prototypeTitle = prototype.title

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
            unit_amount: Math.round(numericPrice * 100),
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
            amount: numericPrice,
            status: 'pending',
          },
        ])
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

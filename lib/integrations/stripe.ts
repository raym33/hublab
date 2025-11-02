// ============================================
// STRIPE PAYMENT INTEGRATION HELPERS
// ============================================

import Stripe from 'stripe'

export type StripeConfig = {
  secretKey: string
  publishableKey?: string
  apiVersion?: Stripe.LatestApiVersion
}

export type CheckoutSessionConfig = {
  lineItems: Array<{
    price?: string
    quantity: number
    price_data?: {
      currency: string
      product_data: {
        name: string
        description?: string
        images?: string[]
      }
      unit_amount: number
    }
  }>
  mode: 'payment' | 'subscription' | 'setup'
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
  allowPromotionCodes?: boolean
}

export type PaymentIntentConfig = {
  amount: number
  currency: string
  description?: string
  metadata?: Record<string, string>
  customerEmail?: string
  paymentMethodTypes?: string[]
}

export type SubscriptionConfig = {
  customerId: string
  items: Array<{
    price: string
    quantity?: number
  }>
  trialPeriodDays?: number
  metadata?: Record<string, string>
}

// ============================================
// STRIPE CLIENT
// ============================================

let stripeClient: Stripe | null = null

export function getStripeClient(secretKey?: string): Stripe {
  if (!stripeClient) {
    const key = secretKey || process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('Stripe secret key is required')
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  }
  return stripeClient
}

// ============================================
// CHECKOUT SESSION
// ============================================

export async function createCheckoutSession(
  config: CheckoutSessionConfig
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient()

  const session = await stripe.checkout.sessions.create({
    line_items: config.lineItems,
    mode: config.mode,
    success_url: config.successUrl,
    cancel_url: config.cancelUrl,
    customer_email: config.customerEmail,
    metadata: config.metadata,
    allow_promotion_codes: config.allowPromotionCodes,
  })

  return session
}

export async function retrieveCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient()
  return stripe.checkout.sessions.retrieve(sessionId)
}

// ============================================
// PAYMENT INTENTS
// ============================================

export async function createPaymentIntent(
  config: PaymentIntentConfig
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: config.amount,
    currency: config.currency,
    description: config.description,
    metadata: config.metadata,
    receipt_email: config.customerEmail,
    payment_method_types: config.paymentMethodTypes || ['card'],
    automatic_payment_methods: config.paymentMethodTypes ? undefined : {
      enabled: true,
    },
  })

  return paymentIntent
}

export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient()
  return stripe.paymentIntents.retrieve(paymentIntentId)
}

export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient()
  return stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
  })
}

// ============================================
// CUSTOMERS
// ============================================

export async function createCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  const stripe = getStripeClient()

  const customer = await stripe.customers.create({
    email,
    name,
    metadata,
  })

  return customer
}

export async function retrieveCustomer(
  customerId: string
): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
  const stripe = getStripeClient()
  return stripe.customers.retrieve(customerId)
}

export async function updateCustomer(
  customerId: string,
  updates: Stripe.CustomerUpdateParams
): Promise<Stripe.Customer> {
  const stripe = getStripeClient()
  return stripe.customers.update(customerId, updates)
}

export async function deleteCustomer(
  customerId: string
): Promise<Stripe.DeletedCustomer> {
  const stripe = getStripeClient()
  return stripe.customers.del(customerId)
}

// ============================================
// SUBSCRIPTIONS
// ============================================

export async function createSubscription(
  config: SubscriptionConfig
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient()

  const subscription = await stripe.subscriptions.create({
    customer: config.customerId,
    items: config.items,
    trial_period_days: config.trialPeriodDays,
    metadata: config.metadata,
  })

  return subscription
}

export async function retrieveSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient()
  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient()
  return stripe.subscriptions.cancel(subscriptionId, {
    prorate: !immediately,
  })
}

export async function updateSubscription(
  subscriptionId: string,
  updates: Stripe.SubscriptionUpdateParams
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient()
  return stripe.subscriptions.update(subscriptionId, updates)
}

// ============================================
// PRODUCTS & PRICES
// ============================================

export async function createProduct(
  name: string,
  description?: string,
  images?: string[],
  metadata?: Record<string, string>
): Promise<Stripe.Product> {
  const stripe = getStripeClient()

  const product = await stripe.products.create({
    name,
    description,
    images,
    metadata,
  })

  return product
}

export async function createPrice(
  productId: string,
  unitAmount: number,
  currency: string,
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year'
    intervalCount?: number
  }
): Promise<Stripe.Price> {
  const stripe = getStripeClient()

  const price = await stripe.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency,
    recurring,
  })

  return price
}

export async function listPrices(
  productId?: string,
  active?: boolean
): Promise<Stripe.ApiList<Stripe.Price>> {
  const stripe = getStripeClient()

  return stripe.prices.list({
    product: productId,
    active,
  })
}

// ============================================
// WEBHOOKS
// ============================================

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  const stripe = getStripeClient()
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  try {
    constructWebhookEvent(payload, signature, secret)
    return true
  } catch (error) {
    return false
  }
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Create Checkout Session for one-time payment
const session = await createCheckoutSession({
  lineItems: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Pro Plan',
          description: 'Premium features for power users',
        },
        unit_amount: 2999, // $29.99
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  successUrl: 'https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancelUrl: 'https://yoursite.com/cancel',
  customerEmail: 'customer@example.com',
})

console.log('Checkout URL:', session.url)

// Example 2: Create Subscription Checkout
const subscriptionSession = await createCheckoutSession({
  lineItems: [
    {
      price: 'price_1234567890', // Stripe Price ID
      quantity: 1,
    },
  ],
  mode: 'subscription',
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
  allowPromotionCodes: true,
})

// Example 3: Create Payment Intent (for custom payment flow)
const paymentIntent = await createPaymentIntent({
  amount: 5000, // $50.00
  currency: 'usd',
  description: 'Custom order payment',
  customerEmail: 'customer@example.com',
  metadata: {
    orderId: '12345',
    productId: 'prod_abc',
  },
})

console.log('Client Secret:', paymentIntent.client_secret)

// Example 4: Create Customer and Subscription
const customer = await createCustomer(
  'customer@example.com',
  'John Doe',
  { userId: 'user_123' }
)

const subscription = await createSubscription({
  customerId: customer.id,
  items: [{ price: 'price_monthly_pro', quantity: 1 }],
  trialPeriodDays: 14,
  metadata: { plan: 'pro' },
})

// Example 5: Handle Webhook Event (in API route)
export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  try {
    const event = constructWebhookEvent(body, signature, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Payment successful:', session.id)
        // Fulfill order, grant access, etc.
        break

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription
        console.log('New subscription:', subscription.id)
        break

      case 'customer.subscription.deleted':
        const canceledSub = event.data.object as Stripe.Subscription
        console.log('Subscription canceled:', canceledSub.id)
        // Revoke access
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', failedPayment.id)
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 400 })
  }
}

// Example 6: Create Product and Price
const product = await createProduct(
  'Premium Plan',
  'All features included',
  ['https://example.com/image.jpg'],
  { tier: 'premium' }
)

const monthlyPrice = await createPrice(
  product.id,
  2999, // $29.99
  'usd',
  { interval: 'month' }
)

const yearlyPrice = await createPrice(
  product.id,
  29900, // $299.00
  'usd',
  { interval: 'year' }
)
*/

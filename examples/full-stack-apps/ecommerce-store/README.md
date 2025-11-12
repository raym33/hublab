# Full-Stack E-commerce Store

Complete example of a production-ready e-commerce application built with HubLab UI + Backend.

## 📦 What's Included

### Frontend (HubLab Generated)
- Product listing page
- Product detail page
- Shopping cart
- Checkout flow
- User authentication
- Order history

### Backend (Your Custom Code)
- REST API with Next.js API routes
- Stripe payment integration
- Database (Supabase)
- Authentication (NextAuth)
- Order management
- Email notifications

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (HubLab)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Products │  │   Cart   │  │ Checkout │  │  Orders ││
│  │   Page   │  │   Page   │  │   Page   │  │   Page  ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│              API Layer (Next.js API Routes)              │
│  /api/products  /api/cart  /api/checkout  /api/orders   │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                  Services Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Supabase │  │  Stripe  │  │NextAuth │  │  Email  ││
│  │ Database │  │ Payments │  │   Auth   │  │ Service ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Generate UI with HubLab

```bash
# Go to https://hublab.dev/studio-v2

# Add these components:
# - Product Grid (products page)
# - Product Card (product details)
# - Cart Summary (cart page)
# - Checkout Form (checkout page)
# - Data Table (orders page)

# Apply Ocean theme
# Export as Next.js app
```

### 2. Set Up Backend

```bash
# Clone and install
npx create-next-app@latest my-store
cd my-store
npm install @supabase/supabase-js stripe next-auth @stripe/stripe-js
```

### 3. Configure Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# NextAuth
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

# Email (Resend/SendGrid)
EMAIL_FROM=noreply@yourstore.com
EMAIL_API_KEY=your_email_api_key
```

## 📁 Project Structure

```
my-store/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # HubLab Login Form
│   │   └── signup/page.tsx         # HubLab Signup Form
│   ├── products/
│   │   ├── page.tsx                # HubLab Product Grid
│   │   └── [id]/page.tsx           # HubLab Product Detail
│   ├── cart/page.tsx               # HubLab Cart Summary
│   ├── checkout/page.tsx           # HubLab Checkout Form
│   ├── orders/page.tsx             # HubLab Orders Table
│   └── api/
│       ├── products/
│       │   ├── route.ts            # GET all products
│       │   └── [id]/route.ts       # GET single product
│       ├── cart/
│       │   ├── route.ts            # Cart operations
│       │   └── add/route.ts        # Add to cart
│       ├── checkout/
│       │   └── route.ts            # Create checkout session
│       ├── webhooks/
│       │   └── stripe/route.ts     # Stripe webhooks
│       └── orders/
│           └── route.ts            # Get user orders
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── stripe.ts                   # Stripe client
│   └── email.ts                    # Email service
└── types/
    └── index.ts                    # TypeScript types
```

## 💾 Database Schema (Supabase)

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Cart table (for logged-in users)
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

## 🔌 API Endpoints

### Products

```typescript
// app/api/products/route.ts
import { createClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ products });
}
```

### Add to Cart

```typescript
// app/api/cart/add/route.ts
import { createClient } from '@/lib/supabase';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, quantity } = await request.json();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cart')
    .upsert({
      user_id: session.user.id,
      product_id: productId,
      quantity
    }, {
      onConflict: 'user_id,product_id'
    });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, data });
}
```

### Checkout

```typescript
// app/api/checkout/route.ts
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items } = await request.json();
  const supabase = createClient();

  // Calculate total
  const total = items.reduce((sum: number, item: any) =>
    sum + (item.price * item.quantity), 0
  );

  // Create order in database
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: session.user.id,
      total,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    return Response.json({ error: orderError.message }, { status: 500 });
  }

  // Create Stripe checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    metadata: {
      orderId: order.id,
    },
  });

  return Response.json({ url: stripeSession.url });
}
```

### Stripe Webhook

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    const supabase = createClient();

    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_payment_intent_id: session.payment_intent
      })
      .eq('id', orderId);

    // Send confirmation email
    await sendOrderConfirmation(orderId);
  }

  return Response.json({ received: true });
}
```

## 🎨 Frontend Integration

### Products Page (HubLab + Data)

```typescript
// app/products/page.tsx
'use client';

import { ProductGrid } from '@/components/hublab/ProductGrid';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductsPage() {
  const { data, isLoading, error } = useSWR('/api/products', fetcher);

  if (isLoading) {
    return <div className="p-8">Loading products...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error loading products</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      <ProductGrid products={data.products} />
    </div>
  );
}
```

### Cart with Zustand State

```typescript
// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.id === id ? { ...i, quantity } : i
        )
      })),

      clearCart: () => set({ items: [] }),

      total: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

## 📧 Email Notifications

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API_KEY);

export async function sendOrderConfirmation(orderId: string) {
  // Fetch order details from database
  const order = await fetchOrderDetails(orderId);

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: order.user.email,
    subject: `Order Confirmation - #${orderId}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${orderId}</p>
      <p>Total: $${order.total}</p>
      <h2>Items:</h2>
      <ul>
        ${order.items.map((item: any) => `
          <li>${item.name} x ${item.quantity} - $${item.price * item.quantity}</li>
        `).join('')}
      </ul>
    `,
  });
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests with Cypress
npm run cypress:open
```

## 🚀 Deployment

```bash
# 1. Set up Supabase project
# 2. Set up Stripe account
# 3. Deploy to Vercel
vercel --prod

# 4. Set environment variables in Vercel dashboard
# 5. Done!
```

## 📊 Features Checklist

- [x] Product listing with filtering
- [x] Product details page
- [x] Shopping cart (persistent)
- [x] User authentication
- [x] Secure checkout with Stripe
- [x] Order management
- [x] Email notifications
- [x] Admin dashboard (bonus)
- [x] Responsive design
- [x] SEO optimized

## 💡 Key Takeaways

**HubLab provides:**
- ✅ All UI components
- ✅ Layout and styling
- ✅ Responsive design
- ✅ TypeScript types

**You add:**
- ✅ Business logic
- ✅ API integration
- ✅ Database schema
- ✅ Payment processing
- ✅ Email notifications

**Result:** Production-ready e-commerce store in hours, not weeks!

## 📚 Learn More

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth Documentation](https://next-auth.js.org/)
- [HubLab Integration Guide](../../data-integration-guides/)

---

**Estimated Development Time:**
- HubLab UI: 30 minutes
- Backend setup: 2-3 hours
- Testing & deployment: 1 hour
- **Total: 4-5 hours** (vs 2-3 weeks from scratch)

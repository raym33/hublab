# Performance & Testing Guide

Complete guide for optimizing and testing your HubLab-generated applications.

## ⚡ Performance Optimization

### 1. Image Optimization

#### Next.js Image Component
```typescript
// Use next/image instead of <img>
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product"
  width={500}
  height={300}
  priority={false} // Set true for above-the-fold images
  loading="lazy"   // Lazy load by default
  placeholder="blur" // Show blur while loading
  blurDataURL="data:image/..." // Generate with sharp
/>
```

#### Responsive Images
```typescript
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  style={{ objectFit: 'cover' }}
/>
```

### 2. Code Splitting

#### Dynamic Imports
```typescript
// Load heavy components only when needed
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false // Disable SSR for client-only components
});

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart data={data} />
    </div>
  );
}
```

#### Route-based Splitting
```typescript
// Automatically done by Next.js for each page
// app/dashboard/page.tsx - separate bundle
// app/products/page.tsx - separate bundle
```

### 3. Caching Strategies

#### SWR Configuration
```typescript
import useSWR from 'swr';

const { data } = useSWR('/api/products', fetcher, {
  revalidateOnFocus: false,    // Don't refetch on window focus
  revalidateOnReconnect: true, // Refetch on reconnect
  refreshInterval: 60000,      // Refresh every minute
  dedupingInterval: 5000,      // Dedupe requests within 5s
  fallbackData: initialData,   // Initial data while loading
});
```

#### React Query (Alternative)
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 60000,      // Consider data fresh for 1 min
  cacheTime: 300000,     // Keep in cache for 5 min
  refetchOnWindowFocus: false,
});
```

### 4. Bundle Size Optimization

#### Analyze Bundle
```bash
# Install analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});

# Analyze
ANALYZE=true npm run build
```

#### Tree Shaking
```typescript
// ❌ Bad - imports entire library
import _ from 'lodash';

// ✅ Good - imports only what you need
import debounce from 'lodash/debounce';

// Or use ES6 modules
import { debounce } from 'lodash-es';
```

### 5. Memoization

#### React.memo
```typescript
// Prevent unnecessary re-renders
const ProductCard = React.memo(function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
});
```

#### useMemo
```typescript
function ProductList({ products, filter }) {
  // Expensive calculation - only recompute when dependencies change
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === filter);
  }, [products, filter]);

  return (
    <div>
      {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

#### useCallback
```typescript
function ProductList({ products }) {
  // Stable function reference
  const handleDelete = useCallback((id) => {
    deleteProduct(id);
  }, []);

  return (
    <div>
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

### 6. Lazy Loading

#### Intersection Observer
```typescript
function LazyImage({ src, alt }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="h-64 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

### 7. Database Query Optimization

#### Supabase Performance
```typescript
// ❌ Bad - N+1 query problem
const { data: orders } = await supabase.from('orders').select('*');
for (const order of orders) {
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);
}

// ✅ Good - Single query with join
const { data: orders } = await supabase
  .from('orders')
  .select(`
    *,
    order_items (
      *,
      product:products (*)
    )
  `);
```

#### Pagination
```typescript
// Always use pagination for large datasets
const { data, error } = await supabase
  .from('products')
  .select('*')
  .range(0, 19) // First 20 items
  .order('created_at', { ascending: false });
```

### 8. Lighthouse Optimization

#### Target Scores
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

#### Key Metrics
```
First Contentful Paint (FCP): < 1.8s
Largest Contentful Paint (LCP): < 2.5s
Total Blocking Time (TBT): < 200ms
Cumulative Layout Shift (CLS): < 0.1
Speed Index: < 3.4s
```

---

## 🧪 Testing

### 1. Unit Tests (Jest + React Testing Library)

#### Setup
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

#### Test Component
```typescript
// components/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    image: '/test.jpg'
  };

  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', async () => {
    const handleAddToCart = jest.fn();
    const { user } = render(
      <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    await user.click(button);

    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });
});
```

#### Test Hooks
```typescript
// hooks/__tests__/useCart.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';

describe('useCart', () => {
  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Product',
        price: 99.99,
        quantity: 1
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.total()).toBe(99.99);
  });
});
```

### 2. Integration Tests

```typescript
// __tests__/integration/checkout.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import CheckoutPage from '@/app/checkout/page';

const server = setupServer(
  rest.post('/api/checkout', (req, res, ctx) => {
    return res(ctx.json({ url: 'https://checkout.stripe.com/...' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Checkout Flow', () => {
  it('completes checkout process', async () => {
    render(<CheckoutPage />);

    // Fill form
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'John Doe');

    // Submit
    const submitButton = screen.getByRole('button', { name: /checkout/i });
    await user.click(submitButton);

    // Verify redirect to Stripe
    await waitFor(() => {
      expect(window.location.href).toContain('stripe.com');
    });
  });
});
```

### 3. E2E Tests (Cypress)

#### Setup
```bash
npm install --save-dev cypress @cypress/react
npx cypress open
```

#### Test Spec
```typescript
// cypress/e2e/shopping.cy.ts
describe('E-commerce Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes full purchase flow', () => {
    // Browse products
    cy.contains('Products').click();
    cy.url().should('include', '/products');

    // View product details
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('Add to Cart').click();

    // Go to cart
    cy.get('[data-testid="cart-icon"]').click();
    cy.url().should('include', '/cart');

    // Verify cart has item
    cy.get('[data-testid="cart-item"]').should('have.length', 1);

    // Checkout
    cy.contains('Checkout').click();

    // Fill checkout form
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="address"]').type('123 Main St');

    // Submit
    cy.get('button[type="submit"]').click();

    // Verify success
    cy.contains('Order confirmed', { timeout: 10000 });
  });
});
```

### 4. Performance Tests

#### Lighthouse CI
```bash
npm install --save-dev @lhci/cli

# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
};

# Run
lhci autorun
```

#### Load Testing
```typescript
// k6 script
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up
    { duration: '3m', target: 50 },  // Stay at 50
    { duration: '1m', target: 0 },   // Ramp down
  ],
};

export default function () {
  const res = http.get('https://yoursite.com/api/products');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### 5. Visual Regression Tests

```bash
npm install --save-dev @percy/cypress

# cypress/e2e/visual.cy.ts
describe('Visual Tests', () => {
  it('matches product page snapshot', () => {
    cy.visit('/products');
    cy.percySnapshot('Products Page');
  });
});
```

---

## 📊 Monitoring

### 1. Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking (Sentry)
```typescript
// instrumentation.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 3. Real User Monitoring
```typescript
// lib/analytics.ts
export function trackPageView(url: string) {
  window.gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: url,
  });
}

export function trackEvent(action: string, params: any) {
  window.gtag('event', action, params);
}
```

---

## ✅ Pre-Production Checklist

### Performance
- [ ] Lighthouse score > 90 for all pages
- [ ] Bundle size < 200KB (first load)
- [ ] Images optimized (WebP format)
- [ ] Code splitting implemented
- [ ] Critical CSS inlined
- [ ] API responses < 500ms
- [ ] Database queries optimized

### Testing
- [ ] Unit tests passing (> 80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Mobile tested (iOS, Android)
- [ ] Accessibility tested (WCAG AA)

### Security
- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] API routes protected
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting

### SEO
- [ ] Meta tags optimized
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Structured data added
- [ ] Open Graph tags
- [ ] Twitter cards

---

**Estimated Time Investment:**
- Performance optimization: 2-4 hours
- Testing setup: 4-6 hours
- Monitoring setup: 1-2 hours
- **Total: 7-12 hours for production-ready app**

With HubLab handling the UI, you can focus 100% of this time on quality assurance!

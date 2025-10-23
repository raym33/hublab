# HubLab - AI Prototype Marketplace

Professional marketplace for AI-generated application prototypes built with vibe coding principles.

## Features

- **Authentication**: Google OAuth + Email/Password via Supabase
- **Prototype Upload**: ZIP files with metadata (title, description, price, tech stack)
- **Marketplace**: Responsive grid with category filters
- **Payments**: Stripe Checkout integration
- **Secure Downloads**: Purchase verification system
- **Dashboard**: Coming soon
- **Reviews**: Coming soon

## Technology Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)
- Stripe account (free for testing)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository>
cd hublab
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Configure `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Navigate to SQL Editor
3. Execute `supabase-setup.sql`
4. Configure Storage buckets:
   - Create bucket `prototypes` (private)
   - Create bucket `previews` (public)
5. Enable Google OAuth in Authentication

### 4. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Obtain API keys from Dashboard (test mode)
3. Configure webhook (optional for production)

### 5. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
hublab/
├── app/
│   ├── api/checkout/           # Stripe payments API
│   ├── auth/callback/          # OAuth callback
│   ├── login/                  # Authentication
│   ├── upload/                 # Prototype upload
│   ├── prototype/[id]/         # Prototype details
│   ├── page.tsx                # Marketplace
│   ├── layout.tsx              # Global layout
│   └── globals.css             # Global styles
├── components/
│   └── Navigation.tsx          # Navigation bar
├── lib/
│   └── supabase.ts             # Client + types
├── supabase-setup.sql          # Database setup
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env.example
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push to GitHub

```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. Import to Vercel

- Connect your GitHub repository
- Configure environment variables
- Deploy

3. Post-Deployment

Update the following in Supabase and Stripe:
- Redirect URLs
- Webhook endpoints
- CORS settings

### Production Environment Variables

Required for production:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Database Schema

### Core Tables

- `profiles`: User information
- `prototypes`: Product listings
- `purchases`: Transaction records
- `reviews`: Product reviews

All tables have Row Level Security (RLS) enabled.

## Security

- RLS policies on all Supabase tables
- Client and server-side validation
- Signed URLs for secure file access
- PCI-compliant payment processing via Stripe

## API Routes

- `/api/checkout` - Stripe checkout session creation
- `/api/download` - Secure file download (coming soon)
- `/api/webhook` - Stripe webhook handler (coming soon)

## Performance Optimizations

- Image optimization with Next.js Image component
- Static generation for marketing pages
- Dynamic imports for heavy components
- Edge middleware for auth checks

## Monitoring

Recommended services for production:

- **Analytics**: Vercel Analytics
- **Error Tracking**: Sentry
- **Performance**: Vercel Speed Insights
- **Uptime**: Better Uptime

## Troubleshooting

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

### Runtime Errors

- Verify environment variables are set
- Check Supabase connection
- Confirm Stripe keys match environment (test/production)
- Review browser console for errors

### Authentication Issues

- Clear browser cookies
- Verify redirect URLs in Supabase
- Check OAuth provider settings
- Test in incognito mode

## Roadmap

### Phase 1 - MVP (Complete)
- Authentication system
- Upload functionality
- Marketplace interface
- Payment processing

### Phase 2 - Enhanced Features (Q1 2024)
- Seller dashboard
- Review system
- Live preview
- Advanced search

### Phase 3 - Scaling (Q2 2024)
- Stripe Connect for revenue splits
- Featured listings
- Bundle packages
- Affiliate program

### Phase 4 - Platform Expansion (Q3-Q4 2024)
- Public API
- Mobile application
- Email notifications
- Internationalization

## Business Model

**Revenue Model**: 10-15% commission per sale
**Projected Monthly Revenue**: $450-1500 (6-month projection)

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue.

## Acknowledgments

Inspired by:
- ThemeForest (business model)
- Gumroad (simplicity)
- Vibe coding community

---

Built for the next generation of AI-powered development.
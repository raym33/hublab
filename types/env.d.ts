declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string

    // Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
    STRIPE_SECRET_KEY: string

    // App
    NEXT_PUBLIC_SITE_URL: string

    // Optional
    NEXT_PUBLIC_GA_ID?: string
    SENTRY_DSN?: string
  }
}
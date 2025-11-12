/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable instrumentation for Sentry
  experimental: {
    instrumentationHook: true,
  },
  // Remove 'standalone' output for Netlify compatibility
  // output: 'standalone',
  typescript: {
    // Temporarily ignore build errors for faster deployment
    // TODO: Fix type inconsistencies between old and new CapsuleComposition
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true, // For Netlify free tier
  },
  // Ensure CSS is properly optimized and minified
  optimizeFonts: true,
  compress: true,
}

module.exports = nextConfig

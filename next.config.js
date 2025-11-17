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
    // ✅ FIXED: Build errors are now enforced to catch issues early
    // Type errors must be fixed before deployment
    ignoreBuildErrors: false,
  },
  eslint: {
    // ✅ FIXED: ESLint errors are now enforced for code quality
    ignoreDuringBuilds: false,
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

import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import CookieConsent from '@/components/CookieConsent'
import ClientLayout from '@/components/ClientLayout'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL('https://hublab.dev'),
  title: {
    default: 'HubLab - Build Web Apps with AI-Powered Components | React & Next.js',
    template: '%s | HubLab'
  },
  description: 'Build production-ready web applications instantly with 8,150+ AI-powered React components. Export clean TypeScript code. From idea to deployed app in 30 minutes. Perfect for developers using ChatGPT, Claude, or any AI assistant.',
  keywords: [
    'react components',
    'web app builder',
    'AI code generation',
    'next.js templates',
    'typescript components',
    'rapid prototyping',
    'ChatGPT web development',
    'Claude code assistant',
    'AI web development',
    'component library',
    'react UI builder',
    'automated web development',
    'code export',
    'production-ready components'
  ],
  authors: [{ name: 'HubLab Team' }],
  creator: 'HubLab',
  publisher: 'HubLab',
  verification: {
    google: 'ctwgjygoowOINzLRBBKJdyH6RU2X9qs-lehkBP72Yk8',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hublab.dev',
    title: 'HubLab - Build Web Apps with AI-Powered Components',
    description: 'Build production-ready web applications instantly with 8,150+ AI-powered React components. Export clean TypeScript code. Perfect for ChatGPT, Claude & AI assistants.',
    siteName: 'HubLab',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HubLab - AI-Powered Web App Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HubLab - Build Web Apps with AI-Powered Components',
    description: '8,150+ React components. Export clean code. 30 min from idea to deployed app.',
    creator: '@hublabdev',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://hublab.dev',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Schema.org structured data for AI discoverability
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HubLab',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: 'Build production-ready web applications instantly with 8,150+ AI-powered React components. Export clean TypeScript code. From idea to deployed app in 30 minutes.',
    url: 'https://hublab.dev',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    featureList: [
      'Natural language to code generation',
      '8,150+ production-ready components',
      'TypeScript/React/Next.js export',
      'Zero vendor lock-in',
      'AI-powered component library',
      'Instant deployment',
    ],
  }

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HubLab',
    url: 'https://hublab.dev',
    logo: 'https://hublab.dev/icon.svg',
    description: 'AI-powered web application builder for developers',
    sameAs: ['https://twitter.com/hublabdev'],
  }

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
      </head>
      <body>
        <ClientLayout>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <CookieConsent />
        </ClientLayout>
      </body>
    </html>
  )
}

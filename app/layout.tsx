import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import CookieConsent from '@/components/CookieConsent'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL('https://hublab.dev'),
  title: {
    default: 'HubLab - Build Web Apps with AI-Powered Components | React & Next.js',
    template: '%s | HubLab'
  },
  description: 'Build production-ready web applications instantly with 180+ AI-powered React components. Export clean TypeScript code. From idea to deployed app in 30 minutes. Perfect for developers using ChatGPT, Claude, or any AI assistant.',
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
    description: 'Build production-ready web applications instantly with 180+ AI-powered React components. Export clean TypeScript code. Perfect for ChatGPT, Claude & AI assistants.',
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
    description: '180+ React components. Export clean code. 30 min from idea to deployed app.',
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
  return (
    <html lang="es">
      <body>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <CookieConsent />
        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-4">HubLab</h3>
                <p className="text-gray-400 text-sm">AI-generated prototype marketplace</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><Link href="/for-ai-assistants" className="hover:text-white">How it Works</Link></li>
                  <li><Link href="/studio-v2" className="hover:text-white">Studio V2</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/cookie-policy" className="hover:text-white">Cookie Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Community</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><a href="https://x.com/hublabdev" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter/X</a></li>
                  <li><a href="https://github.com/raym33/hublab-dev" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400 text-sm">&copy; 2025 HubLab. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import CookieConsent from '@/components/CookieConsent'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'HubLab - AI Prototype Marketplace',
  description: 'Buy and sell AI-generated application prototypes',
  icons: {
    icon: '/icon.svg',
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
                  <li><Link href="/#how-it-works" className="hover:text-white">How it Works</Link></li>
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
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">&copy; 2025 HubLab. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Language:</span>
                <Link href="/" className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-sm">
                  <span>🇬🇧</span>
                  <span className="text-white">English</span>
                </Link>
                <Link href="/es" className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-sm">
                  <span>🇪🇸</span>
                  <span className="text-white">Español</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

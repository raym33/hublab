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
                <p className="text-gray-400 text-sm">Marketplace de prototipos vibe-coded</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Producto</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><a href="#" className="hover:text-white">Marketplace</a></li>
                  <li><a href="#" className="hover:text-white">Vender</a></li>
                  <li><a href="#" className="hover:text-white">Cómo Funciona</a></li>
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
                <h4 className="font-semibold mb-4">Redes</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><a href="#" className="hover:text-white">Twitter/X</a></li>
                  <li><a href="#" className="hover:text-white">Discord</a></li>
                  <li><a href="#" className="hover:text-white">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2025 HubLab. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

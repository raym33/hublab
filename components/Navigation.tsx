'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Navigation() {

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Más grande y visible */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/icon.svg"
              alt="HubLab"
              width={40}
              height={40}
              className="w-10 h-10 transition-transform group-hover:scale-110"
            />
            <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              HubLab
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

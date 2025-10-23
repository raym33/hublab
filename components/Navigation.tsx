'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Menu, X, LogOut, Upload, Home } from 'lucide-react'

export default function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/icon.svg" alt="HubLab" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-light text-gray-900">HubLab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-light transition-colors">
              Marketplace
            </Link>

            <Link href="/waitlist" className="text-gray-600 hover:text-gray-900 font-light transition-colors">
              Waitlist
            </Link>

            {user && (
              <Link href="/upload" className="text-gray-600 hover:text-gray-900 font-light transition-colors">
                Sell
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 font-light">{user.email?.split('@')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 font-light transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-light transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-6 pb-4 space-y-1 border-t border-gray-200 pt-6">
            <Link href="/" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-light transition-colors">
              Marketplace
            </Link>
            <Link href="/waitlist" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-light transition-colors">
              Waitlist
            </Link>
            {user && (
              <Link href="/upload" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-light transition-colors">
                Sell
              </Link>
            )}
            {loading ? (
              <div className="px-4 py-3 text-gray-400 font-light">Loading...</div>
            ) : user ? (
              <>
                <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200 mt-2 pt-2 font-light">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-light transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block mx-4 mt-4 px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-md text-center font-light transition-colors">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
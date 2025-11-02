'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Menu, X, ArrowRight, LogOut, Upload, Home, Bot, Settings, BarChart3, CheckSquare, HelpCircle, Workflow, ShoppingBag, Package, Zap, Database } from 'lucide-react'

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/templates"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/examples"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Examples
            </Link>
            <Link
              href="/integrations"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Integrations
            </Link>
            <Link
              href="/studio-v2"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Launch Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link
                href="/templates"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
              >
                Templates
              </Link>
              <Link
                href="/examples"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
              >
                Examples
              </Link>
              <Link
                href="/integrations"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
              >
                Integrations
              </Link>
              <Link
                href="/studio-v2"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Launch Studio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

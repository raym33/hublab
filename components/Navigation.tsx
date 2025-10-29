'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Menu, X, LogOut, Upload, Home, Bot, Settings, BarChart3, CheckSquare, HelpCircle, Workflow, ShoppingBag } from 'lucide-react'

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
            <span className="text-xl font-semibold text-gray-900">HubLab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link href="/marketplace" className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </Link>

            {/* Builder with CRM Demo Dropdown */}
            <div className="relative group">
              <Link href="/builder" className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-1">
                <Workflow className="w-4 h-4" />
                Builder
              </Link>
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/builder" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg transition-colors font-medium">
                  <Workflow className="w-4 h-4" />
                  Overview
                </Link>
                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Demos</div>
                <Link href="/crm/dashboard" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  <Bot className="w-4 h-4" />
                  CRM Agent
                </Link>
              </div>
            </div>

            <Link href="/faq" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              FAQ
            </Link>

            <Link href="/waitlist" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Waitlist
            </Link>

            {user && (
              <Link href="/upload" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Sell
              </Link>
            )}
          </div>

          {/* Auth Section - Disabled for now */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Login button disabled temporarily */}
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
            <Link href="/" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link href="/marketplace" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </Link>

            <Link href="/builder" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <Workflow className="w-4 h-4" />
              Builder
            </Link>

            {/* CRM Demo Mobile */}
            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Builder Demos</div>
            <Link href="/crm/dashboard" className="flex items-center gap-2 px-4 py-3 pl-8 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <Bot className="w-4 h-4" />
              CRM Agent
            </Link>

            <Link href="/faq" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>

            <Link href="/waitlist" className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              Waitlist
            </Link>
            {/* Login button disabled temporarily */}
          </div>
        )}
      </div>
    </nav>
  )
}

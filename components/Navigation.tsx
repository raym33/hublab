'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Menu, X, LogOut, Upload, Home, Bot, Settings, BarChart3, CheckSquare, HelpCircle, Workflow, ShoppingBag, Package, Zap, Database } from 'lucide-react'

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
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/studio" className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Studio
            </Link>
            <Link href="/studio?capsule=crm-agent" className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-2">
              <Database className="w-4 h-4" />
              CRM
            </Link>
            <Link href="/compiler/explore" className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-2">
              <Package className="w-4 h-4" />
              Capsules
            </Link>
            <Link href="/compiler/demo" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Demo
            </Link>
            <Link href="/compiler" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2">
              <Zap className="w-5 h-5" />
              AI Compiler
            </Link>
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
            <Link href="/studio" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <Zap className="w-4 h-4" />
              Studio
            </Link>
            <Link href="/studio?capsule=crm-agent" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <Database className="w-4 h-4" />
              CRM
            </Link>
            <Link href="/compiler/explore" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <Package className="w-4 h-4" />
              Capsules
            </Link>
            <Link href="/compiler/demo" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <Package className="w-4 h-4" />
              Demo
            </Link>
            <Link href="/compiler" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded font-medium transition-colors" onClick={() => setIsOpen(false)}>
              <Zap className="w-4 h-4" />
              AI Compiler
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

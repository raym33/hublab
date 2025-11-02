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
            <Link
              href="/studio-v2"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              🚀 Studio V2
            </Link>
            <Link
              href="/demos"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Demos
            </Link>
            <Link
              href="/canvas"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Canvas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

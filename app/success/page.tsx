'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Download, ArrowRight, Loader, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [purchase, setPurchase] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyPurchase = async () => {
      try {
        const sessionId = searchParams.get('session_id')

        if (!sessionId) {
          setError('Payment session not found')
          setLoading(false)
          return
        }

        // Get user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        // Get purchase by session ID
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('purchases')
          .select('*, prototypes(*)')
          .eq('stripe_checkout_id', sessionId)
          .eq('buyer_id', user.id)
          .single()

        if (purchaseError || !purchaseData) {
          setError('Purchase not found')
          setLoading(false)
          return
        }

        // Update purchase status if needed
        if (purchaseData.status !== 'completed') {
          await supabase
            .from('purchases')
            .update({ status: 'completed' })
            .eq('id', purchaseData.id)
        }

        setPurchase(purchaseData)
      } catch (err) {
        console.error(err)
        setError('Error verifying purchase')
      } finally {
        setLoading(false)
      }
    }

    verifyPurchase()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-light">Verifying your purchase...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-4">Purchase Error</h1>
          <p className="text-gray-600 font-light mb-8">{error}</p>
          <Link
            href="/"
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-light inline-flex items-center transition-colors group"
          >
            <span>Back to Marketplace</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-12 max-w-2xl w-full">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-gray-900" />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Purchase Successful
          </h1>
          <p className="text-gray-600 font-light text-lg mb-2">
            Thank you for your purchase
          </p>
          <p className="text-gray-500 font-light">
            You now have access to <span className="text-gray-900">{purchase?.prototypes?.title}</span>
          </p>
        </div>

        {/* Purchase Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-light mb-1">Order ID</p>
              <p className="text-gray-900 font-mono">{purchase?.id?.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-gray-500 font-light mb-1">Amount</p>
              <p className="text-gray-900">${purchase?.amount}</p>
            </div>
            <div>
              <p className="text-gray-500 font-light mb-1">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light bg-gray-900 text-white">
                Completed
              </span>
            </div>
            <div>
              <p className="text-gray-500 font-light mb-1">Date</p>
              <p className="text-gray-900">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/prototype/${purchase?.prototype_id}`}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-light inline-flex items-center justify-center transition-colors group"
          >
            <Download className="w-4 h-4 mr-2" />
            <span>Download Prototype</span>
          </Link>

          <Link
            href="/"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-md font-light inline-flex items-center justify-center transition-colors"
          >
            <span>Browse More</span>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 font-light mt-8">
          A receipt has been sent to your email address
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-light">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
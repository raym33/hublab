'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPrototypeById } from '@/lib/mockData'
import { Star, Download, ShoppingCart, ArrowLeft, Share2, Check } from 'lucide-react'

export default function PrototypePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const prototype = getPrototypeById(params.id)
  const [isPurchasing, setIsPurchasing] = useState(false)

  if (!prototype) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">Prototype not found</h1>
          <Link href="/" className="text-gray-600 hover:text-gray-900 underline">
                Back to marketplace
          </Link>
        </div>
      </div>
    )
  }

  const handlePurchase = async () => {
    setIsPurchasing(true)
    // Simulate purchase
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert(`Purchase successful! Download link sent to your email.`)
    setIsPurchasing(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to marketplace
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: Image */}
          <div>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 sticky top-24">
              {prototype.preview_image_url ? (
                <Image
                  src={prototype.preview_image_url}
                  alt={prototype.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingCart className="w-16 h-16" />
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            {/* Category Badge */}
            <div className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-light mb-4">
              {prototype.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              {prototype.title}
            </h1>

            {/* Rating & Downloads */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-gray-900 text-gray-900" />
                <span className="text-lg font-light">{prototype.rating}</span>
                <span className="text-gray-400 font-light">(24 reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600 font-light">{prototype.downloads} downloads</span>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 font-light leading-relaxed mb-8">
              {prototype.description}
            </p>

            {/* Tech Stack */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {prototype.tech_stack.map(tech => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gray-100 text-gray-900 text-sm font-light"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">What's Included</h3>
              <ul className="space-y-3">
                {[
                  'Complete source code',
                  'Documentation and setup guide',
                  'Production-ready components',
                  'Commercial use license',
                  'Free updates for 6 months'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Purchase */}
            <div className="sticky bottom-0 bg-white pt-8 border-t border-gray-200">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-light text-gray-900">${prototype.price}</span>
                <span className="text-gray-500 font-light">one-time payment</span>
              </div>

              <button
                disabled={true}
                className="w-full bg-gray-400 text-white py-4 rounded-md font-light text-lg transition-colors cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Purchase Prototype (soon)
              </button>

              <button
                onClick={() => navigator.share?.({ title: prototype.title, url: window.location.href })}
                className="w-full mt-3 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 py-3 rounded-md font-light transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              <p className="text-xs text-gray-500 text-center mt-6 font-light">
                Secure payment powered by Stripe • 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
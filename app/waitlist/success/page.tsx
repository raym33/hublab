'use client'

import Link from 'next/link'

export default function WaitlistSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-10 shadow-sm text-center">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-light text-gray-900 mb-4">You're on the list!</h1>

          <p className="text-gray-600 leading-relaxed mb-8">
            Thank you for joining our waitlist. We'll send you an email as soon as HubLab launches.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">What happens next?</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">1.</span>
                <span>Check your email for a confirmation message</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">2.</span>
                <span>We'll notify you when we launch (coming soon!)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">3.</span>
                <span>Get early access with exclusive benefits</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>

            <div className="text-sm text-gray-600">
              <p>Know someone who'd be interested?</p>
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/waitlist`
                  const shareText = 'Join the HubLab waitlist - AI-generated prototype marketplace launching soon!'

                  if (navigator.share) {
                    navigator.share({
                      title: 'HubLab Waitlist',
                      text: shareText,
                      url: shareUrl,
                    })
                  } else {
                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
                    alert('Link copied to clipboard!')
                  }
                }}
                className="text-gray-900 font-medium hover:underline mt-2"
              >
                Share the waitlist
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Questions?{' '}
            <a href="mailto:hello@hublab.com" className="text-gray-900 hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Testimonial Component
 * Customer testimonial card with avatar and rating
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface TestimonialProps {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: string
  rating?: number
  variant?: 'default' | 'bordered' | 'elevated'
  className?: string
}

const Testimonial = ({
  quote,
  author,
  role,
  company,
  avatar,
  rating,
  variant = 'default',
  className
}: TestimonialProps) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800',
    bordered: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg'
  }

  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-all duration-200 hover:shadow-xl',
        variants[variant],
        className
      )}
    >
      {/* Quote Icon */}
      <svg
        className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      {/* Quote */}
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
        "{quote}"
      </p>

      {/* Rating */}
      {rating !== undefined && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                'w-5 h-5',
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'
              )}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3">
        {avatar && (
          <img
            src={avatar}
            alt={author}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        {!avatar && (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {author}
          </p>
          {(role || company) && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {role}{role && company && ' at '}{company}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Testimonial

/**
 * PricingCard Component
 * Pricing tier card with features list and CTA
 */

import React from 'react'
import { cn } from '@/lib/utils'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export interface PricingCardProps {
  name: string
  description: string
  price: number | string
  period?: string
  features: string[]
  highlighted?: boolean
  badge?: string
  ctaText?: string
  onCTAClick?: () => void
  className?: string
}

const PricingCard = ({
  name,
  description,
  price,
  period = 'month',
  features,
  highlighted = false,
  badge,
  ctaText = 'Get Started',
  onCTAClick,
  className
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all duration-200',
        highlighted
          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md',
        className
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="primary" size="sm">
            {badge}
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          {typeof price === 'string' ? (
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {price}
            </span>
          ) : (
            <>
              <span className="text-2xl font-semibold text-gray-600">$</span>
              <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                {price}
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">
                /{period}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant={highlighted ? 'primary' : 'outline'}
        size="lg"
        fullWidth
        onClick={onCTAClick}
      >
        {ctaText}
      </Button>
    </div>
  )
}

export default PricingCard

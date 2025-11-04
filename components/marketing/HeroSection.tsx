/**
 * HeroSection Component
 * Marketing hero section with CTA buttons and optional image
 */

import React from 'react'
import { cn } from '@/lib/utils'
import Button from '../ui/Button'

export interface HeroSectionProps {
  title: string
  subtitle?: string
  description: string
  primaryCTA?: {
    label: string
    onClick: () => void
  }
  secondaryCTA?: {
    label: string
    onClick: () => void
  }
  image?: string
  variant?: 'default' | 'centered' | 'split'
  background?: 'gradient' | 'solid' | 'image'
  className?: string
}

const HeroSection = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  variant = 'default',
  background = 'gradient',
  className
}: HeroSectionProps) => {
  const backgrounds = {
    gradient: 'bg-gradient-to-br from-blue-600 to-purple-700',
    solid: 'bg-gray-900',
    image: 'bg-gray-900 bg-cover bg-center'
  }

  const isSplit = variant === 'split'
  const isCentered = variant === 'centered'

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        backgrounds[background],
        className
      )}
      style={background === 'image' && image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {/* Overlay for image background */}
      {background === 'image' && (
        <div className="absolute inset-0 bg-black/60" />
      )}

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div
          className={cn(
            'grid gap-12',
            isSplit ? 'lg:grid-cols-2 items-center' : 'lg:grid-cols-1',
            isCentered && 'text-center'
          )}
        >
          {/* Content */}
          <div className={cn(isCentered && 'mx-auto max-w-3xl')}>
            {subtitle && (
              <p className="text-blue-300 font-semibold mb-4 uppercase tracking-wide">
                {subtitle}
              </p>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              {description}
            </p>

            {/* CTAs */}
            {(primaryCTA || secondaryCTA) && (
              <div
                className={cn(
                  'flex flex-wrap gap-4',
                  isCentered && 'justify-center'
                )}
              >
                {primaryCTA && (
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={primaryCTA.onClick}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    {primaryCTA.label}
                  </Button>
                )}
                {secondaryCTA && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={secondaryCTA.onClick}
                    className="border-white text-white hover:bg-white/10"
                  >
                    {secondaryCTA.label}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Image for split layout */}
          {isSplit && image && background !== 'image' && (
            <div className="relative">
              <img
                src={image}
                alt={title}
                className="rounded-lg shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
    </section>
  )
}

export default HeroSection

/**
 * ProductCard Component
 * E-commerce product display card with image, price, and CTA
 */

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export interface ProductCardProps {
  id: string
  name: string
  description?: string
  price: number
  comparePrice?: number
  image: string
  badge?: string
  rating?: number
  reviewCount?: number
  inStock?: boolean
  onAddToCart?: (id: string) => void
  onQuickView?: (id: string) => void
  className?: string
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  comparePrice,
  image,
  badge,
  rating,
  reviewCount,
  inStock = true,
  onAddToCart,
  onQuickView,
  className
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300',
        'border border-gray-200 dark:border-gray-700',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant="danger" size="sm">
              {badge}
            </Badge>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" size="sm">
              -{discount}%
            </Badge>
          </div>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="default" size="lg">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        {isHovered && inStock && onQuickView && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onQuickView(id)}
            >
              Quick View
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        {rating !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.floor(rating) ? 'fill-current' : 'fill-gray-300'
                  )}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            {reviewCount && (
              <span className="text-sm text-gray-500">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${price.toFixed(2)}
          </span>
          {comparePrice && (
            <span className="text-sm text-gray-500 line-through">
              ${comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {onAddToCart && (
          <Button
            variant="primary"
            fullWidth
            className="mt-4"
            disabled={!inStock}
            onClick={() => onAddToCart(id)}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ProductCard

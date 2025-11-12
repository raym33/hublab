/**
 * AddToCartButton Component
 * Specialized button for adding products to cart with animation
 */

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '../ui/Button'

export interface AddToCartButtonProps {
  productId: string
  onAddToCart: (productId: string) => Promise<void> | void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  showQuantity?: boolean
  className?: string
}

const AddToCartButton = ({
  productId,
  onAddToCart,
  variant = 'primary',
  size = 'md',
  showQuantity = false,
  className
}: AddToCartButtonProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await onAddToCart(productId)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showQuantity && (
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}

      <Button
        variant={isAdded ? 'success' : variant}
        size={size}
        isLoading={isAdding}
        onClick={handleAddToCart}
        className="flex-1"
        leftIcon={
          isAdded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          )
        }
      >
        {isAdded ? 'Added to Cart!' : 'Add to Cart'}
      </Button>
    </div>
  )
}

export default AddToCartButton

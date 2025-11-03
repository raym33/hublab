/**
 * E-COMMERCE CAPSULES
 *
 * Advanced e-commerce components:
 * - Product displays
 * - Shopping cart functionality
 * - Checkout flows
 * - Payment integrations
 * - Inventory management
 */

export interface EcommerceCapsule {
  id: string
  name: string
  category: string
  icon: string
  description: string
  props?: Array<{
    name: string
    type: string
    required?: boolean
    description?: string
    default?: any
  }>
  code?: string
}

export const ECOMMERCE_CAPSULES: EcommerceCapsule[] = [
  // PRODUCT CARD
  {
    id: 'product-card-advanced',
    name: 'Advanced Product Card',
    category: 'ecommerce',
    icon: '🛍️',
    description: 'Product card with quick view, wishlist, and cart actions',
    props: [
      { name: 'product', type: 'object', required: true, description: 'Product data object' },
      { name: 'onAddToCart', type: 'function', required: true, description: 'Add to cart callback' },
      { name: 'onWishlist', type: 'function', required: false, description: 'Add to wishlist callback' }
    ],
    code: `
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AdvancedProductCard({ product, onAddToCart, onWishlist }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)

  return (
    <>
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
      >
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onWishlist?.(product)}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition"
        >
          ❤️
        </button>

        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* Quick Actions Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
          >
            <button
              onClick={() => setShowQuickView(true)}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100"
            >
              Quick View
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">{product.category}</div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                \${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  \${product.originalPrice}
                </span>
              )}
            </div>
            {product.stock < 10 && (
              <span className="text-xs text-red-600 font-medium">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img src={product.image} alt={product.name} className="w-full rounded-lg" />
                <div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="text-3xl font-bold text-gray-900 mb-4">\${product.price}</div>
                  <button
                    onClick={() => {
                      onAddToCart(product)
                      setShowQuickView(false)
                    }}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}`
  },

  // SHOPPING CART DRAWER
  {
    id: 'cart-drawer',
    name: 'Shopping Cart Drawer',
    category: 'ecommerce',
    icon: '🛒',
    description: 'Sliding cart drawer with item management',
    props: [
      { name: 'items', type: 'array', required: true, description: 'Cart items' },
      { name: 'isOpen', type: 'boolean', required: true, description: 'Drawer open state' },
      { name: 'onClose', type: 'function', required: true, description: 'Close callback' },
      { name: 'onUpdateQuantity', type: 'function', required: true, description: 'Update quantity callback' },
      { name: 'onRemove', type: 'function', required: true, description: 'Remove item callback' },
      { name: 'onCheckout', type: 'function', required: true, description: 'Checkout callback' }
    ],
    code: `
'use client'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartDrawer({ items, isOpen, onClose, onUpdateQuantity, onRemove, onCheckout }) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 5
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart ({items.length})
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">\${item.price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      \${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-200 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>\${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : \`\$\${shipping.toFixed(2)}\`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>\${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>\${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                    Add \${(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}

                <button
                  onClick={onCheckout}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}`
  },

  // PRICE FILTER
  {
    id: 'price-filter',
    name: 'Price Range Filter',
    category: 'ecommerce',
    icon: '💰',
    description: 'Interactive price range slider with histogram',
    props: [
      { name: 'min', type: 'number', required: true, description: 'Minimum price' },
      { name: 'max', type: 'number', required: true, description: 'Maximum price' },
      { name: 'value', type: 'array', required: true, description: 'Current range [min, max]' },
      { name: 'onChange', type: 'function', required: true, description: 'Change callback' }
    ],
    code: `
'use client'
import { useState } from 'react'

export default function PriceFilter({ min, max, value, onChange }) {
  const [range, setRange] = useState(value)

  const handleChange = (index, newValue) => {
    const newRange = [...range]
    newRange[index] = Number(newValue)
    setRange(newRange)
    onChange(newRange)
  }

  const percentage = [
    ((range[0] - min) / (max - min)) * 100,
    ((range[1] - min) / (max - min)) * 100
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Price Range</span>
        <span className="text-sm text-gray-500">
          \${range[0]} - \${range[1]}
        </span>
      </div>

      <div className="relative pt-6 pb-2">
        {/* Track */}
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-blue-600 rounded-full"
            style={{
              left: \`\${percentage[0]}%\`,
              right: \`\${100 - percentage[1]}%\`
            }}
          />
        </div>

        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={range[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
          style={{ top: 0 }}
        />

        {/* Max Slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={range[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
          style={{ top: 0 }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="number"
            value={range[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <span className="text-gray-500">to</span>
        <div className="flex-1">
          <input
            type="number"
            value={range[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}`
  },

  // REVIEW SYSTEM
  {
    id: 'review-system',
    name: 'Product Review System',
    category: 'ecommerce',
    icon: '⭐',
    description: 'Complete review system with ratings and comments',
    props: [
      { name: 'productId', type: 'string', required: true, description: 'Product ID' },
      { name: 'reviews', type: 'array', required: true, description: 'Array of review objects' },
      { name: 'onSubmit', type: 'function', required: true, description: 'Submit review callback' }
    ],
    code: `
'use client'
import { useState } from 'react'

export default function ReviewSystem({ productId, reviews, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const ratingCounts = [5, 4, 3, 2, 1].map(n =>
    reviews.filter(r => r.rating === n).length
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ rating, comment, productId })
    setRating(0)
    setComment('')
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date)
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'lowest') return a.rating - b.rating
    return 0
  })

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center text-3xl text-yellow-400 mb-2">
            {'★'.repeat(Math.floor(averageRating))}
            {'☆'.repeat(5 - Math.floor(averageRating))}
          </div>
          <p className="text-gray-600">Based on {reviews.length} reviews</p>
        </div>

        <div className="space-y-2">
          {ratingCounts.map((count, index) => {
            const stars = 5 - index
            const percentage = (count / reviews.length) * 100
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{stars}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: \`\${percentage}%\` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write Review */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex gap-2 text-4xl">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={\`transition \${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }\`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        <div className="space-y-6">
          {sortedReviews.map((review, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-900">{review.author}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    <span>•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
                {review.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-gray-700">{review.comment}</p>
              {review.helpful && (
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <button className="hover:text-gray-700">
                    👍 Helpful ({review.helpful})
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`
  }
]

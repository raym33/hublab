import { Capsule } from '@/types/capsule'

const ecommerceCapsules: Capsule[] = [
  {
    id: 'product-card',
    name: 'Product Card',
    category: 'E-commerce',
    description: 'Modern product card with image, price, rating, and quick actions for e-commerce applications',
    tags: ['product', 'ecommerce', 'card', 'shopping', 'retail'],
    code: `'use client'

import { useState } from 'react'
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating?: number
  discount?: number
}

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            -{product.discount}%
          </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <Heart className={\`w-4 h-4 \${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}\`} />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 truncate">{product.name}</h3>
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={\`w-3 h-3 \${i < product.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}\`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              \${discountedPrice.toFixed(2)}
            </span>
            {product.discount && (
              <span className="text-sm text-gray-500 line-through">
                \${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    category: 'E-commerce',
    description: 'Complete shopping cart sidebar with item management, quantity controls, and checkout',
    tags: ['cart', 'checkout', 'ecommerce', 'shopping', 'sidebar'],
    code: `'use client'

import { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function ShoppingCart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 129.99,
      quantity: 1,
      image: '/placeholder-product.jpg'
    }
  ])

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{items.length} items</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">\${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 space-y-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>\${total.toFixed(2)}</span>
          </div>
          <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  )
}`,
    platform: 'react'
  },
  {
    id: 'price-filter',
    name: 'Price Range Filter',
    category: 'E-commerce',
    description: 'Interactive price range slider with min/max inputs for product filtering',
    tags: ['filter', 'price', 'range', 'slider', 'ecommerce'],
    code: `'use client'

import { useState } from 'react'

export default function PriceRangeFilter({
  min = 0,
  max = 1000,
  onChange
}: {
  min?: number
  max?: number
  onChange?: (min: number, max: number) => void
}) {
  const [minValue, setMinValue] = useState(min)
  const [maxValue, setMaxValue] = useState(max)

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, maxValue - 10)
    setMinValue(newMin)
    onChange?.(newMin, maxValue)
  }

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, minValue + 10)
    setMaxValue(newMax)
    onChange?.(minValue, newMax)
  }

  const minPercent = ((minValue - min) / (max - min)) * 100
  const maxPercent = ((maxValue - min) / (max - min)) * 100

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>

      <div className="relative h-2 bg-gray-200 rounded-full mb-8">
        <div
          className="absolute h-full bg-blue-600 rounded-full"
          style={{
            left: \`\${minPercent}%\`,
            width: \`\${maxPercent - minPercent}%\`
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Min</label>
          <input
            type="number"
            value={minValue}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Max</label>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },
  {
    id: 'checkout-form',
    name: 'Multi-Step Checkout',
    category: 'E-commerce',
    description: 'Complete multi-step checkout form with validation, payment, and shipping',
    tags: ['checkout', 'form', 'payment', 'shipping', 'ecommerce'],
    code: `'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const steps = ['Shipping', 'Payment', 'Review']

export default function MultiStepCheckout() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={\`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors \${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }\`}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className="text-xs mt-2 text-gray-600">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={\`h-1 flex-1 mx-2 rounded \${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}\`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {currentStep === 0 && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Address"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Zip Code"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              />
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Review Order</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Shipping to:</p>
                <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                <p className="text-sm text-gray-600">{formData.address}</p>
                <p className="text-sm text-gray-600">{formData.city}, {formData.zipCode}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Payment method:</p>
                <p className="font-medium">•••• •••• •••• {formData.cardNumber.slice(-4)}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {currentStep === steps.length - 1 ? 'Place Order' : 'Continue'}
        </button>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },
  {
    id: 'product-quick-view',
    name: 'Product Quick View',
    category: 'E-commerce',
    description: 'Modal with product details, image gallery, and add-to-cart without leaving the page',
    tags: ['modal', 'product', 'quick-view', 'gallery', 'ecommerce'],
    code: `'use client'

import { useState } from 'react'
import { X, Star, ShoppingCart, Heart } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  rating: number
  reviews: number
  description: string
  sizes?: string[]
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose
}: {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')

  if (!isOpen || !product) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white rounded-lg shadow-xl z-50 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Image Gallery */}
          <div className="p-6">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={\`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 \${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent'
                  }\`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={\`w-4 h-4 \${
                        i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }\`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                \${product.price.toFixed(2)}
              </div>
            </div>

            <p className="text-gray-600">{product.description}</p>

            {product.sizes && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Size</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={\`px-4 py-2 border rounded-lg font-medium transition-colors \${
                        selectedSize === size
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }\`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}`,
    platform: 'react'
  }
]

export default ecommerceCapsules

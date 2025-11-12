import { CapsuleDefinition } from './types'

/**
 * E-commerce Capsules
 * Shopping, cart, checkout, and product display components
 */

export const ECOMMERCE_CAPSULES: CapsuleDefinition[] = [
  // Product Card
  {
    id: 'product-card',
    name: 'Product Card',
    description: 'Product display card with image, price, and CTA',
    category: 'ecommerce',
    props: [
      { name: 'name', type: 'string', required: true, default: 'Product Name', description: 'Product name' },
      { name: 'price', type: 'number', required: true, default: 29.99, description: 'Product price' },
      { name: 'image', type: 'string', required: false, default: '', description: 'Product image URL' },
      { name: 'rating', type: 'number', required: false, default: 4.5, description: 'Product rating (0-5)' },
      { name: 'badge', type: 'string', required: false, default: '', description: 'Badge text (Sale, New, etc.)' }
    ],
    dependencies: [],
    code: `
function ProductCard({ name = 'Product Name', price = 29.99, image = '', rating = 4.5, badge = '' }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className={\`w-full h-full object-cover transition-transform duration-300 \${isHovered ? 'scale-110' : 'scale-100'}\`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {badge && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                ⭐
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">({rating})</span>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            \${price.toFixed(2)}
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}`
  },

  // Shopping Cart
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    description: 'Shopping cart with items and total',
    category: 'ecommerce',
    props: [
      { name: 'items', type: 'array', required: false, default: [
        { id: 1, name: 'Product 1', price: 29.99, quantity: 1, image: '' }
      ], description: 'Cart items' }
    ],
    dependencies: [],
    code: `
function ShoppingCart({ items = [] }) {
  const [cartItems, setCartItems] = React.useState(items)

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0))
  }

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600">\${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="font-bold text-lg">\${(item.price * item.quantity).toFixed(2)}</div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Subtotal:</span>
              <span className="text-2xl font-bold">\${total.toFixed(2)}</span>
            </div>
            <button className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}`
  },

  // Checkout Form
  {
    id: 'checkout-form',
    name: 'Checkout Form',
    description: 'Multi-step checkout form',
    category: 'ecommerce',
    props: [
      { name: 'total', type: 'number', required: true, default: 99.99, description: 'Order total' },
      { name: 'onComplete', type: 'function', required: false, description: 'Callback on checkout complete' }
    ],
    dependencies: [],
    code: `
function CheckoutForm({ total = 99.99, onComplete }) {
  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (onComplete) onComplete(formData)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {['Contact', 'Shipping', 'Payment'].map((label, idx) => (
          <React.Fragment key={label}>
            <div className={\`flex items-center gap-2 \${step > idx + 1 ? 'text-green-600' : step === idx + 1 ? 'text-blue-600' : 'text-gray-400'}\`}>
              <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold \${step > idx + 1 ? 'bg-green-600 text-white' : step === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-white'}\`}>
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className="font-semibold">{label}</span>
            </div>
            {idx < 2 && <div className="w-16 h-1 bg-gray-300 mx-4" />}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Street Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="City"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => updateField('zip', e.target.value)}
                placeholder="ZIP Code"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => updateField('cardNumber', e.target.value)}
              placeholder="Card Number"
              maxLength={16}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.expiry}
                onChange={(e) => updateField('expiry', e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => updateField('cvv', e.target.value)}
                placeholder="CVV"
                maxLength={4}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Total & Navigation */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-3xl font-bold text-blue-600">\${total.toFixed(2)}</span>
          </div>

          <div className="flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Back
              </button>
            )}
            <button
              onClick={() => step === 3 ? handleSubmit() : setStep(step + 1)}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              {step === 3 ? 'Complete Order' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}`
  },

  // Price Tag
  {
    id: 'price-tag',
    name: 'Price Tag',
    description: 'Price display with optional discount',
    category: 'ecommerce',
    props: [
      { name: 'price', type: 'number', required: true, default: 99.99, description: 'Current price' },
      { name: 'originalPrice', type: 'number', required: false, default: 0, description: 'Original price (for showing discount)' },
      { name: 'currency', type: 'string', required: false, default: '$', description: 'Currency symbol' },
      { name: 'size', type: 'string', required: false, default: 'md', description: 'Size: sm, md, lg' }
    ],
    dependencies: [],
    code: `
function PriceTag({ price = 99.99, originalPrice = 0, currency = '$', size = 'md' }) {
  const hasDiscount = originalPrice > 0 && originalPrice > price
  const discount = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className={\`\${sizes[size]} font-bold text-blue-600\`}>
        {currency}{price.toFixed(2)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-gray-500 line-through">
            {currency}{originalPrice.toFixed(2)}
          </span>
          <span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded">
            {discount}% OFF
          </span>
        </>
      )}
    </div>
  )
}`
  },

  // Add to Cart Button
  {
    id: 'add-to-cart-btn',
    name: 'Add to Cart Button',
    description: 'Animated add to cart button',
    category: 'ecommerce',
    props: [
      { name: 'text', type: 'string', required: false, default: 'Add to Cart', description: 'Button text' },
      { name: 'disabled', type: 'boolean', required: false, default: false, description: 'Disabled state' },
      { name: 'variant', type: 'string', required: false, default: 'primary', description: 'Variant: primary, secondary, outline' }
    ],
    dependencies: [],
    code: `
function AddToCartButton({ text = 'Add to Cart', disabled = false, variant = 'primary' }) {
  const [isAdded, setIsAdded] = React.useState(false)

  const handleClick = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-900 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAdded}
      className={\`px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed \${variants[variant]}\`}
    >
      {isAdded ? (
        <span className="flex items-center gap-2">
          ✓ Added to Cart
        </span>
      ) : (
        <span className="flex items-center gap-2">
          🛒 {text}
        </span>
      )}
    </button>
  )
}`
  },

  // Product Grid
  {
    id: 'product-grid',
    name: 'Product Grid',
    description: 'Responsive product grid layout',
    category: 'ecommerce',
    props: [
      { name: 'products', type: 'array', required: false, default: [
        { id: 1, name: 'Product 1', price: 29.99, image: '', rating: 4.5 }
      ], description: 'Products array' },
      { name: 'columns', type: 'number', required: false, default: 4, description: 'Number of columns on desktop' }
    ],
    dependencies: [],
    code: `
function ProductGrid({ products = [], columns = 4 }) {
  const gridCols = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5'
  }

  return (
    <div className={\`grid grid-cols-1 md:grid-cols-2 \${gridCols[columns]} gap-6\`}>
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow">
          <div className="h-48 bg-gray-200 rounded-t-lg">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-t-lg" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold mb-2">{product.name}</h3>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-blue-600">\${product.price}</span>
              <div className="text-yellow-400">
                {'⭐'.repeat(Math.round(product.rating))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}`
  }
]

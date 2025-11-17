/**
 * Extended Capsules Batch 23 - E-commerce, Finance & Business (500 capsules)
 * Focus: Shopping, Payments, Analytics, CRM, ERP, Business Intelligence
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (
  id: string,
  name: string,
  category: string,
  description: string,
  tags: string[],
  componentType: 'cart' | 'payment' | 'analytics' | 'crm' | 'report'
): Capsule => {
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '')

  const codeTemplates = {
    cart: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [cart, setCart] = useState([
    { id: 1, name: 'Product 1', price: 29.99, quantity: 2 },
    { id: 2, name: 'Product 2', price: 49.99, quantity: 1 }
  ])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600">\${(item.price * item.quantity).toFixed(2)}</p>
              <p className="text-sm text-gray-600">\${item.price.toFixed(2)} each</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center text-2xl font-bold">
          <span>Total:</span>
          <span className="text-blue-600">\${total.toFixed(2)}</span>
        </div>
        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}`,

    payment: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="border rounded-lg p-6">
        <div className="mb-6">
          <label className="block font-semibold mb-3">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            {['card', 'paypal', 'crypto'].map(method => (
              <button key={method}
                onClick={() => setPaymentMethod(method)}
                className={\`p-3 border rounded-lg capitalize \${
                  paymentMethod === method ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }\`}>
                {method}
              </button>
            ))}
          </div>
        </div>
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Card Number</label>
              <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border rounded px-4 py-2" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Expiry</label>
                <input type="text" className="w-full border rounded px-4 py-2" placeholder="MM/YY" />
              </div>
              <div>
                <label className="block font-semibold mb-2">CVV</label>
                <input type="text" className="w-full border rounded px-4 py-2" placeholder="123" />
              </div>
            </div>
          </div>
        )}
        <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
          Pay Now
        </button>
      </div>
    </div>
  )
}`,

    analytics: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [metrics, setMetrics] = useState({
    revenue: 125430,
    orders: 1543,
    customers: 892,
    conversion: 3.2
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="border rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">{key}</h3>
            <p className="text-3xl font-bold text-blue-600">
              {key === 'revenue' ? \`\$\${value.toLocaleString()}\` :
               key === 'conversion' ? \`\${value}%\` :
               value.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Sales Trend</h3>
        <div className="h-48 flex items-end gap-2">
          {[65, 78, 82, 90, 85, 95, 88, 92].map((value, i) => (
            <div key={i} className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
              style={{ height: \`\${value}%\` }}></div>
          ))}
        </div>
      </div>
    </div>
  )
}`,

    crm: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [customers, setCustomers] = useState([
    { name: 'John Doe', email: 'john@example.com', status: 'active', value: '$12,400' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'pending', value: '$8,200' },
    { name: 'Bob Johnson', email: 'bob@example.com', status: 'active', value: '$15,600' }
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Lifetime Value</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{customer.name}</td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3">
                  <span className={\`px-3 py-1 rounded text-sm \${
                    customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }\`}>{customer.status}</span>
                </td>
                <td className="px-4 py-3 font-bold text-blue-600">{customer.value}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}`,

    report: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [dateRange, setDateRange] = useState('month')
  const [reportType, setReportType] = useState('sales')

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="mb-6 flex gap-4">
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}
          className="border rounded px-4 py-2">
          <option value="sales">Sales Report</option>
          <option value="inventory">Inventory Report</option>
          <option value="customer">Customer Report</option>
        </select>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
          className="border rounded px-4 py-2">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Generate Report
        </button>
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h3>
        <div className="space-y-3 text-gray-700">
          <p>Period: {dateRange}</p>
          <p>Generated: {new Date().toLocaleDateString()}</p>
          <p>Status: <span className="text-green-600 font-semibold">Ready</span></p>
        </div>
        <button className="mt-6 border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50">
          Download PDF
        </button>
      </div>
    </div>
  )
}`
  }

  return {
    id,
    name,
    category,
    description,
    tags,
    code: codeTemplates[componentType],
    platform: 'react'
  }
}

const extendedCapsulesBatch23: Capsule[] = []

const categories = [
  { name: 'E-commerce/Shopping', prefix: 'shop', count: 60 },
  { name: 'Payments', prefix: 'payment', count: 60 },
  { name: 'Business Analytics', prefix: 'biz-analytics', count: 50 },
  { name: 'CRM', prefix: 'crm', count: 50 },
  { name: 'ERP', prefix: 'erp', count: 50 },
  { name: 'Finance/Accounting', prefix: 'finance', count: 45 },
  { name: 'Inventory', prefix: 'inventory', count: 45 },
  { name: 'Sales', prefix: 'sales', count: 45 },
  { name: 'Marketing', prefix: 'marketing', count: 40 },
  { name: 'Business Intelligence', prefix: 'bi', count: 40 },
  { name: 'Reports', prefix: 'reports', count: 15 }
]

const componentTypes: Array<'cart' | 'payment' | 'analytics' | 'crm' | 'report'> = [
  'cart', 'payment', 'analytics', 'crm', 'report'
]

const descriptions = {
  cart: (cat: string) => `${cat} shopping cart with item management, quantity controls, and real-time total calculation`,
  payment: (cat: string) => `${cat} payment processing interface with multiple payment methods and secure checkout`,
  analytics: (cat: string) => `${cat} analytics dashboard with KPIs, metrics tracking, and trend visualization`,
  crm: (cat: string) => `${cat} customer relationship management with contact tracking and engagement metrics`,
  report: (cat: string) => `${cat} reporting interface with customizable date ranges and export capabilities`
}

const tagSets = {
  cart: ['ecommerce', 'cart', 'shopping', 'checkout', 'products'],
  payment: ['payment', 'checkout', 'billing', 'transactions', 'stripe'],
  analytics: ['analytics', 'metrics', 'kpi', 'business', 'insights'],
  crm: ['crm', 'customers', 'contacts', 'sales', 'management'],
  report: ['reports', 'export', 'analytics', 'business', 'data']
}

categories.forEach(category => {
  const capsulesPerType = Math.ceil(category.count / componentTypes.length)

  componentTypes.forEach((type, typeIdx) => {
    for (let i = 0; i < capsulesPerType; i++) {
      if (extendedCapsulesBatch23.length >= 500) break

      const index = typeIdx * capsulesPerType + i + 1
      const id = `${category.prefix}-${type}-${index}`
      const name = `${category.name} ${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`
      const desc = descriptions[type](category.name)
      const tags = [category.prefix, ...tagSets[type]]

      extendedCapsulesBatch23.push(generateCapsule(id, name, category.name, desc, tags, type))
    }
  })
})

while (extendedCapsulesBatch23.length < 500) {
  const idx = extendedCapsulesBatch23.length + 1
  extendedCapsulesBatch23.push(
    generateCapsule(
      `business-utility-${idx}`,
      `Business Utility ${idx}`,
      'Business',
      'Comprehensive business utility component for operations, analytics, and management',
      ['business', 'utilities', 'operations', 'management', 'tools'],
      'analytics'
    )
  )
}

export default extendedCapsulesBatch23

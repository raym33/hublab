/**
 * Extended Capsules Batch 22 - Mobile, PWA & IoT (500 capsules)
 * Focus: Mobile Development, Progressive Web Apps, IoT, Sensors, Embedded Systems
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (
  id: string,
  name: string,
  category: string,
  description: string,
  tags: string[],
  componentType: 'mobile' | 'pwa' | 'sensor' | 'device' | 'native'
): Capsule => {
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '')

  const codeTemplates = {
    mobile: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [isInstalled, setIsInstalled] = useState(false)

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="bg-white border rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl"></div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Install
          </button>
        </div>
        <h2 className="text-xl font-bold mb-2">Mobile App</h2>
        <p className="text-gray-600 mb-4">Get the full mobile experience</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Offline support</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Push notifications</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Native performance</span>
          </div>
        </div>
      </div>
    </div>
  )
}`,

    pwa: `'use client'
import { useState, useEffect } from 'react'

export default function ${componentName}() {
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className={\`p-4 rounded-lg mb-6 \${isOnline ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}\`}>
        {isOnline ? '🟢 Online' : '🟡 Offline - Using cached data'}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-3">PWA Features</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Service Worker Active</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>App Shell Cached</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Installable</span>
            </li>
          </ul>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-3">Cache Status</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>Assets: <span className="font-bold text-blue-600">25 cached</span></p>
            <p>Data: <span className="font-bold text-blue-600">150 KB</span></p>
            <p>Updated: <span className="font-bold text-blue-600">2 min ago</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}`,

    sensor: `'use client'
import { useState, useEffect } from 'react'

export default function ${componentName}() {
  const [sensorData, setSensorData] = useState({
    temperature: 22.5,
    humidity: 45,
    pressure: 1013,
    light: 750
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData({
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 20,
        pressure: 1000 + Math.random() * 30,
        light: 500 + Math.random() * 500
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="grid md:grid-cols-4 gap-6">
        {Object.entries(sensorData).map(([key, value]) => (
          <div key={key} className="border rounded-lg p-6 text-center">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">{key}</h3>
            <p className="text-4xl font-bold text-blue-600">
              {typeof value === 'number' ? value.toFixed(1) : value}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {key === 'temperature' ? '°C' : key === 'humidity' ? '%' : key === 'pressure' ? 'hPa' : 'lux'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}`,

    device: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [devices, setDevices] = useState([
    { name: 'Smart Thermostat', status: 'online', battery: 85, lastSeen: '2 min ago' },
    { name: 'Door Sensor', status: 'online', battery: 92, lastSeen: '5 min ago' },
    { name: 'Motion Detector', status: 'offline', battery: 45, lastSeen: '2 hours ago' }
  ])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="space-y-4">
        {devices.map((device, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={\`w-3 h-3 rounded-full \${device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}\`}></div>
                <div>
                  <h3 className="font-semibold text-lg">{device.name}</h3>
                  <p className="text-sm text-gray-600">Last seen: {device.lastSeen}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Battery</p>
                  <p className={\`font-bold \${device.battery > 50 ? 'text-green-600' : 'text-yellow-600'}\`}>
                    {device.battery}%
                  </p>
                </div>
                <span className={\`px-4 py-2 rounded font-medium \${
                  device.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }\`}>{device.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,

    native: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    notifications: true,
    microphone: false
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${name}</h1>
      <div className="border rounded-lg overflow-hidden">
        {Object.entries(permissions).map(([key, value]) => (
          <div key={key} className="border-b last:border-b-0 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold capitalize">{key}</h3>
              <p className="text-sm text-gray-600">Access {key} features</p>
            </div>
            <button
              onClick={() => setPermissions({ ...permissions, [key]: !value })}
              className={\`px-6 py-2 rounded-lg font-medium transition-colors \${
                value ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }\`}>
              {value ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
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

const extendedCapsulesBatch22: Capsule[] = []

const categories = [
  { name: 'Mobile/React Native', prefix: 'rn', count: 60 },
  { name: 'PWA', prefix: 'pwa', count: 60 },
  { name: 'IoT/Sensors', prefix: 'iot', count: 50 },
  { name: 'Mobile/Flutter', prefix: 'flutter', count: 50 },
  { name: 'Wearables', prefix: 'wearable', count: 45 },
  { name: 'Embedded Systems', prefix: 'embedded', count: 45 },
  { name: 'Mobile/Native', prefix: 'native', count: 45 },
  { name: 'Bluetooth/BLE', prefix: 'ble', count: 40 },
  { name: 'GPS/Location', prefix: 'gps', count: 40 },
  { name: 'Mobile/Offline', prefix: 'offline', count: 40 },
  { name: 'Device APIs', prefix: 'deviceapi', count: 25 }
]

const componentTypes: Array<'mobile' | 'pwa' | 'sensor' | 'device' | 'native'> = [
  'mobile', 'pwa', 'sensor', 'device', 'native'
]

const descriptions = {
  mobile: (cat: string) => `${cat} mobile interface with responsive design, touch interactions, and native-like experience`,
  pwa: (cat: string) => `${cat} progressive web app with offline support, service workers, and installable capabilities`,
  sensor: (cat: string) => `${cat} sensor integration with real-time data collection, monitoring, and visualization`,
  device: (cat: string) => `${cat} device management interface with connectivity status, battery monitoring, and controls`,
  native: (cat: string) => `${cat} native features integration with device APIs, permissions, and hardware access`
}

const tagSets = {
  mobile: ['mobile', 'responsive', 'touch', 'app', 'ui'],
  pwa: ['pwa', 'offline', 'service-worker', 'installable', 'web'],
  sensor: ['sensor', 'iot', 'data', 'monitoring', 'realtime'],
  device: ['device', 'iot', 'management', 'connectivity', 'hardware'],
  native: ['native', 'permissions', 'api', 'hardware', 'features']
}

categories.forEach(category => {
  const capsulesPerType = Math.ceil(category.count / componentTypes.length)

  componentTypes.forEach((type, typeIdx) => {
    for (let i = 0; i < capsulesPerType; i++) {
      if (extendedCapsulesBatch22.length >= 500) break

      const index = typeIdx * capsulesPerType + i + 1
      const id = `${category.prefix}-${type}-${index}`
      const name = `${category.name} ${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`
      const desc = descriptions[type](category.name)
      const tags = [category.prefix, ...tagSets[type]]

      extendedCapsulesBatch22.push(generateCapsule(id, name, category.name, desc, tags, type))
    }
  })
})

while (extendedCapsulesBatch22.length < 500) {
  const idx = extendedCapsulesBatch22.length + 1
  extendedCapsulesBatch22.push(
    generateCapsule(
      `mobile-utility-${idx}`,
      `Mobile Utility ${idx}`,
      'Mobile',
      'Comprehensive mobile utility component for app development and device integration',
      ['mobile', 'utilities', 'app', 'development', 'tools'],
      'mobile'
    )
  )
}

export default extendedCapsulesBatch22

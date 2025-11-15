'use client'

import React, { useState, useEffect } from 'react'

/**
 * IoT Smart Home Dashboard
 *
 * A comprehensive IoT dashboard component for monitoring and controlling smart home devices.
 * Features real-time device status, environmental metrics, and control panels.
 *
 * Exported from HubLab Studio V2
 * Categories: Dashboard, IoT, Smart Home
 *
 * @example
 * ```tsx
 * import IoTDashboard from './IoTDashboard'
 *
 * export default function Page() {
 *   return <IoTDashboard />
 * }
 * ```
 */

interface Device {
  id: string
  name: string
  type: 'light' | 'thermostat' | 'lock' | 'camera' | 'sensor'
  status: 'online' | 'offline' | 'warning'
  value?: string | number
  room: string
  lastUpdate: Date
}

interface EnvironmentalData {
  temperature: number
  humidity: number
  airQuality: number
  energyUsage: number
}

export default function IoTDashboard() {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Living Room Lights', type: 'light', status: 'online', value: 'On', room: 'Living Room', lastUpdate: new Date() },
    { id: '2', name: 'Main Thermostat', type: 'thermostat', status: 'online', value: 72, room: 'Living Room', lastUpdate: new Date() },
    { id: '3', name: 'Front Door Lock', type: 'lock', status: 'online', value: 'Locked', room: 'Entrance', lastUpdate: new Date() },
    { id: '4', name: 'Garage Camera', type: 'camera', status: 'online', value: 'Recording', room: 'Garage', lastUpdate: new Date() },
    { id: '5', name: 'Kitchen Sensor', type: 'sensor', status: 'warning', value: 'Motion Detected', room: 'Kitchen', lastUpdate: new Date() },
    { id: '6', name: 'Bedroom Lights', type: 'light', status: 'offline', value: 'Off', room: 'Bedroom', lastUpdate: new Date() },
  ])

  const [environmental, setEnvironmental] = useState<EnvironmentalData>({
    temperature: 72,
    humidity: 45,
    airQuality: 92,
    energyUsage: 3.2
  })

  const [selectedRoom, setSelectedRoom] = useState<string>('All')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironmental(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: prev.humidity + (Math.random() - 0.5) * 5,
        airQuality: Math.max(0, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 10)),
        energyUsage: prev.energyUsage + (Math.random() - 0.5) * 0.5
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const rooms = ['All', ...Array.from(new Set(devices.map(d => d.room)))]

  const filteredDevices = selectedRoom === 'All'
    ? devices
    : devices.filter(d => d.room === selectedRoom)

  const statusCounts = {
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    warning: devices.filter(d => d.status === 'warning').length
  }

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId && device.type === 'light') {
        return {
          ...device,
          value: device.value === 'On' ? 'Off' : 'On',
          lastUpdate: new Date()
        }
      }
      return device
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Smart Home Dashboard</h1>
            <p className="text-slate-600">Monitor and control your connected devices</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Devices</p>
                <p className="text-3xl font-bold text-slate-900">{devices.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Online</p>
                <p className="text-3xl font-bold text-green-600">{statusCounts.online}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Warnings</p>
                <p className="text-3xl font-bold text-yellow-600">{statusCounts.warning}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Offline</p>
                <p className="text-3xl font-bold text-red-600">{statusCounts.offline}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Metrics */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Environmental Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-orange-100 mb-2">Temperature</p>
            <p className="text-4xl font-bold">{environmental.temperature.toFixed(1)}°F</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-blue-100 mb-2">Humidity</p>
            <p className="text-4xl font-bold">{environmental.humidity.toFixed(0)}%</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-green-100 mb-2">Air Quality</p>
            <p className="text-4xl font-bold">{environmental.airQuality.toFixed(0)}/100</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-purple-100 mb-2">Energy Usage</p>
            <p className="text-4xl font-bold">{environmental.energyUsage.toFixed(1)} kW</p>
          </div>
        </div>
      </div>

      {/* Devices */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Devices</h2>
          <div className="mt-4 md:mt-0 flex gap-2">
            {rooms.map(room => (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRoom === room
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map(device => (
            <div key={device.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{device.name}</h3>
                  <p className="text-sm text-slate-500">{device.room}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  device.status === 'online' ? 'bg-green-100 text-green-700' :
                  device.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {device.status}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-slate-900">{device.value}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Updated {device.lastUpdate.toLocaleTimeString()}
                </div>
              </div>

              {device.type === 'light' && device.status === 'online' && (
                <button
                  onClick={() => toggleDevice(device.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Toggle
                </button>
              )}

              {device.type === 'thermostat' && (
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors">
                    −
                  </button>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors">
                    +
                  </button>
                </div>
              )}

              {device.type === 'camera' && (
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors">
                  View Feed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

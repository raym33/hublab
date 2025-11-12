'use client'

import React from 'react'
import LineChart from '@/components/capsules/LineChart'
import BarChart from '@/components/capsules/BarChart'
import Card from '@/components/capsules/Card'
import Badge from '@/components/capsules/Badge'
import Progress from '@/components/capsules/Progress'

/**
 * Test App 1: Dashboard App
 * Tests: Chart components, UI composition, data visualization
 * Components: 5
 * Expected: Clean dashboard layout with charts and metrics
 */

export default function DashboardApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card title="Total Revenue" content="$125,430" />
          <Card title="Active Users" content="1,234" />
          <Card title="Conversion Rate" content="3.2%" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sales Trend</h3>
              <Badge text="Live" variant="success" />
            </div>
            <LineChart data={[
              {x: 0, y: 20},
              {x: 1, y: 45},
              {x: 2, y: 35},
              {x: 3, y: 60},
              {x: 4, y: 50},
              {x: 5, y: 75}
            ]} width={500} height={300} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Product Performance</h3>
              <Badge text="Updated" variant="default" />
            </div>
            <BarChart data={[
              {label: 'Product A', value: 45},
              {label: 'Product B', value: 67},
              {label: 'Product C', value: 89},
              {label: 'Product D', value: 34}
            ]} width={500} height={300} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
          <div className="space-y-4">
            <Progress value={85} label="Website Redesign" />
            <Progress value={60} label="Mobile App" />
            <Progress value={40} label="API Integration" />
            <Progress value={95} label="Testing Phase" />
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import DataTable from '@/components/capsules/DataTable'
import Dropdown from '@/components/capsules/Dropdown'
import Tabs from '@/components/capsules/Tabs'
import Breadcrumb from '@/components/capsules/Breadcrumb'
import Pagination from '@/components/capsules/Pagination'

/**
 * Test App 4: Admin Panel
 * Tests: Complex UI patterns, data management, navigation
 * Components: 5
 * Expected: Structured admin interface with proper layout
 */

export default function AdminPanelApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Dropdown
              options={['Profile', 'Settings', 'Logout']}
              placeholder="Account"
            />
          </div>
          <Breadcrumb items={['Dashboard', 'Users', 'All Users']} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow mb-6">
          <Tabs tabs={[
            { label: 'All Users', content: 'User management panel' },
            { label: 'Active', content: 'Active users' },
            { label: 'Pending', content: 'Pending approvals' },
            { label: 'Archived', content: 'Archived accounts' }
          ]} />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filter by:</label>
            <Dropdown
              options={['All Roles', 'Admin', 'Editor', 'Viewer']}
              placeholder="Role"
            />
            <Dropdown
              options={['All Status', 'Active', 'Inactive', 'Suspended']}
              placeholder="Status"
            />
            <Dropdown
              options={['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time']}
              placeholder="Date Range"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow mb-6">
          <DataTable
            columns={['ID', 'Name', 'Email', 'Role', 'Status', 'Actions']}
            data={[
              ['001', 'John Doe', 'john@example.com', 'Admin', 'Active', 'Edit'],
              ['002', 'Jane Smith', 'jane@example.com', 'Editor', 'Active', 'Edit'],
              ['003', 'Bob Johnson', 'bob@example.com', 'Viewer', 'Inactive', 'Edit'],
              ['004', 'Alice Brown', 'alice@example.com', 'Editor', 'Active', 'Edit'],
              ['005', 'Charlie Wilson', 'charlie@example.com', 'Viewer', 'Suspended', 'Edit']
            ]}
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination
            currentPage={1}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  )
}

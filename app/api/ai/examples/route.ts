/**
 * AI Examples Endpoint
 *
 * Provides visual examples and use cases for components
 * Helps AI assistants understand how components look and work
 */

import { NextResponse } from 'next/server'
import { allCapsules } from '@/lib/all-capsules'

export const runtime = 'edge'

// Example use cases for popular components
const COMPONENT_EXAMPLES = [
  {
    id: 'button-primary',
    componentName: 'Primary Button',
    category: 'UI',
    useCases: [
      {
        title: 'Form Submission',
        description: 'Use for primary actions like "Submit", "Save", "Continue"',
        code: `<PrimaryButton onClick={handleSubmit}>Submit Form</PrimaryButton>`,
        context: 'Forms, modals, checkout flows'
      },
      {
        title: 'Call to Action',
        description: 'Main conversion action on landing pages',
        code: `<PrimaryButton>Get Started Free</PrimaryButton>`,
        context: 'Landing pages, hero sections'
      }
    ],
    variants: ['default', 'loading', 'disabled'],
    visualDescription: 'Solid blue/purple gradient button with white text, rounded corners, hover animation with scale and shadow effects',
    accessibility: 'Fully keyboard accessible, ARIA labels supported, focus visible state'
  },
  {
    id: 'card-basic',
    componentName: 'Card',
    category: 'UI',
    useCases: [
      {
        title: 'Product Display',
        description: 'Show product information in e-commerce',
        code: `<Card>
  <CardImage src="/product.jpg" />
  <CardTitle>Product Name</CardTitle>
  <CardPrice>$99.99</CardPrice>
</Card>`,
        context: 'E-commerce, product listings'
      },
      {
        title: 'Feature Showcase',
        description: 'Highlight key features on marketing pages',
        code: `<Card>
  <Icon name="rocket" />
  <h3>Fast Performance</h3>
  <p>Lightning-fast load times</p>
</Card>`,
        context: 'Landing pages, feature sections'
      }
    ],
    variants: ['basic', 'elevated', 'outlined', 'interactive'],
    visualDescription: 'White container with subtle shadow, rounded corners, padding for content, hover effect with shadow lift',
    accessibility: 'Semantic HTML structure, supports interactive elements'
  },
  {
    id: 'form-input',
    componentName: 'Form Input',
    category: 'Form',
    useCases: [
      {
        title: 'User Registration',
        description: 'Collect user information with validation',
        code: `<FormInput
  label="Email"
  type="email"
  required
  error={errors.email}
  placeholder="you@example.com"
/>`,
        context: 'Registration forms, contact forms'
      },
      {
        title: 'Search Interface',
        description: 'Search functionality with autocomplete',
        code: `<FormInput
  type="search"
  placeholder="Search products..."
  icon="search"
  onChange={handleSearch}
/>`,
        context: 'Search bars, filters'
      }
    ],
    variants: ['text', 'email', 'password', 'search', 'number'],
    visualDescription: 'Clean input field with label, placeholder text, focus border highlight in blue, error state in red',
    accessibility: 'Proper label association, error announcements, keyboard navigation'
  },
  {
    id: 'modal-dialog',
    componentName: 'Modal Dialog',
    category: 'UI',
    useCases: [
      {
        title: 'Confirmation Dialog',
        description: 'Confirm destructive actions',
        code: `<Modal isOpen={isOpen} onClose={handleClose}>
  <ModalTitle>Delete Account?</ModalTitle>
  <ModalBody>This action cannot be undone.</ModalBody>
  <ModalActions>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </ModalActions>
</Modal>`,
        context: 'Confirmations, alerts'
      },
      {
        title: 'Content Form',
        description: 'Display forms in overlay',
        code: `<Modal isOpen={showForm} onClose={closeForm}>
  <ModalTitle>Add New Item</ModalTitle>
  <ModalBody>
    <Form onSubmit={handleSubmit}>
      {/* form fields */}
    </Form>
  </ModalBody>
</Modal>`,
        context: 'Forms, data entry'
      }
    ],
    variants: ['small', 'medium', 'large', 'fullscreen'],
    visualDescription: 'Centered overlay with white background, dark backdrop, close button, smooth fade-in animation',
    accessibility: 'Focus trap, ESC key closes, ARIA dialog role, focus restoration on close'
  },
  {
    id: 'table-data',
    componentName: 'Data Table',
    category: 'Data',
    useCases: [
      {
        title: 'User Management',
        description: 'Display and manage user data',
        code: `<DataTable
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' }
  ]}
  data={users}
  sortable
  filterable
/>`,
        context: 'Admin panels, dashboards'
      }
    ],
    variants: ['basic', 'striped', 'bordered', 'compact'],
    visualDescription: 'Clean table layout with headers, sortable columns, hover row highlighting, responsive scrolling',
    accessibility: 'Semantic table structure, sort announcements, keyboard navigation'
  },
  {
    id: 'toast-notification',
    componentName: 'Toast Notification',
    category: 'Feedback',
    useCases: [
      {
        title: 'Success Messages',
        description: 'Show success feedback after actions',
        code: `<Toast
  type="success"
  message="Settings saved successfully"
  duration={3000}
/>`,
        context: 'Form submissions, CRUD operations'
      },
      {
        title: 'Error Alerts',
        description: 'Display error messages',
        code: `<Toast
  type="error"
  message="Failed to save. Please try again."
  action="Retry"
  onAction={handleRetry}
/>`,
        context: 'Error handling, validation'
      }
    ],
    variants: ['success', 'error', 'warning', 'info'],
    visualDescription: 'Animated notification sliding in from top-right, with icon, message, optional action button, auto-dismiss',
    accessibility: 'ARIA live region, screen reader announcements, dismissible'
  },
  {
    id: 'chart-line',
    componentName: 'Line Chart',
    category: 'Chart',
    useCases: [
      {
        title: 'Analytics Dashboard',
        description: 'Show trends over time',
        code: `<LineChart
  data={analyticsData}
  xAxis="date"
  yAxis="visitors"
  title="Website Traffic"
  showLegend
/>`,
        context: 'Analytics, reporting'
      }
    ],
    variants: ['single-line', 'multi-line', 'area', 'stepped'],
    visualDescription: 'Interactive chart with smooth lines, grid, tooltips on hover, legend, responsive sizing',
    accessibility: 'Data table fallback, keyboard navigation, alt descriptions'
  },
  {
    id: 'navigation-tabs',
    componentName: 'Tabs Navigation',
    category: 'Navigation',
    useCases: [
      {
        title: 'Settings Panels',
        description: 'Organize settings into sections',
        code: `<Tabs defaultTab="general">
  <TabList>
    <Tab id="general">General</Tab>
    <Tab id="security">Security</Tab>
    <Tab id="billing">Billing</Tab>
  </TabList>
  <TabPanel id="general">{/* content */}</TabPanel>
  <TabPanel id="security">{/* content */}</TabPanel>
  <TabPanel id="billing">{/* content */}</TabPanel>
</Tabs>`,
        context: 'Settings, complex forms'
      }
    ],
    variants: ['default', 'pills', 'underline', 'vertical'],
    visualDescription: 'Tab buttons with active state highlight, content panel below, smooth transition between tabs',
    accessibility: 'ARIA tabs pattern, keyboard arrow navigation, proper role attributes'
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const componentId = searchParams.get('id')
  const category = searchParams.get('category')

  try {
    // Filter examples
    let examples = COMPONENT_EXAMPLES

    if (componentId) {
      examples = examples.filter(ex => ex.id === componentId)
    }

    if (category) {
      examples = examples.filter(ex => ex.category.toLowerCase() === category.toLowerCase())
    }

    // Enhance with actual component code from allCapsules
    const enhancedExamples = examples.map(example => {
      const capsule = allCapsules.find(c => c.id === example.id)
      return {
        ...example,
        fullCode: capsule?.code || null,
        dependencies: capsule?.dependencies || [],
        tags: capsule?.tags || []
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        examples: enhancedExamples,
        total: enhancedExamples.length,
        categories: [...new Set(examples.map(e => e.category))]
      },
      meta: {
        endpoint: '/api/ai/examples',
        description: 'Visual examples and use cases for components',
        parameters: {
          id: 'Filter by component ID',
          category: 'Filter by category (UI, Form, Chart, etc.)'
        }
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
        'X-HubLab-Service': 'AI-Examples',
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch examples',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

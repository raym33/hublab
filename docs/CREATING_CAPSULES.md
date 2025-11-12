# Creating HubLab Capsules - Complete Guide

A comprehensive guide to creating, combining, and managing capsules in HubLab.

---

## 📖 Table of Contents

1. [Capsule Anatomy](#capsule-anatomy)
2. [Creating a New Capsule](#creating-a-new-capsule)
3. [Capsule Best Practices](#capsule-best-practices)
4. [Combining Capsules](#combining-capsules)
5. [Converting GitHub Repos to Capsules](#converting-github-repos-to-capsules)
6. [Code Generation & Export](#code-generation--export)
7. [Advanced Patterns](#advanced-patterns)
8. [Testing & Validation](#testing--validation)

---

## 🧬 Capsule Anatomy

### Basic Structure

Every capsule follows this TypeScript interface:

```typescript
interface CapsuleDefinition {
  id: string;              // Unique identifier (kebab-case)
  name: string;            // Display name
  description: string;     // What it does
  category: string;        // Category for organization
  props: PropDefinition[]; // Component props
  dependencies: string[];  // External libraries needed
  code: string;           // React component code
}

interface PropDefinition {
  name: string;           // Prop name (camelCase)
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;      // Is this prop required?
  default: any;          // Default value
  description: string;   // What this prop does
}
```

### Real Example

```typescript
{
  id: 'hero-section',
  name: 'Hero Section',
  description: 'Landing page hero with title, description, and CTA',
  category: 'layout',
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      default: 'Welcome to Our Platform',
      description: 'Main headline text'
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      default: 'Build amazing things',
      description: 'Supporting text below title'
    },
    {
      name: 'buttonText',
      type: 'string',
      required: false,
      default: 'Get Started',
      description: 'CTA button text'
    },
    {
      name: 'showButton',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show/hide CTA button'
    }
  ],
  dependencies: [], // No external deps, uses React & Tailwind
  code: `
function HeroSection({
  title = 'Welcome to Our Platform',
  description = 'Build amazing things',
  buttonText = 'Get Started',
  showButton = true
}) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl text-blue-100 mb-8">{description}</p>
        {showButton && (
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}`
}
```

---

## 🆕 Creating a New Capsule

### Step 1: Define the Purpose

Ask yourself:
- What problem does this solve?
- Is it reusable across projects?
- What props should be customizable?

### Step 2: Write the Component

Create a React functional component with:
- Default props for all parameters
- Tailwind CSS for styling
- Semantic HTML
- Accessibility attributes

```typescript
function MyComponent({
  prop1 = 'default1',
  prop2 = 'default2'
}) {
  return (
    <div className="...">
      {/* Your component JSX */}
    </div>
  )
}
```

### Step 3: Define Props Schema

List all customizable parameters:

```typescript
props: [
  {
    name: 'prop1',
    type: 'string',
    required: true,
    default: 'default1',
    description: 'What prop1 controls'
  },
  // ... more props
]
```

### Step 4: Add to Capsule Library

Create a new file in `/lib/capsules-v2/`:

```typescript
// /lib/capsules-v2/definitions-mycategory.ts
import { CapsuleDefinition } from './types'

export const MY_CAPSULES: CapsuleDefinition[] = [
  {
    id: 'my-capsule',
    name: 'My Capsule',
    description: 'What it does',
    category: 'mycategory',
    props: [/* props here */],
    dependencies: [],
    code: `/* component code */`
  }
]
```

### Step 5: Register in Extended Definitions

Add to `/lib/capsules-v2/definitions-extended.ts`:

```typescript
import { MY_CAPSULES } from './definitions-mycategory'

export const ALL_CAPSULES = [
  ...CAPSULE_DEFINITIONS,
  // ... other imports
  ...MY_CAPSULES  // Add your new capsules
]
```

---

## ✅ Capsule Best Practices

### 1. Naming Conventions

- **ID**: kebab-case (`hero-section`, `data-table`)
- **Name**: Title Case (`Hero Section`, `Data Table`)
- **Props**: camelCase (`buttonText`, `showIcon`)
- **Categories**: lowercase (`layout`, `form`, `chart`)

### 2. Prop Guidelines

```typescript
// ✅ Good - Clear, specific props
props: [
  { name: 'title', type: 'string', required: true, default: 'Title', description: 'Main heading text' },
  { name: 'size', type: 'string', required: false, default: 'md', description: 'Component size: sm, md, lg' }
]

// ❌ Bad - Vague, unclear props
props: [
  { name: 'data', type: 'object', required: true, default: {}, description: 'Data' },
  { name: 'stuff', type: 'string', required: false, default: '', description: 'Stuff' }
]
```

### 3. Default Values

Always provide sensible defaults:

```typescript
// ✅ Good - Working example with defaults
function Button({ text = 'Click Me', size = 'md', color = 'blue' }) {
  // Component renders correctly with no props
}

// ❌ Bad - Requires props to work
function Button({ text, size, color }) {
  // Breaks if no props provided
}
```

### 4. Styling

Use Tailwind CSS consistently:

```typescript
// ✅ Good - Tailwind classes, responsive
<div className="bg-white rounded-lg shadow-md p-6 md:p-8">

// ❌ Bad - Inline styles
<div style={{ background: 'white', padding: '20px' }}>
```

### 5. State Management

Keep state minimal and local:

```typescript
// ✅ Good - Necessary state only
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = React.useState(null)
  // ...
}

// ❌ Bad - Unnecessary complexity
function Accordion({ items }) {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const context = React.useContext(AppContext)
  // Too complex for a capsule
}
```

### 6. Dependencies

Minimize external dependencies:

```typescript
// ✅ Good - React and Tailwind only
dependencies: []

// ⚠️ Acceptable - Common, stable library
dependencies: ['chart.js']

// ❌ Bad - Many dependencies
dependencies: ['lodash', 'moment', 'axios', 'formik', 'yup']
```

---

## 🔗 Combining Capsules

### Basic Combination

Capsules work together through composition:

```typescript
// Parent capsule uses child capsules
function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Dashboard" />

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Users" value="1,234" icon="👥" />
          <StatCard label="Revenue" value="$45K" icon="💰" />
          <StatCard label="Orders" value="892" icon="📦" />
          <StatCard label="Growth" value="+12%" icon="📈" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BarChart data={salesData} />
          <LineChart data={userGrowth} />
        </div>

        <DataTable headers={headers} rows={rows} />
      </div>
    </div>
  )
}
```

### Layout Patterns

#### 1. Container Pattern
```typescript
function Page() {
  return (
    <Container maxWidth="lg">
      <HeroSection {...heroProps} />
      <FeatureGrid features={features} />
      <CTABanner {...ctaProps} />
    </Container>
  )
}
```

#### 2. Grid Pattern
```typescript
function GridLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card {...card1} />
      <Card {...card2} />
      <Card {...card3} />
    </div>
  )
}
```

#### 3. Sidebar Pattern
```typescript
function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <SidebarMenu items={menuItems} />
      <div className="flex-1 p-8">
        {/* Main content with capsules */}
        <DashboardWidget {...widget1} />
        <DataTable {...tableProps} />
      </div>
    </div>
  )
}
```

### Data Flow Between Capsules

#### Parent → Child (Props)
```typescript
function ParentCapsule() {
  const data = fetchData()

  return (
    <div>
      <StatCard value={data.total} label="Total" />
      <Chart data={data.series} />
    </div>
  )
}
```

#### Child → Parent (Callbacks)
```typescript
function ParentCapsule() {
  const [selectedItem, setSelectedItem] = React.useState(null)

  return (
    <div>
      <DataTable
        rows={rows}
        onRowClick={(row) => setSelectedItem(row)}
      />

      {selectedItem && (
        <Modal>
          <DetailView item={selectedItem} />
        </Modal>
      )}
    </div>
  )
}
```

#### Shared State (Context)
```typescript
// For complex apps
const AppContext = React.createContext()

function App() {
  const [state, setState] = React.useState(initialState)

  return (
    <AppContext.Provider value={{ state, setState }}>
      <Navbar />
      <Dashboard />
      <Footer />
    </AppContext.Provider>
  )
}
```

---

## 🔄 Converting GitHub Repos to Capsules

### Process Overview

1. Analyze the component
2. Extract reusable logic
3. Simplify dependencies
4. Create capsule definition
5. Test and validate

### Step-by-Step Guide

#### Step 1: Analyze Component

Clone and examine the repo:

```bash
git clone https://github.com/user/component-repo
cd component-repo
```

Look for:
- Main component file
- Props interface
- Dependencies in package.json
- Styling approach

#### Step 2: Extract Core Component

Find the main component:

```typescript
// Original repo might have:
import { SomeLibrary } from 'some-library'
import styles from './Component.module.css'

export function OriginalComponent({ prop1, prop2, prop3 }) {
  // Complex logic here
  return <div>...</div>
}
```

#### Step 3: Simplify & Adapt

Convert to capsule format:

```typescript
// Capsule version:
function SimplifiedComponent({
  prop1 = 'default1',
  prop2 = 'default2'
}) {
  // Keep only essential logic
  // Replace CSS modules with Tailwind
  // Remove unnecessary dependencies

  return (
    <div className="...">
      {/* Simplified JSX */}
    </div>
  )
}
```

#### Step 4: Handle Dependencies

**Option A: Remove if Possible**
```typescript
// ❌ Original with dependency
import { format } from 'date-fns'
const formatted = format(date, 'MMM dd, yyyy')

// ✅ Capsule without dependency
const formatted = new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})
```

**Option B: Include if Necessary**
```typescript
// For essential libraries
{
  dependencies: ['chart.js'], // Chart rendering library
  code: `
// Import at top of component
import Chart from 'chart.js/auto'

function ChartComponent({ data }) {
  // Use the library
}
`
}
```

#### Step 5: Create Capsule Definition

```typescript
{
  id: 'repo-component',
  name: 'Repo Component',
  description: 'Converted from github.com/user/component-repo',
  category: 'ui',
  props: [
    // Extract from original props interface
    {
      name: 'prop1',
      type: 'string',
      required: true,
      default: 'default',
      description: 'From original component'
    }
  ],
  dependencies: [], // Or list if needed
  code: `
function RepoComponent({ prop1 = 'default' }) {
  return (
    <div className="...">
      {/* Adapted component */}
    </div>
  )
}`
}
```

### Real Example: Converting a Button Library

**Original Repo:**
```typescript
// https://github.com/example/fancy-button
import styled from 'styled-components'
import { darken, lighten } from 'polished'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
}

const StyledButton = styled.button<ButtonProps>`
  background: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
  padding: ${props => props.size === 'lg' ? '12px 24px' : '8px 16px'};
  &:hover {
    background: ${props => darken(0.1, '#007bff')};
  }
`

export function FancyButton(props: ButtonProps) {
  return <StyledButton {...props}>{props.children}</StyledButton>
}
```

**Converted Capsule:**
```typescript
{
  id: 'fancy-button',
  name: 'Fancy Button',
  description: 'Stylish button with variants (from github.com/example/fancy-button)',
  category: 'ui',
  props: [
    {
      name: 'text',
      type: 'string',
      required: true,
      default: 'Click Me',
      description: 'Button text'
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      default: 'primary',
      description: 'Button style: primary or secondary'
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      default: 'md',
      description: 'Button size: sm, md, lg'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Disabled state'
    }
  ],
  dependencies: [], // Removed styled-components and polished
  code: `
function FancyButton({
  text = 'Click Me',
  variant = 'primary',
  size = 'md',
  disabled = false
}) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  }

  return (
    <button
      disabled={disabled}
      className={\`\${variants[variant]} \${sizes[size]} rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed\`}
    >
      {text}
    </button>
  )
}`
}
```

### Conversion Checklist

- [ ] Identify main component
- [ ] Extract prop interface
- [ ] Remove unnecessary dependencies
- [ ] Convert CSS to Tailwind
- [ ] Simplify complex logic
- [ ] Add default values for all props
- [ ] Test component renders correctly
- [ ] Document original source
- [ ] Add to capsule library

---

## 💻 Code Generation & Export

### How Export Works

When you export from Studio V2, HubLab:

1. **Collects** all capsules on canvas
2. **Orders** them logically (top to bottom, left to right)
3. **Resolves** dependencies
4. **Generates** clean code based on format
5. **Optimizes** imports and styling

### Export Formats

#### 1. React Component

**Output:**
```typescript
import React from 'react'

// Individual components
export function HeroSection({ title = '...', description = '...' }) {
  return (/* ... */)
}

export function FeatureGrid({ features = [] }) {
  return (/* ... */)
}

// Main composed component
export default function MyApp() {
  return (
    <div>
      <HeroSection title="Welcome" description="..." />
      <FeatureGrid features={[...]} />
    </div>
  )
}
```

**Use Case:** Integrate into existing React app

#### 2. Next.js Page

**Output:**
```typescript
// app/page.tsx or pages/index.tsx
export default function Page() {
  return (
    <main className="min-h-screen">
      {/* All components rendered in page */}
      <HeroSection {...props} />
      <FeatureGrid {...props} />
    </main>
  )
}

// Components defined below or in separate files
function HeroSection({ ... }) { /* ... */ }
function FeatureGrid({ ... }) { /* ... */ }
```

**Use Case:** Create new Next.js page

#### 3. HTML/CSS

**Output:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen">
    <!-- All components as HTML -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <h1 class="text-5xl font-bold">Welcome</h1>
      <!-- ... -->
    </div>
  </div>

  <script>
    // Any necessary JavaScript
  </script>
</body>
</html>
```

**Use Case:** Static website, no build process

### Code Optimization

#### Import Optimization

HubLab automatically:
- Deduplicates imports
- Groups by source
- Removes unused imports

```typescript
// ✅ Generated code
import React from 'react'
import { Chart } from 'chart.js'

// ❌ What you don't get
import React from 'react'
import React from 'react' // Duplicate
import { Chart } from 'chart.js'
import { unused } from 'some-lib' // Unused
```

#### CSS Optimization

Tailwind classes are:
- Alphabetically sorted
- Deduplicated
- Responsive-first ordered

```typescript
// ✅ Generated
className="flex items-center justify-between bg-white px-4 py-2 rounded-lg md:px-6 lg:px-8"

// ❌ What you don't get
className="px-4 bg-white flex rounded-lg py-2 items-center justify-between px-4 md:px-6 lg:px-8"
```

#### Component Ordering

Components are ordered by:
1. Dependencies (components used by others come first)
2. Visual hierarchy (layout → containers → content)
3. Logical flow (header → main → footer)

---

## 🎨 Advanced Patterns

### 1. Compound Components

Create components that work together:

```typescript
// Tabs compound component
{
  id: 'tabs-container',
  name: 'Tabs Container',
  code: `
function Tabs({ children, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = React.useState(defaultTab)

  return (
    <div className="tabs-container">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: index === activeTab,
          onClick: () => setActiveTab(index)
        })
      )}
    </div>
  )
}

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={\`px-4 py-2 \${isActive ? 'border-b-2 border-blue-600' : ''}\`}
    >
      {label}
    </button>
  )
}

function TabPanel({ children, isActive }) {
  return isActive ? <div className="p-4">{children}</div> : null
}
`
}
```

### 2. Render Props

Pass rendering logic as props:

```typescript
{
  id: 'data-fetcher',
  name: 'Data Fetcher',
  code: `
function DataFetcher({ url, render }) {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [url])

  if (loading) return <LoadingSpinner />
  return render(data)
}

// Usage:
<DataFetcher
  url="/api/users"
  render={(users) => (
    <DataTable rows={users} />
  )}
/>
`
}
```

### 3. Higher-Order Components

Wrap capsules with additional behavior:

```typescript
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <LoadingSpinner />
    return <Component {...props} />
  }
}

const DataTableWithLoading = withLoading(DataTable)
```

### 4. Custom Hooks

Extract reusable logic:

```typescript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

// Use in capsule
function MyComponent() {
  const [settings, setSettings] = useLocalStorage('settings', {})
  // ...
}
```

---

## 🧪 Testing & Validation

### Manual Testing Checklist

Before adding a capsule:

- [ ] Renders without errors
- [ ] All props have default values
- [ ] Default values create working example
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] No console errors or warnings
- [ ] Works in Studio V2 canvas
- [ ] Exports correctly to all formats

### Common Issues

#### Issue: Template Literals Not Escaping

```typescript
// ❌ Wrong
code: `function MyComponent() {
  const value = ${someValue}  // This will error
}`

// ✅ Correct
code: `function MyComponent() {
  const value = \${someValue}  // Escaped properly
}`
```

#### Issue: Missing React Import

```typescript
// ❌ Wrong
code: `function MyComponent() {
  const [state, setState] = React.useState()  // React not imported
}`

// ✅ Correct
// React is available globally in HubLab, but for clarity:
code: `function MyComponent() {
  const [state, setState] = React.useState()  // Works
  // Or import explicitly if exporting standalone
}`
```

#### Issue: Infinite Loops

```typescript
// ❌ Wrong
React.useEffect(() => {
  setValue(value + 1)  // Runs infinitely
})

// ✅ Correct
React.useEffect(() => {
  setValue(value + 1)
}, [])  // Empty deps = run once
```

---

## 📚 Additional Resources

- **Live Platform:** [hublab.dev](https://hublab.dev)
- **Studio V2:** [hublab.dev/studio-v2](https://hublab.dev/studio-v2)
- **Component Library:** [hublab.dev/capsules](https://hublab.dev/capsules)
- **React Docs:** [react.dev](https://react.dev)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)

---

**Ready to create amazing capsules!** 🚀

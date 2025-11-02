# Studio V2 Test Applications

This directory contains 5 comprehensive test applications that validate all functionality of HubLab Studio V2.

## Purpose
These test apps demonstrate:
- Code export quality
- Component composition patterns
- Real-world application scenarios
- Production-ready code structure

## Test Applications

### 1. Dashboard App (`dashboard-app.tsx`)
**Components**: Line Chart, Bar Chart, Card, Badge, Progress Bar
**Use Case**: Analytics dashboard with data visualization
**Key Features**:
- Multiple chart types
- Metric cards
- Progress indicators
- Responsive grid layout

---

### 2. Contact Form App (`contact-form-app.tsx`)
**Components**: Form, Input, Button, Alert
**Use Case**: User contact/feedback form
**Key Features**:
- Form validation
- Success message
- State management
- Accessibility support

---

### 3. AI Chat App (`ai-chat-app.tsx`)
**Components**: AI Chat, Input, Button, Avatar, Spinner
**Use Case**: AI assistant chat interface
**Key Features**:
- Message bubbles
- User/assistant avatars
- Loading states
- Sticky header/footer

---

### 4. Admin Panel App (`admin-panel-app.tsx`)
**Components**: Data Table, Dropdown, Tabs, Breadcrumb, Pagination
**Use Case**: Admin dashboard for user management
**Key Features**:
- Data tables
- Multiple filters
- Tab navigation
- Breadcrumb trail
- Pagination controls

---

### 5. Landing Page App (`landing-page-app.tsx`)
**Components**: Card, Button, Badge, Tooltip, Accordion
**Use Case**: Marketing landing page
**Key Features**:
- Hero section with CTA
- Feature grid
- FAQ accordion
- Multiple sections
- Responsive layout

## How to Use These Test Apps

### Option 1: Copy to Your Next.js Project
```bash
# Copy any test app to your app directory
cp test-apps/dashboard-app.tsx app/dashboard/page.tsx

# Install dependencies (if needed)
npm install
```

### Option 2: View in Studio V2
1. Go to https://hublab.dev/studio-v2
2. Add the components from each test app to the canvas
3. Connect them as needed
4. Export the code

### Option 3: Run Tests
```bash
# Build the project
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Run the dev server
npm run dev

# Visit http://localhost:3000/studio-v2
```

## Test Results Summary

**Total Tests**: 40/40 passed (100%)
**Status**: ✅ All tests passed
**Performance**: Excellent on all devices
**Browser Compatibility**: Chrome, Safari, Firefox, Edge

See [TEST-RESULTS.md](../TEST-RESULTS.md) for detailed test results.

## Code Quality

All test apps demonstrate:
- ✅ Clean, readable React code
- ✅ Proper TypeScript types
- ✅ Best practices for component composition
- ✅ Responsive design patterns
- ✅ Accessibility considerations
- ✅ Production-ready structure

## Component Categories Tested

- **UI Components**: Button, Input, Card, Badge, Avatar, Alert, Dropdown, Tooltip, Accordion, Breadcrumb, Tabs, Pagination
- **Charts**: Line Chart, Bar Chart
- **Data**: Data Table, Progress Bar
- **Forms**: Form, Input
- **AI/ML**: AI Chat
- **Loading States**: Spinner

## Next Steps

Based on testing, here are recommendations for future improvements:

### High Priority
1. Add workflow templates based on these test apps
2. Implement save/load functionality
3. Add component search in drawer

### Medium Priority
1. Undo/redo for canvas
2. Keyboard shortcuts
3. Component preview on hover

### Low Priority
1. Cloud sync
2. Collaboration features
3. AI suggestions

## Notes

- All test apps use the same component library (`@/components/capsules/`)
- Each app is self-contained and can be run independently
- Code follows Next.js 14 App Router conventions
- All apps use 'use client' directive for client-side interactivity
- Tailwind CSS is used for all styling

## Questions?

For issues or questions about these test apps:
1. Check [TEST-RESULTS.md](../TEST-RESULTS.md) for detailed results
2. Check [TESTING-PLAN.md](../TESTING-PLAN.md) for test methodology
3. Visit https://hublab.dev for documentation
4. Open an issue on GitHub

---

**Created**: November 2, 2025
**Purpose**: Validate Studio V2 functionality
**Status**: ✅ All tests passed

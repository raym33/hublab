# Testing Guide

HubLab uses a comprehensive testing strategy to ensure code quality and reliability.

## Test Stack

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **CI/CD**: GitHub Actions

## Running Tests

### Unit Tests (Jest)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run all tests (unit + e2e)
npm run test:all
```

## Test Structure

```
hublab/
├── __tests__/              # Unit tests
│   ├── lib/               # Tests for lib/ modules
│   ├── components/        # Component tests
│   └── api/               # API tests
├── e2e/                   # E2E tests
│   ├── homepage.spec.ts
│   ├── compiler.spec.ts
│   └── marketplace.spec.ts
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup file
└── playwright.config.ts   # Playwright configuration
```

## Writing Tests

### Unit Test Example

```typescript
// __tests__/lib/my-module.test.ts
import { myFunction } from '@/lib/my-module'

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected)
  })
})
```

### Component Test Example

```typescript
// __tests__/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Test Example

```typescript
// e2e/feature.spec.ts
import { test, expect } from '@playwright/test'

test('should navigate to page', async ({ page }) => {
  await page.goto('/feature')
  await expect(page).toHaveTitle(/Feature/)
})
```

## Coverage Goals

- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

Current coverage reports are generated in `coverage/` directory.

## CI/CD

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

The CI pipeline runs:
1. Linting & Type Check
2. Unit Tests (with coverage)
3. E2E Tests
4. Build Check

See `.github/workflows/ci.yml` for configuration.

## Debugging Tests

### Jest

```bash
# Debug a specific test file
npm test -- path/to/test.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should do something"
```

### Playwright

```bash
# Debug with headed browser
npx playwright test --headed

# Debug specific test
npx playwright test e2e/homepage.spec.ts --debug
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Keep Tests Isolated**: Each test should be independent
3. **Use Descriptive Names**: Test names should explain what is being tested
4. **Mock External Dependencies**: Use mocks for APIs, databases, etc.
5. **Test Edge Cases**: Don't just test the happy path

## Adding New Tests

When adding new features:
1. Write unit tests for new functions/modules
2. Add component tests for new UI components
3. Add E2E tests for new user flows
4. Update this document if needed

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)

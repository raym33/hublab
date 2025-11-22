/**
 * Unit tests for CapsuleBrowser component
 * Tests filtering, search, and interaction functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CapsuleBrowser from '@/components/CapsuleBrowser'

// Mock the example capsules module
jest.mock('@/lib/capsule-compiler/example-capsules', () => ({
  EXAMPLE_CAPSULES: [
    {
      id: 'capsule-1',
      name: 'Button Component',
      aiDescription: 'A customizable button component',
      category: 'ui-components',
      tags: ['button', 'react', 'ui'],
      version: '1.0.0',
      verified: true,
      usageCount: 5000,
      aiMetadata: { complexity: 'simple' },
    },
    {
      id: 'capsule-2',
      name: 'Dashboard Layout',
      aiDescription: 'A responsive dashboard layout',
      category: 'layout',
      tags: ['dashboard', 'layout', 'responsive'],
      version: '2.1.0',
      verified: false,
      usageCount: 3000,
      aiMetadata: { complexity: 'medium' },
    },
    {
      id: 'capsule-3',
      name: 'Data Table',
      aiDescription: 'An advanced data table with sorting',
      category: 'data-display',
      tags: ['table', 'data', 'sorting'],
      version: '1.5.0',
      verified: true,
      usageCount: 8000,
      aiMetadata: { complexity: 'advanced' },
    },
    {
      id: 'capsule-4',
      name: 'Navigation Bar',
      aiDescription: 'A simple navigation bar component',
      category: 'navigation',
      tags: ['nav', 'menu', 'header'],
      version: '1.2.0',
      verified: false,
      usageCount: 6000,
      aiMetadata: { complexity: 'simple' },
    },
  ],
}))

describe('CapsuleBrowser', () => {
  const mockOnSelectCapsule = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<CapsuleBrowser />)
      expect(screen.getByText('Capsule Library')).toBeInTheDocument()
    })

    it('should display capsule count', () => {
      render(<CapsuleBrowser />)
      expect(screen.getByText(/4 of 4 capsules/i)).toBeInTheDocument()
    })

    it('should render all capsules initially', () => {
      render(<CapsuleBrowser />)
      expect(screen.getByText('Button Component')).toBeInTheDocument()
      expect(screen.getByText('Dashboard Layout')).toBeInTheDocument()
      expect(screen.getByText('Data Table')).toBeInTheDocument()
      expect(screen.getByText('Navigation Bar')).toBeInTheDocument()
    })

    it('should display search input', () => {
      render(<CapsuleBrowser />)
      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      expect(searchInput).toBeInTheDocument()
    })

    it('should display category filter', () => {
      render(<CapsuleBrowser />)
      expect(screen.getByText('Category')).toBeInTheDocument()
    })

    it('should display complexity filter', () => {
      render(<CapsuleBrowser />)
      expect(screen.getByText('Complexity')).toBeInTheDocument()
    })
  })

  describe('search functionality', () => {
    it('should filter capsules by name', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      await user.type(searchInput, 'button')

      expect(screen.getByText('Button Component')).toBeInTheDocument()
      expect(screen.queryByText('Dashboard Layout')).not.toBeInTheDocument()
      expect(screen.queryByText('Data Table')).not.toBeInTheDocument()
    })

    it('should filter capsules by description', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      await user.type(searchInput, 'responsive')

      expect(screen.getByText('Dashboard Layout')).toBeInTheDocument()
      expect(screen.queryByText('Button Component')).not.toBeInTheDocument()
    })

    it('should filter capsules by tags', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      await user.type(searchInput, 'sorting')

      expect(screen.getByText('Data Table')).toBeInTheDocument()
      expect(screen.queryByText('Button Component')).not.toBeInTheDocument()
    })

    it('should be case-insensitive', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      await user.type(searchInput, 'BUTTON')

      expect(screen.getByText('Button Component')).toBeInTheDocument()
    })

    it('should show clear button when searching', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      await user.type(searchInput, 'test')

      const clearButtons = screen.getAllByRole('button')
      const clearButton = clearButtons.find(
        btn => btn.querySelector('svg')?.classList.contains('lucide-x')
      )
      expect(clearButton).toBeInTheDocument()
    })

    it('should clear search when clicking clear button', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i) as HTMLInputElement
      await user.type(searchInput, 'button')

      const clearButtons = screen.getAllByRole('button')
      const clearButton = clearButtons.find(
        btn => btn.querySelector('svg')?.classList.contains('lucide-x')
      )

      if (clearButton) {
        await user.click(clearButton)
      }

      expect(searchInput.value).toBe('')
    })
  })

  describe('category filter', () => {
    it('should filter by category', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement
      await user.selectOptions(categorySelect, 'ui-components')

      await waitFor(() => {
        expect(screen.getByText('Button Component')).toBeInTheDocument()
        expect(screen.queryByText('Dashboard Layout')).not.toBeInTheDocument()
      })
    })

    it('should show all capsules when category is "all"', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement
      await user.selectOptions(categorySelect, 'ui-components')
      await user.selectOptions(categorySelect, 'all')

      await waitFor(() => {
        expect(screen.getByText('Button Component')).toBeInTheDocument()
        expect(screen.getByText('Dashboard Layout')).toBeInTheDocument()
      })
    })
  })

  describe('complexity filter', () => {
    it('should filter by complexity', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const complexitySelect = screen.getByLabelText(/complexity/i) as HTMLSelectElement
      await user.selectOptions(complexitySelect, 'simple')

      await waitFor(() => {
        expect(screen.getByText('Button Component')).toBeInTheDocument()
        expect(screen.getByText('Navigation Bar')).toBeInTheDocument()
        expect(screen.queryByText('Data Table')).not.toBeInTheDocument()
      })
    })

    it('should filter medium complexity', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const complexitySelect = screen.getByLabelText(/complexity/i) as HTMLSelectElement
      await user.selectOptions(complexitySelect, 'medium')

      await waitFor(() => {
        expect(screen.getByText('Dashboard Layout')).toBeInTheDocument()
        expect(screen.queryByText('Button Component')).not.toBeInTheDocument()
      })
    })

    it('should filter advanced complexity', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const complexitySelect = screen.getByLabelText(/complexity/i) as HTMLSelectElement
      await user.selectOptions(complexitySelect, 'advanced')

      await waitFor(() => {
        expect(screen.getByText('Data Table')).toBeInTheDocument()
        expect(screen.queryByText('Button Component')).not.toBeInTheDocument()
      })
    })
  })

  describe('combined filters', () => {
    it('should combine search and category filter', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      const categorySelect = screen.getByLabelText(/category/i)

      await user.type(searchInput, 'component')
      await user.selectOptions(categorySelect, 'ui-components')

      await waitFor(() => {
        expect(screen.getByText('Button Component')).toBeInTheDocument()
        expect(screen.queryByText('Navigation Bar')).not.toBeInTheDocument()
      })
    })

    it('should show empty state when no results', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      await user.type(searchInput, 'nonexistent-capsule-xyz')

      await waitFor(() => {
        expect(screen.getByText('No capsules found')).toBeInTheDocument()
        expect(screen.getByText(/try adjusting your filters/i)).toBeInTheDocument()
      })
    })
  })

  describe('capsule selection', () => {
    it('should call onSelectCapsule when clicking a capsule', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser onSelectCapsule={mockOnSelectCapsule} />)

      const capsule = screen.getByText('Button Component')
      await user.click(capsule.closest('div')!)

      expect(mockOnSelectCapsule).toHaveBeenCalledWith('capsule-1')
    })

    it('should highlight selected capsule', () => {
      render(
        <CapsuleBrowser
          onSelectCapsule={mockOnSelectCapsule}
          selectedCapsuleId="capsule-1"
        />
      )

      const capsule = screen.getByText('Button Component').closest('div')
      expect(capsule).toHaveClass('border-blue-500')
    })

    it('should not crash without onSelectCapsule prop', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const capsule = screen.getByText('Button Component')
      await user.click(capsule.closest('div')!)

      // Should not throw
      expect(screen.getByText('Button Component')).toBeInTheDocument()
    })
  })

  describe('view mode', () => {
    it('should toggle between grid and list view', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const buttons = screen.getAllByRole('button')
      const listViewButton = buttons.find(
        btn => btn.querySelector('svg')?.classList.contains('lucide-code')
      )

      expect(listViewButton).toBeInTheDocument()

      if (listViewButton) {
        await user.click(listViewButton)
        // Component should re-render in list view
        expect(listViewButton).toHaveClass('bg-blue-100')
      }
    })
  })

  describe('clear filters', () => {
    it('should show clear filters button when filters are applied', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i)
      await user.type(searchInput, 'test')

      await waitFor(() => {
        expect(screen.getByText('Clear filters')).toBeInTheDocument()
      })
    })

    it('should clear all filters when clicking clear filters', async () => {
      const user = userEvent.setup()
      render(<CapsuleBrowser />)

      const searchInput = screen.getByPlaceholderText(/search capsules/i) as HTMLInputElement
      const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement

      await user.type(searchInput, 'button')
      await user.selectOptions(categorySelect, 'ui-components')

      const clearFiltersButton = screen.getByText('Clear filters')
      await user.click(clearFiltersButton)

      expect(searchInput.value).toBe('')
      expect(categorySelect.value).toBe('all')
    })
  })

  describe('capsule metadata display', () => {
    it('should display capsule version', () => {
      render(<CapsuleBrowser />)
      expect(screen.getByText('v1.0.0')).toBeInTheDocument()
    })

    it('should display verified badge for verified capsules', () => {
      render(<CapsuleBrowser />)
      const buttonCapsule = screen.getByText('Button Component').closest('div')
      const sparklesIcon = buttonCapsule?.querySelector('.lucide-sparkles')
      expect(sparklesIcon).toBeInTheDocument()
    })

    it('should display complexity badges', () => {
      render(<CapsuleBrowser />)
      expect(screen.getAllByText('simple').length).toBeGreaterThan(0)
      expect(screen.getByText('medium')).toBeInTheDocument()
      expect(screen.getByText('advanced')).toBeInTheDocument()
    })

    it('should display tags', () => {
      render(<CapsuleBrowser />)
      expect(screen.getByText('button')).toBeInTheDocument()
      expect(screen.getByText('react')).toBeInTheDocument()
    })
  })
})

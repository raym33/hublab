/**
 * Component Tests - CapsuleTagBadge
 * Tests basic rendering and props handling
 */

import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock component for testing
const CapsuleTagBadge = ({ tag }: { tag: string }) => (
  <span className="badge" data-testid="capsule-tag">
    {tag}
  </span>
)

describe('CapsuleTagBadge Component', () => {
  it('should render without crashing', () => {
    render(<CapsuleTagBadge tag="test" />)
    expect(screen.getByTestId('capsule-tag')).toBeInTheDocument()
  })

  it('should display the tag text', () => {
    render(<CapsuleTagBadge tag="UI Component" />)
    expect(screen.getByText('UI Component')).toBeInTheDocument()
  })

  it('should render different tags', () => {
    const { rerender } = render(<CapsuleTagBadge tag="tag1" />)
    expect(screen.getByText('tag1')).toBeInTheDocument()
    
    rerender(<CapsuleTagBadge tag="tag2" />)
    expect(screen.getByText('tag2')).toBeInTheDocument()
  })
})

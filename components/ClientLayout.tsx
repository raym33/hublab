/**
 * Client Layout Wrapper
 * Provides ErrorBoundary for the entire application
 */

'use client'

import { ReactNode } from 'react'
import ErrorBoundary from './ErrorBoundary'

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}

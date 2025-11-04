/**
 * ButtonGroup Component
 * Group buttons together with connected styling
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonGroupProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  fullWidth?: boolean
  className?: string
}

const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  fullWidth = false,
  className
}: ButtonGroupProps) => {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        fullWidth && 'w-full',
        '[&>button]:rounded-none',
        '[&>button]:border-r-0',
        '[&>button:first-child]:rounded-l-lg',
        '[&>button:last-child]:rounded-r-lg',
        '[&>button:last-child]:border-r',
        orientation === 'vertical' && [
          '[&>button:first-child]:rounded-t-lg',
          '[&>button:first-child]:rounded-l-none',
          '[&>button:last-child]:rounded-b-lg',
          '[&>button:last-child]:rounded-r-none',
          '[&>button]:border-b-0',
          '[&>button:last-child]:border-b'
        ],
        className
      )}
      role="group"
    >
      {children}
    </div>
  )
}

export default ButtonGroup

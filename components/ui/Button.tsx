/**
 * Button Component
 * Versatile button with multiple variants, sizes, and states
 */

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'info' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  rounded?: boolean
  shadow?: boolean
  as?: 'button' | 'a'
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = false,
      shadow = false,
      disabled,
      className,
      children,
      as = 'button',
      href,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500 active:bg-blue-100',
      ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500 active:bg-gray-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 active:bg-yellow-800',
      info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 active:bg-cyan-800',
      link: 'text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500'
    }

    const sizes = {
      xs: 'text-xs px-2 py-1 rounded gap-1',
      sm: 'text-sm px-3 py-1.5 rounded-md gap-1.5',
      md: 'text-base px-4 py-2 rounded-lg gap-2',
      lg: 'text-lg px-6 py-3 rounded-lg gap-2',
      xl: 'text-xl px-8 py-4 rounded-xl gap-3'
    }

    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      rounded && 'rounded-full',
      shadow && 'shadow-lg hover:shadow-xl',
      className
    )

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span>{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span>{rightIcon}</span>}
      </>
    )

    if (as === 'a' && href) {
      return (
        <a
          ref={ref as any}
          href={href}
          className={classes}
          {...(props as any)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

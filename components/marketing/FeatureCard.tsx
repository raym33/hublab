/**
 * FeatureCard Component
 * Feature showcase card with icon, title, and description
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  variant?: 'default' | 'bordered' | 'elevated'
  iconColor?: string
  className?: string
}

const FeatureCard = ({
  icon,
  title,
  description,
  variant = 'default',
  iconColor = 'text-blue-600',
  className
}: FeatureCardProps) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800',
    bordered: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg'
  }

  return (
    <div
      className={cn(
        'p-6 rounded-lg transition-all duration-200 hover:shadow-md',
        variants[variant],
        className
      )}
    >
      <div className={cn('w-12 h-12 mb-4', iconColor)}>
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default FeatureCard

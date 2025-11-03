'use client'

import { Tag } from 'lucide-react'

interface CapsuleTagBadgeProps {
  tag: string
  onClick?: () => void
  variant?: 'default' | 'clickable' | 'active'
  size?: 'sm' | 'md'
}

/**
 * Capsule Tag Badge Component
 *
 * Visual representation of capsule tags with color coding
 * Supports clickable tags for filtering
 */
export default function CapsuleTagBadge({
  tag,
  onClick,
  variant = 'default',
  size = 'sm'
}: CapsuleTagBadgeProps) {
  // Color scheme based on tag category
  const getTagColors = (tag: string): string => {
    const lowerTag = tag.toLowerCase()

    // Category colors
    if (['ui', 'interface', 'visual', 'component'].includes(lowerTag)) {
      return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
    }
    if (['form', 'input', 'validation', 'field'].includes(lowerTag)) {
      return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
    }
    if (['button', 'action', 'cta', 'clickable'].includes(lowerTag)) {
      return 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
    }
    if (['layout', 'grid', 'container', 'structure'].includes(lowerTag)) {
      return 'bg-teal-100 text-teal-700 border-teal-300 hover:bg-teal-200'
    }
    if (['navigation', 'menu', 'routing', 'breadcrumb'].includes(lowerTag)) {
      return 'bg-cyan-100 text-cyan-700 border-cyan-300 hover:bg-cyan-200'
    }
    if (['animation', 'animated', 'motion', 'transition'].includes(lowerTag)) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200'
    }
    if (['chart', 'graph', 'visualization', 'data'].includes(lowerTag)) {
      return 'bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200'
    }
    if (['interactive', 'hoverable', 'responsive'].includes(lowerTag)) {
      return 'bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200'
    }
    if (['loading', 'spinner', 'async', 'waiting'].includes(lowerTag)) {
      return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200'
    }
    if (['modal', 'dialog', 'overlay', 'popup'].includes(lowerTag)) {
      return 'bg-violet-100 text-violet-700 border-violet-300 hover:bg-violet-200'
    }

    // Default
    return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1'
  }

  const baseClasses = `inline-flex items-center gap-1 rounded-full border font-medium transition-all ${sizeClasses[size]}`

  const variantClasses = {
    default: '',
    clickable: 'cursor-pointer hover:shadow-sm',
    active: 'ring-2 ring-offset-1 shadow-sm'
  }

  const colorClasses = getTagColors(tag)

  const classes = `${baseClasses} ${colorClasses} ${variantClasses[variant]}`

  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      className={classes}
      type={onClick ? 'button' : undefined}
    >
      {size === 'md' && <Tag className="w-3 h-3" />}
      {tag}
    </Component>
  )
}

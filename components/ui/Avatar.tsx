/**
 * Avatar Component
 * User avatar with image, initials fallback, and status indicator
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  shape?: 'circle' | 'square'
  className?: string
}

const Avatar = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  status,
  shape = 'circle',
  className
}: AvatarProps) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  }

  const getInitials = () => {
    if (initials) return initials
    if (alt) {
      return alt
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return '?'
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden',
          'bg-gradient-to-br from-blue-500 to-purple-600',
          'text-white font-semibold',
          sizes[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-lg'
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials()}</span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusSizes[size],
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}

export default Avatar

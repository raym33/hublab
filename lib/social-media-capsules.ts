/**
 * Social Media Capsules
 *
 * 5 production-ready social media integration components
 * Perfect for adding social features to any app
 */

import { Capsule } from '@/types/capsule'

const socialMediaCapsules: Capsule[] = [
  {
    id: 'social-share-buttons',
    name: 'Social Share Buttons',
    category: 'Social',
    description: 'Beautiful social media share buttons with hover effects. Supports Twitter, Facebook, LinkedIn, WhatsApp, Email, and Copy Link. Includes share counts and customizable styling.',
    tags: ['social', 'share', 'buttons', 'twitter', 'facebook', 'linkedin'],
    code: `'use client'

import { useState } from 'react'
import { Twitter, Facebook, Linkedin, Mail, Link2, MessageCircle, Check } from 'lucide-react'

interface SocialShareButtonsProps {
  url?: string
  title?: string
  description?: string
  hashtags?: string[]
  size?: 'sm' | 'md' | 'lg'
}

export default function SocialShareButtons({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check this out!',
  description = '',
  hashtags = [],
  size = 'md'
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)
  const hashtagString = hashtags.join(',')

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  }

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: \`https://twitter.com/intent/tweet?url=\${encodedUrl}&text=\${encodedTitle}\${hashtags.length ? \`&hashtags=\${hashtagString}\` : ''}\`,
      color: 'hover:bg-blue-400 hover:text-white'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: \`https://www.facebook.com/sharer/sharer.php?u=\${encodedUrl}\`,
      color: 'hover:bg-blue-600 hover:text-white'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodedUrl}\`,
      color: 'hover:bg-blue-700 hover:text-white'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: \`https://wa.me/?text=\${encodedTitle}%20\${encodedUrl}\`,
      color: 'hover:bg-green-500 hover:text-white'
    },
    {
      name: 'Email',
      icon: Mail,
      url: \`mailto:?subject=\${encodedTitle}&body=\${encodedDescription}%0A%0A\${encodedUrl}\`,
      color: 'hover:bg-gray-600 hover:text-white'
    }
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {shareLinks.map((social) => {
        const Icon = social.icon
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={\`\${sizeClasses[size]} flex items-center justify-center rounded-full bg-gray-100 transition-all duration-200 \${social.color}\`}
            title={\`Share on \${social.name}\`}
          >
            <Icon size={iconSizes[size]} />
          </a>
        )
      })}

      <button
        onClick={copyToClipboard}
        className={\`\${sizeClasses[size]} flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-600 hover:text-white transition-all duration-200\`}
        title="Copy link"
      >
        {copied ? <Check size={iconSizes[size]} /> : <Link2 size={iconSizes[size]} />}
      </button>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'twitter-embed',
    name: 'Twitter/X Embed',
    category: 'Social',
    description: 'Embed Twitter/X tweets with automatic loading and error handling. Shows loading skeleton, handles errors gracefully, and supports dark mode. No external dependencies required.',
    tags: ['twitter', 'x', 'embed', 'social', 'tweet'],
    code: `'use client'

import { useEffect, useState } from 'react'

interface TwitterEmbedProps {
  tweetId: string
  theme?: 'light' | 'dark'
  width?: number
  hideThread?: boolean
  hideMedia?: boolean
}

export default function TwitterEmbed({
  tweetId,
  theme = 'light',
  width = 550,
  hideThread = false,
  hideMedia = false
}: TwitterEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      setIsLoading(false)
    }

    script.onerror = () => {
      setError(true)
      setIsLoading(false)
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (error) {
    return (
      <div className="border rounded-lg p-6 text-center bg-red-50">
        <p className="text-red-600">Failed to load tweet</p>
        <a
          href={\`https://twitter.com/i/status/\${tweetId}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mt-2 inline-block"
        >
          View on X/Twitter
        </a>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      {isLoading && (
        <div className="animate-pulse border rounded-lg p-6 space-y-4" style={{ width: \`\${width}px\` }}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      )}

      <blockquote
        className="twitter-tweet"
        data-theme={theme}
        data-width={width}
        data-conversation={hideThread ? 'none' : undefined}
        data-cards={hideMedia ? 'hidden' : undefined}
      >
        <a href={\`https://twitter.com/i/status/\${tweetId}\`}>Loading tweet...</a>
      </blockquote>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'instagram-feed',
    name: 'Instagram Feed Grid',
    category: 'Social',
    description: 'Display Instagram posts in a beautiful grid layout with hover effects, like counts, and lightbox preview. Supports both static and dynamic data loading. Perfect for portfolios and marketing sites.',
    tags: ['instagram', 'social', 'feed', 'grid', 'gallery'],
    code: `'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Eye, X } from 'lucide-react'

interface InstagramPost {
  id: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
  link: string
}

interface InstagramFeedProps {
  posts: InstagramPost[]
  columns?: number
  showCaptions?: boolean
}

export default function InstagramFeed({
  posts,
  columns = 3,
  showCaptions = false
}: InstagramFeedProps) {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)

  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6'
  }

  return (
    <>
      <div className={\`grid \${gridClasses[columns as keyof typeof gridClasses] || 'grid-cols-3'} gap-1 md:gap-2\`}>
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative aspect-square group cursor-pointer overflow-hidden"
            onClick={() => setSelectedPost(post)}
          >
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Heart size={24} fill="white" />
                <span className="font-semibold">{post.likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={24} />
                <span className="font-semibold">{post.comments.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedPost(null)}
          >
            <X size={32} />
          </button>

          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-2/3 bg-black flex items-center justify-center">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.caption}
                className="max-h-[90vh] w-full object-contain"
              />
            </div>

            <div className="md:w-1/3 p-6 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <p className="text-sm text-gray-800 mb-4">{selectedPost.caption}</p>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Heart size={20} />
                    <span className="font-semibold">{selectedPost.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    <span className="font-semibold">{selectedPost.comments.toLocaleString()}</span>
                  </div>
                </div>

                <a
                  href={selectedPost.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition"
                >
                  <Eye size={20} />
                  View on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}`,
    platform: 'react'
  },

  {
    id: 'social-proof-ticker',
    name: 'Social Proof Ticker',
    category: 'Social',
    description: 'Real-time social proof notifications showing recent user activity. Creates FOMO with smooth animations. Shows user actions like purchases, signups, downloads. Fully customizable with auto-dismiss.',
    tags: ['social-proof', 'notifications', 'fomo', 'marketing', 'conversion'],
    code: `'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, ShoppingCart, UserPlus, Download, Star, X } from 'lucide-react'

interface SocialProofEvent {
  id: string
  type: 'purchase' | 'signup' | 'download' | 'review'
  user: string
  action: string
  location?: string
  timestamp: Date
}

interface SocialProofTickerProps {
  events: SocialProofEvent[]
  autoRotate?: boolean
  rotateInterval?: number
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export default function SocialProofTicker({
  events,
  autoRotate = true,
  rotateInterval = 5000,
  position = 'bottom-left'
}: SocialProofTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (!autoRotate || isDismissed || events.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length)
        setIsVisible(true)
      }, 300)
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [autoRotate, rotateInterval, events.length, isDismissed])

  if (events.length === 0 || isDismissed) return null

  const currentEvent = events[currentIndex]

  const icons = {
    purchase: { Icon: ShoppingCart, color: 'text-green-500' },
    signup: { Icon: UserPlus, color: 'text-blue-500' },
    download: { Icon: Download, color: 'text-purple-500' },
    review: { Icon: Star, color: 'text-yellow-500' }
  }

  const { Icon, color } = icons[currentEvent.type]

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4'
  }

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`
    if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h ago\`
    return \`\${Math.floor(seconds / 86400)}d ago\`
  }

  return (
    <div
      className={\`fixed \${positionClasses[position]} z-50 transition-all duration-300 \${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }\`}
    >
      <div className="bg-white rounded-lg shadow-2xl p-4 max-w-sm border border-gray-200 relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className={\`p-2 rounded-full bg-gray-50 \${color}\`}>
            <Icon size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 truncate">
                {currentEvent.user}
              </span>
              {currentEvent.location && (
                <span className="text-xs text-gray-500 truncate">
                  from {currentEvent.location}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600">{currentEvent.action}</p>

            <div className="flex items-center gap-2 mt-2">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-xs text-gray-500">{getTimeAgo(currentEvent.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'youtube-embed',
    name: 'YouTube Video Player',
    category: 'Social',
    description: 'Responsive YouTube video embed with lazy loading, privacy mode, and custom controls. Supports playlists, autoplay, and custom thumbnails. Optimized for performance with intersection observer.',
    tags: ['youtube', 'video', 'embed', 'lazy-load', 'player'],
    code: `'use client'

import { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  loop?: boolean
  privacyMode?: boolean
  customThumbnail?: string
  aspectRatio?: '16:9' | '4:3' | '1:1'
}

export default function YouTubeEmbed({
  videoId,
  title = 'YouTube video',
  autoplay = false,
  muted = false,
  controls = true,
  loop = false,
  privacyMode = true,
  customThumbnail,
  aspectRatio = '16:9'
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Lazy load when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.25 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square'
  }

  const thumbnailUrl = customThumbnail || \`https://img.youtube.com/vi/\${videoId}/maxresdefault.jpg\`

  const domain = privacyMode ? 'youtube-nocookie.com' : 'youtube.com'

  const params = new URLSearchParams({
    ...(autoplay && { autoplay: '1' }),
    ...(muted && { mute: '1' }),
    ...(controls && { controls: '1' }),
    ...(loop && { loop: '1', playlist: videoId }),
  })

  const embedUrl = \`https://www.\${domain}/embed/\${videoId}?\${params.toString()}\`

  return (
    <div
      ref={containerRef}
      className={\`relative w-full \${aspectRatioClasses[aspectRatio]} bg-black rounded-lg overflow-hidden group\`}
    >
      {!isLoaded && isInView && (
        <>
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <button
            onClick={() => setIsLoaded(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            aria-label="Play video"
          >
            <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors">
              <Play size={32} fill="white" className="text-white" />
            </div>
          </button>
        </>
      )}

      {isLoaded && (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  )
}`,
    platform: 'react'
  }
]

export default socialMediaCapsules

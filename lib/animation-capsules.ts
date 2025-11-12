/**
 * Animation Capsules
 *
 * 5 production-ready animation components
 * Beautiful micro-interactions and transitions
 */

import { Capsule } from '@/types/capsule'

const animationCapsules: Capsule[] = [
  {
    id: 'scroll-reveal',
    name: 'Scroll Reveal Animation',
    category: 'Animation',
    description: 'Reveal elements with smooth animations as they enter the viewport. Supports multiple animation types: fade, slide, zoom, flip. Uses Intersection Observer for performance. Perfect for landing pages and marketing sites.',
    tags: ['animation', 'scroll', 'reveal', 'intersection-observer', 'fade'],
    code: `'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom' | 'flip'
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export default function ScrollReveal({
  children,
  animation = 'fade',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, once])

  const animations = {
    fade: {
      initial: 'opacity-0',
      animate: 'opacity-100'
    },
    'slide-up': {
      initial: 'opacity-0 translate-y-8',
      animate: 'opacity-100 translate-y-0'
    },
    'slide-left': {
      initial: 'opacity-0 translate-x-8',
      animate: 'opacity-100 translate-x-0'
    },
    'slide-right': {
      initial: 'opacity-0 -translate-x-8',
      animate: 'opacity-100 translate-x-0'
    },
    zoom: {
      initial: 'opacity-0 scale-50',
      animate: 'opacity-100 scale-100'
    },
    flip: {
      initial: 'opacity-0 rotate-x-90',
      animate: 'opacity-100 rotate-x-0'
    }
  }

  const animationClasses = animations[animation]

  return (
    <div
      ref={ref}
      className={\`transform transition-all \${isVisible ? animationClasses.animate : animationClasses.initial}\`}
      style={{
        transitionDuration: \`\${duration}ms\`,
        transitionDelay: \`\${delay}ms\`
      }}
    >
      {children}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'floating-action-button',
    name: 'Floating Action Button',
    category: 'Animation',
    description: 'Material Design floating action button with expandable menu. Smooth animations, customizable positions, and sub-actions. Includes tooltip hints and keyboard navigation support.',
    tags: ['fab', 'floating', 'button', 'menu', 'material-design'],
    code: `'use client'

import { useState } from 'react'
import { Plus, X, MessageCircle, Mail, Phone, Share2 } from 'lucide-react'

interface FabAction {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  onClick: () => void
  color?: string
}

interface FloatingActionButtonProps {
  mainIcon?: React.ComponentType<{ size?: number; className?: string }>
  actions?: FabAction[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export default function FloatingActionButton({
  mainIcon: MainIcon = Plus,
  actions = [
    { icon: MessageCircle, label: 'Chat', onClick: () => console.log('Chat'), color: 'bg-blue-500' },
    { icon: Mail, label: 'Email', onClick: () => console.log('Email'), color: 'bg-purple-500' },
    { icon: Phone, label: 'Call', onClick: () => console.log('Call'), color: 'bg-green-500' },
    { icon: Share2, label: 'Share', onClick: () => console.log('Share'), color: 'bg-pink-500' }
  ],
  position = 'bottom-right',
  size = 'md',
  color = 'bg-blue-600'
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28
  }

  const isBottom = position.includes('bottom')
  const isRight = position.includes('right')

  return (
    <div className={\`fixed \${positionClasses[position]} z-50\`}>
      {/* Sub-actions */}
      <div className={\`absolute \${isBottom ? 'bottom-full mb-4' : 'top-full mt-4'} \${isRight ? 'right-0' : 'left-0'} flex flex-col gap-3\`}>
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <div
              key={index}
              className={\`transform transition-all duration-300 \${
                isOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }\`}
              style={{ transitionDelay: \`\${index * 50}ms\` }}
            >
              <div className="flex items-center gap-3">
                {!isRight && (
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg">
                    {action.label}
                  </span>
                )}

                <button
                  onClick={() => {
                    action.onClick()
                    setIsOpen(false)
                  }}
                  className={\`\${action.color || 'bg-gray-600'} hover:scale-110 text-white \${sizeClasses[size]} rounded-full shadow-lg transition-transform flex items-center justify-center\`}
                >
                  <Icon size={iconSizes[size] - 4} />
                </button>

                {isRight && (
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg">
                    {action.label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={\`\${color} hover:scale-110 text-white \${sizeClasses[size]} rounded-full shadow-2xl transition-transform flex items-center justify-center\`}
      >
        <div className={\`transform transition-transform duration-300 \${isOpen ? 'rotate-45' : 'rotate-0'}\`}>
          {isOpen ? <X size={iconSizes[size]} /> : <MainIcon size={iconSizes[size]} />}
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'particle-background',
    name: 'Particle Background',
    category: 'Animation',
    description: 'Animated particle background with customizable colors, density, and movement patterns. Canvas-based for smooth 60fps performance. Perfect for hero sections and modern landing pages.',
    tags: ['particles', 'background', 'canvas', 'animation', 'hero'],
    code: `'use client'

import { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
  particleCount?: number
  particleColor?: string
  lineColor?: string
  particleSize?: number
  speed?: number
  maxDistance?: number
  className?: string
}

export default function ParticleBackground({
  particleCount = 80,
  particleColor = 'rgba(59, 130, 246, 0.5)',
  lineColor = 'rgba(59, 130, 246, 0.2)',
  particleSize = 2,
  speed = 0.5,
  maxDistance = 150,
  className = ''
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    window.addEventListener('resize', resize)

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.vx = (Math.random() - 0.5) * speed
        this.vy = (Math.random() - 0.5) * speed
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = particleColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, particleColor, lineColor, particleSize, speed, maxDistance])

  return (
    <canvas
      ref={canvasRef}
      className={\`absolute inset-0 w-full h-full \${className}\`}
    />
  )
}`,
    platform: 'react'
  },

  {
    id: 'text-morph',
    name: 'Morphing Text Animation',
    category: 'Animation',
    description: 'Smooth morphing text animation that cycles through multiple strings. Character-by-character animation with customizable speed and colors. Great for hero sections and attention-grabbing headlines.',
    tags: ['text', 'animation', 'morph', 'transition', 'typewriter'],
    code: `'use client'

import { useState, useEffect } from 'react'

interface TextMorphProps {
  texts: string[]
  interval?: number
  className?: string
  colors?: string[]
}

export default function TextMorph({
  texts,
  interval = 3000,
  className = '',
  colors = ['text-blue-600', 'text-purple-600', 'text-pink-600', 'text-green-600']
}: TextMorphProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const targetText = texts[currentIndex]
    const speed = isDeleting ? 30 : 100

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText.length < targetText.length) {
        // Typing
        setDisplayText(targetText.slice(0, displayText.length + 1))
      } else if (isDeleting && displayText.length > 0) {
        // Deleting
        setDisplayText(displayText.slice(0, -1))
      } else if (!isDeleting && displayText.length === targetText.length) {
        // Wait before deleting
        setTimeout(() => setIsDeleting(true), interval)
      } else if (isDeleting && displayText.length === 0) {
        // Move to next text
        setIsDeleting(false)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length)
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex, texts, interval])

  const currentColor = colors[currentIndex % colors.length]

  return (
    <span className={\`\${currentColor} \${className} inline-flex items-center\`}>
      {displayText}
      <span className="animate-pulse ml-1">|</span>
    </span>
  )
}`,
    platform: 'react'
  },

  {
    id: 'confetti-explosion',
    name: 'Confetti Explosion',
    category: 'Animation',
    description: 'Celebratory confetti explosion animation with physics simulation. Customizable colors, particle count, and explosion intensity. Perfect for success messages, achievements, and special moments.',
    tags: ['confetti', 'celebration', 'animation', 'particles', 'success'],
    code: `'use client'

import { useEffect, useRef } from 'react'

interface ConfettiExplosionProps {
  duration?: number
  particleCount?: number
  colors?: string[]
  force?: number
  onComplete?: () => void
}

export default function ConfettiExplosion({
  duration = 3000,
  particleCount = 100,
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  force = 0.5,
  onComplete
}: ConfettiExplosionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      rotation: number
      rotationSpeed: number
      color: string
      gravity: number

      constructor() {
        this.x = canvas!.width / 2
        this.y = canvas!.height / 2
        this.size = Math.random() * 8 + 4
        this.speedX = (Math.random() - 0.5) * 20 * force
        this.speedY = (Math.random() - 0.5) * 20 * force - 10
        this.rotation = Math.random() * 360
        this.rotationSpeed = (Math.random() - 0.5) * 10
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.gravity = 0.5
      }

      update() {
        this.speedY += this.gravity
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)

        ctx.fillStyle = this.color
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)

        ctx.restore()
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const startTime = Date.now()

    const animate = () => {
      if (!ctx) return

      const elapsed = Date.now() - startTime

      if (elapsed > duration) {
        onComplete?.()
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [duration, particleCount, colors, force, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
}`,
    platform: 'react'
  }
]

export default animationCapsules

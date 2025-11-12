/**
 * Utilities Capsules V2 - Animations, Effects, and Useful Components
 * Browser-based utilities and visual effects
 */

import { CapsuleDefinition } from './types'

export const UTILITIES_CAPSULES: CapsuleDefinition[] = [
  // ============================================
  // ANIMATIONS & EFFECTS
  // ============================================

  {
    id: 'confetti',
    name: 'Confetti Effect',
    description: 'Animated confetti celebration effect',
    category: 'feature',
    props: [
      { name: 'duration', type: 'number', required: false, description: 'Duration in milliseconds' },
      { name: 'particleCount', type: 'number', required: false, description: 'Number of particles' }
    ],
    code: `function Confetti({ duration = 3000, particleCount = 100 }) {
  const canvasRef = React.useRef(null)
  const [active, setActive] = React.useState(false)

  const createConfetti = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const particles = []

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4
      })
    }

    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      if (elapsed > duration) {
        setActive(false)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation * Math.PI / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2)
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  React.useEffect(() => {
    if (active) {
      const canvas = canvasRef.current
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createConfetti()
    }
  }, [active])

  return (
    <div className="relative">
      <button
        onClick={() => setActive(true)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition"
      >
        🎉 Celebrate!
      </button>

      {active && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
        />
      )}
    </div>
  )
}`
  },

  {
    id: 'particle-background',
    name: 'Particle Background',
    description: 'Animated particle network background',
    category: 'feature',
    props: [
      { name: 'particleCount', type: 'number', required: false, description: 'Number of particles' },
      { name: 'color', type: 'string', required: false, description: 'Particle color' }
    ],
    code: `function ParticleBackground({ particleCount = 50, color = '#3B82F6' }) {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.strokeStyle = color + Math.floor((1 - dist / 100) * 255).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [particleCount, color])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-96 bg-gray-900 rounded-lg"
    />
  )
}`
  },

  {
    id: 'typing-effect',
    name: 'Typing Effect',
    description: 'Typewriter animation for text',
    category: 'ui',
    props: [
      { name: 'text', type: 'string', required: true, description: 'Text to type' },
      { name: 'speed', type: 'number', required: false, description: 'Typing speed (ms per char)' },
      { name: 'showCursor', type: 'boolean', required: false, description: 'Show blinking cursor' }
    ],
    code: `function TypingEffect({ text, speed = 100, showCursor = true }) {
  const [displayText, setDisplayText] = React.useState('')
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    setDisplayText('')
    setIsComplete(false)
    let index = 0

    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <div className="font-mono text-xl">
      {displayText}
      {showCursor && !isComplete && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  )
}`
  },

  {
    id: 'scroll-progress',
    name: 'Scroll Progress Bar',
    description: 'Progress bar showing scroll position',
    category: 'ui',
    props: [
      { name: 'color', type: 'string', required: false, description: 'Progress bar color' }
    ],
    code: `function ScrollProgress({ color = '#3B82F6' }) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const percentage = (scrolled / totalHeight) * 100
      setProgress(percentage)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full transition-all duration-150"
        style={{
          width: \`\${progress}%\`,
          backgroundColor: color
        }}
      />
    </div>
  )
}`
  },

  {
    id: 'lazy-image',
    name: 'Lazy Loading Image',
    description: 'Image with lazy loading and blur placeholder',
    category: 'ui',
    props: [
      { name: 'src', type: 'string', required: true, description: 'Image URL' },
      { name: 'alt', type: 'string', required: false, description: 'Alt text' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder color' }
    ],
    code: `function LazyImage({ src, alt = '', placeholder = '#E5E7EB' }) {
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState(false)
  const imgRef = React.useRef(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.src = src
            img.onload = () => setLoaded(true)
            img.onerror = () => setError(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [src])

  return (
    <div
      ref={imgRef}
      className="relative overflow-hidden bg-gray-200 rounded-lg"
      style={{ backgroundColor: placeholder }}
    >
      {error ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          ⚠️ Failed to load image
        </div>
      ) : (
        <>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={\`w-full h-auto transition-opacity duration-500 \${
              loaded ? 'opacity-100' : 'opacity-0'
            }\`}
          />
        </>
      )}
    </div>
  )
}`
  },

  // ============================================
  // UTILITY COMPONENTS
  // ============================================

  {
    id: 'clipboard-copy',
    name: 'Copy to Clipboard',
    description: 'Button to copy text to clipboard',
    category: 'ui',
    props: [
      { name: 'text', type: 'string', required: true, description: 'Text to copy' },
      { name: 'label', type: 'string', required: false, description: 'Button label' }
    ],
    code: `function ClipboardCopy({ text, label = 'Copy' }) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 bg-gray-100 px-3 py-2 rounded border border-gray-300 font-mono text-sm overflow-x-auto">
        {text}
      </code>
      <button
        onClick={copyToClipboard}
        className={\`
          px-4 py-2 rounded font-semibold transition whitespace-nowrap
          \${copied
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
        \`}
      >
        {copied ? '✓ Copied!' : label}
      </button>
    </div>
  )
}`
  },

  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Countdown timer to a target date',
    category: 'feature',
    props: [
      { name: 'targetDate', type: 'string', required: true, description: 'Target date (ISO format)' },
      { name: 'onComplete', type: 'function', required: false, description: 'Callback when complete' }
    ],
    code: `function CountdownTimer({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const diff = target - now

      if (diff <= 0) {
        setIsComplete(true)
        clearInterval(interval)
        onComplete?.()
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (isComplete) {
    return (
      <div className="text-center p-8 bg-green-50 border-2 border-green-500 rounded-lg">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-green-700">Time's Up!</h2>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4 max-w-2xl">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center">
          <div className="text-5xl font-bold mb-2">{value}</div>
          <div className="text-sm uppercase tracking-wide opacity-90">{unit}</div>
        </div>
      ))}
    </div>
  )
}`
  },

  {
    id: 'infinite-scroll',
    name: 'Infinite Scroll',
    description: 'Load more items on scroll',
    category: 'feature',
    props: [
      { name: 'items', type: 'array', required: true, description: 'Initial items' },
      { name: 'loadMore', type: 'function', required: true, description: 'Function to load more items' },
      { name: 'hasMore', type: 'boolean', required: true, description: 'Whether more items exist' }
    ],
    code: `function InfiniteScroll({ items, loadMore, hasMore }) {
  const [loading, setLoading] = React.useState(false)
  const loaderRef = React.useRef(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true)
          loadMore().finally(() => setLoading(false))
        }
      },
      { rootMargin: '100px' }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading])

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg">{item.title || \`Item \${index + 1}\`}</h3>
          {item.description && (
            <p className="text-gray-600 mt-2">{item.description}</p>
          )}
        </div>
      ))}

      <div ref={loaderRef} className="text-center py-4">
        {loading && (
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        )}
        {!hasMore && items.length > 0 && (
          <p className="text-gray-500">No more items to load</p>
        )}
      </div>
    </div>
  )
}`
  },

  {
    id: 'share-button',
    name: 'Share Button',
    description: 'Share content via Web Share API',
    category: 'ui',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Share title' },
      { name: 'text', type: 'string', required: false, description: 'Share text' },
      { name: 'url', type: 'string', required: false, description: 'Share URL' }
    ],
    code: `function ShareButton({ title, text, url }) {
  const [canShare, setCanShare] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    setCanShare(!!navigator.share)
  }, [])

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = \`\${title}\\n\${text || ''}\\n\${url || ''}\`
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
    >
      {copied ? (
        <>✓ Copied to clipboard!</>
      ) : (
        <>
          <span className="text-xl">📤</span>
          Share
        </>
      )}
    </button>
  )
}`
  },

  {
    id: 'print-button',
    name: 'Print Button',
    description: 'Print specific content',
    category: 'ui',
    props: [
      { name: 'children', type: 'node', required: true, description: 'Content to print' },
      { name: 'buttonText', type: 'string', required: false, description: 'Button label' }
    ],
    code: `function PrintButton({ children, buttonText = 'Print' }) {
  const printRef = React.useRef(null)

  const handlePrint = () => {
    const printContent = printRef.current
    const originalContent = document.body.innerHTML

    document.body.innerHTML = printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  return (
    <div>
      <button
        onClick={handlePrint}
        className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold mb-4"
      >
        🖨️ {buttonText}
      </button>

      <div ref={printRef}>
        {children}
      </div>
    </div>
  )
}`
  },

  {
    id: 'fullscreen-toggle',
    name: 'Fullscreen Toggle',
    description: 'Toggle fullscreen mode for an element',
    category: 'ui',
    props: [
      { name: 'children', type: 'node', required: true, description: 'Content to make fullscreen' }
    ],
    code: `function FullscreenToggle({ children }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const containerRef = React.useRef(null)

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } catch (err) {
        console.error('Fullscreen failed:', err)
      }
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {children}

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-lg font-semibold"
      >
        {isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
      </button>
    </div>
  )
}`
  },

  {
    id: 'theme-toggle',
    name: 'Theme Toggle',
    description: 'Toggle between light and dark themes',
    category: 'ui',
    code: `function ThemeToggle() {
  const [theme, setTheme] = React.useState('light')

  React.useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={\`
        p-3 rounded-lg font-semibold transition
        \${theme === 'light'
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-900'
          : 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
        }
      \`}
    >
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  )
}`
  }
]

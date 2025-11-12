import { CapsuleDefinition } from './types'

/**
 * Animation Capsules
 * Animation and transition effects for engaging UIs
 */

export const ANIMATION_CAPSULES: CapsuleDefinition[] = [
  // Fade In
  {
    id: 'fade-in',
    name: 'Fade In',
    description: 'Fade in animation on mount or scroll',
    category: 'animation',
    props: [
      { name: 'duration', type: 'number', required: false, default: 1000, description: 'Animation duration in ms' },
      { name: 'delay', type: 'number', required: false, default: 0, description: 'Animation delay in ms' },
      { name: 'children', type: 'node', required: true, description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function FadeIn({ duration = 1000, delay = 0, children }) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: \`opacity \${duration}ms ease-in-out\`
      }}
    >
      {children}
    </div>
  )
}`
  },

  // Slide In
  {
    id: 'slide-in',
    name: 'Slide In',
    description: 'Slide in animation from direction',
    category: 'animation',
    props: [
      { name: 'direction', type: 'string', required: false, default: 'left', description: 'Slide direction: left, right, top, bottom' },
      { name: 'duration', type: 'number', required: false, default: 500, description: 'Animation duration in ms' },
      { name: 'distance', type: 'number', required: false, default: 50, description: 'Slide distance in pixels' },
      { name: 'children', type: 'node', required: true, description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function SlideIn({ direction = 'left', duration = 500, distance = 50, children }) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left': return \`translateX(-\${distance}px)\`
        case 'right': return \`translateX(\${distance}px)\`
        case 'top': return \`translateY(-\${distance}px)\`
        case 'bottom': return \`translateY(\${distance}px)\`
        default: return 'translateX(0)'
      }
    }
    return 'translate(0, 0)'
  }

  return (
    <div
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transition: \`all \${duration}ms ease-out\`
      }}
    >
      {children}
    </div>
  )
}`
  },

  // Bounce
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Bouncing animation effect',
    category: 'animation',
    props: [
      { name: 'continuous', type: 'boolean', required: false, default: false, description: 'Continuous bounce' },
      { name: 'children', type: 'node', required: true, description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function Bounce({ continuous = false, children }) {
  return (
    <div
      className={\`\${continuous ? 'animate-bounce' : ''}\`}
      style={!continuous ? {
        animation: 'bounce 1s ease-in-out'
      } : {}}
    >
      {children}
      <style jsx>{\`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      \`}</style>
    </div>
  )
}`
  },

  // Rotate
  {
    id: 'rotate',
    name: 'Rotate',
    description: 'Rotation animation',
    category: 'animation',
    props: [
      { name: 'degrees', type: 'number', required: false, default: 360, description: 'Rotation degrees' },
      { name: 'duration', type: 'number', required: false, default: 1000, description: 'Animation duration in ms' },
      { name: 'continuous', type: 'boolean', required: false, default: false, description: 'Continuous rotation' },
      { name: 'children', type: 'node', required: true, description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function Rotate({ degrees = 360, duration = 1000, continuous = false, children }) {
  return (
    <div
      style={{
        animation: continuous ? \`rotate \${duration}ms linear infinite\` : \`rotate \${duration}ms ease-in-out\`
      }}
    >
      {children}
      <style jsx>{\`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(\${degrees}deg); }
        }
      \`}</style>
    </div>
  )
}`
  },

  // Pulse
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Pulsing scale animation',
    category: 'animation',
    props: [
      { name: 'scale', type: 'number', required: false, default: 1.05, description: 'Max scale multiplier' },
      { name: 'duration', type: 'number', required: false, default: 1000, description: 'Animation duration in ms' },
      { name: 'children', type: 'node', required: true, description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function Pulse({ scale = 1.05, duration = 1000, children }) {
  return (
    <div
      style={{
        animation: \`pulse \${duration}ms ease-in-out infinite\`
      }}
    >
      {children}
      <style jsx>{\`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(\${scale}); }
        }
      \`}</style>
    </div>
  )
}`
  },

  // Parallax
  {
    id: 'parallax',
    name: 'Parallax',
    description: 'Parallax scroll effect',
    category: 'animation',
    props: [
      { name: 'speed', type: 'number', required: false, default: 0.5, description: 'Parallax speed (0-1)' },
      { name: 'children', type: 'node', required: true, description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function Parallax({ speed = 0.5, children }) {
  const [offset, setOffset] = React.useState(0)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.scrollY
        setOffset(scrolled * speed)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      style={{
        transform: \`translateY(\${offset}px)\`,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  )
}`
  },

  // Scale On Hover
  {
    id: 'scale-on-hover',
    name: 'Scale On Hover',
    description: 'Scale animation on hover',
    category: 'animation',
    props: [
      { name: 'scale', type: 'number', required: false, default: 1.1, description: 'Scale multiplier' },
      { name: 'duration', type: 'number', required: false, default: 200, description: 'Transition duration in ms' },
      { name: 'children', type: 'node', required: true, description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function ScaleOnHover({ scale = 1.1, duration = 200, children }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? \`scale(\${scale})\` : 'scale(1)',
        transition: \`transform \${duration}ms ease-in-out\`,
        cursor: 'pointer'
      }}
    >
      {children}
    </div>
  )
}`
  },

  // Shake
  {
    id: 'shake',
    name: 'Shake',
    description: 'Shaking animation (useful for errors)',
    category: 'animation',
    props: [
      { name: 'trigger', type: 'boolean', required: false, default: false, description: 'Trigger shake animation' },
      { name: 'children', type: 'node', required: true, description: 'Content to animate' }
    ],
    dependencies: [],
    code: `
function Shake({ trigger = false, children }) {
  const [isShaking, setIsShaking] = React.useState(false)

  React.useEffect(() => {
    if (trigger) {
      setIsShaking(true)
      const timer = setTimeout(() => setIsShaking(false), 500)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  return (
    <div
      className={isShaking ? 'animate-shake' : ''}
    >
      {children}
      <style jsx>{\`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      \`}</style>
    </div>
  )
}`
  },

  // Flip Card
  {
    id: 'flip-card',
    name: 'Flip Card',
    description: '3D flip card effect on click or hover',
    category: 'animation',
    props: [
      { name: 'front', type: 'node', required: true, description: 'Front content' },
      { name: 'back', type: 'node', required: true, description: 'Back content' },
      { name: 'triggerOn', type: 'string', required: false, default: 'click', description: 'Trigger: click or hover' }
    ],
    dependencies: [],
    code: `
function FlipCard({ front, back, triggerOn = 'click' }) {
  const [isFlipped, setIsFlipped] = React.useState(false)

  const handleInteraction = () => {
    if (triggerOn === 'click') {
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div
      className="flip-card-container"
      onClick={handleInteraction}
      onMouseEnter={() => triggerOn === 'hover' && setIsFlipped(true)}
      onMouseLeave={() => triggerOn === 'hover' && setIsFlipped(false)}
    >
      <div className={\`flip-card \${isFlipped ? 'flipped' : ''}\`}>
        <div className="flip-card-front">
          {front}
        </div>
        <div className="flip-card-back">
          {back}
        </div>
      </div>

      <style jsx>{\`
        .flip-card-container {
          perspective: 1000px;
          cursor: pointer;
        }
        .flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      \`}</style>
    </div>
  )
}`
  },

  // Typewriter
  {
    id: 'typewriter',
    name: 'Typewriter',
    description: 'Typewriter text animation',
    category: 'animation',
    props: [
      { name: 'text', type: 'string', required: true, default: 'Hello, World!', description: 'Text to type' },
      { name: 'speed', type: 'number', required: false, default: 100, description: 'Typing speed in ms' },
      { name: 'cursor', type: 'boolean', required: false, default: true, description: 'Show blinking cursor' }
    ],
    dependencies: [],
    code: `
function Typewriter({ text = 'Hello, World!', speed = 100, cursor = true }) {
  const [displayText, setDisplayText] = React.useState('')
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed])

  return (
    <span className="typewriter">
      {displayText}
      {cursor && <span className="cursor">|</span>}
      <style jsx>{\`
        .cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      \`}</style>
    </span>
  )
}`
  }
]

'use client'

import React from 'react'

// Live Capsule Previews - Real working components

export function LiveLineChart() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const data = [
    { x: 1, y: 30 }, { x: 2, y: 45 }, { x: 3, y: 38 },
    { x: 4, y: 52 }, { x: 5, y: 48 }, { x: 6, y: 65 }, { x: 7, y: 58 }
  ]

  React.useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padding = 40
    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const xValues = data.map(d => d.x)
    const yValues = data.map(d => d.y)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)
    const xRange = maxX - minX || 1
    const yRange = maxY - minY || 1

    const scaleX = (x: number) => ((x - minX) / xRange) * (width - 2 * padding) + padding
    const scaleY = (y: number) => height - padding - ((y - minY) / yRange) * (height - 2 * padding)

    // Grid
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - 2 * padding)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Line
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 3
    ctx.beginPath()
    data.forEach((point, i) => {
      const x = scaleX(point.x)
      const y = scaleY(point.y)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Points
    ctx.fillStyle = '#3B82F6'
    data.forEach(point => {
      const x = scaleX(point.x)
      const y = scaleY(point.y)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [])

  return <canvas ref={canvasRef} width={500} height={300} className="w-full bg-white rounded border-2 border-gray-200" />
}

export function LiveCountdown() {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0, hours: 5, minutes: 23, seconds: 45
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white text-center">
          <div className="text-3xl font-bold">{value.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase mt-1">{unit}</div>
        </div>
      ))}
    </div>
  )
}

export function LiveTypingEffect() {
  const [text, setText] = React.useState('')
  const fullText = 'This is a live typing effect! ✨'

  React.useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="font-mono text-lg p-4 bg-gray-900 text-green-400 rounded">
      {text}<span className="animate-pulse">|</span>
    </div>
  )
}

export function LivePasswordStrength() {
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const calculateStrength = () => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return strength
  }

  const strength = calculateStrength()
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-3 py-2 pr-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      {password && (
        <>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition ${
                  i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className={`text-sm font-semibold ${strength > 0 ? strengthColors[strength - 1].replace('bg-', 'text-') : 'text-gray-500'}`}>
            {strengthLabels[strength - 1] || 'Very Weak'}
          </p>
        </>
      )}
    </div>
  )
}

export function LiveTagsInput() {
  const [tags, setTags] = React.useState<string[]>(['React', 'TypeScript'])
  const [input, setInput] = React.useState('')

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed])
      setInput('')
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div className="border-2 border-gray-300 rounded-lg p-2 focus-within:border-blue-500">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="hover:bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addTag(input)
          } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags.length - 1)
          }
        }}
        placeholder={tags.length < 10 ? 'Add tags...' : 'Max 10 tags'}
        className="w-full px-2 py-1 focus:outline-none"
      />
    </div>
  )
}

export function LiveProgressRing() {
  const [progress, setProgress] = React.useState(0)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 120
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10
    const lineWidth = 8

    ctx.clearRect(0, 0, size, size)

    // Background circle
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Progress arc
    const progressAngle = (progress / 100) * Math.PI * 2
    ctx.strokeStyle = '#10B981'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + progressAngle)
    ctx.stroke()

    // Center text
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(progress)}%`, centerX, centerY)
  }, [progress])

  return <canvas ref={canvasRef} width={120} height={120} />
}

export function LiveThemeToggle() {
  const [theme, setTheme] = React.useState('light')

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`p-3 rounded-lg font-semibold transition ${
        theme === 'light'
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-900'
          : 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
      }`}
    >
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  )
}

export function LiveCopyToClipboard() {
  const [copied, setCopied] = React.useState(false)
  const text = 'npm install @hublab/capsules'

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
      <code className="flex-1 bg-gray-100 px-3 py-2 rounded border border-gray-300 font-mono text-sm">
        {text}
      </code>
      <button
        onClick={copyToClipboard}
        className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap ${
          copied ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
    </div>
  )
}

export function LiveAutocomplete() {
  const suggestions = ['React', 'React Native', 'Redux', 'Remix', 'Next.js', 'Nuxt.js', 'Vue.js', 'Angular', 'Svelte']
  const [value, setValue] = React.useState('')
  const [filtered, setFiltered] = React.useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setValue(input)

    if (input.trim()) {
      const matches = suggestions.filter(s =>
        s.toLowerCase().includes(input.toLowerCase())
      )
      setFiltered(matches)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search frameworks..."
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
      />

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                setValue(suggestion)
                setShowSuggestions(false)
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function LiveOTPInput() {
  const [otp, setOtp] = React.useState(['', '', '', '', '', ''])
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      ))}
    </div>
  )
}

// CHART CAPSULES
export function LiveBarChart() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const data = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 65 },
    { label: 'May', value: 58 }
  ]

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padding = 40
    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    const maxValue = Math.max(...data.map(d => d.value))
    const barWidth = (width - 2 * padding) / data.length
    const barSpacing = barWidth * 0.2

    data.forEach((item, i) => {
      const barHeight = ((item.value / maxValue) * (height - 2 * padding))
      const x = padding + i * barWidth + barSpacing / 2
      const y = height - padding - barHeight

      ctx.fillStyle = '#3B82F6'
      ctx.fillRect(x, y, barWidth - barSpacing, barHeight)

      ctx.fillStyle = '#374151'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(item.label, x + (barWidth - barSpacing) / 2, height - padding + 20)
      ctx.fillText(item.value.toString(), x + (barWidth - barSpacing) / 2, y - 5)
    })
  }, [])

  return <canvas ref={canvasRef} width={500} height={300} className="w-full bg-white rounded border-2 border-gray-200" />
}

export function LivePieChart() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const data = [
    { label: 'Product A', value: 35, color: '#3B82F6' },
    { label: 'Product B', value: 25, color: '#10B981' },
    { label: 'Product C', value: 20, color: '#F59E0B' },
    { label: 'Product D', value: 20, color: '#EF4444' }
  ]

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -Math.PI / 2

    data.forEach(item => {
      const sliceAngle = (item.value / total) * Math.PI * 2

      ctx.fillStyle = item.color
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      currentAngle += sliceAngle
    })

    // Legend
    let legendY = 20
    data.forEach(item => {
      ctx.fillStyle = item.color
      ctx.fillRect(canvas.width - 120, legendY, 15, 15)
      ctx.fillStyle = '#374151'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`${item.label} (${item.value}%)`, canvas.width - 100, legendY + 12)
      legendY += 25
    })
  }, [])

  return <canvas ref={canvasRef} width={400} height={300} className="w-full bg-white rounded border-2 border-gray-200" />
}

export function LiveAreaChart() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const data = [
    { x: 1, y: 20 }, { x: 2, y: 35 }, { x: 3, y: 28 },
    { x: 4, y: 45 }, { x: 5, y: 38 }, { x: 6, y: 52 }
  ]

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padding = 40
    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    const maxY = Math.max(...data.map(d => d.y))
    const scaleX = (x: number) => ((x - 1) / (data.length - 1)) * (width - 2 * padding) + padding
    const scaleY = (y: number) => height - padding - (y / maxY) * (height - 2 * padding)

    // Fill area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
    ctx.beginPath()
    ctx.moveTo(scaleX(1), height - padding)
    data.forEach(point => ctx.lineTo(scaleX(point.x), scaleY(point.y)))
    ctx.lineTo(scaleX(data.length), height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw line
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 3
    ctx.beginPath()
    data.forEach((point, i) => {
      const x = scaleX(point.x)
      const y = scaleY(point.y)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }, [])

  return <canvas ref={canvasRef} width={500} height={300} className="w-full bg-white rounded border-2 border-gray-200" />
}

// FORM CAPSULES
export function LiveColorPicker() {
  const [color, setColor] = React.useState('#3B82F6')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
        />
        <div className="flex-1">
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono"
          />
        </div>
      </div>
      <div
        className="h-24 rounded-lg border-2 border-gray-300"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

export function LiveRangeSlider() {
  const [value, setValue] = React.useState(50)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Value:</span>
        <span className="text-2xl font-bold text-blue-600">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${value}%, #E5E7EB ${value}%, #E5E7EB 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}

export function LiveToggleSwitch() {
  const [enabled, setEnabled] = React.useState(false)

  return (
    <div className="flex items-center justify-center gap-4">
      <span className="text-sm font-semibold">{enabled ? 'ON' : 'OFF'}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-14 h-8 rounded-full transition ${
          enabled ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export function LiveRating() {
  const [rating, setRating] = React.useState(3)
  const [hover, setHover] = React.useState(0)

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-4xl transition"
          >
            {star <= (hover || rating) ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      <p className="text-center text-sm text-gray-600">
        {rating} out of 5 stars
      </p>
    </div>
  )
}

// MEDIA CAPSULES
export function LiveImageFilter() {
  const [filter, setFilter] = React.useState({ brightness: 100, contrast: 100, saturate: 100 })
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw a sample gradient as placeholder
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#FF6B6B')
    gradient.addColorStop(0.5, '#4ECDC4')
    gradient.addColorStop(1, '#45B7D1')

    ctx.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturate}%)`
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [filter])

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={400} height={300} className="w-full rounded border-2 border-gray-200" />
      <div className="space-y-2">
        <div>
          <label className="text-xs">Brightness: {filter.brightness}%</label>
          <input
            type="range"
            min="0"
            max="200"
            value={filter.brightness}
            onChange={(e) => setFilter({...filter, brightness: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs">Contrast: {filter.contrast}%</label>
          <input
            type="range"
            min="0"
            max="200"
            value={filter.contrast}
            onChange={(e) => setFilter({...filter, contrast: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs">Saturation: {filter.saturate}%</label>
          <input
            type="range"
            min="0"
            max="200"
            value={filter.saturate}
            onChange={(e) => setFilter({...filter, saturate: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

export function LiveAudioVisualizer() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = React.useState(false)

  React.useEffect(() => {
    if (!playing) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#1F2937'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const bars = 50
      const barWidth = canvas.width / bars

      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * canvas.height * 0.8
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight)
        gradient.addColorStop(0, '#3B82F6')
        gradient.addColorStop(1, '#10B981')

        ctx.fillStyle = gradient
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationId)
  }, [playing])

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} width={600} height={200} className="w-full rounded border-2 border-gray-200" />
      <button
        onClick={() => setPlaying(!playing)}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white ${
          playing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  )
}

// EFFECT CAPSULES
export function LiveLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
}

export function LivePulseEffect() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
        <div className="absolute inset-0 w-16 h-16 bg-blue-500 rounded-full animate-ping opacity-75"></div>
      </div>
    </div>
  )
}

export function LiveSkeletonLoader() {
  return (
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
      <div className="flex gap-4 mt-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  )
}

export function LiveToast() {
  const [show, setShow] = React.useState(false)

  const showToast = () => {
    setShow(true)
    setTimeout(() => setShow(false), 3000)
  }

  return (
    <div className="relative">
      <button
        onClick={showToast}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Show Toast
      </button>
      {show && (
        <div className="mt-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <span className="text-2xl">✓</span>
          <span className="font-semibold">Success! Action completed.</span>
        </div>
      )}
    </div>
  )
}

export function LiveModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Open Modal
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4">Modal Title</h3>
            <p className="text-gray-600 mb-6">
              This is a modal dialog. Click outside or the button below to close.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function LiveAccordion() {
  const [open, setOpen] = React.useState<number | null>(0)

  const items = [
    { title: 'Section 1', content: 'Content for section 1. This can contain any information.' },
    { title: 'Section 2', content: 'Content for section 2. Click to expand and collapse.' },
    { title: 'Section 3', content: 'Content for section 3. Only one section open at a time.' }
  ]

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === index ? null : index)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left font-semibold flex items-center justify-between"
          >
            {item.title}
            <span className="text-xl">{open === index ? '−' : '+'}</span>
          </button>
          {open === index && (
            <div className="px-4 py-3 bg-white">
              <p className="text-gray-600">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function LiveTabs() {
  const [active, setActive] = React.useState(0)

  const tabs = [
    { label: 'Tab 1', content: 'Content for tab 1. This is the first tab panel.' },
    { label: 'Tab 2', content: 'Content for tab 2. Switch between tabs easily.' },
    { label: 'Tab 3', content: 'Content for tab 3. Last tab with different content.' }
  ]

  return (
    <div>
      <div className="flex border-b-2 border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`px-6 py-3 font-semibold transition ${
              active === index
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6 bg-white rounded-b-lg border-2 border-t-0 border-gray-200">
        <p className="text-gray-600">{tabs[active].content}</p>
      </div>
    </div>
  )
}

// AI/ML CAPSULES
export function LiveAIChat() {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', text: 'Hello! How can I help you today?' }
  ])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', text: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Let me help you with that.",
        "I understand. Here's what I think about that...",
        "Great point! Based on my knowledge, I would say...",
        "Let me break that down for you in simple terms.",
        "That's a common question. The answer is..."
      ]
      const aiMessage = {
        role: 'assistant',
        text: responses[Math.floor(Math.random() * responses.length)]
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg h-96 p-4 bg-gray-50 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-xs ${
                msg.role === 'assistant'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 ml-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export function LiveTextToSpeech() {
  const [text, setText] = React.useState('Hello! This is a text to speech demo.')
  const [speaking, setSpeaking] = React.useState(false)

  const speak = () => {
    if ('speechSynthesis' in window) {
      setSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Text-to-speech not supported in your browser')
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak..."
        className="w-full h-32 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
      />
      <div className="flex gap-2">
        <button
          onClick={speak}
          disabled={speaking}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white ${
            speaking ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {speaking ? '🔊 Speaking...' : '🔊 Speak'}
        </button>
        {speaking && (
          <button
            onClick={stop}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ⏹ Stop
          </button>
        )}
      </div>
    </div>
  )
}

export function LiveSpeechToText() {
  const [text, setText] = React.useState('')
  const [listening, setListening] = React.useState(false)

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => setListening(true)
      recognition.onend = () => setListening(false)

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setText(transcript)
      }

      recognition.start()

      setTimeout(() => {
        recognition.stop()
      }, 10000) // Stop after 10 seconds
    } else {
      setText('Speech recognition not supported. Using simulated text...')
      setListening(true)
      setTimeout(() => {
        setText('This is a simulated speech-to-text transcription.')
        setListening(false)
      }, 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg h-32 p-4 bg-gray-50">
        {listening ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-gray-500 italic">Listening...</p>
          </div>
        ) : (
          <p className="text-gray-700">{text || 'Transcription will appear here...'}</p>
        )}
      </div>
      <button
        onClick={startListening}
        disabled={listening}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white ${
          listening ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {listening ? '🎤 Listening...' : '🎤 Start Listening'}
      </button>
    </div>
  )
}

export function LiveQRCodeGenerator() {
  const [text, setText] = React.useState('https://hublab.dev')
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple QR-like pattern (not a real QR code, just visual representation)
    const size = 200
    const moduleSize = 10
    const modules = size / moduleSize

    ctx.clearRect(0, 0, size, size)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)

    // Generate pseudo-random pattern based on text
    ctx.fillStyle = '#000000'
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) {
        const hash = (text.charCodeAt(x % text.length) + x * y) % 2
        if (hash === 0) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // Add corner squares (finder patterns)
    const drawFinderPattern = (x: number, y: number) => {
      ctx.fillStyle = '#000000'
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5)
      ctx.fillStyle = '#000000'
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3)
    }

    drawFinderPattern(0, 0)
    drawFinderPattern(size - moduleSize * 7, 0)
    drawFinderPattern(0, size - moduleSize * 7)
  }, [text])

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text or URL..."
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
      />
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={200} height={200} className="border-4 border-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

// ADVANCED MEDIA CAPSULES
export function LiveVideoRecorder() {
  const [recording, setRecording] = React.useState(false)
  const [hasVideo, setHasVideo] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setRecording(true)
        setHasVideo(true)
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      alert('Camera access is required for this demo')
    }
  }

  const stopRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setRecording(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
        {hasVideo ? (
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
        ) : (
          <p className="text-white">Click Start to access camera</p>
        )}
      </div>
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white ${
          recording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {recording ? '⏹ Stop Recording' : '● Start Recording'}
      </button>
    </div>
  )
}

export function LivePhotoCapture() {
  const [photo, setPhoto] = React.useState<string | null>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = React.useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStreaming(true)
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      alert('Camera access is required for this demo')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        setPhoto(canvas.toDataURL('image/png'))
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setStreaming(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
        {photo ? (
          <img src={photo} alt="Captured" className="w-full h-full object-cover" />
        ) : streaming ? (
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
        ) : (
          <p className="text-white">Click Start Camera</p>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2">
        {!streaming ? (
          <button
            onClick={startCamera}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            📷 Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={capturePhoto}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              📸 Capture
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Stop
            </button>
          </>
        )}
        {photo && (
          <button
            onClick={() => setPhoto(null)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

// UI Capsules
export function LiveButton() {
  const [count, setCount] = useState(0)
  return (
    <div className="p-8 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Button Component</h3>
      <div className="flex gap-4 flex-wrap">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
          Primary Button
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold">
          Secondary Button
        </button>
        <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold">
          Outlined Button
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  )
}

export function LiveInput() {
  const [value, setValue] = useState('')
  return (
    <div className="p-8 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Input Component</h3>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Enter text..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {value && <p className="text-sm text-gray-600">You typed: {value}</p>}
      </div>
    </div>
  )
}

export function LiveList() {
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">List Component</h3>
      <ul className="space-y-2 max-w-md">
        {items.map((item, i) => (
          <li key={i} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LiveDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState('Select an option')

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Dropdown Menu</h3>
      <div className="relative max-w-xs">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg flex justify-between items-center"
        >
          <span>{selected}</span>
          <span>▼</span>
        </button>
        {isOpen && (
          <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelected(option)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function LiveTooltip() {
  const [show, setShow] = useState(false)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Tooltip Component</h3>
      <div className="flex gap-4">
        <div className="relative inline-block">
          <button
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Hover me
          </button>
          {show && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap">
              This is a tooltip!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function LiveBadge() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Badge Component</h3>
      <div className="flex gap-3 flex-wrap">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          Primary
        </span>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          Success
        </span>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
          Warning
        </span>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
          Error
        </span>
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
          Default
        </span>
      </div>
    </div>
  )
}

export function LiveAvatar() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Avatar Component</h3>
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          JD
        </div>
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
          AB
        </div>
        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          XY
        </div>
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          ME
        </div>
      </div>
    </div>
  )
}

export function LiveProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Progress Bar</h3>
      <div className="space-y-4 max-w-md">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600">{progress}%</p>
      </div>
    </div>
  )
}

export function LiveSpinner() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Spinner Component</h3>
      <div className="flex gap-8 items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
}

export function LiveAlert() {
  return (
    <div className="p-8 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Alert Component</h3>
      <div className="space-y-3 max-w-md">
        <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded">
          <strong>Info:</strong> This is an informational alert
        </div>
        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded">
          <strong>Success:</strong> Operation completed successfully
        </div>
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
          <strong>Warning:</strong> Please review your input
        </div>
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded">
          <strong>Error:</strong> Something went wrong
        </div>
      </div>
    </div>
  )
}

export function LiveBreadcrumb() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Breadcrumb Component</h3>
      <nav className="flex items-center space-x-2 text-sm">
        <a href="#" className="text-blue-600 hover:underline">Home</a>
        <span className="text-gray-400">/</span>
        <a href="#" className="text-blue-600 hover:underline">Products</a>
        <span className="text-gray-400">/</span>
        <a href="#" className="text-blue-600 hover:underline">Category</a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">Current Page</span>
      </nav>
    </div>
  )
}

export function LivePagination() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Pagination Component</h3>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-lg ${
              currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'border hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
    </div>
  )
}

export function LiveCheckbox() {
  const [checked, setChecked] = useState([false, true, false])

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Checkbox Component</h3>
      <div className="space-y-3">
        {['Option 1', 'Option 2', 'Option 3'].map((label, i) => (
          <label key={i} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => {
                const newChecked = [...checked]
                newChecked[i] = !newChecked[i]
                setChecked(newChecked)
              }}
              className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function LiveRadioGroup() {
  const [selected, setSelected] = useState('option2')

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Radio Group Component</h3>
      <div className="space-y-3">
        {['option1', 'option2', 'option3'].map((value) => (
          <label key={value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="radio-group"
              value={value}
              checked={selected === value}
              onChange={(e) => setSelected(e.target.value)}
              className="w-5 h-5 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="capitalize">{value.replace('option', 'Option ')}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-600">Selected: {selected}</p>
    </div>
  )
}

export function LiveSwitch() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Switch Component</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setEnabled(!enabled)}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            enabled ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              enabled ? 'transform translate-x-6' : ''
            }`}
          />
        </button>
        <span className="text-sm text-gray-600">{enabled ? 'On' : 'Off'}</span>
      </div>
    </div>
  )
}

export function LiveSlider() {
  const [value, setValue] = useState(50)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Slider Component</h3>
      <div className="max-w-md space-y-4">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center">
          <span className="text-2xl font-bold text-blue-600">{value}</span>
          <span className="text-gray-600 ml-1">/ 100</span>
        </div>
      </div>
    </div>
  )
}

export function LiveSelect() {
  const [selected, setSelected] = useState('apple')

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Select Component</h3>
      <div className="max-w-xs">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
          <option value="date">Date</option>
          <option value="elderberry">Elderberry</option>
        </select>
        <p className="mt-3 text-sm text-gray-600">Selected: {selected}</p>
      </div>
    </div>
  )
}

export function LiveSimpleChart() {
  const data = [65, 78, 45, 90, 55, 82, 70]

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Simple Chart</h3>
      <div className="flex items-end gap-2 h-48 max-w-md">
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
              style={{ height: `${value}%` }}
            />
            <span className="text-xs text-gray-600">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LiveStatCard() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Stat Card</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">12,543</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Revenue</p>
          <p className="text-3xl font-bold text-gray-900">$45,231</p>
          <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Active Sessions</p>
          <p className="text-3xl font-bold text-gray-900">892</p>
          <p className="text-sm text-red-600 mt-2">↓ 3% from last month</p>
        </div>
      </div>
    </div>
  )
}

export function LiveDataTable() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' },
  ]

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Data Table</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{row.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    row.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Effect Capsules
export function LiveFadeIn() {
  const [show, setShow] = useState(true)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Fade In Effect</h3>
      <button
        onClick={() => setShow(!show)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Toggle
      </button>
      {show && (
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg animate-fade-in">
          <p className="text-lg font-semibold">This element fades in smoothly</p>
        </div>
      )}
    </div>
  )
}

export function LiveSlideIn() {
  const [show, setShow] = useState(true)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Slide In Effect</h3>
      <button
        onClick={() => setShow(!show)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Toggle
      </button>
      <div className="relative h-24">
        {show && (
          <div className="absolute inset-0 p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg transition-transform duration-500 transform translate-x-0">
            <p className="text-lg font-semibold">Slides in from the left</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function LiveBounce() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Bounce Effect</h3>
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full animate-bounce" />
      </div>
    </div>
  )
}

export function LiveRotate() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Rotate Effect</h3>
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg animate-spin" />
      </div>
    </div>
  )
}

// Layout Capsules
export function LiveCard() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Card Component</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-lg font-semibold mb-2">Card Title</h4>
          <p className="text-gray-600 text-sm mb-4">
            This is a card component with hover effect
          </p>
          <button className="text-blue-600 text-sm font-semibold hover:underline">
            Learn more →
          </button>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-lg text-white shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-lg font-semibold mb-2">Gradient Card</h4>
          <p className="text-white/90 text-sm mb-4">
            Card with gradient background
          </p>
          <button className="text-white text-sm font-semibold hover:underline">
            Learn more →
          </button>
        </div>
      </div>
    </div>
  )
}

export function LiveKPIGrid() {
  const kpis = [
    { label: 'Revenue', value: '$124,352', change: '+12.5%', positive: true },
    { label: 'Users', value: '45,234', change: '+8.3%', positive: true },
    { label: 'Orders', value: '1,234', change: '-2.1%', positive: false },
    { label: 'Conversion', value: '3.45%', change: '+0.8%', positive: true },
  ]

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">KPI Grid</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
            <p className={`text-xs font-semibold ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LiveGridLayout() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Grid Layout</h3>
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-blue-100 p-6 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">{i}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LiveFlexContainer() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Flex Container</h3>
      <div className="flex gap-4 flex-wrap max-w-2xl">
        <div className="flex-1 min-w-[150px] bg-purple-100 p-6 rounded-lg text-center">
          <p className="font-semibold text-purple-700">Item 1</p>
        </div>
        <div className="flex-1 min-w-[150px] bg-purple-100 p-6 rounded-lg text-center">
          <p className="font-semibold text-purple-700">Item 2</p>
        </div>
        <div className="flex-1 min-w-[150px] bg-purple-100 p-6 rounded-lg text-center">
          <p className="font-semibold text-purple-700">Item 3</p>
        </div>
      </div>
    </div>
  )
}

export function LiveSplitPanel() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Split Panel</h3>
      <div className="flex gap-4 h-64 max-w-3xl">
        <div className="flex-1 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Left Panel</h4>
          <p className="text-sm text-blue-700">Content in the left section</p>
        </div>
        <div className="flex-1 bg-green-50 p-6 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">Right Panel</h4>
          <p className="text-sm text-green-700">Content in the right section</p>
        </div>
      </div>
    </div>
  )
}

export function LiveContainer() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Container Component</h3>
      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
        <p className="text-gray-700">
          This is a centered container with max-width constraint. Perfect for responsive layouts.
        </p>
      </div>
    </div>
  )
}

export function LiveStack() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Stack Component</h3>
      <div className="space-y-3 max-w-md">
        <div className="bg-blue-100 p-4 rounded-lg">Stack Item 1</div>
        <div className="bg-green-100 p-4 rounded-lg">Stack Item 2</div>
        <div className="bg-purple-100 p-4 rounded-lg">Stack Item 3</div>
        <div className="bg-pink-100 p-4 rounded-lg">Stack Item 4</div>
      </div>
    </div>
  )
}

export function LiveSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Sidebar Component</h3>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Toggle Sidebar
      </button>
      <div className="flex gap-4 h-64 max-w-3xl border border-gray-200 rounded-lg overflow-hidden">
        {isOpen && (
          <div className="w-64 bg-gray-900 text-white p-4">
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li className="p-2 bg-gray-800 rounded">Dashboard</li>
              <li className="p-2 hover:bg-gray-800 rounded">Settings</li>
              <li className="p-2 hover:bg-gray-800 rounded">Profile</li>
            </ul>
          </div>
        )}
        <div className="flex-1 bg-white p-4">
          <p className="text-gray-600">Main content area</p>
        </div>
      </div>
    </div>
  )
}

export function LiveBottomNavigation() {
  const [active, setActive] = useState('home')

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Bottom Navigation</h3>
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-4">
        <div className="h-32 bg-gray-50 rounded mb-4 flex items-center justify-center">
          <p className="text-gray-600">Content Area</p>
        </div>
        <div className="flex justify-around border-t pt-4">
          {['home', 'search', 'profile'].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`flex flex-col items-center gap-1 ${
                active === item ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-current opacity-20" />
              <span className="text-xs capitalize">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function LiveDashboardLayout() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Dashboard Layout</h3>
      <div className="max-w-4xl bg-gray-100 rounded-lg p-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg mb-4">
          <h4 className="font-semibold">Dashboard Header</h4>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Metric 1</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Metric 2</p>
            <p className="text-2xl font-bold">5,678</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Metric 3</p>
            <p className="text-2xl font-bold">9,012</p>
          </div>
        </div>
        {/* Content Area */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg h-32">Chart Area</div>
          <div className="bg-white p-4 rounded-lg h-32">Table Area</div>
        </div>
      </div>
    </div>
  )
}

// Feature Capsules
export function LiveForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Form submitted!\nName: ${formData.name}\nEmail: ${formData.email}`)
  }

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Form Component</h3>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export function LiveCounter() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Counter Component</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl font-bold text-blue-600">{count}</div>
        <div className="flex gap-3">
          <button
            onClick={() => setCount(count - 1)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
          >
            - Decrease
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
          >
            + Increase
          </button>
        </div>
      </div>
    </div>
  )
}

export function LiveTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`
  }

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Timer Component</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl font-bold text-blue-600 font-mono">{formatTime(seconds)}</div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 ${
              isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            } text-white rounded-lg font-semibold`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => {
              setSeconds(0)
              setIsRunning(false)
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export function LiveImageGallery() {
  const images = [
    'https://via.placeholder.com/300x200/3B82F6/ffffff?text=Image+1',
    'https://via.placeholder.com/300x200/8B5CF6/ffffff?text=Image+2',
    'https://via.placeholder.com/300x200/EC4899/ffffff?text=Image+3',
    'https://via.placeholder.com/300x200/10B981/ffffff?text=Image+4',
  ]

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Image Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
        {images.map((src, i) => (
          <div key={i} className="aspect-[3/2] rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
            <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function LiveAvatarGroup() {
  const avatars = ['JD', 'AS', 'MK', 'TB', 'LW']

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Avatar Group</h3>
      <div className="flex -space-x-4">
        {avatars.map((initials, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold border-2 border-white shadow-md"
            style={{ zIndex: avatars.length - i }}
          >
            {initials}
          </div>
        ))}
        <div
          className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold border-2 border-white shadow-md text-sm"
          style={{ zIndex: 0 }}
        >
          +3
        </div>
      </div>
    </div>
  )
}

export function LiveVideoPlayer() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Video Player</h3>
      <div className="max-w-2xl">
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <div className="text-white text-sm">0:00</div>
              <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-white" />
              </div>
              <div className="text-white text-sm">3:45</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LiveIcon() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Icon Component</h3>
      <div className="flex gap-6 items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function LiveFileUpload() {
  const [files, setFiles] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map((f) => f.name)
      setFiles(fileNames)
    }
  }

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">File Upload</h3>
      <div className="max-w-md">
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer transition-colors">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
            <input type="file" className="hidden" multiple onChange={handleFileChange} />
          </div>
        </label>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 flex-1">{file}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function LiveSteps() {
  const [currentStep, setCurrentStep] = useState(1)
  const steps = ['Account', 'Profile', 'Preferences', 'Review']

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Steps Component</h3>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    i + 1 <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-sm mt-2 text-gray-600">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    i + 1 < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            disabled={currentStep === steps.length}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export function LiveEmptyState() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Empty State</h3>
      <div className="max-w-md mx-auto text-center p-12 bg-gray-50 rounded-lg">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">No items found</h4>
        <p className="text-sm text-gray-600 mb-4">Get started by creating your first item</p>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Create New
        </button>
      </div>
    </div>
  )
}

export function LiveErrorMessage() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Error Message</h3>
      <div className="max-w-md space-y-3">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h5 className="text-sm font-semibold text-red-800">Error</h5>
              <p className="text-sm text-red-700 mt-1">Something went wrong. Please try again.</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h5 className="text-sm font-semibold text-yellow-800">Warning</h5>
              <p className="text-sm text-yellow-700 mt-1">Please review your information carefully.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Notification Capsules
export function LiveToastNotification() {
  const [toasts, setToasts] = useState<string[]>([])

  const addToast = () => {
    const id = `toast-${Date.now()}`
    setToasts([...toasts, id])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== id))
    }, 3000)
  }

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Toast Notification</h3>
      <button
        onClick={addToast}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
      >
        Show Toast
      </button>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((id) => (
          <div
            key={id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] animate-slide-in-right"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900">Success!</h5>
                <p className="text-sm text-gray-600">Your action was completed successfully.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LiveNotificationBadge() {
  const [count, setCount] = useState(3)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Notification Badge</h3>
      <div className="flex gap-4">
        <div className="relative inline-block">
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {count}
            </span>
          )}
        </div>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add
        </button>
        <button
          onClick={() => setCount(Math.max(0, count - 1))}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export function LiveNotificationCenter() {
  const notifications = [
    { id: 1, title: 'New message', message: 'You have a new message from John', time: '5m ago', unread: true },
    { id: 2, title: 'System update', message: 'System will be updated tonight', time: '1h ago', unread: true },
    { id: 3, title: 'Task completed', message: 'Your report has been generated', time: '2h ago', unread: false },
  ]

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Notification Center</h3>
      <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Notifications</h4>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
              Mark all as read
            </span>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                notif.unread ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {notif.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />}
                <div className="flex-1">
                  <h5 className="font-semibold text-sm text-gray-900">{notif.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <span className="text-xs text-gray-400 mt-2 inline-block">{notif.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// More Feature Capsules
export function LiveKanbanBoard() {
  const columns = [
    { name: 'To Do', items: ['Task 1', 'Task 2'] },
    { name: 'In Progress', items: ['Task 3'] },
    { name: 'Done', items: ['Task 4', 'Task 5'] },
  ]

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Kanban Board</h3>
      <div className="flex gap-4 max-w-4xl overflow-x-auto">
        {columns.map((column, i) => (
          <div key={i} className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
              {column.name}
              <span className="text-sm font-normal text-gray-500">{column.items.length}</span>
            </h4>
            <div className="space-y-3">
              {column.items.map((item, j) => (
                <div key={j} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move">
                  <p className="text-sm text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LiveMultiStepForm() {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Multi-Step Form</h3>
      <div className="max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  s <= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[200px]">
          {step === 1 && (
            <div>
              <h4 className="font-semibold text-lg mb-4">Personal Information</h4>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg" />
                <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h4 className="font-semibold text-lg mb-4">Address</h4>
              <div className="space-y-4">
                <input type="text" placeholder="Street Address" className="w-full px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="City" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h4 className="font-semibold text-lg mb-4">Review & Submit</h4>
              <p className="text-gray-600">Please review your information before submitting.</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setStep(Math.min(totalSteps, step + 1))}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {step === totalSteps ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function LiveChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you?', sender: 'bot' },
    { id: 2, text: 'I need some information', sender: 'user' },
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }])
      setInput('')
    }
  }

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Chat Interface</h3>
      <div className="max-w-2xl bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LiveRichTextEditor() {
  const [content, setContent] = useState('')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Rich Text Editor</h3>
      <div className="max-w-2xl bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setBold(!bold)}
            className={`p-2 rounded hover:bg-gray-200 ${bold ? 'bg-gray-200' : ''}`}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => setItalic(!italic)}
            className={`p-2 rounded hover:bg-gray-200 ${italic ? 'bg-gray-200' : ''}`}
          >
            <em>I</em>
          </button>
          <div className="border-l border-gray-300 mx-2" />
          <button className="p-2 rounded hover:bg-gray-200">H1</button>
          <button className="p-2 rounded hover:bg-gray-200">H2</button>
          <div className="border-l border-gray-300 mx-2" />
          <button className="p-2 rounded hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>
        {/* Editor */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing..."
          className="w-full p-4 min-h-[300px] resize-none focus:outline-none"
          style={{
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
          }}
        />
      </div>
    </div>
  )
}

export function LiveFileDropzone() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFiles = Array.from(e.dataTransfer.files).map((f) => f.name)
    setFiles([...files, ...droppedFiles])
  }

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">File Dropzone</h3>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`max-w-2xl border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Drag and drop files here
        </p>
        <p className="text-sm text-gray-500">or click to browse</p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 max-w-2xl">
          <h4 className="font-semibold mb-2">Uploaded files:</h4>
          <ul className="space-y-2">
            {files.map((file, i) => (
              <li key={i} className="p-3 bg-white border border-gray-200 rounded-lg">
                {file}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function LiveFormWizard() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 4

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Form Wizard</h3>
      <div className="max-w-3xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {['Basic', 'Details', 'Preferences', 'Review'].map((label, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                  i + 1 <= currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 min-h-[250px] mb-6">
          <h4 className="text-xl font-bold mb-4">Page {currentPage} of {totalPages}</h4>
          <p className="text-gray-600">Form content for page {currentPage} goes here...</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="text-sm text-gray-600 self-center">
            Step {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {currentPage === totalPages ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function LiveInfiniteScroll() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))
  const [loading, setLoading] = useState(false)

  const loadMore = () => {
    setLoading(true)
    setTimeout(() => {
      const newItems = Array.from({ length: 10 }, (_, i) => `Item ${items.length + i + 1}`)
      setItems([...items, ...newItems])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Infinite Scroll</h3>
      <div className="max-w-md h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg">
        <div className="p-4 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              {item}
            </div>
          ))}
          {loading && (
            <div className="p-4 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}
          {!loading && (
            <button
              onClick={loadMore}
              className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function LiveMetricCard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">Total Revenue</div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">$45,231</div>
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">Active Users</div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">2,543</div>
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-green-600 font-medium">+8.3%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">Conversion Rate</div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">3.2%</div>
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-red-600 font-medium">-2.1%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LiveTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project documentation', done: false },
    { id: 2, text: 'Review pull requests', done: true },
    { id: 3, text: 'Update dependencies', done: false }
  ])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }])
      setInput('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? {...t, done: !t.done} : t))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Tasks</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5 text-blue-600"
            />
            <span className={`flex-1 ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {todos.filter(t => !t.done).length} tasks remaining
      </div>
    </div>
  )
}

export function LiveCarousel() {
  const items = ['Beautiful Sunset', 'Mountain Vista', 'Ocean Waves', 'Forest Trail']
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [items.length])

  const next = () => setCurrent((current + 1) % items.length)
  const prev = () => setCurrent((current - 1 + items.length) % items.length)

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden max-w-2xl mx-auto">
      <div className="aspect-video bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{items[current]}</div>
          <div className="text-gray-600">Slide {current + 1} of {items.length}</div>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 font-bold"
      >
        ←
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 font-bold"
      >
        →
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'bg-white w-8' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

export function LiveSparkline() {
  const data = [12, 19, 15, 23, 21, 27, 30, 28, 35, 32, 38, 42, 45, 48, 52]
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 200
    const height = 60
    ctx.clearRect(0, 0, width, height)

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const stepX = width / (data.length - 1)
    const scaleY = (val: number) => height - ((val - min) / range) * height

    // Draw line
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((value, i) => {
      const x = i * stepX
      const y = scaleY(value)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Fill area
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#3B82F644')
    gradient.addColorStop(1, '#3B82F600')
    ctx.fillStyle = gradient
    ctx.fill()
  }, [data])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-2 text-sm font-medium text-gray-600">Trend</div>
      <canvas ref={canvasRef} width={200} height={60} className="mx-auto" />
      <div className="mt-2 text-xs text-gray-500">Last 15 data points</div>
    </div>
  )
}

export function LiveHeatmap() {
  const data = [
    [5, 10, 15, 20, 25],
    [8, 12, 18, 22, 28],
    [10, 15, 20, 25, 30],
    [12, 18, 24, 28, 32]
  ]
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rows = data.length
    const cols = data[0].length
    const cellWidth = 40
    const cellHeight = 40

    const width = cols * cellWidth
    const height = rows * cellHeight

    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)

    // Find min/max
    let min = Infinity
    let max = -Infinity
    data.forEach(row => {
      row.forEach(val => {
        if (val < min) min = val
        if (val > max) max = val
      })
    })

    const range = max - min || 1
    const colors = ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8']

    // Draw cells
    data.forEach((row, i) => {
      row.forEach((value, j) => {
        const x = j * cellWidth
        const y = i * cellHeight

        // Color based on value
        const normalized = (value - min) / range
        const colorIndex = Math.floor(normalized * (colors.length - 1))
        ctx.fillStyle = colors[colorIndex]
        ctx.fillRect(x, y, cellWidth, cellHeight)

        // Draw border
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, cellWidth, cellHeight)

        // Draw value
        ctx.fillStyle = normalized > 0.5 ? '#fff' : '#1F2937'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(value.toString(), x + cellWidth / 2, y + cellHeight / 2)
      })
    })
  }, [data])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-4">Data Heatmap</h3>
      <canvas ref={canvasRef} className="mx-auto" />
    </div>
  )
}

export function LiveConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)

  const createConfetti = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: any[] = []
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']
    const particleCount = 100

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
    const duration = 3000

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

  const handleClick = () => {
    setActive(true)
    createConfetti()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="absolute inset-0 pointer-events-none"
        />
        <div className="flex flex-col items-center justify-center h-64">
          <button
            onClick={handleClick}
            disabled={active}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold text-lg disabled:opacity-50"
          >
            {active ? 'Celebrating! 🎉' : 'Click to Celebrate! 🎊'}
          </button>
          <p className="mt-4 text-sm text-gray-600">Click the button to trigger confetti</p>
        </div>
      </div>
    </div>
  )
}

export function LiveShareButton() {
  const [canShare, setCanShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCanShare(!!navigator.share)
  }, [])

  const handleShare = async () => {
    const title = 'HubLab - AI Capsules Platform'
    const text = 'Check out this amazing platform for building React apps!'
    const url = 'https://hublab.dev'

    if (canShare) {
      try {
        await navigator.share({ title, text, url })
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${title}\n${text}\n${url}`
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-4">Share This Page</h3>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {copied ? 'Copied to Clipboard!' : (canShare ? 'Share' : 'Copy Link')}
      </button>
      <p className="mt-3 text-gray-600">
        {canShare ? 'Uses Web Share API for native sharing' : 'Web Share API not available - will copy to clipboard'}
      </p>
    </div>
  )
}

export function LiveSearchWithHighlight() {
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi']
  const [search, setSearch] = useState('')

  const filtered = items.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  )

  const highlightText = (text: string) => {
    if (!search) return text

    const parts = text.split(new RegExp(`(${search})`, 'gi'))
    return parts.map((part, idx) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={idx} className="bg-yellow-300 text-gray-900 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search items..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              {highlightText(item)}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No results found for "{search}"
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        {filtered.length} of {items.length} items
      </div>
    </div>
  )
}

export function LiveCodeEditor() {
  const [code, setCode] = useState('function hello() {\n  console.log("Hello World!");\n  return true;\n}')
  const lineCount = code.split('\n').length

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-sm text-gray-600 ml-2">code.js</span>
      </div>

      <div className="flex bg-gray-900 rounded-lg overflow-hidden font-mono text-sm">
        <div className="bg-gray-800 text-gray-500 px-3 py-3 select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="text-right">{i + 1}</div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-gray-900 text-green-400 px-4 py-3 focus:outline-none resize-none"
          rows={lineCount}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export function LiveTreeView() {
  interface TreeNode {
    name: string
    children?: TreeNode[]
  }

  const data: TreeNode = {
    name: 'Root',
    children: [
      {
        name: 'Documents',
        children: [
          { name: 'Resume.pdf' },
          { name: 'CoverLetter.docx' }
        ]
      },
      {
        name: 'Projects',
        children: [
          {
            name: 'WebApp',
            children: [
              { name: 'index.html' },
              { name: 'styles.css' },
              { name: 'app.js' }
            ]
          },
          { name: 'MobileApp' }
        ]
      },
      { name: 'README.md' }
    ]
  }

  const TreeNodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
    const [expanded, setExpanded] = useState(true)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div style={{ marginLeft: level * 20 }}>
        <div
          onClick={() => hasChildren && setExpanded(!expanded)}
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer ${hasChildren ? 'font-medium' : ''}`}
        >
          {hasChildren && (
            <span className="text-gray-400">{expanded ? '▼' : '▶'}</span>
          )}
          {hasChildren ? '📁' : '📄'}
          <span className="text-gray-900">{node.name}</span>
        </div>

        {hasChildren && expanded && (
          <div>
            {node.children!.map((child, idx) => (
              <TreeNodeComponent key={idx} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-md mx-auto">
      <TreeNodeComponent node={data} />
    </div>
  )
}

export function LiveContextMenu() {
  const options = ['Copy', 'Paste', 'Delete', 'Rename', 'Properties']
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState<string | null>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPosition({ x: e.clientX, y: e.clientY })
    setMenuVisible(true)
  }

  const handleClick = () => {
    setMenuVisible(false)
  }

  const handleOptionClick = (option: string) => {
    setSelected(option)
    setMenuVisible(false)
  }

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [menuVisible])

  return (
    <div className="max-w-md mx-auto">
      <div
        onContextMenu={handleContextMenu}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer"
      >
        <p className="text-gray-700 font-medium mb-2">Right-click here to open menu</p>
        {selected && (
          <p className="text-sm text-gray-600">Last action: <strong className="text-blue-600">{selected}</strong></p>
        )}
      </div>

      {menuVisible && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 min-w-[150px]"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function LiveTimeline() {
  const events = [
    { date: 'Jan 2024', title: 'Project Started', description: 'Initial planning and setup' },
    { date: 'Mar 2024', title: 'Alpha Release', description: 'First working prototype' },
    { date: 'Jun 2024', title: 'Beta Testing', description: 'User feedback and improvements' },
    { date: 'Sep 2024', title: 'Production Launch', description: 'Official public release' }
  ]

  return (
    <div className="relative max-w-2xl mx-auto p-6">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-8">
        {events.map((event, idx) => (
          <div key={idx} className="relative flex items-start gap-4 pl-0">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg">
              {idx + 1}
            </div>
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{event.date}</div>
              <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Drag & Drop
export function LiveDragDrop() {
  const [draggedItem, setDraggedItem] = useState<{ item: string; sourceList: 'list1' | 'list2' } | null>(null)
  const [list1, setList1] = useState(['Task 1', 'Task 2', 'Task 3'])
  const [list2, setList2] = useState(['Task 4', 'Task 5'])

  const handleDragStart = (item: string, sourceList: 'list1' | 'list2') => {
    setDraggedItem({ item, sourceList })
  }

  const handleDrop = (targetList: 'list1' | 'list2') => {
    if (!draggedItem) return

    if (draggedItem.sourceList === 'list1') {
      setList1(list1.filter(i => i !== draggedItem.item))
      if (targetList === 'list2') setList2([...list2, draggedItem.item])
      else setList1(list1)
    } else {
      setList2(list2.filter(i => i !== draggedItem.item))
      if (targetList === 'list1') setList1([...list1, draggedItem.item])
      else setList2(list2)
    }

    setDraggedItem(null)
  }

  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop('list1')}
        className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 min-h-[250px]"
      >
        <h3 className="font-bold text-gray-900 mb-3">List 1</h3>
        {list1.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(item, 'list1')}
            className="bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
          >
            {item}
          </div>
        ))}
        {list1.length === 0 && (
          <p className="text-gray-400 text-sm italic">Drop items here</p>
        )}
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop('list2')}
        className="bg-purple-50 border-2 border-dashed border-purple-300 rounded-lg p-4 min-h-[250px]"
      >
        <h3 className="font-bold text-gray-900 mb-3">List 2</h3>
        {list2.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(item, 'list2')}
            className="bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
          >
            {item}
          </div>
        ))}
        {list2.length === 0 && (
          <p className="text-gray-400 text-sm italic">Drop items here</p>
        )}
      </div>
    </div>
  )
}

// Particle Background
export function LiveParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: any[] = []
    const particleCount = 50
    const color = '#3B82F6'

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      })
    }

    let animationId: number

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
            const opacity = Math.floor((1 - dist / 100) * 255).toString(16).padStart(2, '0')
            ctx.strokeStyle = color + opacity
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-96 bg-gray-900 rounded-lg"
    />
  )
}

// Scroll Progress Bar
export function LiveScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const scrollTop = containerRef.current.scrollTop
      const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight
      const percentage = (scrollTop / scrollHeight) * 100
      setProgress(percentage)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="sticky top-0 left-0 w-full h-1 bg-gray-200 z-10 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-150 bg-blue-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div ref={containerRef} className="h-96 overflow-y-auto bg-white rounded-lg border border-gray-200 p-6 mt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scroll to see progress</h2>
        <p className="text-gray-700 mb-4">This is a long content area to demonstrate the scroll progress bar.</p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-gray-600 mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Paragraph {i + 1}.
          </p>
        ))}
      </div>

      <div className="text-center mt-2 text-sm text-gray-500">
        Progress: {Math.round(progress)}%
      </div>
    </div>
  )
}

// Lazy Loading Image
export function LiveLazyLoadingImage() {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Simulate image loading
            setTimeout(() => setLoaded(true), 1000)
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
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-gray-700 mb-4 text-center">Scroll down to trigger lazy loading</p>
      <div className="h-96 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        <p className="text-gray-500">Scroll down ↓</p>
      </div>

      <div
        ref={imgRef}
        className="relative overflow-hidden bg-gray-200 rounded-lg"
        style={{ minHeight: '300px' }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
        <div
          className={`w-full h-full transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-80 flex items-center justify-center text-white text-2xl font-bold">
            Image Loaded Successfully!
          </div>
        </div>
      </div>
    </div>
  )
}

// Print Button
export function LivePrintButton() {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print</title>')
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; padding: 20px; }</style>')
        printWindow.document.write('</head><body>')
        printWindow.document.write(printRef.current.innerHTML)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={handlePrint}
        className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold mb-4 transition-colors"
      >
        🖨️ Print Document
      </button>

      <div ref={printRef} className="bg-white border-2 border-gray-300 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sample Document</h1>
        <p className="text-gray-700 mb-4">
          This is a sample document that will be printed when you click the print button above.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Section 1</h2>
        <p className="text-gray-700 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Section 2</h2>
        <p className="text-gray-700 mb-4">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  )
}

// Fullscreen Toggle
export function LiveFullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div ref={containerRef} className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Fullscreen Demo</h2>
        <p className="text-lg mb-6">Click the button to toggle fullscreen mode</p>
        <div className="text-6xl mb-6">🖥️</div>
      </div>

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        {isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
      </button>
    </div>
  )
}

// Loading Overlay
export function LiveLoadingOverlay() {
  const [showOverlay, setShowOverlay] = useState(false)

  const handleShowOverlay = () => {
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Overlay Demo</h2>
        <p className="text-gray-600 mb-6">Click the button to see the loading overlay for 3 seconds</p>

        <button
          onClick={handleShowOverlay}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Show Loading Overlay
        </button>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded-lg p-4 h-24"></div>
          <div className="bg-gray-100 rounded-lg p-4 h-24"></div>
          <div className="bg-gray-100 rounded-lg p-4 h-24"></div>
        </div>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Date Range Picker
export function LiveDateRangePicker() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const getDaysDiff = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Date Range Picker</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {startDate && endDate && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Range</p>
                <p className="font-semibold text-gray-900">
                  {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-blue-600">{getDaysDiff()} days</p>
              </div>
            </div>
          </div>
        )}

        {(!startDate || !endDate) && (
          <div className="text-center text-gray-500 text-sm italic">
            Select both start and end dates to see the range
          </div>
        )}
      </div>
    </div>
  )
}

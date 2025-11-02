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

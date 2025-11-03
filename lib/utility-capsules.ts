/**
 * Utility Capsules
 *
 * Cápsulas de utilidad: copy to clipboard, QR codes, color pickers, etc.
 */

import { Capsule } from '@/types/capsule'

export const utilityCapsules: Capsule[] = [
  // 1. Copy to Clipboard
  {
    id: 'copy-to-clipboard',
    name: 'Copy to Clipboard',
    category: 'Utility',
    description: 'Botón para copiar texto al portapapeles con feedback visual',
    tags: ['copy', 'clipboard', 'utility', 'paste'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyToClipboardProps {
  text: string
  children?: React.ReactNode
  variant?: 'icon' | 'button' | 'inline'
  showFeedback?: boolean
  successMessage?: string
}

export default function CopyToClipboard({
  text,
  children,
  variant = 'button',
  showFeedback = true,
  successMessage = 'Copied!'
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCopy}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition relative"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        {showFeedback && copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
            {successMessage}
          </span>
        )}
      </button>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className={\`
        px-4 py-2 rounded-lg font-medium transition flex items-center gap-2
        \${copied
          ? 'bg-green-100 text-green-700 border-2 border-green-300'
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
      \`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>{children || 'Copy'}</span>
        </>
      )}
    </button>
  )
}`
  },

  // 2. QR Code Generator
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'Utility',
    description: 'Generador de códigos QR con customización de color y tamaño',
    tags: ['qr', 'qrcode', 'generator', 'scan', 'barcode'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState, useRef, useEffect } from 'react'
import { QrCode, Download } from 'lucide-react'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  fgColor?: string
  bgColor?: string
  level?: 'L' | 'M' | 'Q' | 'H'
  includeMargin?: boolean
  showDownload?: boolean
}

export default function QRCodeGenerator({
  value,
  size = 256,
  fgColor = '#000000',
  bgColor = '#ffffff',
  level = 'M',
  includeMargin = true,
  showDownload = true
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    // Simple QR Code generation (in production, use a library like 'qrcode')
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // This is a simplified version - use a real QR library in production
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = fgColor
    ctx.font = \`\${size / 8}px monospace\`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('QR', size / 2, size / 2 - 20)
    ctx.fillText(value.substring(0, 20), size / 2, size / 2 + 20)
  }, [value, size, fgColor, bgColor])

  const handleDownload = () => {
    if (!canvasRef.current) return

    const url = canvasRef.current.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = url
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        <QrCode className="w-6 h-6 text-gray-900" />
        <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
      </div>

      <div
        className="border-4 border-gray-200 rounded-lg overflow-hidden"
        style={{ padding: includeMargin ? '16px' : '0' }}
      >
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="block"
        />
      </div>

      {showDownload && (
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      )}

      <p className="text-xs text-gray-600 text-center max-w-xs break-all">
        {value}
      </p>
    </div>
  )
}

// Note: For production use, install 'qrcode' package:
// npm install qrcode @types/qrcode
// Then import: import QRCode from 'qrcode'
// And use: QRCode.toCanvas(canvas, value, options)`
  },

  // 3. Color Picker Advanced
  {
    id: 'color-picker-advanced',
    name: 'Color Picker Advanced',
    category: 'Utility',
    description: 'Selector de color avanzado con presets, gradientes y opacity',
    tags: ['color', 'picker', 'palette', 'gradient', 'rgba'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState } from 'react'
import { Palette, Copy, Check } from 'lucide-react'

interface ColorPickerAdvancedProps {
  value?: string
  onChange?: (color: string) => void
  showPresets?: boolean
  showGradient?: boolean
  showOpacity?: boolean
  presetColors?: string[]
}

export default function ColorPickerAdvanced({
  value = '#3b82f6',
  onChange,
  showPresets = true,
  showGradient = true,
  showOpacity = true,
  presetColors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
    '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'
  ]
}: ColorPickerAdvancedProps) {
  const [color, setColor] = useState(value)
  const [copied, setCopied] = useState(false)
  const [opacity, setOpacity] = useState(100)

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onChange?.(newColor)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(color)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgb = hexToRgb(color)
  const rgba = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, \${opacity / 100})\`

  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Color Picker</h3>
      </div>

      {/* Color Preview */}
      <div className="mb-6">
        <div
          className="w-full h-32 rounded-lg border-2 border-gray-300 mb-3"
          style={{ backgroundColor: rgba }}
        />

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
          />
          <div className="flex-1 px-3 py-2 bg-gray-50 rounded border border-gray-300 font-mono text-sm">
            {showOpacity && opacity < 100 ? rgba : color}
          </div>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Opacity Slider */}
      {showOpacity && (
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Opacity: {opacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Preset Colors */}
      {showPresets && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Preset Colors
          </label>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((preset) => (
              <button
                key={preset}
                onClick={() => handleColorChange(preset)}
                className={\`
                  w-full aspect-square rounded-lg border-2 transition
                  \${color === preset ? 'border-gray-900 scale-110' : 'border-gray-300 hover:scale-105'}
                \`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
        </div>
      )}

      {/* Gradient Preview */}
      {showGradient && (
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Gradient Preview
          </label>
          <div
            className="w-full h-16 rounded-lg"
            style={{
              background: \`linear-gradient(to right, \${color}, transparent)\`
            }}
          />
        </div>
      )}
    </div>
  )
}`
  },

  // 4. Countdown Timer
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    category: 'Utility',
    description: 'Temporizador de cuenta regresiva con múltiples formatos y estilos',
    tags: ['countdown', 'timer', 'clock', 'deadline', 'time'],
    version: '1.0.0',
    author: 'HubLab',

    code: `'use client'

import { useState, useEffect } from 'react'
import { Clock, Play, Pause, RotateCcw } from 'lucide-react'

interface CountdownTimerProps {
  targetDate?: Date
  onComplete?: () => void
  format?: 'full' | 'compact' | 'minimal'
  showControls?: boolean
}

export default function CountdownTimer({
  targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000),
  onComplete,
  format = 'full',
  showControls = true
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  function calculateTimeLeft() {
    const difference = targetDate.getTime() - Date.now()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }

  useEffect(() => {
    if (isPaused || isComplete) return

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (Object.values(newTimeLeft).every(v => v === 0)) {
        setIsComplete(true)
        onComplete?.()
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, isComplete])

  const handleReset = () => {
    setIsComplete(false)
    setTimeLeft(calculateTimeLeft())
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg p-4 min-w-[80px]">
        <div className="text-4xl font-bold tabular-nums">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-2 font-medium">{label}</div>
    </div>
  )

  if (format === 'minimal') {
    return (
      <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 tabular-nums">
        <Clock className="w-6 h-6" />
        {timeLeft.days > 0 && \`\${timeLeft.days}d \`}
        {\`\${String(timeLeft.hours).padStart(2, '0')}:\${String(timeLeft.minutes).padStart(2, '0')}:\${String(timeLeft.seconds).padStart(2, '0')}\`}
      </div>
    )
  }

  if (format === 'compact') {
    return (
      <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-lg border border-gray-200">
        <Clock className="w-6 h-6 text-blue-600" />
        <div className="flex gap-2 text-3xl font-bold tabular-nums">
          {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-gray-400">:</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-gray-400">:</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          {isComplete ? 'Time\'s Up!' : 'Countdown'}
        </h3>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} label="Days" />}
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>

      {showControls && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            disabled={isComplete}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </button>
          {isComplete && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  )
}`
  }
]

export default utilityCapsules

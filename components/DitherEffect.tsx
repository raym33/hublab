'use client'

import { useEffect, useRef, useState } from 'react'

interface DitherEffectProps {
  code?: string
  className?: string
}

export default function DitherEffect({ code = '', className = '' }: DitherEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    updateSize()

    const codeLines = code.split('\n').filter(line => line.trim())
    let currentLine = 0
    let charIndex = 0
    const fontSize = 14
    const lineHeight = 22
    let ditherIntensity = 0
    let ditherDirection = 1
    let glitchOffset = 0
    let scanlineY = 0

    // Bayer 8x8 matrix
    const B8 = [
      [0, 48, 12, 60, 3, 51, 15, 63],
      [32, 16, 44, 28, 35, 19, 47, 31],
      [8, 56, 4, 52, 11, 59, 7, 55],
      [40, 24, 36, 20, 43, 27, 39, 23],
      [2, 50, 14, 62, 1, 49, 13, 61],
      [34, 18, 46, 30, 33, 17, 45, 29],
      [10, 58, 6, 54, 9, 57, 5, 53],
      [42, 26, 38, 22, 41, 25, 37, 21]
    ]

    // Atkinson dithering (más contraste, look retro)
    function atkinsonDither(imageData: ImageData) {
      const { data, width: w, height: h } = imageData
      const lum = new Float32Array(w * h)

      for (let i = 0, p = 0; i < data.length; i += 4, p++) {
        lum[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
      }

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const p = y * w + x
          const old = lum[p]
          const newv = old < 128 ? 0 : 255
          const err = (old - newv) / 8

          lum[p] = newv

          const add = (xx: number, yy: number) => {
            const nx = x + xx
            const ny = y + yy
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              lum[ny * w + nx] += err
            }
          }

          add(1, 0); add(2, 0); add(-1, 1)
          add(0, 1); add(1, 1); add(0, 2)
        }
      }

      for (let p = 0, i = 0; p < lum.length; p++, i += 4) {
        const v = lum[p] | 0
        data[i] = data[i + 1] = data[i + 2] = v
      }
    }

    // Floyd-Steinberg
    function floydSteinberg(imageData: ImageData, threshold: number = 128) {
      const { data, width: w, height: h } = imageData
      const lum = new Float32Array(w * h)

      for (let i = 0, p = 0; i < data.length; i += 4, p++) {
        lum[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
      }

      for (let y = 0; y < h; y++) {
        const serpentine = (y & 1) === 1
        for (let sx = 0; sx < w; sx++) {
          const x = serpentine ? (w - 1 - sx) : sx
          const p = y * w + x
          const old = lum[p]
          const newv = old < threshold ? 0 : 255
          const err = old - newv
          lum[p] = newv

          const add = (xx: number, yy: number, k: number) => {
            const nx = x + xx
            const ny = y + yy
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              lum[ny * w + nx] += err * k
            }
          }

          if (!serpentine) {
            add(1, 0, 7 / 16); add(-1, 1, 3 / 16)
            add(0, 1, 5 / 16); add(1, 1, 1 / 16)
          } else {
            add(-1, 0, 7 / 16); add(1, 1, 3 / 16)
            add(0, 1, 5 / 16); add(-1, 1, 1 / 16)
          }
        }
      }

      for (let p = 0, i = 0; p < lum.length; p++, i += 4) {
        const v = lum[p] | 0
        data[i] = data[i + 1] = data[i + 2] = v
      }
    }

    // Bayer dithering con animación
    function bayerDither(imageData: ImageData, levels: number, offset: number = 0) {
      const { data, width: w, height: h } = imageData

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4

          const sr = data[i] / 255
          const sg = data[i + 1] / 255
          const sb = data[i + 2] / 255
          const r = Math.pow(sr, 2.2)
          const g = Math.pow(sg, 2.2)
          const b = Math.pow(sb, 2.2)

          const t = (B8[(y + Math.floor(offset)) & 7][x & 7] + 0.5) / 64

          const quantize = (v: number) => {
            const u = v + (t - 0.5) / levels
            const s = Math.max(0, Math.min(1, u))
            return Math.round(s * (levels - 1)) / (levels - 1)
          }

          const R = quantize(r)
          const G = quantize(g)
          const B = quantize(b)

          data[i] = Math.pow(R, 1 / 2.2) * 255
          data[i + 1] = Math.pow(G, 1 / 2.2) * 255
          data[i + 2] = Math.pow(B, 1 / 2.2) * 255
        }
      }
    }

    let animationFrame: number
    let lastTime = 0
    const typingSpeed = 35

    const animate = (time: number) => {
      if (time - lastTime < typingSpeed) {
        animationFrame = requestAnimationFrame(animate)
        return
      }
      lastTime = time

      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      // Background con gradiente animado
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, '#0a0a0a')
      grad.addColorStop(0.5, '#1a1a1a')
      grad.addColorStop(1, '#0a0a0a')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Grid pattern sutil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.lineWidth = 1
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, h)
        ctx.stroke()
      }
      for (let i = 0; i < h; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(w, i)
        ctx.stroke()
      }

      // Scanline animada
      scanlineY = (scanlineY + 2) % h
      ctx.fillStyle = 'rgba(0, 255, 0, 0.1)'
      ctx.fillRect(0, scanlineY, w, 3)

      // Código con syntax highlighting
      ctx.font = `${fontSize}px "SF Mono", "Monaco", "Inconsolata", monospace`

      let currentY = 35
      for (let i = 0; i < codeLines.length && i <= currentLine; i++) {
        const line = codeLines[i]
        const displayText = i === currentLine ? line.substring(0, charIndex) : line

        // Glitch effect aleatorio
        let x = 20
        if (Math.random() > 0.95 && i === currentLine) {
          x += Math.random() * 4 - 2
        }

        const words = displayText.split(/(\s+|[{}()[\];,])/)

        for (const word of words) {
          // Colores más vibrantes y variados
          if (['const', 'await', 'async', 'return'].includes(word)) {
            ctx.fillStyle = '#ff6b9d' // Pink
          } else if (word.includes('"') || word.includes("'")) {
            ctx.fillStyle = '#c3e88d' // Green
          } else if (['ai', 'prototype', 'deploy', 'addFeatures'].includes(word)) {
            ctx.fillStyle = '#82aaff' // Blue
          } else if (['{', '}', '(', ')', '[', ']'].includes(word)) {
            ctx.fillStyle = '#89ddff' // Cyan
          } else if (['generate', 'url', 'status', 'count'].includes(word)) {
            ctx.fillStyle = '#f78c6c' // Orange
          } else {
            ctx.fillStyle = '#e0e0e0'
          }

          // Shadow para más profundidad
          ctx.shadowColor = ctx.fillStyle
          ctx.shadowBlur = 4
          ctx.fillText(word, x, currentY)
          ctx.shadowBlur = 0

          x += ctx.measureText(word).width
        }

        // Cursor con efecto de glow
        if (i === currentLine && Math.floor(time / 400) % 2 === 0) {
          ctx.fillStyle = '#00ff00'
          ctx.shadowColor = '#00ff00'
          ctx.shadowBlur = 8
          ctx.fillRect(x, currentY - fontSize + 2, 10, fontSize)
          ctx.shadowBlur = 0
        }

        currentY += lineHeight
      }

      // Obtener image data y aplicar dithering
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Animar intensidad de dithering
      ditherIntensity += ditherDirection * 0.015
      if (ditherIntensity > 1) {
        ditherIntensity = 1
        ditherDirection = -1
      } else if (ditherIntensity < 0) {
        ditherIntensity = 0
        ditherDirection = 1
      }

      glitchOffset += 0.5

      // Alternar entre diferentes algoritmos
      const cycle = Math.floor(time / 3000) % 3

      if (cycle === 0) {
        // Atkinson - más chunky y retro
        if (ditherIntensity > 0.3) {
          atkinsonDither(imageData)
        } else {
          bayerDither(imageData, 2 + Math.floor(ditherIntensity * 4), glitchOffset)
        }
      } else if (cycle === 1) {
        // Floyd-Steinberg con threshold animado
        const threshold = 128 + Math.sin(time / 800) * 40
        floydSteinberg(imageData, threshold)
      } else {
        // Bayer animado
        const levels = 2 + Math.floor((1 - ditherIntensity) * 6)
        bayerDither(imageData, levels, glitchOffset)
      }

      ctx.putImageData(imageData, 0, 0)

      // Efecto de aberración cromática sutil en los bordes
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = 'rgba(255, 0, 0, 0.02)'
      ctx.fillRect(-2, 0, w + 4, h)
      ctx.fillStyle = 'rgba(0, 0, 255, 0.02)'
      ctx.fillRect(2, 0, w - 4, h)
      ctx.globalCompositeOperation = 'source-over'

      // Typing animation
      if (currentLine < codeLines.length) {
        charIndex++
        if (charIndex > codeLines[currentLine].length + 15) {
          currentLine++
          charIndex = 0
        }
      } else {
        if (charIndex > 40) {
          currentLine = 0
          charIndex = 0
          ditherIntensity = 0
          ditherDirection = 1
        } else {
          charIndex++
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    const handleResize = () => {
      updateSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
    }
  }, [mounted, code])

  if (!mounted) {
    return <div className={className} style={{ backgroundColor: '#0a0a0a' }} />
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
        backgroundColor: '#0a0a0a'
      }}
    />
  )
}
/**
 * Media Capsules V2 - Video, Audio, and Advanced Image Processing
 * Browser-based media manipulation using HTML5 APIs and Canvas
 */

import { CapsuleDefinition } from './types'

export const MEDIA_CAPSULES: CapsuleDefinition[] = [
  // ============================================
  // VIDEO PROCESSING
  // ============================================

  {
    id: 'video-recorder',
    name: 'Video Recorder',
    description: 'Record video from webcam with controls',
    category: 'feature',
    props: [
      { name: 'maxDuration', type: 'number', required: false, description: 'Max recording duration in seconds' }
    ],
    code: `function VideoRecorder({ maxDuration = 300 }) {
  const [recording, setRecording] = React.useState(false)
  const [videoUrl, setVideoUrl] = React.useState(null)
  const [timer, setTimer] = React.useState(0)
  const videoRef = React.useRef(null)
  const mediaRecorderRef = React.useRef(null)
  const chunksRef = React.useRef([])

  React.useEffect(() => {
    let interval
    if (recording) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return t + 1
        })
      }, 1000)
    } else {
      setTimer(0)
    }
    return () => clearInterval(interval)
  }, [recording, maxDuration])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      videoRef.current.srcObject = stream

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setVideoUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      alert('Error accessing camera: ' + err.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const downloadVideo = () => {
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = \`recording-\${Date.now()}.webm\`
    a.click()
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted={recording}
          src={!recording ? videoUrl : undefined}
          controls={!recording && videoUrl}
          className="w-full aspect-video"
        />
      </div>

      {recording && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-mono">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-center">
        {!recording && !videoUrl && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <span className="text-xl">●</span>
            Start Recording
          </button>
        )}

        {recording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <span className="text-xl">■</span>
            Stop Recording
          </button>
        )}

        {!recording && videoUrl && (
          <>
            <button
              onClick={() => setVideoUrl(null)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Record New
            </button>
            <button
              onClick={downloadVideo}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Download
            </button>
          </>
        )}
      </div>
    </div>
  )
}`
  },

  {
    id: 'video-player-advanced',
    name: 'Advanced Video Player',
    description: 'Video player with playback speed, volume, and screenshot features',
    category: 'feature',
    props: [
      { name: 'src', type: 'string', required: true, description: 'Video source URL' },
      { name: 'poster', type: 'string', required: false, description: 'Poster image URL' }
    ],
    code: `function AdvancedVideoPlayer({ src, poster }) {
  const videoRef = React.useRef(null)
  const [playing, setPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [volume, setVolume] = React.useState(1)
  const [playbackRate, setPlaybackRate] = React.useState(1)
  const [fullscreen, setFullscreen] = React.useState(false)

  const togglePlay = () => {
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration)
  }

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value)
    videoRef.current.volume = vol
    setVolume(vol)
  }

  const handlePlaybackRateChange = (rate) => {
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  const takeScreenshot = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0)

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = \`screenshot-\${Date.now()}.png\`
      a.click()
    })
  }

  const toggleFullscreen = () => {
    if (!fullscreen) {
      videoRef.current.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setFullscreen(!fullscreen)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      <div className="p-4 space-y-3">
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full"
        />

        <div className="flex items-center justify-between text-white text-sm">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
          >
            {playing ? '⏸' : '▶'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-white text-sm">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Speed:</span>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
              <button
                key={rate}
                onClick={() => handlePlaybackRateChange(rate)}
                className={\`px-2 py-1 rounded text-sm \${
                  playbackRate === rate
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }\`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <button
            onClick={takeScreenshot}
            className="ml-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            📸 Screenshot
          </button>

          <button
            onClick={toggleFullscreen}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  )
}`
  },

  {
    id: 'video-trimmer',
    name: 'Video Trimmer',
    description: 'Trim and cut video sections with preview',
    category: 'feature',
    props: [
      { name: 'videoUrl', type: 'string', required: true, description: 'Video URL to trim' }
    ],
    code: `function VideoTrimmer({ videoUrl }) {
  const videoRef = React.useRef(null)
  const [duration, setDuration] = React.useState(0)
  const [startTime, setStartTime] = React.useState(0)
  const [endTime, setEndTime] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [trimming, setTrimming] = React.useState(false)

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        const dur = videoRef.current.duration
        setDuration(dur)
        setEndTime(dur)
      })
    }
  }, [])

  const handleSeek = (time) => {
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const trimVideo = async () => {
    setTrimming(true)

    // In a real app, this would use FFmpeg.wasm or server-side processing
    // For demo, we'll just show the concept
    alert(\`Trimming video from \${startTime.toFixed(2)}s to \${endTime.toFixed(2)}s\\nIn production, this would use FFmpeg.wasm or a server-side API.\`)

    setTrimming(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video"
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        />
      </div>

      <div className="space-y-4">
        <div className="relative h-20 bg-gray-200 rounded-lg overflow-hidden">
          {/* Timeline */}
          <div
            className="absolute h-full bg-blue-500 opacity-30"
            style={{
              left: \`\${(startTime / duration) * 100}%\`,
              width: \`\${((endTime - startTime) / duration) * 100}%\`
            }}
          />

          {/* Current time indicator */}
          <div
            className="absolute w-0.5 h-full bg-red-500"
            style={{ left: \`\${(currentTime / duration) * 100}%\` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time: {formatTime(startTime)}
            </label>
            <input
              type="range"
              min="0"
              max={endTime}
              step="0.1"
              value={startTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setStartTime(val)
                handleSeek(val)
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time: {formatTime(endTime)}
            </label>
            <input
              type="range"
              min={startTime}
              max={duration}
              step="0.1"
              value={endTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setEndTime(val)
                handleSeek(val)
              }}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">
            Duration: {formatTime(endTime - startTime)}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSeek(startTime)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm"
            >
              Go to Start
            </button>
            <button
              onClick={() => handleSeek(endTime)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm"
            >
              Go to End
            </button>
            <button
              onClick={trimVideo}
              disabled={trimming}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {trimming ? 'Trimming...' : 'Trim Video'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}`
  },

  // ============================================
  // ADVANCED IMAGE PROCESSING
  // ============================================

  {
    id: 'image-editor-canvas',
    name: 'Canvas Image Editor',
    description: 'Draw, annotate, and edit images on canvas',
    category: 'feature',
    props: [
      { name: 'imageUrl', type: 'string', required: false, description: 'Initial image URL' }
    ],
    code: `function CanvasImageEditor({ imageUrl }) {
  const canvasRef = React.useRef(null)
  const [drawing, setDrawing] = React.useState(false)
  const [tool, setTool] = React.useState('pen')
  const [color, setColor] = React.useState('#000000')
  const [lineWidth, setLineWidth] = React.useState(2)
  const [image, setImage] = React.useState(null)

  React.useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        setImage(img)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  const startDrawing = (e) => {
    setDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!drawing) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    if (tool === 'pen') {
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.globalCompositeOperation = 'source-over'
    }
  }

  const stopDrawing = () => {
    setDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (image) {
      ctx.drawImage(image, 0, 0)
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = \`edited-image-\${Date.now()}.png\`
      a.click()
    })
  }

  const uploadImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          setImage(img)
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setTool('pen')}
              className={\`px-4 py-2 rounded-lg \${
                tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }\`}
            >
              ✏️ Pen
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={\`px-4 py-2 rounded-lg \${
                tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }\`}
            >
              🧹 Eraser
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Size:</label>
            <input
              type="range"
              min="1"
              max="50"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600">{lineWidth}px</span>
          </div>

          <div className="flex gap-2 ml-auto">
            <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer">
              📤 Upload
              <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
            </label>
            <button
              onClick={clearCanvas}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Clear
            </button>
            <button
              onClick={downloadImage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              💾 Download
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex justify-center overflow-auto">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-gray-300 bg-white cursor-crosshair max-w-full"
        />
      </div>
    </div>
  )
}`
  },

  {
    id: 'image-collage-maker',
    name: 'Image Collage Maker',
    description: 'Create photo collages with drag and drop',
    category: 'feature',
    code: `function ImageCollageMaker() {
  const [images, setImages] = React.useState([])
  const [layout, setLayout] = React.useState('grid')
  const canvasRef = React.useRef(null)

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages(prev => [...prev, { id: Date.now() + Math.random(), src: event.target.result }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id))
  }

  const generateCollage = () => {
    if (images.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = 1200
    canvas.height = 1200

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const loadedImages = []
    let loadedCount = 0

    images.forEach((imgData, index) => {
      const img = new Image()
      img.onload = () => {
        loadedImages[index] = img
        loadedCount++

        if (loadedCount === images.length) {
          // Draw based on layout
          if (layout === 'grid') {
            const cols = Math.ceil(Math.sqrt(images.length))
            const rows = Math.ceil(images.length / cols)
            const cellW = canvas.width / cols
            const cellH = canvas.height / rows

            loadedImages.forEach((img, i) => {
              const col = i % cols
              const row = Math.floor(i / cols)
              const x = col * cellW
              const y = row * cellH

              ctx.drawImage(img, x, y, cellW, cellH)
            })
          } else if (layout === 'mosaic') {
            // Simple mosaic - random sizes
            loadedImages.forEach((img, i) => {
              const size = 200 + Math.random() * 200
              const x = Math.random() * (canvas.width - size)
              const y = Math.random() * (canvas.height - size)
              ctx.drawImage(img, x, y, size, size)
            })
          }
        }
      }
      img.src = imgData.src
    })
  }

  const downloadCollage = () => {
    const canvas = canvasRef.current
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = \`collage-\${Date.now()}.png\`
      a.click()
    })
  }

  React.useEffect(() => {
    if (images.length > 0) {
      generateCollage()
    }
  }, [images, layout])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <div className="flex gap-4 items-center flex-wrap">
          <label className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer font-semibold">
            📤 Add Photos
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Layout:</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="grid">Grid</option>
              <option value="mosaic">Mosaic</option>
            </select>
          </div>

          <button
            onClick={downloadCollage}
            disabled={images.length === 0}
            className="ml-auto bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            💾 Download Collage
          </button>

          <span className="text-sm text-gray-600">{images.length} photos</span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {images.map(img => (
          <div key={img.id} className="relative group">
            <img src={img.src} className="w-full h-24 object-cover rounded-lg" />
            <button
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 bg-white max-w-full h-auto"
        />
      </div>
    </div>
  )
}`
  },

  {
    id: 'image-background-remover',
    name: 'Background Remover',
    description: 'Remove image background with color tolerance',
    category: 'feature',
    code: `function BackgroundRemover() {
  const [image, setImage] = React.useState(null)
  const [tolerance, setTolerance] = React.useState(30)
  const [bgColor, setBgColor] = React.useState('#ffffff')
  const canvasRef = React.useRef(null)
  const originalImageRef = React.useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          originalImageRef.current = img
          setImage(event.target.result)

          const canvas = canvasRef.current
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const removeBackground = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = originalImageRef.current

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const targetColor = hexToRgb(bgColor)

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      const distance = Math.sqrt(
        Math.pow(r - targetColor.r, 2) +
        Math.pow(g - targetColor.g, 2) +
        Math.pow(b - targetColor.b, 2)
      )

      if (distance < tolerance) {
        data[i + 3] = 0 // Make transparent
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = \`no-background-\${Date.now()}.png\`
      a.click()
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <div className="flex gap-4 items-center flex-wrap">
          <label className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer font-semibold">
            📤 Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Background Color:</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Tolerance:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600">{tolerance}</span>
          </div>

          <button
            onClick={removeBackground}
            disabled={!image}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            Remove Background
          </button>

          <button
            onClick={downloadImage}
            disabled={!image}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            💾 Download
          </button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4">
        <div className="bg-white rounded-lg overflow-hidden inline-block" style={{
          backgroundImage: 'repeating-conic-gradient(#ddd 0% 25%, white 0% 50%)',
          backgroundSize: '20px 20px'
        }}>
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}`
  },

  // ============================================
  // AUDIO PROCESSING
  // ============================================

  {
    id: 'audio-recorder',
    name: 'Audio Recorder',
    description: 'Record audio with waveform visualization',
    category: 'feature',
    code: `function AudioRecorder() {
  const [recording, setRecording] = React.useState(false)
  const [audioUrl, setAudioUrl] = React.useState(null)
  const [duration, setDuration] = React.useState(0)
  const mediaRecorderRef = React.useRef(null)
  const chunksRef = React.useRef([])
  const canvasRef = React.useRef(null)
  const animationRef = React.useRef(null)
  const analyserRef = React.useRef(null)

  const visualize = (stream) => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    analyser.fftSize = 2048
    analyserRef.current = analyser

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      analyser.getByteTimeDomainData(dataArray)

      ctx.fillStyle = 'rgb(240, 240, 240)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgb(59, 130, 246)'
      ctx.beginPath()

      const sliceWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = v * canvas.height / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    draw()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setRecording(true)

      visualize(stream)

      const startTime = Date.now()
      const interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

      mediaRecorder.onstop = () => {
        clearInterval(interval)
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }

    } catch (err) {
      alert('Error accessing microphone: ' + err.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const downloadAudio = () => {
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = \`recording-\${Date.now()}.webm\`
    a.click()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-48 bg-gray-50 rounded-lg"
        />
      </div>

      {recording && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-mono text-lg">{formatTime(duration)}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        {!recording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg"
          >
            <span className="text-2xl">🎤</span>
            Start Recording
          </button>
        )}

        {recording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg"
          >
            <span className="text-2xl">■</span>
            Stop Recording
          </button>
        )}

        {!recording && audioUrl && (
          <div className="w-full space-y-4">
            <audio src={audioUrl} controls className="w-full" />
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setAudioUrl(null)
                  setDuration(0)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Record New
              </button>
              <button
                onClick={downloadAudio}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                💾 Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}`
  },

  {
    id: 'audio-visualizer',
    name: 'Audio Visualizer',
    description: 'Visualize audio with frequency bars',
    category: 'feature',
    props: [
      { name: 'audioUrl', type: 'string', required: false, description: 'Audio file URL' }
    ],
    code: `function AudioVisualizer({ audioUrl }) {
  const audioRef = React.useRef(null)
  const canvasRef = React.useRef(null)
  const [playing, setPlaying] = React.useState(false)
  const [visualizerType, setVisualizerType] = React.useState('bars')
  const animationRef = React.useRef(null)
  const analyserRef = React.useRef(null)
  const audioContextRef = React.useRef(null)

  const setupVisualizer = () => {
    const audio = audioRef.current
    if (!audio) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audio)

    source.connect(analyser)
    analyser.connect(audioContext.destination)

    analyser.fftSize = 256
    analyserRef.current = analyser
    audioContextRef.current = audioContext

    visualize()
  }

  const visualize = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const analyser = analyserRef.current

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = 'rgb(0, 0, 0)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (visualizerType === 'bars') {
        const barWidth = (canvas.width / bufferLength) * 2.5
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height

          const r = barHeight + (25 * (i / bufferLength))
          const g = 250 * (i / bufferLength)
          const b = 50

          ctx.fillStyle = \`rgb(\${r},\${g},\${b})\`
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

          x += barWidth + 1
        }
      } else if (visualizerType === 'circle') {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = 100

        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2
          const barHeight = (dataArray[i] / 255) * 100

          const x1 = centerX + Math.cos(angle) * radius
          const y1 = centerY + Math.sin(angle) * radius
          const x2 = centerX + Math.cos(angle) * (radius + barHeight)
          const y2 = centerY + Math.sin(angle) * (radius + barHeight)

          ctx.strokeStyle = \`hsl(\${(i / bufferLength) * 360}, 100%, 50%)\`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    }

    draw()
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (playing) {
      audio.pause()
    } else {
      if (!analyserRef.current) {
        setupVisualizer()
      }
      audio.play()
    }
    setPlaying(!playing)
  }

  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full bg-black rounded-lg"
      />

      <audio ref={audioRef} src={audioUrl} className="hidden" />

      <div className="flex gap-4 items-center justify-center">
        <button
          onClick={togglePlay}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg"
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setVisualizerType('bars')}
            className={\`px-4 py-2 rounded-lg \${
              visualizerType === 'bars' ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }\`}
          >
            Bars
          </button>
          <button
            onClick={() => setVisualizerType('circle')}
            className={\`px-4 py-2 rounded-lg \${
              visualizerType === 'circle' ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }\`}
          >
            Circle
          </button>
        </div>
      </div>
    </div>
  )
}`
  }
]

/**
 * Cápsulas de AI/ML V2
 * Componentes avanzados para inteligencia artificial y machine learning
 * Incluye LLM, TTS, STT, procesamiento de imágenes y más
 */

import { CapsuleDefinition } from './types'

export const AI_ML_CAPSULES: CapsuleDefinition[] = [
  // AI Chat Interface
  {
    id: 'ai-chat',
    name: 'AI Chat Interface',
    description: 'Chat interface with AI responses (OpenAI compatible)',
    category: 'feature',
    props: [
      { name: 'apiEndpoint', type: 'string', required: false, default: '/api/chat', description: 'API endpoint for chat' },
      { name: 'model', type: 'string', required: false, default: 'gpt-3.5-turbo', description: 'AI model to use' }
    ],
    dependencies: [],
    code: `
function AIChat({ apiEndpoint = '/api/chat', model = 'gpt-3.5-turbo' }) {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: 'Hello! I\\'m your AI assistant. How can I help you today?' }
  ])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Simulated AI response for demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      const aiResponse = {
        role: 'assistant',
        content: \`I received your message: "\${input}". This is a demo AI response. Connect to a real API endpoint to get actual AI responses.\`
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h3 className="font-bold">AI Assistant</h3>
        <p className="text-xs text-blue-100">Powered by {model}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
            <div className={\`max-w-[80%] rounded-lg px-4 py-2 \${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }\`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}`
  },

  // Text to Speech
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to speech using Web Speech API',
    category: 'ui',
    props: [
      { name: 'initialText', type: 'string', required: false, default: 'Hello! This is a text to speech demo.', description: 'Initial text' }
    ],
    dependencies: [],
    code: `
function TextToSpeech({ initialText = 'Hello! This is a text to speech demo.' }) {
  const [text, setText] = React.useState(initialText)
  const [speaking, setSpeaking] = React.useState(false)
  const [voices, setVoices] = React.useState([])
  const [selectedVoice, setSelectedVoice] = React.useState(0)
  const [rate, setRate] = React.useState(1)
  const [pitch, setPitch] = React.useState(1)

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const speak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)

      if (voices[selectedVoice]) {
        utterance.voice = voices[selectedVoice]
      }
      utterance.rate = rate
      utterance.pitch = pitch

      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      window.speechSynthesis.speak(utterance)
    } else {
      alert('Text-to-speech not supported in this browser')
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Text to Speech</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        rows={4}
        placeholder="Enter text to speak..."
      />

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {voices.map((voice, idx) => (
              <option key={idx} value={idx}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Speed: {rate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pitch: {pitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={speak}
          disabled={speaking || !text}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-semibold"
        >
          {speaking ? '🔊 Speaking...' : '🎤 Speak'}
        </button>
        <button
          onClick={stop}
          disabled={!speaking}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  )
}`
  },

  // Speech to Text
  {
    id: 'speech-to-text',
    name: 'Speech to Text',
    description: 'Convert speech to text using Web Speech API',
    category: 'ui',
    props: [
      { name: 'language', type: 'string', required: false, default: 'en-US', description: 'Recognition language' }
    ],
    dependencies: [],
    code: `
function SpeechToText({ language = 'en-US' }) {
  const [text, setText] = React.useState('')
  const [listening, setListening] = React.useState(false)
  const [supported, setSupported] = React.useState(true)
  const recognitionRef = React.useRef(null)

  React.useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setText(transcript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language])

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setText('')
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop()
    }
  }

  if (!supported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
        <p className="text-red-800">Speech recognition is not supported in this browser.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Speech to Text</h3>

      <div className={\`mb-6 text-center py-12 rounded-lg border-2 border-dashed \${
        listening ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
      }\`}>
        {listening ? (
          <div>
            <div className="text-6xl mb-4 animate-pulse">🎤</div>
            <p className="text-red-600 font-semibold">Listening...</p>
          </div>
        ) : (
          <div>
            <div className="text-6xl mb-4">🎙️</div>
            <p className="text-gray-600">Click "Start" to begin recording</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Transcription</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          placeholder="Your speech will appear here..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={startListening}
          disabled={listening}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-semibold"
        >
          🎤 Start Recording
        </button>
        <button
          onClick={stopListening}
          disabled={!listening}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
        >
          ⏹ Stop Recording
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Language: {language}</p>
        <p>Characters: {text.length}</p>
      </div>
    </div>
  )
}`
  },

  // Image Filter Editor
  {
    id: 'image-filters',
    name: 'Image Filter Editor',
    description: 'Apply CSS filters to images in real-time',
    category: 'ui',
    props: [
      { name: 'defaultImage', type: 'string', required: false, default: 'https://via.placeholder.com/600x400', description: 'Default image URL' }
    ],
    dependencies: [],
    code: `
function ImageFilters({ defaultImage = 'https://via.placeholder.com/600x400' }) {
  const [image, setImage] = React.useState(defaultImage)
  const [filters, setFilters] = React.useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    blur: 0
  })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const filterStyle = {
    filter: \`brightness(\${filters.brightness}%) contrast(\${filters.contrast}%) saturate(\${filters.saturate}%) grayscale(\${filters.grayscale}%) sepia(\${filters.sepia}%) hue-rotate(\${filters.hueRotate}deg) blur(\${filters.blur}px)\`
  }

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      blur: 0
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Image Filter Editor</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer">
              <span className="text-sm text-gray-600">Click to upload image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image}
              alt="Preview"
              style={filterStyle}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}: {value}{key === 'hueRotate' ? '°' : key === 'blur' ? 'px' : '%'}
              </label>
              <input
                type="range"
                min={key === 'blur' ? 0 : key === 'hueRotate' ? 0 : 0}
                max={key === 'blur' ? 10 : key === 'hueRotate' ? 360 : 200}
                value={value}
                onChange={(e) => setFilters({ ...filters, [key]: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          ))}

          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}`
  },

  // QR Code Generator
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text/URLs',
    category: 'ui',
    props: [
      { name: 'defaultText', type: 'string', required: false, default: 'https://example.com', description: 'Default text/URL' }
    ],
    dependencies: [],
    code: `
function QRGenerator({ defaultText = 'https://example.com' }) {
  const [text, setText] = React.useState(defaultText)
  const [size, setSize] = React.useState(256)
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    generateQR()
  }, [text, size])

  const generateQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const qrSize = size
    const pixelSize = 8

    // Simple QR code representation (this is a visual demo)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, qrSize, qrSize)

    ctx.fillStyle = 'black'
    const gridSize = Math.floor(qrSize / pixelSize)

    // Create a pseudo-random pattern based on text
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const seed = (i * gridSize + j + hash) % 100
        if (seed < 50) {
          ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize)
        }
      }
    }
  }

  const downloadQR = () => {
    const canvas = canvasRef.current
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code Generator</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text or URL
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text or URL"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Size: {size}x{size}px
        </label>
        <input
          type="range"
          min="128"
          max="512"
          step="64"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="border-2 border-gray-200 rounded-lg"
        />

        <button
          onClick={downloadQR}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
        >
          📥 Download QR Code
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Note: This is a visual demo. For production, use a proper QR code library.
      </p>
    </div>
  )
}`
  }
]

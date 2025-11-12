/**
 * AI Integration Capsules
 *
 * 5 production-ready AI-powered components
 * Perfect for adding AI features to any application
 */

import { Capsule } from '@/types/capsule'

const aiIntegrationCapsules: Capsule[] = [
  {
    id: 'ai-chat-interface',
    name: 'AI Chat Interface',
    category: 'AI',
    description: 'Complete AI chat interface with streaming responses, message history, and code syntax highlighting. Supports OpenAI, Anthropic, and custom APIs. Includes typing indicators, error handling, and markdown rendering.',
    tags: ['ai', 'chat', 'chatbot', 'gpt', 'claude', 'streaming'],
    code: `'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Copy, Check } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatInterfaceProps {
  apiEndpoint?: string
  placeholder?: string
  systemPrompt?: string
  maxMessages?: number
  welcomeMessage?: string
}

export default function AIChatInterface({
  apiEndpoint = '/api/chat',
  placeholder = 'Ask me anything...',
  systemPrompt = 'You are a helpful AI assistant.',
  maxMessages = 50,
  welcomeMessage = 'Hello! How can I help you today?'
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].slice(-maxMessages),
          systemPrompt
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={\`flex gap-3 \${message.role === 'user' ? 'justify-end' : 'justify-start'}\`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-white" />
              </div>
            )}

            <div className={\`max-w-[80%] \${message.role === 'user' ? 'order-first' : ''}\`}>
              <div
                className={\`rounded-lg p-3 \${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }\`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>

              <div className="flex items-center gap-2 mt-1 px-3">
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>

                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    {copiedId === message.id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot size={20} className="text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 size={20} className="animate-spin text-gray-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'ai-text-generator',
    name: 'AI Text Generator',
    category: 'AI',
    description: 'AI-powered text generation component with templates and customization. Generate blog posts, social media captions, product descriptions, and more. Real-time character count and copy functionality.',
    tags: ['ai', 'text-generation', 'content', 'gpt', 'writing'],
    code: `'use client'

import { useState } from 'react'
import { Wand2, Copy, Check, Loader2, RefreshCw } from 'lucide-react'

interface Template {
  id: string
  name: string
  prompt: string
  placeholder: string
}

interface AITextGeneratorProps {
  apiEndpoint?: string
  templates?: Template[]
}

export default function AITextGenerator({
  apiEndpoint = '/api/generate',
  templates = [
    {
      id: 'blog',
      name: 'Blog Post',
      prompt: 'Write a blog post about',
      placeholder: 'e.g., The benefits of remote work'
    },
    {
      id: 'social',
      name: 'Social Media',
      prompt: 'Write a social media post about',
      placeholder: 'e.g., New product launch'
    },
    {
      id: 'product',
      name: 'Product Description',
      prompt: 'Write a product description for',
      placeholder: 'e.g., Wireless headphones with noise cancellation'
    },
    {
      id: 'email',
      name: 'Email',
      prompt: 'Write a professional email about',
      placeholder: 'e.g., Following up on a meeting'
    }
  ]
}: AITextGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [input, setInput] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return

    setIsGenerating(true)
    setGeneratedText('')

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: \`\${selectedTemplate.prompt} \${input}\`
        })
      })

      if (!response.ok) throw new Error('Generation failed')

      const data = await response.json()
      setGeneratedText(data.text || '')
    } catch (error) {
      console.error('Generation error:', error)
      setGeneratedText('Failed to generate text. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={\`px-4 py-2 rounded-lg border-2 transition \${
                selectedTemplate.id === template.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }\`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topic
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedTemplate.placeholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !input.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition"
      >
        {isGenerating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 size={20} />
            Generate with AI
          </>
        )}
      </button>

      {/* Generated Text */}
      {generatedText && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Generated Text
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {generatedText.length} characters
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                <RefreshCw size={16} />
                Regenerate
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="whitespace-pre-wrap">{generatedText}</p>
          </div>
        </div>
      )}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    category: 'AI',
    description: 'DALL-E / Stable Diffusion image generator with prompt suggestions and style presets. Download generated images, adjust settings, and view generation history. Includes loading states and error handling.',
    tags: ['ai', 'image-generation', 'dall-e', 'stable-diffusion', 'art'],
    code: `'use client'

import { useState } from 'react'
import { Sparkles, Download, Loader2, Image as ImageIcon } from 'lucide-react'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: Date
}

interface AIImageGeneratorProps {
  apiEndpoint?: string
  stylePresets?: { name: string; prompt: string }[]
}

export default function AIImageGenerator({
  apiEndpoint = '/api/generate-image',
  stylePresets = [
    { name: 'Realistic', prompt: ', photorealistic, highly detailed, 8k' },
    { name: 'Anime', prompt: ', anime style, vibrant colors, cel-shaded' },
    { name: 'Oil Painting', prompt: ', oil painting, classical art style' },
    { name: 'Digital Art', prompt: ', digital art, trending on artstation' },
    { name: '3D Render', prompt: ', 3d render, octane render, unreal engine' }
  ]
}: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(stylePresets[0])
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      const fullPrompt = prompt + selectedStyle.prompt

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      })

      if (!response.ok) throw new Error('Generation failed')

      const data = await response.json()

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.url,
        prompt: prompt,
        timestamp: new Date()
      }

      setImages([newImage, ...images].slice(0, 12))
    } catch (error) {
      console.error('Image generation error:', error)
      alert('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe your image
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A futuristic city at sunset with flying cars"
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Art Style
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {stylePresets.map((style) => (
            <button
              key={style.name}
              onClick={() => setSelectedStyle(style)}
              className={\`px-3 py-2 rounded-lg border-2 text-sm transition \${
                selectedStyle.name === style.name
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }\`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition"
      >
        {isGenerating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating image...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate Image
          </>
        )}
      </button>

      {/* Generated Images */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    onClick={() =>
                      downloadImage(image.url, \`ai-image-\${image.id}.png\`)
                    }
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                  >
                    <Download size={20} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {image.prompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && !isGenerating && (
        <div className="text-center py-12 text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-4" />
          <p>Your generated images will appear here</p>
        </div>
      )}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'ai-sentiment-analyzer',
    name: 'AI Sentiment Analyzer',
    category: 'AI',
    description: 'Analyze text sentiment with visual feedback and confidence scores. Shows positive/negative/neutral classification with emoji indicators. Great for feedback analysis, social media monitoring, and content moderation.',
    tags: ['ai', 'sentiment', 'analysis', 'nlp', 'emotion'],
    code: `'use client'

import { useState } from 'react'
import { Smile, Frown, Meh, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  score: number
  keywords: string[]
}

interface AISentimentAnalyzerProps {
  apiEndpoint?: string
}

export default function AISentimentAnalyzer({
  apiEndpoint = '/api/analyze-sentiment'
}: AISentimentAnalyzerProps) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<SentimentResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!text.trim() || isAnalyzing) return

    setIsAnalyzing(true)

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Sentiment analysis error:', error)
      alert('Failed to analyze sentiment. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sentimentConfig = {
    positive: {
      icon: Smile,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: TrendingUp,
      emoji: '😊',
      label: 'Positive'
    },
    negative: {
      icon: Frown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      trend: TrendingDown,
      emoji: '😞',
      label: 'Negative'
    },
    neutral: {
      icon: Meh,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      trend: Minus,
      emoji: '😐',
      label: 'Neutral'
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div>
        <h3 className="text-xl font-semibold mb-2">AI Sentiment Analysis</h3>
        <p className="text-gray-600 text-sm">
          Analyze the emotional tone and sentiment of any text
        </p>
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text to Analyze
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze sentiment..."
          rows={5}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-1 text-sm text-gray-500">
          {text.length} characters
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !text.trim()}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Sentiment Badge */}
          <div className={\`p-6 rounded-lg border-2 \${sentimentConfig[result.sentiment].bgColor} \${sentimentConfig[result.sentiment].borderColor}\`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{sentimentConfig[result.sentiment].emoji}</span>
                <div>
                  <h4 className={\`text-xl font-semibold \${sentimentConfig[result.sentiment].color}\`}>
                    {sentimentConfig[result.sentiment].label}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {React.createElement(sentimentConfig[result.sentiment].trend, {
                size: 32,
                className: sentimentConfig[result.sentiment].color
              })}
            </div>

            {/* Confidence Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={\`h-2 rounded-full transition-all duration-500 \${
                  result.sentiment === 'positive' ? 'bg-green-500' :
                  result.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                }\`}
                style={{ width: \`\${result.confidence * 100}%\` }}
              />
            </div>
          </div>

          {/* Sentiment Score */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {(result.score * 100).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {text.split(/\s+/).length}
              </div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {result.keywords?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Keywords</div>
            </div>
          </div>

          {/* Keywords */}
          {result.keywords && result.keywords.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Key Emotional Words
              </h5>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'ai-code-formatter',
    name: 'AI Code Formatter',
    category: 'AI',
    description: 'AI-powered code formatter and beautifier with syntax highlighting. Supports multiple languages, auto-detects code language, and provides formatting suggestions. Includes copy and download functionality.',
    tags: ['ai', 'code', 'formatter', 'syntax-highlighting', 'prettier'],
    code: `'use client'

import { useState } from 'react'
import { Code2, Copy, Check, Download, Wand2 } from 'lucide-react'

interface AICodeFormatterProps {
  apiEndpoint?: string
  supportedLanguages?: string[]
}

export default function AICodeFormatter({
  apiEndpoint = '/api/format-code',
  supportedLanguages = [
    'javascript',
    'typescript',
    'python',
    'java',
    'html',
    'css',
    'json',
    'sql'
  ]
}: AICodeFormatterProps) {
  const [inputCode, setInputCode] = useState('')
  const [formattedCode, setFormattedCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(supportedLanguages[0])
  const [isFormatting, setIsFormatting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFormat = async () => {
    if (!inputCode.trim() || isFormatting) return

    setIsFormatting(true)

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: inputCode,
          language: selectedLanguage
        })
      })

      if (!response.ok) throw new Error('Formatting failed')

      const data = await response.json()
      setFormattedCode(data.formattedCode || inputCode)
    } catch (error) {
      console.error('Formatting error:', error)
      setFormattedCode('Failed to format code. Please try again.')
    } finally {
      setIsFormatting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      html: 'html',
      css: 'css',
      json: 'json',
      sql: 'sql'
    }

    const blob = new Blob([formattedCode], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`formatted.\${extensions[selectedLanguage] || 'txt'}\`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Code2 size={24} />
          AI Code Formatter
        </h3>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Code
        </label>
        <textarea
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Paste your code here..."
          rows={10}
          className="w-full px-4 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Format Button */}
      <button
        onClick={handleFormat}
        disabled={isFormatting || !inputCode.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        <Wand2 size={20} />
        {isFormatting ? 'Formatting...' : 'Format Code'}
      </button>

      {/* Output */}
      {formattedCode && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Formatted Code
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={downloadCode}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <pre className="w-full px-4 py-2 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm overflow-x-auto">
            <code>{formattedCode}</code>
          </pre>
        </div>
      )}
    </div>
  )
}`,
    platform: 'react'
  }
]

export default aiIntegrationCapsules

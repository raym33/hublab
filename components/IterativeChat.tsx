'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2, Lightbulb, Undo, RefreshCw } from 'lucide-react'
import type { CompilationResult } from '@/lib/capsule-compiler/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface IterativeChatProps {
  currentResult: CompilationResult | null
  onImprove: (instruction: string) => Promise<void>
  isImproving: boolean
  onUndo?: () => void
  canUndo?: boolean
}

export default function IterativeChat({
  currentResult,
  onImprove,
  isImproving,
  onUndo,
  canUndo = false
}: IterativeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    { text: 'Add dark mode toggle', icon: '🌙' },
    { text: 'Make it responsive', icon: '📱' },
    { text: 'Add animations', icon: '✨' },
    { text: 'Improve colors', icon: '🎨' },
    { text: 'Add loading states', icon: '⏳' },
    { text: 'Add error handling', icon: '🛡️' }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isImproving) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      await onImprove(input)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'ve updated your app! Check the preview to see the changes.',
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I couldn\'t make that change. Please try rephrasing your request.',
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!currentResult) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center p-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Generate an app first to start iterating</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-semibold text-white">AI Assistant</span>
        </div>
        {canUndo && (
          <button
            onClick={onUndo}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
            disabled={isImproving}
          >
            <Undo className="w-4 h-4" />
            Undo
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400 mb-2">Start a conversation</p>
            <p className="text-sm text-gray-500">Tell me how to improve your app</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white/5 text-gray-200 border border-white/10'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-60">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}

        {isImproving && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Improving your app...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 0 && !isImproving && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-500 mb-2 font-medium">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-colors flex items-center gap-1.5"
              >
                <span>{suggestion.icon}</span>
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-black/20 border-t border-white/10 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tell me how to improve your app..."
              disabled={isImproving}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50"
              rows={2}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isImproving}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
          >
            {isImproving ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

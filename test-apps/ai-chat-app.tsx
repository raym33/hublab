'use client'

import React from 'react'
import AIChat from '@/components/capsules/AIChat'
import Input from '@/components/capsules/Input'
import Button from '@/components/capsules/Button'
import Avatar from '@/components/capsules/Avatar'
import Spinner from '@/components/capsules/Spinner'

/**
 * Test App 3: AI Chat Interface
 * Tests: AI/ML components, real-time interactions, message flows
 * Components: 5
 * Expected: Interactive chat interface with proper structure
 */

export default function AIChatApp() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar name="AI Assistant" size="md" />
            <div>
              <h1 className="text-xl font-bold">AI Assistant</h1>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AIChat
            apiEndpoint="/api/chat"
            placeholder="Type your message..."
            systemPrompt="You are a helpful assistant."
          />

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar
                name={msg.role === 'user' ? 'You' : 'AI Assistant'}
                size="sm"
              />
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar name="AI Assistant" size="sm" />
              <div className="bg-gray-100 p-4 rounded-2xl">
                <Spinner size="sm" text="Thinking..." />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Type your message..."
                value=""
              />
            </div>
            <Button
              text="Send"
              variant="primary"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

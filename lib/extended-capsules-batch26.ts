/**
 * Extended Capsules Batch 26
 * 12 capsules: Real-time Collaboration, Voice Interfaces,
 * 3D Visualization, Geospatial, Advanced Animation,
 * Data Streaming, WebRTC Advanced
 */

import { Capsule } from '@/types/capsule'

const extendedCapsulesBatch26: Capsule[] = [
  // ==========================================
  // REAL-TIME COLLABORATION (3 capsules)
  // ==========================================
  {
    id: 'collaborative-whiteboard',
    name: 'Collaborative Whiteboard',
    category: 'Real-time Collaboration',
    description: 'Multi-user whiteboard with real-time drawing, shapes, and cursor tracking for remote collaboration',
    tags: ['whiteboard', 'collaboration', 'drawing', 'real-time', 'multi-user'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState, useRef, useEffect } from 'react'
import { Pen, Square, Circle, Trash2, Users, Download } from 'lucide-react'

interface User {
  id: string
  name: string
  color: string
  cursor: { x: number; y: number }
}

interface DrawingElement {
  id: string
  type: 'line' | 'rect' | 'circle'
  points: { x: number; y: number }[]
  color: string
  userId: string
}

export default function CollaborativeWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pen' | 'rect' | 'circle'>('pen')
  const [color, setColor] = useState('#2563eb')
  const [isDrawing, setIsDrawing] = useState(false)
  const [elements, setElements] = useState<DrawingElement[]>([])
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'You', color: '#2563eb', cursor: { x: 0, y: 0 } },
    { id: '2', name: 'Alice', color: '#dc2626', cursor: { x: 150, y: 150 } },
    { id: '3', name: 'Bob', color: '#16a34a', cursor: { x: 300, y: 200 } }
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw all elements
    elements.forEach(element => {
      ctx.strokeStyle = element.color
      ctx.lineWidth = 2
      ctx.lineCap = 'round'

      if (element.type === 'line') {
        ctx.beginPath()
        element.points.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y)
          else ctx.lineTo(point.x, point.y)
        })
        ctx.stroke()
      } else if (element.type === 'rect' && element.points.length >= 2) {
        const start = element.points[0]
        const end = element.points[element.points.length - 1]
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y)
      } else if (element.type === 'circle' && element.points.length >= 2) {
        const start = element.points[0]
        const end = element.points[element.points.length - 1]
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
        ctx.beginPath()
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI)
        ctx.stroke()
      }
    })

    // Draw user cursors
    users.forEach(user => {
      if (user.id === '1') return // Don't draw own cursor
      ctx.fillStyle = user.color
      ctx.beginPath()
      ctx.arc(user.cursor.x, user.cursor.y, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = '#000'
      ctx.font = '12px sans-serif'
      ctx.fillText(user.name, user.cursor.x + 12, user.cursor.y + 5)
    })
  }, [elements, users])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: tool === 'pen' ? 'line' : tool,
      points: [{ x, y }],
      color,
      userId: '1'
    }
    setElements([...elements, newElement])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update own cursor
    setUsers(users.map(u => u.id === '1' ? { ...u, cursor: { x, y } } : u))

    if (!isDrawing || elements.length === 0) return

    const lastElement = elements[elements.length - 1]
    setElements([
      ...elements.slice(0, -1),
      { ...lastElement, points: [...lastElement.points, { x, y }] }
    ])
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#f59e0b', '#000000']

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Collaborative Whiteboard</h2>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium">{users.length} online</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <button
          onClick={() => setTool('pen')}
          className={\`p-2 rounded \${tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-white border'}\`}
          title="Pen"
        >
          <Pen className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTool('rect')}
          className={\`p-2 rounded \${tool === 'rect' ? 'bg-blue-600 text-white' : 'bg-white border'}\`}
          title="Rectangle"
        >
          <Square className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTool('circle')}
          className={\`p-2 rounded \${tool === 'circle' ? 'bg-blue-600 text-white' : 'bg-white border'}\`}
          title="Circle"
        >
          <Circle className="w-5 h-5" />
        </button>

        <div className="w-px bg-gray-300 mx-2" />

        {colors.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={\`w-8 h-8 rounded border-2 \${color === c ? 'border-blue-600' : 'border-gray-300'}\`}
            style={{ backgroundColor: c }}
          />
        ))}

        <div className="flex-1" />

        <button
          onClick={() => setElements([])}
          className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
          title="Clear"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border-2 border-gray-300 rounded cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Active users */}
      <div className="mt-4 flex gap-2">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}`
  },

  {
    id: 'live-code-editor',
    name: 'Live Code Editor',
    category: 'Real-time Collaboration',
    description: 'Collaborative code editor with syntax highlighting, real-time updates, and cursor presence',
    tags: ['code-editor', 'collaboration', 'real-time', 'syntax', 'programming'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Users, Copy, Download } from 'lucide-react'

interface Cursor {
  userId: string
  userName: string
  color: string
  line: number
  column: number
}

export default function LiveCodeEditor() {
  const [code, setCode] = useState(\`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
\`)
  const [cursors, setCursors] = useState<Cursor[]>([
    { userId: '2', userName: 'Alice', color: '#dc2626', line: 2, column: 15 },
    { userId: '3', userName: 'Bob', color: '#16a34a', line: 5, column: 8 }
  ])
  const [output, setOutput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const runCode = () => {
    try {
      const logs: string[] = []
      const customConsole = {
        log: (...args: any[]) => logs.push(args.join(' '))
      }
      // eslint-disable-next-line no-eval
      const func = new Function('console', code)
      func(customConsole)
      setOutput(logs.join('\\n') || 'Code executed successfully (no output)')
    } catch (error) {
      setOutput(\`Error: \${error instanceof Error ? error.message : String(error)}\`)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Live Code Editor</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">{cursors.length + 1} editing</span>
          </div>
          <button
            onClick={runCode}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
      </div>

      {/* Active cursors */}
      <div className="flex gap-2 mb-3">
        {cursors.map(cursor => (
          <div key={cursor.userId} className="flex items-center gap-2 px-2 py-1 rounded text-xs" style={{ backgroundColor: cursor.color + '20', color: cursor.color }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cursor.color }} />
            <span className="font-medium">{cursor.userName}</span>
            <span className="text-gray-600">Ln {cursor.line}, Col {cursor.column}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Editor */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm border-2 border-gray-300 rounded bg-gray-900 text-green-400 resize-none focus:outline-none focus:border-blue-500"
            spellCheck={false}
          />
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
            JavaScript
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Output</h3>
            <button
              onClick={() => setOutput('')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
          <pre className="w-full h-96 p-4 font-mono text-sm border-2 border-gray-300 rounded bg-gray-50 overflow-auto">
            {output || 'Run code to see output...'}
          </pre>
        </div>
      </div>
    </div>
  )
}`
  },

  {
    id: 'shared-document-editor',
    name: 'Shared Document Editor',
    category: 'Real-time Collaboration',
    description: 'Google Docs-style collaborative document editor with presence indicators and live updates',
    tags: ['document', 'editor', 'collaboration', 'rich-text', 'real-time'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState } from 'react'
import { Bold, Italic, Underline, Users, MessageSquare } from 'lucide-react'

interface User {
  id: string
  name: string
  color: string
  avatar: string
  isEditing: boolean
}

export default function SharedDocumentEditor() {
  const [content, setContent] = useState(\`Welcome to Shared Document Editor

This is a collaborative document where multiple users can edit simultaneously. Changes are synchronized in real-time across all users.

Features:
• Real-time collaboration
• User presence indicators
• Rich text formatting
• Comment threads
• Version history\`)

  const [users] = useState<User[]>([
    { id: '1', name: 'You', color: '#2563eb', avatar: '👤', isEditing: true },
    { id: '2', name: 'Alice', color: '#dc2626', avatar: '👩', isEditing: true },
    { id: '3', name: 'Bob', color: '#16a34a', avatar: '👨', isEditing: false },
    { id: '4', name: 'Carol', color: '#9333ea', avatar: '👧', isEditing: true }
  ])

  const [showComments, setShowComments] = useState(false)

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Shared Document Editor</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="px-3 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Comments
          </button>
          <div className="flex items-center -space-x-2">
            {users.map(user => (
              <div
                key={user.id}
                className={\`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-sm \${user.isEditing ? 'ring-2' : ''}\`}
                style={{
                  backgroundColor: user.color,
                  ringColor: user.color
                }}
                title={\`\${user.name}\${user.isEditing ? ' (editing)' : ''}\`}
              >
                {user.avatar}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {users.filter(u => u.isEditing).length} editing
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4 p-2 border-b">
        <button className="p-2 hover:bg-gray-100 rounded" title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded" title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded" title="Underline">
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px bg-gray-300 mx-2" />
        <select className="px-2 py-1 border rounded text-sm">
          <option>Normal text</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
        </select>
        <select className="px-2 py-1 border rounded text-sm">
          <option>Sans-serif</option>
          <option>Serif</option>
          <option>Monospace</option>
        </select>
      </div>

      <div className="flex gap-4">
        {/* Editor */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-6 border-2 border-gray-300 rounded resize-none focus:outline-none focus:border-blue-500"
            placeholder="Start typing..."
          />

          {/* Live cursor indicators */}
          <div className="mt-2 text-sm text-gray-600">
            {users.filter(u => u.isEditing && u.id !== '1').map(user => (
              <span key={user.id} className="inline-flex items-center gap-1 mr-3">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: user.color }} />
                <span>{user.name} is typing...</span>
              </span>
            ))}
          </div>
        </div>

        {/* Comments sidebar */}
        {showComments && (
          <div className="w-80 border-l pl-4">
            <h3 className="font-bold mb-3">Comments</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs">
                    👩
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Alice</div>
                    <div className="text-xs text-gray-600">2 min ago</div>
                  </div>
                </div>
                <p className="text-sm">This looks great! Should we add more examples?</p>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs">
                    👧
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Carol</div>
                    <div className="text-xs text-gray-600">5 min ago</div>
                  </div>
                </div>
                <p className="text-sm">Can we review the features section?</p>
              </div>

              <div className="mt-4">
                <textarea
                  placeholder="Add a comment..."
                  className="w-full p-2 border rounded text-sm resize-none"
                  rows={3}
                />
                <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}`
  },

  // ==========================================
  // VOICE INTERFACES (2 capsules)
  // ==========================================
  {
    id: 'voice-command-interface',
    name: 'Voice Command Interface',
    category: 'Voice Interfaces',
    description: 'Voice-activated command system with speech recognition, audio visualization, and command history',
    tags: ['voice', 'speech', 'recognition', 'audio', 'commands'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, Command } from 'lucide-react'

interface VoiceCommand {
  id: string
  text: string
  timestamp: Date
  confidence: number
  executed: boolean
}

export default function VoiceCommandInterface() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [commands, setCommands] = useState<VoiceCommand[]>([])
  const [audioLevel, setAudioLevel] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Simulate audio levels when listening
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    } else {
      setAudioLevel(0)
    }
  }, [isListening])

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true)
      setTranscript('Listening...')

      // Simulate speech recognition
      setTimeout(() => {
        const mockCommands = [
          'Open dashboard',
          'Show analytics',
          'Create new project',
          'Search for documents',
          'Export data'
        ]
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)]
        setTranscript(randomCommand)

        const newCommand: VoiceCommand = {
          id: Date.now().toString(),
          text: randomCommand,
          timestamp: new Date(),
          confidence: 0.85 + Math.random() * 0.15,
          executed: true
        }
        setCommands([newCommand, ...commands])
        setIsListening(false)
      }, 2000)
    } else {
      setIsListening(false)
      setTranscript('')
    }
  }

  const availableCommands = [
    { command: 'open [page]', description: 'Navigate to a page' },
    { command: 'show [feature]', description: 'Display a feature' },
    { command: 'create [item]', description: 'Create new item' },
    { command: 'search [query]', description: 'Search for content' },
    { command: 'help', description: 'Show help menu' }
  ]

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold">Voice Command Interface</h2>
      </div>

      {/* Voice Input Area */}
      <div className="mb-6">
        <div className="relative">
          <div className={\`border-2 rounded-lg p-8 text-center transition-colors \${isListening ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}\`}>
            <button
              onClick={toggleListening}
              className={\`w-20 h-20 rounded-full flex items-center justify-center transition-all \${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}\`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>

            <p className="mt-4 text-lg font-medium">
              {transcript || 'Click to start voice command'}
            </p>

            {isListening && (
              <div className="mt-4 flex items-center justify-center gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-600 rounded-full transition-all"
                    style={{
                      height: \`\${Math.random() * audioLevel}%\`,
                      minHeight: '4px',
                      maxHeight: '40px'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Command History */}
        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Command className="w-5 h-5" />
            Recent Commands
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {commands.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No commands yet. Start speaking!
              </p>
            ) : (
              commands.map(cmd => (
                <div key={cmd.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium">{cmd.text}</span>
                    <span className={\`px-2 py-0.5 rounded text-xs \${cmd.executed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}\`}>
                      {cmd.executed ? 'Executed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{cmd.timestamp.toLocaleTimeString()}</span>
                    <span>Confidence: {(cmd.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Commands */}
        <div>
          <h3 className="font-bold mb-3">Available Commands</h3>
          <div className="space-y-2">
            {availableCommands.map((cmd, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-mono text-sm font-bold text-blue-600 mb-1">
                  {cmd.command}
                </div>
                <div className="text-sm text-gray-600">{cmd.description}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Speak clearly and wait for the beep before giving your command.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}`
  },

  {
    id: 'audio-transcription-widget',
    name: 'Audio Transcription Widget',
    category: 'Voice Interfaces',
    description: 'Real-time audio transcription with speaker identification, timestamps, and export capabilities',
    tags: ['transcription', 'audio', 'speech-to-text', 'subtitles', 'captions'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState } from 'react'
import { Mic, Pause, Download, User, Clock } from 'lucide-react'

interface TranscriptSegment {
  id: string
  speaker: string
  text: string
  timestamp: string
  confidence: number
}

export default function AudioTranscriptionWidget() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([
    {
      id: '1',
      speaker: 'Speaker 1',
      text: 'Welcome to today\\'s meeting. Let\\'s start by reviewing our progress from last week.',
      timestamp: '00:00:05',
      confidence: 0.95
    },
    {
      id: '2',
      speaker: 'Speaker 2',
      text: 'Thanks for having me. I\\'ve completed the implementation of the new feature and it\\'s ready for review.',
      timestamp: '00:00:15',
      confidence: 0.92
    },
    {
      id: '3',
      speaker: 'Speaker 1',
      text: 'That\\'s great to hear! Can you walk us through the main changes?',
      timestamp: '00:00:25',
      confidence: 0.97
    }
  ])

  const [currentText, setCurrentText] = useState('')

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setCurrentText('Listening...')

      // Simulate transcription
      const interval = setInterval(() => {
        const words = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog']
        setCurrentText(prev => {
          const newWord = words[Math.floor(Math.random() * words.length)]
          return \`\${prev} \${newWord}\`.trim().split(' ').slice(-10).join(' ')
        })
      }, 500)

      setTimeout(() => {
        clearInterval(interval)
        const newSegment: TranscriptSegment = {
          id: Date.now().toString(),
          speaker: \`Speaker \${Math.floor(Math.random() * 3) + 1}\`,
          text: currentText,
          timestamp: new Date().toLocaleTimeString(),
          confidence: 0.85 + Math.random() * 0.15
        }
        setTranscript([...transcript, newSegment])
        setCurrentText('')
        setIsRecording(false)
      }, 5000)
    } else {
      setIsRecording(false)
      setCurrentText('')
    }
  }

  const exportTranscript = () => {
    const text = transcript.map(seg =>
      \`[\${seg.timestamp}] \${seg.speaker}: \${seg.text}\`
    ).join('\\n\\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcript.txt'
    a.click()
  }

  const getSpeakerColor = (speaker: string) => {
    const colors: Record<string, string> = {
      'Speaker 1': 'bg-blue-100 text-blue-700',
      'Speaker 2': 'bg-purple-100 text-purple-700',
      'Speaker 3': 'bg-green-100 text-green-700'
    }
    return colors[speaker] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Audio Transcription</h2>
        <div className="flex gap-2">
          <button
            onClick={exportTranscript}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={toggleRecording}
            className={\`px-4 py-2 rounded flex items-center gap-2 \${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}\`}
          >
            {isRecording ? (
              <>
                <Pause className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Record
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live transcription */}
      {isRecording && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <span className="font-medium text-red-700">Recording...</span>
          </div>
          <p className="text-gray-700">{currentText}</p>
        </div>
      )}

      {/* Transcript */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {transcript.map(segment => (
          <div key={segment.id} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-start gap-3 mb-2">
              <span className={\`px-3 py-1 rounded text-sm font-medium \${getSpeakerColor(segment.speaker)}\`}>
                <User className="w-3 h-3 inline mr-1" />
                {segment.speaker}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {segment.timestamp}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {(segment.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <p className="text-gray-800">{segment.text}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="text-2xl font-bold text-blue-600">{transcript.length}</div>
          <div className="text-sm text-gray-600">Segments</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">
            {new Set(transcript.map(t => t.speaker)).size}
          </div>
          <div className="text-sm text-gray-600">Speakers</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {transcript[transcript.length - 1]?.timestamp || '00:00:00'}
          </div>
          <div className="text-sm text-gray-600">Duration</div>
        </div>
      </div>
    </div>
  )
}`
  },

  // Continue with more categories...
  // Adding samples from other categories to demonstrate variety

  // ==========================================
  // 3D VISUALIZATION (2 capsules)
  // ==========================================
  {
    id: '3d-model-viewer',
    name: '3D Model Viewer',
    category: '3D Visualization',
    description: 'Interactive 3D model viewer with rotation, zoom, and lighting controls for web-based 3D content',
    tags: ['3d', 'model', 'viewer', 'webgl', 'interactive'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState } from 'react'
import { RotateCw, ZoomIn, ZoomOut, Sun, Grid3x3 } from 'lucide-react'

export default function Model3DViewer() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [lighting, setLighting] = useState(50)
  const [showGrid, setShowGrid] = useState(true)

  const rotateModel = (axis: 'x' | 'y', delta: number) => {
    setRotation(prev => ({
      ...prev,
      [axis]: (prev[axis] + delta) % 360
    }))
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">3D Model Viewer</h2>

      {/* Viewport */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg aspect-video mb-4 overflow-hidden">
        {/* Grid */}
        {showGrid && (
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        )}

        {/* 3D Model Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-2xl"
            style={{
              transform: \`perspective(1000px) rotateX(\${rotation.x}deg) rotateY(\${rotation.y}deg) scale(\${zoom})\`,
              transition: 'transform 0.3s'
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold opacity-50">
              3D
            </div>
          </div>
        </div>

        {/* Lighting indicator */}
        <div
          className="absolute top-4 right-4 w-16 h-16 rounded-full blur-xl"
          style={{
            background: \`radial-gradient(circle, rgba(255,255,255,\${lighting / 100}) 0%, transparent 70%)\`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Rotation</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm w-8">X:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation.x}
                onChange={(e) => setRotation(prev => ({ ...prev, x: Number(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{rotation.x}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-8">Y:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation.y}
                onChange={(e) => setRotation(prev => ({ ...prev, y: Number(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{rotation.y}°</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">View</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm flex items-center gap-1">
                <ZoomIn className="w-4 h-4" />
                Zoom:
              </span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{zoom.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm flex items-center gap-1">
                <Sun className="w-4 h-4" />
                Light:
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={lighting}
                onChange={(e) => setLighting(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{lighting}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setRotation({ x: 0, y: 0 })}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={\`px-4 py-2 rounded flex items-center gap-2 \${showGrid ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}\`}
        >
          <Grid3x3 className="w-4 h-4" />
          Grid
        </button>
      </div>
    </div>
  )
}`
  },

  // Additional capsules placeholder...
  // In production, this would include more capsules for:
  // - Geospatial/Maps (2 capsules)
  // - Advanced Animation (2 capsules)
  // - Data Streaming (2 capsules)
  // - WebRTC Advanced (1 capsule)

  {
    id: 'geolocation-map',
    name: 'Geolocation Map Viewer',
    category: 'Geospatial',
    description: 'Interactive map with geolocation, markers, and route visualization for location-based services',
    tags: ['map', 'geolocation', 'gps', 'markers', 'navigation'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState } from 'react'
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react'

interface Marker {
  id: string
  lat: number
  lng: number
  label: string
  color: string
}

export default function GeolocationMap() {
  const [markers, setMarkers] = useState<Marker[]>([
    { id: '1', lat: 40.7128, lng: -74.0060, label: 'New York', color: '#dc2626' },
    { id: '2', lat: 51.5074, lng: -0.1278, label: 'London', color: '#2563eb' },
    { id: '3', lat: 35.6762, lng: 139.6503, label: 'Tokyo', color: '#16a34a' }
  ])
  const [zoom, setZoom] = useState(2)
  const [center, setCenter] = useState({ lat: 40, lng: 0 })

  const addMarker = () => {
    const newMarker: Marker = {
      id: Date.now().toString(),
      lat: center.lat + (Math.random() - 0.5) * 20,
      lng: center.lng + (Math.random() - 0.5) * 20,
      label: \`Location \${markers.length + 1}\`,
      color: \`#\${Math.floor(Math.random()*16777215).toString(16)}\`
    }
    setMarkers([...markers, newMarker])
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Geolocation Map</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setZoom(Math.min(10, zoom + 1))}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(Math.max(1, zoom - 1))}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded">
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-96 overflow-hidden border-2 border-gray-300">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* Markers */}
        {markers.map(marker => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
            style={{
              left: \`\${50 + (marker.lng - center.lng) * (zoom * 2)}%\`,
              top: \`\${50 + (center.lat - marker.lat) * (zoom * 4)}%\`
            }}
          >
            <MapPin
              className="w-8 h-8 drop-shadow-lg transition-transform group-hover:scale-125"
              style={{ color: marker.color }}
              fill={marker.color}
            />
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {marker.label}
            </div>
          </div>
        ))}

        {/* Center indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-200 animate-pulse" />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Markers</h3>
          <button
            onClick={addMarker}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Add Marker
          </button>
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {markers.map(marker => (
              <div key={marker.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: marker.color }} />
                <span className="flex-1">{marker.label}</span>
                <span className="text-xs text-gray-500">
                  {marker.lat.toFixed(2)}, {marker.lng.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Navigation</h3>
          <div className="space-y-2">
            <div>
              <label className="text-sm">Zoom Level: {zoom}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" />
              Get Current Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}`
  },

  {
    id: 'particle-animation-canvas',
    name: 'Particle Animation Canvas',
    category: 'Advanced Animation',
    description: 'Dynamic particle system with physics, interactions, and customizable effects for stunning visualizations',
    tags: ['particles', 'animation', 'canvas', 'physics', 'effects'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

export default function ParticleAnimationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [particleCount, setParticleCount] = useState(100)
  const [speed, setSpeed] = useState(1)
  const [particles, setParticles] = useState<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    // Initialize particles
    const newParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: \`hsl(\${Math.random() * 360}, 70%, 60%)\`
      })
    }
    setParticles(newParticles)
  }, [particleCount])

  useEffect(() => {
    if (!isPlaying) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx * speed
        particle.y += particle.vy * speed

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Draw connections
        particles.forEach(other => {
          const dx = other.x - particle.x
          const dy = other.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = \`rgba(255, 255, 255, \${1 - distance / 100})\`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, particles, speed])

  const reset = () => {
    setParticles([])
    setTimeout(() => {
      const newParticles: Particle[] = []
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * 800,
          y: Math.random() * 400,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          color: \`hsl(\${Math.random() * 360}, 70%, 60%)\`
        })
      }
      setParticles(newParticles)
    }, 0)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold">Particle Animation</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={\`px-4 py-2 rounded text-white flex items-center gap-2 \${isPlaying ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}\`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full border-2 border-gray-300 rounded bg-black"
      />

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Particle Count: {particleCount}
          </label>
          <input
            type="range"
            min="10"
            max="200"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Speed: {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}`
  },

  {
    id: 'real-time-data-stream',
    name: 'Real-time Data Stream Visualizer',
    category: 'Data Streaming',
    description: 'Live data stream visualization with WebSocket support, buffering, and real-time chart updates',
    tags: ['data-stream', 'real-time', 'websocket', 'chart', 'live'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState, useEffect, useRef } from 'react'
import { Activity, Pause, Play, TrendingUp } from 'lucide-react'

interface DataPoint {
  timestamp: number
  value: number
}

export default function RealTimeDataStream() {
  const [isStreaming, setIsStreaming] = useState(true)
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0, current: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      const newPoint: DataPoint = {
        timestamp: Date.now(),
        value: Math.random() * 100
      }

      setDataPoints(prev => {
        const updated = [...prev, newPoint].slice(-50) // Keep last 50 points

        // Calculate stats
        const values = updated.map(p => p.value)
        setStats({
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          current: newPoint.value
        })

        return updated
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isStreaming])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dataPoints.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw data
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()

    dataPoints.forEach((point, index) => {
      const x = (index / 49) * canvas.width
      const y = canvas.height - (point.value / 100) * canvas.height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw fill
    ctx.lineTo(canvas.width, canvas.height)
    ctx.lineTo(0, canvas.height)
    ctx.closePath()
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
    ctx.fill()
  }, [dataPoints])

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold">Real-time Data Stream</h2>
        </div>
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={\`px-4 py-2 rounded text-white flex items-center gap-2 \${isStreaming ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}\`}
        >
          {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isStreaming ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Current</div>
          <div className="text-2xl font-bold text-blue-700">{stats.current.toFixed(1)}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Average</div>
          <div className="text-2xl font-bold text-green-700">{stats.avg.toFixed(1)}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-600 mb-1">Min</div>
          <div className="text-2xl font-bold text-purple-700">{stats.min.toFixed(1)}</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="text-sm text-orange-600 mb-1">Max</div>
          <div className="text-2xl font-bold text-orange-700">{stats.max.toFixed(1)}</div>
        </div>
      </div>

      {/* Chart */}
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full border-2 border-gray-300 rounded"
      />

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          {isStreaming && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live streaming</span>
            </>
          )}
        </div>
        <div>
          {dataPoints.length} data points
        </div>
      </div>
    </div>
  )
}`
  },

  {
    id: 'video-conference-layout',
    name: 'Video Conference Layout',
    category: 'WebRTC',
    description: 'Multi-participant video conference layout with grid, spotlight, and sidebar views for WebRTC applications',
    tags: ['video', 'conference', 'webrtc', 'call', 'layout'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState } from 'react'
import { Video, VideoOff, Mic, MicOff, Grid3x3, User, Users } from 'lucide-react'

interface Participant {
  id: string
  name: string
  isVideoOn: boolean
  isAudioOn: boolean
  isSpeaking: boolean
  avatar: string
}

export default function VideoConferenceLayout() {
  const [layout, setLayout] = useState<'grid' | 'spotlight' | 'sidebar'>('grid')
  const [participants] = useState<Participant[]>([
    { id: '1', name: 'You', isVideoOn: true, isAudioOn: true, isSpeaking: false, avatar: '👤' },
    { id: '2', name: 'Alice', isVideoOn: true, isAudioOn: true, isSpeaking: true, avatar: '👩' },
    { id: '3', name: 'Bob', isVideoOn: false, isAudioOn: true, isSpeaking: false, avatar: '👨' },
    { id: '4', name: 'Carol', isVideoOn: true, isAudioOn: false, isSpeaking: false, avatar: '👧' },
    { id: '5', name: 'Dave', isVideoOn: true, isAudioOn: true, isSpeaking: false, avatar: '👦' },
    { id: '6', name: 'Eve', isVideoOn: true, isAudioOn: true, isSpeaking: false, avatar: '👩' }
  ])

  const ParticipantVideo = ({ participant, size = 'default' }: { participant: Participant; size?: 'small' | 'default' | 'large' }) => {
    const sizeClasses = {
      small: 'h-24',
      default: 'h-48',
      large: 'h-96'
    }

    return (
      <div className={\`relative rounded-lg overflow-hidden bg-gray-900 \${sizeClasses[size]} \${participant.isSpeaking ? 'ring-4 ring-green-500' : ''}\`}>
        {participant.isVideoOn ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <span className="text-6xl">{participant.avatar}</span>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <VideoOff className="w-12 h-12 text-gray-500" />
          </div>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="px-2 py-1 bg-black/60 text-white text-sm rounded">
            {participant.name}
          </span>
          <div className="flex gap-1">
            {!participant.isAudioOn && (
              <div className="p-1 bg-red-600 rounded">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold">Video Conference</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout('grid')}
            className={\`px-3 py-2 rounded flex items-center gap-2 \${layout === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100'}\`}
          >
            <Grid3x3 className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setLayout('spotlight')}
            className={\`px-3 py-2 rounded flex items-center gap-2 \${layout === 'spotlight' ? 'bg-blue-600 text-white' : 'bg-gray-100'}\`}
          >
            <User className="w-4 h-4" />
            Spotlight
          </button>
          <button
            onClick={() => setLayout('sidebar')}
            className={\`px-3 py-2 rounded flex items-center gap-2 \${layout === 'sidebar' ? 'bg-blue-600 text-white' : 'bg-gray-100'}\`}
          >
            <Users className="w-4 h-4" />
            Sidebar
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="bg-gray-900 rounded-lg p-4 min-h-[500px]">
        {layout === 'grid' && (
          <div className="grid grid-cols-3 gap-4">
            {participants.map(p => (
              <ParticipantVideo key={p.id} participant={p} />
            ))}
          </div>
        )}

        {layout === 'spotlight' && (
          <div className="space-y-4">
            <ParticipantVideo participant={participants.find(p => p.isSpeaking) || participants[0]} size="large" />
            <div className="grid grid-cols-5 gap-2">
              {participants.filter(p => !p.isSpeaking).map(p => (
                <ParticipantVideo key={p.id} participant={p} size="small" />
              ))}
            </div>
          </div>
        )}

        {layout === 'sidebar' && (
          <div className="flex gap-4">
            <div className="flex-1">
              <ParticipantVideo participant={participants.find(p => p.isSpeaking) || participants[0]} size="large" />
            </div>
            <div className="w-48 space-y-2">
              {participants.filter(p => !p.isSpeaking).map(p => (
                <ParticipantVideo key={p.id} participant={p} size="small" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button className="p-4 bg-gray-700 text-white rounded-full hover:bg-gray-600">
          <Mic className="w-6 h-6" />
        </button>
        <button className="p-4 bg-gray-700 text-white rounded-full hover:bg-gray-600">
          <Video className="w-6 h-6" />
        </button>
        <button className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700">
          <span className="text-lg font-bold">End</span>
        </button>
      </div>
    </div>
  )
}`
  },

  {
    id: 'ar-product-viewer',
    name: 'AR Product Viewer',
    category: '3D Visualization',
    description: 'Augmented reality product viewer with 360° rotation, zoom, and interactive annotations',
    tags: ['ar', '3d', 'product', 'viewer', 'augmented-reality'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState } from 'react'
import { RotateCcw, Maximize2, Info, Camera } from 'lucide-react'

interface Annotation {
  id: string
  x: number
  y: number
  title: string
  description: string
}

export default function ARProductViewer() {
  const [rotation, setRotation] = useState(0)
  const [annotations] = useState<Annotation[]>([
    { id: '1', x: 30, y: 40, title: 'Premium Material', description: 'High-quality stainless steel finish' },
    { id: '2', x: 70, y: 60, title: 'LED Display', description: 'Full-color OLED screen' },
    { id: '3', x: 50, y: 20, title: 'Smart Sensor', description: 'AI-powered motion detection' }
  ])
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">AR Product Viewer</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            View in AR
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg aspect-square mb-4 overflow-hidden">
        {/* Product */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-96 h-96 transition-transform duration-300"
            style={{
              transform: \`rotateY(\${rotation}deg) scale(\${zoom})\`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Product placeholder - in production this would be a 3D model */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl shadow-2xl">
              <div className="absolute inset-4 border-4 border-white/30 rounded-xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-4xl font-bold">PRO</span>
                </div>
              </div>
            </div>

            {/* Annotations */}
            {annotations.map(annotation => (
              <button
                key={annotation.id}
                onClick={() => setActiveAnnotation(activeAnnotation === annotation.id ? null : annotation.id)}
                className="absolute w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                style={{
                  left: \`\${annotation.x}%\`,
                  top: \`\${annotation.y}%\`,
                  transform: 'translateZ(50px)'
                }}
              >
                <Info className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Annotation details */}
        {activeAnnotation && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4">
            {annotations.filter(a => a.id === activeAnnotation).map(annotation => (
              <div key={annotation.id}>
                <h3 className="font-bold text-lg mb-2">{annotation.title}</h3>
                <p className="text-gray-600">{annotation.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Rotation</h3>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setRotation((rotation - 45) % 360)}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              ← 45°
            </button>
            <button
              onClick={() => setRotation(0)}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={() => setRotation((rotation + 45) % 360)}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              45° →
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            Zoom: {zoom.toFixed(1)}x
          </h3>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Click the info pins to learn more about product features
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}`
  },

  {
    id: 'weather-map-visualization',
    name: 'Weather Map Visualization',
    category: 'Geospatial',
    description: 'Interactive weather map with real-time data, temperature layers, and forecast visualization',
    tags: ['weather', 'map', 'climate', 'forecast', 'geospatial'],
    version: '1.0.0',
    author: 'HubLab',
    code: `'use client'

import { useState } from 'react'
import { Cloud, CloudRain, Sun, Wind, Thermometer, MapPin } from 'lucide-react'

interface WeatherData {
  id: string
  city: string
  lat: number
  lng: number
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  humidity: number
  windSpeed: number
}

export default function WeatherMapVisualization() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [layer, setLayer] = useState<'temperature' | 'precipitation' | 'wind'>('temperature')
  const [weatherData] = useState<WeatherData[]>([
    { id: '1', city: 'New York', lat: 40.7128, lng: -74.0060, temp: 22, condition: 'cloudy', humidity: 65, windSpeed: 15 },
    { id: '2', city: 'London', lat: 51.5074, lng: -0.1278, temp: 18, condition: 'rainy', humidity: 80, windSpeed: 20 },
    { id: '3', city: 'Tokyo', lat: 35.6762, lng: 139.6503, temp: 28, condition: 'sunny', humidity: 55, windSpeed: 10 },
    { id: '4', city: 'Sydney', lat: -33.8688, lng: 151.2093, temp: 25, condition: 'sunny', humidity: 60, windSpeed: 12 },
    { id: '5', city: 'Paris', lat: 48.8566, lng: 2.3522, temp: 20, condition: 'cloudy', humidity: 70, windSpeed: 18 }
  ])

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-500" />
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />
      case 'windy':
        return <Wind className="w-6 h-6 text-cyan-500" />
      default:
        return <Sun className="w-6 h-6" />
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 10) return '#3b82f6'
    if (temp < 20) return '#10b981'
    if (temp < 25) return '#f59e0b'
    return '#ef4444'
  }

  const selectedCityData = weatherData.find(w => w.id === selectedCity)

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Weather Map</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLayer('temperature')}
            className={\`px-3 py-2 rounded text-sm flex items-center gap-2 \${layer === 'temperature' ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' : 'bg-gray-100'}\`}
          >
            <Thermometer className="w-4 h-4" />
            Temperature
          </button>
          <button
            onClick={() => setLayer('precipitation')}
            className={\`px-3 py-2 rounded text-sm flex items-center gap-2 \${layer === 'precipitation' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-gray-100'}\`}
          >
            <CloudRain className="w-4 h-4" />
            Precipitation
          </button>
          <button
            onClick={() => setLayer('wind')}
            className={\`px-3 py-2 rounded text-sm flex items-center gap-2 \${layer === 'wind' ? 'bg-cyan-100 text-cyan-700 border-2 border-cyan-300' : 'bg-gray-100'}\`}
          >
            <Wind className="w-4 h-4" />
            Wind
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 overflow-hidden border-2 border-gray-300">
        {/* Temperature layer overlay */}
        {layer === 'temperature' && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-yellow-200/30 to-red-200/30" />
        )}
        {layer === 'precipitation' && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 via-blue-400/30 to-blue-500/20" />
        )}
        {layer === 'wind' && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 via-transparent to-cyan-200/20 animate-pulse" />
        )}

        {/* Grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* Weather markers */}
        {weatherData.map(data => (
          <button
            key={data.id}
            onClick={() => setSelectedCity(selectedCity === data.id ? null : data.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: \`\${50 + (data.lng / 180) * 40}%\`,
              top: \`\${50 - (data.lat / 90) * 40}%\`
            }}
          >
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform"
                style={{ backgroundColor: getTemperatureColor(data.temp) }}
              >
                <span className="text-white font-bold text-sm">{data.temp}°</span>
              </div>
              <div className="absolute -top-1 -right-1">
                {getConditionIcon(data.condition)}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {data.city}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Weather details */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {selectedCityData ? selectedCityData.city : 'Select a city'}
          </h3>
          {selectedCityData ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temperature</span>
                <span className="font-bold">{selectedCityData.temp}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Humidity</span>
                <span className="font-bold">{selectedCityData.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Wind Speed</span>
                <span className="font-bold">{selectedCityData.windSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Condition</span>
                <span className="flex items-center gap-1">
                  {getConditionIcon(selectedCityData.condition)}
                  <span className="font-bold capitalize">{selectedCityData.condition}</span>
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Click on a city marker to view weather details</p>
          )}
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <h3 className="font-bold mb-3">7-Day Forecast</h3>
          <div className="space-y-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={day} className="flex items-center justify-between text-sm">
                <span className="font-medium">{day}</span>
                <div className="flex items-center gap-2">
                  {getConditionIcon(idx % 2 === 0 ? 'sunny' : 'cloudy')}
                  <span className="font-bold">
                    {(selectedCityData?.temp || 20) + (Math.random() * 6 - 3).toFixed(0)}°C
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}`
  }
]

export default extendedCapsulesBatch26

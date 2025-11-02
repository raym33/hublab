'use client'

import React, { useState } from 'react'
import {
  LiveLineChart,
  LiveCountdown,
  LiveTypingEffect,
  LivePasswordStrength,
  LiveTagsInput,
  LiveProgressRing,
  LiveThemeToggle,
  LiveCopyToClipboard,
  LiveAutocomplete,
  LiveOTPInput,
  LiveBarChart,
  LivePieChart,
  LiveAreaChart,
  LiveColorPicker,
  LiveRangeSlider,
  LiveToggleSwitch,
  LiveRating,
  LiveImageFilter,
  LiveAudioVisualizer,
  LiveLoadingSpinner,
  LivePulseEffect,
  LiveSkeletonLoader,
  LiveToast,
  LiveModal,
  LiveAccordion,
  LiveTabs,
  LiveAIChat,
  LiveTextToSpeech,
  LiveSpeechToText,
  LiveQRCodeGenerator,
  LiveVideoRecorder,
  LivePhotoCapture
} from '@/components/LiveCapsulePreviews'

// Import sample data
const sampleChartData = [
  { x: 1, y: 30 },
  { x: 2, y: 45 },
  { x: 3, y: 38 },
  { x: 4, y: 52 },
  { x: 5, y: 48 },
  { x: 6, y: 65 },
  { x: 7, y: 58 }
]

const sampleBarData = [
  { label: 'Jan', value: 45 },
  { label: 'Feb', value: 52 },
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 65 },
  { label: 'May', value: 58 }
]

const samplePieData = [
  { label: 'Product A', value: 35, color: '#3B82F6' },
  { label: 'Product B', value: 25, color: '#10B981' },
  { label: 'Product C', value: 20, color: '#F59E0B' },
  { label: 'Product D', value: 20, color: '#EF4444' }
]

export default function DemosPage() {
  const [activeDemo, setActiveDemo] = useState<string>('overview')

  const demos = [
    { id: 'overview', name: '📊 Overview', icon: '🏠' },
    { id: 'charts', name: 'Charts', icon: '📈' },
    { id: 'forms', name: 'Forms', icon: '📝' },
    { id: 'media', name: 'Media', icon: '🎬' },
    { id: 'effects', name: 'Effects', icon: '✨' },
    { id: 'ai', name: 'AI/ML', icon: '🤖' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            🎨 Capsule Demos
          </h1>

          <nav className="space-y-2">
            {demos.map(demo => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                  activeDemo === demo.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{demo.icon}</span>
                {demo.name}
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>111 cápsulas</strong> disponibles para usar
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeDemo === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Interactive Capsule Demos</h2>
                <p className="text-gray-600">
                  Explore live examples of the most popular capsules. Click on any demo category to see them in action.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.filter(d => d.id !== 'overview').map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo.id)}
                    className="bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-blue-500 hover:shadow-lg transition"
                  >
                    <div className="text-5xl mb-4">{demo.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{demo.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Click to explore {demo.name.toLowerCase()} capsules
                    </p>
                  </button>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Build?</h3>
                <p className="mb-4">
                  Visit the compiler to create your own applications using these capsules.
                </p>
                <a
                  href="/compiler-v2"
                  className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Go to Compiler →
                </a>
              </div>
            </div>
          )}

          {activeDemo === 'charts' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Chart Demos</h2>
                <p className="text-gray-600 mb-6">
                  Interactive data visualization capsules built with Canvas API
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📈 Line Chart</h3>
                  <div className="rounded-lg p-4">
                    <LiveLineChart />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Real-time Canvas-based line chart with grid, axes, and data points.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📊 Bar Chart</h3>
                  <div className="rounded-lg p-4">
                    <LiveBarChart />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Interactive bar chart with labels and values displayed.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🥧 Pie Chart</h3>
                  <div className="rounded-lg p-4">
                    <LivePieChart />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Pie chart with color-coded segments and legend.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📉 Area Chart</h3>
                  <div className="rounded-lg p-4">
                    <LiveAreaChart />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Area chart with gradient fill showing data trends.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">⭕ Progress Ring</h3>
                  <div className="flex items-center justify-center py-8">
                    <LiveProgressRing />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Animated circular progress indicator with percentage.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📋 Copy to Clipboard</h3>
                  <div className="p-4">
                    <LiveCopyToClipboard />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Click to copy using Clipboard API with success feedback.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'forms' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Form Demos</h2>
                <p className="text-gray-600 mb-6">
                  Advanced form components with validation
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🔐 Password Strength</h3>
                  <div className="p-4">
                    <LivePasswordStrength />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Real-time password validation with strength indicator.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🔍 Autocomplete</h3>
                  <div className="p-4">
                    <LiveAutocomplete />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Intelligent search with real-time filtering.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🔢 OTP Input</h3>
                  <div className="p-4">
                    <LiveOTPInput />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    6-digit OTP with auto-focus progression.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🏷️ Tags Input</h3>
                  <div className="p-4">
                    <LiveTagsInput />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Add/remove tags with keyboard shortcuts.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🎨 Color Picker</h3>
                  <div className="p-4">
                    <LiveColorPicker />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Interactive color selection with hex code.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🎚️ Range Slider</h3>
                  <div className="p-4">
                    <LiveRangeSlider />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Smooth slider with visual feedback.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🔘 Toggle Switch</h3>
                  <div className="p-4">
                    <LiveToggleSwitch />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Smooth toggle animation for on/off states.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">⭐ Rating</h3>
                  <div className="p-4">
                    <LiveRating />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Interactive star rating with hover effect.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'media' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Media Demos</h2>
                <p className="text-gray-600 mb-6">
                  Video, audio, and image processing capsules
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🎥 Video Recorder</h3>
                  <div className="p-4">
                    <LiveVideoRecorder />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Record video from webcam with real-time preview.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📸 Photo Capture</h3>
                  <div className="p-4">
                    <LivePhotoCapture />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Capture photos from your camera instantly.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🎨 Image Filter Editor</h3>
                  <div className="p-4">
                    <LiveImageFilter />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Real-time image filtering with brightness, contrast, and saturation controls.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🎵 Audio Visualizer</h3>
                  <div className="p-4">
                    <LiveAudioVisualizer />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Animated audio frequency bars with gradient colors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'effects' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Effects Demos</h2>
                <p className="text-gray-600 mb-6">
                  Animations and visual effects
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">⏳ Countdown Timer</h3>
                  <div className="p-4">
                    <LiveCountdown />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Real-time countdown with automatic updates.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">✍️ Typing Effect</h3>
                  <div className="p-4">
                    <LiveTypingEffect />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Animated typing with blinking cursor.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🌓 Theme Toggle</h3>
                  <div className="p-4 flex justify-center">
                    <LiveThemeToggle />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Smooth light/dark mode transition.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">⏰ Loading Spinner</h3>
                  <div className="p-4">
                    <LiveLoadingSpinner />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Smooth rotating spinner animation.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">💫 Pulse Effect</h3>
                  <div className="p-4">
                    <LivePulseEffect />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Pulsing circle with ripple animation.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">💀 Skeleton Loader</h3>
                  <div className="p-4">
                    <LiveSkeletonLoader />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Loading placeholder with pulse effect.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🍞 Toast Notification</h3>
                  <div className="p-4">
                    <LiveToast />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Success toast with auto-dismiss.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📱 Modal Dialog</h3>
                  <div className="p-4">
                    <LiveModal />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Overlay modal with backdrop.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">🗂️ Accordion</h3>
                  <div className="p-4">
                    <LiveAccordion />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Expandable sections with smooth animation.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📑 Tabs</h3>
                  <div className="p-4">
                    <LiveTabs />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Tabbed interface with active state.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'ai' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">AI/ML Demos</h2>
                <p className="text-gray-600 mb-6">
                  Artificial Intelligence and Machine Learning capsules
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">💬 AI Chat Interface</h3>
                  <div className="p-4">
                    <LiveAIChat />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Interactive chat with simulated AI responses and message history.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">🗣️ Text to Speech</h3>
                    <div className="p-4">
                      <LiveTextToSpeech />
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Convert text to speech using browser's Web Speech API.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">🎤 Speech to Text</h3>
                    <div className="p-4">
                      <LiveSpeechToText />
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Real-time speech recognition and transcription.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">📱 QR Code Generator</h3>
                    <div className="p-4">
                      <LiveQRCodeGenerator />
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Generate QR codes from text or URLs dynamically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { X, Code, Eye, Copy, Check } from 'lucide-react'
import { CapsuleDefinition } from '@/lib/capsules-v2/types'
import * as LivePreviews from './LiveCapsulePreviews'

interface CapsulePreviewModalProps {
  capsule: CapsuleDefinition | null
  isOpen: boolean
  onClose: () => void
  onAddToCanvas?: () => void
}

export default function CapsulePreviewModal({
  capsule,
  isOpen,
  onClose,
  onAddToCanvas
}: CapsulePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'props'>('preview')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !capsule) return null

  // Map capsule ID to live preview component
  const getPreviewComponent = () => {
    const componentMap: Record<string, keyof typeof LivePreviews> = {
      'line-chart': 'LiveLineChart',
      'bar-chart': 'LiveBarChart',
      'pie-chart': 'LivePieChart',
      'area-chart': 'LiveAreaChart',
      'button': 'LiveButton',
      'input': 'LiveInput',
      'card': 'LiveCard',
      'modal': 'LiveModal',
      'list': 'LiveList',
      'form': 'LiveForm',
      'data-table': 'LiveDataTable',
      'dropdown': 'LiveDropdownMenu',
      'checkbox': 'LiveCheckbox',
      'radio': 'LiveRadioGroup',
      'switch': 'LiveSwitch',
      'slider': 'LiveSlider',
      'select': 'LiveSelect',
      'toast': 'LiveToast',
      'tabs': 'LiveTabs',
      'accordion': 'LiveAccordion',
      'tooltip': 'LiveTooltip',
      'badge': 'LiveBadge',
      'avatar': 'LiveAvatar',
      'progress-bar': 'LiveProgressBar',
      'loading-spinner': 'LiveLoadingSpinner',
      'alert': 'LiveAlert',
      'countdown': 'LiveCountdown',
      'typing-effect': 'LiveTypingEffect',
      'password-strength': 'LivePasswordStrength',
      'tags-input': 'LiveTagsInput',
      'progress-ring': 'LiveProgressRing',
      'theme-toggle': 'LiveThemeToggle',
      'copy-to-clipboard': 'LiveCopyToClipboard',
      'autocomplete': 'LiveAutocomplete',
      'otp-input': 'LiveOTPInput',
      'color-picker': 'LiveColorPicker',
      'range-slider': 'LiveRangeSlider',
      'toggle-switch': 'LiveToggleSwitch',
      'rating': 'LiveRating',
      'image-filter': 'LiveImageFilter',
      'audio-visualizer': 'LiveAudioVisualizer',
      'pulse-effect': 'LivePulseEffect',
      'skeleton-loader': 'LiveSkeletonLoader',
      'ai-chat': 'LiveAIChat',
      'text-to-speech': 'LiveTextToSpeech',
      'speech-to-text': 'LiveSpeechToText',
      'qr-code': 'LiveQRCodeGenerator',
      'video-recorder': 'LiveVideoRecorder',
      'photo-capture': 'LivePhotoCapture',
      'drag-drop': 'LiveDragDrop',
      'particle-background': 'LiveParticleBackground',
      'scroll-progress': 'LiveScrollProgressBar',
      'lazy-image': 'LiveLazyLoadingImage',
      'print-button': 'LivePrintButton',
      'fullscreen-toggle': 'LiveFullscreenToggle',
      'loading-overlay': 'LiveLoadingOverlay',
      'date-range-picker': 'LiveDateRangePicker'
    }

    const componentName = componentMap[capsule.id]
    if (!componentName) return null

    const Component = LivePreviews[componentName] as React.ComponentType
    return Component ? <Component /> : null
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(capsule.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const PreviewComponent = getPreviewComponent()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{capsule.name}</h2>
              <p className="text-blue-100 mb-3">{capsule.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {capsule.category}
                </span>
                {capsule.props && capsule.props.length > 0 && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {capsule.props.length} props
                  </span>
                )}
                {capsule.dependencies && capsule.dependencies.length > 0 && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {capsule.dependencies.length} dependencies
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'code'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-4 h-4" />
              Code
            </button>
            <button
              onClick={() => setActiveTab('props')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'props'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Props ({capsule.props?.length || 0})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {PreviewComponent ? (
                <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  {PreviewComponent}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No preview available</p>
                    <p className="text-sm mt-2">
                      This capsule doesn't have a live preview yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Component Code</h3>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm font-medium">Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                <code className="text-sm">{capsule.code}</code>
              </pre>
            </div>
          )}

          {activeTab === 'props' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Component Props</h3>
              {capsule.props && capsule.props.length > 0 ? (
                <div className="space-y-3">
                  {capsule.props.map((prop, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono font-semibold text-blue-600">
                            {prop.name}
                          </code>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {prop.type}
                          </span>
                          {prop.required && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded font-medium">
                              required
                            </span>
                          )}
                        </div>
                      </div>
                      {prop.description && (
                        <p className="text-sm text-gray-600 mb-2">{prop.description}</p>
                      )}
                      {prop.default !== undefined && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Default: </span>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {JSON.stringify(prop.default)}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>This component has no configurable props.</p>
                </div>
              )}

              {capsule.dependencies && capsule.dependencies.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Dependencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {capsule.dependencies.map((dep, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            {onAddToCanvas && (
              <button
                onClick={() => {
                  onAddToCanvas()
                  onClose()
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Add to Canvas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

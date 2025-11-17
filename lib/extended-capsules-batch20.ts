/**
 * Extended Capsules Batch 20 - Advanced AI/ML & Robotics (500 capsules)
 * Focus: Computer Vision, NLP, Deep Learning, Neural Networks, Robotics, AutoML
 */

import { Capsule } from '@/types/capsule'

const extendedCapsulesBatch20: Capsule[] = [
  // Computer Vision Components (50 capsules)
  {
    id: 'cv-object-detection',
    name: 'Object Detection Viewer',
    category: 'Computer Vision',
    description: 'Real-time object detection visualization with bounding boxes, confidence scores, and class labels',
    tags: ['cv', 'object-detection', 'ml', 'vision', 'yolo'],
    code: `'use client'
import { useState } from 'react'

export default function ObjectDetectionViewer() {
  const [detections, setDetections] = useState([
    { label: 'Person', confidence: 0.95, x: 100, y: 50, width: 150, height: 200 },
    { label: 'Car', confidence: 0.88, x: 300, y: 150, width: 200, height: 120 }
  ])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Object Detection</h1>

      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <img src="/api/placeholder/800/600" alt="Scene" className="w-full" />

        {detections.map((det, i) => (
          <div key={i}
            className="absolute border-4 border-green-500"
            style={{
              left: \`\${det.x}px\`,
              top: \`\${det.y}px\`,
              width: \`\${det.width}px\`,
              height: \`\${det.height}px\`
            }}>
            <div className="bg-green-500 text-white px-2 py-1 text-sm">
              {det.label} ({(det.confidence * 100).toFixed(0)}%)
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {detections.map((det, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{det.label}</h3>
            <p className="text-sm text-gray-600">Confidence: {(det.confidence * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}`,
    platform: 'react'
  },
  {
    id: 'cv-face-recognition',
    name: 'Face Recognition Dashboard',
    category: 'Computer Vision',
    description: 'Face detection and recognition interface with facial landmarks, emotion analysis, and identity matching',
    tags: ['cv', 'face-recognition', 'ml', 'biometric', 'vision'],
    code: `'use client'
import { useState } from 'react'

export default function FaceRecognitionDashboard() {
  const [faces, setFaces] = useState([
    { id: 1, name: 'John Doe', confidence: 0.94, emotion: 'Happy', age: 32 },
    { id: 2, name: 'Unknown', confidence: 0.45, emotion: 'Neutral', age: 28 }
  ])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Face Recognition</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-lg p-4 aspect-video flex items-center justify-center">
          <span className="text-gray-500">Camera Feed</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Detected Faces</h2>
          {faces.map(face => (
            <div key={face.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{face.name}</h3>
                  <p className="text-sm text-gray-600">Age: {face.age}</p>
                </div>
                <span className={\`px-3 py-1 rounded-full text-sm \${
                  face.confidence > 0.7 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }\`}>
                  {(face.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-2xl">{face.emotion === 'Happy' ? '😊' : '😐'}</span>
                <span className="text-sm text-gray-600">{face.emotion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },
  {
    id: 'nlp-sentiment-analyzer',
    name: 'Sentiment Analysis Dashboard',
    category: 'NLP',
    description: 'Natural language sentiment analysis with emotion detection, polarity scoring, and text visualization',
    tags: ['nlp', 'sentiment', 'ml', 'text-analysis', 'emotion'],
    code: `'use client'
import { useState } from 'react'

export default function SentimentAnalyzer() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)

  const analyzeSentiment = () => {
    // Simulate sentiment analysis
    const sentiment = text.toLowerCase().includes('good') || text.toLowerCase().includes('great') ? 'positive' :
                     text.toLowerCase().includes('bad') || text.toLowerCase().includes('terrible') ? 'negative' : 'neutral'
    const score = sentiment === 'positive' ? 0.85 : sentiment === 'negative' ? -0.75 : 0.1

    setAnalysis({
      sentiment,
      score,
      emotions: { joy: 0.7, sadness: 0.1, anger: 0.05, fear: 0.05, surprise: 0.1 }
    })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sentiment Analysis</h1>

      <textarea value={text} onChange={(e) => setText(e.target.value)}
        className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg mb-4"
        placeholder="Enter text to analyze..."></textarea>

      <button onClick={analyzeSentiment}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-6">
        Analyze Sentiment
      </button>

      {analysis && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold capitalize">{analysis.sentiment}</h2>
              <p className="text-gray-600">Score: {analysis.score.toFixed(2)}</p>
            </div>
            <div className={\`text-6xl \${
              analysis.sentiment === 'positive' ? '😊' :
              analysis.sentiment === 'negative' ? '😞' : '😐'
            }\`}></div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold mb-2">Emotion Breakdown</h3>
            {Object.entries(analysis.emotions).map(([emotion, value]: [string, any]) => (
              <div key={emotion}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{emotion}</span>
                  <span>{(value * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full"
                    style={{ width: \`\${value * 100}%\` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}`,
    platform: 'react'
  },
  {
    id: 'ml-model-training',
    name: 'Model Training Dashboard',
    category: 'Machine Learning',
    description: 'ML model training visualization with loss curves, accuracy metrics, and epoch progression monitoring',
    tags: ['ml', 'training', 'neural-network', 'deep-learning', 'monitoring'],
    code: `'use client'
import { useState, useEffect } from 'react'

export default function ModelTrainingDashboard() {
  const [epoch, setEpoch] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  const [metrics, setMetrics] = useState({
    loss: 2.5,
    accuracy: 0.45,
    valLoss: 2.7,
    valAccuracy: 0.42
  })

  useEffect(() => {
    if (isTraining && epoch < 100) {
      const timer = setTimeout(() => {
        setEpoch(e => e + 1)
        setMetrics({
          loss: 2.5 * Math.exp(-epoch / 30) + Math.random() * 0.1,
          accuracy: 0.95 * (1 - Math.exp(-epoch / 25)),
          valLoss: 2.7 * Math.exp(-epoch / 32) + Math.random() * 0.15,
          valAccuracy: 0.92 * (1 - Math.exp(-epoch / 27))
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isTraining, epoch])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Model Training</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Training Loss</h3>
          <div className="text-4xl font-bold text-blue-600">{metrics.loss.toFixed(4)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Training Accuracy</h3>
          <div className="text-4xl font-bold text-green-600">{(metrics.accuracy * 100).toFixed(2)}%</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Validation Loss</h3>
          <div className="text-4xl font-bold text-purple-600">{metrics.valLoss.toFixed(4)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Validation Accuracy</h3>
          <div className="text-4xl font-bold text-orange-600">{(metrics.valAccuracy * 100).toFixed(2)}%</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Epoch: {epoch}/100</h3>
          <button onClick={() => setIsTraining(!isTraining)}
            className={\`px-6 py-2 rounded-lg text-white \${
              isTraining ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }\`}>
            {isTraining ? 'Stop' : 'Start'} Training
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: \`\${epoch}%\` }}></div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },
  {
    id: 'robot-control-panel',
    name: 'Robot Control Dashboard',
    category: 'Robotics',
    description: 'Robotics control interface with joystick controls, sensor readings, and telemetry visualization',
    tags: ['robotics', 'control', 'iot', 'automation', 'telemetry'],
    code: `'use client'
import { useState } from 'react'

export default function RobotControlPanel() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [sensors, setSensors] = useState({
    battery: 85,
    temperature: 42,
    distance: 150,
    speed: 0.5
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Robot Control Panel</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Camera Feed</h2>
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
            <span className="text-gray-400">Live Camera Feed</span>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="relative w-48 h-48 bg-gray-200 rounded-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full cursor-pointer"
                  style={{ transform: \`translate(\${position.x}px, \${position.y}px)\` }}></div>
              </div>
            </div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">Joystick Control</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sensors</h2>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Battery</span>
              <span className="text-lg font-bold text-green-600">{sensors.battery}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full"
                style={{ width: \`\${sensors.battery}%\` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Temperature</span>
              <span className="text-lg font-bold">{sensors.temperature}°C</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Distance</span>
              <span className="text-lg font-bold">{sensors.distance}cm</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Speed</span>
              <span className="text-lg font-bold">{sensors.speed}m/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }
]

// Generate remaining capsules programmatically
const aiCategories = [
  { name: 'Computer Vision', count: 45, prefix: 'cv' },
  { name: 'NLP', count: 50, prefix: 'nlp' },
  { name: 'Deep Learning', count: 50, prefix: 'dl' },
  { name: 'Neural Networks', count: 50, prefix: 'nn' },
  { name: 'Machine Learning', count: 45, prefix: 'ml' },
  { name: 'Robotics', count: 45, prefix: 'robot' },
  { name: 'AutoML', count: 40, prefix: 'automl' },
  { name: 'AI/Speech', count: 40, prefix: 'speech' },
  { name: 'AI/Vision', count: 40, prefix: 'vision' },
  { name: 'AI/Text', count: 40, prefix: 'text' }
]

const aiTemplates = {
  dashboard: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\//g, '-')}-dashboard-${idx}`,
    name: `${cat} Dashboard ${idx}`,
    category: cat,
    description: `${cat} monitoring dashboard with real-time metrics, model performance tracking, and visualization of AI/ML operations`,
    tags: [cat.toLowerCase().replace(/\//g, '-'), 'ai', 'ml', 'dashboard', 'monitoring'],
    code: `'use client'
import { useState } from 'react'

export default function ${cat.replace(/[^a-zA-Z]/g, '')}Dashboard${idx}() {
  const [metrics, setMetrics] = useState({ accuracy: 0.92, precision: 0.89, recall: 0.94 })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${cat} Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Accuracy</h3>
          <p className="text-4xl font-bold text-blue-600">{(metrics.accuracy * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Precision</h3>
          <p className="text-4xl font-bold text-green-600">{(metrics.precision * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Recall</h3>
          <p className="text-4xl font-bold text-purple-600">{(metrics.recall * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react' as const
  }),

  analyzer: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\//g, '-')}-analyzer-${idx}`,
    name: `${cat} Analyzer ${idx}`,
    category: cat,
    description: `${cat} analysis tool with data processing, model inference, and results visualization for AI applications`,
    tags: [cat.toLowerCase().replace(/\//g, '-'), 'ai', 'analysis', 'ml', 'inference'],
    code: `'use client'
import { useState } from 'react'

export default function ${cat.replace(/[^a-zA-Z]/g, '')}Analyzer${idx}() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    setResult({
      prediction: 'Class A',
      confidence: 0.87,
      processing_time: '125ms'
    })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">${cat} Analyzer</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4"
          placeholder="Enter data to analyze..." />
        <button onClick={analyze}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Analyze
        </button>
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold">Prediction: {result.prediction}</p>
            <p className="text-sm text-gray-600">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Processing: {result.processing_time}</p>
          </div>
        )}
      </div>
    </div>
  )
}`,
    platform: 'react' as const
  }),

  visualizer: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\//g, '-')}-visualizer-${idx}`,
    name: `${cat} Visualizer ${idx}`,
    category: cat,
    description: `${cat} data visualization component with interactive charts, model architecture display, and performance metrics`,
    tags: [cat.toLowerCase().replace(/\//g, '-'), 'ai', 'visualization', 'ml', 'charts'],
    code: `'use client'
import { useState } from 'react'

export default function ${cat.replace(/[^a-zA-Z]/g, '')}Visualizer${idx}() {
  const data = [
    { label: 'Epoch 1', value: 0.45 },
    { label: 'Epoch 2', value: 0.62 },
    { label: 'Epoch 3', value: 0.78 },
    { label: 'Epoch 4', value: 0.85 },
    { label: 'Epoch 5', value: 0.91 }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">${cat} Visualizer</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-64 flex items-end justify-around gap-4">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-600 rounded-t"
                style={{ height: \`\${d.value * 100}%\` }}></div>
              <span className="text-xs mt-2">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react' as const
  }),

  trainer: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\//g, '-')}-trainer-${idx}`,
    name: `${cat} Model Trainer ${idx}`,
    category: cat,
    description: `${cat} model training interface with hyperparameter tuning, progress monitoring, and training metrics visualization`,
    tags: [cat.toLowerCase().replace(/\//g, '-'), 'ai', 'training', 'ml', 'model'],
    code: `'use client'
import { useState } from 'react'

export default function ${cat.replace(/[^a-zA-Z]/g, '')}Trainer${idx}() {
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">${cat} Model Trainer</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Learning Rate</label>
          <input type="number" step="0.001" defaultValue="0.001"
            className="w-full p-3 border-2 border-gray-300 rounded-lg" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Epochs</label>
          <input type="number" defaultValue="100"
            className="w-full p-3 border-2 border-gray-300 rounded-lg" />
        </div>
        <button onClick={() => setIsTraining(!isTraining)}
          className={\`w-full py-3 rounded-lg text-white \${
            isTraining ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }\`}>
          {isTraining ? 'Stop Training' : 'Start Training'}
        </button>
        {isTraining && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: \`\${progress}%\` }}></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">{progress}% complete</p>
          </div>
        )}
      </div>
    </div>
  )
}`,
    platform: 'react' as const
  }),

  predictor: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/\//g, '-')}-predictor-${idx}`,
    name: `${cat} Predictor ${idx}`,
    category: cat,
    description: `${cat} prediction interface with real-time inference, confidence scores, and explanation visualization`,
    tags: [cat.toLowerCase().replace(/\//g, '-'), 'ai', 'prediction', 'ml', 'inference'],
    code: `'use client'
import { useState } from 'react'

export default function ${cat.replace(/[^a-zA-Z]/g, '')}Predictor${idx}() {
  const [prediction, setPrediction] = useState<any>(null)

  const makePrediction = () => {
    setPrediction({
      result: 'Positive',
      confidence: 0.92,
      alternatives: [
        { label: 'Positive', score: 0.92 },
        { label: 'Neutral', score: 0.06 },
        { label: 'Negative', score: 0.02 }
      ]
    })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">${cat} Predictor</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <button onClick={makePrediction}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-6">
          Make Prediction
        </button>

        {prediction && (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-xl mb-2">Prediction: {prediction.result}</h3>
              <p className="text-gray-600">Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">All Predictions:</h4>
              {prediction.alternatives.map((alt: any, i: number) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>{alt.label}</span>
                    <span className="text-sm text-gray-600">{(alt.score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full"
                      style={{ width: \`\${alt.score * 100}%\` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}`,
    platform: 'react' as const
  })
}

// Generate capsules for each AI category
aiCategories.forEach(category => {
  const templateTypes = Object.keys(aiTemplates) as Array<keyof typeof aiTemplates>
  const capsulesPerTemplate = Math.ceil(category.count / templateTypes.length)

  templateTypes.forEach((templateType, templateIdx) => {
    for (let i = 0; i < capsulesPerTemplate && extendedCapsulesBatch20.length < 500; i++) {
      const capsule = aiTemplates[templateType](category.name, templateIdx * capsulesPerTemplate + i + 1)
      extendedCapsulesBatch20.push(capsule)
    }
  })
})

// Fill remaining slots if needed
while (extendedCapsulesBatch20.length < 500) {
  extendedCapsulesBatch20.push({
    id: `ai-util-${extendedCapsulesBatch20.length}`,
    name: `AI Utility ${extendedCapsulesBatch20.length}`,
    category: 'Machine Learning',
    description: 'AI/ML utility component for data processing, model management, and machine learning operations',
    tags: ['ai', 'ml', 'utility', 'automation', 'operations'],
    code: `'use client'
export default function AIUtil${extendedCapsulesBatch20.length}() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">AI Utility Component</h2>
        <p className="text-gray-600">Machine learning utility for data operations</p>
      </div>
    </div>
  )
}`,
    platform: 'react'
  })
}

export default extendedCapsulesBatch20

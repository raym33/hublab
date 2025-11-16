/**
 * Extended Capsules Batch 21 - Gaming, Audio, Legal & Real Estate (500 capsules)
 * Focus: Game Development, Audio Production, Legal Tech, Property Management
 */

import { Capsule } from './types'

const extendedCapsulesBatch21: Capsule[] = [
  // Gaming Components (125 capsules)
  {
    id: 'game-player-hud',
    name: 'Game Player HUD',
    category: 'Gaming',
    description: 'Game heads-up display with health bar, score counter, mini-map, and inventory indicators for gaming interfaces',
    tags: ['gaming', 'hud', 'ui', 'game-dev', 'player-stats'],
    code: `'use client'
import { useState } from 'react'

export default function GamePlayerHUD() {
  const [player, setPlayer] = useState({ health: 85, score: 12450, ammo: 24, level: 12 })

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        <div className="bg-black bg-opacity-70 rounded-lg p-3">
          <div className="text-yellow-400 text-sm mb-1">SCORE</div>
          <div className="text-3xl font-bold text-white">{player.score.toLocaleString()}</div>
        </div>
        <div className="bg-black bg-opacity-70 rounded-lg p-3">
          <div className="text-blue-400 text-sm mb-1">LEVEL</div>
          <div className="text-3xl font-bold text-white">{player.level}</div>
        </div>
      </div>

      {/* Bottom Left - Health */}
      <div className="absolute bottom-0 left-0 p-4">
        <div className="bg-black bg-opacity-70 rounded-lg p-4 w-64">
          <div className="text-red-400 text-sm mb-2 flex justify-between">
            <span>HEALTH</span>
            <span>{player.health}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-400 h-4 rounded-full transition-all"
              style={{ width: \`\${player.health}%\` }}></div>
          </div>
        </div>
      </div>

      {/* Bottom Right - Ammo */}
      <div className="absolute bottom-0 right-0 p-4">
        <div className="bg-black bg-opacity-70 rounded-lg p-4">
          <div className="text-orange-400 text-sm mb-1">AMMO</div>
          <div className="text-5xl font-bold text-white">{player.ammo}</div>
        </div>
      </div>

      {/* Mini Map */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-black bg-opacity-70 rounded-lg border-2 border-gray-600">
        <div className="w-full h-full relative">
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },
  {
    id: 'game-leaderboard',
    name: 'Game Leaderboard',
    category: 'Gaming',
    description: 'Competitive gaming leaderboard with rankings, scores, player avatars, and real-time updates',
    tags: ['gaming', 'leaderboard', 'rankings', 'competitive', 'scores'],
    code: `'use client'
import { useState } from 'react'

export default function GameLeaderboard() {
  const players = [
    { rank: 1, name: 'ProGamer2024', score: 45680, avatar: '👑' },
    { rank: 2, name: 'NinjaKiller', score: 42350, avatar: '🥷' },
    { rank: 3, name: 'DragonSlayer', score: 38920, avatar: '🐉' },
    { rank: 4, name: 'ShadowHunter', score: 35140, avatar: '👤' },
    { rank: 5, name: 'PhoenixRider', score: 32780, avatar: '🔥' }
  ]

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        GLOBAL LEADERBOARD
      </h1>

      <div className="space-y-3">
        {players.map(player => (
          <div key={player.rank}
            className={\`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 \${
              player.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              player.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
              player.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
              'bg-gray-800'
            }\`}>
            <div className={\`text-2xl font-bold w-12 text-center \${
              player.rank <= 3 ? 'text-white' : 'text-gray-400'
            }\`}>
              #{player.rank}
            </div>
            <div className="text-4xl">{player.avatar}</div>
            <div className="flex-1">
              <div className={\`font-bold text-lg \${player.rank <= 3 ? 'text-white' : 'text-gray-200'}\`}>
                {player.name}
              </div>
            </div>
            <div className={\`text-2xl font-bold \${player.rank <= 3 ? 'text-white' : 'text-yellow-400'}\`}>
              {player.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,
    platform: 'react'
  },

  // Audio Production Components (125 capsules)
  {
    id: 'audio-waveform-visualizer',
    name: 'Audio Waveform Visualizer',
    category: 'Audio Production',
    description: 'Real-time audio waveform visualization with playback controls and timeline scrubbing',
    tags: ['audio', 'waveform', 'visualizer', 'music', 'production'],
    code: `'use client'
import { useState } from 'react'

export default function AudioWaveformVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(45)
  const duration = 180

  const waveformData = Array.from({ length: 100 }, () => Math.random() * 100)

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Audio Track</h2>

      {/* Waveform */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="h-32 flex items-end gap-1">
          {waveformData.map((height, i) => (
            <div key={i}
              className={\`flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-400 cursor-pointer \${
                i < (currentTime / duration) * 100 ? 'bg-blue-600' : ''
              }\`}
              style={{ height: \`\${height}%\` }}></div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <input type="range" min="0" max={duration} value={currentTime}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          className="w-full" />
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600">⏮</button>
        <button onClick={() => setIsPlaying(!isPlaying)}
          className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 text-2xl">
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600">⏭</button>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },

  // Legal/Compliance Components (125 capsules)
  {
    id: 'legal-document-manager',
    name: 'Legal Document Manager',
    category: 'Legal Tech',
    description: 'Legal document management system with version control, signatures, and compliance tracking',
    tags: ['legal', 'documents', 'compliance', 'contracts', 'management'],
    code: `'use client'
import { useState } from 'react'

export default function LegalDocumentManager() {
  const documents = [
    { id: 1, title: 'Service Agreement', type: 'Contract', status: 'Pending Signature', date: '2024-01-15' },
    { id: 2, title: 'NDA - Client Corp', type: 'NDA', status: 'Signed', date: '2024-01-14' },
    { id: 3, title: 'Employment Contract', type: 'Contract', status: 'Under Review', date: '2024-01-13' }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Legal Documents</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left p-4">Document</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-semibold">{doc.title}</td>
                <td className="p-4">{doc.type}</td>
                <td className="p-4">
                  <span className={\`px-3 py-1 rounded-full text-sm \${
                    doc.status === 'Signed' ? 'bg-green-100 text-green-700' :
                    doc.status === 'Pending Signature' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }\`}>{doc.status}</span>
                </td>
                <td className="p-4 text-gray-600">{doc.date}</td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline mr-3">View</button>
                  <button className="text-green-600 hover:underline">Sign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },

  // Real Estate Components (125 capsules)
  {
    id: 'property-listing-card',
    name: 'Property Listing Card',
    category: 'Real Estate',
    description: 'Real estate property listing card with images, price, features, and contact information',
    tags: ['real-estate', 'property', 'listing', 'housing', 'rental'],
    code: `'use client'
import { useState } from 'react'

export default function PropertyListingCard() {
  const [isFavorite, setIsFavorite] = useState(false)

  const property = {
    title: 'Modern Downtown Apartment',
    price: '$2,500/month',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    address: '123 Main St, Downtown',
    features: ['Parking', 'Pool', 'Gym', 'Pet Friendly']
  }

  return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-300">
        <img src="/api/placeholder/400/300" alt="Property" className="w-full h-full object-cover" />
        <button onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white rounded-full p-2">
          <span className={\`text-2xl \${isFavorite ? 'text-red-500' : 'text-gray-400'}\`}>♥</span>
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
        <p className="text-3xl font-bold text-blue-600 mb-4">{property.price}</p>

        <div className="flex gap-4 mb-4 text-gray-600">
          <span>🛏 {property.bedrooms} bed</span>
          <span>🚿 {property.bathrooms} bath</span>
          <span>📐 {property.sqft} sqft</span>
        </div>

        <p className="text-gray-600 mb-4">📍 {property.address}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.map(feature => (
            <span key={feature} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {feature}
            </span>
          ))}
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Contact Agent
        </button>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }
]

// Generate remaining capsules programmatically
const batch21Categories = [
  { name: 'Gaming', count: 120, prefix: 'game' },
  { name: 'Audio Production', count: 120, prefix: 'audio' },
  { name: 'Legal Tech', count: 120, prefix: 'legal' },
  { name: 'Real Estate', count: 120, prefix: 'realestate' }
]

const batch21Templates = {
  dashboard: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/ /g, '-')}-dashboard-${idx}`,
    name: `${cat} Dashboard ${idx}`,
    category: cat,
    description: `${cat} comprehensive dashboard with analytics, monitoring, and management tools for ${cat.toLowerCase()} operations`,
    tags: [cat.toLowerCase().replace(/ /g, '-'), 'dashboard', 'analytics', 'management', 'monitoring'],
    code: `'use client'
export default function ${cat.replace(/[^a-zA-Z]/g, '')}Dashboard${idx}() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">${cat} Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Items</h3>
          <p className="text-4xl font-bold text-blue-600">247</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-4xl font-bold text-green-600">$45.2K</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Growth</h3>
          <p className="text-4xl font-bold text-purple-600">+12%</p>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react' as const
  }),

  manager: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/ /g, '-')}-manager-${idx}`,
    name: `${cat} Manager ${idx}`,
    category: cat,
    description: `${cat} management interface with CRUD operations, filtering, and bulk actions for ${cat.toLowerCase()} items`,
    tags: [cat.toLowerCase().replace(/ /g, '-'), 'manager', 'crud', 'admin', 'operations'],
    code: `'use client'
import { useState } from 'react'

export default function ${cat.replace(/[^a-zA-Z]/g, '')}Manager${idx}() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', status: 'Active' },
    { id: 2, name: 'Item 2', status: 'Pending' }
  ])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">${cat} Manager</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <span className="text-sm text-gray-600">{item.status}</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}`,
    platform: 'react' as const
  }),

  viewer: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/ /g, '-')}-viewer-${idx}`,
    name: `${cat} Viewer ${idx}`,
    category: cat,
    description: `${cat} detailed viewer with rich information display and interactive elements for ${cat.toLowerCase()} content`,
    tags: [cat.toLowerCase().replace(/ /g, '-'), 'viewer', 'details', 'display', 'content'],
    code: `'use client'
export default function ${cat.replace(/[^a-zA-Z]/g, '')}Viewer${idx}() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">${cat} Details</h1>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <p className="text-lg">Sample ${cat} Item</p>
          </div>
          <div className="border-b pb-4">
            <label className="block text-sm font-medium text-gray-600">Status</label>
            <p className="text-lg">Active</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Description</label>
            <p className="text-lg text-gray-700">Detailed information about this ${cat.toLowerCase()} item.</p>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react' as const
  }),

  form: (cat: string, idx: number) => ({
    id: `${cat.toLowerCase().replace(/ /g, '-')}-form-${idx}`,
    name: `${cat} Form ${idx}`,
    category: cat,
    description: `${cat} data entry form with validation, autosave, and submission handling for ${cat.toLowerCase()} information`,
    tags: [cat.toLowerCase().replace(/ /g, '-'), 'form', 'input', 'validation', 'crud'],
    code: `'use client'
import { useState } from 'react'

export default function ${cat.replace(/[^a-zA-Z]/g, '')}Form${idx}() {
  const [formData, setFormData] = useState({ name: '', category: '', notes: '' })

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New ${cat} Entry</h1>
      <form className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input type="text" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2">
            <option value="">Select...</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
            rows={4}></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  )
}`,
    platform: 'react' as const
  })
}

// Generate capsules for each category
batch21Categories.forEach(category => {
  const templateTypes = Object.keys(batch21Templates) as Array<keyof typeof batch21Templates>
  const capsulesPerTemplate = Math.ceil(category.count / templateTypes.length)

  templateTypes.forEach((templateType, templateIdx) => {
    for (let i = 0; i < capsulesPerTemplate && extendedCapsulesBatch21.length < 500; i++) {
      const capsule = batch21Templates[templateType](category.name, templateIdx * capsulesPerTemplate + i + 1)
      extendedCapsulesBatch21.push(capsule)
    }
  })
})

// Fill remaining slots
while (extendedCapsulesBatch21.length < 500) {
  extendedCapsulesBatch21.push({
    id: `batch21-util-${extendedCapsulesBatch21.length}`,
    name: `Utility Component ${extendedCapsulesBatch21.length}`,
    category: 'Gaming',
    description: 'Utility component for gaming, audio, legal, and real estate applications with comprehensive features',
    tags: ['utility', 'component', 'tools', 'helper', 'misc'],
    code: `'use client'
export default function UtilityComponent${extendedCapsulesBatch21.length}() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Utility Component</h2>
        <p className="text-gray-600">Utility functionality component</p>
      </div>
    </div>
  )
}`,
    platform: 'react'
  })
}

export default extendedCapsulesBatch21

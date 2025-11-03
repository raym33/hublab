/**
 * GitHub Repository Capsules
 *
 * This file demonstrates converting full GitHub repositories into HubLab capsules.
 * Each capsule wraps an external GitHub project as an embeddable component.
 *
 * Conversion Strategy:
 * 1. Identify the core functionality of the repo
 * 2. Create an iframe or component wrapper
 * 3. Handle state management and communication
 * 4. Provide props for customization
 * 5. Document dependencies and setup requirements
 */

import { Capsule } from '@/types/capsule'

// ============================================================================
// PROOF OF CONCEPT: OpenCut Video Editor Capsule
// ============================================================================

export const openCutVideoEditorCapsule: Capsule = {
  id: 'opencut-video-editor',
  name: 'OpenCut Video Editor',
  category: 'Media',
  description: 'Full-featured browser-based video editor with timeline, multi-track support, and real-time preview. Open-source alternative to CapCut.',
  tags: ['video', 'editor', 'timeline', 'media', 'github-repo'],
  version: '1.0.0',
  author: 'OpenCut Team (via HubLab)',
  license: 'MIT',

  props: {
    height: '800px',
    enableUpload: true,
    enableExport: true,
    maxTracks: 5,
    theme: 'dark',
    onVideoExport: '(videoBlob: Blob) => void',
    onError: '(error: Error) => void'
  },

  dependencies: [
    'next@14.x',
    'react@18.x',
    'zustand@4.x',
    '@remotion/player'
  ],

  setupInstructions: `
# OpenCut Video Editor Setup

This capsule embeds the OpenCut video editor (https://github.com/OpenCut-app/OpenCut)

## Installation

\`\`\`bash
npm install zustand @remotion/player @remotion/renderer
\`\`\`

## Environment Variables

Add to your .env.local:

\`\`\`
NEXT_PUBLIC_OPENCUT_URL=https://opencut.app
# Or use local instance: http://localhost:3000
\`\`\`

## Local Development (Optional)

To run OpenCut locally for deeper integration:

\`\`\`bash
git clone https://github.com/OpenCut-app/OpenCut.git
cd OpenCut
bun install
docker-compose up -d  # Starts PostgreSQL + Redis
bun run dev
\`\`\`
  `,

  code: `
'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Download, Upload, Scissors, Layers, X, ExternalLink } from 'lucide-react'

interface OpenCutVideoEditorProps {
  height?: string
  enableUpload?: boolean
  enableExport?: boolean
  maxTracks?: number
  theme?: 'light' | 'dark'
  onVideoExport?: (videoBlob: Blob) => void
  onError?: (error: Error) => void
}

export default function OpenCutVideoEditor({
  height = '800px',
  enableUpload = true,
  enableExport = true,
  maxTracks = 5,
  theme = 'dark',
  onVideoExport,
  onError
}: OpenCutVideoEditorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useIframe, setUseIframe] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const openCutUrl = process.env.NEXT_PUBLIC_OPENCUT_URL || 'https://opencut.app'

  useEffect(() => {
    // Check if OpenCut is available
    const checkAvailability = async () => {
      try {
        const response = await fetch(openCutUrl, { mode: 'no-cors' })
        setIsLoading(false)
      } catch (err) {
        setError('OpenCut service not available. Please check your connection.')
        setIsLoading(false)
        onError?.(err as Error)
      }
    }

    checkAvailability()
  }, [openCutUrl, onError])

  const handleOpenInNewTab = () => {
    window.open(openCutUrl, '_blank', 'noopener,noreferrer')
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg border-2 border-red-500" style={{ height }}>
        <X className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">OpenCut Not Available</h3>
        <p className="text-gray-400 mb-6 text-center max-w-md">{error}</p>

        <div className="space-y-3 w-full max-w-md">
          <button
            onClick={handleOpenInNewTab}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ExternalLink className="w-5 h-5" />
            Open OpenCut in New Tab
          </button>

          <div className="p-4 bg-gray-800 rounded-lg text-sm text-gray-300">
            <p className="font-semibold mb-2">Local Setup Instructions:</p>
            <code className="block text-xs text-gray-400">
              git clone https://github.com/OpenCut-app/OpenCut.git<br/>
              cd OpenCut<br/>
              bun install && docker-compose up -d<br/>
              bun run dev
            </code>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg" style={{ height }}>
        <Scissors className="w-16 h-16 text-blue-500 mb-4 animate-pulse" />
        <h3 className="text-xl font-semibold text-white mb-2">Loading OpenCut Video Editor...</h3>
        <p className="text-gray-400">Initializing timeline and preview</p>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700" style={{ height }}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-semibold text-white">OpenCut Video Editor</span>
          <span className="text-xs text-gray-400">Open Source</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenInNewTab}
            className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Full Screen
          </button>
        </div>
      </div>

      {/* Embedded OpenCut */}
      <iframe
        ref={iframeRef}
        src={openCutUrl}
        className="w-full border-0"
        style={{ height: 'calc(100% - 48px)' }}
        allow="camera; microphone; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        title="OpenCut Video Editor"
      />

      {/* Info Overlay (can be dismissed) */}
      <div className="absolute bottom-4 right-4 p-3 bg-gray-800/95 rounded-lg shadow-lg border border-gray-700 max-w-xs">
        <div className="flex items-start gap-2">
          <Layers className="w-4 h-4 text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-white mb-1">GitHub Repository Capsule</p>
            <p className="text-xs text-gray-400">
              This capsule embeds OpenCut, an open-source video editor. Your videos stay private on your device.
            </p>
            <a
              href="https://github.com/OpenCut-app/OpenCut"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-flex items-center gap-1"
            >
              View on GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
`
}

// ============================================================================
// GENERIC GITHUB REPO CAPSULE GENERATOR
// ============================================================================

/**
 * This function analyzes a GitHub repository and generates a capsule wrapper
 *
 * Usage:
 * const capsule = await generateCapsuleFromGitHub('OpenCut-app/OpenCut')
 */
export async function generateCapsuleFromGitHub(
  repoUrl: string,
  options?: {
    embedType?: 'iframe' | 'component' | 'npm-package'
    category?: string
    customProps?: Record<string, string>
  }
): Promise<Capsule> {
  // Parse repository information
  const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!repoMatch) {
    throw new Error('Invalid GitHub repository URL')
  }

  const [, owner, repo] = repoMatch
  const repoName = repo.replace('.git', '')

  // Fetch repository metadata from GitHub API
  const metadata = await fetchGitHubRepoMetadata(owner, repoName)

  // Determine embedding strategy
  const embedType = options?.embedType || detectEmbedType(metadata)

  // Generate capsule configuration
  const capsule: Capsule = {
    id: \`github-\${owner}-\${repoName}\`.toLowerCase(),
    name: metadata.name || repoName,
    category: options?.category || detectCategory(metadata),
    description: metadata.description || \`GitHub repository: \${owner}/\${repoName}\`,
    tags: ['github-repo', ...metadata.topics || []],
    version: '1.0.0',
    author: \`\${metadata.author} (via HubLab)\`,
    license: metadata.license || 'Unknown',

    props: {
      height: '600px',
      theme: 'dark',
      ...options?.customProps
    },

    dependencies: metadata.dependencies || [],

    setupInstructions: generateSetupInstructions(owner, repoName, metadata),

    code: generateCapsuleCode(owner, repoName, embedType, metadata)
  }

  return capsule
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function fetchGitHubRepoMetadata(owner: string, repo: string) {
  try {
    const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}\`)
    if (!response.ok) throw new Error('Failed to fetch repository')

    const data = await response.json()

    // Also fetch package.json to get dependencies
    let dependencies: string[] = []
    try {
      const packageResponse = await fetch(
        \`https://raw.githubusercontent.com/\${owner}/\${repo}/main/package.json\`
      )
      if (packageResponse.ok) {
        const packageData = await packageResponse.json()
        dependencies = Object.keys({
          ...packageData.dependencies,
          ...packageData.peerDependencies
        })
      }
    } catch (err) {
      // Package.json might not exist
    }

    return {
      name: data.name,
      description: data.description,
      author: data.owner.login,
      license: data.license?.spdx_id,
      topics: data.topics || [],
      language: data.language,
      stargazers: data.stargazers_count,
      homepage: data.homepage,
      dependencies
    }
  } catch (error) {
    console.error('Error fetching GitHub metadata:', error)
    return {
      name: repo,
      description: '',
      author: owner,
      license: 'Unknown',
      topics: [],
      dependencies: []
    }
  }
}

function detectEmbedType(metadata: any): 'iframe' | 'component' | 'npm-package' {
  // If it has a homepage/demo URL, use iframe
  if (metadata.homepage) return 'iframe'

  // If it's primarily a library (no UI), suggest npm package
  if (metadata.topics?.includes('library')) return 'npm-package'

  // Default to component for React/Next.js projects
  if (metadata.language === 'TypeScript' || metadata.language === 'JavaScript') {
    return 'component'
  }

  return 'iframe'
}

function detectCategory(metadata: any): string {
  const topics = metadata.topics || []

  if (topics.some((t: string) => ['video', 'editor', 'media'].includes(t))) return 'Media'
  if (topics.some((t: string) => ['ui', 'component', 'design'].includes(t))) return 'UI'
  if (topics.some((t: string) => ['chart', 'visualization', 'dataviz'].includes(t))) return 'DataViz'
  if (topics.some((t: string) => ['form', 'input', 'validation'].includes(t))) return 'Form'
  if (topics.some((t: string) => ['ai', 'ml', 'llm'].includes(t))) return 'AI'

  return 'Utility'
}

function generateSetupInstructions(owner: string, repo: string, metadata: any): string {
  return \`
# \${metadata.name} Setup

This capsule embeds the GitHub repository: https://github.com/\${owner}/\${repo}

## Installation

\\\`\\\`\\\`bash
# Clone the repository
git clone https://github.com/\${owner}/\${repo}.git
cd \${repo}

# Install dependencies
\${metadata.dependencies.length > 0 ? 'npm install' : '# Follow repository setup instructions'}
\\\`\\\`\\\`

\${metadata.dependencies.length > 0 ? \`
## Dependencies

\\\`\\\`\\\`bash
npm install \${metadata.dependencies.slice(0, 5).join(' ')}
\\\`\\\`\\\`
\` : ''}

## Documentation

For complete documentation, visit: https://github.com/\${owner}/\${repo}

\${metadata.homepage ? \`## Live Demo\n\nView live demo at: \${metadata.homepage}\` : ''}
  \`
}

function generateCapsuleCode(
  owner: string,
  repo: string,
  embedType: 'iframe' | 'component' | 'npm-package',
  metadata: any
): string {
  const repoUrl = \`https://github.com/\${owner}/\${repo}\`
  const demoUrl = metadata.homepage || \`https://\${repo}.vercel.app\`

  if (embedType === 'iframe') {
    return \`
'use client'

import { useState, useRef } from 'react'
import { ExternalLink, GitBranch, Star } from 'lucide-react'

interface GitHubRepoEmbedProps {
  height?: string
  theme?: 'light' | 'dark'
}

export default function GitHubRepoEmbed({
  height = '600px',
  theme = 'dark'
}: GitHubRepoEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700" style={{ height }}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-semibold text-white">\${metadata.name}</span>
          <a
            href="\${repoUrl}"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300"
          >
            <Star className="w-3 h-3" />
            \${metadata.stargazers || 0}
          </a>
        </div>
        <button
          onClick={() => window.open('\${demoUrl}', '_blank')}
          className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          Full Screen
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading \${metadata.name}...</p>
          </div>
        </div>
      )}

      <iframe
        src="\${demoUrl}"
        className="w-full border-0"
        style={{ height: 'calc(100% - 48px)' }}
        onLoad={() => setIsLoading(false)}
        title="\${metadata.name}"
      />
    </div>
  )
}
\`
  }

  if (embedType === 'npm-package') {
    return \`
// This is a wrapper for the npm package: \${repo}
// Install with: npm install \${repo}

import \${metadata.name.replace(/-/g, '')} from '\${repo}'

export default function GitHubPackageWrapper(props: any) {
  // Wrap the imported package with HubLab-compatible interface
  return <\${metadata.name.replace(/-/g, '')} {...props} />
}
\`
  }

  // Default: component embed
  return \`
'use client'

import { useState } from 'react'
import { ExternalLink, GitBranch } from 'lucide-react'

// TODO: Import actual components from the repository
// import { ComponentName } from '\${repo}'

export default function GitHubComponentEmbed(props: any) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">\${metadata.name}</h3>
        </div>
        <a
          href="\${repoUrl}"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          View Source
        </a>
      </div>

      <p className="text-gray-600 text-sm mb-4">\${metadata.description}</p>

      {/* TODO: Render actual component here */}
      <div className="p-8 bg-gray-50 rounded border-2 border-dashed border-gray-300 text-center">
        <p className="text-gray-500">
          Component from <span className="font-mono text-sm">\${owner}/\${repo}</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Install the package and import components to use here
        </p>
      </div>
    </div>
  )
}
\`
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// Convert any GitHub repo to a capsule:

const shadcnUiCapsule = await generateCapsuleFromGitHub(
  'https://github.com/shadcn-ui/ui',
  { category: 'UI', embedType: 'npm-package' }
)

const remotionCapsule = await generateCapsuleFromGitHub(
  'https://github.com/remotion-dev/remotion',
  { category: 'Media', embedType: 'component' }
)

const vercelCapsule = await generateCapsuleFromGitHub(
  'https://github.com/vercel/next.js',
  { category: 'Framework', embedType: 'npm-package' }
)
*/

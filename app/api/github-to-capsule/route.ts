import { NextRequest, NextResponse } from 'next/server'

interface GitHubRepoMetadata {
  name: string
  description: string
  author: string
  license: string
  topics: string[]
  language: string
  stargazers: number
  homepage?: string
  dependencies: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, embedType, category, customProps } = await request.json()

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      )
    }

    // Parse GitHub repository URL
    const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/)
    if (!repoMatch) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL. Expected format: https://github.com/owner/repo' },
        { status: 400 }
      )
    }

    const [, owner, repoName] = repoMatch
    const cleanRepoName = repoName.replace('.git', '')

    // Fetch repository metadata from GitHub API
    const metadata = await fetchGitHubRepoMetadata(owner, cleanRepoName)

    // Determine embedding strategy
    const detectedEmbedType = embedType || detectEmbedType(metadata)

    // Generate capsule configuration
    const capsule = {
      id: `github-${owner}-${cleanRepoName}`.toLowerCase(),
      name: metadata.name || cleanRepoName,
      category: category || detectCategory(metadata),
      description: metadata.description || `GitHub repository: ${owner}/${cleanRepoName}`,
      tags: ['github-repo', ...metadata.topics],
      version: '1.0.0',
      author: `${metadata.author} (via HubLab)`,
      license: metadata.license,

      props: {
        height: '600px',
        theme: 'dark',
        ...customProps
      },

      dependencies: metadata.dependencies,
      repoUrl: `https://github.com/${owner}/${cleanRepoName}`,
      stargazers: metadata.stargazers,
      homepage: metadata.homepage,

      setupInstructions: generateSetupInstructions(owner, cleanRepoName, metadata),
      code: generateCapsuleCode(owner, cleanRepoName, detectedEmbedType, metadata)
    }

    return NextResponse.json({
      success: true,
      capsule,
      metadata: {
        embedType: detectedEmbedType,
        detectedCategory: detectCategory(metadata),
        language: metadata.language,
        stars: metadata.stargazers
      }
    })
  } catch (error: any) {
    console.error('GitHub to Capsule Conversion Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to convert GitHub repository to capsule' },
      { status: 500 }
    )
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function fetchGitHubRepoMetadata(owner: string, repo: string): Promise<GitHubRepoMetadata> {
  try {
    // Fetch repository data
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Fetch package.json to get dependencies
    let dependencies: string[] = []
    try {
      const packageResponse = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3.raw'
          }
        }
      )

      if (packageResponse.ok) {
        const packageData = await packageResponse.json()
        dependencies = Object.keys({
          ...packageData.dependencies || {},
          ...packageData.peerDependencies || {}
        })
      }
    } catch (err) {
      // Try master branch
      try {
        const packageResponse = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`
        )
        if (packageResponse.ok) {
          const packageData = await packageResponse.json()
          dependencies = Object.keys({
            ...packageData.dependencies || {},
            ...packageData.peerDependencies || {}
          })
        }
      } catch (err2) {
        // No package.json found
      }
    }

    return {
      name: data.name,
      description: data.description || '',
      author: data.owner.login,
      license: data.license?.spdx_id || 'Unknown',
      topics: data.topics || [],
      language: data.language || 'Unknown',
      stargazers: data.stargazers_count || 0,
      homepage: data.homepage || undefined,
      dependencies
    }
  } catch (error) {
    console.error('Error fetching GitHub metadata:', error)
    throw new Error('Failed to fetch repository information from GitHub')
  }
}

function detectEmbedType(metadata: GitHubRepoMetadata): 'iframe' | 'component' | 'npm-package' {
  // If it has a homepage/demo URL, use iframe
  if (metadata.homepage && metadata.homepage.includes('http')) return 'iframe'

  // If it's primarily a library (no UI), suggest npm package
  if (metadata.topics?.includes('library') || metadata.topics?.includes('package')) {
    return 'npm-package'
  }

  // Default to component for React/Next.js projects
  if (metadata.language === 'TypeScript' || metadata.language === 'JavaScript') {
    if (metadata.dependencies.some(dep => dep.includes('react') || dep.includes('next'))) {
      return 'component'
    }
  }

  return 'iframe'
}

function detectCategory(metadata: GitHubRepoMetadata): string {
  const topics = metadata.topics || []

  if (topics.some(t => ['video', 'editor', 'media', 'audio', 'player'].includes(t.toLowerCase()))) return 'Media'
  if (topics.some(t => ['ui', 'component', 'design', 'tailwind', 'css'].includes(t.toLowerCase()))) return 'UI'
  if (topics.some(t => ['chart', 'visualization', 'dataviz', 'graph'].includes(t.toLowerCase()))) return 'DataViz'
  if (topics.some(t => ['form', 'input', 'validation'].includes(t.toLowerCase()))) return 'Form'
  if (topics.some(t => ['ai', 'ml', 'llm', 'openai', 'gpt'].includes(t.toLowerCase()))) return 'AI'
  if (topics.some(t => ['animation', 'motion', 'transition'].includes(t.toLowerCase()))) return 'Animation'
  if (topics.some(t => ['auth', 'authentication', 'login'].includes(t.toLowerCase()))) return 'Auth'
  if (topics.some(t => ['database', 'db', 'sql', 'prisma'].includes(t.toLowerCase()))) return 'Database'

  return 'Utility'
}

function generateSetupInstructions(owner: string, repo: string, metadata: GitHubRepoMetadata): string {
  return `# ${metadata.name} Setup

This capsule embeds the GitHub repository: https://github.com/${owner}/${repo}

⭐ **${metadata.stargazers} stars** on GitHub
📝 **License:** ${metadata.license}

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/${owner}/${repo}.git
cd ${repo}

# Install dependencies
${metadata.dependencies.length > 0 ? 'npm install' : '# Follow repository setup instructions'}
\`\`\`

${metadata.dependencies.length > 0 ? `
## Dependencies

\`\`\`bash
npm install ${metadata.dependencies.slice(0, 8).join(' ')}${metadata.dependencies.length > 8 ? '\n# ... and more' : ''}
\`\`\`
` : ''}

## Documentation

For complete documentation, visit: https://github.com/${owner}/${repo}

${metadata.homepage ? `## Live Demo\n\nView live demo at: ${metadata.homepage}` : ''}

${metadata.topics.length > 0 ? `## Topics\n\n${metadata.topics.map(t => `\`${t}\``).join(', ')}` : ''}
  `
}

function generateCapsuleCode(
  owner: string,
  repo: string,
  embedType: 'iframe' | 'component' | 'npm-package',
  metadata: GitHubRepoMetadata
): string {
  const repoUrl = `https://github.com/${owner}/${repo}`
  const demoUrl = metadata.homepage || `https://${repo}.vercel.app`

  if (embedType === 'iframe') {
    return `'use client'

import { useState } from 'react'
import { ExternalLink, GitBranch, Star, AlertCircle } from 'lucide-react'

interface ${toPascalCase(repo)}Props {
  height?: string
  theme?: 'light' | 'dark'
}

export default function ${toPascalCase(repo)}({
  height = '600px',
  theme = 'dark'
}: ${toPascalCase(repo)}Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg border-2 border-red-500" style={{ height }}>
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Failed to Load</h3>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          The embedded content could not be loaded. Try opening in a new tab.
        </p>
        <button
          onClick={() => window.open('${demoUrl}', '_blank')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <ExternalLink className="w-5 h-5" />
          Open in New Tab
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700" style={{ height }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-semibold text-white">${metadata.name}</span>
          <a
            href="${repoUrl}"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition"
          >
            <Star className="w-3 h-3" />
            ${metadata.stargazers.toLocaleString()}
          </a>
        </div>
        <button
          onClick={() => window.open('${demoUrl}', '_blank')}
          className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          Full Screen
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading ${metadata.name}...</p>
          </div>
        </div>
      )}

      {/* Embedded Content */}
      <iframe
        src="${demoUrl}"
        className="w-full border-0"
        style={{ height: 'calc(100% - 48px)' }}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        allow="camera; microphone; clipboard-write; fullscreen"
        title="${metadata.name}"
      />

      {/* Info Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-gray-900/95 to-transparent pointer-events-none">
        <p className="text-xs text-gray-400 text-center">
          <span className="pointer-events-auto">
            Powered by{' '}
            <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
              ${owner}/${repo}
            </a>
          </span>
        </p>
      </div>
    </div>
  )
}
`
  }

  if (embedType === 'npm-package') {
    const packageName = repo.toLowerCase()
    return `// Wrapper for npm package: ${packageName}
// Install with: npm install ${packageName}

'use client'

import { ExternalLink, Package } from 'lucide-react'

// TODO: Import the actual package
// import ${toPascalCase(repo)} from '${packageName}'

interface ${toPascalCase(repo)}WrapperProps {
  [key: string]: any
}

export default function ${toPascalCase(repo)}Wrapper(props: ${toPascalCase(repo)}WrapperProps) {
  return (
    <div className="p-6 bg-white rounded-lg border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">${metadata.name}</h3>
          <span className="text-xs text-gray-500">npm package</span>
        </div>
        <a
          href="${repoUrl}"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          Docs
        </a>
      </div>

      <p className="text-gray-600 text-sm mb-4">${metadata.description}</p>

      <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <pre className="text-xs text-left bg-gray-900 text-gray-100 p-4 rounded mb-4 inline-block">
          npm install ${packageName}
        </pre>
        <p className="text-gray-500 text-sm">
          Install the package and import it to use in your components
        </p>
      </div>

      {/* TODO: Add actual component usage here */}
      {/* <${toPascalCase(repo)} {...props} /> */}
    </div>
  )
}
`
  }

  // Default: component embed
  return `'use client'

import { useState } from 'react'
import { ExternalLink, GitBranch, Code2 } from 'lucide-react'

// TODO: Import actual components from ${repo}
// Example: import { Component } from '${repo}'

interface ${toPascalCase(repo)}Props {
  [key: string]: any
}

export default function ${toPascalCase(repo)}(props: ${toPascalCase(repo)}Props) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">${metadata.name}</h3>
        </div>
        <a
          href="${repoUrl}"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          View Source
        </a>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">${metadata.description}</p>

      {/* Component Preview Area */}
      <div className="min-h-[300px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">Component from ${owner}/${repo}</p>
          <p className="text-sm text-gray-500 mb-4">
            Install the repository and import components to integrate them here
          </p>

          {/* Installation Instructions */}
          <div className="max-w-md mx-auto text-left">
            <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
{${metadata.dependencies.length > 0 ? `\`npm install ${metadata.dependencies.slice(0, 3).join(' ')}\`` : `\`git clone ${repoUrl}.git\``}}
            </pre>
          </div>
        </div>
      </div>

      {/* TODO: Replace the preview area above with actual component rendering */}
      {/* Example: <ComponentFromRepo {...props} /> */}
    </div>
  )
}
`
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

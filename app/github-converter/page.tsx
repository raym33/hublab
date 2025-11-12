import GitHubCapsuleConverter from '@/components/GitHubCapsuleConverter'
import Link from 'next/link'
import { ArrowLeft, GitBranch, Sparkles, Zap } from 'lucide-react'

export default function GitHubConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">
              GitHub to Capsule
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform any GitHub repository into a production-ready HubLab capsule.
            Access thousands of open-source projects instantly.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">∞</div>
            <div className="text-sm text-gray-600">Available Repos</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-purple-600 mb-1">&lt;10s</div>
            <div className="text-sm text-gray-600">Conversion Time</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
            <div className="text-sm text-gray-600">Production Ready</div>
          </div>
        </div>

        {/* Converter Component */}
        <GitHubCapsuleConverter />

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Detection</h3>
            <p className="text-gray-600 text-sm">
              Automatically detects the best embed strategy (iframe, component, or npm package) and categorizes your capsule.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Code</h3>
            <p className="text-gray-600 text-sm">
              Generates production-ready React/TypeScript components with error handling, loading states, and proper typing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <GitBranch className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Open Source</h3>
            <p className="text-gray-600 text-sm">
              Leverage the entire GitHub ecosystem. From video editors to UI libraries, make any repo part of your toolkit.
            </p>
          </div>
        </div>

        {/* Popular Conversions */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Conversions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'OpenCut', desc: 'Video Editor', url: 'OpenCut-app/OpenCut', category: 'Media' },
              { name: 'shadcn/ui', desc: 'UI Components', url: 'shadcn-ui/ui', category: 'UI' },
              { name: 'Recharts', desc: 'Charts', url: 'recharts/recharts', category: 'DataViz' },
              { name: 'Excalidraw', desc: 'Diagramming', url: 'excalidraw/excalidraw', category: 'Media' }
            ].map((repo) => (
              <div key={repo.url} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{repo.name}</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{repo.category}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{repo.desc}</p>
                <a
                  href={`https://github.com/${repo.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <GitBranch className="w-3 h-3" />
                  {repo.url}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Link */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-3">Want to Learn More?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Check out our comprehensive documentation on how the conversion system works,
            API reference, and advanced usage examples.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/api-docs"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              View API Docs
            </Link>
            <Link
              href="/studio-v2"
              className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold"
            >
              Try Studio V2
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-gray-600">
          <p>Built with ❤️ by the HubLab team</p>
          <p className="mt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

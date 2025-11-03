'use client'

import { useState } from 'react'

export default function APIDocsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                HubLab API Documentation
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Programmatic access for AI agents and developers
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Home
              </a>
              <a
                href="/workspace"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Overview */}
        <section className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg">
              The HubLab API allows AI agents and developers to programmatically create, manage,
              and deploy web applications. Build complete Next.js apps, React components, or HTML
              sites using our REST API.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  REST API
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Standard HTTP methods (GET, POST, PUT, DELETE) for all operations
                </p>
              </div>
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                  Rate Limited
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Tiered rate limits (free, pro, enterprise) with automatic throttling
                </p>
              </div>
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  JSON Responses
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  All responses in JSON format with consistent error handling
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Authentication
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              All API requests require an API key. Include it in the <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">Authorization</code> header:
            </p>
            <CodeBlock
              id="auth"
              language="bash"
              code={`curl -X GET https://hublab.dev/api/v1/projects \\
  -H "Authorization: Bearer hublab_sk_your_api_key_here"`}
              copied={copied}
              onCopy={copyCode}
            />
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Get your API key:</strong> Visit your{' '}
                <a href="/workspace" className="underline">
                  Dashboard
                </a>{' '}
                to generate an API key.
              </p>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Rate Limits
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Tier
                    </th>
                    <th className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Projects/Hour
                    </th>
                    <th className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Exports/Day
                    </th>
                    <th className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Deploys/Day
                    </th>
                    <th className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Requests/Minute
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300">
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4 font-medium">Free</td>
                    <td className="py-3 px-4">10</td>
                    <td className="py-3 px-4">50</td>
                    <td className="py-3 px-4">5</td>
                    <td className="py-3 px-4">30</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4 font-medium">Pro</td>
                    <td className="py-3 px-4">100</td>
                    <td className="py-3 px-4">500</td>
                    <td className="py-3 px-4">50</td>
                    <td className="py-3 px-4">120</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Enterprise</td>
                    <td className="py-3 px-4">1000</td>
                    <td className="py-3 px-4">5000</td>
                    <td className="py-3 px-4">500</td>
                    <td className="py-3 px-4">600</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
            API Endpoints
          </h2>

          {/* Create Project */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold rounded">
                POST
              </span>
              <code className="text-lg font-mono">/api/v1/projects</code>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Create a new project from a template or blank canvas.
            </p>

            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Request Body:</h4>
            <CodeBlock
              id="create-project-req"
              language="json"
              code={`{
  "name": "My Dashboard",
  "description": "Analytics dashboard for customers",
  "template": "dashboard",
  "theme": "modern-blue"
}`}
              copied={copied}
              onCopy={copyCode}
            />

            <h4 className="font-semibold text-slate-900 dark:text-white mt-4 mb-2">
              Available Templates:
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {['blank', 'dashboard', 'landing', 'ecommerce', 'admin', 'blog'].map((template) => (
                <span
                  key={template}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded"
                >
                  {template}
                </span>
              ))}
            </div>

            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Example:</h4>
            <CodeBlock
              id="create-project-example"
              language="bash"
              code={`curl -X POST https://hublab.dev/api/v1/projects \\
  -H "Authorization: Bearer hublab_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Dashboard",
    "template": "dashboard",
    "theme": "modern-blue"
  }'`}
              copied={copied}
              onCopy={copyCode}
            />
          </div>

          {/* List Projects */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded">
                GET
              </span>
              <code className="text-lg font-mono">/api/v1/projects</code>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              List all your projects with optional filtering and pagination.
            </p>

            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Query Parameters:</h4>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-1">
              <li><code>page</code> - Page number (default: 1)</li>
              <li><code>limit</code> - Items per page (default: 10, max: 100)</li>
              <li><code>status</code> - Filter by status (draft, building, ready, deployed, error)</li>
              <li><code>template</code> - Filter by template type</li>
            </ul>

            <CodeBlock
              id="list-projects-example"
              language="bash"
              code={`curl -X GET "https://hublab.dev/api/v1/projects?page=1&limit=10&status=ready" \\
  -H "Authorization: Bearer hublab_sk_your_api_key"`}
              copied={copied}
              onCopy={copyCode}
            />
          </div>

          {/* Get Project */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded">
                GET
              </span>
              <code className="text-lg font-mono">/api/v1/projects/:id</code>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Get details for a specific project.
            </p>

            <CodeBlock
              id="get-project-example"
              language="bash"
              code={`curl -X GET https://hublab.dev/api/v1/projects/abc123 \\
  -H "Authorization: Bearer hublab_sk_your_api_key"`}
              copied={copied}
              onCopy={copyCode}
            />
          </div>

          {/* Update Project */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm font-semibold rounded">
                PUT
              </span>
              <code className="text-lg font-mono">/api/v1/projects/:id</code>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Update project properties, capsules, or integrations.
            </p>

            <CodeBlock
              id="update-project-example"
              language="bash"
              code={`curl -X PUT https://hublab.dev/api/v1/projects/abc123 \\
  -H "Authorization: Bearer hublab_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Updated Dashboard",
    "status": "ready"
  }'`}
              copied={copied}
              onCopy={copyCode}
            />
          </div>

          {/* Delete Project */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-semibold rounded">
                DELETE
              </span>
              <code className="text-lg font-mono">/api/v1/projects/:id</code>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Delete a project permanently.
            </p>

            <CodeBlock
              id="delete-project-example"
              language="bash"
              code={`curl -X DELETE https://hublab.dev/api/v1/projects/abc123 \\
  -H "Authorization: Bearer hublab_sk_your_api_key"`}
              copied={copied}
              onCopy={copyCode}
            />
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Error Handling
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              All errors follow a consistent format:
            </p>
            <CodeBlock
              id="error-response"
              language="json"
              code={`{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Limit: 10 per 60 minutes",
    "details": {
      "limit": 10,
      "resetAt": "2025-01-15T10:30:00Z"
    }
  }
}`}
              copied={copied}
              onCopy={copyCode}
            />

            <h4 className="font-semibold text-slate-900 dark:text-white mt-6 mb-2">
              Error Codes:
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li><code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">UNAUTHORIZED</code> - Invalid or missing API key</li>
              <li><code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">FORBIDDEN</code> - Access denied</li>
              <li><code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">NOT_FOUND</code> - Resource not found</li>
              <li><code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">RATE_LIMIT_EXCEEDED</code> - Too many requests</li>
              <li><code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">VALIDATION_ERROR</code> - Invalid request data</li>
              <li><code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">INTERNAL_ERROR</code> - Server error</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-slate-600 dark:text-slate-400 py-8">
          <p>Need help? Join our community or email support@hublab.dev</p>
        </div>
      </main>
    </div>
  )
}

interface CodeBlockProps {
  id: string
  language: string
  code: string
  copied: string | null
  onCopy: (code: string, id: string) => void
}

function CodeBlock({ id, language, code, copied, onCopy }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => onCopy(code, id)}
        className="absolute top-2 right-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-colors"
      >
        {copied === id ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

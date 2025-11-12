import Link from 'next/link'
import { GitBranch, Terminal, CheckCircle, AlertCircle, Code, Rocket, Download } from 'lucide-react'

export const metadata = {
  title: 'GitHub Integration Guide - HubLab',
  description: 'Learn how to push HubLab projects to GitHub and deploy them. Complete guide for AI assistants and developers.',
}

export default function GitHubIntegrationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-10 h-10" />
            <h1 className="text-4xl sm:text-5xl font-bold">GitHub Integration</h1>
          </div>
          <p className="text-xl text-gray-300">
            Complete guide for pushing HubLab projects to GitHub and deploying them
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* AI Assistant Section */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 For AI Assistants</h2>
          <p className="text-gray-700 mb-4">
            When a user wants to push their HubLab project to GitHub, guide them through this workflow:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
            <li>Export project from HubLab Studio V2 (click "Export" → "Download ZIP")</li>
            <li>Unzip the downloaded file locally</li>
            <li>Follow the instructions below to initialize Git, create a GitHub repo, and push</li>
            <li>Optionally, deploy to Vercel/Netlify with one command</li>
          </ol>
        </div>

        {/* Step 1: Export from HubLab */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Export Your Project</h2>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">From Studio V2</h3>
            <ol className="space-y-2 text-gray-700">
              <li>• Open your project in <Link href="/studio-v2" className="text-blue-600 hover:underline">Studio V2</Link></li>
              <li>• Click the "Export" button in the top-right corner</li>
              <li>• Select "Download ZIP" (or "Push to GitHub" for automatic setup)</li>
              <li>• Save the ZIP file to your computer</li>
            </ol>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Unzip the project</span>
            </div>
            <pre className="text-sm overflow-x-auto">
{`# Navigate to your downloads folder
cd ~/Downloads

# Unzip the project
unzip my-hublab-project.zip

# Navigate into the project
cd my-hublab-project`}
            </pre>
          </div>
        </section>

        {/* Step 2: Initialize Git */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Initialize Git Repository</h2>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Git commands</span>
            </div>
            <pre className="text-sm overflow-x-auto">
{`# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit from HubLab

- Exported from HubLab Studio V2
- Production-ready Next.js app
- TypeScript + Tailwind CSS
- 180+ components included"

# Check status (optional)
git status`}
            </pre>
          </div>

          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-900 mb-1">Important</p>
              <p className="text-sm text-yellow-800">
                Make sure you have Git installed. Check with <code className="bg-yellow-100 px-1 rounded">git --version</code>.
                If not installed, download from <a href="https://git-scm.com" target="_blank" rel="noopener noreferrer" className="underline">git-scm.com</a>
              </p>
            </div>
          </div>
        </section>

        {/* Step 3: Create GitHub Repository */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create GitHub Repository</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Option A: GitHub Website</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/new</a></li>
                <li>2. Enter repository name (e.g., "my-hublab-app")</li>
                <li>3. Choose public or private</li>
                <li>4. Click "Create repository"</li>
                <li>5. Follow the instructions shown</li>
              </ol>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Option B: GitHub CLI (Recommended)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Faster workflow using the <code className="bg-gray-100 px-1 rounded">gh</code> command
              </p>
              <div className="bg-gray-900 text-gray-100 rounded p-3 text-xs overflow-x-auto">
                <pre>{`# Install GitHub CLI
brew install gh

# Authenticate
gh auth login

# Create repo and push
gh repo create my-hublab-app \\
  --public \\
  --source=. \\
  --push`}</pre>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Manual push (if using Option A)</span>
            </div>
            <pre className="text-sm overflow-x-auto">
{`# Add GitHub remote (replace USERNAME and REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# Push to GitHub
git branch -M main
git push -u origin main`}
            </pre>
          </div>
        </section>

        {/* Step 4: Deploy */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Deploy to Production</h2>
          </div>

          <div className="grid gap-6">
            {/* Vercel */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 19.7h20L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Vercel (Recommended for Next.js)</h3>
                  <p className="text-sm text-gray-600">Zero-config deployment for Next.js apps</p>
                </div>
              </div>

              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4">
                <pre className="text-sm overflow-x-auto">
{`# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? my-hublab-app
# - In which directory is your code located? ./
# - Auto-detected Next.js. Continue? Yes
# - Production? Yes`}
                </pre>
              </div>

              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-semibold mb-1">Automatic Deployment</p>
                  <p>After first deploy, Vercel will auto-deploy every time you push to GitHub!</p>
                </div>
              </div>
            </div>

            {/* Netlify */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-teal-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Netlify</h3>
                  <p className="text-sm text-gray-600">Great for static sites and jamstack apps</p>
                </div>
              </div>

              <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
{`# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Or link to GitHub for auto-deploys
netlify init`}
                </pre>
              </div>
            </div>

            {/* Cloudflare Pages */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-orange-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">☁</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Cloudflare Pages</h3>
                  <p className="text-sm text-gray-600">Fast global CDN with generous free tier</p>
                </div>
              </div>

              <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
{`# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npx wrangler pages deploy .next`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Workflow */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Workflow (Copy & Paste)</h2>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Full Commands (GitHub CLI + Vercel)</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`# 1. Unzip and navigate to project
cd ~/Downloads
unzip my-hublab-project.zip
cd my-hublab-project

# 2. Initialize Git
git init
git add .
git commit -m "Initial commit from HubLab"

# 3. Create GitHub repo and push
gh repo create my-hublab-app --public --source=. --push

# 4. Deploy to Vercel
vercel

# Done! Your app is live 🎉`}
              </pre>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Alternative: Manual GitHub + Netlify</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
{`# 1. Initialize Git
git init
git add .
git commit -m "Initial commit from HubLab"

# 2. Create repo manually at github.com/new
# Then add remote and push:
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main

# 3. Deploy to Netlify
netlify deploy --prod

# Your app is deployed! ✨`}
              </pre>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Troubleshooting</h2>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">❌ Error: "fatal: not a git repository"</h3>
              <p className="text-sm text-gray-600 mb-2">Make sure you ran <code className="bg-gray-100 px-1 rounded">git init</code> first.</p>
              <code className="text-xs bg-gray-900 text-gray-100 p-2 rounded block">git init</code>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">❌ Error: "gh: command not found"</h3>
              <p className="text-sm text-gray-600 mb-2">Install GitHub CLI:</p>
              <code className="text-xs bg-gray-900 text-gray-100 p-2 rounded block">brew install gh</code>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">❌ Error: "permission denied (publickey)"</h3>
              <p className="text-sm text-gray-600 mb-2">You need to set up SSH keys. Use HTTPS instead:</p>
              <code className="text-xs bg-gray-900 text-gray-100 p-2 rounded block">
                git remote set-url origin https://github.com/USERNAME/REPO.git
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">❌ Build failed on Vercel/Netlify</h3>
              <p className="text-sm text-gray-600 mb-2">Make sure you have all dependencies:</p>
              <code className="text-xs bg-gray-900 text-gray-100 p-2 rounded block">
                npm install && npm run build
              </code>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Resources</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/docs"
              className="border border-gray-200 rounded-lg p-5 hover:border-blue-500 transition"
            >
              <Code className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-sm text-gray-600">Complete guide to using HubLab</p>
            </Link>

            <Link
              href="/examples"
              className="border border-gray-200 rounded-lg p-5 hover:border-purple-500 transition"
            >
              <Download className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Examples</h3>
              <p className="text-sm text-gray-600">Real-world code examples</p>
            </Link>

            <a
              href="https://github.com/raym33/hublab"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 rounded-lg p-5 hover:border-gray-900 transition"
            >
              <GitBranch className="w-8 h-8 text-gray-900 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">GitHub Repository</h3>
              <p className="text-sm text-gray-600">Source code and more examples</p>
            </a>

            <Link
              href="/studio-v2"
              className="border border-gray-200 rounded-lg p-5 hover:border-green-500 transition"
            >
              <Rocket className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Studio V2</h3>
              <p className="text-sm text-gray-600">Build your next app</p>
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

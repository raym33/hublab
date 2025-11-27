'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Loader2, AlertCircle, RefreshCw, Shield } from 'lucide-react'

/**
 * Secure Live Preview Component
 *
 * SECURITY: Uses sandboxed iframe to execute untrusted code safely.
 * Prevents code injection attacks by isolating execution context.
 *
 * Features:
 * - Sandboxed iframe (no access to parent window)
 * - CSP headers to prevent XSS
 * - Restricted permissions
 * - No new Function() or eval()
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox
 */

interface ConsoleMessage {
  type: 'log' | 'warn' | 'error' | 'info'
  message: string
  timestamp: number
}

interface SecureLivePreviewProps {
  code: Record<string, string>
  platform: string
  viewMode?: 'desktop' | 'tablet' | 'mobile'
  onConsoleMessage?: (message: ConsoleMessage) => void
}

export default function SecureLivePreview({
  code,
  platform,
  viewMode = 'desktop',
  onConsoleMessage
}: SecureLivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    setIsLoading(true)
    setError(null)

    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify message is from our iframe
      if (event.source !== iframe.contentWindow) return

      const { type, data } = event.data

      if (type === 'console') {
        const message: ConsoleMessage = {
          type: data.level,
          message: data.message,
          timestamp: Date.now()
        }
        setConsoleMessages(prev => [...prev, message])
        onConsoleMessage?.(message)
      } else if (type === 'error') {
        setError(data.message)
        setIsLoading(false)
      } else if (type === 'ready') {
        setIsLoading(false)
      }
    }

    window.addEventListener('message', handleMessage)

    // Generate and inject secure preview HTML
    const previewHTML = generateSecurePreviewHTML(code)
    const blob = new Blob([previewHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    iframe.src = url

    return () => {
      window.removeEventListener('message', handleMessage)
      URL.revokeObjectURL(url)
    }
  }, [code, onConsoleMessage])

  const handleRefresh = useCallback(() => {
    if (iframeRef.current) {
      const previewHTML = generateSecurePreviewHTML(code)
      const blob = new Blob([previewHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      iframeRef.current.src = url
      // Clean up previous URL
      setTimeout(() => URL.revokeObjectURL(url), 100)
    }
  }, [code])

  const viewModeClasses = useMemo(() => ({
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px]',
    mobile: 'w-[375px] h-[667px]'
  }), [])

  return (
    <div className="relative w-full h-full bg-gray-50">
      {/* Security Badge */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
        <Shield className="w-3 h-3" />
        Sandboxed
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Compiling preview...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">Preview Error</p>
              <p className="text-xs text-red-700 font-mono">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="p-1 hover:bg-red-100 rounded transition"
            >
              <RefreshCw className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      )}

      {/* Sandboxed Iframe */}
      <div className="w-full h-full overflow-auto flex items-center justify-center">
        <iframe
          ref={iframeRef}
          title="Secure Code Preview"
          className={`${viewModeClasses[viewMode]} border-0 bg-white shadow-lg`}
          // SECURITY: Sandbox restrictions prevent most attacks
          // CSP should be set via HTTP headers for srcdoc content
          sandbox="allow-scripts allow-modals"
        />
      </div>

      {/* Console Output */}
      {consoleMessages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 max-h-48 overflow-y-auto bg-gray-900 text-white p-3 text-xs font-mono">
          {consoleMessages.map((msg, i) => (
            <div key={i} className={`py-1 ${
              msg.type === 'error' ? 'text-red-400' :
              msg.type === 'warn' ? 'text-yellow-400' :
              'text-gray-300'
            }`}>
              <span className="text-gray-500">[{msg.type}]</span> {msg.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Generate secure preview HTML using sandboxed iframe
 * No eval() or new Function() - uses Babel in browser instead
 */
function generateSecurePreviewHTML(code: Record<string, string>): string {
  const mainCode = code['src/App.tsx'] || code['src/App.jsx'] ||
                   code['App.tsx'] || code['App.jsx'] ||
                   code['index.tsx'] || code['index.jsx'] || ''

  // Collect CSS
  let cssCode = ''
  Object.keys(code).forEach(fileName => {
    if (fileName.endsWith('.css')) {
      cssCode += code[fileName] + '\n'
    }
  })

  // Extract component name
  const nameMatch = mainCode.match(/export\s+default\s+(?:function|class)\s+(\w+)/) ||
                    mainCode.match(/const\s+(\w+)\s*=/) ||
                    mainCode.match(/function\s+(\w+)\s*\(/)
  const componentName = nameMatch ? nameMatch[1] : 'App'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.tailwindcss.com; img-src data: https:;">
  <title>Secure Preview</title>

  <!-- React from CDN -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      overflow: hidden;
    }
    #root {
      width: 100%;
      min-height: 100vh;
    }
    ${cssCode}
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel" data-type="module">
    const { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer } = React;

    // Secure console wrapper that sends messages to parent
    const secureConsole = {
      log: (...args) => {
        window.parent.postMessage({
          type: 'console',
          data: { level: 'log', message: args.join(' ') }
        }, '*');
      },
      error: (...args) => {
        window.parent.postMessage({
          type: 'console',
          data: { level: 'error', message: args.join(' ') }
        }, '*');
      },
      warn: (...args) => {
        window.parent.postMessage({
          type: 'console',
          data: { level: 'warn', message: args.join(' ') }
        }, '*');
      },
      info: (...args) => {
        window.parent.postMessage({
          type: 'console',
          data: { level: 'info', message: args.join(' ') }
        }, '*');
      }
    };

    // Override global console
    window.console = secureConsole;

    try {
      // User's component code (safely transformed by Babel)
      ${mainCode}

      // Render the component
      const rootElement = document.getElementById('root');
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(${componentName}));

      // Signal ready to parent
      window.parent.postMessage({ type: 'ready' }, '*');
    } catch (error) {
      secureConsole.error(error.message);
      window.parent.postMessage({
        type: 'error',
        data: { message: error.message }
      }, '*');
    }
  </script>
</body>
</html>`
}

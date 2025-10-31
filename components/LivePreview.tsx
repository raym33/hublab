'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'

interface ConsoleMessage {
  type: 'log' | 'warn' | 'error' | 'info'
  message: string
  timestamp: number
}

interface LivePreviewProps {
  code: Record<string, string>
  platform: string
  viewMode?: 'desktop' | 'tablet' | 'mobile'
  onConsoleMessage?: (message: ConsoleMessage) => void
}

export default function LivePreview({
  code,
  platform,
  viewMode = 'desktop',
  onConsoleMessage
}: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])

  // Generate preview HTML with all code
  const generatePreviewHTML = () => {
    const mainCode = code['App.tsx'] || code['index.tsx'] || code['main.tsx'] || ''
    const cssCode = code['styles.css'] || code['App.css'] || ''

    // Extract React component code
    const componentMatch = mainCode.match(/export default function \w+\(\) \{[\s\S]*?\n\}/m)
    const componentCode = componentMatch ? componentMatch[0] : mainCode

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
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

  <script type="text/babel">
    // Intercept console methods to send to parent
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };

    ['log', 'warn', 'error', 'info'].forEach(method => {
      console[method] = function(...args) {
        // Call original console method
        originalConsole[method].apply(console, args);

        // Send to parent window
        window.parent.postMessage({
          type: 'console',
          level: method,
          message: args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '),
          timestamp: Date.now()
        }, '*');
      };
    });

    // Catch runtime errors
    window.addEventListener('error', (event) => {
      window.parent.postMessage({
        type: 'console',
        level: 'error',
        message: \`Runtime Error: \${event.message} at \${event.filename}:\${event.lineno}\`,
        timestamp: Date.now()
      }, '*');
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      window.parent.postMessage({
        type: 'console',
        level: 'error',
        message: \`Unhandled Promise Rejection: \${event.reason}\`,
        timestamp: Date.now()
      }, '*');
    });

    const { useState, useEffect, useRef } = React;

    try {
      ${componentCode.replace('export default function', 'function')}

      // Find the component name
      const componentName = \`${componentCode.match(/function (\w+)/)?.[1] || 'App'}\`;
      const Component = eval(componentName);

      // Render the component
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(Component));

      // Notify parent that preview is ready
      window.parent.postMessage({ type: 'ready' }, '*');
    } catch (error) {
      const errorMessage = error && error.message ? error.message : String(error);
      const errorStack = error && error.stack ? error.stack : '';
      const errorString = typeof error === 'object' ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : String(error);

      console.error('Failed to render component:', errorString);

      document.getElementById('root').innerHTML = \`
        <div style="padding: 2rem; color: #ef4444; font-family: monospace;">
          <h2 style="margin-bottom: 1rem;">Preview Error</h2>
          <pre style="background: #1e1e1e; padding: 1rem; border-radius: 0.5rem; overflow: auto; white-space: pre-wrap;">\${errorMessage || errorString}

\${errorStack}</pre>
        </div>
      \`;
    }
  </script>
</body>
</html>`
  }

  // Update iframe when code changes
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    setIsLoading(true)
    setError(null)

    try {
      const html = generatePreviewHTML()
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      iframe.src = url

      // Cleanup
      return () => {
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview')
      setIsLoading(false)
    }
  }, [code])

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ready') {
        setIsLoading(false)
      } else if (event.data.type === 'console') {
        const message: ConsoleMessage = {
          type: event.data.level,
          message: event.data.message,
          timestamp: event.data.timestamp
        }

        setConsoleMessages(prev => [...prev, message])
        onConsoleMessage?.(message)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onConsoleMessage])

  // Handle iframe load
  const handleIframeLoad = () => {
    // Check if iframe loaded successfully
    const iframe = iframeRef.current
    if (iframe) {
      try {
        // Try to access iframe content to check for errors
        const iframeDoc = iframe.contentDocument
        if (!iframeDoc) {
          setError('Failed to load preview')
          setIsLoading(false)
        }
      } catch (err) {
        setError('Failed to access preview content')
        setIsLoading(false)
      }
    }
  }

  // Refresh preview
  const handleRefresh = () => {
    const iframe = iframeRef.current
    if (iframe) {
      setIsLoading(true)
      setError(null)
      setConsoleMessages([])
      iframe.src = iframe.src // Reload iframe
    }
  }

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      default: return '100%'
    }
  }

  const getPreviewHeight = () => {
    switch (viewMode) {
      case 'mobile': return '667px'
      case 'tablet': return '1024px'
      default: return '100%'
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="absolute top-4 right-4 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 transition-colors"
        title="Refresh preview"
      >
        <RefreshCw className="w-4 h-4 text-gray-300" />
      </button>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <p className="text-sm text-gray-400">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-8">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Preview Error</h3>
                <p className="text-sm text-red-300/80">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview iframe */}
      <div
        className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          width: getPreviewWidth(),
          height: getPreviewHeight(),
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          title="Live Preview"
        />
      </div>
    </div>
  )
}

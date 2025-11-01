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

    // Remove export default and any export statements
    let processedCode = mainCode.replace(/export\s+(default\s+)?/g, '')

    // Extract component name - look for function or const declarations
    const functionMatch = processedCode.match(/function\s+(\w+)\s*\(/) ||
                         processedCode.match(/const\s+(\w+)\s*=/)
    const componentName = functionMatch ? functionMatch[1] : 'App'

    // COMPLETE REWRITE: Ensure component is ALWAYS accessible
    // We'll wrap the entire code and explicitly return the component
    const componentCode = `
      // User's component code
      ${processedCode}

      // Ensure the component is accessible
      window.__COMPONENT__ = typeof ${componentName} !== 'undefined' ? ${componentName} :
                             typeof App !== 'undefined' ? App :
                             (() => React.createElement('div', {style: {color: 'red'}}, 'Component not found'));
    `

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
      // Execute the component code
      ${componentCode}

      // Get the component from window (where we stored it)
      const Component = window.__COMPONENT__;

      if (!Component || typeof Component !== 'function') {
        throw new Error('Component not found or is not a function. Type: ' + typeof Component);
      }

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

    // Safety timeout: hide loading after 10 seconds even if no ready message
    const loadingTimeout = setTimeout(() => {
      console.warn('Preview loading timeout - hiding loading indicator')
      setIsLoading(false)
    }, 10000)

    try {
      const html = generatePreviewHTML()
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      iframe.src = url

      // Cleanup
      return () => {
        clearTimeout(loadingTimeout)
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      clearTimeout(loadingTimeout)
      setError(err instanceof Error ? err.message : 'Failed to generate preview')
      setIsLoading(false)
    }
  }, [code])

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: only accept messages from same origin or blob URLs
      if (event.origin !== window.location.origin && !event.origin.startsWith('null')) {
        return
      }

      if (event.data.type === 'ready') {
        console.log('✅ Preview ready')
        setIsLoading(false)
        setError(null)
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
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 overflow-hidden">
      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 transition-colors touch-manipulation"
        title="Refresh preview"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
      </button>

      {/* Loading Overlay - Improved visibility */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-md z-50 pointer-events-none">
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-purple-400" />
            <p className="text-sm sm:text-base font-medium text-gray-300">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Error State - Responsive */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-40 p-4 sm:p-8">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-red-400 mb-1">Preview Error</h3>
                <p className="text-xs sm:text-sm text-red-300/80 break-words">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview iframe - Responsive */}
      <div
        className="bg-white rounded-md sm:rounded-lg shadow-xl sm:shadow-2xl overflow-hidden transition-all duration-300"
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
          style={{ WebkitAppearance: 'none' }}
        />
      </div>
    </div>
  )
}

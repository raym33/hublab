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
    // Check multiple locations for the main code - prioritize src/ paths
    const mainCode = code['src/App.tsx'] || code['src/App.jsx'] ||
                     code['src/index.tsx'] || code['src/index.jsx'] ||
                     code['src/main.tsx'] || code['src/main.jsx'] ||
                     code['App.tsx'] || code['App.jsx'] ||
                     code['index.tsx'] || code['index.jsx'] ||
                     code['main.tsx'] || code['main.jsx'] || ''

    // Collect all CSS files
    let cssCode = ''
    const cssFiles = ['styles.css', 'App.css', 'src/index.css', 'index.css', 'global.css', 'src/styles.css']
    cssFiles.forEach(fileName => {
      if (code[fileName]) {
        cssCode += code[fileName] + '\\n'
      }
    })

    // Also check for component-specific CSS
    Object.keys(code).forEach(fileName => {
      if (fileName.endsWith('.css') && !cssFiles.includes(fileName)) {
        cssCode += code[fileName] + '\\n'
      }
    })

    // Collect all component files (capsules)
    const componentFiles: Record<string, string> = {}
    Object.keys(code).forEach(fileName => {
      if (fileName.includes('components/') && (fileName.endsWith('.tsx') || fileName.endsWith('.jsx'))) {
        // Extract component name from path like 'src/components/app-container.tsx' -> 'AppContainer'
        const componentPath = fileName.split('/').pop()?.replace(/\.(tsx|jsx)$/, '') || ''
        const componentName = componentPath
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('')

        console.log('Processing component:', fileName, '->', componentName)
        componentFiles[componentName] = code[fileName]
      }
    })

    // Find the component name from the original code
    const nameMatch = mainCode.match(/export\s+default\s+(?:function|class)\s+(\w+)/) ||
                      mainCode.match(/const\s+(\w+)\s*=/) ||
                      mainCode.match(/function\s+(\w+)\s*\(/)
    const componentName = nameMatch ? nameMatch[1] : 'App'

    // Serialize the source code to inject safely
    const serializedSource = JSON.stringify(mainCode)
    const serializedComponentName = JSON.stringify(componentName)
    const serializedComponents = JSON.stringify(componentFiles)

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
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

  <script>
    (function() {
      // Intercept console methods to send to parent
      const originalConsole = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
      };

      ['log', 'info', 'warn', 'error'].forEach((level) => {
        console[level] = function(...args) {
          // Send to parent window
          window.parent.postMessage({
            type: 'console',
            level: level,
            message: args.map(arg =>
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '),
            timestamp: Date.now()
          }, '*');

          // Call original console method
          originalConsole[level](...args);
        };
      });

      // Catch runtime errors with better detail
      window.addEventListener('error', (event) => {
        // Try to get more details about the error
        let errorMessage = 'Runtime Error: ';
        if (event.error) {
          errorMessage += event.error.toString();
          if (event.error.stack) {
            errorMessage += '\\n' + event.error.stack;
          }
        } else {
          errorMessage += event.message || 'Unknown error';
        }

        window.parent.postMessage({
          type: 'console',
          level: 'error',
          message: errorMessage,
          timestamp: Date.now()
        }, '*');

        // Prevent default error handling
        event.preventDefault();
      });

      // Catch unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        window.parent.postMessage({
          type: 'console',
          level: 'error',
          message: 'Unhandled Promise Rejection: ' + event.reason,
          timestamp: Date.now()
        }, '*');
      });

      try {
        // Get the source code and components
        const source = ${serializedSource};
        const componentName = ${serializedComponentName};
        const componentFiles = ${serializedComponents};

        // First, compile all capsule components
        const compiledComponents = {};

        console.log('Component files to compile:', Object.keys(componentFiles));

        // Compile each component file
        Object.keys(componentFiles).forEach(name => {
          try {
            console.log('Compiling component:', name);
            let componentSource = componentFiles[name];

            // Handle export const syntax - convert to module.exports
            componentSource = componentSource.replace(
              /export\\s+const\\s+(\\w+)\\s*=/g,
              'const $1 =\\nmodule.exports.$1 ='
            );

            // Handle export default
            componentSource = componentSource.replace(
              /export\\s+default\\s+/g,
              'module.exports.default = '
            );

            // Remove imports and extract component dependencies
            const lines = componentSource.split('\\n');
            const imports = [];
            const cleanLines = [];

            lines.forEach(line => {
              if (line.trim().startsWith('import ')) {
                imports.push(line);
              } else {
                cleanLines.push(line);
              }
            });

            const cleanSource = cleanLines.join('\\n');

            // Transform component with Babel
            const componentTransformed = Babel.transform(cleanSource, {
              filename: name + '.tsx',
              presets: [
                ['env', { modules: 'commonjs' }],
                'react',
                'typescript'
              ],
              sourceType: 'module'
            });

            // Create a function that returns the component with access to other components
            const componentFunc = new Function(
              'React',
              'useState',
              'useEffect',
              'useRef',
              'useMemo',
              'useCallback',
              'useContext',
              'useReducer',
              'compiledComponents',
              \`
              const exports = {};
              const module = { exports };

              // Make other components available
              const require = (path) => {
                const componentName = path.split('/').pop()?.replace(/\\.(tsx|jsx|ts|js)$/, '')
                  ?.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
                if (compiledComponents[componentName]) {
                  return { default: compiledComponents[componentName], [componentName]: compiledComponents[componentName] };
                }
                return {};
              };

              \${componentTransformed.code}

              // Handle both named and default exports
              const exported = module.exports.default || module.exports['\${name}'] || module.exports || exports.default || exports['\${name}'] || exports;

              // If it's a named export like { AppContainer }, extract it
              if (typeof exported === 'object' && !exported.$$typeof && exported['\${name}']) {
                return exported['\${name}'];
              }

              return exported;
              \`
            );

            // Execute and store the component (will be re-executed later with all components)
            const tempComponent = componentFunc(
              React,
              React.useState,
              React.useEffect,
              React.useRef,
              React.useMemo,
              React.useCallback,
              React.useContext,
              React.useReducer,
              {}  // Empty for now
            );

            // Store the function for later re-execution
            compiledComponents[name] = { func: componentFunc, temp: tempComponent };
          } catch (err) {
            console.warn('Failed to compile component ' + name + ':', err);
            // Create a fallback component
            compiledComponents[name] = {
              func: null,
              temp: (props) => React.createElement('div', { style: { padding: '10px', border: '1px solid #ddd' } },
                'Component ' + name + ' (fallback)')
            };
          }
        });

        // Second pass: re-execute all components with access to each other
        const finalComponents = {};
        Object.keys(compiledComponents).forEach(name => {
          if (compiledComponents[name].func) {
            try {
              const finalComponent = compiledComponents[name].func(
                React,
                React.useState,
                React.useEffect,
                React.useRef,
                React.useMemo,
                React.useCallback,
                React.useContext,
                React.useReducer,
                compiledComponents  // Now all components are available
              );

              // Check if the component returned is valid
              if (typeof finalComponent === 'function') {
                finalComponents[name] = finalComponent;
              } else if (typeof finalComponent === 'object' && finalComponent[name]) {
                finalComponents[name] = finalComponent[name];
              } else {
                console.warn('Component ' + name + ' did not return a valid component:', finalComponent);
                finalComponents[name] = compiledComponents[name].temp;
              }
            } catch (err) {
              console.warn('Failed to finalize component ' + name + ':', err);
              finalComponents[name] = compiledComponents[name].temp;
            }
          } else {
            finalComponents[name] = compiledComponents[name].temp;
          }
        });

        // Replace compiledComponents with finalComponents
        Object.keys(finalComponents).forEach(name => {
          compiledComponents[name] = finalComponents[name];
        });

        // Remove import statements from main source
        const sourceWithoutImports = source
          .split('\\n')
          .filter(line => !line.trim().startsWith('import '))
          .join('\\n');

        // Transform main component with Babel
        const transformed = Babel.transform(sourceWithoutImports, {
          filename: 'App.tsx',
          presets: [
            ['env', { modules: 'commonjs' }],
            'react',
            'typescript'
          ],
          sourceType: 'module'
        });

        // Create minimal CommonJS environment
        const exports = {};
        const module = { exports };
        const require = (specifier) => {
          // Handle React and related packages
          if (specifier === 'react' || specifier.startsWith('react/')) {
            return React;
          }
          if (specifier === 'react-dom' || specifier === 'react-dom/client' || specifier.startsWith('react-dom/')) {
            return ReactDOM;
          }

          // For local imports (starting with ./ or ../) try to find compiled components
          if (specifier.startsWith('./') || specifier.startsWith('../')) {
            // Extract component name from path like './components/app-container' -> 'AppContainer'
            const pathParts = specifier.split('/');
            const fileName = pathParts[pathParts.length - 1].replace(/\.(tsx|jsx|ts|js)$/, '');
            const componentName = fileName
              .split('-')
              .map(part => part.charAt(0).toUpperCase() + part.slice(1))
              .join('');

            console.log('Looking for component:', componentName, 'from', specifier);
            console.log('Available components:', Object.keys(compiledComponents));

            // Check if we have this compiled component
            if (compiledComponents[componentName]) {
              console.log('Found compiled component:', componentName);
              const component = compiledComponents[componentName];

              // If it's an object with the component as a property, extract it
              if (typeof component === 'object' && component[componentName]) {
                return component;
              }

              // Return as a module with the component as default and named export
              return {
                default: component,
                [componentName]: component,
                ...compiledComponents  // Also expose all components
              };
            }

            // Also check for exact match without case transformation
            const availableNames = Object.keys(compiledComponents);
            for (const availableName of availableNames) {
              if (fileName.toLowerCase() === availableName.toLowerCase() ||
                  fileName.replace(/-/g, '').toLowerCase() === availableName.toLowerCase()) {
                console.log('Found component with case match:', availableName);
                const component = compiledComponents[availableName];

                // If it's an object with the component as a property, return it directly
                if (typeof component === 'object' && component[availableName]) {
                  return component;
                }

                return {
                  default: component,
                  [availableName]: component,
                  ...compiledComponents
                };
              }
            }

            // Fallback - return all components so any import can find what it needs
            console.warn('Component not found directly, returning all components for:', specifier);

            // Create a module object with all components
            const moduleExports = {
              default: compiledComponents.AppContainer || ((props) => React.createElement('div', { className: 'app-container', style: { padding: '20px' }, ...props }, props.children))
            };

            // Add all compiled components as named exports
            for (const [name, comp] of Object.entries(compiledComponents)) {
              moduleExports[name] = comp;
            }

            // Also provide common fallbacks
            moduleExports.AppContainer = moduleExports.AppContainer || compiledComponents.AppContainer || ((props) => React.createElement('div', { className: 'app-container', style: { padding: '20px' }, ...props }, props.children));
            moduleExports.InputText = moduleExports.InputText || compiledComponents.InputText || ((props) => React.createElement('input', { type: 'text', className: 'input-text', ...props }));
            moduleExports.ButtonPrimary = moduleExports.ButtonPrimary || compiledComponents.ButtonPrimary || ((props) => React.createElement('button', { className: 'btn-primary', ...props }, props.children || 'Button'));
            moduleExports.TextDisplay = moduleExports.TextDisplay || compiledComponents.TextDisplay || ((props) => React.createElement('div', { className: 'text-display', ...props }, props.text || props.children));
            moduleExports.ListView = moduleExports.ListView || compiledComponents.ListView || ((props) => React.createElement('div', { className: 'list-view', ...props }, props.children));

            return moduleExports;
          }

          // For other npm packages, return a mock
          console.warn('Mock import for:', specifier);
          return {};
        };

        // Make React hooks and utilities available globally
        const { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, createContext, Fragment } = React;
        const Router = { push: () => {}, replace: () => {}, back: () => {} };  // Mock router
        const useRouter = () => Router;

        // Execute the transformed code
        const evaluator = new Function(
          'exports',
          'module',
          'require',
          'React',
          'ReactDOM',
          'useState',
          'useEffect',
          'useRef',
          'useMemo',
          'useCallback',
          'useContext',
          'useReducer',
          'createContext',
          'Fragment',
          'useRouter',
          transformed.code
        );

        evaluator(
          exports,
          module,
          require,
          React,
          ReactDOM,
          useState,
          useEffect,
          useRef,
          useMemo,
          useCallback,
          useContext,
          useReducer,
          createContext,
          Fragment,
          useRouter
        );

        // Try to get the component from various export patterns
        const Component =
          (module.exports && module.exports.default) ||
          (module.exports && module.exports[componentName]) ||
          (exports && exports.default) ||
          (exports && exports[componentName]) ||
          module.exports ||
          exports;

        if (!Component) {
          throw new Error('No component found. Expected default export or export named "' + componentName + '"');
        }

        if (typeof Component !== 'function') {
          throw new Error('Component is not a function. Found: ' + typeof Component);
        }

        // Create an error boundary component
        class ErrorBoundary extends React.Component {
          constructor(props) {
            super(props);
            this.state = { hasError: false, error: null };
          }

          static getDerivedStateFromError(error) {
            return { hasError: true, error };
          }

          componentDidCatch(error, errorInfo) {
            console.error('React Error Boundary caught:', error, errorInfo);
            window.parent.postMessage({
              type: 'console',
              level: 'error',
              message: 'React Component Error: ' + error.toString() + '\\n' + errorInfo.componentStack,
              timestamp: Date.now()
            }, '*');
          }

          render() {
            if (this.state.hasError) {
              return React.createElement('div',
                { style: { color: 'red', padding: '20px', fontFamily: 'monospace' } },
                React.createElement('h2', null, 'Component Error'),
                React.createElement('pre', null, this.state.error && this.state.error.toString())
              );
            }
            return this.props.children;
          }
        }

        // Render the component
        const container = document.getElementById('root');
        if (!container) {
          throw new Error('Root container not found');
        }

        const root = ReactDOM.createRoot(container);

        // Wrap component in error boundary
        const componentWithErrorBoundary = React.createElement(
          ErrorBoundary,
          null,
          React.createElement(Component)
        );

        root.render(componentWithErrorBoundary);

        // Notify parent that preview is ready
        window.parent.postMessage({ type: 'ready' }, '*');

      } catch (error) {
        const errorMessage = error && error.message ? error.message : String(error);
        const errorStack = error && error.stack ? error.stack : '';

        console.error('Preview Error:', error);

        document.getElementById('root').innerHTML =
          '<div style="padding: 2rem; color: #ef4444; font-family: monospace;">' +
          '<h2 style="margin-bottom: 1rem;">Preview Error</h2>' +
          '<pre style="background: #1e1e1e; padding: 1rem; border-radius: 0.5rem; overflow: auto; white-space: pre-wrap; color: #ff6b6b;">' +
          errorMessage + '\\n\\n' + errorStack +
          '</pre></div>';
      }
    })();
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

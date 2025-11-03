// ============================================
// CODE GENERATOR
// Generate code from HubLab projects
// ============================================

import type { Project, Capsule, ExportFormat } from '@/types/api'

// ============================================
// CAPSULE TO CODE CONVERTERS
// ============================================

function capsuleToReactComponent(capsule: Capsule, indent: number = 0): string {
  const spaces = '  '.repeat(indent)
  const componentMap: Record<string, string> = {
    header: 'Header',
    sidebar: 'Sidebar',
    hero: 'Hero',
    'feature-grid': 'FeatureGrid',
    'data-table': 'DataTable',
    'stats-grid': 'StatsGrid',
    form: 'Form',
    'bar-chart': 'BarChart',
    'product-grid': 'ProductGrid',
  }

  const componentName = componentMap[capsule.type] || 'div'
  const props = Object.entries(capsule.props)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`
      }
      if (typeof value === 'boolean') {
        return value ? key : ''
      }
      return `${key}={${JSON.stringify(value)}}`
    })
    .filter(Boolean)
    .join(' ')

  if (capsule.children && capsule.children.length > 0) {
    const childrenCode = capsule.children
      .map((child) => capsuleToReactComponent(child, indent + 1))
      .join('\n')
    return `${spaces}<${componentName}${props ? ' ' + props : ''}>\n${childrenCode}\n${spaces}</${componentName}>`
  }

  return `${spaces}<${componentName}${props ? ' ' + props : ''} />`
}

function generateReactImports(capsules: Capsule[]): string {
  const componentTypes = new Set<string>()

  function collectTypes(caps: Capsule[]) {
    caps.forEach((capsule) => {
      componentTypes.add(capsule.type)
      if (capsule.children) {
        collectTypes(capsule.children)
      }
    })
  }

  collectTypes(capsules)

  const imports = Array.from(componentTypes).map((type) => {
    const componentMap: Record<string, string> = {
      header: 'Header',
      sidebar: 'Sidebar',
      hero: 'Hero',
      'feature-grid': 'FeatureGrid',
      'data-table': 'DataTable',
      'stats-grid': 'StatsGrid',
      form: 'Form',
      'bar-chart': 'BarChart',
      'product-grid': 'ProductGrid',
    }
    const componentName = componentMap[type]
    return `import { ${componentName} } from '@/components/${type}'`
  })

  return imports.join('\n')
}

// ============================================
// EXPORT TO NEXT.JS
// ============================================

export function exportToNextJS(project: Project): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = []

  // Main page
  const mainPage = `${generateReactImports(project.capsules)}

export default function Page() {
  return (
    <main>
${project.capsules.map((c) => capsuleToReactComponent(c, 3)).join('\n')}
    </main>
  )
}
`

  files.push({
    path: 'app/page.tsx',
    content: mainPage,
  })

  // Package.json
  const packageJson = {
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      react: '^18',
      'react-dom': '^18',
      next: '14.2.0',
      typescript: '^5',
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
    },
  }

  files.push({
    path: 'package.json',
    content: JSON.stringify(packageJson, null, 2),
  })

  // Next config
  files.push({
    path: 'next.config.js',
    content: `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`,
  })

  // tsconfig
  files.push({
    path: 'tsconfig.json',
    content: JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2017',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: {
            '@/*': ['./*'],
          },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      },
      null,
      2
    ),
  })

  // README
  files.push({
    path: 'README.md',
    content: `# ${project.name}

${project.description || 'Generated with HubLab'}

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Deploy

Deploy to Vercel:

\`\`\`bash
vercel
\`\`\`

Built with [HubLab](https://hublab.dev)
`,
  })

  return files
}

// ============================================
// EXPORT TO REACT
// ============================================

export function exportToReact(project: Project): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = []

  // Main component
  const mainComponent = `${generateReactImports(project.capsules)}

export default function App() {
  return (
    <div className="app">
${project.capsules.map((c) => capsuleToReactComponent(c, 3)).join('\n')}
    </div>
  )
}
`

  files.push({
    path: 'src/App.tsx',
    content: mainComponent,
  })

  // Index
  files.push({
    path: 'src/index.tsx',
    content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,
  })

  // Package.json
  files.push({
    path: 'package.json',
    content: JSON.stringify(
      {
        name: project.name.toLowerCase().replace(/\s+/g, '-'),
        version: '0.1.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
        },
        devDependencies: {
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          '@vitejs/plugin-react': '^4.0.0',
          typescript: '^5.0.0',
          vite: '^4.4.0',
        },
      },
      null,
      2
    ),
  })

  // Vite config
  files.push({
    path: 'vite.config.ts',
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`,
  })

  return files
}

// ============================================
// EXPORT TO HTML
// ============================================

export function exportToHTML(project: Project): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = []

  function capsuleToHTML(capsule: Capsule, indent: number = 0): string {
    const spaces = '  '.repeat(indent)
    const tagMap: Record<string, string> = {
      header: 'header',
      hero: 'section',
      'feature-grid': 'section',
      form: 'form',
      'stats-grid': 'section',
    }

    const tag = tagMap[capsule.type] || 'div'
    const className = `capsule-${capsule.type}`

    if (capsule.children && capsule.children.length > 0) {
      const childrenHTML = capsule.children
        .map((child) => capsuleToHTML(child, indent + 1))
        .join('\n')
      return `${spaces}<${tag} class="${className}">\n${childrenHTML}\n${spaces}</${tag}>`
    }

    return `${spaces}<${tag} class="${className}"></${tag}>`
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${project.capsules.map((c) => capsuleToHTML(c, 1)).join('\n')}
</body>
</html>
`

  files.push({
    path: 'index.html',
    content: html,
  })

  // Basic CSS
  files.push({
    path: 'styles.css',
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: ${project.theme.typography.fontFamily}, sans-serif;
  background-color: ${project.theme.colors.background};
  color: ${project.theme.colors.foreground};
}

/* Add your custom styles here */
`,
  })

  return files
}

// ============================================
// EXPORT TO VUE
// ============================================

export function exportToVue(project: Project): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = []

  const vueComponent = `<template>
  <div id="app">
${project.capsules.map((c) => capsuleToReactComponent(c, 2)).join('\n')}
  </div>
</template>

<script setup lang="ts">
// Import components here
</script>

<style>
body {
  font-family: ${project.theme.typography.fontFamily}, sans-serif;
  background-color: ${project.theme.colors.background};
  color: ${project.theme.colors.foreground};
}
</style>
`

  files.push({
    path: 'src/App.vue',
    content: vueComponent,
  })

  // Package.json
  files.push({
    path: 'package.json',
    content: JSON.stringify(
      {
        name: project.name.toLowerCase().replace(/\s+/g, '-'),
        version: '0.1.0',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          vue: '^3.3.0',
        },
        devDependencies: {
          '@vitejs/plugin-vue': '^4.0.0',
          typescript: '^5.0.0',
          vite: '^4.4.0',
          'vue-tsc': '^1.8.0',
        },
      },
      null,
      2
    ),
  })

  return files
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

export function generateExport(
  project: Project,
  format: ExportFormat
): { path: string; content: string }[] {
  switch (format) {
    case 'nextjs':
      return exportToNextJS(project)
    case 'react':
      return exportToReact(project)
    case 'html':
      return exportToHTML(project)
    case 'vue':
      return exportToVue(project)
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

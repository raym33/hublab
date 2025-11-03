// ============================================
// SDK Types
// Re-export API types for convenience
// ============================================

export type ExportFormat = 'nextjs' | 'react' | 'html' | 'vue'
export type DeployPlatform = 'vercel' | 'netlify' | 'cloudflare'
export type ProjectStatus = 'draft' | 'building' | 'ready' | 'deployed' | 'error'
export type CapsuleCategory =
  | 'layout'
  | 'navigation'
  | 'forms'
  | 'data-display'
  | 'charts'
  | 'media'
  | 'ecommerce'
  | 'auth'

export interface Project {
  id: string
  userId: string
  name: string
  description?: string
  template?: string
  theme: ThemeConfig
  capsules: Capsule[]
  integrations: IntegrationConfig[]
  status: ProjectStatus
  previewUrl?: string
  deployUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  typography: {
    fontFamily: string
    headingFont?: string
  }
  spacing: 'compact' | 'normal' | 'relaxed'
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export interface Capsule {
  id: string
  type: string
  category: CapsuleCategory
  props: Record<string, any>
  children?: Capsule[]
  dataSource?: DataSource
  position?: {
    x: number
    y: number
  }
}

export interface DataSource {
  type: 'supabase' | 'firebase' | 'rest' | 'graphql' | 'static'
  config: any
}

export interface IntegrationConfig {
  type: string
  config: Record<string, any>
}

export interface CreateProjectRequest {
  name: string
  description?: string
  template?: 'blank' | 'dashboard' | 'landing' | 'ecommerce' | 'admin' | 'blog'
  theme?: string | ThemeConfig
}

export interface ExportRequest {
  format: ExportFormat
  options?: {
    includeTests?: boolean
    includeReadme?: boolean
    includeEnvExample?: boolean
    typescript?: boolean
  }
}

export interface DeployRequest {
  platform: DeployPlatform
  config?: {
    domain?: string
    envVars?: Record<string, string>
    buildCommand?: string
    outputDirectory?: string
  }
}

export interface AddCapsuleRequest {
  type: string
  props?: Record<string, any>
  dataSource?: DataSource
  parentId?: string
}

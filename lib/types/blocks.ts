// ============================================
// HUBLAB BLOCKS SYSTEM - TypeScript Types
// ============================================

import { Database } from './database';

// Base types from Supabase
export type Block = Database['public']['Tables']['blocks']['Row'];
export type BlockInsert = Database['public']['Tables']['blocks']['Insert'];
export type BlockUpdate = Database['public']['Tables']['blocks']['Update'];

export type BlockPurchase = Database['public']['Tables']['block_purchases']['Row'];
export type BlockReview = Database['public']['Tables']['block_reviews']['Row'];
export type Page = Database['public']['Tables']['pages']['Row'];
export type BlockCollection = Database['public']['Tables']['block_collections']['Row'];

// ============================================
// Block Categories
// ============================================

export type BlockCategory =
  | 'ui'          // UI components (buttons, cards, etc.)
  | 'functional'  // Functional components (forms, auth, etc.)
  | 'integration' // API integrations (Stripe, email, etc.)
  | 'ai'          // AI-powered components (chatbots, etc.)
  | 'theme';      // Theme/styling blocks

export const BLOCK_CATEGORIES: { value: BlockCategory; label: string; description: string }[] = [
  { value: 'ui', label: 'UI Components', description: 'Visual components like buttons, cards, modals' },
  { value: 'functional', label: 'Functional', description: 'Forms, authentication, data tables' },
  { value: 'integration', label: 'Integrations', description: 'Payment, email, analytics integrations' },
  { value: 'ai', label: 'AI-Powered', description: 'Chatbots, content generators, assistants' },
  { value: 'theme', label: 'Themes', description: 'Complete theme packages and styling' },
];

// ============================================
// Block Schema (JSON Schema for props)
// ============================================

export interface BlockSchema {
  $schema?: string;
  title: string;
  description?: string;
  type: 'object';
  properties: Record<string, BlockPropertySchema>;
  required?: string[];
}

export interface BlockPropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  title?: string;
  description?: string;
  default?: any;
  enum?: any[];
  items?: BlockPropertySchema; // For arrays
  properties?: Record<string, BlockPropertySchema>; // For objects
}

// ============================================
// Block Instance (used in pages)
// ============================================

export interface BlockInstance {
  id: string;              // Unique instance ID
  blockId: string;         // Reference to block in marketplace
  type: string;            // Block type (e.g., "chatbot-openai")
  props: Record<string, any>; // Props configured by user
  position?: BlockPosition;
  children?: BlockInstance[]; // Nested blocks
}

export interface BlockPosition {
  x?: number;
  y?: number;
  width?: string | number;
  height?: string | number;
  order?: number; // For flex/grid layouts
}

// ============================================
// Block Manifest (vibe.block.json)
// ============================================

export interface BlockManifest {
  name: string;
  key: string;              // Unique identifier (e.g., "chatbot-openai-v1")
  version: string;
  description: string;
  author: {
    name: string;
    email?: string;
    url?: string;
  };

  // Pricing
  price: number;            // 0 = free

  // Files
  component: string;        // Path to React component
  schema: string;           // Path to JSON schema
  server?: string;          // Optional server-side code
  docs?: string;            // Path to markdown docs
  preview?: string;         // Preview image
  demo?: string;            // Live demo URL

  // Technical
  category: BlockCategory;
  tags: string[];
  dependencies: Record<string, string>; // NPM dependencies
  techStack: string[];

  // Permissions (for future sandboxing)
  permissions?: BlockPermission[];
}

export type BlockPermission =
  | 'db:read'
  | 'db:write'
  | 'api:external'
  | 'storage:read'
  | 'storage:write'
  | 'env:read';

// ============================================
// Block Component Props (standard interface)
// ============================================

export interface BlockComponentProps<T = Record<string, any>> {
  // User-configured props (from schema)
  ...T;

  // System props (provided by renderer)
  blockId?: string;
  instanceId?: string;
  className?: string;
  style?: React.CSSProperties;

  // Context (optional, for advanced blocks)
  context?: BlockContext;
}

export interface BlockContext {
  userId?: string;
  pageId?: string;
  isEditor?: boolean; // True when in editor mode
  onUpdate?: (props: Record<string, any>) => void;
}

// ============================================
// Block Registry (for renderer)
// ============================================

export interface BlockRegistry {
  [key: string]: {
    manifest: BlockManifest;
    component: React.ComponentType<any>;
    schema: BlockSchema;
  };
}

// ============================================
// Block Lifecycle Hooks (for server-side blocks)
// ============================================

export interface BlockLifecycleHooks {
  // Server-side hooks
  onInstall?: (ctx: BlockContext) => Promise<void>;
  onUninstall?: (ctx: BlockContext) => Promise<void>;
  onRender?: (props: any, ctx: BlockContext) => Promise<any>;

  // API routes (for blocks that need server endpoints)
  registerRoutes?: (router: any) => void;
}

// ============================================
// Page Layout Types
// ============================================

export type PageLayout = 'default' | 'fullwidth' | 'sidebar-left' | 'sidebar-right' | 'custom';
export type PageTheme = 'light' | 'dark' | 'custom';

export interface PageConfig {
  layout: PageLayout;
  theme: PageTheme;
  customCSS?: string;
  customJS?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

// ============================================
// Block Editor State
// ============================================

export interface EditorState {
  blocks: BlockInstance[];
  selectedBlockId?: string;
  draggedBlockId?: string;
  zoom: number;
  gridSize: number;
  showGrid: boolean;
  mode: 'edit' | 'preview' | 'code';
}

// ============================================
// Marketplace Filters
// ============================================

export interface BlockFilters {
  category?: BlockCategory;
  tags?: string[];
  priceRange?: { min: number; max: number };
  isFree?: boolean;
  rating?: number; // Minimum rating
  search?: string;
  sortBy?: 'popular' | 'recent' | 'rating' | 'price-asc' | 'price-desc';
}

// ============================================
// Block Stats
// ============================================

export interface BlockStats {
  downloads: number;
  installs: number;
  rating: number;
  reviewCount: number;
  revenue?: number; // For creators
}

// ============================================
// Helper Types
// ============================================

export interface BlockWithCreator extends Block {
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export interface BlockWithStats extends Block {
  stats: BlockStats;
  userHasPurchased?: boolean;
  userReview?: BlockReview;
}

// ============================================
// API Response Types
// ============================================

export interface BlocksResponse {
  blocks: BlockWithStats[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BlockDetailResponse extends BlockWithStats {
  reviews: BlockReview[];
  similarBlocks: Block[];
}

// ============================================
// Database Extension (for type safety)
// ============================================

declare module './database' {
  interface Database {
    public: {
      Tables: {
        blocks: {
          Row: {
            id: string;
            creator_id: string;
            title: string;
            description: string | null;
            category: BlockCategory;
            tags: string[];
            price: number;
            is_free: boolean;
            block_key: string;
            version: string;
            component_url: string | null;
            schema_url: string;
            server_url: string | null;
            docs_url: string | null;
            preview_image_url: string | null;
            demo_url: string | null;
            dependencies: any;
            tech_stack: string[];
            downloads_count: number;
            installs_count: number;
            rating: number;
            published: boolean;
            approved: boolean;
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database['public']['Tables']['blocks']['Row'], 'id' | 'is_free' | 'downloads_count' | 'installs_count' | 'rating' | 'created_at' | 'updated_at'>;
          Update: Partial<Database['public']['Tables']['blocks']['Insert']>;
        };
        block_purchases: {
          Row: {
            id: string;
            buyer_id: string;
            block_id: string;
            stripe_checkout_id: string | null;
            amount: number;
            status: 'pending' | 'completed' | 'failed' | 'refunded';
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database['public']['Tables']['block_purchases']['Row'], 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Database['public']['Tables']['block_purchases']['Insert']>;
        };
        block_reviews: {
          Row: {
            id: string;
            block_id: string;
            reviewer_id: string;
            rating: number;
            comment: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database['public']['Tables']['block_reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Database['public']['Tables']['block_reviews']['Insert']>;
        };
        pages: {
          Row: {
            id: string;
            creator_id: string;
            title: string;
            slug: string;
            description: string | null;
            blocks: BlockInstance[];
            layout: PageLayout;
            theme: PageTheme;
            published: boolean;
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database['public']['Tables']['pages']['Row'], 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Database['public']['Tables']['pages']['Insert']>;
        };
        block_collections: {
          Row: {
            id: string;
            creator_id: string;
            title: string;
            description: string | null;
            slug: string;
            block_ids: string[];
            price: number;
            preview_image_url: string | null;
            published: boolean;
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database['public']['Tables']['block_collections']['Row'], 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Database['public']['Tables']['block_collections']['Insert']>;
        };
      };
    };
  }
}

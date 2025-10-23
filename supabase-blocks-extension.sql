-- ============================================
-- HUBLAB BLOCKS SYSTEM - Phase 1 MVP
-- Extension to support individual blocks marketplace
-- ============================================

-- Blocks table (individual reusable components)
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'ui', -- ui, functional, integration, ai, theme
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Pricing
  price DECIMAL(10, 2) NOT NULL DEFAULT 0, -- 0 = free
  is_free BOOLEAN GENERATED ALWAYS AS (price = 0) STORED,

  -- Block definition
  block_key TEXT NOT NULL UNIQUE, -- e.g., "chatbot-openai-v1"
  version TEXT NOT NULL DEFAULT '1.0.0',

  -- Files (stored in Supabase Storage)
  component_url TEXT, -- React component (.tsx)
  schema_url TEXT NOT NULL, -- JSON schema for props
  server_url TEXT, -- Optional server-side code
  docs_url TEXT, -- Markdown documentation
  preview_image_url TEXT,
  demo_url TEXT, -- Live preview URL

  -- Technical details
  dependencies JSONB DEFAULT '[]'::jsonb, -- NPM dependencies
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[], -- React, Next.js, etc.

  -- Stats
  downloads_count INTEGER DEFAULT 0,
  installs_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,

  -- Status
  published BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE, -- Admin approval required

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Block purchases (for paid blocks)
CREATE TABLE IF NOT EXISTS block_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,

  stripe_checkout_id TEXT UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(buyer_id, block_id) -- One purchase per user per block
);

-- Block reviews
CREATE TABLE IF NOT EXISTS block_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(block_id, reviewer_id) -- One review per user per block
);

-- Pages table (for visual page builder)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Metadata
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,

  -- Page structure (JSON schema with blocks)
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [{"type": "hero", "blockId": "uuid", "props": {...}, "position": {...}}]

  -- Layout settings
  layout TEXT DEFAULT 'default', -- default, fullwidth, sidebar, etc.
  theme TEXT DEFAULT 'light', -- light, dark, custom

  -- Status
  published BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Block collections (curated sets of blocks)
CREATE TABLE IF NOT EXISTS block_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,

  block_ids UUID[] DEFAULT ARRAY[]::UUID[], -- Array of block IDs

  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  preview_image_url TEXT,

  published BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_blocks_creator_id ON blocks(creator_id);
CREATE INDEX IF NOT EXISTS idx_blocks_category ON blocks(category);
CREATE INDEX IF NOT EXISTS idx_blocks_block_key ON blocks(block_key);
CREATE INDEX IF NOT EXISTS idx_blocks_published ON blocks(published);
CREATE INDEX IF NOT EXISTS idx_blocks_approved ON blocks(approved);
CREATE INDEX IF NOT EXISTS idx_blocks_is_free ON blocks(is_free);
CREATE INDEX IF NOT EXISTS idx_blocks_created_at ON blocks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blocks_rating ON blocks(rating DESC);

CREATE INDEX IF NOT EXISTS idx_block_purchases_buyer_id ON block_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_block_purchases_block_id ON block_purchases(block_id);
CREATE INDEX IF NOT EXISTS idx_block_purchases_status ON block_purchases(status);

CREATE INDEX IF NOT EXISTS idx_block_reviews_block_id ON block_reviews(block_id);
CREATE INDEX IF NOT EXISTS idx_block_reviews_reviewer_id ON block_reviews(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_pages_creator_id ON pages(creator_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(published);

CREATE INDEX IF NOT EXISTS idx_block_collections_slug ON block_collections(slug);
CREATE INDEX IF NOT EXISTS idx_block_collections_published ON block_collections(published);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_collections ENABLE ROW LEVEL SECURITY;

-- Blocks policies
CREATE POLICY "Published and approved blocks are viewable by everyone" ON blocks
  FOR SELECT USING (published = true AND approved = true);

CREATE POLICY "Users can view their own blocks" ON blocks
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create blocks" ON blocks
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own blocks" ON blocks
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own blocks" ON blocks
  FOR DELETE USING (auth.uid() = creator_id);

-- Block purchases policies
CREATE POLICY "Users can view their own block purchases" ON block_purchases
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Creators can view purchases of their blocks" ON block_purchases
  FOR SELECT USING (
    block_id IN (
      SELECT id FROM blocks WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own block purchases" ON block_purchases
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Block reviews policies
CREATE POLICY "Block reviews are viewable by everyone" ON block_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own block reviews" ON block_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own block reviews" ON block_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own block reviews" ON block_reviews
  FOR DELETE USING (auth.uid() = reviewer_id);

-- Pages policies
CREATE POLICY "Published pages are viewable by everyone" ON pages
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view their own pages" ON pages
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create pages" ON pages
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own pages" ON pages
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own pages" ON pages
  FOR DELETE USING (auth.uid() = creator_id);

-- Block collections policies
CREATE POLICY "Published collections are viewable by everyone" ON block_collections
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view their own collections" ON block_collections
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create collections" ON block_collections
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own collections" ON block_collections
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own collections" ON block_collections
  FOR DELETE USING (auth.uid() = creator_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if user has purchased a block (or it's free)
CREATE OR REPLACE FUNCTION has_access_to_block(p_block_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  block_is_free BOOLEAN;
  has_purchased BOOLEAN;
BEGIN
  -- Check if block is free
  SELECT is_free INTO block_is_free FROM blocks WHERE id = p_block_id;

  IF block_is_free THEN
    RETURN TRUE;
  END IF;

  -- Check if user purchased it
  SELECT EXISTS (
    SELECT 1 FROM block_purchases
    WHERE block_id = p_block_id
      AND buyer_id = p_user_id
      AND status = 'completed'
  ) INTO has_purchased;

  RETURN has_purchased;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update block rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_block_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE blocks
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM block_reviews
    WHERE block_id = COALESCE(NEW.block_id, OLD.block_id)
  )
  WHERE id = COALESCE(NEW.block_id, OLD.block_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update block rating
DROP TRIGGER IF EXISTS trigger_update_block_rating ON block_reviews;
CREATE TRIGGER trigger_update_block_rating
AFTER INSERT OR UPDATE OR DELETE ON block_reviews
FOR EACH ROW
EXECUTE FUNCTION update_block_rating();

-- Increment download counter
CREATE OR REPLACE FUNCTION increment_block_downloads(p_block_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE blocks
  SET downloads_count = downloads_count + 1
  WHERE id = p_block_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment install counter
CREATE OR REPLACE FUNCTION increment_block_installs(p_block_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE blocks
  SET installs_count = installs_count + 1
  WHERE id = p_block_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create bucket for block files
INSERT INTO storage.buckets (id, name, public)
VALUES ('blocks', 'blocks', false)
ON CONFLICT DO NOTHING;

-- RLS for block files
CREATE POLICY "Users can upload to their folder in blocks" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'blocks' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Block files are downloadable by purchasers" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'blocks' AND (
      -- Creator can always access
      (storage.foldername(name))[1] = auth.uid()::text OR
      -- Others need to have purchased (check via block_key in path)
      EXISTS (
        SELECT 1 FROM blocks b
        JOIN block_purchases bp ON b.id = bp.block_id
        WHERE bp.buyer_id = auth.uid()
          AND bp.status = 'completed'
          AND name LIKE '%' || b.block_key || '%'
      )
    )
  );

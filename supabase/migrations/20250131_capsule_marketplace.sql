-- Create user_capsules table for the marketplace
CREATE TABLE IF NOT EXISTS public.user_capsules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Capsule Identity
  capsule_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL DEFAULT '1.0.0',

  -- Metadata
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  tags TEXT[] DEFAULT '{}',

  -- AI Metadata
  ai_description TEXT NOT NULL,
  usage_examples TEXT[] DEFAULT '{}',
  related_capsules TEXT[] DEFAULT '{}',
  complexity VARCHAR(50) DEFAULT 'simple',

  -- Code & Implementation
  platforms JSONB NOT NULL, -- { web: { engine, code }, desktop: {...}, etc }
  inputs JSONB DEFAULT '[]', -- Array of input definitions
  outputs JSONB DEFAULT '[]', -- Array of output definitions
  dependencies JSONB DEFAULT '{}', -- { capsules: [], npm: {} }

  -- Publishing Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, pending_review, approved, rejected
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Moderation
  review_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  review_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,

  -- Stats
  download_count INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  star_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,

  -- Pricing (for future monetization)
  price_cents INTEGER DEFAULT 0, -- 0 = free
  license VARCHAR(100) DEFAULT 'MIT',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_capsules_user_id ON public.user_capsules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_capsules_capsule_id ON public.user_capsules(capsule_id);
CREATE INDEX IF NOT EXISTS idx_user_capsules_status ON public.user_capsules(status);
CREATE INDEX IF NOT EXISTS idx_user_capsules_is_public ON public.user_capsules(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_capsules_category ON public.user_capsules(category);
CREATE INDEX IF NOT EXISTS idx_user_capsules_tags ON public.user_capsules USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_capsules_review_status ON public.user_capsules(review_status) WHERE review_status = 'pending';

-- Updated_at trigger
CREATE TRIGGER update_user_capsules_updated_at
  BEFORE UPDATE ON public.user_capsules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE public.user_capsules ENABLE ROW LEVEL SECURITY;

-- Users can view their own capsules
CREATE POLICY "Users can view own capsules"
  ON public.user_capsules
  FOR SELECT
  USING (auth.uid() = user_id);

-- Everyone can view approved public capsules
CREATE POLICY "Anyone can view approved public capsules"
  ON public.user_capsules
  FOR SELECT
  USING (is_public = true AND status = 'approved');

-- Users can create capsules
CREATE POLICY "Users can create capsules"
  ON public.user_capsules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own draft/pending capsules
CREATE POLICY "Users can update own capsules"
  ON public.user_capsules
  FOR UPDATE
  USING (auth.uid() = user_id AND status IN ('draft', 'pending_review'))
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own capsules
CREATE POLICY "Users can delete own capsules"
  ON public.user_capsules
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create capsule_stars table
CREATE TABLE IF NOT EXISTS public.capsule_stars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  capsule_id UUID NOT NULL REFERENCES public.user_capsules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(capsule_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_capsule_stars_capsule ON public.capsule_stars(capsule_id);
CREATE INDEX IF NOT EXISTS idx_capsule_stars_user ON public.capsule_stars(user_id);

ALTER TABLE public.capsule_stars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stars"
  ON public.capsule_stars
  FOR SELECT
  USING (true);

CREATE POLICY "Users can star capsules"
  ON public.capsule_stars
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unstar capsules"
  ON public.capsule_stars
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create capsule_reviews table (user ratings and reviews)
CREATE TABLE IF NOT EXISTS public.capsule_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  capsule_id UUID NOT NULL REFERENCES public.user_capsules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(capsule_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_capsule_reviews_capsule ON public.capsule_reviews(capsule_id);
CREATE INDEX IF NOT EXISTS idx_capsule_reviews_user ON public.capsule_reviews(user_id);

CREATE TRIGGER update_capsule_reviews_updated_at
  BEFORE UPDATE ON public.capsule_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.capsule_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON public.capsule_reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.capsule_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.capsule_reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.capsule_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create capsule_usage_logs table (track when capsules are used in compilations)
CREATE TABLE IF NOT EXISTS public.capsule_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  capsule_id UUID NOT NULL REFERENCES public.user_capsules(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  composition_id UUID REFERENCES public.saved_compositions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_capsule_usage_capsule ON public.capsule_usage_logs(capsule_id);
CREATE INDEX IF NOT EXISTS idx_capsule_usage_user ON public.capsule_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_capsule_usage_composition ON public.capsule_usage_logs(composition_id);

ALTER TABLE public.capsule_usage_logs ENABLE ROW LEVEL SECURITY;

-- Only system can write usage logs (handled via API)
CREATE POLICY "Service role can manage usage logs"
  ON public.capsule_usage_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create capsule_versions table (version history)
CREATE TABLE IF NOT EXISTS public.capsule_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  capsule_id UUID NOT NULL REFERENCES public.user_capsules(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  platforms JSONB NOT NULL,
  inputs JSONB DEFAULT '[]',
  outputs JSONB DEFAULT '[]',
  dependencies JSONB DEFAULT '{}',
  changelog TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(capsule_id, version)
);

CREATE INDEX IF NOT EXISTS idx_capsule_versions_capsule ON public.capsule_versions(capsule_id);

ALTER TABLE public.capsule_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view versions of public capsules"
  ON public.capsule_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_capsules uc
      WHERE uc.id = capsule_id AND uc.is_public = true AND uc.status = 'approved'
    )
  );

CREATE POLICY "Users can view versions of own capsules"
  ON public.capsule_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_capsules uc
      WHERE uc.id = capsule_id AND uc.user_id = auth.uid()
    )
  );

-- Create view for marketplace with stats
CREATE OR REPLACE VIEW public.marketplace_capsules AS
SELECT
  uc.*,
  COALESCE(stars.star_count, 0) as stars_actual,
  COALESCE(reviews.review_count, 0) as review_count,
  COALESCE(reviews.avg_rating, 0) as avg_rating,
  u.email as author_email,
  u.raw_user_meta_data->>'full_name' as author_name,
  u.raw_user_meta_data->>'avatar_url' as author_avatar
FROM public.user_capsules uc
LEFT JOIN (
  SELECT capsule_id, COUNT(*) as star_count
  FROM public.capsule_stars
  GROUP BY capsule_id
) stars ON uc.id = stars.capsule_id
LEFT JOIN (
  SELECT capsule_id, COUNT(*) as review_count, AVG(rating) as avg_rating
  FROM public.capsule_reviews
  GROUP BY capsule_id
) reviews ON uc.id = reviews.capsule_id
LEFT JOIN auth.users u ON uc.user_id = u.id
WHERE uc.is_public = true AND uc.status = 'approved';

-- Grant permissions
GRANT SELECT ON public.marketplace_capsules TO authenticated;
GRANT SELECT ON public.marketplace_capsules TO anon;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_capsule_download(capsule_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_capsules
  SET download_count = download_count + 1
  WHERE id = capsule_uuid;
END;
$$;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_capsule_usage(capsule_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_capsules
  SET usage_count = usage_count + 1
  WHERE id = capsule_uuid;
END;
$$;

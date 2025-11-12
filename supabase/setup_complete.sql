-- ============================================================================
-- HubLab Complete Database Setup
-- This script consolidates all migrations for easy setup
-- Execute this in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 1: WAITLIST TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view waitlist" ON waitlist
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role can update waitlist" ON waitlist
  FOR UPDATE TO service_role USING (true);

-- ============================================================================
-- PART 2: SAVED COMPOSITIONS
-- ============================================================================

-- Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS public.saved_compositions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  prompt TEXT,
  platform VARCHAR(50) NOT NULL DEFAULT 'web',
  composition JSONB NOT NULL,
  compilation_result JSONB,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  fork_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_saved_compositions_user_id ON public.saved_compositions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_compositions_public ON public.saved_compositions(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_saved_compositions_platform ON public.saved_compositions(platform);
CREATE INDEX IF NOT EXISTS idx_saved_compositions_tags ON public.saved_compositions USING GIN(tags);

CREATE TRIGGER update_saved_compositions_updated_at
  BEFORE UPDATE ON public.saved_compositions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.saved_compositions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own compositions" ON public.saved_compositions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public compositions" ON public.saved_compositions
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create compositions" ON public.saved_compositions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own compositions" ON public.saved_compositions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own compositions" ON public.saved_compositions
  FOR DELETE USING (auth.uid() = user_id);

-- Composition forks
CREATE TABLE IF NOT EXISTS public.composition_forks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id UUID NOT NULL REFERENCES public.saved_compositions(id) ON DELETE CASCADE,
  forked_id UUID NOT NULL REFERENCES public.saved_compositions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_composition_forks_original ON public.composition_forks(original_id);
CREATE INDEX IF NOT EXISTS idx_composition_forks_forked ON public.composition_forks(forked_id);

ALTER TABLE public.composition_forks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forks" ON public.composition_forks
  FOR SELECT USING (true);

CREATE POLICY "Users can create forks" ON public.composition_forks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Composition likes
CREATE TABLE IF NOT EXISTS public.composition_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  composition_id UUID NOT NULL REFERENCES public.saved_compositions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(composition_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_composition_likes_composition ON public.composition_likes(composition_id);
CREATE INDEX IF NOT EXISTS idx_composition_likes_user ON public.composition_likes(user_id);

ALTER TABLE public.composition_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON public.composition_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like compositions" ON public.composition_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike compositions" ON public.composition_likes
  FOR DELETE USING (auth.uid() = user_id);

-- View for public compositions with stats
CREATE OR REPLACE VIEW public.public_compositions_with_stats AS
SELECT
  sc.*,
  COALESCE(likes.like_count, 0) as like_count,
  COALESCE(forks.fork_count_actual, 0) as fork_count_actual,
  u.email as author_email,
  u.raw_user_meta_data->>'full_name' as author_name,
  u.raw_user_meta_data->>'avatar_url' as author_avatar
FROM public.saved_compositions sc
LEFT JOIN (
  SELECT composition_id, COUNT(*) as like_count
  FROM public.composition_likes
  GROUP BY composition_id
) likes ON sc.id = likes.composition_id
LEFT JOIN (
  SELECT original_id, COUNT(*) as fork_count_actual
  FROM public.composition_forks
  GROUP BY original_id
) forks ON sc.id = forks.original_id
LEFT JOIN auth.users u ON sc.user_id = u.id
WHERE sc.is_public = true;

GRANT SELECT ON public.public_compositions_with_stats TO authenticated;
GRANT SELECT ON public.public_compositions_with_stats TO anon;

-- ============================================================================
-- PART 3: CAPSULE MARKETPLACE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_capsules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  capsule_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  ai_description TEXT NOT NULL,
  usage_examples TEXT[] DEFAULT '{}',
  related_capsules TEXT[] DEFAULT '{}',
  complexity VARCHAR(50) DEFAULT 'simple',
  platforms JSONB NOT NULL,
  inputs JSONB DEFAULT '[]',
  outputs JSONB DEFAULT '[]',
  dependencies JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft',
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  review_status VARCHAR(50) DEFAULT 'pending',
  review_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  star_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  price_cents INTEGER DEFAULT 0,
  license VARCHAR(100) DEFAULT 'MIT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_user_capsules_user_id ON public.user_capsules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_capsules_capsule_id ON public.user_capsules(capsule_id);
CREATE INDEX IF NOT EXISTS idx_user_capsules_status ON public.user_capsules(status);
CREATE INDEX IF NOT EXISTS idx_user_capsules_is_public ON public.user_capsules(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_capsules_category ON public.user_capsules(category);
CREATE INDEX IF NOT EXISTS idx_user_capsules_tags ON public.user_capsules USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_capsules_review_status ON public.user_capsules(review_status) WHERE review_status = 'pending';

CREATE TRIGGER update_user_capsules_updated_at
  BEFORE UPDATE ON public.user_capsules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.user_capsules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own capsules" ON public.user_capsules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view approved public capsules" ON public.user_capsules
  FOR SELECT USING (is_public = true AND status = 'approved');

CREATE POLICY "Users can create capsules" ON public.user_capsules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own capsules" ON public.user_capsules
  FOR UPDATE USING (auth.uid() = user_id AND status IN ('draft', 'pending_review'))
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own capsules" ON public.user_capsules
  FOR DELETE USING (auth.uid() = user_id);

-- Capsule stars
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

CREATE POLICY "Anyone can view stars" ON public.capsule_stars
  FOR SELECT USING (true);

CREATE POLICY "Users can star capsules" ON public.capsule_stars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unstar capsules" ON public.capsule_stars
  FOR DELETE USING (auth.uid() = user_id);

-- Capsule reviews
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
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.capsule_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.capsule_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.capsule_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.capsule_reviews
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.capsule_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Capsule usage logs
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

CREATE POLICY "Service role can manage usage logs" ON public.capsule_usage_logs
  FOR ALL USING (true) WITH CHECK (true);

-- Capsule versions
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

CREATE POLICY "Anyone can view versions of public capsules" ON public.capsule_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_capsules uc
      WHERE uc.id = capsule_versions.capsule_id AND uc.is_public = true AND uc.status = 'approved'
    )
  );

CREATE POLICY "Users can view versions of own capsules" ON public.capsule_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_capsules uc
      WHERE uc.id = capsule_versions.capsule_id AND uc.user_id = auth.uid()
    )
  );

-- Marketplace view with stats
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

GRANT SELECT ON public.marketplace_capsules TO authenticated;
GRANT SELECT ON public.marketplace_capsules TO anon;

-- Helper functions
CREATE OR REPLACE FUNCTION increment_capsule_download(capsule_uuid UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.user_capsules
  SET download_count = download_count + 1
  WHERE id = capsule_uuid;
END;
$$;

CREATE OR REPLACE FUNCTION increment_capsule_usage(capsule_uuid UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.user_capsules
  SET usage_count = usage_count + 1
  WHERE id = capsule_uuid;
END;
$$;

-- ============================================================================
-- PART 4: CRM AMBIENT AGENT (Optional - for future HubSpot/CRM features)
-- ============================================================================

CREATE TABLE IF NOT EXISTS crm_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crm_type TEXT NOT NULL CHECK (crm_type IN ('hubspot', 'salesforce', 'pipedrive', 'zoho')),
  oauth_token TEXT NOT NULL,
  refresh_token TEXT,
  instance_url TEXT,
  field_mappings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, crm_type)
);

CREATE INDEX IF NOT EXISTS idx_crm_connections_user_id ON crm_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_connections_is_active ON crm_connections(is_active);

CREATE TRIGGER update_crm_connections_updated_at
  BEFORE UPDATE ON crm_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE crm_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own CRM connections" ON crm_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CRM connections" ON crm_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CRM connections" ON crm_connections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CRM connections" ON crm_connections
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

-- Verify tables were created
SELECT
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'waitlist',
    'saved_compositions',
    'composition_forks',
    'composition_likes',
    'user_capsules',
    'capsule_stars',
    'capsule_reviews',
    'capsule_usage_logs',
    'capsule_versions',
    'crm_connections'
  )
ORDER BY tablename;

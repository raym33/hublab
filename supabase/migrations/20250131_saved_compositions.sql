-- Create saved_compositions table
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

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_compositions_user_id ON public.saved_compositions(user_id);

-- Create index on is_public for public gallery
CREATE INDEX IF NOT EXISTS idx_saved_compositions_public ON public.saved_compositions(is_public) WHERE is_public = true;

-- Create index on platform
CREATE INDEX IF NOT EXISTS idx_saved_compositions_platform ON public.saved_compositions(platform);

-- Create index on tags using GIN for array searches
CREATE INDEX IF NOT EXISTS idx_saved_compositions_tags ON public.saved_compositions USING GIN(tags);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_saved_compositions_updated_at
  BEFORE UPDATE ON public.saved_compositions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.saved_compositions ENABLE ROW LEVEL SECURITY;

-- Users can view their own compositions
CREATE POLICY "Users can view own compositions"
  ON public.saved_compositions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view public compositions
CREATE POLICY "Anyone can view public compositions"
  ON public.saved_compositions
  FOR SELECT
  USING (is_public = true);

-- Users can insert their own compositions
CREATE POLICY "Users can create compositions"
  ON public.saved_compositions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own compositions
CREATE POLICY "Users can update own compositions"
  ON public.saved_compositions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own compositions
CREATE POLICY "Users can delete own compositions"
  ON public.saved_compositions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create composition_forks table to track forks
CREATE TABLE IF NOT EXISTS public.composition_forks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id UUID NOT NULL REFERENCES public.saved_compositions(id) ON DELETE CASCADE,
  forked_id UUID NOT NULL REFERENCES public.saved_compositions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on original_id
CREATE INDEX IF NOT EXISTS idx_composition_forks_original ON public.composition_forks(original_id);

-- Create index on forked_id
CREATE INDEX IF NOT EXISTS idx_composition_forks_forked ON public.composition_forks(forked_id);

-- Enable RLS on forks
ALTER TABLE public.composition_forks ENABLE ROW LEVEL SECURITY;

-- Anyone can view forks
CREATE POLICY "Anyone can view forks"
  ON public.composition_forks
  FOR SELECT
  USING (true);

-- Users can create forks
CREATE POLICY "Users can create forks"
  ON public.composition_forks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create composition_likes table
CREATE TABLE IF NOT EXISTS public.composition_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  composition_id UUID NOT NULL REFERENCES public.saved_compositions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(composition_id, user_id)
);

-- Create index on composition_id
CREATE INDEX IF NOT EXISTS idx_composition_likes_composition ON public.composition_likes(composition_id);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_composition_likes_user ON public.composition_likes(user_id);

-- Enable RLS on likes
ALTER TABLE public.composition_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes
CREATE POLICY "Anyone can view likes"
  ON public.composition_likes
  FOR SELECT
  USING (true);

-- Users can like compositions
CREATE POLICY "Users can like compositions"
  ON public.composition_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unlike compositions
CREATE POLICY "Users can unlike compositions"
  ON public.composition_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a view for public compositions with stats
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

-- Grant permissions
GRANT SELECT ON public.public_compositions_with_stats TO authenticated;
GRANT SELECT ON public.public_compositions_with_stats TO anon;

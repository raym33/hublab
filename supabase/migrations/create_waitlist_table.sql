-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP WITH TIME ZONE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for public signup)
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to read (for admin purposes)
CREATE POLICY "Authenticated users can view waitlist" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to update (for marking as notified)
CREATE POLICY "Service role can update waitlist" ON waitlist
  FOR UPDATE
  TO service_role
  USING (true);

-- Comments
COMMENT ON TABLE waitlist IS 'Stores email addresses for launch notifications';
COMMENT ON COLUMN waitlist.email IS 'User email address (unique)';
COMMENT ON COLUMN waitlist.name IS 'User name';
COMMENT ON COLUMN waitlist.notified IS 'Whether user has been notified of launch';
COMMENT ON COLUMN waitlist.notified_at IS 'When user was notified';

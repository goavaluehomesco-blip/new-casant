-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Creates hr_info and job_postings tables

-- Create hr_info table
CREATE TABLE IF NOT EXISTS public.hr_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL DEFAULT 'Join Our Team',
  subheading TEXT,
  description TEXT,
  hr_name TEXT,
  hr_email TEXT,
  hr_phone TEXT,
  hr_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_postings table
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  job_type TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.hr_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for anon key)
CREATE POLICY "Allow public read" ON public.hr_info
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.job_postings
  FOR SELECT USING (true);

-- Allow authenticated (admin) to do all operations
CREATE POLICY "Allow admin all" ON public.hr_info
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin all" ON public.job_postings
  FOR ALL USING (auth.role() = 'authenticated');

-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- 1. job_postings table
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  description TEXT NOT NULL,
  requirements TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'job_postings' AND policyname = 'Public can read job_postings'
  ) THEN
    CREATE POLICY "Public can read job_postings" ON public.job_postings FOR SELECT USING (true);
  END IF;
END $$;

-- 2. hr_info table
CREATE TABLE IF NOT EXISTS public.hr_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

ALTER TABLE public.hr_info ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'hr_info' AND policyname = 'Public can read hr_info'
  ) THEN
    CREATE POLICY "Public can read hr_info" ON public.hr_info FOR SELECT USING (true);
  END IF;
END $$;

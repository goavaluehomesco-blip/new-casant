-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Creates the blog_posts table used by the Blog section on the landing page
-- and the /blog listing + /blog/[slug] detail pages.

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  -- Collage images shown on the card / at the top of the post (array of image URLs)
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Ordered content blocks, e.g.
  -- [{"type":"text","value":"Some paragraph..."},{"type":"image","url":"https://...","caption":"Optional caption"}]
  -- This lets an admin insert an image right after any paragraph of content.
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_active_order_idx ON public.blog_posts (is_active, display_order);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access (used by the anon key on the live site)
DROP POLICY IF EXISTS "Public can read blog_posts" ON public.blog_posts;
CREATE POLICY "Public can read blog_posts" ON public.blog_posts
  FOR SELECT USING (true);

-- Allow full read/write access for the anon key — the admin panel enforces
-- its own session check server-side (requireAdminSession), so RLS here just
-- needs to not block the anon key the admin client uses (same pattern as
-- gallery_projects, testimonials, etc.)
DROP POLICY IF EXISTS "Allow all writes to blog_posts" ON public.blog_posts;
CREATE POLICY "Allow all writes to blog_posts" ON public.blog_posts
  FOR ALL USING (true) WITH CHECK (true);

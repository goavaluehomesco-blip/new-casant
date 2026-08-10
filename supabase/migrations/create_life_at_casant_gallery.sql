-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- "Life at Casant" — team/culture/event-behind-the-scenes gallery shown on its own page,
-- plus a teaser row on the About page.

CREATE TABLE IF NOT EXISTS public.life_at_casant_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.life_at_casant_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'life_at_casant_images' AND policyname = 'Public read life_at_casant_images'
  ) THEN
    CREATE POLICY "Public read life_at_casant_images" ON public.life_at_casant_images
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'life_at_casant_images' AND policyname = 'Admin full access life_at_casant_images'
  ) THEN
    CREATE POLICY "Admin full access life_at_casant_images" ON public.life_at_casant_images
      FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
      );
  END IF;
END $$;

-- Keep updated_at fresh on edits (matches the trigger pattern used elsewhere in this project)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS life_at_casant_images_set_updated_at ON public.life_at_casant_images;

CREATE TRIGGER life_at_casant_images_set_updated_at
  BEFORE UPDATE ON public.life_at_casant_images
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

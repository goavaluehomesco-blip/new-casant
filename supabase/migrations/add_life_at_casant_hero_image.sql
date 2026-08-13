-- Add a configurable hero/background image for the "Life at Casant" page
ALTER TABLE public.company_info
  ADD COLUMN IF NOT EXISTS life_at_casant_hero_image_url TEXT;

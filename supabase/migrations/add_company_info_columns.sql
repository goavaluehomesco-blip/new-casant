-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Adds missing columns to company_info required for admin Images, About, and Site settings.

ALTER TABLE public.company_info
  ADD COLUMN IF NOT EXISTS track_record_images      JSONB    NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS divider_image_url         TEXT,
  ADD COLUMN IF NOT EXISTS inventory_hero_image_url  TEXT,
  ADD COLUMN IF NOT EXISTS about_hero_image_url      TEXT,
  ADD COLUMN IF NOT EXISTS about_story_image_url     TEXT,
  ADD COLUMN IF NOT EXISTS maintenance_mode          BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS social_facebook           TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram          TEXT,
  ADD COLUMN IF NOT EXISTS social_linkedin           TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube            TEXT;

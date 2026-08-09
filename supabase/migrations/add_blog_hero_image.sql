-- Add a dedicated full-width hero image field to blog_posts
alter table public.blog_posts
  add column if not exists hero_image text;

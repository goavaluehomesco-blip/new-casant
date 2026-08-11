-- ============================================================
-- Casant Events — Partners Section
-- Run this in the Supabase SQL Editor to create the table.
-- ============================================================

create table if not exists public.partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  image_url     text,
  website_url   text,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on every row change (reuses the shared trigger function)
drop trigger if exists partners_set_updated_at on public.partners;
create trigger partners_set_updated_at
  before update on public.partners
  for each row execute procedure public.set_updated_at();

-- Enable Row Level Security
alter table public.partners enable row level security;

-- Drop any existing policies first (safe to re-run)
drop policy if exists "Public read partners"   on public.partners;
drop policy if exists "Public insert partners" on public.partners;
drop policy if exists "Public update partners" on public.partners;
drop policy if exists "Public delete partners" on public.partners;

-- Public read access (landing page can fetch without auth)
create policy "Public read partners"
  on public.partners for select
  using (true);

-- Open write access (anon key used by admin panel, matches all other tables)
create policy "Public insert partners"
  on public.partners for insert
  with check (true);

create policy "Public update partners"
  on public.partners for update
  using (true);

create policy "Public delete partners"
  on public.partners for delete
  using (true);

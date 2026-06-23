-- ============================================================
-- Casant Events — Clientele Section
-- Run this in the Supabase SQL Editor to create the table.
-- ============================================================

create table if not exists public.clientele (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  image_url     text,
  website_url   text,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clientele_set_updated_at on public.clientele;
create trigger clientele_set_updated_at
  before update on public.clientele
  for each row execute procedure public.set_updated_at();

-- Enable Row Level Security
alter table public.clientele enable row level security;

-- Drop any existing policies first (safe to re-run)
drop policy if exists "Public read clientele"          on public.clientele;
drop policy if exists "Public insert clientele"        on public.clientele;
drop policy if exists "Public update clientele"        on public.clientele;
drop policy if exists "Public delete clientele"        on public.clientele;
drop policy if exists "Authenticated insert clientele" on public.clientele;
drop policy if exists "Authenticated update clientele" on public.clientele;
drop policy if exists "Authenticated delete clientele" on public.clientele;

-- Public read access (landing page can fetch without auth)
create policy "Public read clientele"
  on public.clientele for select
  using (true);

-- Open write access (anon key used by admin panel, matches all other tables)
create policy "Public insert clientele"
  on public.clientele for insert
  with check (true);

create policy "Public update clientele"
  on public.clientele for update
  using (true);

create policy "Public delete clientele"
  on public.clientele for delete
  using (true);

-- Optional seed data — remove if you don't want sample rows
insert into public.clientele (name, image_url, display_order) values
  ('Taj Hotels',        null, 1),
  ('ITC Hotels',        null, 2),
  ('Marriott',          null, 3),
  ('Oberoi Group',      null, 4),
  ('Leela Palaces',     null, 5),
  ('Hyatt Regency',     null, 6);

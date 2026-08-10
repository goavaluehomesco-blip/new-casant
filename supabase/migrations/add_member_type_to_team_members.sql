-- Distinguish Directors (leadership) from Employees (team) within team_members.
-- Existing rows default to 'director' so current "Meet Our Directors" data is unaffected.

alter table public.team_members
  add column if not exists member_type text not null default 'director';

alter table public.team_members
  drop constraint if exists team_members_member_type_check;

alter table public.team_members
  add constraint team_members_member_type_check check (member_type in ('director', 'employee'));

create index if not exists team_members_member_type_idx on public.team_members (member_type);

-- Backfill safety: ensure no nulls slipped in before the constraint existed
update public.team_members set member_type = 'director' where member_type is null;

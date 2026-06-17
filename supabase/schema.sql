-- ============================================================
-- S³ database schema
-- Paste this whole file into the Supabase SQL Editor and click Run.
-- Safe to run more than once.
-- ============================================================

-- Weekly entries, one row per item. A "week" is the Monday's date;
-- day_index is 0 = Mon … 6 = Sun.
create table if not exists items (
  id          uuid primary key default gen_random_uuid(),
  person      text not null,
  week_start  date not null,
  day_index   smallint not null check (day_index between 0 and 6),
  text        text not null check (char_length(text) between 1 and 200),
  created_at  timestamptz not null default now()
);

-- Fast lookups for "load this week".
create index if not exists items_week_idx on items (week_start);

-- The encouragement / notes feed.
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  author      text not null,
  text        text not null check (char_length(text) between 1 and 300),
  created_at  timestamptz not null default now()
);

create index if not exists notes_created_idx on notes (created_at desc);

-- ============================================================
-- Access policy
-- This is a tiny private family app with no logins, so we let the
-- public "anon" key read and write. The app URL is the only secret.
-- (If you ever want a guard, add a shared-code check here later.)
-- ============================================================
alter table items enable row level security;
alter table notes enable row level security;

drop policy if exists "anon all items" on items;
create policy "anon all items" on items
  for all using (true) with check (true);

drop policy if exists "anon all notes" on notes;
create policy "anon all notes" on notes
  for all using (true) with check (true);

-- ============================================================
-- Turn on realtime so every phone updates live.
-- ============================================================
alter publication supabase_realtime add table items;
alter publication supabase_realtime add table notes;

-- Simple shared list for Waterloo visit
-- Bennie and Leora, each with their own list of items to bring home / groceries

drop table if exists items cascade;

create table items (
  id          uuid primary key default gen_random_uuid(),
  person      text not null check (person in ('Bennie', 'Leora')),
  text        text not null check (char_length(text) between 1 and 200),
  category    text not null default 'Groceries',
  status      text not null default 'entered',
  created_at  timestamptz not null default now()
);

create index items_person_idx on items (person);

-- Realtime
alter table items enable row level security;
drop policy if exists "allow all items" on items;
create policy "allow all items" on items for all using (true) with check (true);
alter publication supabase_realtime add table items;

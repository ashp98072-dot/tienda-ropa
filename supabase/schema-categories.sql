-- Categorías personalizadas (además de las fijas del código)
-- Corre en SQL Editor después de schema.sql

create table if not exists categories (
  slug text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

drop policy if exists "Public read categories" on categories;
create policy "Public read categories"
  on categories for select
  using (true);

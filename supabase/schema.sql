-- I NEED YOU — un solo proyecto Supabase
-- Pega esto en: Supabase → SQL Editor → New query → Run

-- Productos
create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  description text not null default '',
  category text not null,
  segment text not null,
  gender text not null,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  image text not null default '',
  images text[] not null default '{}',
  is_new boolean not null default false,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_idx on products (active);
create index if not exists products_slug_idx on products (slug);

-- Pedidos
create table if not exists orders (
  id text primary key,
  customer jsonb not null,
  payment_method text not null,
  shipping_method text not null default 'delivery',
  items jsonb not null default '[]',
  subtotal numeric(12,2) not null,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  status text not null,
  qpaypro_token text,
  qpaypro_trans_id text,
  payment_response_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);

-- Imágenes de producto (Storage)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Lectura pública de imágenes (service_role sube sin policy extra)
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- RLS en tablas: el servidor usa service_role (bypass RLS).
-- Si quieres endurecer después, se pueden añadir policies de lectura pública.
alter table products enable row level security;
alter table orders enable row level security;

drop policy if exists "Public read active products" on products;
create policy "Public read active products"
  on products for select
  using (active = true);

-- Pedidos: solo service_role (sin policy = anon no lee/escribe)

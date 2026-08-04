-- Existencias / agotado
alter table products
  add column if not exists in_stock boolean not null default true;

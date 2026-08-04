-- Galería: varias fotos por producto
-- Corre en SQL Editor si ya tenías schema.sql sin la columna images

alter table products
  add column if not exists images text[] not null default '{}';

-- Rellenar con la imagen principal donde la galería esté vacía
update products
set images = array[image]
where (images is null or cardinality(images) = 0)
  and coalesce(image, '') <> '';

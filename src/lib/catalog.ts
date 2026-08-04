import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { SEED_PRODUCTS } from "./seed-products";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import type { Product } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  description: string;
  category: Product["category"];
  segment: Product["segment"];
  gender: Product["gender"];
  sizes: string[];
  colors: string[];
  image: string;
  images?: string[] | null;
  is_new: boolean;
  featured: boolean;
  active: boolean;
};

function normalizeImages(product: Pick<Product, "image" | "images">) {
  const fromList = (product.images ?? []).map((u) => u.trim()).filter(Boolean);
  if (fromList.length) return fromList;
  const single = product.image?.trim();
  return single ? [single] : [];
}

function fromDb(row: DbProduct): Product {
  const images = normalizeImages({
    image: row.image ?? "",
    images: row.images ?? undefined,
  });
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    description: row.description ?? "",
    category: row.category,
    segment: row.segment,
    gender: row.gender,
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    image: images[0] ?? row.image ?? "",
    images,
    isNew: row.is_new,
    featured: row.featured,
    active: row.active,
  };
}

function toDb(product: Product): DbProduct {
  const images = normalizeImages(product);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    segment: product.segment,
    gender: product.gender,
    sizes: product.sizes,
    colors: product.colors,
    image: images[0] ?? product.image ?? "",
    images,
    is_new: Boolean(product.isNew),
    featured: Boolean(product.featured),
    active: product.active !== false,
  };
}

/* ---------- File fallback (solo local sin Supabase) ---------- */

async function ensureCatalog() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(PRODUCTS_FILE, "utf8");
  } catch {
    await writeFile(
      PRODUCTS_FILE,
      JSON.stringify(SEED_PRODUCTS, null, 2),
      "utf8",
    );
  }
}

async function listProductsFile(includeInactive?: boolean) {
  await ensureCatalog();
  const raw = await readFile(PRODUCTS_FILE, "utf8");
  let products: Product[] = [];
  try {
    products = JSON.parse(raw) as Product[];
  } catch {
    products = [...SEED_PRODUCTS];
  }
  products = products.map((p) => {
    const images = normalizeImages(p);
    return { ...p, images, image: images[0] ?? p.image ?? "" };
  });
  if (includeInactive) return products;
  return products.filter((p) => p.active !== false);
}

async function saveProductsFile(products: Product[]) {
  await ensureCatalog();
  await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
}

/* ---------- API pública ---------- */

export async function listProducts(options?: {
  includeInactive?: boolean;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return listProductsFile(options?.includeInactive);
  }

  const sb = getSupabaseAdmin();
  let query = sb.from("products").select("*").order("created_at", {
    ascending: false,
  });
  if (!options?.includeInactive) {
    query = query.eq("active", true);
  }
  const { data, error } = await query;
  if (error) {
    // Build/deploy no debe caer si aún no corriste el SQL
    console.error(`Supabase products: ${error.message}`);
    return [];
  }
  return (data as DbProduct[]).map(fromDb);
}

export async function getProductById(id: string) {
  if (!isSupabaseConfigured()) {
    const products = await listProductsFile(true);
    return products.find((p) => p.id === id);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Supabase product: ${error.message}`);
  return data ? fromDb(data as DbProduct) : undefined;
}

export async function getProductBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const products = await listProductsFile(false);
    return products.find((p) => p.slug === slug);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw new Error(`Supabase product: ${error.message}`);
  return data ? fromDb(data as DbProduct) : undefined;
}

export async function upsertProduct(product: Product) {
  if (!isSupabaseConfigured()) {
    const products = await listProductsFile(true);
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx >= 0) products[idx] = product;
    else products.push(product);
    await saveProductsFile(products);
    return product;
  }

  const row = toDb(product);
  const sb = getSupabaseAdmin();
  let { error } = await sb.from("products").upsert(row, { onConflict: "id" });
  // Si aún no corrieron el SQL de images, guardar solo la principal
  if (error && /images/i.test(error.message)) {
    const { images: _images, ...withoutImages } = row;
    ({ error } = await sb
      .from("products")
      .upsert(withoutImages, { onConflict: "id" }));
  }
  if (error) throw new Error(`Supabase upsert: ${error.message}`);
  return product;
}

export async function deleteProduct(id: string) {
  if (!isSupabaseConfigured()) {
    const products = await listProductsFile(true);
    const next = products.filter((p) => p.id !== id);
    await saveProductsFile(next);
    return next.length < products.length;
  }

  const { error, count } = await getSupabaseAdmin()
    .from("products")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error(`Supabase delete: ${error.message}`);
  return (count ?? 0) > 0;
}

/** Siembra el catálogo demo una vez (útil al conectar Supabase vacío) */
export async function seedProductsIfEmpty() {
  if (!isSupabaseConfigured()) return { seeded: false, count: 0 };
  const existing = await listProducts({ includeInactive: true });
  if (existing.length > 0) return { seeded: false, count: existing.length };

  const sb = getSupabaseAdmin();
  const { error } = await sb.from("products").insert(SEED_PRODUCTS.map(toDb));
  if (error) throw new Error(`Supabase seed: ${error.message}`);
  return { seeded: true, count: SEED_PRODUCTS.length };
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function newProductId() {
  return `p-${Date.now().toString(36)}`;
}

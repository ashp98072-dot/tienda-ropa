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
  is_new: boolean;
  featured: boolean;
  active: boolean;
};

function fromDb(row: DbProduct): Product {
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
    image: row.image ?? "",
    isNew: row.is_new,
    featured: row.featured,
    active: row.active,
  };
}

function toDb(product: Product): DbProduct {
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
    image: product.image,
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

  const { error } = await getSupabaseAdmin()
    .from("products")
    .upsert(toDb(product), { onConflict: "id" });
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

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { CATEGORY_LABELS, slugifyCategory } from "./products";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "categories.json");

export type StoreCategory = {
  slug: string;
  name: string;
};

const DEFAULTS: StoreCategory[] = Object.entries(CATEGORY_LABELS).map(
  ([slug, name]) => ({ slug, name }),
);

async function readFileCats(): Promise<StoreCategory[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreCategory[];
    return mergeCats(DEFAULTS, parsed);
  } catch {
    await writeFile(FILE, JSON.stringify([], null, 2), "utf8");
    return [...DEFAULTS];
  }
}

async function writeFileCats(extra: StoreCategory[]) {
  await mkdir(DATA_DIR, { recursive: true });
  const onlyCustom = extra.filter(
    (c) => !(c.slug in CATEGORY_LABELS),
  );
  await writeFile(FILE, JSON.stringify(onlyCustom, null, 2), "utf8");
}

function mergeCats(...lists: StoreCategory[][]) {
  const map = new Map<string, StoreCategory>();
  for (const list of lists) {
    for (const c of list) {
      if (!c.slug || !c.name) continue;
      map.set(c.slug, { slug: c.slug, name: c.name });
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "es"),
  );
}

export async function listCategories(): Promise<StoreCategory[]> {
  if (!isSupabaseConfigured()) {
    return readFileCats();
  }

  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select("slug, name")
    .order("name");

  if (error) {
    // Tabla aún no creada → defaults + archivo
    console.error(`Supabase categories: ${error.message}`);
    return readFileCats();
  }

  return mergeCats(DEFAULTS, (data as StoreCategory[]) ?? []);
}

export async function createCategory(name: string): Promise<StoreCategory> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Escribe un nombre de categoría");

  const slug = slugifyCategory(trimmed);
  if (!slug) throw new Error("Nombre de categoría no válido");

  const cat: StoreCategory = { slug, name: trimmed };

  if (!isSupabaseConfigured()) {
    const existing = await readFileCats();
    if (existing.some((c) => c.slug === slug)) {
      return existing.find((c) => c.slug === slug)!;
    }
    const custom = existing.filter((c) => !(c.slug in CATEGORY_LABELS));
    await writeFileCats([...custom, cat]);
    return cat;
  }

  const { error } = await getSupabaseAdmin()
    .from("categories")
    .upsert(cat, { onConflict: "slug" });

  if (error) {
    // Fallback local si falta la tabla
    console.error(`Supabase create category: ${error.message}`);
    const existing = await readFileCats();
    const custom = existing.filter((c) => !(c.slug in CATEGORY_LABELS));
    await writeFileCats([...custom, cat]);
  }

  return cat;
}

export function categoryLabel(
  slug: string,
  catalog?: StoreCategory[],
): string {
  const fromCatalog = catalog?.find((c) => c.slug === slug)?.name;
  if (fromCatalog) return fromCatalog;
  if (slug in CATEGORY_LABELS) {
    return CATEGORY_LABELS[slug as keyof typeof CATEGORY_LABELS];
  }
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

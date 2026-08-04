import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  CATEGORY_LABELS,
  categoryLabel,
  slugifyCategory,
} from "./products";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

export { categoryLabel };

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "categories.json");

export type StoreCategory = {
  slug: string;
  name: string;
};

const DEFAULTS: StoreCategory[] = Object.entries(CATEGORY_LABELS).map(
  ([slug, name]) => ({ slug, name }),
);

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

/** Guarda solo overrides/customs (diferentes al default o nuevas). */
async function persistOverrides(all: StoreCategory[]) {
  await mkdir(DATA_DIR, { recursive: true });
  const defaultsMap = new Map(DEFAULTS.map((d) => [d.slug, d.name]));
  const overrides = all.filter((c) => defaultsMap.get(c.slug) !== c.name);
  await writeFile(FILE, JSON.stringify(overrides, null, 2), "utf8");
}

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

export async function listCategories(): Promise<StoreCategory[]> {
  if (!isSupabaseConfigured()) {
    return readFileCats();
  }

  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select("slug, name")
    .order("name");

  if (error) {
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

  return updateCategory(slug, trimmed);
}

export async function updateCategory(
  slug: string,
  name: string,
): Promise<StoreCategory> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Escribe un nombre");
  if (!slug) throw new Error("Categoría no válida");

  const cat: StoreCategory = { slug, name: trimmed };

  if (!isSupabaseConfigured()) {
    const existing = await readFileCats();
    await persistOverrides(mergeCats(existing, [cat]));
    return cat;
  }

  const { error } = await getSupabaseAdmin()
    .from("categories")
    .upsert(cat, { onConflict: "slug" });

  if (error) {
    console.error(`Supabase update category: ${error.message}`);
    const existing = await readFileCats();
    await persistOverrides(mergeCats(existing, [cat]));
  }

  return cat;
}

export async function deleteCategory(slug: string): Promise<void> {
  if (!slug) throw new Error("Categoría no válida");
  if (slug in CATEGORY_LABELS) {
    throw new Error(
      "Las categorías base no se eliminan; solo puedes renombrarlas o crear nuevas.",
    );
  }

  if (!isSupabaseConfigured()) {
    const existing = await readFileCats();
    await persistOverrides(existing.filter((c) => c.slug !== slug));
    return;
  }

  const { error } = await getSupabaseAdmin()
    .from("categories")
    .delete()
    .eq("slug", slug);

  if (error) {
    console.error(`Supabase delete category: ${error.message}`);
    const existing = await readFileCats();
    await persistOverrides(existing.filter((c) => c.slug !== slug));
  }
}


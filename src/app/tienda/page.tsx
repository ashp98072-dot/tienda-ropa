import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { SearchBar } from "@/components/SearchBar";
import { listCategories } from "@/lib/categories";
import { listProducts } from "@/lib/catalog";
import {
  categoryLabel,
  GENDER_LABELS,
  SEGMENT_LABELS,
} from "@/lib/products";
import type { Category, Gender, Segment } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tienda",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const segmento = pick(sp.segmento) as Segment | "";
  const genero = pick(sp.genero) as Gender | "";
  const categoria = pick(sp.categoria) as Category | "";
  const talla = pick(sp.talla);
  const q = pick(sp.q).trim().toLowerCase();

  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);
  const filtered = products.filter((p) => {
    if (segmento && p.segment !== segmento) return false;
    if (genero && p.gender !== genero) return false;
    if (categoria && p.category !== categoria) return false;
    if (talla && !p.sizes.includes(talla)) return false;
    if (q) {
      const haystack = [
        p.name,
        p.description,
        categoryLabel(p.category, categories),
        SEGMENT_LABELS[p.segment],
        GENDER_LABELS[p.gender],
        ...p.colors,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const titleBits = [
    q ? `“${pick(sp.q).trim()}”` : null,
    segmento ? SEGMENT_LABELS[segmento] : null,
    genero ? GENDER_LABELS[genero] : null,
    categoria ? categoryLabel(categoria, categories) : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
            Catálogo
          </p>
          <h1 className="mt-1 break-words font-[family-name:var(--font-display)] text-3xl sm:text-5xl">
            {titleBits.length ? titleBits.join(" · ") : "Toda la tienda"}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {filtered.length} producto{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <Suspense fallback={null}>
          <SearchBar className="w-full max-w-xs sm:hidden" />
        </Suspense>
      </header>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <Suspense fallback={<div className="h-40 animate-pulse bg-[var(--mist)]" />}>
          <ProductFilters categories={categories} />
        </Suspense>

        {filtered.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl">
              Sin resultados
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Prueba otros filtros o limpia la búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

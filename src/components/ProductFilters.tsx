"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GENDER_LABELS, SEGMENT_LABELS } from "@/lib/products";
import type { Gender, Segment } from "@/lib/types";
import { SearchBar } from "./SearchBar";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "4", "6", "8", "10", "12"];

export function ProductFilters({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/tienda?${next.toString()}`);
  }

  const selectClass =
    "w-full border border-[var(--ink)]/15 bg-[var(--paper)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]";

  const hasFilters = Boolean(
    params.get("segmento") ||
      params.get("genero") ||
      params.get("categoria") ||
      params.get("talla") ||
      params.get("q"),
  );

  const filterBody = (
    <div className="space-y-5">
      <div className="hidden lg:block">
        <label className="mb-2 block text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Buscar
        </label>
        <SearchBar />
      </div>

      <div>
        <label className="mb-2 block text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Edad / segmento
        </label>
        <select
          className={selectClass}
          value={params.get("segmento") ?? ""}
          onChange={(e) => setParam("segmento", e.target.value)}
        >
          <option value="">Todos</option>
          {(Object.keys(SEGMENT_LABELS) as Segment[]).map((key) => (
            <option key={key} value={key}>
              {SEGMENT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Género
        </label>
        <select
          className={selectClass}
          value={params.get("genero") ?? ""}
          onChange={(e) => setParam("genero", e.target.value)}
        >
          <option value="">Todos</option>
          {(Object.keys(GENDER_LABELS) as Gender[]).map((key) => (
            <option key={key} value={key}>
              {GENDER_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Categoría
        </label>
        <select
          className={selectClass}
          value={params.get("categoria") ?? ""}
          onChange={(e) => setParam("categoria", e.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Talla
        </label>
        <select
          className={selectClass}
          value={params.get("talla") ?? ""}
          onChange={(e) => setParam("talla", e.target.value)}
        >
          <option value="">Todas</option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.push("/tienda")}
          className="text-xs tracking-[0.16em] text-[var(--accent)] uppercase underline-offset-4 hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <aside className="lg:sticky lg:top-28">
      {/* Móvil: filtros colapsables */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between border border-[var(--ink)]/15 bg-white px-4 py-3 text-left text-xs tracking-[0.16em] uppercase"
        >
          <span>
            Filtros{hasFilters ? " · activos" : ""}
          </span>
          <span aria-hidden>{open ? "−" : "+"}</span>
        </button>
        {open && (
          <div className="mt-3 border border-[var(--ink)]/10 bg-white p-4">
            {filterBody}
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">{filterBody}</div>
    </aside>
  );
}

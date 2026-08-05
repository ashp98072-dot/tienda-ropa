"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { categoryLabel, formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";

export function ProductsTable({
  products: initial,
  categories = [],
}: {
  products: Product[];
  categories?: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");

  async function patch(id: string, body: Partial<Product>) {
    setBusy(id);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { product?: Product; error?: string };
    setBusy(null);
    if (data.product) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? data.product! : p)),
      );
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    setBusy(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }
  }

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      const inStock = p.inStock !== false;
      if (stockFilter === "in" && !inStock) return false;
      if (stockFilter === "out" && inStock) return false;
      if (!query) return true;
      const hay = [
        p.name,
        p.slug,
        categoryLabel(p.category, categories),
        p.segment,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [products, q, stockFilter, categories]);

  if (products.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        No hay productos.{" "}
        <Link href="/admin/productos/nuevo" className="underline">
          Crear el primero
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="w-full max-w-sm border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          placeholder="Buscar producto…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {(
          [
            ["all", "Todos"],
            ["in", "En existencia"],
            ["out", "Agotados"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setStockFilter(id)}
            className={`px-3 py-1.5 text-xs tracking-[0.12em] uppercase ${
              stockFilter === id
                ? "bg-[var(--ink)] text-white"
                : "border border-black/15 bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Móvil: tarjetas */}
      <div className="space-y-3 md:hidden">
        {visible.map((p) => {
          const inStock = p.inStock !== false;
          const visibleInStore = p.active !== false;
          return (
            <article
              key={p.id}
              className="border border-black/10 bg-white p-4 text-sm"
            >
              <div className="flex gap-3">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[var(--mist)]">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{p.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    {categoryLabel(p.category, categories)}
                    {p.isNew ? " · Nuevo" : ""}
                    {p.featured ? " · Destacado" : ""}
                  </p>
                  <p className="mt-2 font-medium">{formatPrice(p.price)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy === p.id}
                  onClick={() => patch(p.id, { inStock: !inStock })}
                  className={`px-2.5 py-1.5 text-xs ${
                    inStock
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-[var(--accent)]/10 text-[var(--accent)]"
                  }`}
                >
                  {inStock ? "En existencia" : "Agotado"}
                </button>
                <button
                  type="button"
                  disabled={busy === p.id}
                  onClick={() => patch(p.id, { active: !visibleInStore })}
                  className="border border-black/15 px-2.5 py-1.5 text-xs"
                >
                  {visibleInStore ? "Visible" : "Oculto"}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs tracking-wide uppercase">
                <Link
                  href={`/admin/productos/${p.id}`}
                  className="text-[var(--accent)]"
                >
                  Editar
                </Link>
                <Link
                  href={`/producto/${p.slug}`}
                  className="text-[var(--muted)]"
                  target="_blank"
                >
                  Ver
                </Link>
                <button
                  type="button"
                  disabled={busy === p.id}
                  onClick={() => remove(p.id)}
                  className="text-[var(--muted)] hover:text-[var(--accent)]"
                >
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
        {visible.length === 0 && (
          <p className="px-1 py-4 text-sm text-[var(--muted)]">
            Ningún producto coincide con la búsqueda.
          </p>
        )}
      </div>

      {/* Desktop: tabla */}
      <div className="hidden overflow-x-auto border border-black/10 bg-white md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-black/10 bg-[var(--mist)]/50 text-[10px] tracking-[0.16em] uppercase">
            <tr>
              <th className="px-3 py-3 font-medium">Producto</th>
              <th className="px-3 py-3 font-medium">Categoría</th>
              <th className="px-3 py-3 font-medium">Precio</th>
              <th className="px-3 py-3 font-medium">Existencias</th>
              <th className="px-3 py-3 font-medium">Tienda</th>
              <th className="px-3 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const inStock = p.inStock !== false;
              const visibleInStore = p.active !== false;
              return (
                <tr key={p.id} className="border-b border-black/5">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-[var(--mist)]">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-[var(--muted)]">
                          {p.isNew ? "Nuevo · " : ""}
                          {p.featured ? "Destacado" : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {categoryLabel(p.category, categories)}
                  </td>
                  <td className="px-3 py-3">{formatPrice(p.price)}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      disabled={busy === p.id}
                      onClick={() => patch(p.id, { inStock: !inStock })}
                      className={`px-2 py-1 text-xs ${
                        inStock
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-[var(--accent)]/10 text-[var(--accent)]"
                      }`}
                    >
                      {inStock ? "En existencia" : "Agotado"}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      disabled={busy === p.id}
                      onClick={() => patch(p.id, { active: !visibleInStore })}
                      className="text-xs underline-offset-2 hover:underline"
                    >
                      {visibleInStore ? "Visible" : "Oculto"}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-3 text-xs tracking-wide uppercase">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="text-[var(--accent)]"
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/producto/${p.slug}`}
                        className="text-[var(--muted)]"
                        target="_blank"
                      >
                        Ver
                      </Link>
                      <button
                        type="button"
                        disabled={busy === p.id}
                        onClick={() => remove(p.id)}
                        className="text-[var(--muted)] hover:text-[var(--accent)]"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="px-4 py-6 text-sm text-[var(--muted)]">
            Ningún producto coincide con la búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}

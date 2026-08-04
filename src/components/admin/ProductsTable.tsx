"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";

export function ProductsTable({ products: initial }: { products: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

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
    <div className="overflow-x-auto border border-black/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-black/10 bg-[var(--mist)]/50 text-[10px] tracking-[0.16em] uppercase">
          <tr>
            <th className="px-3 py-3 font-medium">Producto</th>
            <th className="px-3 py-3 font-medium">Precio</th>
            <th className="px-3 py-3 font-medium">Estado</th>
            <th className="px-3 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-black/5">
              <td className="px-3 py-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-[var(--muted)]">/{p.slug}</div>
              </td>
              <td className="px-3 py-3">{formatPrice(p.price)}</td>
              <td className="px-3 py-3 text-xs">
                {p.active === false ? "Oculto" : "Visible"}
                {p.featured ? " · Destacado" : ""}
                {p.isNew ? " · Nuevo" : ""}
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-3 text-xs tracking-wide uppercase">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="text-[var(--accent)]"
                  >
                    Editar
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

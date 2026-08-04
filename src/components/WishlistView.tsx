"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { useWishlist } from "./WishlistProvider";

export function WishlistView({ products }: { products: Product[] }) {
  const { ids } = useWishlist();
  const wished = products.filter((p) => ids.includes(p.id));

  if (wished.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          Tu lista está vacía
        </p>
        <p className="mt-2 text-[var(--muted)]">
          Guarda prendas con el corazón para verlas después.
        </p>
        <Link
          href="/tienda"
          className="mt-8 inline-flex bg-[var(--ink)] px-6 py-3 text-xs tracking-[0.2em] text-white uppercase"
        >
          Ir a tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {wished.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

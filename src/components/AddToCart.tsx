"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!size || !color) return;
    addItem(product, size, color, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  const optionBtn = (active: boolean) =>
    `min-w-11 border px-3 py-2 text-xs tracking-wide transition ${
      active
        ? "border-[var(--ink)] bg-[var(--ink)] text-white"
        : "border-[var(--ink)]/20 text-[var(--ink)] hover:border-[var(--ink)]"
    }`;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Talla
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              className={optionBtn(size === s)}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Color
        </p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              type="button"
              className={optionBtn(color === c)}
              onClick={() => setColor(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full bg-[var(--ink)] px-6 py-4 text-xs font-semibold tracking-[0.22em] text-white uppercase transition hover:bg-[var(--accent)]"
      >
        {added ? "Añadido a la bolsa" : "Añadir a la bolsa"}
      </button>
    </div>
  );
}

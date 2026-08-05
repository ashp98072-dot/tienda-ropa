"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/products";

export function CartView() {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          Tu bolsa está vacía
        </p>
        <p className="mt-2 text-[var(--muted)]">
          Explora la tienda y arma tu estilo.
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
    <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-[var(--ink)]/10">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex gap-3 py-5 sm:gap-4 sm:py-6"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[var(--mist)] sm:h-28 sm:w-24">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/producto/${item.slug}`}
                    className="font-[family-name:var(--font-display)] text-base leading-snug text-[var(--ink)] hover:text-[var(--accent)] sm:text-lg"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {item.size} · {item.color}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-4 pt-3">
                <div className="flex items-center border border-[var(--ink)]/15">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        item.color,
                        item.quantity - 1,
                      )
                    }
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        item.color,
                        item.quantity + 1,
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-xs tracking-wide text-[var(--muted)] underline-offset-2 hover:text-[var(--accent)] hover:underline"
                  onClick={() =>
                    removeItem(item.productId, item.size, item.color)
                  }
                >
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit border border-[var(--ink)]/10 bg-[var(--mist)]/60 p-6 lg:sticky lg:top-28">
        <p className="text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Resumen
        </p>
        <div className="mt-4 flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Envío según departamento o retiro en tienda. Gratis desde Q500.00.
          Necesitas cuenta para pedir.
        </p>
        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center bg-[var(--ink)] px-4 py-3.5 text-xs font-semibold tracking-[0.2em] text-white uppercase transition hover:bg-[var(--accent)]"
        >
          Finalizar compra
        </Link>
      </aside>
    </div>
  );
}

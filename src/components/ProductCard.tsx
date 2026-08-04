import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group animate-[fade-up_0.7s_ease_both]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--mist)]">
        <Link href={`/producto/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>
        {product.inStock === false ? (
          <span className="pointer-events-none absolute top-3 left-3 z-[1] bg-[var(--accent)] px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
            Agotado
          </span>
        ) : product.isNew ? (
          <span className="pointer-events-none absolute top-3 left-3 z-[1] bg-[var(--ink)] px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
            Nuevo
          </span>
        ) : null}
        <WishlistButton
          productId={product.id}
          className="absolute top-3 right-3 z-[1]"
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3>
          <Link
            href={`/producto/${product.slug}`}
            className="font-[family-name:var(--font-display)] text-lg leading-tight text-[var(--ink)] transition group-hover:text-[var(--accent)]"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-[var(--muted)]">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

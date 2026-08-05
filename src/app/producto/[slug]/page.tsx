import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductGallery } from "@/components/ProductGallery";
import { WishlistButton } from "@/components/WishlistButton";
import { getProductBySlug } from "@/lib/catalog";
import {
  categoryLabel,
  GENDER_LABELS,
  SEGMENT_LABELS,
  formatPrice,
} from "@/lib/products";

type Params = Promise<{ slug: string }>;

/** Siempre fresco: si no, al subir fotos en admin la tienda seguía mostrando la versión vieja. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <nav className="mb-8 text-xs tracking-wide text-[var(--muted)]">
        <Link href="/tienda" className="hover:text-[var(--accent)]">
          Tienda
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery
          name={product.name}
          images={
            product.images?.length
              ? product.images
              : product.image
                ? [product.image]
                : []
          }
          isNew={product.inStock !== false && product.isNew}
          soldOut={product.inStock === false}
        />

        <div className="lg:py-6">
          <p className="text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
            {SEGMENT_LABELS[product.segment]} · {GENDER_LABELS[product.gender]} ·{" "}
            {categoryLabel(product.category)}
          </p>
          <h1 className="mt-2 break-words font-[family-name:var(--font-display)] text-3xl sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-xl">{formatPrice(product.price)}</p>
          {product.inStock === false && (
            <p className="mt-2 text-sm text-[var(--accent)]">Agotado por ahora</p>
          )}
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--muted)]">
            {product.description}
          </p>

          <div className="mt-8 space-y-4">
            <AddToCart product={product} />
            <WishlistButton productId={product.id} variant="text" />
          </div>
        </div>
      </div>
    </div>
  );
}

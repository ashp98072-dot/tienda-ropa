import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { WishlistButton } from "@/components/WishlistButton";
import { getProductBySlug, listProducts } from "@/lib/catalog";
import {
  CATEGORY_LABELS,
  GENDER_LABELS,
  SEGMENT_LABELS,
  formatPrice,
} from "@/lib/products";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const products = await listProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

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
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--mist)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-[var(--ink)] px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
              Nuevo
            </span>
          )}
        </div>

        <div className="lg:py-6">
          <p className="text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
            {SEGMENT_LABELS[product.segment]} · {GENDER_LABELS[product.gender]} ·{" "}
            {CATEGORY_LABELS[product.category]}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-xl">{formatPrice(product.price)}</p>
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

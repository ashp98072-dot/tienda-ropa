import type { Metadata } from "next";
import { WishlistView } from "@/components/WishlistView";
import { listProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Lista de deseos",
};

export default async function DeseosPage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
          Guardados
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          Lista de deseos
        </h1>
      </header>
      <WishlistView products={products} />
    </div>
  );
}

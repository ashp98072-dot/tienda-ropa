import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Bolsa",
};

export default function CarritoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
          Compra
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          Tu bolsa
        </h1>
      </header>
      <CartView />
    </div>
  );
}

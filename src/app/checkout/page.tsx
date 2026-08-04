import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getSessionUser } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Checkout",
};
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/cuenta/login?next=/checkout");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
          Checkout
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          Finalizar compra
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
          Para pedir necesitas cuenta. Elige cómo pagar: tarjeta (QPayPro),
          contra entrega o transferencia.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="py-16 text-center text-sm text-[var(--muted)]">
            Cargando checkout…
          </div>
        }
      >
        <CheckoutForm />
      </Suspense>
    </div>
  );
}

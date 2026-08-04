import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AddressesManager } from "@/components/account/AddressesManager";
import { getSessionUser } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Direcciones" };
export const dynamic = "force-dynamic";

export default async function DireccionesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/cuenta/login");

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-16">
      <nav className="mb-6 text-xs text-[var(--muted)]">
        <Link href="/cuenta" className="hover:text-[var(--accent)]">
          Mi cuenta
        </Link>
        <span className="mx-2">/</span>
        Direcciones
      </nav>
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-4xl">
        Mis direcciones
      </h1>
      <AddressesManager userId={user.id} />
    </div>
  );
}

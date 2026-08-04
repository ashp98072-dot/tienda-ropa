import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getSessionUser } from "@/lib/supabase-server";
import { isSupabasePublicConfigured } from "@/lib/supabase-public";

export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  if (!isSupabasePublicConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-28 pb-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Cuentas no disponibles
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Falta configurar las keys públicas de Supabase.
        </p>
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/cuenta/login");

  const meta = user.user_metadata ?? {};
  const name =
    (meta.full_name as string | undefined) ||
    [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
    user.email;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
            Mi cuenta
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl">
            Hola, {name}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/cuenta/direcciones"
          className="border border-[var(--ink)]/10 bg-white p-6 transition hover:border-[var(--ink)]/30"
        >
          <p className="font-[family-name:var(--font-display)] text-2xl">
            Direcciones
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Guarda casa, trabajo u otras para un checkout más rápido.
          </p>
        </Link>
        <Link
          href="/cuenta/pedidos"
          className="border border-[var(--ink)]/10 bg-white p-6 transition hover:border-[var(--ink)]/30"
        >
          <p className="font-[family-name:var(--font-display)] text-2xl">
            Mis pedidos
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Revisa el estado de tus compras.
          </p>
        </Link>
      </div>
    </div>
  );
}

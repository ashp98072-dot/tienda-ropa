import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  orderStatusLabel,
  paymentMethodLabel,
} from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import {
  createServerSupabase,
  getSessionUser,
} from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Mis pedidos" };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  total: number | string;
  status: string;
  created_at: string;
  payment_method: string;
};

export default async function MisPedidosPage() {
  const user = await getSessionUser();
  if (!user) redirect("/cuenta/login");

  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("orders")
    .select("id, total, status, created_at, payment_method")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (data as Row[] | null) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-16">
      <nav className="mb-6 text-xs text-[var(--muted)]">
        <Link href="/cuenta" className="hover:text-[var(--accent)]">
          Mi cuenta
        </Link>
        <span className="mx-2">/</span>
        Pedidos
      </nav>
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-4xl">
        Mis pedidos
      </h1>

      {orders.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Aún no hay pedidos ligados a tu cuenta.{" "}
          <Link href="/tienda" className="underline">
            Ir a tienda
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-[var(--ink)]/10 bg-white px-4 py-4 text-sm"
            >
              <div>
                <p className="font-medium">{o.id}</p>
                <p className="text-xs text-[var(--muted)]">
                  {new Date(o.created_at).toLocaleString("es-GT")} ·{" "}
                  {paymentMethodLabel(o.payment_method)}
                </p>
              </div>
              <div className="text-right">
                <p>{formatPrice(Number(o.total))}</p>
                <p className="text-xs tracking-wide text-[var(--muted)]">
                  {orderStatusLabel(o.status)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

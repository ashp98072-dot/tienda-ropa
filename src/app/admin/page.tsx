import Link from "next/link";
import { redirect } from "next/navigation";
import { SeedButton } from "@/components/admin/SeedButton";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listProducts } from "@/lib/catalog";
import { listOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/supabase";

export default async function AdminHomePage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  let products: Awaited<ReturnType<typeof listProducts>> = [];
  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  try {
    [products, orders] = await Promise.all([
      listProducts({ includeInactive: true }),
      listOrders(),
    ]);
  } catch (err) {
    console.error("Admin dashboard data error:", err);
  }

  const active = products.filter((p) => p.active !== false).length;
  const pending = orders.filter((o) =>
    ["pending_payment", "awaiting_transfer", "cod", "paid", "processing"].includes(
      o.status,
    ),
  ).length;
  const revenue = orders
    .filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        Panel
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Gestiona el catálogo y los pedidos de I NEED YOU.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-black/10 bg-white p-5">
          <p className="text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
            Productos activos
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">
            {active}
          </p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <p className="text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
            Pedidos en curso
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">
            {pending}
          </p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <p className="text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
            Ventas confirmadas
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">
            {formatPrice(revenue)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/productos/nuevo"
          className="bg-[var(--ink)] px-5 py-3 text-xs tracking-[0.18em] text-white uppercase"
        >
          Nuevo producto
        </Link>
        <Link
          href="/admin/pedidos"
          className="border border-black/15 px-5 py-3 text-xs tracking-[0.18em] uppercase"
        >
          Ver pedidos
        </Link>
        <Link
          href="/admin/qa"
          className="border border-black/15 px-5 py-3 text-xs tracking-[0.18em] uppercase"
        >
          Checklist QA
        </Link>
      </div>

      <div className="mt-10 border border-black/10 bg-white p-5">
        <p className="text-sm font-medium">Base de datos</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {isSupabaseConfigured()
            ? "Supabase conectado — productos y pedidos persisten en la nube (listo para Vercel)."
            : "Sin Supabase: datos locales en .data/ (solo desarrollo). Para Vercel configura Supabase."}
        </p>
        {isSupabaseConfigured() && (
          <div className="mt-4">
            <SeedButton />
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listProducts } from "@/lib/catalog";

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const products = await listProducts({ includeInactive: true });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl">
            Productos
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {products.length} en catálogo
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-[var(--ink)] px-5 py-3 text-xs tracking-[0.18em] text-white uppercase"
        >
          Nuevo producto
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}

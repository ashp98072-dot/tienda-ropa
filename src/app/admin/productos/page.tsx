import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listCategories } from "@/lib/categories";
import { listProducts } from "@/lib/catalog";

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const [products, categories] = await Promise.all([
    listProducts({ includeInactive: true }),
    listCategories(),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            Productos
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Revisa el catálogo, cambia existencias (en existencia / agotado),
            edita fotos, precios y visibilidad.
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {products.length} producto{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/categorias"
            className="border border-black/15 px-5 py-3 text-xs tracking-[0.18em] uppercase"
          >
            Categorías
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="bg-[var(--ink)] px-5 py-3 text-xs tracking-[0.18em] text-white uppercase"
          >
            Nuevo producto
          </Link>
        </div>
      </div>
      <ProductsTable products={products} categories={categories} />
    </div>
  );
}

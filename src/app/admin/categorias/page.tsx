import { redirect } from "next/navigation";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listCategories } from "@/lib/categories";

export default async function AdminCategoriesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const categories = await listCategories();

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-4xl">
        Categorías
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-[var(--muted)]">
        Crea, renombra o elimina categorías del catálogo. Las categorías base
        (Blusas, Jeans, etc.) se pueden renombrar, pero no borrar.
      </p>
      <CategoriesManager categories={categories} />
    </div>
  );
}

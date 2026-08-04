import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminNewProductPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-4xl">
        Nuevo producto
      </h1>
      <ProductForm />
    </div>
  );
}

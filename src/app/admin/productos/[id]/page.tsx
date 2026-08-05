import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProductById } from "@/lib/catalog";

type Params = Promise<{ id: string }>;

export default async function AdminEditProductPage({
  params,
}: {
  params: Params;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
        Editar producto
      </h1>
      <ProductForm product={product} />
    </div>
  );
}

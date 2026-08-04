import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteProduct,
  getProductById,
  slugify,
  upsertProduct,
} from "@/lib/catalog";
import type { Product } from "@/lib/types";

type Params = Promise<{ id: string }>;

export async function PUT(
  request: Request,
  { params }: { params: Params },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = (await request.json()) as Partial<Product>;
  const product: Product = {
    ...existing,
    ...body,
    id,
    slug: body.slug?.trim() || existing.slug || slugify(body.name || existing.name),
    name: (body.name ?? existing.name).trim(),
    price: typeof body.price === "number" ? body.price : existing.price,
    description: (body.description ?? existing.description).trim(),
    image: (body.image ?? existing.image).trim(),
  };

  await upsertProduct(product);
  return NextResponse.json({ product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Params },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

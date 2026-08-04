import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  listProducts,
  newProductId,
  slugify,
  upsertProduct,
} from "@/lib/catalog";
import type { Category, Gender, Product, Segment } from "@/lib/types";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const products = await listProducts({ includeInactive: true });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Product>;
  if (!body.name || typeof body.price !== "number") {
    return NextResponse.json(
      { error: "Nombre y precio son obligatorios" },
      { status: 400 },
    );
  }

  const images = (
    body.images?.length
      ? body.images
      : body.image
        ? [body.image]
        : [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
          ]
  )
    .map((u) => u.trim())
    .filter(Boolean);

  const product: Product = {
    id: newProductId(),
    slug: body.slug?.trim() || slugify(body.name),
    name: body.name.trim(),
    price: body.price,
    description: body.description?.trim() || "",
    category: (body.category as Category) || "tops",
    segment: (body.segment as Segment) || "adultos",
    gender: (body.gender as Gender) || "mujer",
    sizes: body.sizes?.length ? body.sizes : ["S", "M", "L"],
    colors: body.colors?.length ? body.colors : ["Negro"],
    images,
    image: images[0] ?? "",
    isNew: Boolean(body.isNew),
    featured: Boolean(body.featured),
    active: body.active !== false,
  };

  await upsertProduct(product);
  return NextResponse.json({ product }, { status: 201 });
}

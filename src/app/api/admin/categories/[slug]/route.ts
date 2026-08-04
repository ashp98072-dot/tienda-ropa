import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteCategory, updateCategory } from "@/lib/categories";

type Params = Promise<{ slug: string }>;

export async function PATCH(
  request: Request,
  { params }: { params: Params },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { slug } = await params;
  const body = (await request.json()) as { name?: string };
  try {
    const category = await updateCategory(
      decodeURIComponent(slug),
      body.name ?? "",
    );
    return NextResponse.json({ category });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo guardar" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Params },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { slug } = await params;
  try {
    await deleteCategory(decodeURIComponent(slug));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo eliminar" },
      { status: 400 },
    );
  }
}

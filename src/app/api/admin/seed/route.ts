import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { seedProductsIfEmpty } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no configurado" },
      { status: 400 },
    );
  }

  try {
    const result = await seedProductsIfEmpty();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al sembrar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

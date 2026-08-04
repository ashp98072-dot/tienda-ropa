import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrder, updateOrder, type OrderStatus } from "@/lib/orders";

type Params = Promise<{ id: string }>;

const STATUSES: OrderStatus[] = [
  "pending_payment",
  "awaiting_transfer",
  "cod",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
];

export async function PATCH(
  request: Request,
  { params }: { params: Params },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = (await request.json()) as { status?: OrderStatus };
  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const updated = await updateOrder(id, { status: body.status });
  return NextResponse.json({ order: updated });
}

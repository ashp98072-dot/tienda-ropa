import { NextResponse } from "next/server";
import { notifyOrderPaid } from "@/lib/mail";
import { getOrder, updateOrder } from "@/lib/orders";
import { getQPayProConfig } from "@/lib/qpaypro";

export async function POST(request: Request) {
  const config = getQPayProConfig();
  const body = (await request.json()) as {
    orderId?: string;
    result?: "success" | "fail";
  };

  if (!body.orderId) {
    return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
  }

  const order = await getOrder(body.orderId);
  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  if (body.result === "fail") {
    await updateOrder(body.orderId, {
      status: "failed",
      paymentResponseText: "Pago demo rechazado",
    });
    return NextResponse.json({
      redirectUrl: `${config.siteUrl}/checkout?error=1&id=${body.orderId}`,
    });
  }

  const paid = await updateOrder(body.orderId, {
    status: "paid",
    qpayproTransId: `DEMO-${Date.now()}`,
    paymentResponseText: "Pago demo exitoso",
  });
  if (paid) void notifyOrderPaid(paid);

  return NextResponse.json({
    redirectUrl: `${config.siteUrl}/pedido-confirmado?metodo=tarjeta&id=${body.orderId}&pagado=1`,
  });
}

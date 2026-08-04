import { NextResponse } from "next/server";
import { notifyOrderPaid } from "@/lib/mail";
import { getOrder, updateOrder } from "@/lib/orders";
import { getQPayProConfig, isQPayProSuccess } from "@/lib/qpaypro";

function pick(
  params: URLSearchParams,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = params.get(key);
    if (value) return value;
  }
  return null;
}

async function handleRelay(request: Request) {
  const config = getQPayProConfig();
  const url = new URL(request.url);
  let params = url.searchParams;

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = (await request.json()) as Record<string, unknown>;
      params = new URLSearchParams();
      for (const [k, v] of Object.entries(json)) {
        if (v != null) params.set(k, String(v));
      }
    } else {
      const form = await request.formData();
      params = new URLSearchParams();
      form.forEach((value, key) => {
        params.set(key, String(value));
      });
    }
  }

  const status = pick(params, "x_response_status", "response_status");
  const invoice = pick(params, "x_invoice_num", "invoice_num", "orderId");
  const transId = pick(params, "x_trans_id", "trans_id");
  const responseText = pick(params, "x_response_text", "response_text");

  let customOrderId: string | null = null;
  const customFields = pick(params, "x_custom_fields", "custom_fields");
  if (customFields) {
    try {
      const parsed = JSON.parse(customFields) as { orderId?: string };
      customOrderId = parsed.orderId ?? null;
    } catch {
      /* ignore */
    }
  }

  const orderId = customOrderId || invoice;
  if (!orderId) {
    return NextResponse.redirect(
      `${config.siteUrl}/checkout?error=1&razon=sin-orden`,
    );
  }

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.redirect(
      `${config.siteUrl}/checkout?error=1&razon=orden-no-encontrada`,
    );
  }

  if (isQPayProSuccess(status)) {
    const paid = await updateOrder(orderId, {
      status: "paid",
      qpayproTransId: transId ?? undefined,
      paymentResponseText: responseText ?? "Transacción exitosa",
    });
    if (paid) void notifyOrderPaid(paid);
    return NextResponse.redirect(
      `${config.siteUrl}/pedido-confirmado?metodo=tarjeta&id=${encodeURIComponent(orderId)}&pagado=1`,
    );
  }

  await updateOrder(orderId, {
    status: "failed",
    qpayproTransId: transId ?? undefined,
    paymentResponseText: responseText ?? "Pago rechazado o cancelado",
  });

  return NextResponse.redirect(
    `${config.siteUrl}/checkout?error=1&id=${encodeURIComponent(orderId)}`,
  );
}

export async function GET(request: Request) {
  return handleRelay(request);
}

export async function POST(request: Request) {
  return handleRelay(request);
}

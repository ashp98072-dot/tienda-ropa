import { NextResponse } from "next/server";
import { notifyOrderCreated } from "@/lib/mail";
import {
  createOrderId,
  initialStatus,
  saveOrder,
  type Order,
  type OrderCustomer,
} from "@/lib/orders";
import { registerQPayProCheckout } from "@/lib/qpaypro";
import { getShippingQuote, type ShippingMethod } from "@/lib/shipping";
import { getSessionUser } from "@/lib/supabase-server";
import type { CartItem, PaymentMethod } from "@/lib/types";

interface CreateOrderBody {
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  items: CartItem[];
  subtotal: number;
}

function isValidBody(body: unknown): body is CreateOrderBody {
  if (!body || typeof body !== "object") return false;
  const b = body as CreateOrderBody;
  return (
    Boolean(b.customer?.fullName && b.customer?.email && b.customer?.phone) &&
    Array.isArray(b.items) &&
    b.items.length > 0 &&
    typeof b.subtotal === "number" &&
    ["tarjeta", "contra_entrega", "transferencia"].includes(b.paymentMethod) &&
    ["delivery", "pickup"].includes(b.shippingMethod ?? "delivery")
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!isValidBody(body)) {
      return NextResponse.json(
        { error: "Datos de pedido incompletos." },
        { status: 400 },
      );
    }

    if (
      body.shippingMethod === "delivery" &&
      (!body.customer.department || !body.customer.address)
    ) {
      return NextResponse.json(
        { error: "Para envío a domicilio indica departamento y dirección." },
        { status: 400 },
      );
    }

    const shippingMethod = body.shippingMethod ?? "delivery";
    const quote = getShippingQuote(
      body.customer.department,
      body.subtotal,
      shippingMethod,
    );

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Debes iniciar sesión o registrarte para realizar un pedido.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 },
      );
    }

    const order: Order = {
      id: createOrderId(),
      customer: body.customer,
      paymentMethod: body.paymentMethod,
      shippingMethod,
      items: body.items,
      subtotal: body.subtotal,
      shipping: quote.amount,
      total: body.subtotal + quote.amount,
      status: initialStatus(body.paymentMethod),
      createdAt: new Date().toISOString(),
      userId: user.id,
    };

    await saveOrder(order);

    // No bloquear el checkout si el correo falla
    void notifyOrderCreated(order);

    if (body.paymentMethod === "tarjeta") {
      try {
        const payment = await registerQPayProCheckout(order);
        const withToken = { ...order, qpayproToken: payment.token };
        await saveOrder(withToken);

        return NextResponse.json({
          orderId: order.id,
          status: order.status,
          paymentMethod: order.paymentMethod,
          redirectUrl: payment.redirectUrl,
          demoMode: payment.demoMode,
          shipping: order.shipping,
          total: order.total,
        });
      } catch (err) {
        await saveOrder({ ...order, status: "failed" });
        const message =
          err instanceof Error ? err.message : "Error al iniciar pago QPayPro";
        return NextResponse.json(
          { error: message, orderId: order.id },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      redirectUrl: `/pedido-confirmado?metodo=${order.paymentMethod}&id=${order.id}`,
      demoMode: false,
      shipping: order.shipping,
      total: order.total,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear el pedido." },
      { status: 500 },
    );
  }
}

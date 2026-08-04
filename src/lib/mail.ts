import {
  orderStatusLabel,
  paymentMethodLabel,
  type Order,
} from "./orders";
import { formatPrice } from "./products";
import { SHIPPING_LABELS } from "./shipping";
import { SITE } from "./site";

function adminEmail() {
  return process.env.ORDER_NOTIFY_EMAIL || process.env.SMTP_FROM || "";
}

function fromAddress() {
  return process.env.SMTP_FROM || "pedidos@ineedyougt.com";
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  );
}

function itemsHtml(order: Order) {
  return order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}<br/><span style="color:#666;font-size:12px">${i.size} · ${i.color} × ${i.quantity}</span></td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.price * i.quantity)}</td>
        </tr>`,
    )
    .join("");
}

function orderEmailHtml(order: Order, headline: string, intro: string) {
  const shippingMethod = order.shippingMethod ?? "delivery";
  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#121212;max-width:560px;margin:0 auto;padding:24px">
  <p style="letter-spacing:0.2em;text-transform:uppercase;font-size:11px;color:#666">${SITE.brand}</p>
  <h1 style="font-size:28px;font-weight:400;margin:8px 0 16px">${headline}</h1>
  <p style="color:#444;line-height:1.5">${intro}</p>
  <p style="margin:20px 0 8px"><strong>Pedido:</strong> ${order.id}</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemsHtml(order)}</table>
  <p style="margin:4px 0">Subtotal: ${formatPrice(order.subtotal)}</p>
  <p style="margin:4px 0">${SHIPPING_LABELS[shippingMethod]}: ${formatPrice(order.shipping)}</p>
  <p style="margin:8px 0 20px"><strong>Total: ${formatPrice(order.total)}</strong></p>
  <p style="color:#444;font-size:14px;line-height:1.5">
    Envío a: ${order.customer.fullName}<br/>
    ${order.customer.address}, ${order.customer.municipality}, ${order.customer.department}<br/>
    Tel: ${order.customer.phone}
  </p>
  <p style="margin-top:28px"><a href="${siteUrl()}/pedido-confirmado?id=${order.id}&metodo=${order.paymentMethod}" style="color:#b91c3c">Ver confirmación</a></p>
</body></html>`;
}

async function sendViaSmtp(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  if (!host) return false;

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  await transporter.sendMail({
    from: fromAddress(),
    to,
    subject,
    html,
  });
  return true;
}

async function sendViaResend(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error: ${text}`);
  }
  return true;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    if (await sendViaResend(options.to, options.subject, options.html)) {
      return { ok: true, provider: "resend" as const };
    }
    if (await sendViaSmtp(options.to, options.subject, options.html)) {
      return { ok: true, provider: "smtp" as const };
    }

    console.info("[mail:dev]", {
      to: options.to,
      subject: options.subject,
      preview: options.html.slice(0, 180),
    });
    return { ok: true, provider: "console" as const };
  } catch (err) {
    console.error("[mail:error]", err);
    return { ok: false, provider: "none" as const };
  }
}

export async function notifyOrderCreated(order: Order) {
  const customerHtml = orderEmailHtml(
    order,
    "Pedido recibido",
    order.paymentMethod === "tarjeta"
      ? "Recibimos tu pedido. Si elegiste tarjeta, completa el pago en la pasarela."
      : order.paymentMethod === "transferencia"
        ? "Recibimos tu pedido. Te enviaremos los datos para transferencia."
        : "Recibimos tu pedido con pago contra entrega. Te contactaremos para coordinar el envío.",
  );

  await sendMail({
    to: order.customer.email,
    subject: `${SITE.brand} — Pedido ${order.id} recibido`,
    html: customerHtml,
  });

  const notify = adminEmail();
  if (notify) {
    await sendMail({
      to: notify,
      subject: `[Nueva orden] ${order.id} — ${formatPrice(order.total)}`,
      html: orderEmailHtml(
        order,
        "Nueva orden en la tienda",
        `Método: ${paymentMethodLabel(order.paymentMethod)}. Estado: ${orderStatusLabel(order.status)}.`,
      ),
    });
  }
}

export async function notifyOrderPaid(order: Order) {
  await sendMail({
    to: order.customer.email,
    subject: `${SITE.brand} — Pago confirmado ${order.id}`,
    html: orderEmailHtml(
      order,
      "Pago confirmado",
      "Tu pago con tarjeta fue confirmado. Ya estamos preparando tu pedido.",
    ),
  });

  const notify = adminEmail();
  if (notify) {
    await sendMail({
      to: notify,
      subject: `[Pagado] ${order.id} — ${formatPrice(order.total)}`,
      html: orderEmailHtml(
        order,
        "Pago de tarjeta confirmado",
        `Transacción: ${order.qpayproTransId ?? "—"}.`,
      ),
    });
  }
}

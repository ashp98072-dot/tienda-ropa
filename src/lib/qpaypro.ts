import { QPayProClient } from "@qpaypro/sdk";
import type { Order } from "./orders";
import { splitName } from "./orders";

export type QPayProEnv = "sandbox" | "production";

export function getQPayProConfig() {
  const environment = (process.env.QPAYPRO_ENVIRONMENT ?? "sandbox") as QPayProEnv;
  const login =
    process.env.QPAYPRO_X_LOGIN ??
    (environment === "sandbox" ? "visanetgt_qpay" : "");
  const apiKey =
    process.env.QPAYPRO_X_API_KEY ??
    (environment === "sandbox" ? "88888888888" : "");

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/+$/, "");

  const forceDemo = process.env.QPAYPRO_DEMO_MODE === "true";
  const configured = Boolean(login && apiKey);
  const demoMode = forceDemo || !configured;

  return {
    environment,
    login,
    apiKey,
    siteUrl,
    demoMode,
    baseUrl:
      environment === "production"
        ? "https://payments.qpaypro.com"
        : "https://sandboxpayments.qpaypro.com",
  };
}

function createClient() {
  const { environment, login, apiKey } = getQPayProConfig();
  return new QPayProClient({
    environment,
    auth: { login, apiKey },
  });
}

function extractToken(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const root = response as Record<string, unknown>;

  if (typeof root.token === "string") return root.token;

  const data = root.data;
  if (data && typeof data === "object") {
    const token = (data as Record<string, unknown>).token;
    if (typeof token === "string") return token;
  }

  return null;
}

export function checkoutUrlForToken(token: string) {
  const { baseUrl } = getQPayProConfig();
  return `${baseUrl}/checkout/store/${token}`;
}

export async function registerQPayProCheckout(order: Order) {
  const config = getQPayProConfig();
  const { firstName, lastName } = splitName(order.customer.fullName);

  if (config.demoMode) {
    const token = `demo-${order.id}`;
    return {
      token,
      redirectUrl: `${config.siteUrl}/pago/demo?orderId=${encodeURIComponent(order.id)}&token=${encodeURIComponent(token)}`,
      demoMode: true as const,
    };
  }

  // Formato legacy QPayPro: [[description, SKU, url, qty, price, total]]
  const productsLegacy = JSON.stringify(
    order.items.map((item) => [
      `${item.name} (${item.size}/${item.color})`,
      item.productId,
      `${config.siteUrl}/producto/${item.slug}`,
      item.quantity,
      item.price.toFixed(2),
      (item.price * item.quantity).toFixed(2),
    ]),
  );

  const client = createClient();
  const originHost = config.siteUrl.replace(/^https?:\/\//, "");

  const response = await client.checkout.registerTransaction({
    amount: order.total.toFixed(2),
    currency: "GTQ",
    customer: {
      firstName,
      lastName,
      email: order.customer.email,
      phone: order.customer.phone,
      company: "C/F",
      address: order.customer.address,
      city: order.customer.municipality,
      country: "Guatemala",
      state: order.customer.department,
      zip: "01001",
    },
    invoiceNumber: order.id,
    description: `Pedido ${order.id} — I NEED YOU`,
    cancelUrl: `${config.siteUrl}/checkout?cancelado=1&id=${order.id}`,
    relayUrl: `${config.siteUrl}/api/payments/qpaypro/relay`,
    shipToAddress: order.customer.address,
    shipToCity: order.customer.municipality,
    shipToCountry: "Guatemala",
    shipToState: order.customer.department,
    shipToZip: "01001",
    shipToPhone: order.customer.phone,
    // string legacy (no array) para que el SDK lo envíe tal cual
    products: productsLegacy as unknown as [],
    customFields: {
      orderId: order.id,
      brand: "INEEDYOUGT",
    },
    x_type: "AUTH_ONLY",
    x_method: "CC",
    x_freight: order.shipping.toFixed(2),
    taxes: "0",
    x_visacuotas: "no",
    x_discount: "0",
    x_reference: order.id,
    http_origin: originHost,
    origen: "PLUGIN",
    store_type: "hostedpage",
    x_url_success: `${config.siteUrl}/pedido-confirmado?metodo=tarjeta&id=${order.id}`,
    x_url_error: `${config.siteUrl}/checkout?error=1&id=${order.id}`,
  });

  const token = extractToken(response);
  if (!token) {
    throw new Error(
      `QPayPro no devolvió token. Respuesta: ${JSON.stringify(response)}`,
    );
  }

  return {
    token,
    redirectUrl: checkoutUrlForToken(token),
    demoMode: false as const,
    raw: response,
  };
}

/** x_response_status=1 suele indicar éxito en QPayPro */
export function isQPayProSuccess(status: string | null) {
  return status === "1" || status?.toLowerCase() === "approved";
}

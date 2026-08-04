import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  type Order,
  type OrderCustomer,
  type OrderStatus,
} from "./order-labels";
import type { ShippingMethod } from "./shipping";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import type { CartItem, PaymentMethod } from "./types";

export type {
  Order,
  OrderCustomer,
  OrderStatus,
} from "./order-labels";
export {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  orderStatusLabel,
  paymentMethodLabel,
  splitName,
} from "./order-labels";

type DbOrder = {
  id: string;
  customer: OrderCustomer;
  payment_method: PaymentMethod;
  shipping_method: ShippingMethod;
  items: CartItem[];
  subtotal: number | string;
  shipping: number | string;
  total: number | string;
  status: OrderStatus;
  user_id: string | null;
  qpaypro_token: string | null;
  qpaypro_trans_id: string | null;
  payment_response_text: string | null;
  created_at: string;
};

function fromDb(row: DbOrder): Order {
  return {
    id: row.id,
    customer: row.customer,
    paymentMethod: row.payment_method,
    shippingMethod: row.shipping_method ?? "delivery",
    items: row.items ?? [],
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
    userId: row.user_id ?? undefined,
    qpayproToken: row.qpaypro_token ?? undefined,
    qpayproTransId: row.qpaypro_trans_id ?? undefined,
    paymentResponseText: row.payment_response_text ?? undefined,
  };
}

function toDb(order: Order) {
  return {
    id: order.id,
    customer: order.customer,
    payment_method: order.paymentMethod,
    shipping_method: order.shippingMethod,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    user_id: order.userId ?? null,
    qpaypro_token: order.qpayproToken ?? null,
    qpaypro_trans_id: order.qpayproTransId ?? null,
    payment_response_text: order.paymentResponseText ?? null,
    created_at: order.createdAt,
    updated_at: new Date().toISOString(),
  };
}

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(ORDERS_FILE, "utf8");
  } catch {
    await writeFile(ORDERS_FILE, "[]", "utf8");
  }
}

async function readOrdersFile(): Promise<Order[]> {
  await ensureStore();
  const raw = await readFile(ORDERS_FILE, "utf8");
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeOrdersFile(orders: Order[]) {
  await ensureStore();
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export function createOrderId() {
  return `INY-${Date.now().toString(36).toUpperCase()}`;
}

export async function saveOrder(order: Order) {
  if (!isSupabaseConfigured()) {
    const orders = await readOrdersFile();
    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) orders[idx] = order;
    else orders.push(order);
    await writeOrdersFile(orders);
    return order;
  }

  const { error } = await getSupabaseAdmin()
    .from("orders")
    .upsert(toDb(order), { onConflict: "id" });
  if (error) throw new Error(`Supabase saveOrder: ${error.message}`);
  return order;
}

export async function getOrder(id: string) {
  if (!isSupabaseConfigured()) {
    const orders = await readOrdersFile();
    return orders.find((o) => o.id === id);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error(`Supabase getOrder: ${error.message}`);
    return undefined;
  }
  return data ? fromDb(data as DbOrder) : undefined;
}

export async function listOrders() {
  if (!isSupabaseConfigured()) {
    const orders = await readOrdersFile();
    return orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(`Supabase listOrders: ${error.message}`);
    return [];
  }
  return (data as DbOrder[]).map(fromDb);
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order | undefined> {
  if (!isSupabaseConfigured()) {
    const orders = await readOrdersFile();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx < 0) return undefined;
    orders[idx] = { ...orders[idx], ...patch };
    await writeOrdersFile(orders);
    return orders[idx];
  }

  const current = await getOrder(id);
  if (!current) return undefined;
  const next = { ...current, ...patch };
  await saveOrder(next);
  return next;
}

export function initialStatus(method: PaymentMethod): OrderStatus {
  if (method === "tarjeta") return "pending_payment";
  if (method === "transferencia") return "awaiting_transfer";
  return "cod";
}

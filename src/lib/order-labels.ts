import type { ShippingMethod } from "./shipping";
import type { CartItem, PaymentMethod } from "./types";

export type OrderStatus =
  | "pending_payment"
  | "awaiting_transfer"
  | "cod"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
  address: string;
  notes: string;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  userId?: string;
  qpayproToken?: string;
  qpayproTransId?: string;
  paymentResponseText?: string;
}

/** Etiquetas en español (Guatemala) — el valor interno se mantiene en inglés. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pago pendiente",
  awaiting_transfer: "Esperando transferencia",
  cod: "Pendiente (contra entrega)",
  paid: "Pagado",
  processing: "En preparación",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  failed: "Fallido",
};

/** Orden fijo del select (evita confusiones en el panel). */
export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
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

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  tarjeta: "Tarjeta",
  contra_entrega: "Contra entrega",
  transferencia: "Transferencia",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? status.replace(/_/g, " ");
}

export function paymentMethodLabel(method: string): string {
  return (
    PAYMENT_METHOD_LABELS[method as PaymentMethod] ?? method.replace(/_/g, " ")
  );
}

export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "Cliente",
    lastName: parts.slice(1).join(" ") || ".",
  };
}

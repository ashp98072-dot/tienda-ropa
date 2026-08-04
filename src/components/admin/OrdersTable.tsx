"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ORDER_STATUS_LABELS,
  paymentMethodLabel,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import { formatPrice } from "@/lib/products";

const STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export function OrdersTable({ orders: initial }: { orders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: OrderStatus) {
    setBusy(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = (await res.json()) as { order?: Order };
    setBusy(null);
    if (data.order) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? data.order! : o)),
      );
      router.refresh();
    }
  }

  if (orders.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Aún no hay pedidos. Haz una compra de prueba en la tienda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-black/10 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-black/10 bg-[var(--mist)]/50 text-[10px] tracking-[0.16em] uppercase">
          <tr>
            <th className="px-3 py-3 font-medium">Pedido</th>
            <th className="px-3 py-3 font-medium">Cliente</th>
            <th className="px-3 py-3 font-medium">Total</th>
            <th className="px-3 py-3 font-medium">Pago</th>
            <th className="px-3 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-black/5">
              <td className="px-3 py-3">
                <div className="font-medium">{o.id}</div>
                <div className="text-xs text-[var(--muted)]">
                  {new Date(o.createdAt).toLocaleString("es-GT")}
                </div>
              </td>
              <td className="px-3 py-3">
                <div>{o.customer.fullName}</div>
                <div className="text-xs text-[var(--muted)]">
                  {o.customer.phone} · {o.customer.department}
                </div>
              </td>
              <td className="px-3 py-3">{formatPrice(o.total)}</td>
              <td className="px-3 py-3 text-xs tracking-wide">
                {paymentMethodLabel(o.paymentMethod)}
              </td>
              <td className="px-3 py-3">
                <select
                  className="border border-black/15 bg-white px-2 py-1.5 text-xs"
                  value={o.status}
                  disabled={busy === o.id}
                  onChange={(e) =>
                    setStatus(o.id, e.target.value as OrderStatus)
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

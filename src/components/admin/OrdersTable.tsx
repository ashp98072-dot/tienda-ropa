"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  orderStatusLabel,
  paymentMethodLabel,
  type Order,
  type OrderStatus,
} from "@/lib/order-labels";
import { formatDateTimeGT, formatPrice } from "@/lib/products";
import { SHIPPING_LABELS } from "@/lib/shipping";

type Filter = "all" | "open" | "done" | "cancelled";

const OPEN: OrderStatus[] = [
  "pending_payment",
  "awaiting_transfer",
  "cod",
  "paid",
  "processing",
  "shipped",
];
const DONE: OrderStatus[] = ["delivered"];
const CANCELLED: OrderStatus[] = ["cancelled", "failed"];

export function OrdersTable({ orders: initial }: { orders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

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

  const counts = useMemo(() => {
    return {
      all: orders.length,
      open: orders.filter((o) => OPEN.includes(o.status)).length,
      done: orders.filter((o) => DONE.includes(o.status)).length,
      cancelled: orders.filter((o) => CANCELLED.includes(o.status)).length,
    };
  }, [orders]);

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter === "open" && !OPEN.includes(o.status)) return false;
      if (filter === "done" && !DONE.includes(o.status)) return false;
      if (filter === "cancelled" && !CANCELLED.includes(o.status)) return false;
      if (!query) return true;
      const hay = [
        o.id,
        o.customer.fullName,
        o.customer.email,
        o.customer.phone,
        o.customer.department,
        paymentMethodLabel(o.paymentMethod),
        orderStatusLabel(o.status),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [orders, filter, q]);

  if (orders.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Aún no hay pedidos. Haz una compra de prueba en la tienda.
      </p>
    );
  }

  const chips: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "Todos", count: counts.all },
    { id: "open", label: "En curso", count: counts.open },
    { id: "done", label: "Entregados", count: counts.done },
    { id: "cancelled", label: "Cancelados", count: counts.cancelled },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 text-xs tracking-[0.12em] uppercase ${
              filter === c.id
                ? "bg-[var(--ink)] text-white"
                : "border border-black/15 bg-white"
            }`}
          >
            {c.label} ({c.count})
          </button>
        ))}
      </div>

      <input
        className="w-full max-w-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        placeholder="Buscar por pedido, cliente, teléfono…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-black/10 bg-[var(--mist)]/50 text-[10px] tracking-[0.16em] uppercase">
            <tr>
              <th className="px-3 py-3 font-medium">Pedido</th>
              <th className="px-3 py-3 font-medium">Cliente</th>
              <th className="px-3 py-3 font-medium">Total</th>
              <th className="px-3 py-3 font-medium">Pago</th>
              <th className="px-3 py-3 font-medium">Estado</th>
              <th className="px-3 py-3 font-medium">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => {
              const expanded = openId === o.id;
              return (
                <Fragment key={o.id}>
                  <tr className="border-b border-black/5">
                    <td className="px-3 py-3">
                      <div className="font-medium">{o.id}</div>
                      <div
                        className="text-xs text-[var(--muted)]"
                        suppressHydrationWarning
                      >
                        {formatDateTimeGT(o.createdAt)}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div>{o.customer.fullName}</div>
                      <div className="text-xs text-[var(--muted)]">
                        {o.customer.phone}
                      </div>
                    </td>
                    <td className="px-3 py-3">{formatPrice(o.total)}</td>
                    <td className="px-3 py-3 text-xs tracking-wide">
                      {paymentMethodLabel(o.paymentMethod)}
                    </td>
                    <td className="px-3 py-3">
                      <select
                        className="max-w-[200px] border border-black/15 bg-white px-2 py-1.5 text-xs"
                        value={o.status}
                        disabled={busy === o.id}
                        onChange={(e) =>
                          setStatus(o.id, e.target.value as OrderStatus)
                        }
                      >
                        {ORDER_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        className="text-xs tracking-wide text-[var(--accent)] uppercase underline-offset-2 hover:underline"
                        onClick={() =>
                          setOpenId(expanded ? null : o.id)
                        }
                      >
                        {expanded ? "Cerrar" : "Ver"}
                      </button>
                    </td>
                  </tr>
                  {expanded && (
                    <tr className="border-b border-black/10 bg-[var(--mist)]/30">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-4 text-sm md:grid-cols-2">
                          <div>
                            <p className="text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
                              Envío
                            </p>
                            <p className="mt-1">
                              {SHIPPING_LABELS[o.shippingMethod ?? "delivery"]}
                            </p>
                            <p className="mt-2 text-[var(--muted)]">
                              {o.customer.address}
                              <br />
                              {o.customer.municipality}, {o.customer.department}
                              <br />
                              {o.customer.email}
                              {o.customer.notes ? (
                                <>
                                  <br />
                                  Notas: {o.customer.notes}
                                </>
                              ) : null}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
                              Artículos
                            </p>
                            <ul className="mt-1 space-y-1">
                              {o.items.map((item, i) => (
                                <li key={`${item.productId}-${i}`}>
                                  {item.name} · {item.size} / {item.color} ×{" "}
                                  {item.quantity} —{" "}
                                  {formatPrice(item.price * item.quantity)}
                                </li>
                              ))}
                            </ul>
                            <p className="mt-3 text-xs text-[var(--muted)]">
                              Subtotal {formatPrice(o.subtotal)} · Envío{" "}
                              {o.shipping === 0
                                ? "Gratis"
                                : formatPrice(o.shipping)}{" "}
                              · Total {formatPrice(o.total)}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="px-4 py-6 text-sm text-[var(--muted)]">
            Ningún pedido coincide con el filtro.
          </p>
        )}
      </div>
    </div>
  );
}

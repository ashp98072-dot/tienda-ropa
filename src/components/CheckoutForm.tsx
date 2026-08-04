"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "./CartProvider";
import { DEPARTMENTS_GT, formatPrice } from "@/lib/products";
import {
  FREE_SHIPPING_MIN,
  getShippingQuote,
  type ShippingMethod,
} from "@/lib/shipping";
import type { PaymentMethod } from "@/lib/types";

const paymentOptions: {
  id: PaymentMethod;
  title: string;
  description: string;
}[] = [
  {
    id: "tarjeta",
    title: "Tarjeta Visa / Mastercard",
    description:
      "Pago seguro con QPayPro (VisaNet). Serás redirigido a la pasarela.",
  },
  {
    id: "contra_entrega",
    title: "Pago contra entrega",
    description: "Pagas en efectivo al recibir tu pedido.",
  },
  {
    id: "transferencia",
    title: "Transferencia bancaria",
    description:
      "Te enviaremos los datos de cuenta. El pedido se confirma al validar el depósito.",
  },
];

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart, itemCount } = useCart();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("tarjeta");
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("delivery");
  const [department, setDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingQuote = useMemo(
    () => getShippingQuote(department, subtotal, shippingMethod),
    [department, subtotal, shippingMethod],
  );
  const total = subtotal + shippingQuote.amount;

  const cancelled = searchParams.get("cancelado") === "1";
  const paymentError = searchParams.get("error") === "1";

  if (itemCount === 0 && !paymentError && !cancelled) {
    return (
      <div className="py-16 text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl">
          No hay productos en la bolsa
        </p>
        <button
          type="button"
          onClick={() => router.push("/tienda")}
          className="mt-6 text-xs tracking-[0.2em] uppercase text-[var(--accent)] underline"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          shippingMethod,
          subtotal,
          items,
          customer: {
            fullName: String(form.get("fullName") ?? ""),
            email: String(form.get("email") ?? ""),
            phone: String(form.get("phone") ?? ""),
            department: String(form.get("department") ?? ""),
            municipality: String(form.get("municipality") ?? ""),
            address: String(form.get("address") ?? ""),
            notes: String(form.get("notes") ?? ""),
          },
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        redirectUrl?: string;
        orderId?: string;
      };

      if (!res.ok || !data.redirectUrl) {
        setError(data.error ?? "No se pudo procesar el pedido.");
        setSubmitting(false);
        return;
      }

      clearCart();

      if (data.redirectUrl.startsWith("http")) {
        window.location.href = data.redirectUrl;
        return;
      }

      router.push(data.redirectUrl);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full border border-[var(--ink)]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]";

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-12 lg:grid-cols-[1fr_340px]"
    >
      <div className="space-y-8">
        {(cancelled || paymentError || error) && (
          <div className="border border-[var(--accent)]/40 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--accent)]">
            {error ||
              (cancelled
                ? "Cancelaste el pago con tarjeta. Puedes intentar de nuevo u otro método."
                : "El pago no se completó. Revisa tus datos o elige otro método.")}
          </div>
        )}

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Entrega
          </h2>
          <div className="mt-5 space-y-3">
            {(
              [
                {
                  id: "delivery" as const,
                  title: "Envío a domicilio",
                  description: "Calculamos la tarifa según tu departamento.",
                },
                {
                  id: "pickup" as const,
                  title: "Retiro en tienda",
                  description: "Sin costo. Te avisamos cuando esté listo.",
                },
              ] as const
            ).map((opt) => (
              <label
                key={opt.id}
                className={`flex cursor-pointer gap-4 border p-4 transition ${
                  shippingMethod === opt.id
                    ? "border-[var(--ink)] bg-[var(--mist)]"
                    : "border-[var(--ink)]/15 hover:border-[var(--ink)]/40"
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value={opt.id}
                  checked={shippingMethod === opt.id}
                  onChange={() => setShippingMethod(opt.id)}
                  className="mt-1 accent-[var(--accent)]"
                />
                <span>
                  <span className="block text-sm font-medium">{opt.title}</span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    {opt.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            {shippingMethod === "pickup" ? "Tus datos" : "Datos de envío"}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              Nombre completo
              <input
                name="fullName"
                required
                className={inputClass}
                autoComplete="name"
              />
            </label>
            <label className="block text-sm">
              Correo
              <input
                name="email"
                type="email"
                required
                className={inputClass}
                autoComplete="email"
              />
            </label>
            <label className="block text-sm">
              Teléfono / WhatsApp
              <input
                name="phone"
                type="tel"
                required
                className={inputClass}
                autoComplete="tel"
                placeholder="502…"
              />
            </label>
            <label className="block text-sm">
              Departamento
              <select
                name="department"
                required
                className={inputClass}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona
                </option>
                {DEPARTMENTS_GT.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Municipio
              <input name="municipality" required className={inputClass} />
            </label>
            <label className="block text-sm sm:col-span-2">
              {shippingMethod === "pickup"
                ? "Dirección (opcional / referencia)"
                : "Dirección de entrega"}
              <input
                name="address"
                required={shippingMethod === "delivery"}
                className={inputClass}
                placeholder="Calle, zona, referencias"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              Notas (opcional)
              <textarea name="notes" rows={3} className={inputClass} />
            </label>
          </div>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Método de pago
          </h2>
          <div className="mt-5 space-y-3">
            {paymentOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex cursor-pointer gap-4 border p-4 transition ${
                  paymentMethod === opt.id
                    ? "border-[var(--ink)] bg-[var(--mist)]"
                    : "border-[var(--ink)]/15 hover:border-[var(--ink)]/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.id}
                  checked={paymentMethod === opt.id}
                  onChange={() => setPaymentMethod(opt.id)}
                  className="mt-1 accent-[var(--accent)]"
                />
                <span>
                  <span className="block text-sm font-medium text-[var(--ink)]">
                    {opt.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[var(--muted)]">
                    {opt.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit border border-[var(--ink)]/10 bg-[var(--mist)]/60 p-6 lg:sticky lg:top-28">
        <p className="text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Tu pedido
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex justify-between gap-3"
            >
              <span className="text-[var(--muted)]">
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-2 border-t border-[var(--ink)]/10 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[var(--muted)]">{shippingQuote.label}</span>
            <span>
              {shippingQuote.amount === 0
                ? "Gratis"
                : formatPrice(shippingQuote.amount)}
            </span>
          </div>
          <p className="text-xs text-[var(--muted)]">{shippingQuote.eta}</p>
          {shippingMethod === "delivery" && subtotal < FREE_SHIPPING_MIN && (
            <p className="text-xs text-[var(--accent)]">
              Envío gratis desde {formatPrice(FREE_SHIPPING_MIN)}
            </p>
          )}
          <div className="flex justify-between border-t border-[var(--ink)]/10 pt-3 font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting || itemCount === 0}
          className="mt-6 w-full bg-[var(--ink)] px-4 py-3.5 text-xs font-semibold tracking-[0.2em] text-white uppercase transition hover:bg-[var(--accent)] disabled:opacity-60"
        >
          {submitting
            ? "Procesando…"
            : paymentMethod === "tarjeta"
              ? "Pagar con tarjeta"
              : "Confirmar pedido"}
        </button>
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">
          Recibirás un correo de confirmación. Ver{" "}
          <a href="/envios" className="underline underline-offset-2">
            política de envíos
          </a>
          .
        </p>
      </aside>
    </form>
  );
}

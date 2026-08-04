import type { Metadata } from "next";
import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { SHIPPING_LABELS } from "@/lib/shipping";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function PedidoConfirmadoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const metodo = pick(sp.metodo) || "contra_entrega";
  const id = pick(sp.id) || "—";
  const paid = pick(sp.pagado) === "1";
  const order = id !== "—" ? await getOrder(id) : undefined;

  const copy =
    metodo === "tarjeta"
      ? paid || order?.status === "paid"
        ? "Tu pago con tarjeta fue confirmado. Prepararemos tu pedido pronto. Revisa tu correo."
        : "Recibimos tu pedido. Si acabas de pagar, la confirmación puede tardar unos segundos."
      : metodo === "transferencia"
        ? "Tu pedido quedó registrado. Te enviaremos los datos bancarios por WhatsApp/correo. Al confirmar el depósito, lo preparamos."
        : "Tu pedido quedó registrado con pago contra entrega. Te contactaremos para coordinar el envío.";

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-32 pb-20 text-center sm:px-6">
      <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
        Gracias
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
        {metodo === "tarjeta" && (paid || order?.status === "paid")
          ? "Pago confirmado"
          : "Pedido recibido"}
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Número de pedido: <span className="text-[var(--ink)]">{id}</span>
      </p>
      {order && (
        <div className="mt-6 w-full max-w-sm space-y-2 border border-[var(--ink)]/10 bg-[var(--mist)]/40 px-5 py-4 text-left text-sm">
          <p className="text-xs tracking-wide text-[var(--muted)] uppercase">
            Estado: {order.status.replace(/_/g, " ")}
          </p>
          <p>
            {SHIPPING_LABELS[order.shippingMethod ?? "delivery"]}:{" "}
            {order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}
          </p>
          <p className="font-medium">Total: {formatPrice(order.total)}</p>
          <p className="text-xs text-[var(--muted)]">
            Enviamos un correo a {order.customer.email}
          </p>
        </div>
      )}
      <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">{copy}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/tienda"
          className="bg-[var(--ink)] px-6 py-3 text-xs tracking-[0.2em] text-white uppercase"
        >
          Seguir comprando
        </Link>
        <a
          href={whatsappUrl(`Hola, quiero consultar sobre mi pedido ${id}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[var(--ink)]/20 px-6 py-3 text-xs tracking-[0.2em] uppercase"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

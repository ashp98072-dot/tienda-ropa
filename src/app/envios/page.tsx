import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_MIN, SHIPPING_ZONES } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Envíos",
  description:
    "Tarifas y tiempos de envío de I NEED YOU a todo Guatemala. Retiro en tienda disponible.",
};

export default function EnviosPage() {
  return (
    <LegalPage eyebrow="Logística" title="Envíos a todo Guatemala">
      <p>
        Enviamos a los 22 departamentos. También puedes elegir{" "}
        <strong>retiro en tienda</strong> sin costo de envío.
      </p>

      <h2>Tarifas</h2>
      <ul>
        {SHIPPING_ZONES.map((zone) => (
          <li key={zone.name}>
            <strong>{zone.name}</strong> — {formatPrice(zone.price)} · {zone.eta}
            <br />
            <span className="text-[var(--muted)]">
              {zone.departments.join(", ")}
            </span>
          </li>
        ))}
      </ul>

      <p>
        <strong>Envío gratis</strong> en compras desde{" "}
        {formatPrice(FREE_SHIPPING_MIN)} (solo domicilio).
      </p>

      <h2>Retiro en tienda</h2>
      <p>
        Selecciona “Retiro en tienda” en el checkout. Te confirmamos por WhatsApp
        o correo cuando tu pedido esté listo (aprox. 24–48 h hábiles).
      </p>

      <h2>Contra entrega</h2>
      <p>
        Disponible según zona y cobertura. El monto a pagar al recibir incluye
        productos + envío.
      </p>

      <p>
        ¿Dudas?{" "}
        <Link href="/contacto" className="text-[var(--accent)] underline">
          Contáctanos
        </Link>{" "}
        o escribe por WhatsApp.
      </p>
    </LegalPage>
  );
}

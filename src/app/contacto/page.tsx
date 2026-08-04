import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta a I NEED YOU por WhatsApp para asesoría y pedidos.",
};

export default function ContactoPage() {
  return (
    <LegalPage eyebrow="Ayuda" title="Contacto">
      <p>
        ¿Necesitas tallas, disponibilidad o seguimiento de un pedido? Estamos
        para asesorarte.
      </p>

      <h2>WhatsApp</h2>
      <p>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex bg-[var(--ink)] px-5 py-3 text-xs tracking-[0.18em] text-white uppercase"
        >
          Escribir a {SITE.brand}
        </a>
      </p>

      <h2>Horario de atención</h2>
      <p>Lunes a sábado, 9:00–18:00 (hora Guatemala).</p>

      <h2>Pedidos en línea</h2>
      <p>
        La tienda está disponible 24/7. Los envíos y confirmaciones se procesan
        en horario hábil.
      </p>
    </LegalPage>
  );
}

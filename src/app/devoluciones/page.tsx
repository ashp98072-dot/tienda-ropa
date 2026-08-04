import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cambios y devoluciones",
  description:
    "Política de cambios y devoluciones de I NEED YOU Guatemala.",
};

export default function DevolucionesPage() {
  return (
    <LegalPage eyebrow="Políticas" title="Cambios y devoluciones">
      <p>
        Queremos que ames lo que pediste. Si algo no queda bien, te ayudamos
        dentro de estas condiciones:
      </p>

      <h2>Plazo</h2>
      <p>
        Tienes <strong>7 días calendario</strong> desde que recibes el pedido
        para solicitar un cambio (talla/color) o devolución.
      </p>

      <h2>Condiciones</h2>
      <ul>
        <li>La prenda debe estar sin uso, con etiquetas y empaque original.</li>
        <li>No aplican cambios en prendas en oferta final o personalizadas.</li>
        <li>
          Por higiene, no se aceptan cambios en ropa interior o accesorios de
          contacto directo (si aplica).
        </li>
      </ul>

      <h2>Cómo solicitarlo</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Escríbenos por WhatsApp con tu número de pedido y fotos.</li>
        <li>Confirmamos disponibilidad de talla/color o reembolso.</li>
        <li>Coordinamos recolección o entrega en tienda.</li>
      </ol>

      <p className="mt-6">
        <a
          href={whatsappUrl(
            "Hola, quiero solicitar un cambio o devolución de mi pedido",
          )}
          className="text-[var(--accent)] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Solicitar por WhatsApp
        </a>
      </p>
    </LegalPage>
  );
}

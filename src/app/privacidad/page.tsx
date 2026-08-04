import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Aviso de privacidad de I NEED YOU Guatemala.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage eyebrow="Legal" title="Aviso de privacidad">
      <p>
        En <strong>{SITE.brand}</strong> protegemos tus datos personales
        conforme a buenas prácticas y la legislación aplicable en Guatemala.
      </p>

      <h2>Datos que recopilamos</h2>
      <ul>
        <li>Nombre, correo, teléfono y dirección de entrega.</li>
        <li>Detalle de pedidos y método de pago elegido.</li>
        <li>
          Datos de pago con tarjeta los procesa <strong>QPayPro / VisaNet</strong>;
          no almacenamos números de tarjeta en nuestros servidores.
        </li>
      </ul>

      <h2>Uso</h2>
      <p>
        Usamos tus datos para procesar pedidos, envíos, soporte por WhatsApp o
        correo, y mejorar la experiencia de compra. No vendemos tu información.
      </p>

      <h2>Conservación</h2>
      <p>
        Conservamos la información de pedidos el tiempo necesario para
        operación, contabilidad y atención postventa.
      </p>

      <h2>Contacto</h2>
      <p>
        Para consultas sobre tus datos, escríbenos a través del WhatsApp de la
        tienda o el correo de pedidos publicado en el sitio.
      </p>
    </LegalPage>
  );
}

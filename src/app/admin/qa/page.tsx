import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const checks = [
  "Inicio muestra la marca I NEED YOU y el botón a la tienda (móvil y desktop)",
  "Filtros: segmento, género, categoría, talla y búsqueda",
  "Ficha: elegir talla/color y añadir a bolsa",
  "Lista de deseos (corazón) y página /deseos",
  "Carrito: cambiar cantidad y quitar ítems",
  "Checkout: envío a domicilio con tarifa por departamento",
  "Checkout: retiro en tienda = envío Q0",
  "Pago contra entrega crea pedido y aparece en admin",
  "Pago transferencia crea pedido en estado «Esperando transferencia»",
  "Pago tarjeta (sandbox QPayPro o /pago/demo) marca «Pagado»",
  "Correo de pedido se registra en consola o llega por SMTP/Resend",
  "Páginas /envios, /devoluciones, /privacidad, /contacto",
  "WhatsApp flotante abre el número correcto",
  "Admin: crear, editar y ocultar producto (varias fotos)",
  "Admin: cambiar pedido a Enviado o Entregado",
  "sitemap.xml y robots.txt responden",
];

export default async function AdminQaPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-4xl">
        Lista de prueba
      </h1>
      <div className="mb-8 max-w-2xl space-y-3 text-sm text-[var(--muted)]">
        <p>
          <strong className="text-[var(--ink)]">¿Qué es esto?</strong> Es una
          lista interna para quien administra la página (Shannon / el encargado).
          Sirve para revisar, antes de abrir la tienda al público, que todo
          funciona: catálogo, carrito, pagos, envíos y WhatsApp.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Los clientes no la ven.</strong>{" "}
          Solo existe dentro de <code className="text-[var(--ink)]">/admin</code>{" "}
          con contraseña. No aparece en el menú de la tienda.
        </p>
        <p>Marca cada punto cuando lo hayas probado (mentalmente o en papel).</p>
      </div>
      <ul className="space-y-3">
        {checks.map((item) => (
          <li
            key={item}
            className="flex gap-3 border border-black/10 bg-white px-4 py-3 text-sm"
          >
            <span className="mt-0.5 inline-block h-4 w-4 shrink-0 border border-black/30" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

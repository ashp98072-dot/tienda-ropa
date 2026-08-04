import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const checks = [
  "Home carga marca I NEED YOU + CTA a tienda (móvil y desktop)",
  "Filtros: segmento, género, categoría, talla y búsqueda",
  "Ficha: elegir talla/color y añadir a bolsa",
  "Wishlist (corazón) y página /deseos",
  "Carrito: cambiar cantidad y quitar ítems",
  "Checkout: envío domicilio con tarifa por departamento",
  "Checkout: retiro en tienda = envío Q0",
  "Pago contra entrega crea pedido y aparece en admin",
  "Pago transferencia crea pedido awaiting_transfer",
  "Pago tarjeta (sandbox QPayPro o /pago/demo) marca paid",
  "Correo de pedido se loguea en consola o llega por SMTP/Resend",
  "Páginas /envios, /devoluciones, /privacidad, /contacto",
  "WhatsApp flotante abre el número correcto",
  "Admin: crear, editar y ocultar producto",
  "Admin: cambiar pedido a shipped / delivered",
  "sitemap.xml y robots.txt responden",
];

export default async function AdminQaPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-4xl">
        Checklist QA
      </h1>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Marca mentalmente antes del go-live. Imprime o copia a Notion si quieres.
      </p>
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

import { redirect } from "next/navigation";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const orders = await listOrders();

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-4xl">
        Pedidos
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-[var(--muted)]">
        Filtra, busca y abre el detalle de cada pedido. Cambia el estado a{" "}
        <strong>En preparación</strong>, <strong>Enviado</strong> o{" "}
        <strong>Entregado</strong> según avances. El método de pago (Tarjeta /
        Transferencia / Contra entrega) es aparte del estado del pedido.
      </p>
      <OrdersTable orders={orders} />
    </div>
  );
}

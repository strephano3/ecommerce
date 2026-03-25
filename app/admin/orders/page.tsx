import Link from "next/link";

import { readOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await readOrders();

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Ordini</p>
          <h1>Gestione ordini</h1>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="admin-table">
          <div className="admin-table-row admin-table-head orders-table">
            <span>Numero</span>
            <span>Cliente</span>
            <span>Stato</span>
            <span>Pagamento</span>
            <span>Totale</span>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="admin-table-row orders-table">
              <span>
                <Link href={`/admin/orders/${order.id}`}>{order.number}</Link>
              </span>
              <span>{order.email}</span>
              <span>{order.status.toLowerCase()}</span>
              <span>{order.paymentStatus.toLowerCase()}</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Nessun ordine presente</h3>
          <p>Gli ordini creati dal checkout compariranno qui.</p>
        </div>
      )}
    </section>
  );
}

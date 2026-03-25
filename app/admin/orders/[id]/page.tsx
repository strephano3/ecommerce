import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminOrderForm } from "@/components/admin-order-form";
import { getOrderById } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null) {
  if (!value) {
    return "Non impostata";
  }

  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}

export default async function AdminOrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Ordine {order.number}</p>
          <h1>Dettaglio ordine</h1>
        </div>
        <Link href="/admin/orders" className="button button-light">
          Torna agli ordini
        </Link>
      </div>

      <div className="order-detail-grid">
        <div className="info-card">
          <h3>Riepilogo</h3>
          <p>Cliente: {order.email}</p>
          <p>Stato ordine: {order.status.toLowerCase()}</p>
          <p>Stato pagamento: {order.paymentStatus.toLowerCase()}</p>
          <p>Provider: {order.paymentProvider || "non impostato"}</p>
          <p>Totale: {formatPrice(order.total)}</p>
        </div>

        <div className="info-card">
          <h3>Timeline operativa</h3>
          <p>Creato: {formatDate(order.createdAt)}</p>
          <p>Fulfillment: {formatDate(order.fulfilledAt)}</p>
          <p>Spedito: {formatDate(order.shippedAt)}</p>
          <p>Consegnato: {formatDate(order.deliveredAt)}</p>
          <p>Rimborsato: {formatDate(order.refundedAt)}</p>
          <p>Reso richiesto: {formatDate(order.returnRequestedAt)}</p>
          <p>Reso completato: {formatDate(order.returnedAt)}</p>
        </div>
      </div>

      <div className="order-detail-grid">
        <div className="info-card">
          <h3>Indirizzo spedizione</h3>
          {order.shippingAddress ? (
            <>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}
              <p>
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone || "Telefono non inserito"}</p>
            </>
          ) : (
            <p>Nessun indirizzo associato.</p>
          )}
        </div>

        <div className="info-card">
          <h3>Articoli</h3>
          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.id} className="checkout-line">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section nested-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Operazioni admin</p>
            <h2>Fulfillment, rimborso e reso</h2>
          </div>
        </div>
        <AdminOrderForm order={order} />
      </section>
    </section>
  );
}

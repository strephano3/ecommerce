"use client";

import { OrderStatus, PaymentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AdminOrderFormProps = {
  order: {
    id: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    trackingNumber: string | null;
    trackingUrl: string | null;
    internalNotes: string | null;
    refundReason: string | null;
    returnReason: string | null;
    refundedAmount: number;
  };
};

const orderStatuses = Object.values(OrderStatus);
const paymentStatuses = Object.values(PaymentStatus);

export function AdminOrderForm({ order }: AdminOrderFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");
  const [internalNotes, setInternalNotes] = useState(order.internalNotes || "");
  const [refundReason, setRefundReason] = useState(order.refundReason || "");
  const [returnReason, setReturnReason] = useState(order.returnReason || "");
  const [refundedAmount, setRefundedAmount] = useState(
    order.refundedAmount ? String(order.refundedAmount / 100) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const response = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        paymentStatus,
        trackingNumber,
        trackingUrl,
        internalNotes,
        refundReason,
        returnReason,
        refundedAmount: refundedAmount ? Math.round(Number(refundedAmount) * 100) : 0
      })
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setError(data.message || "Salvataggio fallito");
      setIsSaving(false);
      return;
    }

    router.refresh();
    setIsSaving(false);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label>
          Stato ordine
          <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
            {orderStatuses.map((value) => (
              <option key={value} value={value}>
                {value.toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <label>
          Stato pagamento
          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
          >
            {paymentStatuses.map((value) => (
              <option key={value} value={value}>
                {value.toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tracking number
          <input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} />
        </label>
        <label>
          Tracking URL
          <input value={trackingUrl} onChange={(event) => setTrackingUrl(event.target.value)} />
        </label>
        <label>
          Importo rimborsato EUR
          <input
            type="number"
            min="0"
            step="0.01"
            value={refundedAmount}
            onChange={(event) => setRefundedAmount(event.target.value)}
          />
        </label>
      </div>

      <label>
        Note interne
        <textarea
          rows={4}
          value={internalNotes}
          onChange={(event) => setInternalNotes(event.target.value)}
        />
      </label>

      <label>
        Motivo rimborso
        <textarea
          rows={3}
          value={refundReason}
          onChange={(event) => setRefundReason(event.target.value)}
        />
      </label>

      <label>
        Motivo reso
        <textarea
          rows={3}
          value={returnReason}
          onChange={(event) => setReturnReason(event.target.value)}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button type="submit" className="button button-dark" disabled={isSaving}>
        {isSaving ? "Salvataggio..." : "Aggiorna ordine"}
      </button>
    </form>
  );
}

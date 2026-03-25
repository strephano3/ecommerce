"use client";

import { FormEvent, useEffect, useState } from "react";

import { PayPalButton } from "@/components/paypal-button";
import { readCart, writeCart } from "@/lib/cart-storage";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type CheckoutState = {
  email: string;
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
};

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

const initialState: CheckoutState = {
  email: "",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  country: "Italia",
  phone: ""
};

function subtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function PaymentMethodButton({
  label,
  icon,
  tone,
  onClick,
  busy = false
}: {
  label: string;
  icon: string;
  tone: "dark" | "light" | "pink";
  onClick: () => void;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      className={`payment-method-button payment-method-${tone}`}
      onClick={onClick}
    >
      <span className="payment-method-icon">{icon}</span>
      <span>{busy ? "Reindirizzamento..." : label}</span>
    </button>
  );
}

export function CheckoutForm() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState<CheckoutState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setItems(readCart());
  }, []);

  function isFormValid() {
    return Boolean(
      form.email &&
        form.fullName &&
        form.line1 &&
        form.city &&
        form.postalCode &&
        form.country &&
        items.length > 0
    );
  }

  const formValid = isFormValid();

  function requireCompleteForm() {
    setError("prima compila con tutti i dati necessari");
    setSuccess(null);
  }

  async function handleStripeCheckout(preferredMethod: "card" | "apple_pay" | "klarna") {
    setError(null);
    setSuccess(null);

    if (!formValid) {
      requireCompleteForm();
      return;
    }

    setIsRedirecting(true);

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items,
        preferredMethod
      })
    });

    const data = (await response.json()) as { url?: string; message?: string };

    if (!response.ok || !data.url) {
      setError(data.message || "Avvio checkout Stripe fallito.");
      setIsRedirecting(false);
      return;
    }

    window.location.href = data.url;
  }

  if (items.length === 0 && !success) {
    return (
      <div className="empty-state">
        <h3>Nessun prodotto da acquistare</h3>
        <p>Aggiungi articoli al carrello prima di completare il checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-shell">
      <form className="admin-form" onSubmit={(event) => event.preventDefault()}>
        <div className="admin-form-grid">
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label>
            Nome completo
            <input
              required
              value={form.fullName}
              onChange={(event) =>
                setForm((current) => ({ ...current, fullName: event.target.value }))
              }
            />
          </label>
          <label>
            Indirizzo
            <input
              required
              value={form.line1}
              onChange={(event) => setForm((current) => ({ ...current, line1: event.target.value }))}
            />
          </label>
          <label>
            Interno / note
            <input
              value={form.line2}
              onChange={(event) => setForm((current) => ({ ...current, line2: event.target.value }))}
            />
          </label>
          <label>
            Citta
            <input
              required
              value={form.city}
              onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
            />
          </label>
          <label>
            CAP
            <input
              required
              value={form.postalCode}
              onChange={(event) =>
                setForm((current) => ({ ...current, postalCode: event.target.value }))
              }
            />
          </label>
          <label>
            Paese
            <input
              required
              value={form.country}
              onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))}
            />
          </label>
          <label>
            Telefono
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            />
          </label>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
        {success ? <p className="form-success">{success}</p> : null}
        {!formValid ? <p className="helper-text">Prima compila con tutti i dati necessari.</p> : null}

        <div className="payment-actions">
          <PaymentMethodButton
            label="Apple Pay"
            icon=""
            tone="dark"
            busy={isRedirecting}
            onClick={() => void handleStripeCheckout("apple_pay")}
          />
          <PaymentMethodButton
            label="Klarna"
            icon="K"
            tone="pink"
            busy={isRedirecting}
            onClick={() => void handleStripeCheckout("klarna")}
          />
        </div>

        {paypalClientId ? (
          <div className="paypal-block">
            <p className="helper-text">Oppure scegli PayPal.</p>
            {formValid ? (
              <PayPalButton
                clientId={paypalClientId}
                form={form}
                items={items}
                onError={(message) => setError(message)}
                onSuccess={(message) => setSuccess(message)}
              />
            ) : (
              <button
                type="button"
                className="payment-method-button payment-method-paypal"
                onClick={requireCompleteForm}
              >
                <span className="payment-method-icon">P</span>
                <span>PayPal</span>
              </button>
            )}
          </div>
        ) : null}
      </form>

      <aside className="info-card">
        <h3>Riepilogo ordine</h3>
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="checkout-line">
            <span>
              {item.name} / {item.size} x {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="checkout-total">
          <strong>Totale</strong>
          <strong>{formatPrice(subtotal(items))}</strong>
        </div>
      </aside>
    </div>
  );
}

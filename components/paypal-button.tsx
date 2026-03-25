"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

import { writeCart } from "@/lib/cart-storage";
import type { CartItem } from "@/lib/types";

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

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError: (error: unknown) => void;
      }) => { render: (selector: HTMLElement) => void };
    };
  }
}

export function PayPalButton({
  clientId,
  form,
  items,
  onError,
  onSuccess
}: {
  clientId: string;
  form: CheckoutState;
  items: CartItem[];
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !ref.current) {
      return;
    }

    ref.current.innerHTML = "";
    window.paypal
      .Buttons({
        createOrder: async () => {
          const response = await fetch("/api/paypal/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              items
            })
          });

          const data = (await response.json()) as { id?: string; message?: string };
          if (!response.ok || !data.id) {
            throw new Error(data.message || "Creazione ordine PayPal fallita");
          }

          return data.id;
        },
        onApprove: async (data) => {
          const response = await fetch(`/api/paypal/order/${data.orderID}/capture`, {
            method: "POST"
          });
          const payload = (await response.json()) as { message?: string };

          if (!response.ok) {
            throw new Error(payload.message || "Cattura PayPal fallita");
          }

          writeCart([]);
          onSuccess("Pagamento PayPal completato con successo.");
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Errore PayPal";
          onError(message);
        }
      })
      .render(ref.current);
  }, [sdkReady, form, items, onError, onSuccess]);

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
      <div ref={ref} className="paypal-slot" />
    </>
  );
}

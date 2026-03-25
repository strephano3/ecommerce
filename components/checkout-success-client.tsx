"use client";

import { useEffect, useState } from "react";

import { writeCart } from "@/lib/cart-storage";

export function CheckoutSuccessClient({
  provider,
  sessionId
}: {
  provider?: string;
  sessionId?: string;
}) {
  const [message, setMessage] = useState("Verifica pagamento in corso...");

  useEffect(() => {
    async function confirm() {
      if (provider === "stripe" && sessionId) {
        const response = await fetch("/api/stripe/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId })
        });

        const data = (await response.json()) as { paymentStatus?: string; message?: string };
        if (!response.ok) {
          setMessage(data.message || "Pagamento Stripe non confermato.");
          return;
        }
      }

      writeCart([]);
      setMessage("Pagamento registrato. Riceverai una conferma via email dopo l'elaborazione dell'ordine.");
    }

    void confirm();
  }, [provider, sessionId]);

  return <p className="section-copy">{message}</p>;
}

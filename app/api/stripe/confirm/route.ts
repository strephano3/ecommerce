import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { updateOrderPaymentState } from "@/lib/orders";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sessionId?: string };
    if (!body.sessionId) {
      throw new Error("sessionId mancante");
    }

    const session = await stripe.checkout.sessions.retrieve(body.sessionId);

    if (!session.metadata?.orderId) {
      throw new Error("Sessione Stripe non valida");
    }

    if (session.payment_status === "paid") {
      await updateOrderPaymentState({
        orderId: session.metadata.orderId,
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.PAID,
        paymentProvider: "stripe"
      });
    }

    return NextResponse.json({
      ok: true,
      paymentStatus: session.payment_status
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore conferma Stripe";
    return NextResponse.json({ message }, { status: 400 });
  }
}

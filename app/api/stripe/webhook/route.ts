import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { updateOrderPaymentState } from "@/lib/orders";
import { getStripeWebhookSecret } from "@/lib/payments";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Firma Stripe mancante" }, { status: 400 });
  }

  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret());

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await updateOrderPaymentState({
          orderId,
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.PAID,
          paymentProvider: "stripe"
        });
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await updateOrderPaymentState({
          orderId,
          paymentStatus: PaymentStatus.FAILED,
          status: OrderStatus.CANCELLED,
          paymentProvider: "stripe"
        });
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await updateOrderPaymentState({
          orderId,
          paymentStatus: PaymentStatus.FAILED,
          status: OrderStatus.CANCELLED,
          paymentProvider: "stripe"
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook Stripe non valido";
    return NextResponse.json({ message }, { status: 400 });
  }
}

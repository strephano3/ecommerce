import Stripe from "stripe";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { createOrder, type CheckoutInput, updateOrderPaymentState } from "@/lib/orders";
import { stripe } from "@/lib/stripe";

function sessionBody(
  input: CheckoutInput & { orderId: string; preferredMethod?: "card" | "apple_pay" | "klarna" },
  origin: string
): Stripe.Checkout.SessionCreateParams {
  const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    input.preferredMethod === "klarna" ? ["klarna"] : ["card"];

  return {
    mode: "payment" as const,
    locale: "it" as const,
    success_url: `${origin}/checkout/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?cancelled=stripe`,
    customer_email: input.email,
    metadata: {
      orderId: input.orderId,
      preferredMethod: input.preferredMethod || "card"
    },
    payment_intent_data: {
      metadata: {
        orderId: input.orderId,
        preferredMethod: input.preferredMethod || "card"
      }
    },
    payment_method_types: paymentMethodTypes,
    shipping_address_collection: {
      allowed_countries: ["IT"]
    },
    phone_number_collection: {
      enabled: true
    },
    line_items: input.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: item.price,
        product_data: {
          name: item.name,
          description: `Taglia ${item.size}`
        }
      }
    }))
  };
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const input = (await request.json()) as CheckoutInput & {
    preferredMethod?: "card" | "apple_pay" | "klarna";
  };

  let orderId: string | null = null;

  try {
    const order = await createOrder(input, { paymentProvider: "stripe" });
    orderId = order.id;

    const session = await stripe.checkout.sessions.create(
      sessionBody({ ...input, orderId }, origin)
    );

    if (!session.url) {
      throw new Error("Creazione sessione Stripe fallita");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (orderId) {
      await updateOrderPaymentState({
        orderId,
        paymentStatus: PaymentStatus.FAILED,
        status: OrderStatus.CANCELLED,
        paymentProvider: "stripe"
      });
    }

    const message = error instanceof Error ? error.message : "Errore Stripe";
    return NextResponse.json({ message }, { status: 400 });
  }
}

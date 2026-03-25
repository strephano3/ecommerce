import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { createOrder, type CheckoutInput, updateOrderPaymentState } from "@/lib/orders";
import {
  getPayPalBaseUrl,
  getPayPalClientId,
  getPayPalClientSecret,
  toPayPalAmount
} from "@/lib/payments";

async function getAccessToken() {
  const credentials = Buffer.from(
    `${getPayPalClientId()}:${getPayPalClientSecret()}`
  ).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = (await response.json()) as { access_token?: string };
  if (!response.ok || !data.access_token) {
    throw new Error("Access token PayPal non ottenuto");
  }

  return data.access_token;
}

export async function POST(request: Request) {
  const input = (await request.json()) as CheckoutInput;

  let orderId: string | null = null;

  try {
    const order = await createOrder(input, { paymentProvider: "paypal" });
    orderId = order.id;

    const accessToken = await getAccessToken();
    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: order.id,
            amount: {
              currency_code: "EUR",
              value: toPayPalAmount(order.total)
            }
          }
        ]
      })
    });

    const data = (await response.json()) as { id?: string; message?: string };

    if (!response.ok || !data.id) {
      throw new Error(data.message || "Creazione ordine PayPal fallita");
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    if (orderId) {
      await updateOrderPaymentState({
        orderId,
        paymentStatus: PaymentStatus.FAILED,
        status: OrderStatus.CANCELLED,
        paymentProvider: "paypal"
      });
    }

    const message = error instanceof Error ? error.message : "Errore PayPal";
    return NextResponse.json({ message }, { status: 400 });
  }
}

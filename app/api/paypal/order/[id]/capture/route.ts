import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { updateOrderPaymentState } from "@/lib/orders";
import { getPayPalBaseUrl, getPayPalClientId, getPayPalClientSecret } from "@/lib/payments";

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

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getAccessToken();

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${id}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    const data = (await response.json()) as {
      status?: string;
      purchase_units?: Array<{ custom_id?: string }>;
    };

    if (!response.ok || !data.purchase_units?.[0]?.custom_id) {
      throw new Error("Cattura PayPal fallita");
    }

    await updateOrderPaymentState({
      orderId: data.purchase_units[0].custom_id,
      paymentStatus: data.status === "COMPLETED" ? PaymentStatus.PAID : PaymentStatus.PENDING,
      status: data.status === "COMPLETED" ? OrderStatus.PAID : OrderStatus.PENDING,
      paymentProvider: "paypal"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore capture PayPal";
    return NextResponse.json({ message }, { status: 400 });
  }
}

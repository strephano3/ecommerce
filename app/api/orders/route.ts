import { NextResponse } from "next/server";

import { createOrder } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      email: string;
      fullName: string;
      line1: string;
      line2?: string;
      city: string;
      postalCode: string;
      country: string;
      phone?: string;
      items: Array<{
        productId: string;
        slug: string;
        name: string;
        imageUrl?: string;
        size: string;
        quantity: number;
        price: number;
      }>;
    };

    const order = await createOrder(payload);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore ordine";
    return NextResponse.json({ message }, { status: 400 });
  }
}

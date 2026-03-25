import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { isAdminAuthenticated } from "@/lib/auth";
import { updateOrderAdmin } from "@/lib/orders";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = (await request.json()) as {
      status: keyof typeof OrderStatus;
      paymentStatus: keyof typeof PaymentStatus;
      trackingNumber?: string;
      trackingUrl?: string;
      internalNotes?: string;
      refundReason?: string;
      returnReason?: string;
      refundedAmount?: number;
    };

    const order = await updateOrderAdmin({
      orderId: id,
      status: OrderStatus[payload.status],
      paymentStatus: PaymentStatus[payload.paymentStatus],
      trackingNumber: payload.trackingNumber,
      trackingUrl: payload.trackingUrl,
      internalNotes: payload.internalNotes,
      refundReason: payload.refundReason,
      returnReason: payload.returnReason,
      refundedAmount: payload.refundedAmount
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);

    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Aggiornamento ordine fallito";
    return NextResponse.json({ message }, { status: 400 });
  }
}

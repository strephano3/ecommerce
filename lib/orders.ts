import { OrderStatus, PaymentStatus } from "@prisma/client";

import {
  sendOrderReceivedEmail,
  sendOrderShippedEmail,
  sendPaymentConfirmedEmail,
  sendRefundIssuedEmail
} from "@/lib/email";
import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/lib/types";

export type CheckoutInput = {
  email: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  items: CartItem[];
};

type CreateOrderOptions = {
  paymentProvider?: string | null;
};

async function runEmailTask(label: string, task: () => Promise<unknown>) {
  try {
    await task();
  } catch (error) {
    console.error(`Email task failed: ${label}`, error);
  }
}

export async function readOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      shippingAddress: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      shippingAddress: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });
}

function orderNumber() {
  const stamp = Date.now().toString().slice(-8);
  return `TG-${stamp}`;
}

export async function createOrder(input: CheckoutInput, options: CreateOrderOptions = {}) {
  const items = input.items.filter((item) => item.quantity > 0);

  if (items.length === 0) {
    throw new Error("Carrello vuoto");
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const productSlugs = [...new Set(items.map((item) => item.slug))];
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { id: { in: productIds } },
        { slug: { in: productSlugs } }
      ]
    },
    include: { variants: true }
  });

  const productMap = new Map(products.map((product) => [product.id, product]));
  const productSlugMap = new Map(products.map((product) => [product.slug, product]));
  const resolvedItems = items.map((item) => {
    const product = productMap.get(item.productId) ?? productSlugMap.get(item.slug);
    return {
      item,
      product
    };
  });

  for (const entry of resolvedItems) {
    const { item, product } = entry;
    if (!product) {
      throw new Error("Prodotto non trovato");
    }

    const variant = product.variants.find((entry) => entry.size === item.size);
    if (!variant) {
      throw new Error("Variante non trovata");
    }

    if (variant.stock < item.quantity) {
      throw new Error(`Stock insufficiente per ${product.name} taglia ${item.size}`);
    }
  }

  const validatedItems = resolvedItems.map(({ item, product }) => ({
    item,
    product: product!
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: {
        fullName: input.fullName,
        line1: input.line1,
        line2: input.line2 || null,
        city: input.city,
        postalCode: input.postalCode,
        country: input.country,
        phone: input.phone || null
      }
    });

    for (const entry of validatedItems) {
      const { item, product } = entry;
      const variant = product.variants.find((entry) => entry.size === item.size)!;

      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return tx.order.create({
      data: {
        number: orderNumber(),
        email: input.email,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        shippingAmount: 0,
        taxAmount: 0,
        total: subtotal,
        paymentProvider: options.paymentProvider ?? null,
        shippingAddressId: address.id,
        items: {
          create: validatedItems.map(({ item, product }) => ({
            quantity: item.quantity,
            unitPrice: item.price,
            productId: product.id
          }))
        }
      },
      include: {
        shippingAddress: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
  });

  await runEmailTask("order_received", () => sendOrderReceivedEmail(order.id));
  return order;
}

export async function updateOrderPaymentState(input: {
  orderId: string;
  paymentStatus: PaymentStatus;
  status?: OrderStatus;
  paymentProvider?: string | null;
}) {
  const before = await prisma.order.findUnique({
    where: { id: input.orderId },
    select: {
      paymentStatus: true
    }
  });

  const order = await prisma.order.update({
    where: { id: input.orderId },
    data: {
      paymentStatus: input.paymentStatus,
      status: input.status,
      paymentProvider: input.paymentProvider
    }
  });

  if (before && before.paymentStatus !== PaymentStatus.PAID && input.paymentStatus === PaymentStatus.PAID) {
    await runEmailTask("payment_confirmed", () => sendPaymentConfirmedEmail(order.id));
  }

  return order;
}

export async function updateOrderAdmin(input: {
  orderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  internalNotes?: string | null;
  refundReason?: string | null;
  returnReason?: string | null;
  refundedAmount?: number;
}) {
  const now = new Date();
  const current = await prisma.order.findUnique({
    where: { id: input.orderId },
    select: {
      status: true,
      paymentStatus: true,
      fulfilledAt: true,
      shippedAt: true,
      deliveredAt: true,
      refundedAt: true,
      returnRequestedAt: true,
      returnedAt: true
    }
  });

  if (!current) {
    throw new Error("Ordine non trovato");
  }

  const order = await prisma.order.update({
    where: { id: input.orderId },
    data: {
      status: input.status,
      paymentStatus: input.paymentStatus,
      trackingNumber: input.trackingNumber || null,
      trackingUrl: input.trackingUrl || null,
      internalNotes: input.internalNotes || null,
      refundReason: input.refundReason || null,
      returnReason: input.returnReason || null,
      refundedAmount: input.refundedAmount ?? 0,
      fulfilledAt:
        input.status === OrderStatus.FULFILLED
          ? current.fulfilledAt ?? now
          : input.status === OrderStatus.PENDING || input.status === OrderStatus.CANCELLED
            ? null
            : current.fulfilledAt,
      shippedAt:
        input.status === OrderStatus.SHIPPED
          ? current.shippedAt ?? now
          : input.status === OrderStatus.PENDING || input.status === OrderStatus.CANCELLED
            ? null
            : current.shippedAt,
      deliveredAt:
        input.status === OrderStatus.DELIVERED
          ? current.deliveredAt ?? now
          : input.status === OrderStatus.PENDING || input.status === OrderStatus.CANCELLED
            ? null
            : current.deliveredAt,
      refundedAt:
        input.paymentStatus === PaymentStatus.REFUNDED
          ? current.refundedAt ?? now
          : current.refundedAt,
      returnRequestedAt:
        input.returnReason && input.status !== OrderStatus.RETURNED
          ? current.returnRequestedAt ?? now
          : current.returnRequestedAt,
      returnedAt:
        input.status === OrderStatus.RETURNED ? current.returnedAt ?? now : current.returnedAt
    }
  });

  if (current.status !== OrderStatus.SHIPPED && input.status === OrderStatus.SHIPPED) {
    await runEmailTask("order_shipped", () => sendOrderShippedEmail(order.id));
  }

  if (
    current.paymentStatus !== PaymentStatus.REFUNDED &&
    input.paymentStatus === PaymentStatus.REFUNDED
  ) {
    await runEmailTask("refund_issued", () => sendRefundIssuedEmail(order.id));
  }

  if (current.paymentStatus !== PaymentStatus.PAID && input.paymentStatus === PaymentStatus.PAID) {
    await runEmailTask("payment_confirmed_admin", () => sendPaymentConfirmedEmail(order.id));
  }

  return order;
}

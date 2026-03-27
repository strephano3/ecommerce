import { Resend } from "resend";

import { getOrderById } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

function required(name: string, value?: string) {
  if (!value) {
    throw new Error(`Variabile ambiente mancante: ${name}`);
  }

  return value;
}

const resend = new Resend(required("RESEND_API_KEY", process.env.RESEND_API_KEY));
const emailFrom = required("EMAIL_FROM", process.env.EMAIL_FROM);
const emailReplyTo = process.env.EMAIL_REPLY_TO;
const orderNotificationEmail = process.env.ORDER_NOTIFICATION_EMAIL ?? emailReplyTo;

type MailTemplate = {
  subject: string;
  html: string;
};

function layout(title: string, body: string) {
  return `
    <div style="font-family: Georgia, serif; background:#f5f1e8; padding:32px; color:#1e241a;">
      <div style="max-width:640px; margin:0 auto; background:#fbf8ef; border:1px solid rgba(30,36,26,0.1); border-radius:24px; padding:32px;">
        <p style="margin:0 0 8px; text-transform:uppercase; letter-spacing:0.12em; color:#5f6658; font-size:12px;">Touch Grass</p>
        <h1 style="margin:0 0 18px; font-size:32px; line-height:1;">${title}</h1>
        ${body}
      </div>
    </div>
  `;
}

function detailRow(label: string, value: string) {
  return `<p style="margin:0 0 6px;"><strong>${label}:</strong> ${value}</p>`;
}

async function orderSummary(orderId: string) {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error("Ordine non trovato per invio email");
  }

  const items = order.items
    .map(
      (item) =>
        `<li>${item.product.name} x ${item.quantity} - ${formatPrice(item.unitPrice * item.quantity)}</li>`
    )
    .join("");

  return { order, items };
}

async function orderReceivedTemplate(orderId: string): Promise<MailTemplate> {
  const { order, items } = await orderSummary(orderId);

  return {
    subject: `Ordine ricevuto ${order.number}`,
    html: layout(
      "Ordine ricevuto",
      `
        <p>Ciao, abbiamo ricevuto il tuo ordine <strong>${order.number}</strong>.</p>
        <p>Totale: <strong>${formatPrice(order.total)}</strong></p>
        <ul>${items}</ul>
        <p>Ti aggiorneremo quando il pagamento sarà confermato e quando la spedizione partirà.</p>
      `
    )
  };
}

async function paymentConfirmedTemplate(orderId: string): Promise<MailTemplate> {
  const { order } = await orderSummary(orderId);

  return {
    subject: `Pagamento confermato ${order.number}`,
    html: layout(
      "Pagamento confermato",
      `
        <p>Il pagamento del tuo ordine <strong>${order.number}</strong> è stato confermato.</p>
        <p>Totale pagato: <strong>${formatPrice(order.total)}</strong></p>
        <p>Stiamo preparando la spedizione.</p>
      `
    )
  };
}

async function shippedTemplate(orderId: string): Promise<MailTemplate> {
  const { order } = await orderSummary(orderId);

  const tracking = order.trackingUrl
    ? `<p>Tracking: <a href="${order.trackingUrl}">${order.trackingNumber || order.trackingUrl}</a></p>`
    : order.trackingNumber
      ? `<p>Tracking: ${order.trackingNumber}</p>`
      : "";

  return {
    subject: `Ordine spedito ${order.number}`,
    html: layout(
      "Ordine spedito",
      `
        <p>Il tuo ordine <strong>${order.number}</strong> è stato spedito.</p>
        ${tracking}
        <p>Riceverai il pacco all'indirizzo indicato durante il checkout.</p>
      `
    )
  };
}

async function refundedTemplate(orderId: string): Promise<MailTemplate> {
  const { order } = await orderSummary(orderId);

  return {
    subject: `Rimborso emesso ${order.number}`,
    html: layout(
      "Rimborso emesso",
      `
        <p>Abbiamo registrato un rimborso per l'ordine <strong>${order.number}</strong>.</p>
        <p>Importo rimborsato: <strong>${formatPrice(order.refundedAmount)}</strong></p>
        ${order.refundReason ? `<p>Motivo: ${order.refundReason}</p>` : ""}
      `
    )
  };
}

async function adminOrderPaidTemplate(orderId: string): Promise<MailTemplate> {
  const { order, items } = await orderSummary(orderId);

  const shipping = order.shippingAddress
    ? `
        ${detailRow("Cliente", order.shippingAddress.fullName)}
        ${detailRow("Email", order.email)}
        ${detailRow("Telefono", order.shippingAddress.phone || "Non inserito")}
        ${detailRow("Indirizzo", order.shippingAddress.line1)}
        ${detailRow("Interno / note", order.shippingAddress.line2 || "Non inserito")}
        ${detailRow("Citta", order.shippingAddress.city)}
        ${detailRow("CAP", order.shippingAddress.postalCode)}
        ${detailRow("Paese", order.shippingAddress.country)}
      `
    : detailRow("Email cliente", order.email);

  return {
    subject: `Nuovo ordine pagato ${order.number}`,
    html: layout(
      "Nuovo ordine pagato",
      `
        <p>Hai ricevuto un nuovo ordine pagato <strong>${order.number}</strong>.</p>
        ${detailRow("Totale", formatPrice(order.total))}
        ${detailRow("Provider pagamento", order.paymentProvider || "Non impostato")}
        ${shipping}
        <p style="margin:18px 0 8px;"><strong>Articoli:</strong></p>
        <ul>${items}</ul>
      `
    )
  };
}

export async function sendOrderReceivedEmail(orderId: string) {
  const { order } = await orderSummary(orderId);
  const template = await orderReceivedTemplate(orderId);

  return resend.emails.send({
    from: emailFrom,
    to: order.email,
    replyTo: emailReplyTo,
    subject: template.subject,
    html: template.html
  });
}

export async function sendPaymentConfirmedEmail(orderId: string) {
  const { order } = await orderSummary(orderId);
  const template = await paymentConfirmedTemplate(orderId);

  return resend.emails.send({
    from: emailFrom,
    to: order.email,
    replyTo: emailReplyTo,
    subject: template.subject,
    html: template.html
  });
}

export async function sendOrderShippedEmail(orderId: string) {
  const { order } = await orderSummary(orderId);
  const template = await shippedTemplate(orderId);

  return resend.emails.send({
    from: emailFrom,
    to: order.email,
    replyTo: emailReplyTo,
    subject: template.subject,
    html: template.html
  });
}

export async function sendRefundIssuedEmail(orderId: string) {
  const { order } = await orderSummary(orderId);
  const template = await refundedTemplate(orderId);

  return resend.emails.send({
    from: emailFrom,
    to: order.email,
    replyTo: emailReplyTo,
    subject: template.subject,
    html: template.html
  });
}

export async function sendAdminOrderPaidEmail(orderId: string) {
  if (!orderNotificationEmail) {
    return null;
  }

  const template = await adminOrderPaidTemplate(orderId);

  return resend.emails.send({
    from: emailFrom,
    to: orderNotificationEmail,
    replyTo: emailReplyTo,
    subject: template.subject,
    html: template.html
  });
}

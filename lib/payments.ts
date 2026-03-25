function required(name: string, value?: string) {
  if (!value) {
    throw new Error(`Variabile ambiente mancante: ${name}`);
  }
  return value;
}

export function getStripeSecretKey() {
  return required("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
}

export function getStripeWebhookSecret() {
  return required("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET);
}

export function getPayPalClientId() {
  return required("PAYPAL_CLIENT_ID", process.env.PAYPAL_CLIENT_ID);
}

export function getPayPalClientSecret() {
  return required("PAYPAL_CLIENT_SECRET", process.env.PAYPAL_CLIENT_SECRET);
}

export function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function toPayPalAmount(cents: number) {
  return (cents / 100).toFixed(2);
}

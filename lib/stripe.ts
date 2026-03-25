import Stripe from "stripe";

import { getStripeSecretKey } from "@/lib/payments";

const globalForStripe = globalThis as unknown as {
  stripe?: Stripe;
};

export const stripe =
  globalForStripe.stripe ??
  new Stripe(getStripeSecretKey(), {
    apiVersion: "2025-08-27.basil"
  });

if (process.env.NODE_ENV !== "production") {
  globalForStripe.stripe = stripe;
}

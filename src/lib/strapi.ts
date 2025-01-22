import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Secret key required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
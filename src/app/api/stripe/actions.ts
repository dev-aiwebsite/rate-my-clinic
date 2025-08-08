"use server"

import Stripe from "stripe"

const stripeSecret = process.env.STRIPE_SECRET;

if (!stripeSecret) {
  throw new Error("Stripe secret key is not defined");
}

const stripe = new Stripe(stripeSecret)

export const retrieveCheckoutSession = async (sessionId:string) => {
  return  {
    id: "cs_test_a1B2c3D4e5F6g7H8i9J0kLmNoP",
    object: "checkout.session",
    amount_subtotal: 5000,
    amount_total: 5000,
    currency: "usd",
    customer: "cus_1234567890abcdef",
    customer_email: "demo@example.com",
    payment_status: "paid",
    status: "complete",
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
    payment_intent: "pi_1N1234567890abcdef",
    created: 1722250200,
    metadata: {
      userId: "user_abc123",
      plan: "starter"
    },
    line_items: [
      {
        id: "li_1N4567890abcdef",
        description: "Demo Product",
        amount_subtotal: 5000,
        amount_total: 5000,
        quantity: 1,
        currency: "usd",
        price: {
          id: "price_123abc",
          unit_amount: 5000,
          currency: "usd",
          product: "prod_abc123",
        }
      }
    ]
  };
  
    // const session = await stripe.checkout.sessions.retrieve(sessionId);
    // return session
}
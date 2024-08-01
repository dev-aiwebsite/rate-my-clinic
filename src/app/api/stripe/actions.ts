"use server"

import Stripe from "stripe"

const stripeSecret = process.env.STRIPE_SECRET;

if (!stripeSecret) {
  throw new Error("Stripe secret key is not defined");
}

const stripe = new Stripe(stripeSecret)

export const retrieveCheckoutSession = async (sessionId:string) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session
}
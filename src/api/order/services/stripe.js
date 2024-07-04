'use strict';

const stripe = require('stripe')(process.env.STRIPE_API_KEY);

module.exports = {
  async createCheckoutSession(order) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Order Payment',
              },
              unit_amount: order.coast * 100, // Stripe requires the amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/cancel`,
      });

      return session;
    } catch (error) {
      throw new Error(`Stripe Checkout Session creation failed: ${error.message}`);
    }
  },
};

"use strict";

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    console.log("data: ", data);
    try {
      // Create a new checkout session
      const session = await strapi
        .service("api::order.stripe")
        .createCheckoutSession(data);

      // Return the session ID to the client
      return { id: session.id };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async handleWebhook(ctx) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad");
    const sig = ctx.request.headers["stripe-signature"];
    const rawBody = ctx.request.body[Symbol.for("unparsedBody")];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      ctx.response.status = 400;
      return (ctx.response.body = `Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Create a new order entry
        await strapi.service("api::order.order").create({
          data: {
            paymentId: session.payment_intent,
            coast: session.amount_total / 100, // Convert back from cents to dollars
          },
        });

        ctx.response.status = 200;
        ctx.response.body = { received: true };
      } catch (err) {
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to create order" };
      }
    } else {
      ctx.response.status = 400;
      ctx.response.body = { error: "Event type not handled" };
    }
  },
}));

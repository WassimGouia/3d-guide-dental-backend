"use strict";
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const getRawBody = require("raw-body");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::commande.commande",
  ({ strapi }) => ({
    async create(ctx) {
      const { cost } = ctx.request.body;
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          success_url: `http://localhost:5173/mes-fichier?success=true`,
          cancel_url: `http://localhost:5173/mes-fichier?success=false`,
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "Dental Service",
                },
                unit_amount: Math.round(cost * 100),
              },
              quantity: 1,
            },
          ],
        });

        return { stripeSession: session };
      } catch (error) {
        ctx.response.status = 500;
        return { error };
      }
    },

    async webhook(ctx) {
      const sig = ctx.request.headers["stripe-signature"];
      const isTestMode = ctx.request.headers["x-stripe-test"] === "true";
      let event;

      if (isTestMode) {
        // In test mode, use the payload directly
        event = ctx.request.body;
        console.log("Test mode: Skipping signature verification");
      } else {
        // In production mode, verify the signature
        try {
          event = stripe.webhooks.constructEvent(
            ctx.request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
          );
        } catch (err) {
          console.error(
            `⚠️  Webhook signature verification failed.`,
            err.message
          );
          return ctx.badRequest(`Webhook Error: ${err.message}`);
        }
      }

      console.log(`✅ Success: ${event.type} | ${event.id}`);

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          try {
            const newOrder = await strapi
              .service("api::commande.commande")
              .create({
                data: {
                  StripeID: session.id,
                  paymentId: session.payment_intent,
                  cost: session.amount_total / 100,
                  services: [], // replace with actual services data if needed
                  patients: [], // replace with actual patients data if needed
                  offre: [], // replace with actual offre data if needed
                },
              });
            console.log("New order created:", newOrder);
          } catch (error) {
            console.error("Error creating order:", error);
          }
          break;

        // ... handle other event types as needed

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return ctx.send({ received: true });
    },
  })
);

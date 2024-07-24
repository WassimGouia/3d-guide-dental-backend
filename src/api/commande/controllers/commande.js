
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::commande.commande", ({ strapi }) => ({
  async create(ctx) {
    const { cost,service,email,guideId } = ctx.request.body;
    const successUrls = {
      1: 'http://localhost:5173/service1-success',
      2: 'http://localhost:5173/service2-success',
      3: 'http://localhost:5173/service3-success',
      4: 'http://localhost:5173/service4-success',
      5: 'http://localhost:5173/service5-success',
      6: 'http://localhost:5173/service6-success',
    };

    const successUrl = successUrls[service];

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        mode: "payment",
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&service=${encodeURIComponent(service)}&guideId=${guideId}`,
        cancel_url: `http://localhost:5173/payment-cancel`,
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
      console.error("xxxxxxxxxx",error)
      return { error };
    }
  },
}));

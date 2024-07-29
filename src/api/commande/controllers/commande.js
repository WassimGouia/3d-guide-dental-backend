
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::commande.commande", ({ strapi }) => ({
  async create(ctx) {
    const { cost,service,email,guideId } = ctx.request.body;
    const successUrls = {
      1: 'https://dentist-portal.3dguidedental.com/service1-success',
      2: 'https://dentist-portal.3dguidedental.com/service2-success',
      3: 'https://dentist-portal.3dguidedental.com/service3-success',
      4: 'https://dentist-portal.3dguidedental.com/service4-success',
      5: 'https://dentist-portal.3dguidedental.com/service5-success',
      6: 'https://dentist-portal.3dguidedental.com/service6-success',
    };

    const successUrl = successUrls[service];

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        mode: "payment",
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&service=${encodeURIComponent(service)}&guideId=${guideId}`,
        cancel_url: `https://dentist-portal.3dguidedental.com/payment-cancel`,
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

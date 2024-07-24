const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::demande-produire-et-expide-guide-etage.demande-produire-et-expide-guide-etage", ({ strapi }) => ({
  async create(ctx) {
    const { cost,email,patient,caseNumber,type_travail} = ctx.request.body;
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        mode: "payment",
        success_url: `http://localhost:5173/service8-success?session_id={CHECKOUT_SESSION_ID}&patient=${encodeURIComponent(patient)}&caseNumber=${encodeURIComponent(caseNumber)}&type_travail=${encodeURIComponent(type_travail)}`,
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
      console.log(error)
      return { error };
    }
  },
}));

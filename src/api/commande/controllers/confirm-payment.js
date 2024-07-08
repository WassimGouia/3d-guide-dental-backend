const stripe = require("stripe")(process.env.STRIPE_API_KEY);

module.exports = {
  async confirmPayment(ctx) {
    const { sessionId, service } = ctx.request.body;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        // Check if the commande with the same StripeID already exists
        const existingCommande = await strapi.db.query('api::commande.commande').findOne({
          where: { StripeID: session.id },
        });

        if (existingCommande) {
          return { success: false, error: 'Commande already exists for this payment session' };
        }

        // Create the new commande
        const commande = await strapi.service("api::commande.commande").create({
          data: {
            StripeID: session.id,
            cost: session.amount_total / 100,
            services: [service], // Include the service here
            patients: [],
            offre: [],
          },
        });

        const email = session.customer_details.email;
        await strapi.plugins['email'].services.email.send({
          to: email,
          from: 'no-reply@3dguidedental.com', // Replace with your verified sender email
          subject: 'Your Invoice from Dental Service',
          text: `Thank you for your payment. Here is your invoice: \n\nOrder ID: ${commande.id}\nTotal Amount: ${commande.cost} EUR\n\nThank you for choosing our service.`,
          html: `
          <div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);">
              <h2 style="text-align: center; color: #333;">Invoice</h2>
              <div style="padding: 20px 0; border-bottom: 1px solid #eee;">
                <h3 style="margin: 0;">Dental Service</h3>
                <p style="margin: 5px 0 0;">Your trusted dental care</p>
              </div>
              <div style="padding: 20px 0; border-bottom: 1px solid #eee;">
                <h4>Invoice to:</h4>
                <p style="margin: 5px 0;">${session.customer_details.name}</p>
                <p style="margin: 5px 0;">${email}</p>
              </div>
              <div style="padding: 20px 0; border-bottom: 1px solid #eee;">
                <h4>Order ID: ${commande.id}</h4>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; background: #f4f4f4;">Service</th>
                    <th style="border: 1px solid #ddd; padding: 8px; background: #f4f4f4;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">Dental Service</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${commande.cost} EUR</td>
                  </tr>
                </tbody>
              </table>
              <div style="padding: 20px 0;">
                <h4>Total Amount: ${commande.cost} EUR</h4>
              </div>
              <div style="padding: 20px 0; text-align: center; border-top: 1px solid #eee;">
                <p style="margin: 0;">Thank you for choosing our service.</p>
              </div>
            </div>
          </div>
        `,        });

        return { success: true, commande };
      } else {
        return { success: false, error: 'Payment not successful' };
      }
    } catch (error) {
      ctx.response.status = 500;
      return { error: `Failed to confirm payment: ${error.message}` };
    }
  }
};

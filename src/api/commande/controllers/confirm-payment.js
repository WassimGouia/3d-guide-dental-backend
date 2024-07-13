const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const getDiscount = (plan) => {
  const discounts = {
    Essential: 5,
    Privilege: 10,
    Elite: 15,
    Premium: 20,
  };
  return discounts[plan] || 0;
};
module.exports = {
  
  async confirmPayment(ctx) {
    const { sessionId, service, caseNumber,guideId } = ctx.request.body;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        const existingCommande = await strapi.db
          .query("api::commande.commande")
          .findOne({
            where: { StripeID: session.id },
          });

        if (existingCommande) {
          return {
            success: false,
            error: "Commande already exists for this payment session",
          };
        }

        // Create new commande
        const commande = await strapi.service("api::commande.commande").create({
          data: {
            StripeID: session.id,
            cost: session.amount_total / 100,
            services: [service],
            patients: [],
            offre: [],
          },
        });

        const updatedGuide = await strapi.db
        .query("api::guide-a-etage.guide-a-etage")
        .update({
          where: { id: guideId },
          data: {
            submit: true,
            archive: false,
          },
        });

        const guide = await strapi.db
          .query("api::guide-a-etage.guide-a-etage")
          .findOne({
            where: { numero_cas: caseNumber },
            populate: [
              "Options_supplementaires",
              "options_generiques",
              "cout",
              "Full_guidee",
              "Forage_pilote",
              "Marque_de_la_clavette",
              "Marque_de_la_trousse",
            ],
          });

        const userEmail = session.customer_details.email;
        const user = await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({
            where: { email: userEmail },
            populate: ["offre","location"],
          });

        if (user && user.offre) {
          console.log(
            "location",user.location
          );

          // Update the offre
          const updatedOffre = await strapi.entityService.update(
            "api::offre.offre",
            user.offre.id,
            {
              data: {
                yearCaseCount: user.offre.yearCaseCount + 1,
                quarterCaseCount: user.offre.quarterCaseCount + 1,
              },
            }
          );

          console.log(
            "After case count update - Offre:",
            JSON.stringify(updatedOffre, null, 2)
          );

          // Update the plan
          const offreService = strapi.service("api::offre.offre");
          const updatedPlan = await offreService.updatePlan(user.id);

          console.log(
            "After plan update - Plan:",
            JSON.stringify(updatedPlan, null, 2)
          );

          // Link the commande to the offre
          await strapi.entityService.update(
            "api::commande.commande",
            commande.id,
            {
              data: {
                offre: updatedPlan.id,
              },
            }
          );
        } else {
          console.error("User or offre not found:", user);
          return {
            success: false,
            error: "User or offre not found",
          };
        }
        const services = await strapi.db.query("api::service.service").findOne({
          where: { id: service },
        });

        const email = session.customer_details.email;
        let emailContent = `
  <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #fff; color: #333;">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #000;">Invoice</h2>
      <div style="margin-bottom: 20px; padding: 10px 0; border-bottom: 2px solid #ffd700;">
            <img src="https://res.cloudinary.com/dhzlfojtv/image/upload/v1720522292/LOGO_3d_guide_dental_hq3m65.png" alt="Dental Service Logo" style="text-align: left; width: 100px;"/>
            <div style="text-align: right;">
                <h3 style="margin: 0; color: #000;">3D GUIDE DENTAL</h3>
                <p style="margin: 5px 0 0;">By dentists for dentists</p>
            </div>
        </div>
        <div style="padding: 20px 0; border-bottom: 1px solid #ddd;">
            <h4>Order ID: ${commande.id}</h4>
            <h4>Current Plan: ${user.offre.CurrentPlan} (Discount: ${getDiscount(user.offre.CurrentPlan)}%)</h4>
        </div>
        <div style="padding: 20px 0; border-bottom: 1px solid #ddd;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                    <td style="padding-right: 10px;">
                        <h4 style="margin: 0;">Invoice to:</h4>
                    </td>
                    <td style="padding-right: 10px;">
                        <p style="margin: 5px 0;">${session.customer_details.name}</p>
                    </td>
                    <td>
                        <p style="margin: 5px 0;">${email}</p>
                    </td>
                </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                    <td style="padding-right: 10px;">
                        <h4 style="margin: 0;">Shipping Address:</h4>
                    </td>
                    <td style="padding-right: 10px;">
                        <p style="margin: 5px 0;">${user.location[0].country}, ${user.location[0].city}, ${user.location[0].State}, ${user.location[0].Address}, ${user.location[0].zipCode}</p>
                    </td>
                </tr>
            </table>
        </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 10px; background: #ffd700; color: #000;">Service</th>
            <th style="border: 1px solid #ddd; padding: 10px; background: #ffd700; color: #000;">Amount</th>
            <th style="border: 1px solid #ddd; padding: 10px; background: #ffd700; color: #000;">Discount</th>
            <th style="border: 1px solid #ddd; padding: 10px; background: #ffd700; color: #000;">Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px;">${services.title}</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${((commande.cost / (1 - (getDiscount(user.offre.CurrentPlan) / 100))) - (user.location[0].country.toLowerCase() === "france" ? 7 : 15)).toFixed(0)} EUR</td>
            <td style="border: 1px solid #ddd; padding: 10px;">- ${getDiscount(user.offre.CurrentPlan)} %</td>
            <td style="border: 1px solid #ddd; padding: 10px;">+ ${user.location[0].country.toLowerCase() === "france" ? 7: 15} EUR</td>
          </tr>
        </tbody>
      </table>
      <div style="padding: 20px 0;">
        <h4>Total Amount: ${commande.cost} EUR</h4>
      </div>`;

        if (guide) {
          const checkIcon = "✔️";
          const xIcon = "❌";

          const getOptionIcons = (options) => {
            return options
              .map(
                (option) =>
                  `${option.title}: ${option.active ? checkIcon : xIcon}`
              )
              .join("<br>");
          };

          const getComponentIcons = (components) => {
            return components
              .map((component) => `${component.active ? checkIcon : xIcon}`)
              .join(" ");
          };

          emailContent += `
        <div style="padding: 20px 0; border-top: 2px solid #ffd700;">
            <h3 style="color: #000; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Guide Details:</h3>
            <p style="margin: 10px 0; color: #000;"><strong>Case Number:</strong> ${
              guide.numero_cas
            }</p>
            <p style="margin: 10px 0; color: #000;"><strong>Patient:</strong> ${
              guide.patient
            }</p>
            <p style="margin: 10px 0; color: #000;"><strong>Comment:</strong> ${
              guide.comment
            }</p>
            
            <h4 style="color: #000; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Options Supplementaires:</h4>
            <p style="margin: 10px 0; color: #000;">${getOptionIcons(
              guide.Options_supplementaires
            )}</p>
            
            <h4 style="color: #000; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Options Generiques:</h4>
            <p style="margin: 10px 0; color: #000;">${getOptionIcons(
              guide.options_generiques
            )}</p>
            
            <h4 style="color: #000; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Full Guidee: ${getComponentIcons(
              guide.Full_guidee
            )}</h4>
            
            <h4 style="color: #000; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Forage Pilote: ${getComponentIcons(
              guide.Forage_pilote
            )}</h4>
            
            <h4 style="color: #000; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Marque de la Clavette: ${guide.Marque_de_la_clavette.map(
              (mc) => `${mc.description}`
            )}</h4>
            
            <h4 style="color: #000; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Marque de la Trousse: ${guide.Marque_de_la_trousse.map(
              (mt) => `${mt.description}`
            )}</h4>
            
            <h4 style="color: #000; margin-top: 20px; padding-bottom: 10px;">Marque Implant pour la Dent:</h4>
            <p style="margin: 10px 0; color: #000;">${Object.entries(
              guide.marque_implant_pour_la_dent[" index"]
            )
              .map(([key, value]) => `${key}: ${value}`)
              .join("<br>")}</p>
        </div>`;
        }

        emailContent += `
            <div style="padding: 20px 0; text-align: center; border-top: 2px solid #ffd700;">
                <p style="margin: 0; color: #000;">Thank you for choosing our service.</p>
            </div>
            </div>
        </div>`;

        await strapi.plugins["email"].services.email.send({
          to: email,
          from: "no-reply@3dguidedental.com",
          subject: "Your Invoice from Dental Service",
          text: `Thank you for your payment. Here is your invoice: \n\nOrder ID: ${commande.id}\nTotal Amount: ${commande.cost} EUR\n\nThank you for choosing our service.`,
          html: emailContent,
        });

        return { success: true, commande };
      } else {
        return { success: false, error: "Payment not successful" };
      }
    } catch (error) {
      console.error("Error in confirmPayment:", error);
      ctx.response.status = 500;
      return { error: `Failed to confirm payment: ${error.message}` };
    }
  },
};
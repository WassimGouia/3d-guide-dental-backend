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

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_MONTHS_IN_MS = 90 * 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
const notifyUsersBeforeDeletion = async () => {
  try {
    const threeDaysFromNow = new Date(Date.now() - THREE_MONTHS_IN_MS + THREE_DAYS_IN_MS);
    const recordsToBeDeleted = await strapi.db.query('api::guide-classique.guide-classique').findMany({
      where: {
        archive: true,
        createdAt: { $lte: threeDaysFromNow },
      },

      populate: ['user'],
    });

    for (const record of recordsToBeDeleted) {
      const userEmail = record.user.email;
      
      await strapi.plugins["email"].services.email.send({
        to: userEmail,
        from: "no-reply@3dguidedental.com",
        subject: "Action Required: Your Archived Record Will Be Deleted",
        text: `Dear User,

        Your archived record created on ${record.createdAt} will be deleted in 3 days. Please take the necessary action if you wish to keep it.

        Best regards,
        3d Guide Dental`
      });

      console.log(`Notified user ${userEmail} about the upcoming deletion of their archived record.`);
    }
  } catch (error) {
    console.error("Error notifying users about upcoming deletions:", error);
  }
};

const deleteOldArchivedRecords = async () => {
  try {
    await notifyUsersBeforeDeletion();
    const threeMonthsAgo = new Date(Date.now() - THREE_MONTHS_IN_MS);

    const deletedRecords = await strapi.db.query('api::guide-classique.guide-classique').deleteMany({
      where: {
        archive: true,
        createdAt: { $lte: threeMonthsAgo },
      },
    });

    console.log(`Deleted ${deletedRecords.count} archived records older than three months.`);
  } catch (error) {
    console.error("Error deleting old archived records:", error);
  }
};


deleteOldArchivedRecords();
setInterval(deleteOldArchivedRecords, ONE_DAY_IN_MS);

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
        .query("api::guide-classique.guide-classique")
        .update({
          where: { id: guideId },
          data: {
            soumis: true,
            archive: false,
          },
        });
        

        const rapport = await strapi.db
        .query("api::guide-classique.guide-classique")
        .findOne({
          where: { numero_cas: caseNumber },
          populate: {
            Full_guidee: true,
            Forage_pilote: true,
            Marque_de_la_trousse: true,
            Clavettes_de_stabilisation: true,
            marque_implant_pour_la_dent:true,
            comment:true,
            options_generiques: {
              populate: ["Smile_Design", "Impression_Formlabs","Suppression_numerique","title"]
            }
          }
          });
      
      console.log("rapport", JSON.stringify(rapport, null, 2));
   
        const userEmail = session.customer_details.email;
        const user = await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({
            where: { email: userEmail },
            populate: ["offre","location"],
          });

        if (user && user.offre) {
          
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

          // Update the plan
          const offreService = strapi.service("api::offre.offre");
          const updatedPlan = await offreService.updatePlan(user.id);

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
        const europeanCountries = ["belgium", "portugal", "germany", "netherlands", "luxembourg", "italy", "spain"];
        let isActive = false; // Initialize isActive variable

        rapport.options_generiques.forEach((option) => {
            option.Impression_Formlabs.forEach((impression) => {
              isActive = impression.active;
            });          
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
            <h4>Current offer: ${user.offre.CurrentPlan} (Discount: ${getDiscount(user.offre.CurrentPlan)}%)</h4>
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
            <td style="border: 1px solid #ddd; padding: 10px;">
              ${rapport.originalCost} EUR
            </td>
            <td style="border: 1px solid #ddd; padding: 10px;">- ${getDiscount(user.offre.CurrentPlan)} %</td>
            <td style="border: 1px solid #ddd; padding: 10px;">+ ${user.location[0].country.toLowerCase() === "france" && isActive ? 7.5 : europeanCountries.includes(user.location[0].country.toLowerCase()) && isActive ? 15 : 0} EUR</td>
          </tr>
        </tbody>
      </table>
      <div style="padding: 20px 0;">
        <h4>Total Amount: ${commande.cost} EUR</h4>
      </div>`;

      if (rapport) {
        emailContent += `
          <div style="padding: 20px 0; border-top: 2px solid #ffd700;">
            <h3 style="color: #000; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Case Details:</h3>
            <p style="margin: 10px 0; color: #000;"><strong>Case Number:</strong> ${rapport.numero_cas}</p>
            <p style="margin: 10px 0; color: #000;"><strong>Patient:</strong> ${rapport.patient}</p>
            <p style="margin: 10px 0; color: #000;"><strong>Comment:</strong> ${rapport.comment}</p>
            
            <h4 style="color: #000; margin-top: 20px; padding-bottom: 10px;">Implant Brand for the Tooth:</h4>
            <p style="margin: 10px 0; color: #000;">${Object.entries(
              rapport.marque_implant_pour_la_dent[" index"]
            )
            .map(([key, value]) => `${key}: ${value}`)
            .join("<br>")}</p>

            <h4 style="color: #000; margin-top: 20px; padding-bottom: 10px;">Full Guided:</h4>
            ${rapport.Full_guidee.map(guide => `<p>- ${guide.titlle}: ${guide.active ? "✔️" : "❌"}</p>`).join("")}

            <h4 style="color: #000; margin-top: 20px; padding-bottom: 10px;">Pilot Drilling:</h4>
            ${rapport.Forage_pilote.map(forage => `<p>- ${forage.title}: ${forage.active ? "✔️" : "❌"}</p>`).join("")}

            <h4 style="color: #000; margin-top: 20px; padding-bottom: 10px;">Kit Brand:</h4>
            ${rapport.Marque_de_la_trousse.map(trousse => `<p>- ${trousse.title}: ${trousse.description || "N/A"}</p>`).join("")}

            <h4 style="color: #000; margin-top: 20px; padding-bottom: 10px;">Stabilization pins:</h4>
            ${rapport.Clavettes_de_stabilisation.map(clavette => `<p>- ${clavette.title}: ${clavette.active !== null ? (clavette.active ? "✔️" : "❌") : "N/A"} (${clavette.nombre_des_clavettes})</p>`).join("")}

            <h4 style="color: #000; margin-top: 20px; padding-bottom: 10px;">Generic Options:</h4>
            `;

            rapport.options_generiques.forEach(option => {
              option.Smile_Design.forEach(smileDesign => {
                emailContent += `<p>- ${smileDesign.title}: ${smileDesign.active ? "✔️" : "❌"}</p>`;
              });

              option.Suppression_numerique.forEach(suppression => {
                emailContent += `<p>- ${suppression.title}: ${suppression.active ? "✔️" : "❌"} (${suppression.description})</p>`;
              });

              if (user && (user.location[0].country?.toLowerCase() === "france" || europeanCountries.includes(user.location[0].country?.toLowerCase()))) {
                option.Impression_Formlabs.forEach(impression => {
                  emailContent += `<p>- ${impression.title}: ${impression.active ? "✔️" : "❌"} (Supplementary Guide: ${impression.Guide_supplementaire})</p>`;
                });
              }
            });

      
        emailContent += `</div>`;
      }
      
        emailContent += `
            <div style="padding: 20px 0; text-align: center; border-top: 2px solid #ffd700;">
                <p style="margin: 0; color: #000;">Thank you for choosing our service.</p>
            </div> 
            </div>
        </div>`;
        const emails = [email, "postmaster@3dguidedental.com"];
        await strapi.plugins["email"].services.email.send({
          to: emails,
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
  }
};
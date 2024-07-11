// File: config/cron-tasks.js

const { DateTime } = require("luxon");

module.exports = {
  "0 0 1 1,4,7,10 *": async () => {
    try {
      const planUpdateService = strapi.service("api::offre.offre");
      const now = DateTime.now();
      const offers = await strapi.entityService.findMany("api::offre.offre", {
        populate: ["users_permissions_user"],
      });

      console.log("Quarterly update - Offers found:", offers.length);

      for (const offer of offers) {
        const accountCreationDate = DateTime.fromJSDate(
          offer.accountCreationDate
        );
        const isFirstYear = now.diff(accountCreationDate, "years").years < 1;

        if (!isFirstYear) {
          console.log("Updating offer:", offer.id);
          await strapi.entityService.update("api::offre.offre", offer.id, {
            data: { quarterCaseCount: 0 },
          });
          const updatedPlan = await planUpdateService.updatePlan(
            offer.users_permissions_user.id
          );
          console.log("Updated plan:", updatedPlan);
        }
      }
      console.log("Quarterly update completed");
    } catch (error) {
      console.error("Error in quarterly update:", error);
    }
  },

  "0 0 1 1 *": async () => {
    try {
      const offers = await strapi.entityService.findMany("api::offre.offre", {
        populate: ["users_permissions_user"],
      });

      console.log("Yearly update - Offers found:", offers.length);

      for (const offer of offers) {
        console.log("Updating offer:", offer.id);
        await strapi.entityService.update("api::offre.offre", offer.id, {
          data: {
            yearCaseCount: 0,
            quarterCaseCount: 0,
          },
        });
        const updatedPlan = await planUpdateService.updatePlan(
          offer.users_permissions_user.id
        );
        console.log("Updated plan:", updatedPlan);
      }
      console.log("Yearly reset completed");
    } catch (error) {
      console.error("Error in yearly update:", error);
    }
  },
};

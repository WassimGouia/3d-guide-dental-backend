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

      for (const offer of offers) {
        const accountCreationDate = DateTime.fromJSDate(
          offer.accountCreationDate
        );
        const isFirstYear = now.diff(accountCreationDate, "years").years < 1;

        if (!isFirstYear) {
          await strapi.entityService.update("api::offre.offre", offer.id, {
            data: { quarterCaseCount: 0 },
          });
          await planUpdateService.updatePlan(offer.users_permissions_user.id);
        }
      }
    } catch (error) {
      console.error("Error in quarterly update:", error);
    }
  },

  "0 0 1 1 *": async () => {
    try {
      const planUpdateService = strapi.service("api::offre.offre");
      const offers = await strapi.entityService.findMany("api::offre.offre", {
        populate: ["users_permissions_user"],
      });

      for (const offer of offers) {
        const now = DateTime.now();
        const accountCreationDate = DateTime.fromJSDate(
          offer.accountCreationDate
        );
        const yearsActive = now.diff(accountCreationDate, "years").years;

        await strapi.entityService.update("api::offre.offre", offer.id, {
          data: {
            yearCaseCount: 0,
            quarterCaseCount: 0,
          },
        });

        // If transitioning from first year to second year, re-evaluate plan
        if (yearsActive >= 1 && yearsActive < 2) {
          await planUpdateService.updatePlan(offer.users_permissions_user.id);
        }
      }
    } catch (error) {
      console.error("Error in yearly update:", error);
    }
  },
};

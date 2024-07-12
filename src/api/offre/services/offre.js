"use strict";

const { createCoreService } = require("@strapi/strapi").factories;
const { DateTime } = require("luxon");

module.exports = createCoreService("api::offre.offre", ({ strapi }) => ({
  async handleUserCreation(userId) {
    try {
      const offre = await strapi.entityService.create("api::offre.offre", {
        data: {
          users_permissions_user: userId,
          CurrentPlan: "Essential",
          yearCaseCount: 0,
          quarterCaseCount: 0,
          accountCreationDate: new Date(),
          lastEvaluationDate: new Date(),
          planStartDate: new Date(),
        },
      });
      console.log("New offre created for user:", offre);
      return offre;
    } catch (error) {
      console.error("Error creating offre for new user:", error);
      throw error;
    }
  },

  async updatePlan(userId) {
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      userId,
      {
        populate: ["offre"],
      }
    );
    if (!user || !user.offre) {
      console.error("User or offer not found");
      return null;
    }

    console.log("UpdatePlan - User:", JSON.stringify(user, null, 2));
    console.log(
      "UpdatePlan - Offre before update:",
      JSON.stringify(user.offre, null, 2)
    );

    const now = DateTime.now();
    const accountCreationDate = DateTime.fromJSDate(
      user.offre.accountCreationDate
    );
    const isFirstYear = now.diff(accountCreationDate, "years").years < 1;

    console.log("UpdatePlan - Is First Year:", isFirstYear);
    console.log("UpdatePlan - Year Case Count:", user.offre.yearCaseCount);
    console.log(
      "UpdatePlan - Quarter Case Count:",
      user.offre.quarterCaseCount
    );

    let newPlan;
    if (isFirstYear) {
      newPlan = this.determineFirstYearPlan(user.offre.yearCaseCount);
    } else {
      console.log("UpdatePlan - Current Quarter:", now.quarter);
      newPlan = this.determineQuarterlyPlan(
        user.offre.quarterCaseCount,
        now.quarter
      );
    }

    console.log("UpdatePlan - New plan determined:", newPlan);
    console.log("UpdatePlan - Current plan:", user.offre.CurrentPlan);

    if (newPlan !== user.offre.CurrentPlan) {
      const updatedOffer = await strapi.entityService.update(
        "api::offre.offre",
        user.offre.id,
        {
          data: {
            CurrentPlan: newPlan,
            lastEvaluationDate: now.toJSDate(),
            planStartDate: now.toJSDate(),
          },
        }
      );

      console.log("Plan updated:", JSON.stringify(updatedOffer, null, 2));
      return updatedOffer;
    } else {
      console.log("Plan remains unchanged");
      return user.offre;
    }
  },

  determineFirstYearPlan(caseCount) {
    console.log("Determining first year plan. Case count:", caseCount);
    if (caseCount <= 20) {
      console.log("Plan determined: Essential");
      return "Essential";
    }
    if (caseCount <= 40) {
      console.log("Plan determined: Privilege");
      return "Privilege";
    }
    if (caseCount <= 60) {
      console.log("Plan determined: Elite");
      return "Elite";
    }
    console.log("Plan determined: Premium");
    return "Premium";
  },

  determineQuarterlyPlan(caseCount, quarter) {
    const thresholds = {
      1: [20, 40, 60], // Jan-Mar
      2: [5, 10, 15], // Apr-Jun
      3: [10, 20, 30], // Jul-Sep
      4: [15, 30, 45], // Oct-Dec
    };

    const [essential, privilege, elite] = thresholds[quarter];

    if (caseCount <= essential) return "Essential";
    if (caseCount <= privilege) return "Privilege";
    if (caseCount <= elite) return "Elite";
    return "Premium";
  },

  getDiscount(plan) {
    const discounts = {
      Essential: 5,
      Privilege: 10,
      Elite: 15,
      Premium: 20,
    };
    return discounts[plan] || 0;
  },
}));

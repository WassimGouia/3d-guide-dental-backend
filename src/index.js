'use strict';

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    console.log("Setting up user creation lifecycle hook");
    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"],
      afterCreate: async (event) => {
        const { result } = event;
        console.log("User created:", result);
        try {
          console.log("Attempting to create offer for user:", result.id);
          const offerService = strapi.service("api::offre.offre");
          const offer = await offerService.handleUserCreation(result.id);
          console.log("Offer created successfully:", offer);

          // Update the user to link it to the new offre
          await strapi.entityService.update(
            "plugin::users-permissions.user",
            result.id,
            {
              data: {
                offre: offer.id,
              },
            }
          );
          console.log("User updated with offer link");
        } catch (error) {
          console.error("Error in offer creation after user creation:", error);
        }
      },
    });
    console.log("User creation lifecycle hook set up complete");
  },
};
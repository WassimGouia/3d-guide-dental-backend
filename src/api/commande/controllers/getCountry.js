// ./src/api/commande/controllers/getCountry.js
'use strict';

module.exports = {
  async getCountryByUserId(ctx) {
    const { id } = ctx.params;

    // Validate the ID
    if (!id) {
      return ctx.badRequest('User ID is required');
    }

    // Find the user by ID
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id },
      populate: ['location'], // Ensure you are populating the location field
    });

    if (!user) {
      return ctx.notFound('User not found');
    }

    // Assuming country is a part of the location component
    const country = user.location?.country || 'Country not specified';

    ctx.send({
      id: user.id,
      country,
    });
  },
};

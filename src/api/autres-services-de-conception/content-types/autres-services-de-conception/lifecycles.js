module.exports = {
  async afterUpdate(event) {
    const { result } = event;


    if (result.updatedBy && result.updatedBy.email === 'admin@admin.com') {
      try {
        const updatedEntry = await strapi.entityService.findOne(
          'api::autres-services-de-conception.autres-services-de-conception',
          result.id,
          {
            populate: { user: true },
          }
        );

        const user = updatedEntry.user;

        if (user && user.email) {
          const subject = 'Your case status has been updated';
          const text = `
            Hello,

            The status of your case with number ${updatedEntry.numero_cas} has been updated.

            Best regards,
            3D Guide Dental Team
          `;

          await strapi.plugins['email'].services.email.send({
            to: user.email,
            from: 'no-reply@3dguidedental.com',
            subject: subject,
            text: text,
          });

          console.log('Email sent to:', user.email);
        } else {
          console.error('User email not found:', user);
        }
      } catch (error) {
        console.error('Error sending email', error);
      }
    } else {
      console.log('No email will be sent. Update was not made by admin or no updatedBy info.');
    }
  },
};

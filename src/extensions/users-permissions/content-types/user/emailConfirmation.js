const { sanitize } = require("@strapi/utils");

module.exports = (plugin) => {
  plugin.controllers.auth = {
    ...plugin.controllers.auth,
    async sendEmailConfirmation(ctx) {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest("Email is required");
      }

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });

      if (!user) {
        return ctx.badRequest("User not found");
      }

      if (user.confirmed) {
        return ctx.badRequest("Email already confirmed");
      }

      try {
        await strapi.plugins[
          "users-permissions"
        ].services.user.sendConfirmationEmail(user);
        ctx.send({ message: "Confirmation email sent" });
      } catch (err) {
        console.error("Detailed error in sendEmailConfirmation:", err);
        ctx.badRequest("Error sending confirmation email", err);
      }
    },

    async emailConfirmation(ctx) {
      const { confirmation: confirmationToken } = ctx.query;

      if (!confirmationToken) {
        return ctx.badRequest("Confirmation token is invalid");
      }

      try {
        const user = await strapi.plugins[
          "users-permissions"
        ].services.user.validateRegistrationToken(confirmationToken);

        await strapi.plugins[
          "users-permissions"
        ].services.user.updateUserConfirmation(user.id);

        if (
          strapi.config.get(
            "plugin.users-permissions.settings.email_confirmation.redirect_url"
          )
        ) {
          ctx.redirect(
            strapi.config.get(
              "plugin.users-permissions.settings.email_confirmation.redirect_url"
            )
          );
        } else {
          ctx.send({
            message: "Email confirmed",
          });
        }
      } catch (err) {
        return ctx.badRequest("Invalid token");
      }
    },
  };

  // Extend the user service
  plugin.services.user = {
    ...plugin.services.user,
    async sendConfirmationEmail(user) {
      const confirmationToken = strapi.plugins[
        "users-permissions"
      ].services.jwt.issue({
        id: user.id,
      });

      const settings = await strapi
        .store({ type: "plugin", name: "users-permissions", key: "email" })
        .get({ key: "email" });

      const userInfo = await sanitize.contentAPI.output(
        user,
        strapi.getModel("plugin::users-permissions.user")
      );

      const confirmationUrl = `${strapi.config.server.url}/auth/email-confirmation?confirmation=${confirmationToken}`;

      const emailOptions = {
        to: user.email,
        from: "no-reply@3dguidedental.com",
        replyTo: "info@3dguidedental.com",
        subject: "Email Confirmation",
        text: `Please confirm your email address by clicking the link below:\n${confirmationUrl}`,
        html: `<a href="${confirmationUrl}">Click here to confirm your email</a>`,
      };

      try {
        const result = await strapi.plugins["email"].services.email.send(
          emailOptions
        );
        console.log("Email sent successfully:", result);
        return result;
      } catch (err) {
        console.error("Detailed email sending error:", err);
        throw err;
      }
    },

    async validateRegistrationToken(token) {
      const { id } = await strapi.plugins[
        "users-permissions"
      ].services.jwt.verify(token);
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { id } });

      if (!user) {
        throw new Error("Invalid token");
      }

      return user;
    },

    // New method to update user confirmation status
    async updateUserConfirmation(userId) {
      return strapi.query("plugin::users-permissions.user").update({
        where: { id: userId },
        data: { confirmed: true },
      });
    },
  };

  // Add custom routes
  plugin.routes["content-api"].routes.push(
    {
      method: "POST",
      path: "/auth/send-email-confirmation",
      handler: "auth.sendEmailConfirmation",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/auth/email-confirmation",
      handler: "auth.emailConfirmation",
      config: {
        policies: [],
        prefix: "",
      },
    }
  );

  // Add lifecycle hooks to send email upon user creation
  plugin.contentTypes.user.lifecycles = {
    async afterCreate(event) {
      const { result } = event;
      try {
        const confirmationToken = strapi.plugins[
          "users-permissions"
        ].services.jwt.issue({
          id: result.id,
        });

        const settings = await strapi
          .store({ type: "plugin", name: "users-permissions", key: "email" })
          .get({ key: "email" });

        const emailOptions = {
          to: result.email,
          from: "no-reply@3dguidedental.com",
          replyTo: "info@3dguidedental.com",
          subject: "Email Confirmation",
          text: "Please confirm your email address by clicking the link below:",
          html: `<a href="http://localhost:5173/confirm-email?token=${confirmationToken}">Click here to confirm your email</a>`,
        };

        const confirmationUrl = `${strapi.config.server.url}/auth/email-confirmation?confirmation=${confirmationToken}`;

        emailOptions.text = emailOptions.text.replace("{URL}", confirmationUrl);
        emailOptions.html = emailOptions.html.replace("{URL}", confirmationUrl);

        await strapi.plugins["email"].services.email.send(emailOptions);
      } catch (err) {
        console.log("Email sending error:", err);
      }
    },
  };

  return plugin;
};

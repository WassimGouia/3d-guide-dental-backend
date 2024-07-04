module.exports = (plugin) => {
  // ... other configurations ...

  plugin.services.user = {
    // ... other methods ...
    // async sendResetPasswordEmail(user) {
    //   const resetPasswordToken = strapi.plugins[
    //     "users-permissions"
    //   ].services.jwt.issue({ id: user.id }, { expiresIn: "1h" });

    //   const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?code=${resetPasswordToken}`;

    //   const emailOptions = {
    //     to: user.email,
    //     from: "no-reply@3dguidedental.com",
    //     replyTo: "info@3dguidedental.com",
    //     subject: "Reset Password",
    //     text: `Please click the link below to reset your password:\n${resetPasswordUrl}`,
    //     html: `<a href="${resetPasswordUrl}">Click here to reset your password</a>`,
    //   };

    //   await strapi.plugins["email"].services.email.send(emailOptions);
    // },

    async sendResetPasswordEmail(ctx) {
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

      try {
        const resetPasswordToken = strapi.plugins[
          "users-permissions"
        ].services.jwt.issue(
          {
            id: user.id,
          },
          { expiresIn: "1h" }
        ); // Token expires in 1 hour

        const resetPasswordUrl = `${strapi.config.server.url}/auth/reset-password?code=${resetPasswordToken}`;

        const emailOptions = {
          to: user.email,
          from: "no-reply@3dguidedental.com",
          replyTo: "info@3dguidedental.com",
          subject: "Reset Password",
          text: `Please click the link below to reset your password:\n${resetPasswordUrl}`,
          html: `<a href="${resetPasswordUrl}">Click here to reset your password</a>`,
        };

        await strapi.plugins["email"].services.email.send(emailOptions);
        ctx.send({ ok: true });
      } catch (err) {
        console.error("Error sending reset password email:", err);
        ctx.badRequest("Error sending reset password email", err);
      }
    },

    async resetPassword(ctx) {
      const { password, passwordConfirmation, code } = ctx.request.body;

      if (!code) {
        return ctx.badRequest("Reset code is required");
      }

      if (password !== passwordConfirmation) {
        return ctx.badRequest("Passwords do not match");
      }

      try {
        const { id } = await strapi.plugins[
          "users-permissions"
        ].services.jwt.verify(code);

        const user = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: { id },
          });

        if (!user) {
          return ctx.badRequest("User not found");
        }

        await strapi.plugins["users-permissions"].services.user.edit(user.id, {
          resetPasswordToken: null,
          password,
        });

        ctx.send({
          jwt: strapi.plugins["users-permissions"].services.jwt.issue({
            id: user.id,
          }),
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            provider: user.provider,
            confirmed: user.confirmed,
            blocked: user.blocked,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
      } catch (err) {
        console.error("Error resetting password:", err);
        return ctx.badRequest("Error resetting password", err);
      }
    },
  };

  plugin.routes["content-api"].routes.push(
    {
      method: "POST",
      path: "/auth/forgot-password",
      handler: "user.sendResetPasswordEmail",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/auth/reset-password",
      handler: "user.resetPassword",
      config: {
        policies: [],
        prefix: "",
      },
    }
  );

  return plugin;
};

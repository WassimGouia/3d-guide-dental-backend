const sendLoginCode = async (email) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  const user = await strapi
    .query("plugin::users-permissions.user")
    .findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  await strapi.query("plugin::users-permissions.user").update({
    where: { id: user.id },
    data: {
      loginCode: code,
      codeExpires: new Date(Date.now() + 10 * 60000), // Code valid for 10 minutes
    },
  });

  await strapi.plugins["email"].services.email.send({
    to: email,
    from: "no-reply@3dguidedental.com",
    replyTo: "info@3dguidedental.com",
    subject: "Your Login Code",
    text: `Here's your login code: ${code}`,
  });
};

module.exports = {
  sendLoginCode,
};

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/webhook",
      handler: "commande.webhook",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};

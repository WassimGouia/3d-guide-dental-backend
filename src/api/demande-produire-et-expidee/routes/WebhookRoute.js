module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-payment-produire-et-expidee',
      handler: 'confirm-payment-produire-et-expidee.confirmPayment',
      config: {
        auth: false,
      },
    }
  ],
};

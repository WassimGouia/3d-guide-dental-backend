module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-payment-bruxisme',
      handler: 'confirm-payment-gouttiere-de-bruxisme.confirmPayment',
      config: {
        auth: false,
      },
    }
  ],
};

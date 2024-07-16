module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-payment-guide-classique',
      handler: 'confirm-payment-guide-classique.confirmPayment',
      config: {
        auth: false,
      },
    }
  ],
};

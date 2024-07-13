module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-payment-rapport-radiologique',
      handler: 'confirm-payment-rapport-radiologique.confirmPayment',
      config: {
        auth: false,
      },
    }
  ],
};

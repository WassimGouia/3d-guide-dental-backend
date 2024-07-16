module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-payment-guide-pour-gingivectomie',
      handler: 'confirm-payment-guide-pour-gingivectomie.confirmPayment',
      config: {
        auth: false,
      },
    }
  ],
};

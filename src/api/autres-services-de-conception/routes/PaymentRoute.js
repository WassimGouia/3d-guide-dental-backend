module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-payment-autre-service',
      handler: 'confirm-payment-autre-service.confirmPayment',
      config: {
        auth: false,
      },
    }
  ],
};

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-payment',
      handler: 'confirm-payment.confirmPayment',
      config: {
        auth: false,
      },
    }
  ],
};

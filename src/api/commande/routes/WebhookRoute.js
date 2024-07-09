module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-payment',
      handler: 'confirm-payment.confirmPayment',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/users/:id/country',
      handler: 'confirm-payment.getCountryByUserId',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

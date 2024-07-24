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
      method: 'POST',
      path: '/sendEmailToNotify',
      handler: 'confirm-payment.sendEmailToNotify',
      config: {
        auth: false,
      },
    }
  ],
};

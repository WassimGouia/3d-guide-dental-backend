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
    ,
    {
      method: 'POST',
      path: '/checkCaseNumber',
      handler: 'confirm-payment-gouttiere-de-bruxisme.checkCaseNumber',
      config: {
        auth: false,
      },
    }
  ],
};

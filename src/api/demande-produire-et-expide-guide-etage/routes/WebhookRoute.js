module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/demande-produire-et-expide-guide-etage',
      handler: 'confirm-payment-demande-produire-et-expide-guide-etage.confirmPayment',
      config: {
        auth: false,
      },
    }
  ],
};

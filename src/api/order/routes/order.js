'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::order.order', {
  only: ['create', 'find', 'findOne'],
  routes: [
    {
      method: 'POST',
      path: '/orders',
      handler: 'order.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/stripe-webhook',
      handler: 'order.handleWebhook',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});

'use strict';

/**
 * guide-classique service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::guide-classique.guide-classique');

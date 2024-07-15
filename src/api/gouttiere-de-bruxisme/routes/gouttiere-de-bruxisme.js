const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter("api::gouttiere-de-bruxisme.gouttiere-de-bruxisme");

const customRoutes = require("./PaymentRoute");

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) {
        routes = innerRouter.routes.concat(extraRoutes);
      }
      return routes;
    },
  };
};

module.exports = customRouter(defaultRouter, customRoutes.routes);

const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter("api::demande-produire-et-expide-guide-etage.demande-produire-et-expide-guide-etage");

const customRoutes = require("./WebhookRoute");

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

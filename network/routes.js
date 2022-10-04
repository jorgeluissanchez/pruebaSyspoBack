const user = require("../components/user/network");
const pdf = require("../components/pdf/network.js");

const notFound = require("../components/notFound/network");

const routes = (app) => {
  app.use("/api/usuario", user);
  app.use("/api/pdf", pdf);
  app.all("/api/*", notFound);
};

module.exports = routes;

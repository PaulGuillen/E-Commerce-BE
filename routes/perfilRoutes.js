const PerfilController = require("../controllers/perfilController");

module.exports = (app) => {
  /*
   * GET  ROUTES
   */
  app.get("/perfil/mainUser", PerfilController.getUser);

};

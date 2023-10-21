const HomeController = require("../controllers/homeController");

module.exports = (app) => {
  /*
   * GET ROUTES
   */
  app.get("/home/mainPromotion", HomeController.mainPromotion);

  app.get("/home/categories", HomeController.categories);

  app.get("/home/products", HomeController.products);

  /*
   * POST ROUTES
   */
  app.post("/home/createProducts", HomeController.createProducts);
};

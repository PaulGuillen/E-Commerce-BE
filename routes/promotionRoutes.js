const PromotionController = require("../controllers/promotionController");

module.exports = (app) => {
  /*
   * GET  ROUTES
   */
  app.get("/promotion/allPromotions", PromotionController.allPromotions);

  /*
   * POST ROUTES
   */
  app.post("/promotion/createPromotions", PromotionController.createPromotions);

  app.post("/promotion/createMainPromotion", PromotionController.createMainPromotion);

  app.post("/image/uploadImage", PromotionController.uploadImage);

  app.post("/category/createCategory", PromotionController.createCategories);

};

const ProductPayedController = require("../controllers/productPayedController");

module.exports = (app) => {
  /*
   * POST ROUTES
   */
  app.post("/payed/productPayed", ProductPayedController.createOrders);

  /*
   * DELETE ROUTES
   */
  app.delete("/order/cleanProducts", ProductPayedController.cleanProductInBag);

  
  /*
   * GET ROUTES
   */
  app.get("/order/allOrders", ProductPayedController.getOrders);

};

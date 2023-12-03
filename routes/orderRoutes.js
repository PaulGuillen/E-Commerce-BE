const OrderController = require("../controllers/orderController");

module.exports = (app) => {
  /*
   * POST ROUTES
   */
  app.post("/order/orderInBag", OrderController.productInBag);

  /*
   * GET ROUTES
   */
  app.get("/order/allOrdersInBag", OrderController.getProductsInBag);
  app.get("/order/allOrdersPayed", OrderController.getOrdersPayed);
  app.get("/order/allOrdersAdminRole", OrderController.allOrdersAdminRole);
  /*
   * DELETE ROUTES
   */
  app.delete("/order/deleteProductInBag", OrderController.deleteProductInBag);

  /*
 * DELETE ROUTES
 */
  app.put("/order/updateProductInBag", OrderController.updateProductsInBag);
};

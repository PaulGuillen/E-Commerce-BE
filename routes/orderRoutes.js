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

  /*
   * DELETE ROUTES
   */
  app.delete("/order/deleteProductInBag", OrderController.deleteProductInBag);

    /*
   * DELETE ROUTES
   */
    app.put("/order/updateProductInBag", OrderController.updateProductsInBag);
};

const PaymentController = require("../controllers/paymentController");

module.exports = (app) => {
  /*
   * POST  ROUTES
   */
  app.post("/payment/tokenCard", PaymentController.tokenCard);
  app.post("/payment/paying", PaymentController.payment);

};
